import { prisma } from "@/lib/prisma";
import { SubsidiariesList } from "@/components/SubsidiariesList";

export default async function SubsidiariesPage() {
  const items = await prisma.subsidiary.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return <SubsidiariesList items={items} />;
}
