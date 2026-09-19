import type { Body } from "./ui";
import { ChecksTable, Eq, StatCard, Section } from "./ui";

export function SlsTab({ body }: { body: Body }) {
  const { res, project } = body;
  const sls = res.checks.filter((c) => c.category === "SLS");

  return (
    <div className="space-y-6">
      <Section title="Crack Width — Tension Tie (§7.3.4)" hint="Quasi-permanent combination; semi-empirical method against the exposure-dependent limit">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Steel stress σs (QP)"
            value={`${res.sigmaSqp}`}
            unit="MPa"
            sub="F_td,Qp / As,prov"
            tone={res.sigmaSqp > 0.8 * project.fyk ? "rose" : "cyan"}
          />
          <StatCard label="Crack width w_k" value={`${res.crackWidth}`} unit="mm" sub={`s_r,max × Δε`} tone={res.crackWidth <= res.crackLimit ? "emerald" : "rose"} />
          <StatCard label="Limit w_max" value={`${res.crackLimit}`} unit="mm" sub={`exposure ${project.exposureClass}`} />
          <StatCard label="Spacing s_r,max" value={`${res.srmax}`} unit="mm" sub="3.4c + 0.425·k1·k2·Ø/ρp,eff" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>εsm − εcm = (σs − kt·(fctm/ρp,eff)·(1+αe·ρp,eff)) / Es</div>
            <div className="text-slate-400 mt-1">
              σs = {res.sigmaSqp} MPa · fctm = {res.fctm} MPa · αe = Es/Ecm = {res.ecm > 0 ? (200000 / res.ecm).toFixed(2) : "—"}
            </div>
          </Eq>
          <Eq>
            <div>w_k = 3.4c + 0.425·k1·k2·Ø/ρp,eff × Δε = {res.srmax} × … = {res.crackWidth} mm</div>
            <div className="text-slate-400 mt-1">
              kt = 0.4 (long term) · k2 = 0.5 (flexural band) · c = {project.cNom} mm · Ø = {project.tieBarDiameter} mm
            </div>
          </Eq>
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          The tie activates over the band width of {project.tieBandWidth} mm. Settlement is assessed in the Bored Pile module
          (geotechnical SLS) — NOT VERIFIED within this element calculation.
        </p>
      </Section>

      <Section title="Check Detail" hint="Traceable demand / resistance pairings">
        <ChecksTable checks={sls} />
      </Section>
    </div>
  );
}