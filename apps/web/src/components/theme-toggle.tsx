"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
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
      className="flex items-center gap-0.5 rounded-full border border-zinc-300 p-0.5 text-xs dark:border-zinc-700"
      role="radiogroup"
      aria-label="테마 선택"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mounted && theme === option.value}
          onClick={() => setTheme(option.value)}
          className={
            mounted && theme === option.value
              ? "rounded-full bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "rounded-full px-2.5 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
