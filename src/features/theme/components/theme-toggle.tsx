"use client";

import { useTheme } from "@/features/theme/theme-provider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-xs font-mono">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded-full px-3 py-1.5 transition ${
          (theme === "light" || (theme === "system" && resolvedTheme === "light"))
            ? "bg-[var(--accent)] text-[var(--accent-fg)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`rounded-full px-3 py-1.5 transition ${
          (theme === "dark" || (theme === "system" && resolvedTheme === "dark"))
            ? "bg-[var(--accent)] text-[var(--accent-fg)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`rounded-full px-3 py-1.5 transition ${
          theme === "system"
            ? "bg-[var(--accent)] text-[var(--accent-fg)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        Auto
      </button>
    </div>
  );
}
