import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ame-m7c2.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ame-admin/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}