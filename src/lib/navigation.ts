import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type NavItem = Tables<"nav_items">;
export type NavLocation = "header" | "footer";

export interface NavNode extends NavItem {
  children: NavNode[];
}

/**
 * Builds a parent/child tree from a flat nav_items array. Children come back
 * sorted by sort_order. Orphans (parent_id points at a missing row) become
 * top-level so an admin can find and re-link them.
 */
export function buildNavTree(items: NavItem[]): NavNode[] {
  const byId = new Map<string, NavNode>();
  items.forEach((item) => byId.set(item.id, { ...item, children: [] }));
  const roots: NavNode[] = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortByOrder = (a: NavNode, b: NavNode) => a.sort_order - b.sort_order;
  roots.sort(sortByOrder);
  byId.forEach((node) => node.children.sort(sortByOrder));
  return roots;
}

/** Public-facing nav for a given location — only visible items. */
export function usePublicNav(location: NavLocation) {
  return useQuery({
    queryKey: ["nav_items", "public", location],
    queryFn: async (): Promise<NavNode[]> => {
      const { data, error } = await supabase
        .from("nav_items")
        .select("*")
        .eq("location", location)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return buildNavTree(data ?? []);
    },
    staleTime: 60_000,
  });
}

/** All nav items including hidden ones, for the admin editor. */
export function useAllNavItems(location?: NavLocation) {
  return useQuery({
    queryKey: ["nav_items", "all", location ?? "any"],
    queryFn: async (): Promise<NavItem[]> => {
      let query = supabase
        .from("nav_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (location) query = query.eq("location", location);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNavItem(id: string | undefined) {
  return useQuery({
    queryKey: ["nav_items", "id", id],
    enabled: !!id && id !== "new",
    queryFn: async (): Promise<NavItem | null> => {
      const { data, error } = await supabase
        .from("nav_items")
        .select("*")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveNavItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; values: TablesInsert<"nav_items"> }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from("nav_items")
          .update(input.values as TablesUpdate<"nav_items">)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("nav_items")
        .insert(input.values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nav_items"] }),
  });
}

export function useDeleteNavItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // The DB cascade-deletes children via ON DELETE CASCADE on parent_id.
      const { error } = await supabase.from("nav_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nav_items"] }),
  });
}

/**
 * Persists a new ordering / parenting for nav items. Takes an array of
 * { id, parent_id, sort_order } so the admin can both reorder and re-nest
 * in one drag operation.
 */
export function useReorderNavItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      updates: Array<{ id: string; parent_id: string | null; sort_order: number }>,
    ) => {
      await Promise.all(
        updates.map(({ id, parent_id, sort_order }) =>
          supabase
            .from("nav_items")
            .update({ parent_id, sort_order })
            .eq("id", id),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nav_items"] }),
  });
}
