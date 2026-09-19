import type { Body } from "./ui";
import { Section, StatCard, NumField, SelectField, Field, Eq } from "./ui";

export function SiteTerrainTab({ body }: { body: Body }) {
  const { project, res, pad } = body;

  return (
    <div className="space-y-6">
      <Section title="Basic Wind Velocity" hint="EN 1991-1-4 §4.2 — all National Determined Parameters (NDPs), confirm against the governing National Annex">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumField label="Basic wind velocity vb,map (NA map)" value={project.vbMap} unit="m/s" onChange={(v) => pad({ vbMap: v })} step={0.5} />
          <NumField label="Site altitude A" value={project.siteAltitudeM} unit="m AMSL" onChange={(v) => pad({ siteAltitudeM: v })} step={5} />
          <NumField label="Directional factor cdir" value={project.cDir} onChange={(v) => pad({ cDir: v })} step={0.05} />
          <NumField label="Season factor cseason" value={project.cSeason} onChange={(v) => pad({ cSeason: v })} step={0.05} />
          <NumField label="Air density ρ" value={project.airDensity} unit="kg/m³" onChange={(v) => pad({ airDensity: v })} step={0.01} />
          <Field label="National Annex">
            <input
              type="text"
              value={project.nationalAnnex}
              onChange={(e) => pad({ nationalAnnex: e.target.value })}
              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Eq>
            <div>calt = 1 + 0.001·A = {(1 + 0.001 * project.siteAltitudeM).toFixed(4)} (simplified/PROVISIONAL altitude correction)</div>
            <div className="mt-1">vb,0 = calt·vb,map = {res.vb0} m/s</div>
            <div className="mt-1">vb = cdir·cseason·vb,0 = {res.vb} m/s</div>
          </Eq>
        </div>
      </Section>

      <Section title="Terrain Roughness & Orography" hint="EN 1991-1-4 §4.3, Table 4.1 (recommended values)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Terrain category"
            value={project.terrainCategory}
            onChange={(v) => pad({ terrainCategory: v as typeof project.terrainCategory })}
            options={[
              { value: "0", label: "0 — Sea, coastal area exposed to open sea" },
              { value: "I", label: "I — Lakes/flat, negligible vegetation" },
              { value: "II", label: "II — Low vegetation, isolated obstacles" },
              { value: "III", label: "III — Regular cover of vegetation/buildings" },
              { value: "IV", label: "IV — Dense urban / at least 15% covered by buildings > 15 m" },
            ]}
          />
          <NumField label="Turbulence factor kl" value={project.turbulenceFactorKl} onChange={(v) => pad({ turbulenceFactorKl: v })} step={0.05} />
          <NumField label="Orography co(z) override" value={project.orographyCo} onChange={(v) => pad({ orographyCo: v })} step={0.05} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <StatCard label="Roughness length z0" value={`${res.z0}`} unit="m" sub={`zmin = ${res.zmin} m`} />
          <StatCard label="Terrain factor kr" value={`${res.kr}`} sub="kr = 0.19·(z0/z0,II)^0.07" />
        </div>
        <div className="mt-4">
          <Eq>
            <div>Orography Annex A.3 procedure not digitized — co(z) is applied as a flat single-value override (ASSUMED, default 1.0).</div>
          </Eq>
        </div>
      </Section>
    </div>
  );
}
