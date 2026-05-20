import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type HeroSlide = Tables<"hero_slides">;

/** Active slides ordered by sort_order. Used by the public HeroCarousel. */
export function useActiveHeroSlides() {
  return useQuery({
    queryKey: ["hero_slides", "active"],
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}

/** Every slide including inactive, for the admin list. */
export function useAllHeroSlides() {
  return useQuery({
    queryKey: ["hero_slides", "all"],
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useHeroSlide(id: string | undefined) {
  return useQuery({
    queryKey: ["hero_slides", "id", id],
    enabled: !!id && id !== "new",
    queryFn: async (): Promise<HeroSlide | null> => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; values: TablesInsert<"hero_slides"> }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from("hero_slides")
          .update(input.values as TablesUpdate<"hero_slides">)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("hero_slides")
        .insert(input.values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero_slides"] }),
  });
}

export function useDeleteHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero_slides"] }),
  });
}

export function useReorderHeroSlides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase.from("hero_slides").update({ sort_order: index }).eq("id", id),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero_slides"] }),
  });
}
