import type { Body } from "./ui";
import { NumField, Section, Eq, StatCard, CheckField } from "./ui";

export function SoilTab({ body }: { body: Body }) {
  const { project, res, pad } = body;

  return (
    <div className="space-y-6">
      <Section title="Backfill (Retained Side)" hint="Active pressure for construction stage; at-rest (K0) or active for permanent stage">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Unit weight γ" value={project.gammaBackfill} unit="kN/m³" onChange={(v) => pad({ gammaBackfill: v })} />
          <NumField label="Friction angle φ'k" value={project.phiBackfillDeg} unit="°" onChange={(v) => pad({ phiBackfillDeg: v })} />
          <NumField label="Cohesion c'k" value={project.cBackfillKpa} unit="kPa" onChange={(v) => pad({ cBackfillKpa: v })} />
          <NumField label="Backfill slope β" value={project.backfillSlopeDeg} unit="°" onChange={(v) => pad({ backfillSlopeDeg: v })} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <CheckField label="Use Coulomb (else Rankine)" checked={project.useCoulomb} onChange={(v) => pad({ useCoulomb: v })} />
          <NumField label="Wall friction δ" value={project.deltaWallFrictionDeg} unit="°" onChange={(v) => pad({ deltaWallFrictionDeg: v })} />
          <CheckField label="Permanent stage: use K0 (at-rest)" checked={project.usePermanentK0} onChange={(v) => pad({ usePermanentK0: v })} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <StatCard label="Construction: k used" value={`${res.construction.kUsed}`} sub={res.construction.kLabel} />
          <StatCard label="Permanent: k used" value={`${res.permanent.kUsed}`} sub={res.permanent.kLabel} />
          <StatCard label="K0 (Jaky, char. φ')" value={`${(1 - Math.sin((project.phiBackfillDeg * Math.PI) / 180)).toFixed(3)}`} sub="1 − sin(φ'k)" />
        </div>
        <Eq>
          <div>
            Permanent stage default: K0 = 1 − sin(φ&apos;k) (Jaky) — a propped, undeflected wall is assumed not to mobilise full active
            pressure. Toggle off to use Ka (Rankine/Coulomb) as an explicitly labelled ASSUMED alternative.
          </div>
        </Eq>
      </Section>

      <Section title="Surcharge">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumField label="Construction surcharge" value={project.constructionSurchargeKpa} unit="kPa" onChange={(v) => pad({ constructionSurchargeKpa: v })} />
          <NumField label="Service surcharge" value={project.serviceSurchargeKpa} unit="kPa" onChange={(v) => pad({ serviceSurchargeKpa: v })} />
          <NumField label="ψ2 (surcharge, SLS)" value={project.psi2Surcharge} step={0.1} onChange={(v) => pad({ psi2Surcharge: v })} />
        </div>
      </Section>

      <Section title="Groundwater" hint="Depths measured from the top of the wall (ground-floor slab level). 0 mm = water at ground surface (worst case).">
        <div className="grid grid-cols-2 gap-4">
          <NumField label="Water table depth — construction stage" value={project.waterTableDepthConstruction} unit="mm" onChange={(v) => pad({ waterTableDepthConstruction: v })} />
          <NumField label="Water table depth — permanent stage" value={project.waterTableDepthPermanent} unit="mm" onChange={(v) => pad({ waterTableDepthPermanent: v })} />
        </div>
        <Eq>
          <div>
            σ&apos;h(z) = k·σ&apos;v(z), with σ&apos;v using bulk γ above the water table and (γ − γw) below it; hydrostatic pw(z) = γw·(z − zw)
            added separately (never ignore differential water pressure where it can govern).
          </div>
        </Eq>
      </Section>
    </div>
  );
}
