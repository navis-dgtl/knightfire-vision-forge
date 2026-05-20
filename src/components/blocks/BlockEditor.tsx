import { ChangeEvent, useState } from "react";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { uploadMedia } from "@/lib/storage";
import {
  BLOCK_LABELS,
  INNER_BLOCK_TYPES,
  createBlock,
  detectEmbedProvider,
  type Block,
  type BlockType,
  type InnerBlock,
} from "@/lib/blocks";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onRemove: () => void;
  dragHandle: React.ReactNode;
}

/**
 * Renders the edit UI for a single block, wrapped in a Card-style frame
 * with a drag handle and delete button. Used at the top level of the page
 * editor. Columns render `<InnerBlockEditor>` for their nested blocks.
 */
export function BlockEditor({ block, onChange, onRemove, dragHandle }: BlockEditorProps) {
  return (
    <div className="border rounded-lg bg-card">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        {dragHandle}
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          aria-label="Remove block"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="p-4">
        <BlockEditorBody block={block} onChange={onChange} />
      </div>
    </div>
  );
}

interface InnerBlockEditorProps {
  block: InnerBlock;
  onChange: (block: InnerBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

/** Same as BlockEditor but with up/down buttons instead of drag, used in columns. */
function InnerBlockEditor({
  block,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: InnerBlockEditorProps) {
  return (
    <div className="border rounded bg-background">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b bg-muted/20">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">
          {BLOCK_LABELS[block.type]}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label="Move up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label="Move down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={onRemove}
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
      <div className="p-3">
        <BlockEditorBody block={block} onChange={onChange as (b: Block) => void} />
      </div>
    </div>
  );
}

/** The actual per-block-type form switch. */
function BlockEditorBody({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  switch (block.type) {
    case "heading":
      return <HeadingEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "rich_text":
      return <RichTextEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "image":
      return <ImageEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "button":
      return <ButtonEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "video":
      return <VideoEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "spacer":
      return <SpacerEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "columns":
      return <ColumnsEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "contact_form":
      return <ContactFormEdit block={block} onChange={onChange as (b: Block) => void} />;
    case "embed":
      return <EmbedEdit block={block} onChange={onChange as (b: Block) => void} />;
  }
}

// Helpers shared by editors
function patchProps<B extends Block>(
  block: B,
  patch: Partial<B["props"]>,
  onChange: (b: Block) => void,
) {
  onChange({ ...block, props: { ...block.props, ...patch } } as Block);
}

// ---------- Per-block editors ----------

function HeadingEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "heading" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={block.props.text}
        onChange={(e) => patchProps(block, { text: e.target.value }, onChange)}
        placeholder="Heading text"
      />
      <div className="flex gap-2">
        <Select
          value={String(block.props.level)}
          onValueChange={(v) =>
            patchProps(block, { level: Number(v) as 1 | 2 | 3 }, onChange)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 — largest</SelectItem>
            <SelectItem value="2">H2 — section</SelectItem>
            <SelectItem value="3">H3 — sub-section</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={block.props.align}
          onValueChange={(v) =>
            patchProps(block, { align: v as "left" | "center" }, onChange)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Align left</SelectItem>
            <SelectItem value="center">Align center</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function RichTextEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "rich_text" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <RichTextEditor
      value={block.props.html}
      onChange={(html) => patchProps(block, { html }, onChange)}
    />
  );
}

function ImageEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "image" }>;
  onChange: (b: Block) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      patchProps(block, { url }, onChange);
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {block.props.url ? (
            <img
              src={block.props.url}
              alt=""
              className="w-full h-40 object-cover rounded border"
            />
          ) : (
            <Input
              value={block.props.url}
              onChange={(e) => patchProps(block, { url: e.target.value }, onChange)}
              placeholder="Image URL"
            />
          )}
        </div>
        <label className="cursor-pointer shrink-0">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload"}
          </span>
        </label>
      </div>
      {block.props.url && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => patchProps(block, { url: "" }, onChange)}
        >
          Replace image
        </Button>
      )}
      <Input
        value={block.props.alt}
        onChange={(e) => patchProps(block, { alt: e.target.value }, onChange)}
        placeholder="Alt text (for accessibility)"
      />
      <Input
        value={block.props.caption}
        onChange={(e) => patchProps(block, { caption: e.target.value }, onChange)}
        placeholder="Caption (optional)"
      />
      <Select
        value={block.props.width}
        onValueChange={(v) =>
          patchProps(block, { width: v as "narrow" | "wide" | "full" }, onChange)
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="narrow">Narrow</SelectItem>
          <SelectItem value="wide">Wide</SelectItem>
          <SelectItem value="full">Full width</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ButtonEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "button" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          value={block.props.label}
          onChange={(e) => patchProps(block, { label: e.target.value }, onChange)}
          placeholder="Button label"
        />
        <Input
          value={block.props.url}
          onChange={(e) => patchProps(block, { url: e.target.value }, onChange)}
          placeholder="/path or https://…"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={block.props.variant}
          onValueChange={(v) =>
            patchProps(block, { variant: v as "primary" | "secondary" }, onChange)
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary (gold)</SelectItem>
            <SelectItem value="secondary">Outline</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={block.props.align}
          onValueChange={(v) =>
            patchProps(block, { align: v as "left" | "center" | "right" }, onChange)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function VideoEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "video" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={block.props.url}
        onChange={(e) => patchProps(block, { url: e.target.value }, onChange)}
        placeholder="YouTube or Vimeo URL"
      />
      <Input
        value={block.props.caption}
        onChange={(e) => patchProps(block, { caption: e.target.value }, onChange)}
        placeholder="Caption (optional)"
      />
      <p className="text-xs text-muted-foreground">
        Paste a youtube.com, youtu.be, or vimeo.com URL. Other URLs aren't recognized.
      </p>
    </div>
  );
}

function SpacerEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "spacer" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <Select
      value={block.props.size}
      onValueChange={(v) =>
        patchProps(block, { size: v as "sm" | "md" | "lg" }, onChange)
      }
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">Small</SelectItem>
        <SelectItem value="md">Medium</SelectItem>
        <SelectItem value="lg">Large</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ColumnsEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "columns" }>;
  onChange: (b: Block) => void;
}) {
  const { left, right } = block.props;

  const setColumn = (which: "left" | "right", next: InnerBlock[]) =>
    patchProps(block, { [which]: next } as Partial<typeof block.props>, onChange);

  return (
    <div className="space-y-3">
      <Select
        value={block.props.ratio}
        onValueChange={(v) =>
          patchProps(block, { ratio: v as "50-50" | "33-67" | "67-33" }, onChange)
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="50-50">50 / 50</SelectItem>
          <SelectItem value="33-67">33 / 67</SelectItem>
          <SelectItem value="67-33">67 / 33</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ColumnEditor label="Left column" blocks={left} onChange={(next) => setColumn("left", next)} />
        <ColumnEditor label="Right column" blocks={right} onChange={(next) => setColumn("right", next)} />
      </div>
    </div>
  );
}

function ColumnEditor({
  label,
  blocks,
  onChange,
}: {
  label: string;
  blocks: InnerBlock[];
  onChange: (next: InnerBlock[]) => void;
}) {
  const update = (index: number, next: InnerBlock) => {
    const copy = blocks.slice();
    copy[index] = next;
    onChange(copy);
  };
  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const copy = blocks.slice();
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };
  const add = (type: BlockType) => {
    const fresh = createBlock(type) as InnerBlock;
    onChange([...blocks, fresh]);
  };

  return (
    <div className="border-2 border-dashed rounded p-2 space-y-2 min-h-32">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="space-y-2">
        {blocks.map((inner, index) => (
          <InnerBlockEditor
            key={inner.id}
            block={inner}
            onChange={(next) => update(index, next)}
            onRemove={() => remove(index)}
            onMoveUp={() => move(index, -1)}
            onMoveDown={() => move(index, 1)}
            canMoveUp={index > 0}
            canMoveDown={index < blocks.length - 1}
          />
        ))}
      </div>
      <AddInnerBlock onAdd={add} />
    </div>
  );
}

function AddInnerBlock({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add block
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1">
        <div className="space-y-0.5">
          {INNER_BLOCK_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted"
            >
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ContactFormEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "contact_form" }>;
  onChange: (b: Block) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={block.props.heading}
        onChange={(e) => patchProps(block, { heading: e.target.value }, onChange)}
        placeholder="Heading shown above the form"
      />
      <Textarea
        value={block.props.subheading}
        onChange={(e) => patchProps(block, { subheading: e.target.value }, onChange)}
        placeholder="Subheading (optional)"
        rows={2}
      />
      <p className="text-xs text-muted-foreground">
        Submissions go to the same place as the main /contact form — you'll see
        them under Submissions in the admin.
      </p>
    </div>
  );
}

function EmbedEdit({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "embed" }>;
  onChange: (b: Block) => void;
}) {
  const provider = block.props.url ? detectEmbedProvider(block.props.url) : null;
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="embed_url">Embed URL</Label>
        <Input
          id="embed_url"
          value={block.props.url}
          onChange={(e) => patchProps(block, { url: e.target.value }, onChange)}
          placeholder="https://docs.google.com/forms/…"
        />
        {provider && (
          <p
            className={cn(
              "text-xs mt-1 flex items-center gap-1 text-green-700",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Recognized provider: {provider}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Paste a URL (not an iframe tag). Works with Google Forms, Typeform,
          Calendly, Airtable, Notion. Other URLs may be blocked by their sites.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="embed_height">Height (px)</Label>
          <Input
            id="embed_height"
            type="number"
            min={200}
            max={2000}
            value={block.props.height}
            onChange={(e) =>
              patchProps(
                block,
                { height: Math.max(200, Math.min(2000, Number(e.target.value) || 600)) },
                onChange,
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="embed_caption">Caption (optional)</Label>
          <Input
            id="embed_caption"
            value={block.props.caption}
            onChange={(e) => patchProps(block, { caption: e.target.value }, onChange)}
          />
        </div>
      </div>
    </div>
  );
}
