"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/auth-provider";
import { ProfileMenu } from "@/features/auth/components/profile-menu";

export function AuthNav() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="skeleton h-9 w-9 rounded-full" />;
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

  return <ProfileMenu />;
}
