import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Newspaper,
  Video,
  BookOpen,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  POST_TYPE_LABELS,
  POST_TYPES,
  useAllPosts,
  useDeletePost,
  type Post,
  type PostStatus,
  type PostType,
} from "@/lib/posts";

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
  const { data: posts = [], isLoading } = useAllPosts();
  const deletePost = useDeletePost();

  const [typeFilter, setTypeFilter] = useState<"all" | PostType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);

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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="pt-32 pb-8 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to submission inbox
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">
                Publications
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Write and publish articles, news, videos, and publications.
              </p>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/admin/posts/new">
                <Plus className="h-4 w-4 mr-2" />
                New post
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 mb-6">
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
                    <TableHead className="w-36">Published</TableHead>
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
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Icon className="h-4 w-4" />
                            {POST_TYPE_LABELS[post.type]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.status === "published" ? "default" : "secondary"
                            }
                          >
                            {post.status === "published" ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(post.published_at)}
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
      </section>

      <Footer />

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
