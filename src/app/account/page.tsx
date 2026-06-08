import { AccountPanel } from "@/features/account/components/account-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function AccountPage() {
  return (
    <DashboardShell>
      <AccountPanel />
    </DashboardShell>
  );
}
