import { AdminShell } from "@/components/admin/AdminShell";
import { getAnalyticsSummary } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const stats = await getAnalyticsSummary();

  return (
    <AdminShell title="إحصائيات الزيارات (حقيقية)">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="اليوم" value={stats.today} />
        <Stat label="هذا الأسبوع" value={stats.week} />
        <Stat label="هذا الشهر" value={stats.month} />
        <Stat label="إجمالي الزيارات" value={stats.total} />
      </div>

      {stats.total === 0 && (
        <p className="mt-8 rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 text-amber-200">
          لا توجد زيارات مسجلة بعد. ستظهر الإحصائيات تلقائيًا عند زيارة الموقع العام.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">أكثر الصفحات زيارة</h2>
        {stats.topPages.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">لا توجد بيانات</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="text-start py-2">المسار</th>
                <th className="text-end py-2">الزيارات</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPages.map((p) => (
                <tr key={p.path} className="border-t border-zinc-800">
                  <td className="py-2">{p.path}</td>
                  <td className="py-2 text-end">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">مصادر الزيارات</h2>
          {stats.sources.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">لا توجد بيانات</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {stats.sources.map((s) => (
                <li key={s.source} className="flex justify-between">
                  <span>{s.source}</span>
                  <span>{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">الدول</h2>
          {stats.countries.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">
              لا توجد بيانات دول (يتطلب رأس CDN مثل cf-ipcountry أو x-vercel-ip-country في الإنتاج)
            </p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {stats.countries.map((c) => (
                <li key={c.country} className="flex justify-between">
                  <span>{c.country}</span>
                  <span>{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
