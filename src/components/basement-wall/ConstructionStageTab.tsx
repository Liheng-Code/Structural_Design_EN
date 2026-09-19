import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";

export function ConstructionStageTab({ body }: { body: Body }) {
  const { res } = body;
  const stageChecks = res.checks.filter((c) => c.stage === "Construction" || (c.stage === "Both" && ["UL-07", "DT-09"].includes(c.id)));

  return (
    <div className="space-y-6">
      <Section title="Construction Stage — Free Cantilever" hint="Wall fixed at base only, free at top (ground-floor slab prop not yet cast); active pressure Ka">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="k used" value={`${res.construction.kUsed}`} sub={res.construction.kLabel} />
          <StatCard label="Base M_Ed" value={`${res.construction.baseMEd}`} unit="kNm/m" />
          <StatCard label="Base V_Ed" value={`${res.construction.baseVEd}`} unit="kN/m" />
          <StatCard label="d (inner)" value={`${res.dInner}`} unit="mm" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>Cantilever, fixed at base (z=H): M0(z) = ∫0^z V0(s) ds, V0(z) = ∫0^z p(s) ds, from the free top (z=0)</div>
            <div className="text-slate-400 mt-1">Base moment M0(H) = {res.construction.baseMEd} kNm/m (governs the base if larger than the permanent stage)</div>
          </Eq>
          <Eq>
            <div>K = M_Ed/(b·d²·fck) → z = d·min(0.95, 0.5+√(0.25−K/1.134)); As,req = M_Ed/(fyd·z)</div>
            <div className="text-slate-400 mt-1">
              As,req (inner, this stage) vs As,prov = {res.innerAsProvided} mm²/m
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="Construction Stage Checks" hint="Back-face flexure/shear at the base, checked against the same reinforcement provided for the permanent stage">
        <ChecksTable checks={stageChecks} />
      </Section>
    </div>
  );
}
