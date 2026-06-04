import { prisma } from "@/lib/prisma";
import { ProjectsList } from "@/components/ProjectsList";

export default async function ProjectsPage() {
  const items = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return <ProjectsList items={items} />;
}
