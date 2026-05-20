import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { Block } from "./blocks";

export type Page = Tables<"pages">;
export type PageStatus = Page["status"];

export const PAGE_STATUS_LABELS: Record<PageStatus, string> = {
  draft: "Draft",
  published: "Published",
};

/**
 * Slugs that the React Router config already owns. A page saved under one of
 * these would be unreachable, so we reject at save time and refuse to render
 * even if a row somehow exists.
 */
export const RESERVED_SLUGS = new Set([
  "admin",
  "auth",
  "signup",
  "products",
  "publications",
  "industries",
  "about",
  "distributors",
  "contact",
  "rsvp-mesquite",
]);

/** Turns a title into a URL-safe slug. Mirrors lib/posts.slugify intentionally. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type SlugValidation =
  | { ok: true }
  | { ok: false; reason: string };

export function validateSlug(slug: string): SlugValidation {
  if (!slug) return { ok: false, reason: "Slug is required." };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { ok: false, reason: "Use lowercase letters, numbers, and hyphens only." };
  }
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { ok: false, reason: "Slug cannot start or end with a hyphen." };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, reason: `"${slug}" is reserved by the site.` };
  }
  if (slug.startsWith("products/")) {
    return { ok: false, reason: "Slugs under products/ are reserved." };
  }
  return { ok: true };
}

/**
 * Returns a slug derived from `base` that no other page uses.
 * Appends -2, -3, … on collision. Skips reserved slugs entirely.
 */
export async function uniquePageSlug(base: string, excludeId?: string): Promise<string> {
  let root = slugify(base) || "page";
  if (RESERVED_SLUGS.has(root)) root = `${root}-page`;
  let candidate = root;
  // bounded loop — collisions in practice will be 0-2; suffix grows until free
  for (let suffix = 1; ; suffix += 1) {
    let query = supabase.from("pages").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${root}-${suffix + 1}`;
  }
}

/** A single published page by slug — for the public /:slug route. */
export function usePublishedPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["pages", "slug", slug],
    enabled: !!slug && !RESERVED_SLUGS.has(slug),
    queryFn: async (): Promise<Page | null> => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug as string)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/** Every page including drafts, newest-edited first — for the admin list. */
export function useAllPages() {
  return useQuery({
    queryKey: ["pages", "all"],
    queryFn: async (): Promise<Page[]> => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePage(id: string | undefined) {
  return useQuery({
    queryKey: ["pages", "id", id],
    enabled: !!id && id !== "new",
    queryFn: async (): Promise<Page | null> => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSavePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; values: TablesInsert<"pages"> }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from("pages")
          .update(input.values as TablesUpdate<"pages">)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("pages")
        .insert(input.values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pages"] }),
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pages"] }),
  });
}

/** Convenience: extract the typed blocks array from a `Page` row. */
export function pageBlocks(page: Pick<Page, "blocks">): Block[] {
  // Caller is expected to have already validated. For defensive rendering,
  // use parseBlocks from lib/blocks.
  return (page.blocks as unknown as Block[]) ?? [];
}
