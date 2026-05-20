import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useBanner, useSaveBanner } from "@/lib/banners";

interface FormState {
  message: string;
  link_url: string;
  link_label: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
}

const EMPTY: FormState = {
  message: "",
  link_url: "",
  link_label: "",
  background_color: "#1a3a52",
  text_color: "#ffffff",
  is_active: true,
  starts_at: "",
  ends_at: "",
};

// Convert ISO from DB (UTC) to value for <input type="datetime-local"> (local).
const toLocalInput = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
};

// And back the other way for save.
const toIso = (local: string): string | null => {
  if (!local) return null;
  return new Date(local).toISOString();
};

export default function BannerEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: existing, isLoading } = useBanner(id);
  const save = useSaveBanner();
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (existing) {
      setForm({
        message: existing.message,
        link_url: existing.link_url ?? "",
        link_label: existing.link_label ?? "",
        background_color: existing.background_color ?? "#1a3a52",
        text_color: existing.text_color ?? "#ffffff",
        is_active: existing.is_active,
        starts_at: toLocalInput(existing.starts_at),
        ends_at: toLocalInput(existing.ends_at),
      });
    }
  }, [existing]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    if (!form.message.trim()) {
      toast.error("Message is required.");
      return;
    }
    try {
      await save.mutateAsync({
        id: id !== "new" ? id : undefined,
        values: {
          message: form.message.trim(),
          link_url: form.link_url || null,
          link_label: form.link_label || null,
          background_color: form.background_color || null,
          text_color: form.text_color || null,
          is_active: form.is_active,
          starts_at: toIso(form.starts_at),
          ends_at: toIso(form.ends_at),
        },
      });
      toast.success("Banner saved.");
      navigate("/admin/banners");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        to="/admin/banners"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to banners
      </Link>

      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-heading font-bold">
          {id === "new" ? "New banner" : "Edit banner"}
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

      {/* Live preview */}
      <div
        className="rounded-lg overflow-hidden border"
        style={{
          backgroundColor: form.background_color,
          color: form.text_color,
        }}
      >
        <div className="py-2 px-4 text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <span>{form.message || "Your banner message preview"}</span>
          {form.link_url && (
            <span className="underline font-medium">
              {form.link_label || "Learn more"} →
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Free shipping on orders over $500 this week."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="link_url">Link URL (optional)</Label>
              <Input
                id="link_url"
                value={form.link_url}
                onChange={(e) => update("link_url", e.target.value)}
                placeholder="/distributors or https://…"
              />
            </div>
            <div>
              <Label htmlFor="link_label">Link label (optional)</Label>
              <Input
                id="link_label"
                value={form.link_label}
                onChange={(e) => update("link_label", e.target.value)}
                placeholder="Learn more"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="background_color">Background color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-14 p-1 h-10"
                  value={form.background_color}
                  onChange={(e) => update("background_color", e.target.value)}
                />
                <Input
                  id="background_color"
                  value={form.background_color}
                  onChange={(e) => update("background_color", e.target.value)}
                  placeholder="#1a3a52"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="text_color">Text color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-14 p-1 h-10"
                  value={form.text_color}
                  onChange={(e) => update("text_color", e.target.value)}
                />
                <Input
                  id="text_color"
                  value={form.text_color}
                  onChange={(e) => update("text_color", e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-heading font-semibold mb-1">Schedule (optional)</h3>
            <p className="text-xs text-muted-foreground">
              Leave both empty to show whenever active. Times are in your local timezone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="starts_at">Starts</Label>
              <Input
                id="starts_at"
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => update("starts_at", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ends_at">Ends</Label>
              <Input
                id="ends_at"
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => update("ends_at", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
