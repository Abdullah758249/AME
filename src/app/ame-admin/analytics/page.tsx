"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download, TrendingUp, Eye, MousePointer, Users } from "lucide-react";

// تعريف الأنواع
interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
}

interface PageStat {
  path: string;
  count: number;
}

interface SourceStat {
  source: string;
  count: number;
}

interface CountryStat {
  country: string;
  count: number;
}

interface BrowserStat {
  browser: string;
  count: number;
}

interface OsStat {
  os: string;
  count: number;
}

interface AnalyticsData {
  today: number;
  week: number;
  month: number;
  total: number;
  topPages: PageStat[];
  sources: SourceStat[];
  countries: CountryStat[];
  browsers?: BrowserStat[];
  os?: OsStat[];
}

// ألوان ثابتة للرسوم البيانية
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5D6D7E"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "week" | "month" | "all">("all");

  useEffect(() => {
    fetch(`/ame-admin/api/analytics?period=${period}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [period]);

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["الصفحة", "الزيارات"],
      ...data.topPages.map((p) => [p.path, p.count]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${period}_${new Date().toISOString()}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <AdminShell title="إحصائيات الزيارات">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-zinc-400">جاري تحميل الإحصائيات...</div>
        </div>
      </AdminShell>
    );
  }

  if (!data || data.total === 0) {
    return (
      <AdminShell title="إحصائيات الزيارات">
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-8 text-center text-amber-200">
          لا توجد زيارات مسجلة بعد. ستظهر الإحصائيات تلقائيًا عند زيارة الموقع العام.
        </div>
      </AdminShell>
    );
  }

  const stats: Stat[] = [
    { label: "اليوم", value: data.today, icon: <Eye className="h-5 w-5 text-blue-400" /> },
    { label: "هذا الأسبوع", value: data.week, icon: <TrendingUp className="h-5 w-5 text-green-400" /> },
    { label: "هذا الشهر", value: data.month, icon: <MousePointer className="h-5 w-5 text-purple-400" /> },
    { label: "الإجمالي", value: data.total, icon: <Users className="h-5 w-5 text-pink-400" /> },
  ];

  return (
    <AdminShell title="لوحة تحليل الزيارات">
      {/* شريط الأدوات */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          {(["today", "week", "month", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg transition ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {p === "today" && "اليوم"}
              {p === "week" && "آخر 7 أيام"}
              {p === "month" && "آخر 30 يومًا"}
              {p === "all" && "كل الوقت"}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
        >
          <Download className="h-4 w-4" /> تصدير CSV
        </button>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-lg transition-all hover:scale-[1.02] hover:border-zinc-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-zinc-800 p-2">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* أكثر الصفحات زيارة + مصادر الزيارات */}
      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" /> أكثر الصفحات زيارة
          </h2>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2">
              {data.topPages.slice(0, 10).map((page, i) => (
                <div key={page.path} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-sm font-mono text-zinc-300 truncate max-w-[70%]">{page.path}</span>
                  <span className="text-sm font-bold text-blue-400">{page.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MousePointer className="h-5 w-5" /> مصادر الزيارات
          </h2>
          {data.sources.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2">
              {data.sources.map((src) => (
                <div key={src.source} className="flex justify-between items-center">
                  <span className="text-sm text-zinc-300">{src.source}</span>
                  <span className="text-sm font-bold text-green-400">{src.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* الدول - مع رسم بياني دائري */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🌍 توزيع الزيارات حسب الدول
        </h2>
        {data.countries.length === 0 ? (
          <p className="text-sm text-zinc-500">
            لا توجد بيانات دول (يتطلب رأس CDN مثل cf-ipcountry أو x-vercel-ip-country في الإنتاج)
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.countries}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {data.countries.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.countries.map((c) => (
                <div key={c.country} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <span className="text-xl">{getFlagEmoji(c.country)}</span> {c.country}
                  </span>
                  <span className="text-sm font-bold text-purple-400">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* المتصفحات وأنظمة التشغيل (إذا كانت متوفرة) */}
      {(data.browsers?.length || data.os?.length) && (
        <div className="grid gap-8 lg:grid-cols-2">
          {data.browsers && data.browsers.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="text-lg font-semibold text-white mb-4">🌐 المتصفحات</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.browsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="browser" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {data.os && data.os.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="text-lg font-semibold text-white mb-4">💿 أنظمة التشغيل</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.os}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="os" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F472B6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

// دالة مساعدة لإرجاع إيموجي العلم بناءً على كود الدولة
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}