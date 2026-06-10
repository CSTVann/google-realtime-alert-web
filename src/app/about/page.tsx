import { AboutPanel } from "@/features/about/components/about-panel";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function AboutPage() {
  return (
    <DashboardShell>
      <AboutPanel />
    </DashboardShell>
  );
}
