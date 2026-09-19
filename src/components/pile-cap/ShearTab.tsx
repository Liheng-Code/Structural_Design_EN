import type { Body } from "./ui";
import { ChecksTable, StatCard, Section } from "./ui";

export function ShearTab({ body }: { body: Body }) {
  const { res } = body;
  const uls = res.checks.filter((c) => ["UL-07", "UL-08", "UL-09"].includes(c.id));
  const uColDemand = res.checks.find((c) => c.id === "UL-08");
  const uPileDemand = res.checks.find((c) => c.id === "UL-09");
  const uBeamDemand = res.checks.find((c) => c.id === "UL-07");

  return (
    <div className="space-y-6">
      <Section title="Concrete Shear Resistance" hint="v_Rd,c per §6.4.4 — governing denominator for both beam shear and punching">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="v_Rd,c (basic)" value={`${res.vRdc}`} unit="MPa" sub="max(k·…, v_min) without shear steel" />
          <StatCard label="v_Rd,max (crushing)" value={`${res.vRdmax}`} unit="MPa" sub="0.5·ν1·fcd — adjacent to loaded area" />
          <StatCard label="Reinforcement ρl" value={`${res.rebarRatio}`} unit="%" sub="As/(b·d) over cap width" />
        </div>
      </Section>

      <Section title="Wide Beam Shear" hint="§6.2 / §6.2.2(6) — vertical plane at distance d from the pile face; enhancement β = 2d/a_v since load sits within 2.5d">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="V_Ed (critical section)" value={`${res.beamShearEd}`} unit="kN" sub="governing pile reaction" />
          <StatCard label="V_Rd (enhanced)" value={`${res.beamShearRd}`} unit="kN" sub="β·v_Rd,c·b·d" tone={res.beamShearRd >= res.beamShearEd ? "emerald" : "rose"} />
          <StatCard label="Utilization" value={`${uBeamDemand ? uBeamDemand.utilization.toFixed(2) : "—"}`} sub={uBeamDemand?.status ?? "—"} tone={uBeamDemand && uBeamDemand.utilization > 1 ? "rose" : "emerald"} />
        </div>
      </Section>

      <Section title="Punching Shear" hint="§6.4 — control perimeter at 2.0d from column and pile faces; pile caps §6.4.7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-cyan-900/60 bg-[#040910]/70 p-5">
            <h3 className="font-display text-base font-semibold text-white mb-3">Around the column</h3>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span>v_Ed = N_tot/(u₀·d)</span>
                <span className="text-cyan-300 font-bold">{res.colPunchEd} MPa</span>
              </div>
              <div className="flex justify-between">
                <span>v_Rd,c</span>
                <span className="text-cyan-300 font-bold">{res.colPunchRd} MPa</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span>Utilization</span>
                <span className={`font-bold ${uColDemand && uColDemand.utilization > 1 ? "text-rose-400" : "text-emerald-400"}`}>
                  {uColDemand?.utilization.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-900/60 bg-[#040910]/70 p-5">
            <h3 className="font-display text-base font-semibold text-white mb-3">Around each pile</h3>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span>v_Ed = R_max/(u·d)</span>
                <span className="text-cyan-300 font-bold">{res.pilePunchEd} MPa</span>
              </div>
              <div className="flex justify-between">
                <span>v_Rd,c</span>
                <span className="text-cyan-300 font-bold">{res.pilePunchRd} MPa</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span>Utilization</span>
                <span className={`font-bold ${uPileDemand && uPileDemand.utilization > 1 ? "text-rose-400" : "text-emerald-400"}`}>
                  {uPileDemand?.utilization.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] font-mono text-slate-500">
              Bored piles are cast into the cap; full force transfer via the strut model. §6.4.7 perimeter reduction applies where the
              pile is near a free edge — perimeter here is well inside the cap.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Check Detail" hint="Traceable demand / resistance pairings">
        <ChecksTable checks={uls} />
      </Section>
    </div>
  );
}