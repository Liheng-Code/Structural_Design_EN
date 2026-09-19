import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";

export function StemTab({ body }: { body: Body }) {
  const { res } = body;
  const stemChecks = res.checks.filter((c) => ["UL-07", "UL-08", "UL-14", "DT-17", "SL-21", "SL-22"].includes(c.id));

  return (
    <div className="space-y-6">
      <Section title="Stem Design Forces" hint="Governing of DA1-C1/DA1-C2, taken at the footing top (stem base)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="M_Ed" value={`${res.stemMEdGov}`} unit="kNm/m" />
          <StatCard label="V_Ed" value={`${res.stemVEdGov}`} unit="kN/m" />
          <StatCard label="d" value={`${res.dStem}`} unit="mm" />
          <StatCard label="As required / provided" value={`${res.stemAsRequired}`} unit={`/ ${res.stemAsProvided} mm²/m`} tone={res.stemAsRequired > res.stemAsProvided ? "rose" : "emerald"} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>K = M_Ed/(b·d²·fck) → z = d·min(0.95, 0.5+√(0.25−K/1.134))</div>
            <div className="text-slate-400 mt-1">As,req = M_Ed/(fyd·z) = {res.stemAsRequired} mm²/m</div>
          </Eq>
          <Eq>
            <div>V_Rd,c (EN 1992-1-1 §6.2.2) = {res.stemVRdc} kN/m vs V_Ed = {res.stemVEdGov} kN/m</div>
            <div className="text-slate-400 mt-1">As,min = {res.stemAsMin} mm²/m</div>
          </Eq>
        </div>
      </Section>

      <Section title="SLS — Crack Width (Quasi-Permanent)" hint="Governed by the back-face (soil-side) reinforcement at the stem base">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="σs,Qp" value={`${res.sigmaSqp}`} unit="MPa" />
          <StatCard label="w_k" value={`${res.crackWidthStem}`} unit="mm" tone={res.crackWidthStem > res.crackLimit ? "rose" : "emerald"} />
          <StatCard label="w_max" value={`${res.crackLimit}`} unit="mm" />
        </div>
      </Section>

      <Section title="Stem Checks">
        <ChecksTable checks={stemChecks} />
      </Section>
    </div>
  );
}
