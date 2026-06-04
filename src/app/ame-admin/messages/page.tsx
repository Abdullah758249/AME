import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { MessagesClient } from "@/components/admin/MessagesClient";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <AdminShell title="رسائل التواصل">
      <MessagesClient messages={messages} />
    </AdminShell>
  );
}
