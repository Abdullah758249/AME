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
  // هذا السطر يحل مشكلة تعارض ERR_REQUIRE_ESM ويجعل السيرفر يقرأ الحزم بنجاح
  transpilePackages: ['html-encoding-sniffer', '@exodus/bytes'],
};

export default nextConfig;