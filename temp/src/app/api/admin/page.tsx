// src/app/admin/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Admin panel</h1>
      <p className="text-default-500 mb-8">Здесь потом будут управление постами, категориями, тегами и медиатекой.</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">Посты</h2>
          <p className="text-sm text-default-500">Список новостей, создание, редактура, публикация.</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">Категории</h2>
          <p className="text-sm text-default-500">Структура рубрик для меню на сайте.</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">Медиа</h2>
          <p className="text-sm text-default-500">Обложки, картинки, загрузка и переиспользование.</p>
        </div>
      </div>
    </div>
  );
}
