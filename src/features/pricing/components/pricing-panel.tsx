"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { PageHeader } from "@/features/ui/page-header";
import { checkoutPlan, fetchPlans, type Plan } from "@/lib/api";

function formatExpiryDays(days: number) {
  if (days === 7) return "7 days";
  if (days === 30) return "1 month";
  if (days === 90) return "3 months";
  return `${days} days`;
}

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PricingPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout");
    if (checkoutStatus === "success") {
      setSuccess("Payment successful. Your credits and plan have been updated.");
      void refreshUser();
      router.replace("/pricing");
    } else if (checkoutStatus === "canceled") {
      setError("Payment was canceled. No charges were made.");
      router.replace("/pricing");
    }
  }, [searchParams, refreshUser, router]);

  useEffect(() => {
    void fetchPlans()
      .then(setPlans)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load plans"))
      .finally(() => setIsLoadingPlans(false));
  }, []);

  async function handleCheckout(planId: string) {
    if (!user) {
      window.location.href = "/register";
      return;
    }

    setLoadingPlan(planId);
    setError(null);
    setSuccess(null);

    try {
      const result = await checkoutPlan(planId);
      await refreshUser();
      setSuccess(
        `Plan activated successfully. +${formatCredits(result.credits_added)} credits (balance: ${formatCredits(result.credits_balance)}).`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      if (message.toLowerCase().includes("credit") || message.toLowerCase().includes("payment")) {
        setError(message);
      } else if (message.toLowerCase().includes("declined")) {
        setError("Payment was declined. Try another card or contact your bank.");
      } else {
        setError(message);
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="page-stack">
      <section className="panel p-6 sm:p-8">
        <PageHeader
          label="Pricing"
          title="Simple credit-based plans"
          description="Each keyword track uses 1 credit. New accounts receive 100 free credits valid for 7 days."
        />
      </section>

      {error ? <p className="alert alert-error">{error}</p> : null}
      {success ? <p className="alert alert-success">{success}</p> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {isLoadingPlans
          ? Array.from({ length: 3 }, (_, index) => (
              <article key={index} className="panel p-6">
                <div className="skeleton mb-4 h-6 w-24" />
                <div className="skeleton h-8 w-32" />
                <div className="skeleton mt-6 h-10 w-full" />
              </article>
            ))
          : null}
        {!isLoadingPlans
          ? plans.map((plan) => (
              <article
                key={plan.id}
                className={`panel flex flex-col p-6 ${plan.is_popular ? "ring-1 ring-[var(--border-strong)]" : ""}`}
              >
                {plan.is_popular ? (
                  <span className="badge badge-success mb-4 w-fit">Most popular</span>
                ) : (
                  <span className="mb-4 h-6" />
                )}

                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-3xl font-semibold">{formatPrice(plan.price_usd)}</span>
                  <span className="pb-1 text-sm text-muted">/ pack</span>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted">
                  <li>{formatCredits(plan.credits)} credits</li>
                  <li>
                    {plan.max_projects === null
                      ? "Unlimited projects"
                      : `Up to ${plan.max_projects} projects`}
                  </li>
                  <li>Credits valid for {formatExpiryDays(plan.credit_expiry_days)}</li>
                  <li>1 credit = 1 keyword track run</li>
                  <li>Telegram delivery included</li>
                </ul>

                <button
                  type="button"
                  disabled={loadingPlan === plan.id}
                  onClick={() => void handleCheckout(plan.id)}
                  className="btn-primary mt-8 w-full px-4 py-2.5"
                >
                  {loadingPlan === plan.id ? "Processing..." : user ? "Buy plan" : "Register to buy"}
                </button>
              </article>
            ))
          : null}
      </div>
    </div>
  );
}
