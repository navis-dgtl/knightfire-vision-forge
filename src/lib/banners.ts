import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Banner = Tables<"announcement_banners">;

/**
 * The single active banner to render site-wide, or null. Picks the one with
 * the lowest `sort_order` among rows that pass the schedule + is_active filter.
 * RLS already filters by schedule for `anon`, but we re-check client-side as
 * belt-and-suspenders for cached results that may straddle the start/end time.
 */
export function useActiveBanner() {
  return useQuery({
    queryKey: ["banners", "active"],
    queryFn: async (): Promise<Banner | null> => {
      const { data, error } = await supabase
        .from("announcement_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const now = Date.now();
      const row = (data ?? []).find((b) => {
        const starts = b.starts_at ? Date.parse(b.starts_at) : -Infinity;
        const ends = b.ends_at ? Date.parse(b.ends_at) : Infinity;
        return starts <= now && now < ends;
      });
      return row ?? null;
    },
    staleTime: 60_000,
  });
}

/** Every banner including inactive ones, for the admin list. */
export function useAllBanners() {
  return useQuery({
    queryKey: ["banners", "all"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error } = await supabase
        .from("announcement_banners")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBanner(id: string | undefined) {
  return useQuery({
    queryKey: ["banners", "id", id],
    enabled: !!id && id !== "new",
    queryFn: async (): Promise<Banner | null> => {
      const { data, error } = await supabase
        .from("announcement_banners")
        .select("*")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; values: TablesInsert<"announcement_banners"> }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from("announcement_banners")
          .update(input.values as TablesUpdate<"announcement_banners">)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("announcement_banners")
        .insert(input.values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcement_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

/**
 * Persists a new ordering. Sends one UPDATE per row; safe given v1 is
 * expected to have a handful of banners at most.
 */
export function useReorderBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from("announcement_banners")
            .update({ sort_order: index })
            .eq("id", id),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}
