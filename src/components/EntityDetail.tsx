"use client";

import { SafeImage } from "./SafeImage";
import { useLocale } from "./LocaleProvider";
import { isDisplayableMediaUrl } from "@/lib/media-url";
import { pickLocale } from "@/lib/locale";
import { sanitizeHtml } from "@/lib/sanitize";

export function EntityDetail({
  titleAr,
  titleEn,
  summaryAr,
  summaryEn,
  contentAr,
  contentEn,
  imageUrl,
  websiteUrl,
  statusAr,
  statusEn,
  date,
}: {
  titleAr: string;
  titleEn: string;
  summaryAr?: string | null;
  summaryEn?: string | null;
  contentAr?: string | null;
  contentEn?: string | null;
  imageUrl?: string | null;
  websiteUrl?: string | null;
  statusAr?: string | null;
  statusEn?: string | null;
  date?: Date | null;
}) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const title = pickLocale(locale, titleAr, titleEn);
  const summary = pickLocale(locale, summaryAr, summaryEn);
  const content = pickLocale(locale, contentAr, contentEn);
  const status = pickLocale(locale, statusAr, statusEn);

  return (
    <article className="animate-fade-up">
      <button
        type="button"
        onClick={() => history.back()}
        className="text-sm text-[var(--ame-accent)] hover:underline"
      >
        {isAr ? "← رجوع" : "← Back"}
      </button>
      {isDisplayableMediaUrl(imageUrl) && (
        <SafeImage
          src={imageUrl}
          alt={title}
          width={800}
          height={400}
          className="mt-6 max-h-80 w-full rounded-2xl object-cover"
        />
      )}
      {date && (
        <time className="mt-6 block text-sm text-[var(--ame-muted)]">
          {new Date(date).toLocaleDateString(isAr ? "ar-EG" : "en-GB")}
        </time>
      )}
      <h1 className="mt-4 text-3xl font-bold md:text-4xl">{title}</h1>
      {status && <p className="mt-2 text-[var(--ame-gold)]">{status}</p>}
      {summary && (
        <p className="mt-4 text-lg text-[var(--ame-muted)]">{summary}</p>
      )}
      {content && (
        <div
          className="prose-ame mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      )}
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-[var(--ame-accent)] hover:underline"
        >
          {isAr ? "الموقع الإلكتروني" : "Website"}
        </a>
      )}
    </article>
  );
}
