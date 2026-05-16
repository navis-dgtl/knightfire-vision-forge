import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;
export type PostType = Post["type"];
export type PostStatus = Post["status"];

export const POST_TYPES: PostType[] = ["article", "news", "video", "publication"];

export const POST_TYPE_LABELS: Record<PostType, string> = {
  article: "Article",
  news: "Press Release",
  video: "Video",
  publication: "Publication",
};

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

/**
 * PostgREST filter matching posts the public may see: anything published, plus
 * scheduled posts whose time has already passed (covers the brief window
 * before the auto-publish cron job flips their status).
 */
function publicVisibleFilter(): string {
  const now = new Date().toISOString();
  return `status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`;
}

/** Turns a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Converts a YouTube or Vimeo URL into an embeddable iframe src, or null if unrecognized. */
export function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/**
 * Returns a slug derived from `base` that no other post uses.
 * Appends -2, -3, … on collision.
 */
export async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let suffix = 1;

  while (true) {
    let query = supabase.from("posts").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

/** Live posts, newest first — for the public /publications page. */
export function usePublishedPosts() {
  return useQuery({
    queryKey: ["posts", "published"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(publicVisibleFilter())
        .order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** A single live post by slug — for the public /publications/:slug page. */
export function usePublishedPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["posts", "slug", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug as string)
        .or(publicVisibleFilter())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/** Every post including drafts, newest-edited first — for the admin list. */
export function useAllPosts() {
  return useQuery({
    queryKey: ["posts", "all"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** A single post by id — for the admin editor. */
export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", "id", id],
    enabled: !!id && id !== "new",
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/** Creates a new post or updates an existing one. */
export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id?: string;
      values: TablesInsert<"posts">;
    }): Promise<Post> => {
      if (input.id) {
        const { data, error } = await supabase
          .from("posts")
          .update(input.values as TablesUpdate<"posts">)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("posts")
        .insert(input.values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}

/** Permanently deletes a post. */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}
