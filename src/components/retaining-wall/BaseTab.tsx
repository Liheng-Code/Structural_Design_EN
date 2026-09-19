import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";

export function BaseTab({ body }: { body: Body }) {
  const { res } = body;
  const baseChecks = res.checks.filter((c) => ["UL-09", "UL-10", "UL-11", "UL-12", "UL-13", "UL-15", "UL-16"].includes(c.id));

  return (
    <div className="space-y-6">
      <Section title="Toe Cantilever" hint="Fixed at the front face of stem; net load = upward bearing pressure minus toe self-weight minus soil above toe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="M_Ed" value={`${res.toeMEdGov}`} unit="kNm/m" />
          <StatCard label="V_Ed" value={`${res.toeVEdGov}`} unit="kN/m" />
          <StatCard label="d" value={`${res.dToe}`} unit="mm" />
          <StatCard label="As required / provided" value={`${res.toeAsRequired}`} unit={`/ ${res.toeAsProvided} mm²/m`} tone={res.toeAsRequired > res.toeAsProvided ? "rose" : "emerald"} />
        </div>
      </Section>

      <Section title="Heel Cantilever" hint="Fixed at the back face of stem; net load = self-weight + backfill + surcharge above heel minus upward bearing pressure">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="M_Ed" value={`${res.heelMEdGov}`} unit="kNm/m" />
          <StatCard label="V_Ed" value={`${res.heelVEdGov}`} unit="kN/m" />
          <StatCard label="d" value={`${res.dHeel}`} unit="mm" />
          <StatCard label="As required / provided" value={`${res.heelAsRequired}`} unit={`/ ${res.heelAsProvided} mm²/m`} tone={res.heelAsRequired > res.heelAsProvided ? "rose" : "emerald"} />
        </div>
      </Section>

      {res.keyMEd > 0 && (
        <Section title="Shear Key (Simplified Nib Model)">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="M_Ed" value={`${res.keyMEd}`} unit="kNm/m" />
            <StatCard label="V_Ed" value={`${res.keyVEd}`} unit="kN/m" />
            <StatCard label="As required" value={`${res.keyAsRequired}`} unit="mm²/m" />
          </div>
          <Eq>Simplified short-cantilever model under DA1-C2 passive strength — confirm with a dedicated key design if this governs.</Eq>
        </Section>
      )}

      <Section title="Toe / Heel Checks">
        <ChecksTable checks={baseChecks} />
      </Section>
    </div>
  );
}
