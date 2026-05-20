import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface SiteSetting {
  key: string;
  value: Json;
  updated_at: string;
}

/** All site_settings rows for the admin editor. */
export function useAllSettings() {
  return useQuery({
    queryKey: ["site_settings", "all"],
    queryFn: async (): Promise<SiteSetting[]> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("key", { ascending: true });
      if (error) throw error;
      return (data ?? []) as SiteSetting[];
    },
  });
}

/** A single setting by key. Returns the JSON value, typed as caller specifies. */
export function useSetting<T extends Json = Json>(key: string) {
  return useQuery({
    queryKey: ["site_settings", "key", key],
    queryFn: async (): Promise<T | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return (data?.value as T) ?? null;
    },
    staleTime: 60_000,
  });
}

/**
 * Upserts a setting by key. Existing keys are updated; new keys are inserted.
 * Returns the resulting row.
 */
export function useSaveSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { key: string; value: Json }) => {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ key: input.key, value: input.value }, { onConflict: "key" })
        .select()
        .single();
      if (error) throw error;
      return data as SiteSetting;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}

export function useDeleteSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase.from("site_settings").delete().eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}
