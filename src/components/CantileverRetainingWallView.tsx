import { useMemo, useState } from "react";
import { ArrowLeft, Compass, Layers, ShieldCheck, FileText, Mountain, Building2, LogOut } from "lucide-react";
import { useProject } from "@/lib/store";
import { analyzeCantileverWall } from "@/lib/retaining-wall/calculations";
import type { CantileverWallProject } from "@/lib/retaining-wall/types";
import { defaultCantileverWallProject } from "@/lib/retaining-wall/types";
import type { Tab } from "@/components/retaining-wall/ui";
import { OverviewTab } from "@/components/retaining-wall/OverviewTab";
import { GeometryTab } from "@/components/retaining-wall/GeometryTab";
import { SoilTab } from "@/components/retaining-wall/SoilTab";
import { StabilityTab } from "@/components/retaining-wall/StabilityTab";
import { StemTab } from "@/components/retaining-wall/StemTab";
import { BaseTab } from "@/components/retaining-wall/BaseTab";
import { DetailingTab } from "@/components/retaining-wall/DetailingTab";
import { ReportTab } from "@/components/retaining-wall/ReportTab";

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "overview", label: "1. Overview & HUD", icon: Compass },
  { id: "geometry", label: "2. Geometry & Materials", icon: Building2 },
  { id: "soil", label: "3. Soil & Groundwater", icon: Mountain },
  { id: "stability", label: "4. Stability", icon: ShieldCheck },
  { id: "stem", label: "5. Stem Design", icon: Layers },
  { id: "base", label: "6. Toe & Heel Design", icon: Layers },
  { id: "detailing", label: "7. Detailing & Rebar", icon: Layers },
  { id: "report", label: "8. Calculation Report", icon: FileText },
];

export function CantileverRetainingWallView() {
  const userEmail = useProject((s) => s.userEmail);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);
  const [project, setProject] = useState<CantileverWallProject>(defaultCantileverWallProject());
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const pad = (patch: Partial<CantileverWallProject>) => setProject((prev) => ({ ...prev, ...patch }));
  const res = useMemo(() => analyzeCantileverWall(project), [project]);

  return (
    <div className="min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      <header className="relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModule("modules")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition duration-150"
          >
            <ArrowLeft className="size-4" />
            <span>Modules Dashboard</span>
          </button>
          <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
          <div>
            <h1 className="font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase">CANTILEVER RC RETAINING WALL</h1>
            <p className="text-[11px] font-mono text-cyan-400">EN 1992-1-1 · EN 1997-1 DA1 · UK NA (provisional)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300">
            <span className={`size-2 rounded-full ${res.overallStatus === "FAIL" ? "bg-rose-500" : res.overallStatus === "WARNING" ? "bg-amber-400" : "bg-emerald-500"} animate-pulse`}></span>
            <span>{res.overallStatus} · UR {res.utilizationMax}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300">
            <span>{userEmail || "str.design.test"}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700/60 border border-slate-700 text-slate-300 hover:text-rose-300 transition duration-150"
          >
            <LogOut className="size-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="relative z-15 bg-[#040910]/90 border-b border-[#1e3a5f]/80 px-6 flex overflow-x-auto gap-1 font-mono text-xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                isActive ? "border-cyan-400 text-cyan-300 bg-cyan-950/40" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col">
        {activeTab === "overview" && <OverviewTab body={{ project, res, pad }} setActiveTab={setActiveTab} />}
        {activeTab === "geometry" && <GeometryTab body={{ project, res, pad }} />}
        {activeTab === "soil" && <SoilTab body={{ project, res, pad }} />}
        {activeTab === "stability" && <StabilityTab body={{ project, res, pad }} />}
        {activeTab === "stem" && <StemTab body={{ project, res, pad }} />}
        {activeTab === "base" && <BaseTab body={{ project, res, pad }} />}
        {activeTab === "detailing" && <DetailingTab body={{ project, res, pad }} />}
        {activeTab === "report" && <ReportTab body={{ project, res, pad }} />}
      </main>
    </div>
  );
}
