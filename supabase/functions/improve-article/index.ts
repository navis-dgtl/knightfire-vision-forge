// AI writing assistant for the publications system.
//
// Two modes:
//   - "write"   : draft a complete article body from a title + brief
//   - "rewrite" : improve/rewrite the post's existing body
//
// Each post may use AI at most AI_USE_LIMIT times. The limit is enforced
// server-side (clients cannot be trusted) via the consume_ai_use() RPC.
//
// Required secrets (Supabase project -> Edge Functions -> Secrets):
//   - OPENAI_API_KEY  : your OpenAI key
//   - OPENAI_MODEL    : optional, overrides the default model id
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected
// automatically by the Supabase platform.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const AI_USE_LIMIT = 5;
const DEFAULT_MODEL = "gpt-5.4-mini";

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

const SYSTEM_PROMPT = `You are an expert editorial writer for KnightTek / KnightFire, a fire-safety technology company specializing in lithium-ion battery fire suppression.
You help site admins draft and polish posts for the company's public publications page.
Always return clean, semantic HTML suitable for a rich-text editor: use <p>, <h2>, <h3>, <ul>/<ol> with <li>, <blockquote>, <strong> and <em>.
Do NOT include <html>, <head>, <body> tags, markdown, or code fences. Return only the article body HTML.
Keep the tone professional, accurate and factual. Never invent statistics, certifications or quotes.`;

/** Removes a leading/trailing markdown code fence if the model added one. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:html)?\s*\n([\s\S]*?)\n```$/i);
  return (fence ? fence[1] : trimmed).trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    return json(
      {
        error:
          "The OpenAI API key is not configured. Add an OPENAI_API_KEY secret to this Supabase project.",
      },
      500,
    );
  }
  const model = Deno.env.get("OPENAI_MODEL") ?? DEFAULT_MODEL;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing authorization." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Identify the caller from their JWT.
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

  // Only admins may use AI assistance.
  const { data: adminRole } = await userClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!adminRole) {
    return json({ error: "Admin access is required." }, 403);
  }

  // Parse + validate the request.
  let payload: { postId?: string; mode?: string; instructions?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const { postId, mode } = payload;
  const instructions = (payload.instructions ?? "").trim();
  if (!postId || (mode !== "write" && mode !== "rewrite")) {
    return json({ error: "A postId and a valid mode are required." }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: post, error: postError } = await admin
    .from("posts")
    .select("id, title, body, excerpt, ai_uses")
    .eq("id", postId)
    .maybeSingle();
  if (postError || !post) {
    return json({ error: "Post not found." }, 404);
  }

  const usedSoFar = post.ai_uses ?? 0;
  if (usedSoFar >= AI_USE_LIMIT) {
    return json(
      {
        error: `This post has reached its limit of ${AI_USE_LIMIT} AI uses.`,
        aiUses: usedSoFar,
        remaining: 0,
        limit: AI_USE_LIMIT,
      },
      429,
    );
  }

  if (mode === "rewrite" && !post.body) {
    return json(
      { error: "There is no content to improve yet. Write something first." },
      400,
    );
  }

  const userPrompt =
    mode === "write"
      ? [
          "Write a complete, publication-ready post body.",
          `Working title: ${post.title || "(untitled)"}`,
          post.excerpt ? `Summary/excerpt: ${post.excerpt}` : "",
          instructions ? `\nWriting brief from the author:\n${instructions}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : [
          "Rewrite and improve the post body below. Preserve the author's intent",
          "and every factual claim; improve clarity, flow, grammar and structure.",
          instructions
            ? `\nExtra instructions from the author:\n${instructions}`
            : "",
          `\nCurrent body HTML:\n${post.body}`,
        ]
          .filter(Boolean)
          .join("\n");

  // Call OpenAI.
  let openaiRes: Response;
  try {
    openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_completion_tokens: 6000,
      }),
    });
  } catch (e) {
    return json(
      { error: "Could not reach OpenAI.", detail: String(e) },
      502,
    );
  }

  if (!openaiRes.ok) {
    const detail = (await openaiRes.text()).slice(0, 600);
    return json(
      {
        error: `OpenAI request failed (HTTP ${openaiRes.status}). Check that the model "${model}" exists and that the API key is valid.`,
        detail,
      },
      502,
    );
  }

  const completion = await openaiRes.json();
  const raw: string = completion?.choices?.[0]?.message?.content ?? "";
  const content = stripCodeFence(raw);
  if (!content) {
    return json({ error: "OpenAI returned an empty response." }, 502);
  }

  // Consume one AI use — atomic, so the cap cannot be exceeded by racing calls.
  const { data: newCount, error: rpcError } = await admin.rpc("consume_ai_use", {
    p_post_id: postId,
    p_limit: AI_USE_LIMIT,
  });
  if (rpcError || newCount === null || newCount === undefined) {
    return json(
      {
        error: `This post has reached its limit of ${AI_USE_LIMIT} AI uses.`,
        aiUses: AI_USE_LIMIT,
        remaining: 0,
        limit: AI_USE_LIMIT,
      },
      429,
    );
  }

  return json({
    content,
    mode,
    aiUses: newCount,
    remaining: Math.max(0, AI_USE_LIMIT - newCount),
    limit: AI_USE_LIMIT,
  });
});
