import { useState } from "react";
import { Sparkles, Loader2, Wand2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AI_USE_LIMIT, generateArticleContent, type AiMode } from "@/lib/ai";

interface AiAssistPanelProps {
  /** Post id, or null when the post has not been saved yet. */
  postId: string | null;
  /** Whether the editor currently has body content to improve. */
  hasBody: boolean;
  /** AI uses already consumed for this post. */
  aiUses: number;
  /** Called with the generated HTML and the new AI-use count. */
  onResult: (html: string, aiUses: number) => void;
}

/** AI writing assistant — drafts or rewrites an article body, capped per post. */
export function AiAssistPanel({
  postId,
  hasBody,
  aiUses,
  onResult,
}: AiAssistPanelProps) {
  const [mode, setMode] = useState<AiMode | null>(null);
  const [instructions, setInstructions] = useState("");
  const [running, setRunning] = useState(false);

  const remaining = Math.max(0, AI_USE_LIMIT - aiUses);
  const exhausted = remaining <= 0;

  const closeDialog = () => {
    if (running) return;
    setMode(null);
    setInstructions("");
  };

  const run = async () => {
    if (!postId || !mode) return;
    if (mode === "write" && !instructions.trim()) {
      toast.error("Describe what the article should cover.");
      return;
    }
    setRunning(true);
    try {
      const result = await generateArticleContent({
        postId,
        mode,
        instructions: instructions.trim() || undefined,
      });
      onResult(result.content, result.aiUses);
      toast.success(
        mode === "write"
          ? "AI drafted your article."
          : "AI improved your article.",
        {
          description: `${result.remaining} of ${AI_USE_LIMIT} AI uses left for this post. Remember to save.`,
        },
      );
      setMode(null);
      setInstructions("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The AI request failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="rounded-md border border-accent/30 bg-accent/5 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">AI writing assistant</span>
        </div>
        <Badge variant={exhausted ? "secondary" : "outline"}>
          {remaining} of {AI_USE_LIMIT} uses left
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Let AI draft a full article or polish what you have written. Limited to{" "}
        {AI_USE_LIMIT} uses per post.
      </p>

      {!postId ? (
        <p className="text-sm text-muted-foreground">
          Save this post once to unlock AI assistance.
        </p>
      ) : exhausted ? (
        <p className="text-sm text-muted-foreground">
          This post has used all {AI_USE_LIMIT} of its AI credits.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMode("write")}
          >
            <PenLine className="h-4 w-4 mr-2" />
            Write with AI
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasBody}
            title={hasBody ? undefined : "Add some content first"}
            onClick={() => setMode("rewrite")}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Improve with AI
          </Button>
        </div>
      )}

      <Dialog open={mode !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "write"
                ? "Write this article with AI"
                : "Improve this article with AI"}
            </DialogTitle>
            <DialogDescription>
              {mode === "write"
                ? "Describe the topic and key points. AI will draft a full article body and replace the current content."
                : "AI will rewrite the current content for clarity, flow and grammar. Add any specific guidance below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="ai-instructions">
              {mode === "write"
                ? "What should the article cover?"
                : "Anything specific? (optional)"}
            </Label>
            <Textarea
              id="ai-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              placeholder={
                mode === "write"
                  ? "e.g. Announce our new ThermalStop product line, who it is for, the key benefits, and a call to action to contact sales."
                  : "e.g. Make it more concise and add a short conclusion."
              }
            />
            <p className="text-xs text-muted-foreground">
              This counts as one of your {AI_USE_LIMIT} AI uses for this post.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={running}
            >
              Cancel
            </Button>
            <Button type="button" onClick={run} disabled={running}>
              {running ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {mode === "write" ? "Draft article" : "Improve article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
