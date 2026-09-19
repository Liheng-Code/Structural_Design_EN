import { createFileRoute } from "@tanstack/react-router";
import { CalculatorApp } from "@/components/App";
import { LandingLoginScreen } from "@/components/LandingLoginScreen";
import { ModuleDashboard } from "@/components/ModuleDashboard";
import { BoredPileView } from "@/components/BoredPileView";
import { PileCapView } from "@/components/PileCapView";
import { useProject } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const isAuthenticated = useProject((s) => s.isAuthenticated);
  const activeModule = useProject((s) => s.activeModule);

  if (!isAuthenticated) {
    return <LandingLoginScreen />;
  }

  if (activeModule === "sheet-pile") {
    return <CalculatorApp />;
  }

  if (activeModule === "bored-pile") {
    return <BoredPileView />;
  }

  if (activeModule === "pile-cap") {
    return <PileCapView />;
  }

  return <ModuleDashboard />;
}
