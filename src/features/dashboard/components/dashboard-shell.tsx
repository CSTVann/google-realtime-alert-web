import Link from "next/link";
import type { ReactNode } from "react";

import { AuthNav } from "@/features/auth/components/auth-nav";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";

const navigationItems = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
  { label: "Billing", href: "/billing" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent)] font-mono text-sm font-semibold text-[var(--accent-fg)] shadow-lg">
              TA
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-muted">
                Signal ops
              </p>
              <p className="text-lg font-semibold tracking-tight">Trend Alert</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthNav />
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
