import { ArrowRight } from "lucide-react";
import type { Body, Tab } from "./ui";
import { Section, StatCard, StatusBadge, ChecksTable } from "./ui";
import { WindElevationSchematic } from "@/components/diagrams/WindLoadDiagram";

export function OverviewTab({ body, setActiveTab }: { body: Body; setActiveTab: (t: Tab) => void }) {
  const { project, res } = body;
  const governing = res.checks[0];

  return (
    <div className="space-y-6">
      <Section title="Elevation & Governing State" hint="Along-wind design force profile Fw,dist(z) = cscd · cf · qp(ze) · b">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-[#03070e] border border-slate-800 rounded-xl p-3">
            <WindElevationSchematic project={project} result={res} />
          </div>
          <div className="space-y-3">
            <StatCard label="Overall status" value={res.overallStatus} sub={`UR_max = ${res.utilizationMax}`} tone={res.overallStatus === "FAIL" ? "rose" : res.overallStatus === "WARNING" ? "amber" : "emerald"} />
            <StatCard label="Governing check" value={governing?.id ?? "—"} sub={governing?.name ?? "—"} tone="white" />
            <StatCard label="Basic wind velocity vb" value={`${res.vb}`} unit="m/s" sub={`Terrain ${project.terrainCategory} · ${project.nationalAnnex}`} />
          </div>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Peak velocity pressure qp(H)" value={`${res.qp[res.qp.length - 1]}`} unit="kPa" sub={`vm(H) = ${res.vm[res.vm.length - 1]} m/s`} />
        <StatCard label="Structural factor cscd" value={`${res.cscd}`} sub={`n1 = ${res.n1} Hz · kp = ${res.kp}`} />
        <StatCard label="Base shear" value={`${res.vBase.toFixed(0)}`} unit="kN" sub={`M0 = ${res.mOverturning.toFixed(0)} kNm`} />
        <StatCard label="Peak acceleration" value={`${res.peakAccel}`} unit="m/s²" sub={`limit ${project.comfortAccelLimit} m/s² (informative)`} />
      </div>

      <Section title="Design Check Matrix" hint="Applicability / Load Path / SLS checks, most critical first">
        <ChecksTable checks={res.checks} />
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => setActiveTab("wind-force")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-800 text-xs font-mono text-slate-200">
            Wind force detail <ArrowRight className="size-3.5" />
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
