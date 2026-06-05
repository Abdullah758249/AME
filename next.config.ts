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
  // نتركها هنا فقط لكي يتجاهلها السيرفر تماماً أثناء التشغيل أونلاين
  serverExternalPackages: ['html-encoding-sniffer', '@exodus/bytes', 'isomorphic-dompurify'],
};

export default nextConfig;