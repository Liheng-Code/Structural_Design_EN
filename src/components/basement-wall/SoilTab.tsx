import type { Body } from "./ui";
import { NumField, Section, Eq, StatCard, CheckField, EngineeringSlider } from "./ui";

export function SoilTab({ body }: { body: Body }) {
  const { project, res, pad } = body;

  return (
    <div className="space-y-6">
      <Section title="Backfill Geotechnical Properties (Retained Side)" hint="Active pressure for construction stage; at-rest (K0) or active for permanent stage">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EngineeringSlider
            label="Soil Unit Weight γ"
            value={project.gammaBackfill}
            min={14}
            max={24}
            step={0.5}
            unit="kN/m³"
            sub="Bulk unit weight of retained strata"
            quickSteps={[18, 19, 20]}
            tone="amber"
            onChange={(v) => pad({ gammaBackfill: v })}
          />
          <EngineeringSlider
            label="Internal Friction Angle φ'k"
            value={project.phiBackfillDeg}
            min={20}
            max={45}
            step={1}
            unit="°"
            sub="Characteristic effective friction angle"
            quickSteps={[28, 30, 32, 35]}
            tone="amber"
            onChange={(v) => pad({ phiBackfillDeg: v })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <NumField label="Effective Cohesion c'k" value={project.cBackfillKpa} unit="kPa" onChange={(v) => pad({ cBackfillKpa: v })} />
          <NumField label="Backfill Slope Angle β" value={project.backfillSlopeDeg} unit="°" onChange={(v) => pad({ backfillSlopeDeg: v })} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <CheckField 
            label="Use Coulomb Theory" 
            sub="Accounts for wall friction δ"
            checked={project.useCoulomb} 
            onChange={(v) => pad({ useCoulomb: v })} 
          />
          <NumField label="Wall Friction δ" value={project.deltaWallFrictionDeg} unit="°" onChange={(v) => pad({ deltaWallFrictionDeg: v })} />
          <CheckField 
            label="Permanent Stage: Use K0 (At-Rest)" 
            sub="Jaky formula: 1 - sin(φ')"
            checked={project.usePermanentK0} 
            onChange={(v) => pad({ usePermanentK0: v })} 
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="Construction: k used" value={`${res.construction.kUsed}`} sub={res.construction.kLabel} />
          <StatCard label="Permanent: k used" value={`${res.permanent.kUsed}`} sub={res.permanent.kLabel} />
          <StatCard label="K0 (Jaky, char. φ')" value={`${(1 - Math.sin((project.phiBackfillDeg * Math.PI) / 180)).toFixed(3)}`} sub="1 − sin(φ'k)" tone="emerald" />
        </div>

        <Eq>
          <div>
            Permanent stage default: K0 = 1 − sin(φ&apos;k) (Jaky) — a propped, undeflected wall is assumed not to mobilise full active
            pressure. Toggle off to use Ka (Rankine/Coulomb) as an explicitly labelled ASSUMED alternative.
          </div>
        </Eq>
      </Section>

      <Section title="Surcharge Pressures">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EngineeringSlider
            label="Service Surcharge q_k"
            value={project.serviceSurchargeKpa}
            min={0}
            max={50}
            step={2.5}
            unit="kPa"
            sub="Permanent stage traffic / building surcharge"
            quickSteps={[0, 5, 10, 15, 20]}
            tone="cyan"
            onChange={(v) => pad({ serviceSurchargeKpa: v })}
          />
          <EngineeringSlider
            label="Construction Surcharge"
            value={project.constructionSurchargeKpa}
            min={0}
            max={30}
            step={2.5}
            unit="kPa"
            sub="Plant & temporary works load"
            quickSteps={[5, 10, 15]}
            tone="cyan"
            onChange={(v) => pad({ constructionSurchargeKpa: v })}
          />
        </div>
      </Section>

      <Section title="Groundwater Table (GWT) Depths" hint="Depths measured from the top of the wall (ground-floor slab level). 0 mm = water at ground surface (worst case).">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EngineeringSlider
            label="Permanent Groundwater Depth"
            value={project.waterTableDepthPermanent}
            min={0}
            max={project.stemHeight + 1000}
            step={100}
            unit="mm"
            sub="Normal operational water table"
            quickSteps={[0, 1000, 2000, 3000]}
            tone="cyan"
            onChange={(v) => pad({ waterTableDepthPermanent: v })}
          />
          <EngineeringSlider
            label="Construction Groundwater Depth"
            value={project.waterTableDepthConstruction}
            min={0}
            max={project.stemHeight + 1000}
            step={100}
            unit="mm"
            sub="Dewatered or dry excavation condition"
            quickSteps={[1000, 2000, 4000]}
            tone="cyan"
            onChange={(v) => pad({ waterTableDepthConstruction: v })}
          />
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
