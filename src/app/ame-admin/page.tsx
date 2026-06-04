import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [messages, pages, subs, projects, news] = await Promise.all([
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.page.count(),
    prisma.subsidiary.count(),
    prisma.project.count(),
    prisma.newsArticle.count({ where: { published: true } }),
  ]);

  return (
    <AdminShell title="لوحة التحكم">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="رسائل غير مقروءة" value={String(messages)} href="/ame-admin/messages" />
        <Card title="صفحات CMS" value={String(pages)} href="/ame-admin/pages" />
        <Card title="شركات تابعة" value={String(subs)} href="/ame-admin/subsidiaries" />
        <Card title="مشاريع" value={String(projects)} href="/ame-admin/projects" />
        <Card title="أخبار منشورة" value={String(news)} href="/ame-admin/news" />
        <Card title="الإحصائيات" value="→" href="/ame-admin/analytics" />
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        جميع الأرقام أعلاه من قاعدة البيانات الفعلية — وليست بيانات تجريبية.
      </p>
    </AdminShell>
  );
}

function Card({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-sky-800"
    >
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}
