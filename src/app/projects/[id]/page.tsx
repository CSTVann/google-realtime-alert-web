import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { ProjectControllerLoader } from "@/features/projects/components/project-controller-loader";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <DashboardShell>
      <ProjectControllerLoader projectId={id} />
    </DashboardShell>
  );
}
