import { BillingPanel } from "@/features/billing/components/billing-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function BillingPage() {
  return (
    <DashboardShell>
      <BillingPanel />
    </DashboardShell>
  );
}
