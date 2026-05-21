import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Newspaper,
  Video,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import {
  POST_STATUS_LABELS,
  POST_TYPE_LABELS,
  POST_TYPES,
  useAllPosts,
  useDeletePost,
  type Post,
  type PostStatus,
  type PostType,
} from "@/lib/posts";

const STATUS_BADGE_VARIANT: Record<
  PostStatus,
  "default" | "secondary" | "outline"
> = {
  published: "default",
  scheduled: "outline",
  draft: "secondary",
};

const TYPE_ICON: Record<PostType, typeof FileText> = {
  article: FileText,
  news: Newspaper,
  video: Video,
  publication: BookOpen,
};

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const PostsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useAllPosts();
  const deletePost = useDeletePost();

  const [typeFilter, setTypeFilter] = useState<"all" | PostType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleOutrankSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        imported: number;
        updated: number;
        skipped: number;
        errors: { id: string; message: string }[];
      }>("sync-outrank", { body: { mode: "backfill" } });
      if (error) throw error;
      const imported = data?.imported ?? 0;
      const updated = data?.updated ?? 0;
      const errors = data?.errors?.length ?? 0;
      const parts = [
        imported ? `${imported} new` : null,
        updated ? `${updated} updated` : null,
        errors ? `${errors} errors` : null,
      ].filter(Boolean);
      toast.success(
        parts.length ? `Outrank sync: ${parts.join(" · ")}` : "Outrank sync: nothing new.",
      );
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Outrank sync failed. Check the function logs.",
      );
    } finally {
      setSyncing(false);
    }
  };

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (typeFilter === "all" || p.type === typeFilter) &&
          (statusFilter === "all" || p.status === statusFilter),
      ),
    [posts, typeFilter, statusFilter],
  );

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePost.mutateAsync(pendingDelete.id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Could not delete the post.");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Publications</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Write and publish articles, news, videos, and publications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleOutrankSync}
            disabled={syncing}
            title="Pull every article from Outrank and import it as a published article."
          >
            <RefreshCw
              className={`h-4 w-4 mr-2${syncing ? " animate-spin" : ""}`}
            />
            {syncing ? "Syncing…" : "Sync from Outrank"}
          </Button>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              New post
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-3 mb-4">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as "all" | PostType)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {POST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {POST_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | PostStatus)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                {posts.length === 0
                  ? "No posts yet. Create your first one."
                  : "No posts match these filters."}
              </p>
              {posts.length === 0 && (
                <Button asChild>
                  <Link to="/admin/posts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New post
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-36">Type</TableHead>
                    <TableHead className="w-28">Status</TableHead>
                    <TableHead className="w-44">Date</TableHead>
                    <TableHead className="w-28 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((post) => {
                    const Icon = TYPE_ICON[post.type];
                    return (
                      <TableRow
                        key={post.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                      >
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            {post.title}
                            {post.external_source === "outrank" && (
                              <Badge variant="outline" className="text-xs">
                                Outrank
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Icon className="h-4 w-4" />
                            {POST_TYPE_LABELS[post.type]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE_VARIANT[post.status]}>
                            {POST_STATUS_LABELS[post.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {post.status === "scheduled" && post.scheduled_at
                            ? `Scheduled · ${formatDate(post.scheduled_at)}`
                            : formatDate(post.published_at)}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              aria-label="Edit"
                              onClick={() => navigate(`/admin/posts/${post.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              aria-label="Delete"
                              onClick={() => setPendingDelete(post)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.title}" will be permanently removed. This cannot be
              undone.
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
};

export default PostsList;
