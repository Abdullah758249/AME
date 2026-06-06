import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const countries = await prisma.pageVisit.groupBy({
      by: ["country"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

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