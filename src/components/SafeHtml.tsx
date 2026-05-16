import DOMPurify from "dompurify";
import { useMemo } from "react";

/**
 * Renders editor-authored HTML after sanitizing it with DOMPurify.
 * Used for article and press-release bodies on the public site and in preview.
 */
export function SafeHtml({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(() => DOMPurify.sanitize(html), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
