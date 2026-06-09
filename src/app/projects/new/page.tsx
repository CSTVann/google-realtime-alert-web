import { CreateProjectPanel } from "@/features/projects/components/create-project-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function NewProjectPage() {
  return (
    <DashboardShell>
      <CreateProjectPanel />
    </DashboardShell>
  );
}
