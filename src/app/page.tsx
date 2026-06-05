import { AlertFeed } from "@/features/dashboard/components/alert-feed";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { HeroPanel } from "@/features/dashboard/components/hero-panel";
import { MetricsGrid } from "@/features/dashboard/components/metrics-grid";

export default function Home() {
  return (
    <DashboardShell>
      <HeroPanel />
      <MetricsGrid />
      <AlertFeed />
    </DashboardShell>
  );
}
