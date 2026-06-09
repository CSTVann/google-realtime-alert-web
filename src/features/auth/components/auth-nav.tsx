"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/auth-provider";
import { isAdmin } from "@/lib/auth";

export function AuthNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="h-10 w-24 animate-pulse rounded-full bg-white/60" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
          Sign in
        </Link>
        <Link href="/register" className="btn-primary px-4 py-2 text-sm">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="hidden font-mono text-xs text-muted lg:block">
        {user.credits_balance} credits
      </p>
      <Link
        href="/account"
        className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] sm:inline-flex"
      >
        Account
      </Link>
      {isAdmin(user) ? (
        <Link
          href="/admin/users"
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] sm:inline-flex"
        >
          Users
        </Link>
      ) : null}
      <p className="hidden text-sm text-muted md:block">
        {user.first_name} {user.last_name}
      </p>
      <button
        type="button"
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="btn-secondary px-4 py-2 text-sm"
      >
        Log out
      </button>
    </div>
  );
}
