import { supabase } from "@/integrations/supabase/client";

/** Maximum number of times AI may write/rewrite a single post. */
export const AI_USE_LIMIT = 5;

export type AiMode = "write" | "rewrite";

export interface AiResult {
  content: string;
  mode: AiMode;
  aiUses: number;
  remaining: number;
  limit: number;
}

/**
 * Asks the `improve-article` edge function to draft or rewrite a post body.
 * The 5-uses-per-post limit is enforced server-side.
 */
export async function generateArticleContent(params: {
  postId: string;
  mode: AiMode;
  instructions?: string;
}): Promise<AiResult> {
  const { data, error } = await supabase.functions.invoke<AiResult>(
    "improve-article",
    { body: params },
  );

  if (error) {
    // Non-2xx responses arrive as FunctionsHttpError with the Response in
    // `context` — read the JSON body to surface the real reason.
    let message = error.message || "The AI request failed.";
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const body = await context.json();
        if (body?.error) message = body.error;
      } catch {
        /* fall back to the generic message */
      }
    }
    throw new Error(message);
  }

  if (!data) throw new Error("The AI request returned no content.");
  return data;
}
