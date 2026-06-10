import { Suspense } from "react";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PricingPanel } from "@/features/pricing/components/pricing-panel";

export default function PricingPage() {
  return (
    <DashboardShell>
      <Suspense
        fallback={
          <div className="panel p-8">
            <div className="skeleton h-8 w-48" />
          </div>
        }
      >
        <PricingPanel />
      </Suspense>
    </DashboardShell>
  );
}
