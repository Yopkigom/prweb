"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Site navigation lives inside the sticky blue header. The current section is
// filled cream (resume poster button); the rest are outlined.
const NAV_ITEMS = [
  { href: "/", label: "쇼케이스" },
  { href: "/projects/", label: "프로젝트" },
  { href: "/about/", label: "경력 · 특허 · 수상" },
  { href: "/ask/", label: "Ask AI에게 질문하기" },
] as const;

const ACTIVE_CLASS =
  "rounded-lg bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white";
const INACTIVE_CLASS =
  "rounded-lg border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-brand";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="사이트 메뉴" className="flex flex-wrap gap-2 sm:gap-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={active ? ACTIVE_CLASS : INACTIVE_CLASS}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
