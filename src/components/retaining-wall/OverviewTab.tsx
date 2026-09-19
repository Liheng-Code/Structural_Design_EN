import { ArrowRight } from "lucide-react";
import type { Body, Tab } from "./ui";
import { Section, StatCard, StatusBadge, ChecksTable } from "./ui";
import { RetainingWallSection } from "@/components/diagrams/RetainingWallDiagram";

export function OverviewTab({ body, setActiveTab }: { body: Body; setActiveTab: (t: Tab) => void }) {
  const { project, res } = body;
  const governing = res.checks[0];

  return (
    <div className="space-y-6">
      <Section title="Cross-Section & Governing State" hint="DA1-C1 pressures shown; both DA1-C1/C2 are checked for every stability item">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-[#03070e] border border-slate-800 rounded-xl p-3">
            <RetainingWallSection project={project} result={res} />
          </div>
          <div className="space-y-3">
            <StatCard label="Overall status" value={res.overallStatus} sub={`UR_max = ${res.utilizationMax}`} tone={res.overallStatus === "FAIL" ? "rose" : res.overallStatus === "WARNING" ? "amber" : "emerald"} />
            <StatCard label="Governing check" value={governing?.id ?? "—"} sub={governing?.name ?? "—"} tone="white" />
            <StatCard label="Wall height H" value={(res.totalHeight / 1000).toFixed(2)} unit="m" sub={`Base width B = ${(res.baseWidth / 1000).toFixed(2)} m`} />
          </div>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sliding (worse combo)" value={`${Math.max(res.combos.c1.slidingDemand / Math.max(1, res.combos.c1.slidingResistance), res.combos.c2.slidingDemand / Math.max(1, res.combos.c2.slidingResistance)).toFixed(2)}`} sub="UR, sliding" />
        <StatCard label="Bearing (worse combo)" value={`${Math.max(res.combos.c1.bearingDemand / Math.max(1, res.combos.c1.bearingResistance), res.combos.c2.bearingDemand / Math.max(1, res.combos.c2.bearingResistance)).toFixed(2)}`} sub="UR, bearing" />
        <StatCard label="Eccentricity" value={`${Math.max(res.combos.c1.eccentricity, res.combos.c2.eccentricity).toFixed(3)}`} unit="m" sub={`limit B/6 = ${(res.baseWidth / 6000).toFixed(3)} m`} />
        <StatCard label="Stem reinforcement" value={`${res.stemAsProvided}`} unit="mm²/m" sub={`req. ${res.stemAsRequired} mm²/m`} />
      </div>

      <Section title="Design Check Matrix" hint="All ULS / SLS / stability / durability checks, most critical first">
        <ChecksTable checks={res.checks} />
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => setActiveTab("stability")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-800 text-xs font-mono text-slate-200">
            Stability detail <ArrowRight className="size-3.5" />
          </button>
          <button onClick={() => setActiveTab("report")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-800 text-xs font-mono text-slate-200">
            Calculation report <ArrowRight className="size-3.5" />
          </button>
        </div>
      </Section>

      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <StatusBadge status={res.overallStatus} />
        <span>This AI-generated calculation is an engineering support document and does not replace independent checking and approval.</span>
      </div>
    </div>
  );
}
