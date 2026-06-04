/** Normalize URLs saved from admin — reject local file paths pasted by mistake */
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  if (trimmed.startsWith("file:")) return null;
  if (trimmed.startsWith("C:\\") || trimmed.startsWith("D:\\") || trimmed.startsWith("/Users/")) {
    return null;
  }

  if (trimmed.startsWith("/uploads/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

  return null;
}

export function isDisplayableMediaUrl(url: string | null | undefined): boolean {
  return normalizeMediaUrl(url) !== null;
}
