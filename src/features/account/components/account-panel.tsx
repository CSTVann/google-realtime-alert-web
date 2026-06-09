"use client";

import { useAuth } from "@/features/auth/auth-provider";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AccountPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
        <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
        <p className="text-sm text-slate-600">Please sign in to view your account.</p>
      </div>
    );
  }

  const fields = [
    { label: "First name", value: user.first_name },
    { label: "Last name", value: user.last_name },
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status },
    { label: "Credits", value: String(user.credits_balance) },
    { label: "Member since", value: formatDate(user.created_at) },
    { label: "Last updated", value: formatDate(user.updated_at) },
  ];

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Your profile
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-sm text-slate-600">
          This page shows only your account information.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm font-medium capitalize text-slate-950">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
