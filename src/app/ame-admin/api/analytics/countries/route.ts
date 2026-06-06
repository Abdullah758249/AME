import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // تجميع الزيارات حسب الدولة مع العد
    const countries = await prisma.visit.groupBy({
      by: ["country"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 20, // أعلى 20 دولة
    });

    // تنسيق النتيجة
    const result = countries.map((item) => ({
      country: item.country || "غير معروف",
      visits: item._count.id,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching country stats:", error);
    return NextResponse.json({ error: "فشل في جلب الإحصائيات" }, { status: 500 });
  }
}