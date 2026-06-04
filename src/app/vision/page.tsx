import { getSiteSettings } from "@/lib/settings";
import { StaticContent } from "@/components/StaticContent";

export default async function VisionPage() {
  const s = await getSiteSettings();
  return (
    <StaticContent
      titleAr="الرؤية"
      titleEn="Vision"
      htmlAr={s.visionAr ?? ""}
      htmlEn={s.visionEn ?? ""}
    />
  );
}
