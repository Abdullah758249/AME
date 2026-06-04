import { getSiteSettings } from "@/lib/settings";
import { StaticContent } from "@/components/StaticContent";

export default async function AboutPage() {
  const s = await getSiteSettings();
  return (
    <StaticContent
      titleAr="من نحن"
      titleEn="About Us"
      htmlAr={s.aboutAr ?? ""}
      htmlEn={s.aboutEn ?? ""}
    />
  );
}
