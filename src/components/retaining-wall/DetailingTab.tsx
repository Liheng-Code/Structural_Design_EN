import type { Body } from "./ui";
import { Section, StatCard, ChecksTable } from "./ui";

export function DetailingTab({ body }: { body: Body }) {
  const { project, res } = body;
  const detailingChecks = res.checks.filter((c) => ["DT-17", "DT-18", "DT-19", "DT-20"].includes(c.id));

  return (
    <div className="space-y-6">
      <Section title="Reinforcement Schedule" hint="Main bars per metre run of wall">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Stem (back face)" value={`Ø${project.stemBarDiameter} @ ${project.stemBarSpacing}`} unit="mm c/c" sub={`As = ${res.stemAsProvided} mm²/m`} />
          <StatCard label="Toe (bottom face)" value={`Ø${project.toeBarDiameter} @ ${project.toeBarSpacing}`} unit="mm c/c" sub={`As = ${res.toeAsProvided} mm²/m`} />
          <StatCard label="Heel (top face)" value={`Ø${project.heelBarDiameter} @ ${project.heelBarSpacing}`} unit="mm c/c" sub={`As = ${res.heelAsProvided} mm²/m`} />
        </div>
      </Section>

      <Section title="Anchorage & Detailing">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="l_bd required" value={`${res.stemAnchorageRequired}`} unit="mm" />
          <StatCard label="Available straight length" value={`${res.stemAnchorageAvailable}`} unit="mm" tone={res.stemAnchorageRequired > res.stemAnchorageAvailable ? "rose" : "emerald"} />
          <StatCard label="Cover — buried" value={`${project.cNomBuried}`} unit="mm" />
          <StatCard label="Cover — exposed" value={`${project.cNomExposed}`} unit="mm" />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Simplified straight-length anchorage check only. Confirm bend/lap detailing at the stem–footing joint and provide starter bars
          matching the stem reinforcement.
        </p>
      </Section>

      <Section title="Items Not Verified in This Module" hint="Explicitly flagged, never silently omitted (AGENTS.project.md §39)">
        <ChecksTable checks={detailingChecks} />
      </Section>
    </div>
  );
}
