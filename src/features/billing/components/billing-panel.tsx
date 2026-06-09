"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { fetchTransactions, fetchWallet, type CreditTransaction, type Wallet } from "@/lib/api";

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

export function BillingPanel() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    void Promise.all([fetchWallet(), fetchTransactions()])
      .then(([walletData, txData]) => {
        setWallet(walletData);
        setTransactions(txData);
      })
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
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Credits expire</dt>
            <dd className="mt-2 text-xl font-semibold">
              {wallet.credits_expires_at ? formatDate(wallet.credits_expires_at) : "—"}
            </dd>
          </div>
          <div className="panel-strong rounded-2xl p-4 sm:col-span-2">
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
          <button
            type="button"
            onClick={() => setShowHistory((value) => !value)}
            className="btn-secondary px-5 py-3 text-sm"
          >
            {showHistory ? "Hide payment history" : "Payment history"}
          </button>
        </div>
      </section>

      {showHistory ? (
        <section className="panel rounded-[2rem] p-8">
          <h2 className="text-xl font-semibold">Payment & credit history</h2>
          <p className="mt-1 text-sm text-muted">
            Signup bonuses, plan purchases, and credit usage from tracking runs.
          </p>
          <div className="mt-6 space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="panel-strong flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                <div>
                  <p className="font-medium capitalize">{tx.reason.replace(/_/g, " ")}</p>
                  {tx.description ? <p className="mt-1 text-sm text-muted">{tx.description}</p> : null}
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.amount >= 0 ? "+" : ""}
                    {formatCredits(tx.amount)}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted">{formatDate(tx.created_at)}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 ? (
              <p className="text-sm text-muted">No transactions yet.</p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
