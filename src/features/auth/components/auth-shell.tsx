import Link from "next/link";
import type { ReactNode } from "react";

import { AppLogo } from "@/features/ui/app-logo";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <AppLogo />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="btn-secondary px-3 py-2">
              Home
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="panel w-full max-w-md p-8">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 text-center text-sm text-muted">{footer}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
