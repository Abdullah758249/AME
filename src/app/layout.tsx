import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { Suspense } from "react";
import { VisitTracker } from "@/components/VisitTracker";
import { getAdminPath } from "@/lib/config";

// تحديد رابط الموقع الأساسي (غيّره إذا كان رابطك مختلفًا)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ame-m7c2.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(BASE_URL), // مهم جدًا للروابط الأساسية
    title: {
      default: settings.companyNameEn || "AME",
      template: `%s | ${settings.companyNameEn || "AME"}`,
    },
    description:
      settings.metaDescriptionAr ??
      settings.metaDescriptionEn ??
      "AME — شركة قابضة واستثمارية في مرحلة التأسيس",
    keywords: ["AME", "شركة قابضة", "استثمار", "Holding", "Investment"],
    authors: [{ name: "عبدالله محمد إمام" }],
    openGraph: {
      title: settings.companyNameEn || "AME",
      description:
        settings.metaDescriptionAr ??
        "AME — شركة قابضة واستثمارية تهدف لبناء وتطوير مشاريع وشركات متعددة.",
      url: BASE_URL,
      siteName: "AME",
      locale: "ar_EG",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: "AME Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.companyNameEn || "AME",
      description:
        settings.metaDescriptionAr ??
        "AME — شركة قابضة واستثمارية في مرحلة التأسيس",
      images: [`${BASE_URL}/opengraph-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // يمكنك إضافة أكواد التحقق من Google Search Console لاحقًا
      // google: "your-google-verification-code",
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const adminBase = getAdminPath().replace(/\/$/, "");
  const isAdmin = pathname.startsWith(adminBase);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`min-h-screen antialiased ${
          isAdmin ? "bg-zinc-950 text-zinc-100" : ""
        }`}
      >
        {isAdmin ? (
          children
        ) : (
          <ThemeProvider>
            <LocaleProvider>
              <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
              <Suspense fallback={null}>
                <VisitTracker />
              </Suspense>
            </LocaleProvider>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}

async function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [settings, navItems] = await Promise.all([
    getSiteSettings(),
    prisma.navItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <PublicShell settings={settings} navItems={navItems}>
      {children}
    </PublicShell>
  );
}