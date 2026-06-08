import { UserManagementPanel } from "@/features/admin/components/user-management-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function AdminUsersPage() {
  return (
    <DashboardShell>
      <UserManagementPanel />
    </DashboardShell>
  );
}
