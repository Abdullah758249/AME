import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // هذا السطر يمنع تشتت السيرفر بين أمريكا وأوروبا ويقرب دالات السيرفر من قاعدة البيانات

};

export default nextConfig;