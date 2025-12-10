// src/lib/categories.ts
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type CategoryNavItem = {
  id: number;
  slug: string;
  title: string; // то, что будет показываться в меню
};

export const getCategoriesCached = unstable_cache(
  async (): Promise<CategoryNavItem[]> => {
    // подстраиваемся под твою реальную схему Category
    const categories = await prisma.category.findMany({
      // если хочешь фильтровать только активные — оставь isActive, иначе убери весь where
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }, // если есть sortOrder, иначе можешь поменять на name
      select: {
        id: true,
        slug: true,
        name: true, // ВАЖНО: берем name, а не title
      },
    });

    // маппим name -> title, чтобы в остальном коде работать с title
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.name,
    }));
  },
  ["categories-nav"],
  {
    revalidate: 60 * 60, // час
    tags: ["categories"],
  }
);
