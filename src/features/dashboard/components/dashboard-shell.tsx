"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AuthNav } from "@/features/auth/components/auth-nav";
import { AppLogo } from "@/features/ui/app-logo";

const navigationItems = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
  { label: "Billing", href: "/billing" },
  { label: "About", href: "/about" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <>
      {navigationItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`${className ?? ""} rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[var(--surface-muted)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="btn-secondary flex h-9 w-9 items-center justify-center p-0 md:hidden"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                {mobileOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M4.28 4.22a.75.75 0 011.06 0L10 8.94l4.66-4.72a.75.75 0 111.08 1.04L11.06 10l4.68 4.72a.75.75 0 11-1.08 1.04L10 11.06l-4.68 4.72a.75.75 0 11-1.08-1.04L8.94 10 4.28 5.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M2.75 5.5a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>
            <AppLogo />
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLinks pathname={pathname} />
          </nav>

          <AuthNav />
        </div>

        {mobileOpen ? (
          <nav className="border-t border-[var(--border)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} className="block" />
            </div>
          </nav>
        ) : null}
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
