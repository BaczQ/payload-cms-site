// src/components/layout/Footer.tsx
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

const footerLinks = ["Terms of Use", "Privacy Policy", "Manage Cookies", "Ad Choices", "Accessibility", "About", "Newsletters"];

const social = ["Facebook", "X", "Instagram", "YouTube", "LinkedIn"];

export function Footer() {
  return (
    <footer className="mt-10 border-t bg-black text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 text-xs">
        {/* Лого + верхняя строка */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-lg font-bold tracking-tight">
            <span className="text-white">{siteConfig.logoFirstPart}</span>
            <span className="text-gray-400 ml-1">{siteConfig.logoSecondPart}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-wide">
            {footerLinks.map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wide">
            {social.map((item) => (
              <button key={item} type="button" className="hover:text-white transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="border-t border-gray-700 pt-4 text-[11px] text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
          <span>
            © {new Date().getFullYear()}
            {siteConfig.footerCopyright}
          </span>
          <span>{siteConfig.footerTechStack}</span>
        </div>
      </div>
    </footer>
  );
}
