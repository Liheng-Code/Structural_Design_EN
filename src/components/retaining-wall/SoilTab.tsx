import type { Body } from "./ui";
import { NumField, Section, Eq, StatCard, CheckField } from "./ui";

export function SoilTab({ body }: { body: Body }) {
  const { project, res, pad } = body;

  return (
    <div className="space-y-6">
      <Section title="Backfill (Retained Side)" hint="Active earth pressure on the vertical virtual-back plane through the heel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Unit weight γ" value={project.gammaBackfill} unit="kN/m³" onChange={(v) => pad({ gammaBackfill: v })} />
          <NumField label="Friction angle φ'k" value={project.phiBackfillDeg} unit="°" onChange={(v) => pad({ phiBackfillDeg: v })} />
          <NumField label="Cohesion c'k" value={project.cBackfillKpa} unit="kPa" onChange={(v) => pad({ cBackfillKpa: v })} />
          <NumField label="Backfill slope β" value={project.backfillSlopeDeg} unit="°" onChange={(v) => pad({ backfillSlopeDeg: v })} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <CheckField label="Use Coulomb (else Rankine)" checked={project.useCoulomb} onChange={(v) => pad({ useCoulomb: v })} />
          <NumField label="Wall friction δ" value={project.deltaWallFrictionDeg} unit="°" onChange={(v) => pad({ deltaWallFrictionDeg: v })} />
          <NumField label="Surcharge q" value={project.surchargeKpa} unit="kPa" onChange={(v) => pad({ surchargeKpa: v })} />
          <NumField label="ψ2 (surcharge, SLS)" value={project.psi2Surcharge} step={0.1} onChange={(v) => pad({ psi2Surcharge: v })} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <StatCard label="Ka (DA1-C1)" value={`${res.combos.c1.kA}`} sub={`φ'd = ${res.combos.c1.phiBackfillD}°`} />
          <StatCard label="Ka (DA1-C2)" value={`${res.combos.c2.kA}`} sub={`φ'd = ${res.combos.c2.phiBackfillD}°`} />
        </div>
      </Section>

      <Section title="Foundation Soil (Bearing)" hint="EN 1997-1 Annex D bearing-capacity factors (strip footing, shape factor = 1)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Unit weight γ" value={project.gammaFoundation} unit="kN/m³" onChange={(v) => pad({ gammaFoundation: v })} />
          <NumField label="Friction angle φ'k" value={project.phiFoundationDeg} unit="°" onChange={(v) => pad({ phiFoundationDeg: v })} />
          <NumField label="Cohesion c'k" value={project.cFoundationKpa} unit="kPa" onChange={(v) => pad({ cFoundationKpa: v })} />
          <NumField label="Base friction δb" value={project.baseFrictionAngleDeg} unit="°" onChange={(v) => pad({ baseFrictionAngleDeg: v })} />
        </div>
      </Section>

      <Section title="Passive Resistance (In Front of Toe)" hint="Conservatively excluded by default (future excavation / disturbance risk)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <CheckField label="Include passive resistance" checked={project.includePassiveResistance} onChange={(v) => pad({ includePassiveResistance: v })} />
          <NumField label="Unit weight γ" value={project.gammaPassive} unit="kN/m³" onChange={(v) => pad({ gammaPassive: v })} />
          <NumField label="Friction angle φ'k" value={project.phiPassiveDeg} unit="°" onChange={(v) => pad({ phiPassiveDeg: v })} />
          <NumField label="Mobilisation factor" value={project.passiveReductionFactor} step={0.1} onChange={(v) => pad({ passiveReductionFactor: v })} />
        </div>
      </Section>

      <Section title="Groundwater" hint="Depths measured from the adjacent ground surface. A large value (e.g. 50000 mm) represents no water influence.">
        <div className="grid grid-cols-2 gap-4">
          <NumField label="Water table depth — behind wall" value={project.waterTableDepthBehindWall} unit="mm" onChange={(v) => pad({ waterTableDepthBehindWall: v })} />
          <NumField label="Water table depth — in front" value={project.waterTableDepthInFront} unit="mm" onChange={(v) => pad({ waterTableDepthInFront: v })} />
        </div>
        <Eq>
          <div>
            σ'h(z) = Ka·σ'v(z), with σ'v using bulk γ above the water table and (γ − γw) below it; hydrostatic pw(z) = γw·(z − zw) added
            separately (EN 1997-1 §18 discipline: never ignore differential water pressure where it can govern).
          </div>
        </Eq>
      </Section>
    </div>
  );
}
