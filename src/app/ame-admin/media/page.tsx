import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { MediaUploadClient } from "@/components/admin/MediaUploadClient";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="الوسائط">
      <MediaUploadClient media={media} />
    </AdminShell>
  );
}
