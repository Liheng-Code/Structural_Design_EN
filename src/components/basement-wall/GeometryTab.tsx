import type { Body } from "./ui";
import { NumField, Section, Field, StatCard } from "./ui";

const CONCRETE_GRADES: [string, number][] = [
  ["C25/30", 25],
  ["C30/37", 30],
  ["C35/45", 35],
  ["C40/50", 40],
];

const EXPOSURE: [string, number][] = [
  ["XC1", 0.4],
  ["XC2", 0.3],
  ["XC3", 0.3],
  ["XC4", 0.3],
  ["XD1", 0.3],
];

export function GeometryTab({ body }: { body: Body }) {
  const { project, res, pad } = body;
  const setGrade = (fck: number) => {
    const grade = CONCRETE_GRADES.find(([, f]) => f === fck);
    pad({ fck, concreteGrade: grade ? grade[0] : project.concreteGrade });
  };

  return (
    <div className="space-y-6">
      <Section title="Wall Geometry" hint="Prismatic wall spanning base (fixed) to top prop (pinned); EI cancels out of the propped-cantilever force method">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Stem height H" value={project.stemHeight} unit="mm" onChange={(v) => pad({ stemHeight: v })} />
          <NumField label="Wall thickness t" value={project.wallThickness} unit="mm" onChange={(v) => pad({ wallThickness: v })} />
          <StatCard label="d (inner, back face)" value={`${res.dInner}`} unit="mm" sub="resists base hogging" />
          <StatCard label="d (outer, front face)" value={`${res.dOuter}`} unit="mm" sub="resists span sagging" />
        </div>
      </Section>

      <Section title="Reinforcement — Two Face" hint="Inner/back face for base hogging; outer/front face for permanent-stage span sagging">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Inner face bar diameter" value={project.innerFaceBarDiameter} unit="mm" onChange={(v) => pad({ innerFaceBarDiameter: v })} />
          <NumField label="Inner face bar spacing" value={project.innerFaceBarSpacing} unit="mm" onChange={(v) => pad({ innerFaceBarSpacing: v })} />
          <StatCard label="As provided (inner)" value={`${res.innerAsProvided}`} unit="mm²/m" />
          <StatCard label="As required (inner)" value={`${res.innerAsRequired}`} unit="mm²/m" tone={res.innerAsRequired > res.innerAsProvided ? "rose" : "emerald"} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Outer face bar diameter" value={project.outerFaceBarDiameter} unit="mm" onChange={(v) => pad({ outerFaceBarDiameter: v })} />
          <NumField label="Outer face bar spacing" value={project.outerFaceBarSpacing} unit="mm" onChange={(v) => pad({ outerFaceBarSpacing: v })} />
          <StatCard label="As provided (outer)" value={`${res.outerAsProvided}`} unit="mm²/m" />
          <StatCard label="As required (outer)" value={`${res.outerAsRequired}`} unit="mm²/m" tone={res.outerAsRequired > res.outerAsProvided ? "rose" : "emerald"} />
        </div>
      </Section>

      <Section title="Base Slab" hint="Default: wall base monolithic with the building's raft — global sliding/bearing delegated to the raft design">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Base thickness" value={project.baseThickness} unit="mm" onChange={(v) => pad({ baseThickness: v })} />
          <Field label="Base support type">
            <select
              value={project.baseSupportType}
              onChange={(e) => pad({ baseSupportType: e.target.value === "strip footing" ? "strip footing" : "raft" })}
              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
            >
              <option value="raft">Raft (monolithic)</option>
              <option value="strip footing">Strip footing (future)</option>
            </select>
          </Field>
          <NumField label="Dowel bar diameter" value={project.baseDowelBarDiameter} unit="mm" onChange={(v) => pad({ baseDowelBarDiameter: v })} />
          <NumField label="Dowel bar spacing" value={project.baseDowelBarSpacing} unit="mm" onChange={(v) => pad({ baseDowelBarSpacing: v })} />
        </div>
      </Section>

      <Section title="Materials & Durability" hint="αcc = 0.85 (UK NA). Inner face buried/soil contact; outer face water/exposed contact.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Concrete grade">
            <select value={project.fck} onChange={(e) => setGrade(Number(e.target.value))} className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white">
              {CONCRETE_GRADES.map(([g, f]) => (
                <option key={g} value={f}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="fyk" value={project.fyk} unit="MPa" onChange={(v) => pad({ fyk: v })} />
          <NumField label="γC" value={project.gammaC} step={0.05} onChange={(v) => pad({ gammaC: v })} />
          <NumField label="γS" value={project.gammaS} step={0.05} onChange={(v) => pad({ gammaS: v })} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Exposure — inner (buried) face">
            <select value={project.exposureClassBuried} onChange={(e) => pad({ exposureClassBuried: e.target.value })} className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white">
              {EXPOSURE.map(([e]) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="c_nom inner" value={project.cNomBuried} unit="mm" onChange={(v) => pad({ cNomBuried: v })} />
          <Field label="Exposure — outer (water) face">
            <select value={project.exposureClassWater} onChange={(e) => pad({ exposureClassWater: e.target.value })} className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white">
              {EXPOSURE.map(([e]) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="c_nom outer" value={project.cNomWater} unit="mm" onChange={(v) => pad({ cNomWater: v })} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Crack limit w_max" value={project.wMax} unit="mm" step={0.05} onChange={(v) => pad({ wMax: v })} />
          <NumField label="Design life" value={project.designLife} unit="y" onChange={(v) => pad({ designLife: v })} />
          <StatCard label="Design strengths" value={`${res.fcd}`} unit={`/ ${res.fyd}`} sub="fcd / fyd MPa" tone="white" />
        </div>
      </Section>
    </div>
  );
}
