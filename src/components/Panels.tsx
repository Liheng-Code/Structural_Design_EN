import { Button, Card, Field, NumInput, Select, TextInput } from "@/components/ui";
import { DESIGN_TYPE_LABEL, SECTION_LIBRARY, TIE_DIAMETERS } from "@/lib/engine/defaults";
import type { DesignApproach, DesignType, EarthMethod, StructuralModel, TrafficModel } from "@/lib/engine/types";
import { useProject } from "@/lib/store";
import { uid } from "@/lib/utils";

export function ProjectPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Document information">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Project name">
          <TextInput value={p.meta.projectName} onChange={(e) => patch((q) => (q.meta.projectName = e.target.value))} />
        </Field>
        <Field label="Option">
          <TextInput value={p.meta.option} onChange={(e) => patch((q) => (q.meta.option = e.target.value))} />
        </Field>
        <Field label="Prepared by">
          <TextInput value={p.meta.preparedBy} onChange={(e) => patch((q) => (q.meta.preparedBy = e.target.value))} />
        </Field>
        <Field label="Checked by">
          <TextInput value={p.meta.checkedBy} onChange={(e) => patch((q) => (q.meta.checkedBy = e.target.value))} />
        </Field>
        <Field label="Revision">
          <TextInput value={p.meta.revision} onChange={(e) => patch((q) => (q.meta.revision = e.target.value))} />
        </Field>
        <Field label="Date">
          <TextInput type="date" value={p.meta.date} onChange={(e) => patch((q) => (q.meta.date = e.target.value))} />
        </Field>
        <Field label="Issue status">
          <TextInput value={p.meta.status} onChange={(e) => patch((q) => (q.meta.status = e.target.value))} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          className="mt-2 w-full min-h-24 rounded-sm border border-rule bg-panel px-2.5 py-2 text-sm"
          value={p.meta.notes}
          onChange={(e) => patch((q) => (q.meta.notes = e.target.value))}
        />
      </Field>
    </Card>
  );
}

export function DesignPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Design type and structural model">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="System" hint="Changing type shows/hides relevant checks. Formulas are not forced to be identical.">
          <Select value={p.designType} onChange={(e) => patch((q) => (q.designType = e.target.value as DesignType))}>
            {Object.entries(DESIGN_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Structural model">
          <Select value={p.structuralModel} onChange={(e) => patch((q) => (q.structuralModel = e.target.value as StructuralModel))}>
            <option value="cantilever">Simplified equivalent cantilever</option>
            <option value="anchored-beam">Anchored beam</option>
            <option value="multi-anchor">Multi-anchor beam</option>
            <option value="winkler">Beam on elastic foundation (default)</option>
            <option value="user-mv">User-defined M/V (not active)</option>
          </Select>
        </Field>
        <Field label="Earth pressure method">
          <Select value={p.earth.method} onChange={(e) => patch((q) => (q.earth.method = e.target.value as EarthMethod))}>
            <option value="rankine">Rankine (preliminary default)</option>
            <option value="coulomb">Coulomb</option>
            <option value="user-ka">User-defined Ka / Kp</option>
            <option value="at-rest">At-rest K0</option>
          </Select>
        </Field>
        <Field label="Restrained wall uses K0" hint="Stiff ties may prevent Ka mobilisation.">
          <Select
            value={p.earth.useK0IfRestrained ? "yes" : "no"}
            onChange={(e) => patch((q) => (q.earth.useK0IfRestrained = e.target.value === "yes"))}
          >
            <option value="no">No — use Ka</option>
            <option value="yes">Yes — use K0 on core</option>
          </Select>
        </Field>
      </div>
    </Card>
  );
}

export function GeometryPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const g = p.geometry;
  return (
    <Card title="Geometry">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Retained height H" unit="m" source="USER INPUT">
          <NumInput value={g.retainedHeight} onChange={(n) => patch((q) => (q.geometry.retainedHeight = n))} />
        </Field>
        <Field label="Embedment D" unit="m" source="USER INPUT">
          <NumInput value={g.embedment} onChange={(n) => patch((q) => (q.geometry.embedment = n))} />
        </Field>
        <Field label="Total length L" unit="m" source="DERIVED">
          <NumInput value={g.retainedHeight + g.embedment} onChange={() => {}} disabled />
        </Field>
        <Field label="Road width" unit="m">
          <NumInput value={g.roadWidth} onChange={(n) => patch((q) => (q.geometry.roadWidth = n))} />
        </Field>
        <Field label="Out-to-out width" unit="m">
          <NumInput value={g.totalWidth} onChange={(n) => patch((q) => (q.geometry.totalWidth = n))} />
        </Field>
        <Field label="Wall thickness t" unit="m">
          <NumInput step={0.01} value={g.wallThickness} onChange={(n) => patch((q) => (q.geometry.wallThickness = n))} />
        </Field>
        <Field label="Riverbed elevation" unit="m">
          <NumInput value={g.riverbed} onChange={(n) => patch((q) => (q.geometry.riverbed = n))} />
        </Field>
        <Field label="D min (auto)" unit="m">
          <NumInput value={g.dMin} onChange={(n) => patch((q) => (q.geometry.dMin = n))} />
        </Field>
        <Field label="D max (auto)" unit="m">
          <NumInput value={g.dMax} onChange={(n) => patch((q) => (q.geometry.dMax = n))} />
        </Field>
        <Field label="D step" unit="m">
          <NumInput step={0.05} value={g.dStep} onChange={(n) => patch((q) => (q.geometry.dStep = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function SoilPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <div className="space-y-4">
      <Card title="Core granular fill (inside U)">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Description">
            <TextInput value={p.coreFill.name} onChange={(e) => patch((q) => (q.coreFill.name = e.target.value))} />
          </Field>
          <Field label="γ bulk" unit="kN/m³">
            <NumInput value={p.coreFill.gamma} onChange={(n) => patch((q) => (q.coreFill.gamma = n))} />
          </Field>
          <Field label="γ sat" unit="kN/m³">
            <NumInput value={p.coreFill.gammaSat} onChange={(n) => patch((q) => (q.coreFill.gammaSat = n))} />
          </Field>
          <Field label="φ'" unit="°">
            <NumInput value={p.coreFill.phi} onChange={(n) => patch((q) => (q.coreFill.phi = n))} />
          </Field>
          <Field label="c'" unit="kPa">
            <NumInput value={p.coreFill.c} onChange={(n) => patch((q) => (q.coreFill.c = n))} />
          </Field>
          <Field label="Compaction" unit="% MDD">
            <NumInput value={p.coreFill.compaction} onChange={(n) => patch((q) => (q.coreFill.compaction = n))} />
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted">
          Core self-weight is used as a stabilising action on the U-block. It is not treated as a rigid diaphragm.
        </p>
      </Card>
      <Card
        title="Native soil layers"
        action={
          <Button
            variant="outline"
            onClick={() =>
              patch((q) =>
                q.nativeLayers.push({
                  id: uid("nat"),
                  name: "New layer",
                  description: "",
                  zTop: q.nativeLayers.at(-1)?.zBot ?? 0,
                  zBot: (q.nativeLayers.at(-1)?.zBot ?? 0) - 3,
                  gamma: 18,
                  gammaSat: 20,
                  phi: 30,
                  c: 0,
                  cu: 0,
                  E: 20000,
                  nu: 0.3,
                  kPerm: 1e-5,
                  OCR: 1,
                  sptN: 10,
                  drainage: "drained",
                  soilType: "alluvium",
                }),
              )
            }
          >
            Add layer
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="num">z top</th>
                <th className="num">z bot</th>
                <th className="num">γ</th>
                <th className="num">γsat</th>
                <th className="num">φ'</th>
                <th className="num">c'</th>
                <th className="num">E</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {p.nativeLayers.map((L, i) => (
                <tr key={L.id}>
                  <td>
                    <TextInput value={L.name} onChange={(e) => patch((q) => (q.nativeLayers[i]!.name = e.target.value))} />
                  </td>
                  {(["zTop", "zBot", "gamma", "gammaSat", "phi", "c", "E"] as const).map((k) => (
                    <td key={k}>
                      <NumInput
                        step={k === "E" ? 1000 : 0.1}
                        value={L[k]}
                        onChange={(n) =>
                          patch((q) => {
                            q.nativeLayers[i]![k] = n;
                          })
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <Button variant="ghost" onClick={() => patch((q) => q.nativeLayers.splice(i, 1))}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function WaterPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Groundwater and unit weights">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="γw" unit="kN/m³" source="CODE">
          <NumInput step={0.01} value={p.water.gammaW} onChange={(n) => patch((q) => (q.water.gammaW = n))} />
        </Field>
        <Field label="Native GWL" unit="m">
          <NumInput value={p.water.gwlNative} onChange={(n) => patch((q) => (q.water.gwlNative = n))} />
        </Field>
        <Field label="Core water (dry)" unit="m" hint="Well-drained granular core default 0.00 — ASSUMPTION">
          <NumInput value={p.water.coreDry} onChange={(n) => patch((q) => (q.water.coreDry = n))} />
        </Field>
        <Field label="Core water (flood)" unit="m">
          <NumInput value={p.water.coreFlood} onChange={(n) => patch((q) => (q.water.coreFlood = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function FloodPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const dh = p.water.floodUp - p.water.floodDown;
  return (
    <Card title="Flood and dry-season water levels">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Dry upstream" unit="m">
          <NumInput value={p.water.dryUp} onChange={(n) => patch((q) => (q.water.dryUp = n))} />
        </Field>
        <Field label="Dry downstream" unit="m">
          <NumInput value={p.water.dryDown} onChange={(n) => patch((q) => (q.water.dryDown = n))} />
        </Field>
        <Field label="Flood upstream HWL" unit="m" source="USER INPUT">
          <NumInput value={p.water.floodUp} onChange={(n) => patch((q) => (q.water.floodUp = n))} />
        </Field>
        <Field label="Flood downstream HWL" unit="m">
          <NumInput value={p.water.floodDown} onChange={(n) => patch((q) => (q.water.floodDown = n))} />
        </Field>
        <Field label="Δh flood" unit="m" source="DERIVED">
          <NumInput value={Number(dh.toFixed(2))} onChange={() => {}} disabled />
        </Field>
      </div>
      <p className="mt-3 text-sm text-muted">
        Hydrostatic pressure is calculated independently on each side. Net water pressure Δp_w(z) = p_up(z) − p_down(z). Do not apply the full upstream head to both faces.
      </p>
    </Card>
  );
}

export function TrafficPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Roadway and traffic">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Load model" hint="Uniform q is an ASSUMPTION unless calibrated to a vehicle model.">
          <Select value={p.traffic.model} onChange={(e) => patch((q) => (q.traffic.model = e.target.value as TrafficModel))}>
            <option value="uniform">Uniform surcharge</option>
            <option value="vehicle">Vehicle / axle</option>
            <option value="strip">Equivalent strip</option>
            <option value="user">User-defined</option>
            <option value="combined">Combined</option>
          </Select>
        </Field>
        <Field label="Uniform q" unit="kPa" source="ASSUMPTION">
          <NumInput value={p.traffic.q} onChange={(n) => patch((q) => (q.traffic.q = n))} />
        </Field>
        <Field label="Axle load" unit="kN">
          <NumInput value={p.traffic.axleLoad} onChange={(n) => patch((q) => (q.traffic.axleLoad = n))} />
        </Field>
        <Field label="No. of axles">
          <NumInput step={1} value={p.traffic.nAxles} onChange={(n) => patch((q) => (q.traffic.nAxles = n))} />
        </Field>
        <Field label="Axle spacing" unit="m">
          <NumInput value={p.traffic.axleSpacing} onChange={(n) => patch((q) => (q.traffic.axleSpacing = n))} />
        </Field>
        <Field label="DAF">
          <NumInput step={0.05} value={p.traffic.DAF} onChange={(n) => patch((q) => (q.traffic.DAF = n))} />
        </Field>
        <Field label="Distribution width" unit="m">
          <NumInput value={p.traffic.distWidth} onChange={(n) => patch((q) => (q.traffic.distWidth = n))} />
        </Field>
        <Field label="Plant load" unit="kPa">
          <NumInput value={p.traffic.plantLoad} onChange={(n) => patch((q) => (q.traffic.plantLoad = n))} />
        </Field>
        <Field label="Asphalt thickness" unit="m">
          <NumInput step={0.05} value={p.pavement.asphalt} onChange={(n) => patch((q) => (q.pavement.asphalt = n))} />
        </Field>
        <Field label="Subbase thickness" unit="m">
          <NumInput step={0.05} value={p.pavement.subbase} onChange={(n) => patch((q) => (q.pavement.subbase = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function SheetPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Precast RC sheet pile">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Section library">
          <Select
            value={p.sheetPile.sectionName}
            onChange={(e) => {
              const sec = SECTION_LIBRARY.find((s) => s.name === e.target.value);
              patch((q) => {
                q.sheetPile.sectionName = e.target.value;
                if (sec && e.target.value !== "Custom") q.geometry.wallThickness = sec.t;
              });
            }}
          >
            {SECTION_LIBRARY.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="fcu" unit="MPa">
          <NumInput
            value={p.sheetPile.fcu}
            onChange={(n) =>
              patch((q) => {
                q.sheetPile.fcu = n;
                q.sheetPile.fck = Math.round(0.8 * n);
              })
            }
          />
        </Field>
        <Field label="fck" unit="MPa" source="DERIVED">
          <NumInput value={p.sheetPile.fck} onChange={(n) => patch((q) => (q.sheetPile.fck = n))} />
        </Field>
        <Field label="fyk" unit="MPa">
          <NumInput value={p.sheetPile.fyk} onChange={(n) => patch((q) => (q.sheetPile.fyk = n))} />
        </Field>
        <Field label="c_min" unit="mm">
          <NumInput step={5} value={p.sheetPile.cover} onChange={(n) => patch((q) => (q.sheetPile.cover = n))} />
        </Field>
        <Field label="Δc_dev" unit="mm">
          <NumInput step={5} value={p.sheetPile.deltaCdev} onChange={(n) => patch((q) => (q.sheetPile.deltaCdev = n))} />
        </Field>
        <Field label="Bar diameter" unit="mm">
          <NumInput step={1} value={p.sheetPile.barDia} onChange={(n) => patch((q) => (q.sheetPile.barDia = n))} />
        </Field>
        <Field label="Bar spacing" unit="mm">
          <NumInput
            step={10}
            value={p.sheetPile.barSpacing}
            onChange={(n) =>
              patch((q) => {
                q.sheetPile.barSpacing = n;
                const a = Math.PI * 0.25 * q.sheetPile.barDia ** 2;
                q.sheetPile.asMainEachFace = (1000 / Math.max(n, 1)) * a;
              })
            }
          />
        </Field>
        <Field label="As each face" unit="mm²/m" source="DERIVED">
          <NumInput step={10} value={p.sheetPile.asMainEachFace} onChange={(n) => patch((q) => (q.sheetPile.asMainEachFace = n))} />
        </Field>
        <Field label="I_eff / I_g" source="ASSUMPTION">
          <NumInput step={0.05} value={p.sheetPile.IeffFactor} onChange={(n) => patch((q) => (q.sheetPile.IeffFactor = n))} />
        </Field>
        <Field label="n_h subgrade" unit="kN/m³" source="ASSUMPTION">
          <NumInput step={500} value={p.sheetPile.nh} onChange={(n) => patch((q) => (q.sheetPile.nh = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function TiesPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card
      title="Tie rods"
      action={
        <Button
          variant="outline"
          onClick={() =>
            patch((q) =>
              q.ties.push({
                id: uid("tie"),
                name: `Tie ${q.ties.length + 1}`,
                elevation: 2,
                diameter: 40,
                spacing: 1.5,
                fy: 500,
                fu: 560,
                corrosion: 1,
                threadEff: 0.9,
                connectionEff: 0.9,
                inclination: 0,
                enabled: true,
              }),
            )
          }
        >
          Add tie level
        </Button>
      }
    >
      {p.ties.map((tr, i) => (
        <div key={tr.id} className="mb-4 grid gap-3 border-b border-rule pb-4 sm:grid-cols-4">
          <Field label="Name">
            <TextInput value={tr.name} onChange={(e) => patch((q) => (q.ties[i]!.name = e.target.value))} />
          </Field>
          <Field label="Elevation y" unit="m">
            <NumInput value={tr.elevation} onChange={(n) => patch((q) => (q.ties[i]!.elevation = n))} />
          </Field>
          <Field label="Diameter" unit="mm">
            <Select value={String(tr.diameter)} onChange={(e) => patch((q) => (q.ties[i]!.diameter = parseFloat(e.target.value)))}>
              {TIE_DIAMETERS.map((d) => (
                <option key={d} value={d}>
                  Ø{d}
                </option>
              ))}
              <option value={tr.diameter}>Custom {tr.diameter}</option>
            </Select>
          </Field>
          <Field label="Spacing s" unit="m">
            <NumInput value={tr.spacing} onChange={(n) => patch((q) => (q.ties[i]!.spacing = n))} />
          </Field>
          <Field label="fy" unit="MPa">
            <NumInput value={tr.fy} onChange={(n) => patch((q) => (q.ties[i]!.fy = n))} />
          </Field>
          <Field label="Corrosion" unit="mm" hint="Radial allowance">
            <NumInput step={0.5} value={tr.corrosion} onChange={(n) => patch((q) => (q.ties[i]!.corrosion = n))} />
          </Field>
          <Field label="Thread efficiency" source="ASSUMPTION">
            <NumInput step={0.05} value={tr.threadEff} onChange={(n) => patch((q) => (q.ties[i]!.threadEff = n))} />
          </Field>
          <div className="flex items-end gap-2">
            <label className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tr.enabled}
                onChange={(e) => patch((q) => (q.ties[i]!.enabled = e.target.checked))}
              />
              Enabled
            </label>
            <Button variant="ghost" onClick={() => patch((q) => q.ties.splice(i, 1))}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function CappingPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="RC capping beam">
      <label className="mb-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={p.capping.enabled} onChange={(e) => patch((q) => (q.capping.enabled = e.target.checked))} />
        Include capping beam
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Width b" unit="m">
          <NumInput step={0.05} value={p.capping.b} onChange={(n) => patch((q) => (q.capping.b = n))} />
        </Field>
        <Field label="Depth h" unit="m">
          <NumInput step={0.05} value={p.capping.h} onChange={(n) => patch((q) => (q.capping.h = n))} />
        </Field>
        <Field label="Cover" unit="mm">
          <NumInput step={5} value={p.capping.cover} onChange={(n) => patch((q) => (q.capping.cover = n))} />
        </Field>
        <Field label="fck" unit="MPa">
          <NumInput value={p.capping.fck} onChange={(n) => patch((q) => (q.capping.fck = n))} />
        </Field>
        <Field label="As bottom" unit="mm²">
          <NumInput step={50} value={p.capping.asBot} onChange={(n) => patch((q) => (q.capping.asBot = n))} />
        </Field>
        <Field label="As top" unit="mm²">
          <NumInput step={50} value={p.capping.asTop} onChange={(n) => patch((q) => (q.capping.asTop = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function MaterialsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Partial factors and materials">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Factor source">
          <Select value={p.factors.source} onChange={(e) => patch((q) => (q.factors.source = e.target.value as typeof q.factors.source))}>
            <option value="recommended">Recommended Eurocode</option>
            <option value="national-annex">National Annex</option>
            <option value="user">User-defined</option>
          </Select>
        </Field>
        {(["gammaG", "gammaQ", "gammaGinf", "gammaPhi", "gammaC", "gammaW", "gammaCconc", "gammaS", "alphaCc"] as const).map((k) => (
          <Field key={k} label={k} source={p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"}>
            <NumInput step={0.05} value={p.factors[k]} onChange={(n) => patch((q) => (q.factors[k] = n))} />
          </Field>
        ))}
        <Field label="Passive reduction" source="USER-DEFINED / PROJECT-SPECIFIC">
          <NumInput step={0.05} value={p.earth.passiveReduction} onChange={(n) => patch((q) => (q.earth.passiveReduction = n))} />
        </Field>
        <Field label="Wall friction δ" unit="°">
          <NumInput value={p.earth.wallFriction} onChange={(n) => patch((q) => (q.earth.wallFriction = n))} />
        </Field>
        <Field label="User Ka">
          <NumInput step={0.01} value={p.earth.userKa} onChange={(n) => patch((q) => (q.earth.userKa = n))} />
        </Field>
        <Field label="User Kp">
          <NumInput step={0.1} value={p.earth.userKp} onChange={(n) => patch((q) => (q.earth.userKp = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function LoadsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const setLc = useProject((s) => s.setLoadCase);
  return (
    <Card title="Design load cases">
      <p className="mb-3 text-sm text-muted">
        Load cases are physically consistent situations — maxima are not stacked into an impossible combination.
      </p>
      <div className="overflow-x-auto">
        <table className="eng-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Situation</th>
              <th>Water</th>
              <th>Traffic</th>
              <th>On</th>
            </tr>
          </thead>
          <tbody>
            {p.loadCases.map((lc, i) => (
              <tr key={lc.id} className="cursor-pointer" onClick={() => setLc(lc.id)}>
                <td className="font-mono">{lc.id}</td>
                <td>{lc.name}</td>
                <td>{lc.situation}</td>
                <td>{lc.waterMode}</td>
                <td>{lc.trafficOn ? "yes" : "no"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={lc.enabled}
                    onChange={(e) => patch((q) => (q.loadCases[i]!.enabled = e.target.checked))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ApproachPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Codes, National Annex, design approach">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="National Annex">
          <TextInput value={p.codes.nationalAnnex} onChange={(e) => patch((q) => (q.codes.nationalAnnex = e.target.value))} />
        </Field>
        <Field label="Edition">
          <TextInput value={p.codes.edition} onChange={(e) => patch((q) => (q.codes.edition = e.target.value))} />
        </Field>
        <Field label="EN 1997 Design Approach">
          <Select value={p.codes.designApproach} onChange={(e) => patch((q) => (q.codes.designApproach = e.target.value as DesignApproach))}>
            <option value="DA1">DA1 (Combinations 1 and 2 — screening uses DA1-2 soil factors)</option>
            <option value="DA2">DA2 (recommended default)</option>
            <option value="DA3">DA3</option>
          </Select>
        </Field>
        <Field label="Design working life" unit="years">
          <NumInput step={5} value={p.codes.designLife} onChange={(n) => patch((q) => (q.codes.designLife = n))} />
        </Field>
        <Field label="Consequence class">
          <Select value={p.codes.consequenceClass} onChange={(e) => patch((q) => (q.codes.consequenceClass = e.target.value))}>
            <option>CC1</option>
            <option>CC2</option>
            <option>CC3</option>
          </Select>
        </Field>
        <Field label="Execution class">
          <Select value={p.codes.executionClass} onChange={(e) => patch((q) => (q.codes.executionClass = e.target.value))}>
            <option>EXC1</option>
            <option>EXC2</option>
            <option>EXC3</option>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.codes.seismic} onChange={(e) => patch((q) => (q.codes.seismic = e.target.checked))} />
          Include seismic (EN 1998) — not calculated unless enabled
        </label>
      </div>
      <p className="mt-3 text-xs text-muted">
        First-generation Eurocodes are used. Do not mix second-generation factors without changing the edition field. Clause numbers are not invented; confirm against the adopted NA.
      </p>
    </Card>
  );
}

export function LimitsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Acceptance limits and durability">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="η PASS limit">
          <NumInput step={0.05} value={p.limits.etaPass} onChange={(n) => patch((q) => (q.limits.etaPass = n))} />
        </Field>
        <Field label="η WARNING">
          <NumInput step={0.05} value={p.limits.etaWarn} onChange={(n) => patch((q) => (q.limits.etaWarn = n))} />
        </Field>
        <Field label="δ absolute" unit="mm">
          <NumInput value={p.limits.deflAbs} onChange={(n) => patch((q) => (q.limits.deflAbs = n))} />
        </Field>
        <Field label="δ span ratio H/n" unit="n">
          <NumInput value={p.limits.deflSpanRatio} onChange={(n) => patch((q) => (q.limits.deflSpanRatio = n))} />
        </Field>
        <Field label="wk limit" unit="mm">
          <NumInput step={0.05} value={p.limits.wkLimit} onChange={(n) => patch((q) => (q.limits.wkLimit = n))} />
        </Field>
        <Field label="Allowable i">
          <NumInput step={0.05} value={p.limits.iAllow} onChange={(n) => patch((q) => (q.limits.iAllow = n))} />
        </Field>
        <Field label="Exposure">
          <TextInput value={p.limits.exposure} onChange={(e) => patch((q) => (q.limits.exposure = e.target.value))} />
        </Field>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {(
          [
            ["horizontalBackfill", "Horizontal backfill"],
            ["drainedGranularFill", "Drained granular fill"],
            ["noCohesion", "No cohesion assumed"],
            ["hydrostaticWater", "Hydrostatic water pressure"],
            ["noSeismic", "No seismic loading"],
            ["uniformTraffic", "Uniform traffic surcharge"],
            ["passiveMobilised", "Passive resistance mobilised"],
            ["noScour", "No scour considered"],
            ["coreNotRigidDiaphragm", "Core is not a rigid diaphragm"],
          ] as const
        ).map(([k, lab]) => (
          <label key={k} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!p.assumptions[k]}
              onChange={(e) => patch((q) => (q.assumptions[k] = e.target.checked))}
            />
            {lab}
          </label>
        ))}
      </div>
    </Card>
  );
}

export function StagesPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Construction stages">
      <p className="mb-3 text-sm text-muted">Each stage is analysed with its own support and water condition. The critical stage may not be the completed structure.</p>
      <table className="eng-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Ties</th>
            <th>Fill</th>
            <th>Road</th>
            <th>On</th>
          </tr>
        </thead>
        <tbody>
          {p.stages.map((s, i) => (
            <tr key={s.id}>
              <td>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted">{s.description}</div>
              </td>
              <td className="num">{s.tiesInstalled}</td>
              <td>{s.fillPlaced ? "yes" : "no"}</td>
              <td>{s.roadPlaced ? "yes" : "no"}</td>
              <td>
                <input type="checkbox" checked={s.enabled} onChange={(e) => patch((q) => (q.stages[i]!.enabled = e.target.checked))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
