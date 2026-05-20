import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { RESERVED_SLUGS, usePublishedPage } from "@/lib/pages";
import { parseBlocks } from "@/lib/blocks";
import { BlocksRenderer } from "@/components/blocks/BlockRenderer";

/**
 * Public renderer for admin-authored pages from the `pages` table.
 *
 * Mounted at /:slug as the LAST route in App.tsx so all fixed routes
 * (/products, /publications, etc.) win first. As defense-in-depth we
 * also reject any slug that's in RESERVED_SLUGS even if a row exists.
 */
export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const reserved = !!slug && RESERVED_SLUGS.has(slug);
  const { data: page, isLoading, error } = usePublishedPage(reserved ? undefined : slug);

  const blocks = useMemo(() => parseBlocks(page?.blocks), [page]);

  if (reserved) return <NotFound />;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <section className="pt-32 pb-16 flex-1 bg-background">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            Loading…
          </div>
        </section>
        <Footer />
      </div>
    );
  }
  if (error || !page) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={page.seo_title || `${page.title} | KnightTek`}
        description={page.seo_description || ""}
        canonical={`/${page.slug}`}
        image={page.og_image_url || undefined}
      />
      <Navigation />
      <main className="flex-1 pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-8">
            {page.title}
          </h1>
          <BlocksRenderer blocks={blocks} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
