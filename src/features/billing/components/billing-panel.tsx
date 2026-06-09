"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { fetchWallet, type Wallet } from "@/lib/api";

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function BillingPanel() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    void fetchWallet()
      .then(setWallet)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load wallet"));
  }, [isLoading, user, router]);

  if (isLoading || !wallet) {
    return (
      <div className="panel rounded-[2rem] p-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-muted">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Wallet & plan</h1>
        <p className="mt-2 text-sm text-muted">
          Payment provider integration (Stripe / Paddle) is prepared for the next phase. Stub
          checkout on the pricing page adds credits instantly.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="panel-strong rounded-2xl p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Credits</dt>
            <dd className="mt-2 text-3xl font-semibold">{formatCredits(wallet.credits_balance)}</dd>
          </div>
          <div className="panel-strong rounded-2xl p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Active plan</dt>
            <dd className="mt-2 text-xl font-semibold">
              {wallet.active_plan_name ?? "Free trial"}
            </dd>
          </div>
          <div className="panel-strong rounded-2xl p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Projects</dt>
            <dd className="mt-2 text-xl font-semibold">
              {wallet.project_count}
              {wallet.max_projects !== null ? ` / ${wallet.max_projects}` : " / unlimited"}
            </dd>
          </div>
          <div className="panel-strong rounded-2xl p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Track cost</dt>
            <dd className="mt-2 text-xl font-semibold">1 credit / keyword / run</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn-primary px-5 py-3 text-sm">
            Buy more credits
          </Link>
          <Link href="/projects" className="btn-secondary px-5 py-3 text-sm">
            Manage projects
          </Link>
        </div>
      </section>
    </div>
  );
}
