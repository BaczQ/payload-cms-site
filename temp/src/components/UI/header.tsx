// src/components/UI/header.tsx
import { prisma } from "@/lib/prisma";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      name: true,
      slug: true,
    },
  });

  const items =
    categories.length > 0
      ? categories.map((c) => ({
          label: c.name,
          href: `/${c.slug}`,
        }))
      : [
          // fallback, если БД пустая
          { label: "USA", href: "/us" },
          { label: "World", href: "/world" },
          { label: "Politics", href: "/politics" },
          { label: "Business", href: "/business" },
        ];

  return <HeaderClient items={items} />;
}
