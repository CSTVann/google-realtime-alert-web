import { ProjectsListPanel } from "@/features/projects/components/projects-list-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <ProjectsListPanel />
    </DashboardShell>
  );
}
