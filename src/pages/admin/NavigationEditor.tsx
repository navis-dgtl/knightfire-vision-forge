import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortableList } from "@/components/admin/SortableList";
import {
  buildNavTree,
  type NavItem,
  type NavNode,
  useAllNavItems,
  useDeleteNavItem,
  useReorderNavItems,
  useSaveNavItem,
} from "@/lib/navigation";
import { useAllPages } from "@/lib/pages";

interface FormState {
  label: string;
  url: string;
  page_id: string;
  parent_id: string;
  is_visible: boolean;
  opens_new_tab: boolean;
}

const EMPTY: FormState = {
  label: "",
  url: "",
  page_id: "",
  parent_id: "",
  is_visible: true,
  opens_new_tab: false,
};

const NONE = "__none__";

export default function NavigationEditor() {
  const { data: rawItems = [], isLoading } = useAllNavItems("header");
  const { data: pages = [] } = useAllPages();
  const save = useSaveNavItem();
  const remove = useDeleteNavItem();
  const reorder = useReorderNavItems();

  const tree = useMemo(() => buildNavTree(rawItems), [rawItems]);
  const [openParents, setOpenParents] = useState<Set<string>>(() => {
    return new Set(tree.filter((n) => n.children.length > 0).map((n) => n.id));
  });

  const [editing, setEditing] = useState<{ item?: NavItem; parentId: string | null } | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<NavItem | null>(null);

  const togglePart = (id: string) =>
    setOpenParents((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const reorderSiblings = (parentId: string | null, ordered: NavNode[]) => {
    reorder.mutate(
      ordered.map((node, index) => ({
        id: node.id,
        parent_id: parentId,
        sort_order: index,
      })),
    );
  };

  const toggleVisible = (item: NavItem) =>
    save.mutate({ id: item.id, values: { is_visible: !item.is_visible } });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Item deleted. Any child items were removed with it.");
    } catch {
      toast.error("Could not delete item.");
    } finally {
      setPendingDelete(null);
    }
  };

  const renderNode = (node: NavNode, depth: number, parentId: string | null) => {
    const hasChildren = node.children.length > 0;
    const isOpen = openParents.has(node.id);
    const linkTarget = node.page_id
      ? pages.find((p) => p.id === node.page_id)?.title
        ? `Page: ${pages.find((p) => p.id === node.page_id)!.title}`
        : "Page (deleted)"
      : node.url || "(no link)";
    return (
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 bg-card border rounded-lg p-2.5"
          style={{ marginLeft: depth > 0 ? 24 : 0 }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => togglePart(node.id)}
              className="p-1 -ml-1 rounded hover:bg-muted text-muted-foreground"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{node.label}</span>
              {!node.is_visible && (
                <span className="text-xs text-muted-foreground">(hidden)</span>
              )}
              {node.opens_new_tab && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate">{linkTarget}</div>
          </div>
          {depth === 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing({ parentId: node.id })}
              aria-label="Add child"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleVisible(node)}
            aria-label={node.is_visible ? "Hide" : "Show"}
          >
            {node.is_visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing({ item: node, parentId })}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPendingDelete(node)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        {hasChildren && isOpen && (
          <div className="space-y-2">
            <SortableList
              items={node.children}
              onReorder={(next) => reorderSiblings(node.id, next)}
              renderItem={(child, handle) => (
                <div className="flex items-center gap-2" style={{ marginLeft: 24 }}>
                  {handle}
                  <div className="flex-1 min-w-0">{renderNode(child, depth + 1, node.id)}</div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Header Navigation</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Drag rows to reorder. Click the chevron to expand a submenu. Children
            of a top-level item appear as a dropdown on the public site.
          </p>
        </div>
        <Button onClick={() => setEditing({ parentId: null })}>
          <Plus className="h-4 w-4 mr-2" />
          New item
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : tree.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">
            No navigation items yet. The public site is using the default hardcoded nav.
          </p>
          <Button onClick={() => setEditing({ parentId: null })}>
            <Plus className="h-4 w-4 mr-2" />
            Add first item
          </Button>
        </div>
      ) : (
        <SortableList
          items={tree}
          onReorder={(next) => reorderSiblings(null, next)}
          renderItem={(node, handle) => (
            <div className="flex items-start gap-2">
              <div className="pt-3">{handle}</div>
              <div className="flex-1">{renderNode(node, 0, null)}</div>
            </div>
          )}
        />
      )}

      <NavItemDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        item={editing?.item}
        defaultParentId={editing?.parentId ?? null}
        pages={pages}
        topLevelItems={tree}
        onSave={async (values) => {
          await save.mutateAsync({ id: editing?.item?.id, values });
          setEditing(null);
        }}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this nav item?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.label}" will be removed.
              {(pendingDelete && rawItems.some((r) => r.parent_id === pendingDelete.id)) && (
                <span className="block mt-2 font-medium text-destructive">
                  Its sub-items will be deleted too.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface NavItemDialogProps {
  open: boolean;
  onClose: () => void;
  item?: NavItem;
  defaultParentId: string | null;
  pages: Array<{ id: string; title: string; slug: string }>;
  topLevelItems: NavNode[];
  onSave: (values: {
    label: string;
    url: string | null;
    page_id: string | null;
    parent_id: string | null;
    is_visible: boolean;
    opens_new_tab: boolean;
    location: string;
  }) => Promise<void>;
}

function NavItemDialog({
  open,
  onClose,
  item,
  defaultParentId,
  pages,
  topLevelItems,
  onSave,
}: NavItemDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({
        label: item.label,
        url: item.url ?? "",
        page_id: item.page_id ?? "",
        parent_id: item.parent_id ?? "",
        is_visible: item.is_visible,
        opens_new_tab: item.opens_new_tab,
      });
    } else {
      setForm({ ...EMPTY, parent_id: defaultParentId ?? "" });
    }
  }, [open, item, defaultParentId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    if (!form.label.trim()) {
      toast.error("Label is required.");
      return;
    }
    if (!form.url && !form.page_id) {
      toast.error("Either a URL or a linked page is required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        label: form.label.trim(),
        url: form.page_id ? null : form.url || null,
        page_id: form.page_id || null,
        parent_id: form.parent_id || null,
        is_visible: form.is_visible,
        opens_new_tab: form.opens_new_tab,
        location: "header",
      });
      toast.success(item ? "Nav item updated." : "Nav item added.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit nav item" : "New nav item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              placeholder="Events"
            />
          </div>

          <div>
            <Label htmlFor="page_id">Link to custom page</Label>
            <Select
              value={form.page_id || NONE}
              onValueChange={(v) => update("page_id", v === NONE ? "" : v)}
            >
              <SelectTrigger id="page_id">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None — use URL instead</SelectItem>
                {pages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} ({p.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!form.page_id && (
            <div>
              <Label htmlFor="url">…or URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="/contact or https://…"
              />
            </div>
          )}

          <div>
            <Label htmlFor="parent_id">Parent (for nested items)</Label>
            <Select
              value={form.parent_id || NONE}
              onValueChange={(v) => update("parent_id", v === NONE ? "" : v)}
            >
              <SelectTrigger id="parent_id">
                <SelectValue placeholder="Top level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Top level</SelectItem>
                {topLevelItems
                  .filter((n) => n.id !== item?.id)
                  .map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      Under: {n.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Label htmlFor="is_visible" className="cursor-pointer">
              Visible on site
            </Label>
            <Switch
              id="is_visible"
              checked={form.is_visible}
              onCheckedChange={(v) => update("is_visible", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="opens_new_tab" className="cursor-pointer">
              Open in new tab
            </Label>
            <Switch
              id="opens_new_tab"
              checked={form.opens_new_tab}
              onCheckedChange={(v) => update("opens_new_tab", v)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

