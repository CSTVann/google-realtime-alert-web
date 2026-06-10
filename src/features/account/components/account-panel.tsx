"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { PageHeader } from "@/features/ui/page-header";

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
      <div className="panel p-8">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="panel p-8">
        <p className="text-sm text-muted">Please sign in to view your account.</p>
      </div>
    );
  }

  const fields = [
    { label: "First name", value: user.first_name },
    { label: "Last name", value: user.last_name },
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status },
    { label: "Credits", value: user.credits_balance.toLocaleString() },
    { label: "Member since", value: formatDate(user.created_at) },
    { label: "Last updated", value: formatDate(user.updated_at) },
  ];

  return (
    <section className="panel p-6 sm:p-8">
      <PageHeader
        label="Account"
        title={`${user.first_name} ${user.last_name}`}
        description="Your profile and account details."
      />

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="stat-card">
            <dt className="stat-label">{field.label}</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
