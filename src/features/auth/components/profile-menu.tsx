"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/features/auth/auth-provider";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";
import type { AuthUser } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";

function getInitials(user: AuthUser) {
  const first = user.first_name.trim().charAt(0);
  const last = user.last_name.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || "?";
}

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;

  const admin = isAdmin(user);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 pr-2.5 transition hover:border-[var(--border-strong)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--accent-fg)]">
          {getInitials(user)}
        </span>
        <svg
          className={`h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
        >
          <div className="border-b border-[var(--border)] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-fg)]">
                {getInitials(user)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 border-b border-[var(--border)] px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted">Appearance</p>
            <ThemeToggle compact />
          </div>

          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-xs font-medium text-muted">Credits</p>
            <p className="mt-1 text-lg font-semibold">{user.credits_balance.toLocaleString()}</p>
            <Link
              href="/billing"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block text-xs font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              View billing
            </Link>
          </div>

          <div className="py-1">
            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-[var(--surface-muted)]"
            >
              Account
            </Link>
            {admin ? (
              <Link
                href="/admin/users"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center px-4 py-2.5 text-sm transition hover:bg-[var(--surface-muted)]"
              >
                Users
              </Link>
            ) : null}
          </div>

          <div className="border-t border-[var(--border)] py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
                window.location.href = "/login";
              }}
              className="flex w-full items-center px-4 py-2.5 text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
            >
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
