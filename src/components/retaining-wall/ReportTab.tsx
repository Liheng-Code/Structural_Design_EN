import { Printer } from "lucide-react";
import type { Body } from "./ui";

export function ReportTab({ body }: { body: Body }) {
  const { project, res } = body;
  const { c1, c2 } = res.combos;

  const row = (id: string, descr: string, demand: string, resistance: string) => {
    const c = res.checks.find((x) => x.id === id);
    const status = c?.status ?? "NOT VERIFIED";
    const u = c?.utilization ?? 0;
    const cls = status === "FAIL" ? "text-rose-700" : status === "WARNING" ? "text-amber-700" : status === "NOT VERIFIED" ? "text-slate-500" : "text-emerald-700";
    return (
      <tr className="border-b border-slate-200">
        <td className="p-2 border-r border-slate-300">{descr}</td>
        <td className="p-2 border-r border-slate-300 text-right">{demand}</td>
        <td className="p-2 border-r border-slate-300 text-right">{resistance}</td>
        <td className={`p-2 border-r border-slate-300 text-right font-bold ${u > 1 ? "text-rose-700" : ""}`}>{u.toFixed(2)}</td>
        <td className={`p-2 font-bold ${cls}`}>{status}</td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl font-serif print-area">
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">ENGINEERING CALCULATION SHEET</h1>
          <p className="text-xs font-mono text-slate-600 mt-1">
            {project.projectName} — Cantilever RC Retaining Wall ({project.projectNumber})
          </p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1.5 text-xs text-white">
          <Printer className="size-3.5" /> Print PDF
        </button>
      </div>

      <div className="space-y-7 text-sm">
        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">1. Design Basis</h3>
          <ul className="list-none font-mono text-xs space-y-1">
            <li>Standards: EN 1990 · EN 1991-1-1 · EN 1992-1-1 (EC2) · EN 1997-1 (EC7)</li>
            <li>National Annex: UK NA (provisional) · Design Approach 1 (DA1-C1: A1+M1+R1, DA1-C2: A2+M2+R1)</li>
            <li>Design working life: {project.designLife} y · Consequence class CC2 (assumed) — INPUT REQUIRED to confirm</li>
            <li>
              Exposure: {project.exposureClassBuried} (buried) / {project.exposureClassExposed} (exposed) · w_max = {project.wMax} mm ·
              c_nom = {project.cNomBuried} / {project.cNomExposed} mm
            </li>
            <li>
              Concrete {project.concreteGrade} (fck = {project.fck} MPa) · {project.steelGrade} (fyk = {project.fyk} MPa) · fcd = {res.fcd}{" "}
              MPa · fyd = {res.fyd} MPa · fctm = {res.fctm} MPa
            </li>
            <li>Status: PRELIMINARY — NOT VERIFIED until National Annex, geotechnical report and exposure class are project-confirmed.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">2. Geometry & Load Path</h3>
          <p className="font-mono text-xs">
            H = {(res.totalHeight / 1000).toFixed(2)} m · B = {(res.baseWidth / 1000).toFixed(2)} m · toe {project.toeLength} mm · heel{" "}
            {project.heelLength} mm · base {project.baseThickness} mm
          </p>
          <p className="font-mono text-xs mt-1">
            Load path: backfill self-weight + surcharge → active/water pressure on virtual back → stem bending/shear → base of stem →
            toe/heel bending/shear → base pressure distribution → sliding/bearing/overturning resistance → founding soil.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">3. Earth Pressure & Actions</h3>
          <p className="font-mono text-xs">
            Ka (DA1-C1) = {c1.kA} (φ'd = {c1.phiBackfillD}°) · Ka (DA1-C2) = {c2.kA} (φ'd = {c2.phiBackfillD}°)
          </p>
          <p className="font-mono text-xs mt-1">
            H_d: C1 = {c1.hDesign} kN/m · C2 = {c2.hDesign} kN/m &nbsp;·&nbsp; N_d: C1 = {c1.nDesign} kN/m · C2 = {c2.nDesign} kN/m
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">4. Stability Verification (Both DA1 Combinations)</h3>
          <table className="w-full text-left font-mono text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Check</th>
                <th className="p-2 border-r border-slate-300 text-right">Demand</th>
                <th className="p-2 border-r border-slate-300 text-right">Resistance</th>
                <th className="p-2 border-r border-slate-300 text-right">UR</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {row("ST-01", "Sliding (DA1-C1)", `${c1.slidingDemand} kN/m`, `${c1.slidingResistance} kN/m`)}
              {row("ST-02", "Sliding (DA1-C2)", `${c2.slidingDemand} kN/m`, `${c2.slidingResistance} kN/m`)}
              {row("ST-03", "Bearing (DA1-C1)", `${c1.bearingDemand} kPa`, `${c1.bearingResistance} kPa`)}
              {row("ST-04", "Bearing (DA1-C2)", `${c2.bearingDemand} kPa`, `${c2.bearingResistance} kPa`)}
              {row("ST-05", "Eccentricity ≤ B/6", `${Math.max(c1.eccentricity, c2.eccentricity)} m`, `${(res.baseWidth / 6000).toFixed(3)} m`)}
              {row("ST-06", "Overturning ratio", "1.0", "—")}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">5. Structural Verification (EN 1992-1-1)</h3>
          <table className="w-full text-left font-mono text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Check</th>
                <th className="p-2 border-r border-slate-300 text-right">Demand</th>
                <th className="p-2 border-r border-slate-300 text-right">Resistance</th>
                <th className="p-2 border-r border-slate-300 text-right">UR</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {row("UL-07", "Stem flexure", `${res.stemAsRequired} mm²/m`, `${res.stemAsProvided} mm²/m`)}
              {row("UL-08", "Stem shear", `${res.stemVEdGov} kN/m`, `${res.stemVRdc} kN/m`)}
              {row("UL-09", "Toe flexure", `${res.toeAsRequired} mm²/m`, `${res.toeAsProvided} mm²/m`)}
              {row("UL-10", "Toe shear", `${res.toeVEdGov} kN/m`, `${res.toeVRdc} kN/m`)}
              {row("UL-11", "Heel flexure", `${res.heelAsRequired} mm²/m`, `${res.heelAsProvided} mm²/m`)}
              {row("UL-12", "Heel shear", `${res.heelVEdGov} kN/m`, `${res.heelVRdc} kN/m`)}
              {row("UL-14", "Min. reinforcement (stem)", `${res.stemAsMin} mm²/m`, `${res.stemAsProvided} mm²/m`)}
              {row("DT-17", "Stem anchorage into footing", `${res.stemAnchorageRequired} mm`, `${res.stemAnchorageAvailable} mm`)}
              {row("SL-21", "Crack width (stem, QP)", `${res.crackWidthStem} mm`, `${res.crackLimit} mm`)}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">6. Design Limitations</h3>
          <p className="font-mono text-xs">
            Global (slope) stability, settlement, construction-joint shear-friction, and heel/toe crack width are NOT VERIFIED in this
            module — a project geotechnical report and specialist software are required to close these out.
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
