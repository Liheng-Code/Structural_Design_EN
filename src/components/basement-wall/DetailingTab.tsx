import type { Body } from "./ui";
import { Section, StatCard, ChecksTable } from "./ui";

export function DetailingTab({ body }: { body: Body }) {
  const { project, res } = body;
  const detailingChecks = res.checks.filter((c) => c.category === "Durability");

  return (
    <div className="space-y-6">
      <Section title="Reinforcement Schedule" hint="Main bars per metre run of wall">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Inner face (back, base hogging)" value={`Ø${project.innerFaceBarDiameter} @ ${project.innerFaceBarSpacing}`} unit="mm c/c" sub={`As = ${res.innerAsProvided} mm²/m`} />
          <StatCard label="Outer face (front, span sagging)" value={`Ø${project.outerFaceBarDiameter} @ ${project.outerFaceBarSpacing}`} unit="mm c/c" sub={`As = ${res.outerAsProvided} mm²/m`} />
          <StatCard label="Base dowels / starter bars" value={`Ø${project.baseDowelBarDiameter} @ ${project.baseDowelBarSpacing}`} unit="mm c/c" />
        </div>
      </Section>

      <Section title="Anchorage & Detailing">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="l_bd required (dowels)" value={`${res.baseDowelAnchorageRequired}`} unit="mm" />
          <StatCard label="Available straight length" value={`${res.baseDowelAnchorageAvailable}`} unit="mm" tone={res.baseDowelAnchorageRequired > res.baseDowelAnchorageAvailable ? "rose" : "emerald"} />
          <StatCard label="Cover — inner (buried)" value={`${project.cNomBuried}`} unit="mm" />
          <StatCard label="Cover — outer (water)" value={`${project.cNomWater}`} unit="mm" />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Simplified straight-length anchorage check for base dowels only. Curtailment of the inner-face hogging steel past the point of
          contraflexure is not automated — verify bar cut-off lengths separately (EN 1992-1-1 §9.2.1.3 / §8.4).
        </p>
      </Section>

      <Section title="Items Not Verified in This Module" hint="Explicitly flagged, never silently omitted (AGENTS.project.md §39)">
        <ChecksTable checks={detailingChecks} />
      </Section>
    </div>
  );
}
