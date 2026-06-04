import { prisma } from "./prisma";
import type { SiteSettings } from "@prisma/client";

export async function getSiteSettings(): Promise<SiteSettings> {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}
