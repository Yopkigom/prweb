import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "신호정 — Unity & On-Device AI Engineer",
    template: "%s | 신호정",
  },
  description:
    "15년 실서비스 Unity 경험으로 On-Device AI를 만듭니다. ExecuTorch · llama.cpp · Unity Sentis · TFLite 포트폴리오.",
};

const NAV_ITEMS = [
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
  { href: "/ask/", label: "Ask AI" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              신호정
            </Link>
            <ul className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500">
            © 2026 신호정 · Built with Next.js, deployed on Cloudflare Workers
          </div>
        </footer>
      </body>
    </html>
  );
}
