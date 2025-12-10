// src/app/page.tsx
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">next-news — тест подключения к БД</h1>

      {posts.length === 0 && <p>Пока нет постов.</p>}

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border rounded-lg px-4 py-3 bg-white/5">
            <div className="font-semibold">{post.title}</div>
            <div className="text-xs text-gray-400">{post.createdAt.toISOString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
