import { NextRequest, NextResponse } from "next/server";
import { recordVisit, parseReferrerSource } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  // 1. استخدم الرأس الموثوق من CDN (Vercel/Cloudflare) إن وجد، وإلا فالمعامل
  const trustedCountry = 
    request.headers.get("x-vercel-ip-country") ?? 
    request.headers.get("cf-ipcountry");
  
  // 2. استخدم الرأس الموثوق كمصدر أساسي، وتجاهل ما يرسله العميل إن وجد رأس موثوق
  const country = trustedCountry ?? request.nextUrl.searchParams.get("country") ?? undefined;

  // 3. بقية المعاملات (تأكد من وجودها)
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const referrer = request.nextUrl.searchParams.get("referrer");
  const vid = request.nextUrl.searchParams.get("vid") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  const source = parseReferrerSource(referrer, request.nextUrl.searchParams);

  // 4. تسجيل الزيارة بدون انتظار (تحسين الأداء)
  void recordVisit({
    path: path.slice(0, 500),
    referrer: referrer?.slice(0, 2000) ?? undefined,
    source: source.slice(0, 200),
    country: country?.slice(0, 100),
    userAgent: userAgent?.slice(0, 500),
    sessionId: vid?.slice(0, 64),
  }).catch((err) => {
    // تسجيل الأخطاء في بيئة التطوير فقط
    if (process.env.NODE_ENV === "development") {
      console.error("❌ فشل تسجيل الزيارة:", err);
    }
  });

  return new NextResponse(null, { status: 204 });
}