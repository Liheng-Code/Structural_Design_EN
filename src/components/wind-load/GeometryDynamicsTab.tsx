import type { Body } from "./ui";
import { Section, StatCard, NumField, SelectField, Eq } from "./ui";

export function GeometryDynamicsTab({ body }: { body: Body }) {
  const { project, res, pad } = body;

  return (
    <div className="space-y-6">
      <Section title="Building Geometry" hint="Rectangular plan, prismatic (constant cross-section over height) — wind normal to the B face">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumField label="Building height H" value={project.buildingHeightM} unit="m" onChange={(v) => pad({ buildingHeightM: v })} step={5} />
          <NumField label="Crosswind breadth B" value={project.crosswindBreadthM} unit="m" onChange={(v) => pad({ crosswindBreadthM: v })} step={1} />
          <NumField label="Along-wind depth D" value={project.alongwindDepthM} unit="m" onChange={(v) => pad({ alongwindDepthM: v })} step={1} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="d/b ratio" value={`${res.dOverB}`} sub="drives cf,0 (Fig 7.23)" />
          <StatCard label="l/b ratio" value={`${res.lOverB}`} sub="drives effective slenderness λ" />
          <StatCard label="H ≤ 2B?" value={project.buildingHeightM <= 2 * project.crosswindBreadthM ? "Yes" : "No"} sub="governs the ze(z) strip logic, Fig 7.4" />
        </div>
      </Section>

      <Section title="Dynamic Properties" hint="EN 1991-1-4 Annex B / Annex F — needed for the structural factor cscd and comfort response">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Natural frequency mode"
            value={project.naturalFreqMode}
            onChange={(v) => pad({ naturalFreqMode: v as typeof project.naturalFreqMode })}
            options={[
              { value: "estimate", label: "Estimate (Annex F, n1 = 46/h)" },
              { value: "given", label: "Given (from a modal-analysis model)" },
            ]}
          />
          <NumField
            label="Natural frequency n1 (if given)"
            value={project.naturalFreqHz}
            unit="Hz"
            onChange={(v) => pad({ naturalFreqHz: v })}
            step={0.01}
          />
          <NumField label="Log. decrement of damping δs" value={project.dampingLogDecrement} onChange={(v) => pad({ dampingLogDecrement: v })} step={0.01} />
          <NumField label="Mass per unit height m" value={project.massPerHeightTPerM} unit="t/m" onChange={(v) => pad({ massPerHeightTPerM: v })} step={5} />
          <NumField label="Mode-shape exponent ζ" value={project.modeShapeExponent} onChange={(v) => pad({ modeShapeExponent: v })} step={0.1} />
        </div>
        <div className="mt-4">
          <Eq>
            <div>n1 (estimate) = 46/H = {(46 / Math.max(1, project.buildingHeightM)).toFixed(3)} Hz — used when mode = "Estimate"</div>
            <div className="mt-1">n1 (in use) = {res.n1} Hz</div>
          </Eq>
        </div>
        <div className="mt-4">
          <Eq>
            <div className="text-amber-300">
              Aerodynamic damping (δa, Annex F.5) is NOT modelled — conservative for a stiffness-dominated concrete core; a
              slender steel tower should have this refinement added separately.
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="Serviceability Limits" hint="Not codified in EN 1990/EN 1993/EN 1991-1-4 — engineering-judgement placeholders, confirm with the client/project brief">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumField label="Drift limit denominator (H / n)" value={project.driftLimitDenominator} onChange={(v) => pad({ driftLimitDenominator: v })} step={50} />
          <NumField label="Comfort peak-acceleration limit" value={project.comfortAccelLimit} unit="m/s²" onChange={(v) => pad({ comfortAccelLimit: v })} step={0.01} />
        </div>
      </Section>
    </div>
  );
}
