import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";

export function PermanentStageTab({ body }: { body: Body }) {
  const { res } = body;
  const stageChecks = res.checks.filter((c) => c.stage === "Permanent" || c.category === "Load Path");

  return (
    <div className="space-y-6">
      <Section title="Permanent Stage — Top-Propped" hint="Base fixed into the base slab, top pinned by the ground-floor slab; unit-load (force) method for the redundant prop reaction">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="k used" value={`${res.permanent.kUsed}`} sub={res.permanent.kLabel} />
          <StatCard label="Prop reaction P" value={`${res.permanent.propReaction}`} unit="kN/m" tone="amber" />
          <StatCard label="Base M_Ed (hogging)" value={`${res.permanent.baseMEd}`} unit="kNm/m" />
          <StatCard label="Span M_Ed (sagging)" value={`${res.permanent.spanMEd}`} unit="kNm/m" sub={`at ${res.permanent.spanDepthFromTop} mm from top`} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>P = δ0/δ11, δ0 = ∫0^H M0(z)·z dz, δ11 = H³/3 (EI cancels for the prismatic wall)</div>
            <div className="text-slate-400 mt-1">M(z) = M0(z) − P·z, V(z) = V0(z) − P</div>
          </Eq>
          <Eq>
            <div>Base (hogging, inner face): M_Ed = {res.permanent.baseMEd} kNm/m, V_Ed = {res.permanent.baseVEd} kN/m</div>
            <div className="text-slate-400 mt-1">Span (sagging, outer face): M_Ed = {res.permanent.spanMEd} kNm/m, V_Ed = {res.permanent.spanVEd} kN/m</div>
          </Eq>
        </div>
      </Section>

      <Section title="SLS — Crack Width (Quasi-Permanent)" hint="G characteristic + ψ2·Q; checked at the base (inner face) and at the span (outer face)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="σs,Qp (inner)" value={`${res.sigmaSqpInner}`} unit="MPa" />
          <StatCard label="w_k (inner)" value={`${res.crackWidthInner}`} unit="mm" tone={res.crackWidthInner > res.crackLimit ? "rose" : "emerald"} />
          <StatCard label="σs,Qp (outer)" value={`${res.sigmaSqpOuter}`} unit="MPa" />
          <StatCard label="w_k (outer)" value={`${res.crackWidthOuter}`} unit="mm" tone={res.crackWidthOuter > res.crackLimit ? "rose" : "emerald"} />
        </div>
      </Section>

      <Section title="Permanent Stage & Load Path Checks" hint="Front-face span checks only exist in this stage; prop and base reactions are reported as load-path demands (NOT VERIFIED — feed adjacent element design)">
        <ChecksTable checks={stageChecks} />
      </Section>
    </div>
  );
}
