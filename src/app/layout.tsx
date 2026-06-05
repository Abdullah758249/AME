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
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.companyNameEn,
      template: `%s | ${settings.companyNameEn}`,
    },
    description:
      settings.metaDescriptionAr ??
      settings.metaDescriptionEn ??
      "AME — Holding & investment company",
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
      <body className={`min-h-screen antialiased ${isAdmin ? "bg-zinc-950 text-zinc-100" : ""}`}>
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
        <Analytics />
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
