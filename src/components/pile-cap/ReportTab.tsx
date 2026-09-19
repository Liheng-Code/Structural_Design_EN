import { Printer } from "lucide-react";
import type { Body } from "./ui";

export function ReportTab({ body }: { body: Body }) {
  const { project, res } = body;

  const row = (id: string, descr: string, demand: string, resistance: string) => {
    const c = res.checks.find((x) => x.id === id);
    const u = c?.utilization ?? 0;
    return (
      <tr className="border-b border-slate-200">
        <td className="p-2 border-r border-slate-300">{descr}</td>
        <td className="p-2 border-r border-slate-300 text-right">{demand}</td>
        <td className="p-2 border-r border-slate-300 text-right">{resistance}</td>
        <td className={`p-2 border-r border-slate-300 text-right font-bold ${u > 1 ? "text-rose-700" : ""}`}>{u.toFixed(2)}</td>
        <td className={`p-2 font-bold ${u > 1 ? "text-rose-700" : "text-emerald-700"}`}>{u > 1 ? "FAIL" : "PASS"}</td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl font-serif print-area">
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">ENGINEERING CALCULATION SHEET</h1>
          <p className="text-xs font-mono text-slate-600 mt-1">
            {project.projectName} — 2-Pile Pile Cap ({project.projectNumber})
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1.5 text-xs text-white"
        >
          <Printer className="size-3.5" /> Print PDF
        </button>
      </div>

      <div className="space-y-7 text-sm">
        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">1. Design Basis</h3>
          <ul className="list-none font-mono text-xs space-y-1">
            <li>Standard: EN 1990 · EN 1992-1-1 (EC2) · EN 1997-1 (EC7, pile loads)</li>
            <li>National Annex: UK NA (provisional) · αcc = {project.alphaCC}</li>
            <li>Design working life: {project.designLife} y · Consequence class CC2 (assumed)</li>
            <li>Exposure: {project.exposureClass} · w_max = {project.wMax} mm · c_nom = {project.cNom} mm</li>
            <li>Concrete {project.concreteGrade} (fck = {project.fck} MPa) · {project.steelGrade} (fyk = {project.fyk} MPa)</li>
            <li>γC = {project.gammaC} · γS = {project.gammaS} · fcd = {res.fcd} MPa · fyd = {res.fyd} MPa · fctm = {res.fctm} MPa</li>
            <li>Status: PRELIMINARY — NOT VERIFIED until exposure / NA / geotech inputs are confirmed.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">2. Actions & Pile Reactions</h3>
          <p className="font-mono text-xs">
            R₁,₂ = N_tot/2 ± M_tot/s &nbsp;·&nbsp; N_tot = N_Ed + γG·G_cap = {project.nEd} + 1.35×{res.capSelfWeight} = {res.totalN} kN
            &nbsp;·&nbsp; M_tot = {res.totalM} kNm
          </p>
          <p className="font-mono text-xs mt-1">
            R_max = {res.reactionHigh} kN &nbsp;·&nbsp; R_min = {res.reactionLow} kN &nbsp;·&nbsp; uplift: {res.hasUplift ? "YES — FAIL" : "none"}
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">3. Strut-and-Tie Model (§6.5)</h3>
          <p className="font-mono text-xs">
            d = h − c − Ø/2 = {project.capDepth} − {project.cNom} − {project.tieBarDiameter}/2 = {res.effectiveDepth} mm &nbsp;·&nbsp; θ =
            atan(2d/s) = {res.strutAngleDeg}° {res.strutAngleOK ? "(≥ 45°, OK)" : "(< 45° — flag)"}
          </p>
          <p className="font-mono text-xs mt-1">
            T = R_max·cotθ = {res.tieForce} kN &nbsp;·&nbsp; C = R_max/sinθ = {res.strutForce} kN &nbsp;·&nbsp; As,n = {res.asRequired} mm²
            → provided {project.tieBarCount} Ø{project.tieBarDiameter} = {res.asProvided} mm² in {project.tieBandWidth} mm band
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">4. Verification Table</h3>
          <table className="w-full text-left font-mono text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Check</th>
                <th className="p-2 border-r border-slate-300 text-right">Demand</th>
                <th className="p-2 border-r border-slate-300 text-right">Capacity</th>
                <th className="p-2 border-r border-slate-300 text-right">UR</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {row("UL-03", "Tension tie", `${res.asRequired} mm²`, `${res.asProvided} mm²`)}
              {row("UL-04", "Strut compression", `${res.strutStressEd} MPa`, `${res.strutStressRd} MPa`)}
              {row("UL-05", "Column CCC node", `${res.nodeColStressEd} MPa`, `${res.nodeColStressRd} MPa`)}
              {row("UL-06", "Pile CCT node", `${res.nodePileStressEd} MPa`, `${res.nodePileStressRd} MPa`)}
              {row("UL-07", "Wide beam shear", `${res.beamShearEd} kN`, `${res.beamShearRd} kN`)}
              {row("UL-08", "Column punching", `${res.colPunchEd} MPa`, `${res.colPunchRd} MPa`)}
              {row("UL-09", "Pile punching", `${res.pilePunchEd} MPa`, `${res.pilePunchRd} MPa`)}
              {row("UL-10", "Minimum rebar", `${res.asMin} mm²`, `${res.asProvided} mm²`)}
              {row("SL-11", "Steel stress (QP)", `${res.sigmaSqp} MPa`, `${0.8 * project.fyk} MPa`)}
              {row("SL-12", "Crack width", `${res.crackWidth} mm`, `${res.crackLimit} mm`)}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">5. SLS — Crack Width (§7.3.4)</h3>
          <p className="font-mono text-xs">
            σs,Qp = {res.sigmaSqp} MPa · s_r,max = {res.srmax} mm · w_k = {res.crackWidth} mm ≤ {res.crackLimit} mm
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">6. Durability & Detailing</h3>
          <p className="font-mono text-xs">
            Anchorage l_bd = {res.anchorageLength} mm · straight length past pile {res.lengthPastPile} mm · top mesh {project.topMesh}
          </p>
          <p className="font-mono text-xs mt-1">
            Note: settlement and geotechnical resistance are assessed in the Bored Pile module using reactions R_max / R_min — NOT verified
            in this sheet.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">7. Conclusion</h3>
          <p>
            Maximum utilization <span className="font-bold">UR_max = {res.utilizationMax}</span> ({res.governingName}). Overall status:{" "}
            <span className={`font-bold ${res.overallStatus === "FAIL" ? "text-rose-700" : res.overallStatus === "WARNING" ? "text-amber-700" : "text-emerald-700"}`}>
              {res.overallStatus}
            </span>
            . This AI-generated calculation is an engineering support document and shall not replace independent engineering judgement,
            checking, approval, or statutory responsibility.
          </p>
        </section>
      </div>
    </div>
  );
}