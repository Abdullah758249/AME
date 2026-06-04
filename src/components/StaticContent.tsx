"use client";

import { ContentPage } from "./ContentPage";
import { sanitizeHtml } from "@/lib/sanitize";

export function StaticContent({
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
  const wrap = (t: string) =>
    t.includes("<") ? sanitizeHtml(t) : `<p>${t.replace(/\n/g, "</p><p>")}</p>`;

  return (
    <ContentPage
      titleAr={titleAr}
      titleEn={titleEn}
      htmlAr={wrap(htmlAr)}
      htmlEn={wrap(htmlEn)}
    />
  );
}
