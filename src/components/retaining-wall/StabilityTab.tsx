import type { Body } from "./ui";
import { Section, StatCard, Eq } from "./ui";

export function StabilityTab({ body }: { body: Body }) {
  const { res } = body;
  const { c1, c2 } = res.combos;

  return (
    <div className="space-y-6">
      <Section title="DA1-C1 (A1+M1+R1) — structural sizing combination">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="H_d" value={`${c1.hDesign}`} unit="kN/m" />
          <StatCard label="N_d" value={`${c1.nDesign}`} unit="kN/m" />
          <StatCard label="Eccentricity e" value={`${c1.eccentricity}`} unit="m" tone={c1.resultantWithinMiddleThird ? "emerald" : "amber"} />
          <StatCard label="Sliding UR" value={`${(c1.slidingDemand / Math.max(1, c1.slidingResistance)).toFixed(2)}`} tone={c1.slidingDemand > c1.slidingResistance ? "rose" : "emerald"} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>q_toe = {c1.toePressure} kPa · q_heel = {c1.heelPressure} kPa</div>
            <div className="text-slate-400 mt-1">B' (effective width) = {c1.effectiveWidth} m</div>
          </Eq>
          <Eq>
            <div>
              Sliding: R_d = N_d·tanδb/γR + Pp,d = {c1.slidingResistance} kN/m vs H_d = {c1.hDesign} kN/m
            </div>
            <div className="text-slate-400 mt-1">
              Bearing: v_d = {c1.bearingDemand} kPa vs R_d = {c1.bearingResistance} kPa
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="DA1-C2 (A2+M2+R1) — geotechnical sizing combination" hint="Reduced soil strength (γφ' = 1.25), reduced action factors">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="H_d" value={`${c2.hDesign}`} unit="kN/m" />
          <StatCard label="N_d" value={`${c2.nDesign}`} unit="kN/m" />
          <StatCard label="Eccentricity e" value={`${c2.eccentricity}`} unit="m" tone={c2.resultantWithinMiddleThird ? "emerald" : "amber"} />
          <StatCard label="Bearing UR" value={`${(c2.bearingDemand / Math.max(1, c2.bearingResistance)).toFixed(2)}`} tone={c2.bearingDemand > c2.bearingResistance ? "rose" : "emerald"} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>q_toe = {c2.toePressure} kPa · q_heel = {c2.heelPressure} kPa</div>
            <div className="text-slate-400 mt-1">B' (effective width) = {c2.effectiveWidth} m</div>
          </Eq>
          <Eq>
            <div>
              Sliding: R_d = {c2.slidingResistance} kN/m vs H_d = {c2.hDesign} kN/m
            </div>
            <div className="text-slate-400 mt-1">
              Bearing: v_d = {c2.bearingDemand} kPa vs R_d = {c2.bearingResistance} kPa
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="Notes & Limitations" hint="Per AGENTS.project.md discipline — nothing here is silently skipped">
        <ul className="list-disc list-inside space-y-1 font-mono text-xs text-slate-400">
          <li>Both DA1 combinations are evaluated for every stability check; the governing (higher utilization) case is reported.</li>
          <li>Global (slope) stability and settlement are NOT VERIFIED in this module — require specialist software and a geotechnical report.</li>
          <li>Uplift water pressure at the base uses a simplified average-head approximation, not a rigorous flow-net analysis.</li>
        </ul>
      </Section>
    </div>
  );
}
