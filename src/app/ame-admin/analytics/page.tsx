// src/app/ame-admin/analytics/page.tsx
import { getAdminSession } from "@/lib/server/session";
import { getCsrfToken } from "@/lib/server/csrf";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AnalyticsClient } from "./AnalyticsClient";
import { getAnalyticsSummary } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const user = await getAdminSession();
  if (!user) redirect("/ame-admin/login");
  const csrfToken = await getCsrfToken();

  // جلب البيانات الأولية من قاعدة البيانات مباشرة
  const initialStats = await getAnalyticsSummary();

  // تمرير البيانات إلى مكون العميل
  return (
    <AdminShell title="لوحة تحليل الزيارات" user={user} csrfToken={csrfToken}>
      <AnalyticsClient initialStats={initialStats} />
    </AdminShell>
  );
}