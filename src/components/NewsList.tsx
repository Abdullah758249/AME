"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";
import { EmptyState } from "./EmptyState";

type Item = {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string | null;
  excerptEn: string | null;
  publishedAt: Date | null;
};

export function NewsList({ items }: { items: Item[] }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold">{isAr ? "الأخبار" : "News"}</h1>
        <div className="mt-8">
          <EmptyState
            titleAr="لا توجد أخبار منشورة"
            titleEn="No published news"
            descAr="لم يُنشر أي خبر بعد. عند نشر الأخبار من لوحة الإدارة ستظهر هنا."
            descEn="No news has been published yet. When published via the admin panel, items will appear here."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{isAr ? "الأخبار" : "News"}</h1>
      <ul className="mt-10 space-y-6">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/news/${item.slug}`}
              className="block rounded-2xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-6 transition hover:border-[var(--ame-accent)]"
            >
              {item.publishedAt && (
                <time className="text-xs text-[var(--ame-muted)]">
                  {new Date(item.publishedAt).toLocaleDateString(isAr ? "ar-EG" : "en-GB")}
                </time>
              )}
              <h2 className="mt-2 font-semibold">{pickLocale(locale, item.titleAr, item.titleEn)}</h2>
              {(item.excerptAr || item.excerptEn) && (
                <p className="mt-2 text-sm text-[var(--ame-muted)]">
                  {pickLocale(locale, item.excerptAr, item.excerptEn)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
