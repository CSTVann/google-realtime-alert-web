"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/auth-provider";
import { isAdmin } from "@/lib/auth";

export function AuthNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="skeleton h-9 w-20" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="btn-ghost px-3 py-2">
          Sign in
        </Link>
        <Link href="/register" className="btn-primary px-3 py-2">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="badge hidden lg:inline-flex">
        {user.credits_balance.toLocaleString()} credits
      </span>
      <Link href="/account" className="btn-ghost hidden px-3 py-2 sm:inline-flex">
        Account
      </Link>
      {isAdmin(user) ? (
        <Link href="/admin/users" className="btn-ghost hidden px-3 py-2 sm:inline-flex">
          Users
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="btn-secondary px-3 py-2"
      >
        Log out
      </button>
    </div>
  );
}
