"use client";

import { SafeImage } from "./SafeImage";
import { isDisplayableMediaUrl } from "@/lib/media-url";
import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";

type Leader = {
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  bioAr: string | null;
  bioEn: string | null;
  imageUrl: string | null;
};

export function LeadershipView({ leaders }: { leaders: Leader[] }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold md:text-4xl">
        {isAr ? "الإدارة والقيادة" : "Leadership"}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--ame-muted)]">
        {isAr
          ? "بيانات القيادة الحالية للشركة كما هي مسجلة في النظام."
          : "Current company leadership as recorded in the system."}
      </p>
      <div className="mt-12 space-y-10">
        {leaders.map((l, i) => (
          <article
            key={i}
            className="flex flex-col gap-6 rounded-2xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-8 md:flex-row"
          >
            {isDisplayableMediaUrl(l.imageUrl) && (
              <SafeImage
                src={l.imageUrl}
                alt={pickLocale(locale, l.nameAr, l.nameEn)}
                width={160}
                height={160}
                className="h-40 w-40 rounded-xl object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold">
                {pickLocale(locale, l.nameAr, l.nameEn)}
              </h2>
              <p className="mt-2 text-[var(--ame-gold)]">
                {pickLocale(locale, l.titleAr, l.titleEn)}
              </p>
              {(l.bioAr || l.bioEn) && (
                <div
                  className="prose-ame mt-4"
                  dangerouslySetInnerHTML={{
                    __html: pickLocale(locale, l.bioAr, l.bioEn),
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
