"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Icons keep the control narrow on phones; text labels return at sm+.
// aria-label carries the accessible name in both modes.
const OPTIONS = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch: the resolved theme is only known client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- documented next-themes mount pattern
    setMounted(true);
  }, []);

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-zinc-300 p-0.5 text-xs dark:border-zinc-700"
      role="radiogroup"
      aria-label="테마 선택"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mounted && theme === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={
            mounted && theme === option.value
              ? "rounded-full bg-zinc-900 px-2 py-1 text-white sm:px-2.5 dark:bg-zinc-100 dark:text-zinc-900"
              : "rounded-full px-2 py-1 text-zinc-500 hover:text-zinc-900 sm:px-2.5 dark:hover:text-zinc-100"
          }
        >
          <span className="sm:hidden">{option.icon}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
