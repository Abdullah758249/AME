import { prisma } from "@/lib/prisma";
import { NewsList } from "@/components/NewsList";

export default async function NewsPage() {
  const items = await prisma.newsArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return <NewsList items={items} />;
}
