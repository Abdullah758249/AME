import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ame-m7c2.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // الصفحات الثابتة (عدّلها حسب هيكل موقعك)
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/vision`, lastModified: new Date() },
    { url: `${BASE_URL}/mission`, lastModified: new Date() },
    { url: `${BASE_URL}/values`, lastModified: new Date() },
    { url: `${BASE_URL}/leadership`, lastModified: new Date() },
    { url: `${BASE_URL}/subsidiaries`, lastModified: new Date() },
    { url: `${BASE_URL}/projects`, lastModified: new Date() },
    { url: `${BASE_URL}/news`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
  ];

  // إذا كان عندك صفحات ديناميكية (شركات تابعة، مشاريع، أخبار) هاتها من قاعدة البيانات وأضفها هنا
  // يمكنك عمل fetch داخل هذه الدالة لأنها server-side

  return staticRoutes;
}