"use client";

import { saveProject, deleteProject } from "@/lib/admin-actions";
import { CmsEntityForm, type CmsEntityData } from "./CmsEntityForm";
import type { Project } from "@prisma/client";

export function ProjectEditor({ item }: { item?: Project }) {
  const initial: CmsEntityData = {
    slug: item?.slug ?? "",
    titleAr: item?.titleAr ?? "",
    titleEn: item?.titleEn ?? "",
    summaryAr: item?.summaryAr ?? "",
    summaryEn: item?.summaryEn ?? "",
    contentAr: item?.contentAr ?? "",
    contentEn: item?.contentEn ?? "",
    imageUrl: item?.imageUrl ?? "",
    statusAr: item?.statusAr ?? "",
    statusEn: item?.statusEn ?? "",
    published: item?.published ?? false,
    sortOrder: item?.sortOrder ?? 0,
  };

  return (
    <CmsEntityForm
      variant="project"
      initial={initial}
      publicPath={item ? `/projects/${item.slug}` : undefined}
      onSave={(data, csrf) =>
        saveProject(item?.id ?? null, {
          slug: data.slug,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          summaryAr: data.summaryAr,
          summaryEn: data.summaryEn,
          contentAr: data.contentAr,
          contentEn: data.contentEn,
          imageUrl: data.imageUrl,
          statusAr: data.statusAr,
          statusEn: data.statusEn,
          published: data.published,
          sortOrder: data.sortOrder ?? 0,
        }, csrf)
      }
      onDelete={item ? (csrf) => deleteProject(item.id, csrf) : undefined}
    />
  );
}
