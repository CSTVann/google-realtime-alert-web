import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { ProjectsPanel } from "@/features/projects/components/projects-panel";

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <ProjectsPanel />
    </DashboardShell>
  );
}
