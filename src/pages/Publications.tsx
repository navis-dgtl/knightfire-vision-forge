import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Newspaper,
  Video,
  ExternalLink,
  FileDown,
  ArrowRight,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  POST_TYPE_LABELS,
  getEmbedUrl,
  usePublishedPosts,
  type Post,
  type PostType,
} from "@/lib/posts";

const TYPE_ICON: Record<PostType, typeof FileText> = {
  article: FileText,
  news: Newspaper,
  video: Video,
  publication: BookOpen,
};

const FILTERS: { value: "all" | PostType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "news", label: "Press Releases" },
  { value: "video", label: "Videos" },
  { value: "publication", label: "Publications" },
];

const Publications = () => {
  const { data: posts = [], isLoading } = usePublishedPosts();
  const [filter, setFilter] = useState<"all" | PostType>("all");

  const visible =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Publications & Resources | KnightTek Fire Safety Articles"
        description="Browse KnightTek's library of fire safety articles, videos, and industry publications covering lithium-ion battery fire suppression."
        canonical="/publications"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-accent/10 rounded-full mb-6">
              <BookOpen className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              KnightTek Resources and Articles
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90">
              Articles, press releases, videos, and publications from the
              KnightTek team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-12">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | PostType)}
            >
              <TabsList className="flex-wrap h-auto">
                {FILTERS.map((f) => (
                  <TabsTrigger key={f.value} value={f.value}>
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No content here yet. Check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {visible.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const Icon = TYPE_ICON[post.type];
  const embed = getEmbedUrl(post.video_url);
  const isArticleLike = post.type === "article" || post.type === "news";
  const detailHref = `/publications/${post.slug}`;

  return (
    <Card className="overflow-hidden border-2 border-accent/10 hover:shadow-xl transition-all duration-300 flex flex-col">
      {post.type === "video" && embed ? (
        <div className="aspect-video">
          <iframe
            src={embed}
            title={post.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : post.featured_image_url ? (
        <Link to={isArticleLike ? detailHref : "#"} className="block">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="aspect-video w-full object-cover"
          />
        </Link>
      ) : (
        <div className="aspect-video bg-primary/5 flex items-center justify-center">
          <Icon className="h-12 w-12 text-accent/40" />
        </div>
      )}

      <CardContent className="p-5 flex flex-col flex-1">
        <Badge variant="secondary" className="w-fit mb-2">
          {POST_TYPE_LABELS[post.type]}
        </Badge>
        <h3 className="text-lg font-heading font-bold text-primary mb-2">
          {isArticleLike ? (
            <Link to={detailHref} className="hover:text-accent transition-colors">
              {post.title}
            </Link>
          ) : (
            post.title
          )}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-foreground/70 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-2 flex flex-wrap gap-2">
          {isArticleLike && (
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to={detailHref}>
                Read more
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          )}
          {post.type === "publication" && post.external_url && (
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View article
                <ExternalLink className="h-4 w-4 ml-1.5" />
              </a>
            </Button>
          )}
          {post.type === "publication" && post.pdf_url && (
            <Button asChild size="sm" variant="outline">
              <a href={post.pdf_url} target="_blank" rel="noopener noreferrer">
                <FileDown className="h-4 w-4 mr-1.5" />
                Open PDF
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Publications;
