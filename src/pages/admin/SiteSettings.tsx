import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useAllSettings,
  useDeleteSetting,
  useSaveSetting,
  type SiteSetting,
} from "@/lib/settings";

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

export default function SiteSettings() {
  const { data: settings = [], isLoading } = useAllSettings();
  const save = useSaveSetting();
  const remove = useDeleteSetting();
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SiteSetting | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.key);
      toast.success("Setting removed.");
    } catch {
      toast.error("Could not remove setting.");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Site Settings</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Key/value JSON store used by the site code. Examples: contact info
            override, feature flags, runtime tweaks. Edits go live immediately.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New setting
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : settings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">
            No custom settings yet. The site uses code defaults.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {settings.map((setting) => (
            <Card key={setting.key} className="border">
              <CardContent className="p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-semibold">{setting.key}</div>
                  <pre className="text-xs text-muted-foreground bg-muted p-2 rounded mt-1 overflow-x-auto max-h-32">
                    {formatJson(setting.value)}
                  </pre>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(setting)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingDelete(setting)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SettingDialog
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        setting={editing}
        existingKeys={new Set(settings.map((s) => s.key))}
        onSave={async ({ key, value }) => {
          await save.mutateAsync({ key, value });
          setCreating(false);
          setEditing(null);
        }}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this setting?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.key}" will be removed. The site will fall back to
              the code default for this key.
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

interface SettingDialogProps {
  open: boolean;
  onClose: () => void;
  setting: SiteSetting | null;
  existingKeys: Set<string>;
  onSave: (input: { key: string; value: unknown }) => Promise<void>;
}

function SettingDialog({ open, onClose, setting, existingKeys, onSave }: SettingDialogProps) {
  const [key, setKey] = useState("");
  const [valueText, setValueText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (setting) {
      setKey(setting.key);
      setValueText(formatJson(setting.value));
    } else {
      setKey("");
      setValueText("{}");
    }
    setParseError(null);
  }, [open, setting]);

  const handleSave = async () => {
    if (!key.trim()) {
      toast.error("Key is required.");
      return;
    }
    if (!setting && existingKeys.has(key.trim())) {
      toast.error(`A setting named "${key.trim()}" already exists.`);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(valueText);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON.");
      return;
    }
    setParseError(null);
    setSubmitting(true);
    try {
      await onSave({ key: key.trim(), value: parsed });
      toast.success("Setting saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{setting ? "Edit setting" : "New setting"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="setting_key">Key</Label>
            <Input
              id="setting_key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={!!setting}
              placeholder="e.g. contact.phone or features.new_pricing"
              className="font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="setting_value">Value (JSON)</Label>
            <Textarea
              id="setting_value"
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            {parseError && (
              <p className="text-xs text-destructive mt-1">JSON error: {parseError}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            <Save className="h-4 w-4 mr-2" />
            {submitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
