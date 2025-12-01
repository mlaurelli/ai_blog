import { marked } from 'marked';

/**
 * Detects if content is HTML or Markdown
 */
function isHtml(content: string): boolean {
  // Check if content starts with HTML tags
  const htmlPattern = /^\s*<(p|div|h[1-6]|article|section|span)/i;
  return htmlPattern.test(content);
}

/**
 * Converts markdown to HTML if needed, otherwise returns content as-is
 */
export async function ensureHtml(content: string): Promise<string> {
  if (isHtml(content)) {
    return content;
  }
  
  // Configure marked for better HTML output
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
  
  // Convert markdown to HTML
  return marked.parse(content) as string;
}

/**
 * Synchronous version for cases where async is not possible
 */
export function ensureHtmlSync(content: string): string {
  if (isHtml(content)) {
    return content;
  }
  
  // Configure marked for better HTML output
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
  
  // Convert markdown to HTML synchronously
  return marked.parse(content) as string;
}
