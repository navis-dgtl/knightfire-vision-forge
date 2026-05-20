import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { SortableList } from "@/components/admin/SortableList";
import {
  type Banner,
  useAllBanners,
  useDeleteBanner,
  useReorderBanners,
  useSaveBanner,
} from "@/lib/banners";

const formatRange = (banner: Banner): string | null => {
  if (!banner.starts_at && !banner.ends_at) return null;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const start = banner.starts_at ? fmt(banner.starts_at) : "Always";
  const end = banner.ends_at ? fmt(banner.ends_at) : "Always";
  return `${start} – ${end}`;
};

const isLiveNow = (banner: Banner): boolean => {
  if (!banner.is_active) return false;
  const now = Date.now();
  const starts = banner.starts_at ? Date.parse(banner.starts_at) : -Infinity;
  const ends = banner.ends_at ? Date.parse(banner.ends_at) : Infinity;
  return starts <= now && now < ends;
};

export default function BannersList() {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useAllBanners();
  const reorder = useReorderBanners();
  const save = useSaveBanner();
  const remove = useDeleteBanner();
  const [pendingDelete, setPendingDelete] = useState<Banner | null>(null);
  const [ordered, setOrdered] = useState<Banner[]>(banners);

  useEffect(() => {
    setOrdered(banners);
  }, [banners]);

  const handleReorder = (next: Banner[]) => {
    setOrdered(next);
    reorder.mutate(next.map((b) => b.id));
  };

  const toggleActive = (banner: Banner) =>
    save.mutate({ id: banner.id, values: { is_active: !banner.is_active } as never });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Banner deleted.");
    } catch {
      toast.error("Could not delete banner.");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Announcement Banners</h2>
          <p className="text-muted-foreground text-sm mt-1">
            The thin colored strip above the main navigation. Only one banner
            shows at a time — the lowest sort order that's active and within
            schedule wins.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/banners/new">
            <Plus className="h-4 w-4 mr-2" />
            New banner
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No banners yet.</p>
          <Button asChild>
            <Link to="/admin/banners/new">
              <Plus className="h-4 w-4 mr-2" />
              Create the first banner
            </Link>
          </Button>
        </div>
      ) : (
        <SortableList
          items={ordered}
          onReorder={handleReorder}
          renderItem={(banner, handle) => {
            const range = formatRange(banner);
            const live = isLiveNow(banner);
            return (
              <div className="flex items-center gap-3 bg-card border rounded-lg p-3">
                {handle}
                <div
                  className="h-10 w-10 shrink-0 rounded border"
                  style={{
                    backgroundColor: banner.background_color || "hsl(var(--accent))",
                  }}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium truncate max-w-md">{banner.message}</h3>
                    {live ? (
                      <Badge>Live</Badge>
                    ) : banner.is_active ? (
                      <Badge variant="outline">Scheduled</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3 mt-0.5">
                    {range && <span>{range}</span>}
                    {banner.link_url && (
                      <span className="truncate max-w-xs">→ {banner.link_url}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(banner)}
                    aria-label={banner.is_active ? "Hide" : "Show"}
                  >
                    {banner.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/admin/banners/${banner.id}`)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingDelete(banner)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          }}
        />
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.message}" will be permanently removed.
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
