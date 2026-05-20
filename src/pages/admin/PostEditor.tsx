import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, ExternalLink, Loader2, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { AiAssistPanel } from "@/components/editor/AiAssistPanel";
import { SafeHtml } from "@/components/SafeHtml";
import { useAuth } from "@/hooks/useAuth";
import { uploadMedia } from "@/lib/storage";
import { toast } from "sonner";
import type { TablesInsert } from "@/integrations/supabase/types";
import {
  POST_TYPE_LABELS,
  POST_TYPES,
  getEmbedUrl,
  slugify,
  uniqueSlug,
  usePost,
  useSavePost,
  type PostStatus,
  type PostType,
} from "@/lib/posts";

interface FormState {
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featured_image_url: string;
  video_url: string;
  pdf_url: string;
  external_url: string;
  status: PostStatus;
  scheduled_at: string;
}

const EMPTY: FormState = {
  type: "article",
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  featured_image_url: "",
  video_url: "",
  pdf_url: "",
  external_url: "",
  status: "draft",
  scheduled_at: "",
};

/** ISO timestamp -> value for an <input type="datetime-local"> (local time). */
function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

const PostEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: existing, isLoading } = usePost(id);
  const savePost = useSavePost();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiUses, setAiUses] = useState(0);
  const populated = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existing && !populated.current) {
      populated.current = true;
      setSlugTouched(true);
      setForm({
        type: existing.type,
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt ?? "",
        body: existing.body ?? "",
        featured_image_url: existing.featured_image_url ?? "",
        video_url: existing.video_url ?? "",
        pdf_url: existing.pdf_url ?? "",
        external_url: existing.external_url ?? "",
        status: existing.status,
        scheduled_at: existing.scheduled_at
          ? toDateTimeLocal(existing.scheduled_at)
          : "",
      });
      setAiUses(existing.ai_uses ?? 0);
    }
  }, [existing]);

  const update = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const onTitleChange = (title: string) =>
    update({ title, ...(slugTouched ? {} : { slug: slugify(title) }) });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    try {
      update({ featured_image_url: await uploadMedia(file) });
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingPdf(true);
    try {
      update({ pdf_url: await uploadMedia(file) });
    } catch {
      toast.error("PDF upload failed.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("A title is required.");
      return;
    }
    if (form.type === "video") {
      if (!form.video_url.trim()) {
        toast.error("A video URL is required.");
        return;
      }
      if (!getEmbedUrl(form.video_url)) {
        toast.error("Enter a valid YouTube or Vimeo URL.");
        return;
      }
    }
    if (
      form.type === "publication" &&
      !form.pdf_url &&
      !form.external_url.trim()
    ) {
      toast.error("Add a PDF upload or an external link.");
      return;
    }

    if (form.status === "scheduled") {
      if (!form.scheduled_at) {
        toast.error("Choose a date and time to publish.");
        return;
      }
      if (new Date(form.scheduled_at).getTime() <= Date.now()) {
        toast.error("The scheduled publish time must be in the future.");
        return;
      }
    }

    setSaving(true);
    try {
      const slug = await uniqueSlug(form.slug || form.title, isNew ? undefined : id);
      const isArticleLike = form.type === "article" || form.type === "news";
      const published_at =
        form.status === "published"
          ? existing?.published_at ?? new Date().toISOString()
          : existing?.published_at ?? null;
      const scheduled_at =
        form.status === "scheduled"
          ? new Date(form.scheduled_at).toISOString()
          : null;

      const values: TablesInsert<"posts"> = {
        type: form.type,
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim() || null,
        body: isArticleLike ? form.body || null : null,
        featured_image_url: form.featured_image_url || null,
        video_url: form.type === "video" ? form.video_url.trim() || null : null,
        pdf_url: form.type === "publication" ? form.pdf_url || null : null,
        external_url:
          form.type === "publication" ? form.external_url.trim() || null : null,
        status: form.status,
        published_at,
        scheduled_at,
        ...(isNew && user ? { author_id: user.id } : {}),
      };

      const saved = await savePost.mutateAsync({
        id: isNew ? undefined : id,
        values,
      });
      toast.success(isNew ? "Post created." : "Post saved.");
      update({ slug });
      if (isNew) navigate(`/admin/posts/${saved.id}`, { replace: true });
    } catch {
      toast.error("Could not save the post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isNew && !isLoading && !existing) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-heading font-bold mb-3">Post not found</h2>
        <Button asChild variant="outline">
          <Link to="/admin/posts">Back to publications</Link>
        </Button>
      </div>
    );
  }

  const isArticleLike = form.type === "article" || form.type === "news";

  return (
    <div className="space-y-4">
      <Link
        to="/admin/posts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to publications
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-heading font-bold">
          {isNew ? "New post" : "Edit post"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
          {/* Type + status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => update({ type: v as PostType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {POST_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update({ status: v as PostStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft — only visible here</SelectItem>
                  <SelectItem value="scheduled">
                    Scheduled — publishes automatically
                  </SelectItem>
                  <SelectItem value="published">
                    Published — live on the site
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scheduled publish time */}
          {form.status === "scheduled" && (
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Publish date &amp; time</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={form.scheduled_at}
                min={toDateTimeLocal(new Date().toISOString())}
                onChange={(e) => update({ scheduled_at: e.target.value })}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                The post stays hidden until this time, then publishes
                automatically. Times use your browser's timezone.
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Headline of the post"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Page address</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                /publications/
              </span>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update({ slug: slugify(e.target.value) });
                }}
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Summary</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => update({ excerpt: e.target.value })}
              placeholder="A short summary shown on the publications listing card."
              rows={3}
            />
          </div>

          {/* Featured image */}
          <div className="space-y-2">
            <Label>Featured image</Label>
            {form.featured_image_url ? (
              <div className="relative w-full max-w-sm">
                <img
                  src={form.featured_image_url}
                  alt="Featured"
                  className="rounded-md border w-full h-44 object-cover"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => update({ featured_image_url: "" })}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload image
              </Button>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Article / news body */}
          {isArticleLike && (
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                value={form.body}
                onChange={(html) => update({ body: html })}
              />
              <AiAssistPanel
                postId={isNew ? null : id ?? null}
                hasBody={form.body.replace(/<[^>]*>/g, "").trim().length > 0}
                aiUses={aiUses}
                onResult={(html, uses) => {
                  update({ body: html });
                  setAiUses(uses);
                }}
              />
            </div>
          )}

          {/* Video */}
          {form.type === "video" && (
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                value={form.video_url}
                onChange={(e) => update({ video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=…  or  https://vimeo.com/…"
              />
              {form.video_url && !getEmbedUrl(form.video_url) && (
                <p className="text-sm text-destructive">
                  Not a recognized YouTube or Vimeo link.
                </p>
              )}
            </div>
          )}

          {/* Publication */}
          {form.type === "publication" && (
            <>
              <div className="space-y-2">
                <Label>PDF document</Label>
                {form.pdf_url ? (
                  <div className="flex items-center gap-2 text-sm">
                    <a
                      href={form.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline truncate"
                    >
                      {form.pdf_url}
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => update({ pdf_url: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                  >
                    {uploadingPdf ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload PDF
                  </Button>
                )}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external_url">External article link</Label>
                <Input
                  id="external_url"
                  value={form.external_url}
                  onChange={(e) => update({ external_url: e.target.value })}
                  placeholder="https://… (use instead of, or alongside, a PDF)"
                />
              </div>
            </>
          )}

          {!isNew && form.status === "published" && (
            <a
              href={`/publications/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View live page
            </a>
          )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <PostPreview form={form} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PostPreview = ({ form }: { form: FormState }) => {
  const embed = getEmbedUrl(form.video_url);
  return (
    <article className="space-y-4">
      {form.featured_image_url && (
        <img
          src={form.featured_image_url}
          alt={form.title}
          className="w-full h-56 object-cover rounded-md"
        />
      )}
      <h1 className="text-3xl font-heading font-bold text-primary">
        {form.title || "Untitled post"}
      </h1>
      {form.excerpt && (
        <p className="text-lg text-foreground/70">{form.excerpt}</p>
      )}
      {(form.type === "article" || form.type === "news") && form.body && (
        <SafeHtml html={form.body} className="prose prose-slate max-w-none" />
      )}
      {form.type === "video" &&
        (embed ? (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={embed}
              title={form.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a valid video URL to preview the embed.
          </p>
        ))}
      {form.type === "publication" && (
        <p className="text-sm text-muted-foreground">
          This publication links to{" "}
          {form.pdf_url
            ? "an uploaded PDF"
            : form.external_url
              ? "an external article"
              : "— no link set yet"}
          .
        </p>
      )}
    </article>
  );
};

export default PostEditor;
