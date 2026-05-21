import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  ExternalLink,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SortableList } from "@/components/admin/SortableList";
import { BlockEditor } from "@/components/blocks/BlockEditor";
import { BlocksRenderer } from "@/components/blocks/BlockRenderer";
import {
  BLOCK_LABELS,
  BLOCK_TYPES,
  createBlock,
  parseBlocks,
  validateBlocks,
  type Block,
  type BlockType,
} from "@/lib/blocks";
import {
  slugify,
  uniquePageSlug,
  usePage,
  useSavePage,
  validateSlug,
} from "@/lib/pages";
import { useSaveNavItem } from "@/lib/navigation";
import type { Json } from "@/integrations/supabase/types";

interface FormState {
  title: string;
  slug: string;
  blocks: Block[];
  seo_title: string;
  seo_description: string;
}

const EMPTY: FormState = {
  title: "",
  slug: "",
  blocks: [],
  seo_title: "",
  seo_description: "",
};

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { data: existing, isLoading } = usePage(id);
  const save = useSavePage();
  const saveNavItem = useSaveNavItem();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [showAddToNav, setShowAddToNav] = useState<{ pageId: string; slug: string; title: string } | null>(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        blocks: parseBlocks(existing.blocks),
        seo_title: existing.seo_title ?? "",
        seo_description: existing.seo_description ?? "",
      });
      setSlugTouched(true);
    }
  }, [existing]);

  // Auto-derive slug from title on new pages until admin manually edits it.
  useEffect(() => {
    if (!slugTouched && isNew) {
      setForm((s) => ({ ...s, slug: slugify(s.title) }));
    }
  }, [form.title, slugTouched, isNew]);

  // Live slug validation as the user types.
  useEffect(() => {
    if (!form.slug) {
      setSlugError(null);
      return;
    }
    const result = validateSlug(form.slug);
    setSlugError(result.ok === true ? null : (result as { ok: false; reason: string }).reason);
  }, [form.slug]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const addBlock = (type: BlockType) => {
    update("blocks", [...form.blocks, createBlock(type)]);
  };

  const updateBlock = (id: string, next: Block) => {
    update(
      "blocks",
      form.blocks.map((b) => (b.id === id ? next : b)),
    );
  };

  const removeBlock = (id: string) => {
    update("blocks", form.blocks.filter((b) => b.id !== id));
  };

  const doSave = async (status: "draft" | "published"): Promise<{ id: string; slug: string } | null> => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return null;
    }
    if (slugError) {
      toast.error(slugError);
      return null;
    }
    let validatedBlocks: Block[];
    try {
      validatedBlocks = validateBlocks(form.blocks);
    } catch (err) {
      toast.error(err instanceof Error ? `Block error: ${err.message}` : "Invalid blocks.");
      return null;
    }
    // Make sure the slug is unique (skip the check if it didn't change).
    let finalSlug = form.slug || slugify(form.title);
    if (!existing || existing.slug !== finalSlug) {
      finalSlug = await uniquePageSlug(finalSlug, existing?.id);
    }
    try {
      const saved = await save.mutateAsync({
        id: existing?.id,
        values: {
          title: form.title.trim(),
          slug: finalSlug,
          blocks: validatedBlocks as unknown as Json,
          seo_title: form.seo_title || null,
          seo_description: form.seo_description || null,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
        },
      });
      toast.success(status === "published" ? "Page published." : "Draft saved.");
      return { id: saved.id, slug: saved.slug };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
      return null;
    }
  };

  const handleSaveDraft = async () => {
    const result = await doSave("draft");
    if (result && isNew) {
      navigate(`/admin/pages/${result.id}`);
    }
  };

  const handlePublish = async () => {
    const wasUnpublished = !existing || existing.status !== "published";
    const result = await doSave("published");
    if (result && wasUnpublished) {
      setShowAddToNav({ pageId: result.id, slug: result.slug, title: form.title.trim() });
    } else if (result && isNew) {
      navigate(`/admin/pages/${result.id}`);
    }
  };

  const handleAddToNav = async () => {
    if (!showAddToNav) return;
    try {
      await saveNavItem.mutateAsync({
        values: {
          label: showAddToNav.title,
          page_id: showAddToNav.pageId,
          url: null,
          parent_id: null,
          is_visible: true,
          opens_new_tab: false,
          location: "header",
          sort_order: 999,
        },
      });
      toast.success(`"${showAddToNav.title}" added to the header nav.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add to nav.");
    } finally {
      setShowAddToNav(null);
      if (isNew) navigate(`/admin/pages/${showAddToNav.pageId}`);
    }
  };

  const validBlocks = useMemo(() => {
    try {
      return validateBlocks(form.blocks);
    } catch {
      return null;
    }
  }, [form.blocks]);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  const status = existing?.status ?? "draft";
  const isPublished = status === "published";

  return (
    <div className="space-y-4">
      <Link
        to="/admin/pages"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pages
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-heading font-bold">
            {isNew ? "New page" : "Edit page"}
          </h2>
          {form.slug && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {isPublished ? (
                <a
                  href={`/${form.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground hover:underline"
                >
                  /{form.slug}
                </a>
              ) : (
                <span>/{form.slug} (draft)</span>
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={save.isPending}>
            Save draft
          </Button>
          <Button onClick={handlePublish} disabled={save.isPending}>
            {isPublished ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Our Team"
            />
          </div>
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ktekglobal.com/</span>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value.toLowerCase());
                }}
                placeholder="our-team"
                className="font-mono"
              />
            </div>
            {slugError && (
              <p className="text-xs text-destructive mt-1">{slugError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-3 mt-4">
          {form.blocks.length > 0 ? (
            <SortableList
              items={form.blocks}
              onReorder={(next) => update("blocks", next)}
              renderItem={(block, handle) => (
                <BlockEditor
                  block={block}
                  dragHandle={handle}
                  onChange={(next) => updateBlock(block.id, next)}
                  onRemove={() => removeBlock(block.id)}
                />
              )}
            />
          ) : (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <p className="text-muted-foreground mb-3">
                No blocks yet. Add your first one.
              </p>
            </div>
          )}
          <AddBlockButton onAdd={addBlock} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-5">
              {validBlocks === null ? (
                <p className="text-destructive">
                  Some blocks have invalid data. Fix the issues in the Content tab to preview.
                </p>
              ) : validBlocks.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  Nothing to preview yet. Add a block in the Content tab.
                </p>
              ) : (
                <div className="bg-background rounded p-4 border">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                    {form.title || "(Untitled)"}
                  </h1>
                  <BlocksRenderer blocks={validBlocks} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-3 mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div>
                <Label htmlFor="seo_title">SEO title (optional)</Label>
                <Input
                  id="seo_title"
                  value={form.seo_title}
                  onChange={(e) => update("seo_title", e.target.value)}
                  placeholder="Defaults to the page title with | KnightTek suffix"
                />
              </div>
              <div>
                <Label htmlFor="seo_description">SEO description (optional)</Label>
                <Textarea
                  id="seo_description"
                  value={form.seo_description}
                  onChange={(e) => update("seo_description", e.target.value)}
                  placeholder="One or two sentences summarizing the page for search engines."
                  rows={3}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                These appear in Google search results and link previews. Keep
                descriptions under ~160 characters.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!showAddToNav}
        onOpenChange={(open) => !open && setShowAddToNav(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Page published
            </DialogTitle>
            <DialogDescription>
              Your page is live at{" "}
              <a
                href={showAddToNav ? `/${showAddToNav.slug}` : "#"}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-foreground hover:underline"
              >
                /{showAddToNav?.slug}
              </a>
              . Should it appear in the header navigation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddToNav(null)}>
              Skip for now
            </Button>
            <Button onClick={handleAddToNav}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Add to header nav
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddBlockButton({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add block
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1">
        <div className="space-y-0.5">
          {BLOCK_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted"
            >
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
