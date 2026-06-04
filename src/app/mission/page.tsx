import { getSiteSettings } from "@/lib/settings";
import { StaticContent } from "@/components/StaticContent";

export default async function MissionPage() {
  const s = await getSiteSettings();
  return (
    <StaticContent
      titleAr="الرسالة"
      titleEn="Mission"
      htmlAr={s.missionAr ?? ""}
      htmlEn={s.missionEn ?? ""}
    />
  );
}
