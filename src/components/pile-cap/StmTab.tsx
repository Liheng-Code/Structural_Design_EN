import type { Body } from "./ui";
import { ChecksTable, Eq, StatCard, Section } from "./ui";
import { PileCapElevation } from "@/components/diagrams/PileCapDiagram";

export function StmTab({ body }: { body: Body }) {
  const { project, res } = body;
  const uls = res.checks.filter((c) => c.category === "ULS");
  const geometry = res.checks.filter((c) => c.category === "Geometry");

  return (
    <div className="space-y-6">
      <Section title="Strut-and-Tie Model" hint="EN 1992-1-1 §6.5 — column load carried by two diagonal struts to the pile tops; bottom tension tie between piles">
        <PileCapElevation project={project} result={res} />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <StatCard label="Strut angle θ" value={`${res.strutAngleDeg}`} unit="°" sub="≥ 45° UK practice" tone={res.strutAngleOK ? "emerald" : "amber"} />
          <StatCard label="Tie force F_td" value={`${res.tieForce}`} unit="kN" sub="governing pile side" />
          <StatCard label="Strut force C" value={`${res.strutForce}`} unit="kN" sub="per governing strut" />
          <StatCard label="As required" value={`${res.asRequired}`} unit="mm²" sub="F_td / fyd" />
          <StatCard label="As provided" value={`${res.asProvided}`} unit="mm²" sub={`${res.rebarRatio}% over width`} tone={res.asProvided >= res.asRequired ? "emerald" : "rose"} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>T = R_max·cotθ = {res.reactionHigh} × {res.reactionHigh > 0 ? (res.tieForce / res.reactionHigh).toFixed(3) : "—"} = {res.tieForce} kN</div>
            <div className="text-slate-400 mt-1">cotθ = s/(2d) = {project.pileSpacing}/(2×{res.effectiveDepth})</div>
          </Eq>
          <Eq>
            <div>C = R_max / sinθ = {res.reactionHigh} / {(res.strutForce > 0 ? res.reactionHigh / res.strutForce : 0).toFixed(3)} = {res.strutForce} kN</div>
            <div className="text-slate-400 mt-1">As,n = F_td / fyd = {res.tieForce}×1000 / {res.fyd} = {res.asRequired} mm²</div>
          </Eq>
        </div>
      </Section>

      <Section title="ULS Verification Matrix" hint="Every ULS check with demand / resistance / utilization / status">
        <ChecksTable checks={[...geometry, ...uls]} />
      </Section>

      <Section title="Strut & Node Stresses" hint="Concrete efficiency factors — transverse-tension strut 0.6·ν1, CCC node 1.0·fcd, CCT node 0.8·fcd">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
            <p className="text-xs text-slate-400">Strut compression σ_Ed ≤ σ_Rd,max</p>
            <p className="text-xl font-bold text-cyan-300 mt-1">
              {res.strutStressEd} ≤ {res.strutStressRd} MPa
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              ν1 = 0.6(1−fck/250) = {res.nu1} · fcd = {res.fcd} MPa
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
            <p className="text-xs text-slate-400">Column CCC node bearing</p>
            <p className="text-xl font-bold text-cyan-300 mt-1">
              {res.nodeColStressEd} ≤ {res.nodeColStressRd} MPa
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">σ = N_tot/(a·b) · area = {project.columnLengthX}×{project.columnWidthY} mm²</p>
          </div>
          <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
            <p className="text-xs text-slate-400">Pile CCT node bearing</p>
            <p className="text-xl font-bold text-cyan-300 mt-1">
              {res.nodePileStressEd} ≤ {res.nodePileStressRd} MPa
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">σ = R_max/A_pile · A = πØ²/4</p>
          </div>
        </div>
      </Section>
    </div>
  );
}