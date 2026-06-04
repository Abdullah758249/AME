import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
  "ul", "ol", "li", "a", "blockquote", "span", "div",
  "img", "figure", "figcaption", "hr",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "class", "src", "alt", "title",
  "width", "height", "loading",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:\/uploads\/|https?:\/\/)/i,
  });
}

export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

export function escapeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
