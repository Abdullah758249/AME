import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { email: true } } },
  });

  return (
    <AdminShell title="سجل العمليات الإدارية">
      {logs.length === 0 ? (
        <p className="text-zinc-500">لا توجد عمليات مسجلة بعد.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500">
              <th className="py-2 text-start">الوقت</th>
              <th className="py-2 text-start">المستخدم</th>
              <th className="py-2 text-start">الإجراء</th>
              <th className="py-2 text-start">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-zinc-800">
                <td className="py-2">{new Date(l.createdAt).toLocaleString("ar-EG")}</td>
                <td className="py-2">{l.user?.email ?? "—"}</td>
                <td className="py-2">{l.action}</td>
                <td className="py-2 text-zinc-400">
                  {[l.entity, l.entityId, l.details].filter(Boolean).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
