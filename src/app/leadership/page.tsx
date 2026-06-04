import { prisma } from "@/lib/prisma";
import { LeadershipView } from "@/components/LeadershipView";

export default async function LeadershipPage() {
  const leaders = await prisma.leadership.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return <LeadershipView leaders={leaders} />;
}
