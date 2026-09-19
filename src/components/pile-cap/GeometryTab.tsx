import type { Body } from "./ui";
import { NumField, Section, Eq, StatCard, Field } from "./ui";

const CONCRETE_GRADES: [string, number][] = [
  ["C25/30", 25],
  ["C30/37", 30],
  ["C35/45", 35],
  ["C40/50", 40],
  ["C50/60", 50],
];

const STEEL_GRADES: [string, number][] = [
  ["B500A", 500],
  ["B500B", 500],
  ["B500C", 500],
];

const EXPOSURE: [string, number][] = [
  ["XC1", 0.4],
  ["XC2", 0.3],
  ["XC3", 0.3],
  ["XC4", 0.3],
  ["XD1/XS1", 0.3],
];

export function GeometryTab({ body }: { body: Body }) {
  const { project, res, pad } = body;
  const setGrade = (fck: number) => {
    const grade = CONCRETE_GRADES.find(([, f]) => f === fck);
    pad({ fck, concreteGrade: grade ? grade[0] : project.concreteGrade });
  };
  const setSteel = (fyk: number) => pad({ fyk, steelGrade: fyk === 500 ? "B500C" : project.steelGrade });
  const setExposure = (exposureClass: string) => {
    const found = EXPOSURE.find(([e]) => e === exposureClass);
    pad({ exposureClass, wMax: found ? found[1] : project.wMax });
  };

  return (
    <div className="space-y-6">
      <Section title="Column & Design Actions" hint="Factored ULS actions applied at the base of the column (top of cap)">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NumField label="Column length X" value={project.columnLengthX} unit="mm" onChange={(v) => pad({ columnLengthX: v })} />
          <NumField label="Column width Y" value={project.columnWidthY} unit="mm" onChange={(v) => pad({ columnWidthY: v })} />
          <NumField label="N_Ed" value={project.nEd} unit="kN" onChange={(v) => pad({ nEd: v })} />
          <NumField label="M_Ed" value={project.mEd} unit="kNm" onChange={(v) => pad({ mEd: v })} />
          <NumField label="H_Ed (at cap top)" value={project.hEd} unit="kN" onChange={(v) => pad({ hEd: v })} />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          X is parallel to the line of piles. M_Ed and H_Ed act in that plane. H_Ed adds a lever-arm moment to the cap base.
        </p>
      </Section>

      <Section title="Piles & Cap Geometry" hint="Two bored piles, concentrated bottom tie in the band between them">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NumField label="Pile diameter" value={project.pileDiameter} unit="mm" onChange={(v) => pad({ pileDiameter: v })} />
          <NumField label="Pile spacing s" value={project.pileSpacing} unit="mm" onChange={(v) => pad({ pileSpacing: v })} />
          <NumField label="Cap length" value={project.capLength} unit="mm" onChange={(v) => pad({ capLength: v })} />
          <NumField label="Cap width" value={project.capWidth} unit="mm" onChange={(v) => pad({ capWidth: v })} />
          <NumField label="Cap depth h" value={project.capDepth} unit="mm" onChange={(v) => pad({ capDepth: v })} />
        </div>
      </Section>

      <Section title="Materials" hint="Concrete and reinforcement grades. αcc = 0.85 (UK NA).">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Concrete grade">
            <select
              value={project.fck}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
            >
              {CONCRETE_GRADES.map(([g, f]) => (
                <option key={g} value={f}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="fck" value={project.fck} unit="MPa" onChange={setGrade} />
          <Field label="Steel grade">
            <select
              value={project.fyk}
              onChange={(e) => setSteel(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
            >
              {STEEL_GRADES.map(([g, f]) => (
                <option key={g} value={f}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="fyk" value={project.fyk} unit="MPa" onChange={setSteel} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="γC" value={project.gammaC} step={0.05} onChange={(v) => pad({ gammaC: v })} />
          <NumField label="γS" value={project.gammaS} step={0.05} onChange={(v) => pad({ gammaS: v })} />
          <NumField label="αcc (UK NA)" value={project.alphaCC} step={0.05} onChange={(v) => pad({ alphaCC: v })} />
          <StatCard label="Design strengths" value={`${res.fcd}`} unit={`/ ${res.fyd}`} sub="fcd / fyd MPa" tone="white" />
        </div>
      </Section>

      <Section title="Durability & SLS" hint="Exposure class fixes the crack limit used in §7.3.4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Exposure class">
            <select
              value={project.exposureClass}
              onChange={(e) => setExposure(e.target.value)}
              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
            >
              {EXPOSURE.map(([e]) => (
                <option key={e} value={e.replace("/", "_")}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
          <NumField label="Nominal cover c_nom" value={project.cNom} unit="mm" onChange={(v) => pad({ cNom: v })} />
          <NumField label="Crack limit w_max" value={project.wMax} unit="mm" step={0.05} onChange={(v) => pad({ wMax: v })} />
          <NumField label="Design life" value={project.designLife} unit="y" onChange={(v) => pad({ designLife: v })} />
        </div>
      </Section>

      <Section title="Quasi-permanent SLS actions" hint="Used for crack width and steel stress checks (§7.3.4)">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <NumField label="N_Qp (axial)" value={project.nQp} unit="kN" onChange={(v) => pad({ nQp: v })} />
          <NumField label="M_Qp (moment)" value={project.mQp} unit="kNm" onChange={(v) => pad({ mQp: v })} />
        </div>
      </Section>

      <Section title="Derived Geometry & Actions" hint="Live traceable derivation">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Effective depth (d)" value={`${res.effectiveDepth}`} unit="mm" sub="h − c_nom − Ø/2" />
          <StatCard label="Cap self weight" value={`${res.capSelfWeight}`} unit="kN" sub="25 kN/m³ · characteristic" />
          <StatCard label="Total design N + M" value={`${res.totalN}`} unit="kN" sub={`M = ${res.totalM} kNm`} tone="white" />
          <StatCard
            label="Pile reactions"
            value={`${res.reactionHigh}`}
            unit="kN"
            sub={`lowest ${res.reactionLow} kN · uplift ${res.hasUplift ? "YES" : "no"}`}
            tone={res.hasUplift ? "rose" : "emerald"}
          />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>R₁ = N_tot/2 + M_tot/s = {res.totalN}/2 + {res.totalM}/({project.pileSpacing}/1000) = {res.reactionHigh} kN</div>
            <div className="text-slate-400 mt-1">
              N_tot = N_Ed + γG·G_cap = {project.nEd} + 1.35×{res.capSelfWeight} = {res.totalN} kN
            </div>
          </Eq>
          <Eq>
            <div>θ = atan(2d/s) = atan(2×{res.effectiveDepth}/{project.pileSpacing}) = {res.strutAngleDeg}°</div>
            <div className="text-slate-400 mt-1">d = h − c_nom − Ø/2 = {project.capDepth} − {project.cNom} − {project.tieBarDiameter}/2</div>
          </Eq>
        </div>
      </Section>
    </div>
  );
}