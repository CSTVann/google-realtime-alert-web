"use client";

import { useTheme } from "@/features/theme/theme-provider";

const options = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "Auto" },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function isActive(value: (typeof options)[number]["value"]) {
    if (value === "system") return theme === "system";
    if (value === "light") return theme === "light" || (theme === "system" && resolvedTheme === "light");
    return theme === "dark" || (theme === "system" && resolvedTheme === "dark");
  }

  return (
    <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5 text-xs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={`rounded-md px-2.5 py-1.5 font-medium transition ${
            isActive(option.value)
              ? "bg-[var(--surface-muted)] text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
