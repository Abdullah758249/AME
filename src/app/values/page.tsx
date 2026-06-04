import { getSiteSettings } from "@/lib/settings";
import { StaticContent } from "@/components/StaticContent";

export default async function ValuesPage() {
  const s = await getSiteSettings();
  return (
    <StaticContent
      titleAr="القيم"
      titleEn="Values"
      htmlAr={s.valuesAr ?? ""}
      htmlEn={s.valuesEn ?? ""}
    />
  );
}
