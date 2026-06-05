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
  // هنا مكانها الصحيح والمباشر في الإصدارات الجديدة من Next.js
  serverExternalPackages: ['html-encoding-sniffer', '@exodus/bytes', 'isomorphic-dompurify'],
  
  // تجميع ومعالجة حزم الطرف المشتري لضمان التوافق
  transpilePackages: ['html-encoding-sniffer', '@exodus/bytes'],
};

export default nextConfig;