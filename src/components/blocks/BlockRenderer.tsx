import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SafeHtml } from "@/components/SafeHtml";
import { cn } from "@/lib/utils";
import { getVideoEmbedUrl, type Block, type InnerBlock } from "@/lib/blocks";
import { ContactFormInline } from "./ContactFormInline";

const isExternal = (url: string) => /^https?:\/\//i.test(url);

/**
 * Renders a single block read-only. Used on public custom pages.
 * Inner blocks (inside columns) pass through this same renderer — columns
 * just feed it the left/right arrays.
 */
export function BlockRenderer({ block }: { block: Block | InnerBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingView block={block} />;
    case "rich_text":
      return <RichTextView block={block} />;
    case "image":
      return <ImageView block={block} />;
    case "button":
      return <ButtonView block={block} />;
    case "video":
      return <VideoView block={block} />;
    case "spacer":
      return <SpacerView block={block} />;
    case "columns":
      return <ColumnsView block={block} />;
    case "contact_form":
      return <ContactFormView block={block} />;
    case "embed":
      return <EmbedView block={block} />;
    default:
      // Future-proofing: an unknown block type just disappears in production
      // instead of crashing. Admin editor flags these separately.
      return null;
  }
}

/** Convenience: renders a list of blocks separated by vertical spacing. */
export function BlocksRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

// ---- View components for each block type ----

function HeadingView({ block }: { block: Extract<Block, { type: "heading" }> }) {
  const Tag = (`h${block.props.level}` as "h1" | "h2" | "h3");
  const sizes = {
    1: "text-4xl md:text-5xl",
    2: "text-2xl md:text-3xl",
    3: "text-xl md:text-2xl",
  } as const;
  return (
    <Tag
      className={cn(
        "font-heading font-bold",
        sizes[block.props.level],
        block.props.align === "center" && "text-center",
      )}
    >
      {block.props.text}
    </Tag>
  );
}

function RichTextView({ block }: { block: Extract<Block, { type: "rich_text" }> }) {
  return (
    <SafeHtml
      html={block.props.html}
      className="prose prose-slate max-w-none"
    />
  );
}

function ImageView({ block }: { block: Extract<Block, { type: "image" }> }) {
  if (!block.props.url) return null;
  const widths = {
    narrow: "max-w-2xl mx-auto",
    wide: "max-w-4xl mx-auto",
    full: "w-full",
  } as const;
  return (
    <figure className={widths[block.props.width]}>
      <img
        src={block.props.url}
        alt={block.props.alt}
        className="w-full h-auto rounded-lg"
        loading="lazy"
      />
      {block.props.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {block.props.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ButtonView({ block }: { block: Extract<Block, { type: "button" }> }) {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[block.props.align];

  if (!block.props.url) return null;
  const variant = block.props.variant === "secondary" ? "outline" : "default";
  const className =
    block.props.variant === "primary"
      ? "bg-accent text-accent-foreground hover:bg-accent/90"
      : "";

  return (
    <div className={cn("flex", alignClass)}>
      {isExternal(block.props.url) ? (
        <Button asChild variant={variant} className={className}>
          <a href={block.props.url} target="_blank" rel="noopener noreferrer">
            {block.props.label}
          </a>
        </Button>
      ) : (
        <Button asChild variant={variant} className={className}>
          <Link to={block.props.url}>{block.props.label}</Link>
        </Button>
      )}
    </div>
  );
}

function VideoView({ block }: { block: Extract<Block, { type: "video" }> }) {
  const embed = getVideoEmbedUrl(block.props.url);
  if (!embed) return null;
  return (
    <figure className="max-w-4xl mx-auto">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={embed}
          title={block.props.caption || "Embedded video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {block.props.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {block.props.caption}
        </figcaption>
      )}
    </figure>
  );
}

function SpacerView({ block }: { block: Extract<Block, { type: "spacer" }> }) {
  const heights = { sm: "h-6", md: "h-12", lg: "h-24" }[block.props.size];
  return <div className={heights} aria-hidden />;
}

function ColumnsView({ block }: { block: Extract<Block, { type: "columns" }> }) {
  const ratios = {
    "50-50": "md:grid-cols-2",
    "33-67": "md:grid-cols-[1fr_2fr]",
    "67-33": "md:grid-cols-[2fr_1fr]",
  } as const;
  return (
    <div className={cn("grid grid-cols-1 gap-6", ratios[block.props.ratio])}>
      <div className="space-y-4">
        {block.props.left.map((inner) => (
          <BlockRenderer key={inner.id} block={inner} />
        ))}
      </div>
      <div className="space-y-4">
        {block.props.right.map((inner) => (
          <BlockRenderer key={inner.id} block={inner} />
        ))}
      </div>
    </div>
  );
}

function ContactFormView({ block }: { block: Extract<Block, { type: "contact_form" }> }) {
  return (
    <div className="bg-muted/50 rounded-lg p-6 md:p-8">
      {block.props.heading && (
        <h3 className="text-2xl font-heading font-bold mb-2">{block.props.heading}</h3>
      )}
      {block.props.subheading && (
        <p className="text-muted-foreground mb-6">{block.props.subheading}</p>
      )}
      <ContactFormInline />
    </div>
  );
}

function EmbedView({ block }: { block: Extract<Block, { type: "embed" }> }) {
  if (!block.props.url) return null;
  return (
    <figure>
      <iframe
        src={block.props.url}
        title={block.props.caption || "Embedded content"}
        className="w-full rounded-lg border"
        style={{ height: block.props.height }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        loading="lazy"
      />
      {block.props.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {block.props.caption}
        </figcaption>
      )}
    </figure>
  );
}
