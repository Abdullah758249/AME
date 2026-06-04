"use client";

import { saveNews, deleteNews } from "@/lib/admin-actions";
import { CmsEntityForm, type CmsEntityData } from "./CmsEntityForm";
import type { NewsArticle } from "@prisma/client";

export function NewsEditor({ item }: { item?: NewsArticle }) {
  const initial: CmsEntityData = {
    slug: item?.slug ?? "",
    titleAr: item?.titleAr ?? "",
    titleEn: item?.titleEn ?? "",
    summaryAr: item?.excerptAr ?? "",
    summaryEn: item?.excerptEn ?? "",
    contentAr: item?.contentAr ?? "",
    contentEn: item?.contentEn ?? "",
    imageUrl: item?.imageUrl ?? "",
    published: item?.published ?? false,
    publishedAt: item?.publishedAt?.toISOString() ?? null,
  };

  return (
    <CmsEntityForm
      variant="news"
      initial={initial}
      publicPath={item ? `/news/${item.slug}` : undefined}
      onSave={(data, csrf) =>
        saveNews(item?.id ?? null, {
          slug: data.slug,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          excerptAr: data.summaryAr,
          excerptEn: data.summaryEn,
          contentAr: data.contentAr ?? "",
          contentEn: data.contentEn ?? "",
          imageUrl: data.imageUrl,
          published: data.published,
          publishedAt: data.publishedAt,
        }, csrf)
      }
      onDelete={item ? (csrf) => deleteNews(item.id, csrf) : undefined}
    />
  );
}
