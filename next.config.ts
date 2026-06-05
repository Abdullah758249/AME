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
    // هذا الخيار يمنع السيرفر من عمل Bundle خاطئ للحزم المسببة للأزمة
    serverExternalPackages: ['html-encoding-sniffer', '@exodus/bytes', 'isomorphic-dompurify'],
  },
  // نبقي عليها كإجراء أمان إضافي للـ Client و الـ Build
  transpilePackages: ['html-encoding-sniffer', '@exodus/bytes'],
};

export default nextConfig;