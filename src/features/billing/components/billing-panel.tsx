"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { PageHeader } from "@/features/ui/page-header";
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
      <div className="panel p-8">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="panel p-6 sm:p-8">
        <PageHeader
          label="Billing"
          title="Wallet & plan"
          description="View your credits, active plan, and payment history."
        />

        {error ? <p className="alert alert-error mt-6">{error}</p> : null}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="stat-card">
            <dt className="stat-label">Credits</dt>
            <dd className="stat-value">{formatCredits(wallet.credits_balance)}</dd>
          </div>
          <div className="stat-card">
            <dt className="stat-label">Active plan</dt>
            <dd className="mt-2 text-xl font-semibold">{wallet.active_plan_name ?? "Free trial"}</dd>
          </div>
          <div className="stat-card">
            <dt className="stat-label">Projects</dt>
            <dd className="mt-2 text-xl font-semibold">
              {wallet.project_count}
              {wallet.max_projects !== null ? ` / ${wallet.max_projects}` : " / unlimited"}
            </dd>
          </div>
          <div className="stat-card">
            <dt className="stat-label">Credits expire</dt>
            <dd className="mt-2 text-xl font-semibold">
              {wallet.credits_expires_at ? formatDate(wallet.credits_expires_at) : "—"}
            </dd>
          </div>
          <div className="stat-card sm:col-span-2">
            <dt className="stat-label">Track cost</dt>
            <dd className="mt-2 text-xl font-semibold">1 credit / keyword / run</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn-primary px-4 py-2.5">
            Buy more credits
          </Link>
          <Link href="/projects" className="btn-secondary px-4 py-2.5">
            Manage projects
          </Link>
          <button type="button" onClick={() => setShowHistory((value) => !value)} className="btn-secondary px-4 py-2.5">
            {showHistory ? "Hide history" : "Payment history"}
          </button>
        </div>
      </section>

      {showHistory ? (
        <section className="panel p-6 sm:p-8">
          <PageHeader
            title="Payment & credit history"
            description="Signup bonuses, plan purchases, and credit usage from tracking runs."
          />
          <div className="mt-6 space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="panel-strong flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium capitalize">{tx.reason.replace(/_/g, " ")}</p>
                  {tx.description ? <p className="mt-1 text-sm text-muted">{tx.description}</p> : null}
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                    {tx.amount >= 0 ? "+" : ""}
                    {formatCredits(tx.amount)}
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatDate(tx.created_at)}</p>
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
