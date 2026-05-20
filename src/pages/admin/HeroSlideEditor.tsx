import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useHeroSlide, useSaveHeroSlide } from "@/lib/hero";
import { uploadMedia } from "@/lib/storage";

interface FormState {
  title: string;
  subtitle: string;
  image_url: string;
  cta_label: string;
  cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  secondary_cta_label: "",
  secondary_cta_url: "",
  is_active: true,
};

export default function HeroSlideEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: existing, isLoading } = useHeroSlide(id);
  const save = useSaveHeroSlide();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title ?? "",
        subtitle: existing.subtitle ?? "",
        image_url: existing.image_url ?? "",
        cta_label: existing.cta_label ?? "",
        cta_url: existing.cta_url ?? "",
        secondary_cta_label: existing.secondary_cta_label ?? "",
        secondary_cta_url: existing.secondary_cta_url ?? "",
        is_active: existing.is_active,
      });
    }
  }, [existing]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      update("image_url", url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await save.mutateAsync({
        id: id !== "new" ? id : undefined,
        values: {
          title: form.title || null,
          subtitle: form.subtitle || null,
          image_url: form.image_url || null,
          cta_label: form.cta_label || null,
          cta_url: form.cta_url || null,
          secondary_cta_label: form.secondary_cta_label || null,
          secondary_cta_url: form.secondary_cta_url || null,
          is_active: form.is_active,
        },
      });
      toast.success("Slide saved.");
      navigate("/admin/hero");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        to="/admin/hero"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to slides
      </Link>

      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-heading font-bold">
          {id === "new" ? "New hero slide" : "Edit slide"}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(v) => update("is_active", v)}
            />
            <Label htmlFor="is_active" className="text-sm">
              {form.is_active ? "Active" : "Hidden"}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Become a KnightTek Distributor"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="One or two sentences shown beneath the title."
              rows={3}
            />
          </div>

          <div>
            <Label>Background image</Label>
            <div className="flex items-start gap-3 mt-1.5">
              <div className="flex-1">
                {form.image_url ? (
                  <div className="relative h-32 rounded-lg overflow-hidden border">
                    <img
                      src={form.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => update("image_url", "")}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <Input
                    placeholder="Or paste an image URL"
                    value={form.image_url}
                    onChange={(e) => update("image_url", e.target.value)}
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1920×800px JPG or WebP. The blue overlay is applied automatically.
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload"}
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-heading font-semibold">Primary button</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cta_label">Label</Label>
              <Input
                id="cta_label"
                value={form.cta_label}
                onChange={(e) => update("cta_label", e.target.value)}
                placeholder="Apply Now"
              />
            </div>
            <div>
              <Label htmlFor="cta_url">URL</Label>
              <Input
                id="cta_url"
                value={form.cta_url}
                onChange={(e) => update("cta_url", e.target.value)}
                placeholder="/distributors or https://…"
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <h3 className="font-heading font-semibold mt-3">Secondary button (optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <Label htmlFor="secondary_cta_label">Label</Label>
                <Input
                  id="secondary_cta_label"
                  value={form.secondary_cta_label}
                  onChange={(e) => update("secondary_cta_label", e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <Label htmlFor="secondary_cta_url">URL</Label>
                <Input
                  id="secondary_cta_url"
                  value={form.secondary_cta_url}
                  onChange={(e) => update("secondary_cta_url", e.target.value)}
                  placeholder="/distributors or https://…"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
