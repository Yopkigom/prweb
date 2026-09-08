import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
        <footer className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-zinc-500">
            <span>© 2026 신호정 · Built with Next.js, deployed on Cloudflare Workers</span>
            <span className="flex gap-4">
              <a href="mailto:seenjeonga@gmail.com" className="hover:text-brand transition-colors">
                Email
              </a>
              <a
                href="https://github.com/Yopkigom"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors"
              >
                GitHub
              </a>
            </span>
          </div>
        </footer>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={'{"token": "4ada3b1e24384a51b9f898c339127d64"}'}
        />
      </body>
    </html>
  );
}
