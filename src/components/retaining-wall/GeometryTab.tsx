import type { Body } from "./ui";
import { NumField, Section, Field, StatCard, CheckField } from "./ui";

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
      <Section title="Stem Geometry" hint="Back face vertical (virtual-back plane); front face may batter via top/base thickness">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Stem height" value={project.stemHeight} unit="mm" onChange={(v) => pad({ stemHeight: v })} />
          <NumField label="Top thickness" value={project.stemTopThickness} unit="mm" onChange={(v) => pad({ stemTopThickness: v })} />
          <NumField label="Base thickness" value={project.stemBaseThickness} unit="mm" onChange={(v) => pad({ stemBaseThickness: v })} />
          <StatCard label="Effective depth d" value={`${res.dStem}`} unit="mm" sub="back-face bars" />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Main bar diameter" value={project.stemBarDiameter} unit="mm" onChange={(v) => pad({ stemBarDiameter: v })} />
          <NumField label="Bar spacing" value={project.stemBarSpacing} unit="mm" onChange={(v) => pad({ stemBarSpacing: v })} />
          <StatCard label="As provided" value={`${res.stemAsProvided}`} unit="mm²/m" />
          <StatCard label="As required" value={`${res.stemAsRequired}`} unit="mm²/m" tone={res.stemAsRequired > res.stemAsProvided ? "rose" : "emerald"} />
        </div>
      </Section>

      <Section title="Base (Toe / Heel) Geometry">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Toe length" value={project.toeLength} unit="mm" onChange={(v) => pad({ toeLength: v })} />
          <NumField label="Heel length" value={project.heelLength} unit="mm" onChange={(v) => pad({ heelLength: v })} />
          <NumField label="Base thickness" value={project.baseThickness} unit="mm" onChange={(v) => pad({ baseThickness: v })} />
          <NumField label="Embedment depth D_f" value={project.embedmentDepth} unit="mm" onChange={(v) => pad({ embedmentDepth: v })} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Toe bar diameter" value={project.toeBarDiameter} unit="mm" onChange={(v) => pad({ toeBarDiameter: v })} />
          <NumField label="Toe bar spacing" value={project.toeBarSpacing} unit="mm" onChange={(v) => pad({ toeBarSpacing: v })} />
          <NumField label="Heel bar diameter" value={project.heelBarDiameter} unit="mm" onChange={(v) => pad({ heelBarDiameter: v })} />
          <NumField label="Heel bar spacing" value={project.heelBarSpacing} unit="mm" onChange={(v) => pad({ heelBarSpacing: v })} />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          B = toe + stem base width + heel = {project.toeLength} + {project.stemBaseThickness} + {project.heelLength} = {res.baseWidth} mm
        </p>
      </Section>

      <Section title="Shear Key" hint="Optional projecting nib below the footing to increase sliding resistance">
        <CheckField label="Include shear key" checked={project.hasShearKey} onChange={(v) => pad({ hasShearKey: v })} />
        {project.hasShearKey && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <NumField label="Key width" value={project.keyWidth} unit="mm" onChange={(v) => pad({ keyWidth: v })} />
            <NumField label="Key depth" value={project.keyDepth} unit="mm" onChange={(v) => pad({ keyDepth: v })} />
            <NumField label="Distance from toe" value={project.keyDistanceFromToe} unit="mm" onChange={(v) => pad({ keyDistanceFromToe: v })} />
          </div>
        )}
      </Section>

      <Section title="Materials & Durability" hint="αcc = 0.85 (UK NA). Main stem/toe/heel bars are on buried faces (soil contact).">
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
          <Field label="Exposure — buried faces">
            <select value={project.exposureClassBuried} onChange={(e) => pad({ exposureClassBuried: e.target.value })} className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white">
              {EXPOSURE.map(([e]) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="c_nom buried" value={project.cNomBuried} unit="mm" onChange={(v) => pad({ cNomBuried: v })} />
          <Field label="Exposure — front stem face">
            <select value={project.exposureClassExposed} onChange={(e) => pad({ exposureClassExposed: e.target.value })} className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white">
              {EXPOSURE.map(([e]) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="c_nom exposed" value={project.cNomExposed} unit="mm" onChange={(v) => pad({ cNomExposed: v })} />
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
