import { z } from "zod";

export type BlockId = string;

const headingSchema = z.object({
  id: z.string(),
  type: z.literal("heading"),
  props: z.object({
    text: z.string().default(""),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
    align: z.enum(["left", "center"]).default("left"),
  }),
});

const richTextSchema = z.object({
  id: z.string(),
  type: z.literal("rich_text"),
  props: z.object({
    html: z.string().default(""),
  }),
});

const imageSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  props: z.object({
    url: z.string().default(""),
    alt: z.string().default(""),
    caption: z.string().default(""),
    width: z.enum(["narrow", "wide", "full"]).default("wide"),
  }),
});

const buttonSchema = z.object({
  id: z.string(),
  type: z.literal("button"),
  props: z.object({
    label: z.string().default("Click here"),
    url: z.string().default(""),
    variant: z.enum(["primary", "secondary"]).default("primary"),
    align: z.enum(["left", "center", "right"]).default("left"),
  }),
});

const videoSchema = z.object({
  id: z.string(),
  type: z.literal("video"),
  props: z.object({
    url: z.string().default(""),
    caption: z.string().default(""),
  }),
});

const spacerSchema = z.object({
  id: z.string(),
  type: z.literal("spacer"),
  props: z.object({
    size: z.enum(["sm", "md", "lg"]).default("md"),
  }),
});

const contactFormSchema = z.object({
  id: z.string(),
  type: z.literal("contact_form"),
  props: z.object({
    heading: z.string().default("Get in touch"),
    subheading: z.string().default(""),
  }),
});

const embedSchema = z.object({
  id: z.string(),
  type: z.literal("embed"),
  props: z.object({
    url: z.string().default(""),
    height: z.number().int().min(200).max(2000).default(600),
    caption: z.string().default(""),
  }),
});

// Blocks allowed inside a column (no columns-in-columns, no form/embed nesting).
const innerBlockSchema = z.discriminatedUnion("type", [
  headingSchema,
  richTextSchema,
  imageSchema,
  buttonSchema,
  videoSchema,
  spacerSchema,
]);

const columnsSchema = z.object({
  id: z.string(),
  type: z.literal("columns"),
  props: z.object({
    left: z.array(innerBlockSchema).default([]),
    right: z.array(innerBlockSchema).default([]),
    ratio: z.enum(["50-50", "33-67", "67-33"]).default("50-50"),
  }),
});

export const blockSchema = z.discriminatedUnion("type", [
  headingSchema,
  richTextSchema,
  imageSchema,
  buttonSchema,
  videoSchema,
  spacerSchema,
  columnsSchema,
  contactFormSchema,
  embedSchema,
]);

export type Block = z.infer<typeof blockSchema>;
export type InnerBlock = z.infer<typeof innerBlockSchema>;
export type BlockType = Block["type"];

export const BLOCK_TYPES: BlockType[] = [
  "heading",
  "rich_text",
  "image",
  "button",
  "video",
  "spacer",
  "columns",
  "contact_form",
  "embed",
];

export const INNER_BLOCK_TYPES: BlockType[] = [
  "heading",
  "rich_text",
  "image",
  "button",
  "video",
  "spacer",
];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  rich_text: "Text",
  image: "Image",
  button: "Button",
  video: "Video",
  spacer: "Spacer",
  columns: "Two columns",
  contact_form: "Contact form",
  embed: "Embed (iframe)",
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `b_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

export function createBlock(type: BlockType): Block {
  switch (type) {
    case "heading":
      return { id: newId(), type, props: { text: "New heading", level: 2, align: "left" } };
    case "rich_text":
      return { id: newId(), type, props: { html: "<p>Start writing…</p>" } };
    case "image":
      return { id: newId(), type, props: { url: "", alt: "", caption: "", width: "wide" } };
    case "button":
      return { id: newId(), type, props: { label: "Click here", url: "", variant: "primary", align: "left" } };
    case "video":
      return { id: newId(), type, props: { url: "", caption: "" } };
    case "spacer":
      return { id: newId(), type, props: { size: "md" } };
    case "columns":
      return { id: newId(), type, props: { left: [], right: [], ratio: "50-50" } };
    case "contact_form":
      return { id: newId(), type, props: { heading: "Get in touch", subheading: "" } };
    case "embed":
      return { id: newId(), type, props: { url: "", height: 600, caption: "" } };
  }
}

/**
 * Parses a raw `unknown` array (e.g. from Supabase jsonb) into a typed Block[].
 * Unknown / malformed blocks are dropped silently so a public page never
 * crashes on schema drift. Use `validateBlocks` for save-side errors.
 */
export function parseBlocks(value: unknown): Block[] {
  if (!Array.isArray(value)) return [];
  const out: Block[] = [];
  for (const raw of value) {
    const parsed = blockSchema.safeParse(raw);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

/** Strict validate — throws if any block is malformed. Used at save time. */
export function validateBlocks(blocks: unknown): Block[] {
  return z.array(blockSchema).parse(blocks);
}

const PROVIDER_HOSTS: Record<string, string> = {
  "docs.google.com": "Google Forms",
  "forms.google.com": "Google Forms",
  "forms.gle": "Google Forms",
  "typeform.com": "Typeform",
  "calendly.com": "Calendly",
  "airtable.com": "Airtable",
  "notion.so": "Notion",
  "notion.site": "Notion",
};

/** Returns the friendly provider name for a known embed host, or null. */
export function detectEmbedProvider(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [pattern, name] of Object.entries(PROVIDER_HOSTS)) {
      if (host === pattern || host.endsWith(`.${pattern}`)) return name;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the embed-safe URL for a video provider, or null if the URL is not
 * a recognized provider. Mirrors lib/posts.getEmbedUrl but kept local so this
 * module has no cross-file dependency.
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
