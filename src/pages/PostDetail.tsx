import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, ExternalLink, FileDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafeHtml } from "@/components/SafeHtml";
import { POST_TYPE_LABELS, getEmbedUrl, usePublishedPost } from "@/lib/posts";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const PostDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = usePublishedPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-32 pb-16">
          <p className="text-muted-foreground">Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <section className="pt-32 pb-16 flex-1 bg-background text-center">
          <div className="container mx-auto px-4 max-w-md">
            <h1 className="text-2xl font-heading font-bold mb-3">
              Article not found
            </h1>
            <p className="text-muted-foreground mb-6">
              This post may have been removed or is not yet published.
            </p>
            <Button asChild variant="outline">
              <Link to="/publications">Back to publications</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const embed = getEmbedUrl(post.video_url);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <article className="flex-1">
        <section className="pt-32 pb-8 bg-gradient-to-b from-primary to-primary/90">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              to="/publications"
              className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to publications
            </Link>
            <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">
              {POST_TYPE_LABELS[post.type]}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-3">
              {post.title}
            </h1>
            {(post.published_at || post.scheduled_at) && (
              <p className="flex items-center gap-1.5 text-primary-foreground/80 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at ?? post.scheduled_at)}
              </p>
            )}
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-3xl space-y-8">
            {post.featured_image_url && (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-[420px]"
              />
            )}

            {post.excerpt && (
              <p className="text-xl text-foreground/70 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {(post.type === "article" || post.type === "news") && post.body && (
              <SafeHtml
                html={post.body}
                className="prose prose-slate max-w-none"
              />
            )}

            {post.type === "video" && embed && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={embed}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}

            {post.type === "publication" && (
              <div className="flex flex-wrap gap-3">
                {post.external_url && (
                  <Button
                    asChild
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <a
                      href={post.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View article
                    </a>
                  </Button>
                )}
                {post.pdf_url && (
                  <Button asChild variant="outline">
                    <a href={post.pdf_url} target="_blank" rel="noopener noreferrer">
                      <FileDown className="h-4 w-4 mr-2" />
                      Open PDF
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default PostDetail;
