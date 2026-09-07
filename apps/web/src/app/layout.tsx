import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";
import "./globals.css";

const SITE_URL = "https://prweb.yopkigom.workers.dev";
const SITE_DESCRIPTION =
  "Unity 실시간 클라이언트 16년, AI 제품 개발 리드. llama.cpp · ONNX · Unity Sentis 온디바이스 AI와 생성 AI 제품 테크리드 포트폴리오.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "신호정 — Unity · On-Device AI · Tech Lead",
    template: "%s | 신호정",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Unity",
    "On-Device AI",
    "llama.cpp",
    "ONNX",
    "Unity Sentis",
    "Tech Lead",
    "AI 제품 개발",
    "포트폴리오",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "신호정 포트폴리오",
    title: "신호정 — Unity · On-Device AI · Tech Lead",
    description: SITE_DESCRIPTION,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "신호정 — Unity · On-Device AI · Tech Lead",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
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
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <Link
                href="/"
                className="-m-2 shrink-0 whitespace-nowrap p-2 font-semibold tracking-tight"
              >
                신호정
              </Link>
              <div className="flex items-center gap-3 sm:gap-6">
                <ul className="flex gap-3 whitespace-nowrap text-sm text-zinc-600 sm:gap-6 dark:text-zinc-400">
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
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
            {children}
          </main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-zinc-500">
              <span>© 2026 신호정 · Built with Next.js, deployed on Cloudflare Workers</span>
              <span className="flex gap-4">
                <a
                  href="mailto:seenjeonga@gmail.com"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Email
                </a>
                <a
                  href="https://github.com/Yopkigom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  GitHub
                </a>
              </span>
            </div>
          </footer>
        </ThemeProvider>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={'{"token": "4ada3b1e24384a51b9f898c339127d64"}'}
        />
      </body>
    </html>
  );
}
