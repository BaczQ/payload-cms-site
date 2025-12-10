import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/UI/header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: siteConfig.seoTitle,
  description: siteConfig.seoDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
