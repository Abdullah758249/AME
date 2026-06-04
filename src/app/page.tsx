import { getSiteSettings } from "@/lib/settings";
import { HomeHero } from "@/components/HomeHero";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [settings, newsCount, subCount, projCount] = await Promise.all([
    getSiteSettings(),
    prisma.newsArticle.count({ where: { published: true } }),
    prisma.subsidiary.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
  ]);

  return (
    <HomeHero
      settings={settings}
      hasNews={newsCount > 0}
      hasSubsidiaries={subCount > 0}
      hasProjects={projCount > 0}
    />
  );
}
