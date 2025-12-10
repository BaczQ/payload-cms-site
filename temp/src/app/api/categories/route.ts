// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[GET /api/categories] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
