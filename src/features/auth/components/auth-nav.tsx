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
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 sm:inline-flex"
      >
        Account
      </Link>
      {isAdmin(user) ? (
        <Link
          href="/admin/users"
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 sm:inline-flex"
        >
          Users
        </Link>
      ) : null}
      <p className="hidden text-sm text-slate-600 md:block">
        {user.first_name} {user.last_name}
      </p>
      <button
        type="button"
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-950 hover:text-white"
      >
        Log out
      </button>
    </div>
  );
}
