export type Locale = "ar" | "en";

export function pickLocale(
  locale: Locale,
  ar: string | null | undefined,
  en: string | null | undefined,
  fallback = ""
): string {
  const value = locale === "ar" ? ar : en;
  if (value?.trim()) return value;
  const alt = locale === "ar" ? en : ar;
  return alt?.trim() ?? fallback;
}
