import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PricingPanel } from "@/features/pricing/components/pricing-panel";

export default function PricingPage() {
  return (
    <DashboardShell>
      <PricingPanel />
    </DashboardShell>
  );
}
