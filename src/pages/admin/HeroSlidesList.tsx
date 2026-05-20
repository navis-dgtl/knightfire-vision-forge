import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
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
  useAllHeroSlides,
  useDeleteHeroSlide,
  useReorderHeroSlides,
  useSaveHeroSlide,
  type HeroSlide,
} from "@/lib/hero";

export default function HeroSlidesList() {
  const navigate = useNavigate();
  const { data: slides = [], isLoading } = useAllHeroSlides();
  const reorder = useReorderHeroSlides();
  const save = useSaveHeroSlide();
  const remove = useDeleteHeroSlide();
  const [pendingDelete, setPendingDelete] = useState<HeroSlide | null>(null);
  const [orderedSlides, setOrderedSlides] = useState<HeroSlide[]>(slides);

  // Keep local state in sync with the latest server data, but allow
  // optimistic reorders to be visible before the server round-trip completes.
  useEffect(() => {
    setOrderedSlides(slides);
  }, [slides]);

  const handleReorder = (next: HeroSlide[]) => {
    setOrderedSlides(next);
    reorder.mutate(next.map((s) => s.id));
  };

  const toggleActive = (slide: HeroSlide) => {
    save.mutate({
      id: slide.id,
      values: { is_active: !slide.is_active },
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Slide deleted.");
    } catch {
      toast.error("Could not delete slide.");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Hero Slides</h2>
          <p className="text-muted-foreground text-sm mt-1">
            The carousel at the top of the home page. Drag to reorder. Inactive
            slides are hidden from the public site.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/hero/new">
            <Plus className="h-4 w-4 mr-2" />
            New slide
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : slides.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">
            No slides yet. The home page is falling back to the default carousel.
          </p>
          <Button asChild>
            <Link to="/admin/hero/new">
              <Plus className="h-4 w-4 mr-2" />
              Create the first slide
            </Link>
          </Button>
        </div>
      ) : (
        <SortableList
          items={orderedSlides}
          onReorder={handleReorder}
          renderItem={(slide, handle) => (
            <div className="flex items-center gap-3 bg-card border rounded-lg p-3">
              {handle}
              <div className="h-12 w-20 shrink-0 rounded bg-muted overflow-hidden flex items-center justify-center">
                {slide.image_url ? (
                  <img src={slide.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{slide.title || "(Untitled slide)"}</h3>
                  {!slide.is_active && <Badge variant="secondary">Hidden</Badge>}
                </div>
                {slide.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleActive(slide)}
                  aria-label={slide.is_active ? "Hide slide" : "Show slide"}
                >
                  {slide.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/hero/${slide.id}`)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPendingDelete(slide)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.title || "Untitled"}" will be permanently removed.
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
