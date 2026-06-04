"use client";

import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";

export function ContentPage({
  titleAr,
  titleEn,
  htmlAr,
  htmlEn,
}: {
  titleAr: string;
  titleEn: string;
  htmlAr: string;
  htmlEn: string;
}) {
  const { locale } = useLocale();
  const title = pickLocale(locale, titleAr, titleEn);
  const html = pickLocale(locale, htmlAr, htmlEn);

  return (
    <article className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <div
        className="prose-ame mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
