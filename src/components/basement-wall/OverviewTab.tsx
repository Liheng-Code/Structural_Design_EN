import { ArrowRight } from "lucide-react";
import type { Body, Tab } from "./ui";
import { Section, StatCard, StatusBadge, ChecksTable } from "./ui";
import { BasementWallSection } from "@/components/diagrams/BasementWallDiagram";

export function OverviewTab({ body, setActiveTab }: { body: Body; setActiveTab: (t: Tab) => void }) {
  const { project, res } = body;
  const governing = res.checks[0];

  return (
    <div className="space-y-6">
      <Section title="Elevation & Governing State" hint="Construction stage (free cantilever, Ka) and permanent stage (top-propped, K0 by default) are both checked">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-[#03070e] border border-slate-800 rounded-xl p-3">
            <BasementWallSection project={project} result={res} />
          </div>
          <div className="space-y-3">
            <StatCard label="Overall status" value={res.overallStatus} sub={`UR_max = ${res.utilizationMax}`} tone={res.overallStatus === "FAIL" ? "rose" : res.overallStatus === "WARNING" ? "amber" : "emerald"} />
            <StatCard label="Governing check" value={governing?.id ?? "—"} sub={governing?.name ?? "—"} tone="white" />
            <StatCard label="Wall height H" value={(project.stemHeight / 1000).toFixed(2)} unit="m" sub={`Thickness t = ${project.wallThickness} mm`} />
          </div>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Base moment (governing)" value={`${res.baseMEdGov}`} unit="kNm/m" sub={`${res.baseGovStage} stage`} />
        <StatCard label="Span moment (permanent)" value={`${res.spanMEdGov}`} unit="kNm/m" sub={`at ${res.permanent.spanDepthFromTop} mm from top`} />
        <StatCard label="Top prop reaction" value={`${res.permanent.propReaction}`} unit="kN/m" sub="-> ground-floor slab design" />
        <StatCard label="Earth pressure basis" value={res.permanent.kLabel} sub={`k = ${res.permanent.kUsed}`} />
      </div>

      <Section title="Design Check Matrix" hint="All ULS / SLS / load-path / durability checks, most critical first">
        <ChecksTable checks={res.checks} />
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => setActiveTab("construction")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-800 text-xs font-mono text-slate-200">
            Construction stage <ArrowRight className="size-3.5" />
          </button>
          <button onClick={() => setActiveTab("permanent")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-800 text-xs font-mono text-slate-200">
            Permanent stage <ArrowRight className="size-3.5" />
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
