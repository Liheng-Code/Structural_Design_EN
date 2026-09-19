import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";
import { WindForceProfileChart } from "@/components/diagrams/WindLoadDiagram";

export function WindForceTab({ body }: { body: Body }) {
  const { res } = body;
  const loadPathChecks = res.checks.filter((c) => c.category === "Load Path");

  return (
    <div className="space-y-6">
      <Section title="Design Wind Force Profile" hint="Fw,dist(z) = cscd · cf · qp(ze(z)) · b, EN 1991-1-4 §5.3">
        <WindForceProfileChart result={res} />
      </Section>

      <Section title="Base Shear & Overturning Moment" hint="Integrated with the shared trap()/trapMoment() helpers over the height mesh">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Base shear V_base" value={`${res.vBase.toFixed(0)}`} unit="kN" sub="∫ Fw,dist(z) dz" />
          <StatCard label="Overturning moment M0" value={`${res.mOverturning.toFixed(0)}`} unit="kNm" sub="∫ Fw,dist(z)·z dz, about foundation level" />
        </div>
        <div className="mt-4">
          <Eq>
            <div>V_base = trap(Fw,dist, z) = {res.vBase.toFixed(1)} kN</div>
            <div className="mt-1">M0 = trapMoment(Fw,dist, z, 0) = {res.mOverturning.toFixed(1)} kNm</div>
          </Eq>
        </div>
      </Section>

      <Section title="Load Path — Delegated Checks" hint="This is a loads module: resistance-side verification is delegated to downstream modules and is always NOT VERIFIED here">
        <ChecksTable checks={loadPathChecks} />
        <p className="mt-3 font-mono text-xs text-slate-500">
          Load path: wind → façade → floor diaphragm → core/frame → foundation → ground. Base shear and overturning
          moment feed the lateral-system, core, and foundation (Pile Cap / Bored Pile) modules.
        </p>
      </Section>
    </div>
  );
}
