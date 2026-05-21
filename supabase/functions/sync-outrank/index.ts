// Outrank → Publications sync.
//
// Imports articles from the Outrank API (https://outrank.so/api/agent/v1) into
// public.posts, marking each as published so they appear immediately on the
// /publications page. Re-running is safe — every import upserts on
// (external_source, external_id), so an article is created on first sight and
// updated on every later sync.
//
// Auth: callers must be either
//   (a) a signed-in Ktek admin (the in-app "Sync from Outrank" button), or
//   (b) the Supabase service role (the daily pg_cron job).
//
// Required secrets (Supabase project → Edge Functions → sync-outrank → Secrets):
//   - OUTRANK_API_KEY : an Outrank org-admin API key (prefix `outr_live_`)
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected by
// the Supabase platform.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const OUTRANK_BASE_URL = "https://outrank.so/api/agent/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Lowercase, hyphenated, URL-safe slug. */
function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** ISO date for "midnight UTC, yesterday" and "midnight UTC, today". */
function yesterdayRangeUTC(): { fromIso: string; toIso: string } {
  const now = new Date();
  const startToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const startYesterday = new Date(startToday.getTime() - 24 * 60 * 60 * 1000);
  return { fromIso: startYesterday.toISOString(), toIso: startToday.toISOString() };
}

/** Picks the first non-empty string property from `obj` matching any name. */
function pick(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Returns the value at the first matching key, of any type, or null. */
function pickAny(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (k in obj && obj[k] != null) return obj[k];
  }
  return null;
}

type OutrankArticle = Record<string, unknown>;

/** Fetch every article from Outrank, following pagination if present. */
async function fetchAllOutrankArticles(
  apiKey: string,
  params: Record<string, string> = {},
): Promise<OutrankArticle[]> {
  const results: OutrankArticle[] = [];
  const pageSize = 100;
  let page = 1;
  // Safety cap: 50 pages × 100 = 5,000 articles. Plenty of headroom.
  const maxPages = 50;

  while (page <= maxPages) {
    const qs = new URLSearchParams({
      ...params,
      page: String(page),
      per_page: String(pageSize),
      limit: String(pageSize),
    });
    const res = await fetch(`${OUTRANK_BASE_URL}/articles?${qs.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 600);
      throw new Error(
        `Outrank GET /articles failed (HTTP ${res.status}). ${detail}`,
      );
    }
    const payload = (await res.json()) as unknown;
    // Outrank may return either a bare array or { data: [...] } / { articles: [...] }.
    const list: OutrankArticle[] = Array.isArray(payload)
      ? (payload as OutrankArticle[])
      : Array.isArray((payload as Record<string, unknown>).data)
        ? ((payload as Record<string, unknown>).data as OutrankArticle[])
        : Array.isArray((payload as Record<string, unknown>).articles)
          ? ((payload as Record<string, unknown>).articles as OutrankArticle[])
          : Array.isArray((payload as Record<string, unknown>).results)
            ? ((payload as Record<string, unknown>).results as OutrankArticle[])
            : [];
    results.push(...list);
    if (list.length < pageSize) break;
    page += 1;
  }
  return results;
}

/** Fetch the full HTML body for one article (the list endpoint often omits it). */
async function fetchArticleContent(
  apiKey: string,
  id: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${OUTRANK_BASE_URL}/articles/${id}/content`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const data = (await res.json()) as Record<string, unknown>;
      return (
        pick(data, ["content", "html", "body", "article_html"]) ??
        (typeof data.data === "object" && data.data
          ? pick(data.data as Record<string, unknown>, [
              "content",
              "html",
              "body",
            ])
          : null)
      );
    }
    return (await res.text()) || null;
  } catch {
    return null;
  }
}

/**
 * Returns a slug not already used by another row in `posts`.
 * If the row that owns the colliding slug is the same Outrank article we are
 * about to update, that slug is returned unchanged.
 */
async function uniqueSlug(
  admin: ReturnType<typeof createClient>,
  base: string,
  outrankId: string,
): Promise<string> {
  const root = slugify(base) || "outrank-article";
  let candidate = root;
  let suffix = 1;
  while (true) {
    const { data, error } = await admin
      .from("posts")
      .select("id, external_source, external_id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw error;
    if (
      !data ||
      (data.external_source === "outrank" && data.external_id === outrankId)
    ) {
      return candidate;
    }
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

interface SyncResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: { id: string; message: string }[];
}

async function syncArticles(
  admin: ReturnType<typeof createClient>,
  apiKey: string,
  mode: "backfill" | "daily",
): Promise<SyncResult> {
  const params: Record<string, string> = {};
  if (mode === "daily") {
    const { fromIso, toIso } = yesterdayRangeUTC();
    // Outrank's filter param names aren't officially documented for date
    // windows; we pass several common conventions so the right one wins.
    params.from = fromIso;
    params.to = toIso;
    params.created_after = fromIso;
    params.created_before = toIso;
  }

  const articles = await fetchAllOutrankArticles(apiKey, params);
  const result: SyncResult = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  // Belt-and-suspenders date filter for the daily run, in case Outrank
  // ignored the query-string filters above.
  let dateFilter: ((iso: string | null) => boolean) | null = null;
  if (mode === "daily") {
    const { fromIso, toIso } = yesterdayRangeUTC();
    const from = Date.parse(fromIso);
    const to = Date.parse(toIso);
    dateFilter = (iso) => {
      if (!iso) return false;
      const t = Date.parse(iso);
      return Number.isFinite(t) && t >= from && t < to;
    };
  }

  for (const article of articles) {
    const id = pick(article, ["id", "uuid", "_id", "article_id"]);
    if (!id) {
      result.skipped += 1;
      continue;
    }

    const title =
      pick(article, ["title", "name", "headline"]) ?? "Untitled article";
    const excerpt = pick(article, [
      "excerpt",
      "summary",
      "description",
      "meta_description",
    ]);
    const featuredImage = pick(article, [
      "featured_image_url",
      "cover_image_url",
      "cover_image",
      "image_url",
      "image",
      "thumbnail_url",
    ]);
    const baseSlug =
      pick(article, ["slug", "permalink", "url_slug"]) ?? slugify(title);
    const publishedAt =
      pick(article, [
        "published_at",
        "publish_date",
        "publishedAt",
        "date_published",
      ]) ?? pick(article, ["created_at", "createdAt"]);

    if (dateFilter && !dateFilter(publishedAt)) {
      result.skipped += 1;
      continue;
    }

    let body =
      pick(article, ["content", "html", "body", "article_html"]) ?? null;
    if (!body) {
      body = await fetchArticleContent(apiKey, id);
    }

    let slug: string;
    try {
      slug = await uniqueSlug(admin, baseSlug, id);
    } catch (e) {
      result.errors.push({ id, message: `slug check failed: ${String(e)}` });
      continue;
    }

    // Look up any existing import so we can decide insert vs. update and
    // preserve manual edits where appropriate.
    const { data: existing, error: existingErr } = await admin
      .from("posts")
      .select("id")
      .eq("external_source", "outrank")
      .eq("external_id", id)
      .maybeSingle();
    if (existingErr) {
      result.errors.push({ id, message: existingErr.message });
      continue;
    }

    const values = {
      type: "article" as const,
      title,
      slug,
      excerpt,
      body,
      featured_image_url: featuredImage,
      status: "published" as const,
      published_at: publishedAt ?? new Date().toISOString(),
      external_source: "outrank",
      external_id: id,
    };

    if (existing) {
      const { error: updateErr } = await admin
        .from("posts")
        .update(values)
        .eq("id", existing.id);
      if (updateErr) {
        result.errors.push({ id, message: updateErr.message });
        continue;
      }
      result.updated += 1;
    } else {
      const { error: insertErr } = await admin.from("posts").insert(values);
      if (insertErr) {
        result.errors.push({ id, message: insertErr.message });
        continue;
      }
      result.imported += 1;
    }
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const outrankApiKey = Deno.env.get("OUTRANK_API_KEY");
  if (!outrankApiKey) {
    return json(
      {
        error:
          "The Outrank API key is not configured. Add an OUTRANK_API_KEY secret to this Supabase project (Edge Functions → sync-outrank → Secrets).",
      },
      500,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authHeader = req.headers.get("Authorization") ?? "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");

  // Two acceptable callers:
  //   1) the daily pg_cron job, which presents the service-role JWT.
  //   2) a signed-in Ktek admin pressing "Sync from Outrank" in the UI.
  const isServiceRole = bearer && bearer === serviceKey;

  if (!isServiceRole) {
    if (!authHeader) {
      return json({ error: "Missing authorization." }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return json({ error: "You must be signed in." }, 401);
    }
    const { data: adminRole } = await userClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRole) {
      return json({ error: "Admin access is required." }, 403);
    }
  }

  let payload: { mode?: string };
  try {
    payload = req.headers.get("content-length") === "0" ? {} : await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const mode = (payload.mode ?? "daily") as "backfill" | "daily";
  if (mode !== "backfill" && mode !== "daily") {
    return json({ error: "mode must be 'backfill' or 'daily'." }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  try {
    const result = await syncArticles(admin, outrankApiKey, mode);
    return json({ mode, ...result });
  } catch (e) {
    return json(
      { error: "Outrank sync failed.", detail: String(e) },
      502,
    );
  }
});
