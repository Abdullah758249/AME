"use client";

import { saveSubsidiary, deleteSubsidiary } from "@/lib/admin-actions";
import { CmsEntityForm, type CmsEntityData } from "./CmsEntityForm";
import type { Subsidiary } from "@prisma/client";

export function SubsidiaryEditor({ item }: { item?: Subsidiary }) {
  const initial: CmsEntityData = {
    slug: item?.slug ?? "",
    titleAr: item?.nameAr ?? "",
    titleEn: item?.nameEn ?? "",
    summaryAr: item?.summaryAr ?? "",
    summaryEn: item?.summaryEn ?? "",
    contentAr: item?.contentAr ?? "",
    contentEn: item?.contentEn ?? "",
    logoUrl: item?.logoUrl ?? "",
    websiteUrl: item?.websiteUrl ?? "",
    published: item?.published ?? false,
    sortOrder: item?.sortOrder ?? 0,
  };

  return (
    <CmsEntityForm
      variant="subsidiary"
      initial={initial}
      publicPath={item ? `/subsidiaries/${item.slug}` : undefined}
      onSave={(data, csrf) =>
        saveSubsidiary(item?.id ?? null, {
          slug: data.slug,
          nameAr: data.titleAr,
          nameEn: data.titleEn,
          summaryAr: data.summaryAr,
          summaryEn: data.summaryEn,
          contentAr: data.contentAr,
          contentEn: data.contentEn,
          logoUrl: data.logoUrl,
          websiteUrl: data.websiteUrl,
          published: data.published,
          sortOrder: data.sortOrder ?? 0,
        }, csrf)
      }
      onDelete={item ? (csrf) => deleteSubsidiary(item.id, csrf) : undefined}
    />
  );
}
