import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/storage";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

/** Word-like WYSIWYG editor for article and press-release bodies. Produces HTML. */
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Write your post here. Use the toolbar above to format text and add images.",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Load content that arrives after mount (e.g. editing an existing post).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input p-1.5">
        <ToolbarButton
          label="Bold"
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Divider />
        <ToolbarButton
          label="Heading"
          icon={Heading2}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Subheading"
          icon={Heading3}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <Divider />
        <ToolbarButton
          label="Bullet list"
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <Divider />
        <ToolbarButton
          label="Link"
          icon={Link2}
          active={editor.isActive("link")}
          onClick={setLink}
        />
        <ToolbarButton
          label="Insert image"
          icon={uploading ? Loader2 : ImageIcon}
          iconClassName={uploading ? "animate-spin" : undefined}
          onClick={() => fileInputRef.current?.click()}
        />
        <Divider />
        <ToolbarButton
          label="Undo"
          icon={Undo2}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2}
          onClick={() => editor.chain().focus().redo().run()}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFile}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

interface ToolbarButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  iconClassName?: string;
  onClick: () => void;
}

const ToolbarButton = ({
  label,
  icon: Icon,
  active,
  iconClassName,
  onClick,
}: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={cn("h-8 w-8 p-0", active && "bg-accent text-accent-foreground")}
  >
    <Icon className={cn("h-4 w-4", iconClassName)} />
  </Button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-border" />;
