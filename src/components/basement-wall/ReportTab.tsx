import { Printer } from "lucide-react";
import type { Body } from "./ui";

export function ReportTab({ body }: { body: Body }) {
  const { project, res } = body;

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
            {project.projectName} — Basement Retaining Wall, Top-Propped ({project.projectNumber})
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
              Exposure: {project.exposureClassBuried} (inner/buried) / {project.exposureClassWater} (outer/water) · w_max = {project.wMax} mm ·
              c_nom = {project.cNomBuried} / {project.cNomWater} mm
            </li>
            <li>
              Concrete {project.concreteGrade} (fck = {project.fck} MPa) · {project.steelGrade} (fyk = {project.fyk} MPa) · fcd = {res.fcd}{" "}
              MPa · fyd = {res.fyd} MPa · fctm = {res.fctm} MPa
            </li>
            <li>Status: PRELIMINARY — NOT VERIFIED until National Annex, geotechnical report, water table and waterproofing grade are project-confirmed.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">2. Structural System & Load Path</h3>
          <p className="font-mono text-xs">
            H = {(project.stemHeight / 1000).toFixed(2)} m · t = {project.wallThickness} mm · base {project.baseThickness} mm · base
            support = {project.baseSupportType}
          </p>
          <p className="font-mono text-xs mt-1">
            Construction stage: soil/surcharge pressure → free cantilever, fixed at base → base bending/shear (back face).
          </p>
          <p className="font-mono text-xs mt-1">
            Permanent stage: soil/water/surcharge pressure → propped cantilever (base fixed, top pinned) → base hogging (back face) +
            span sagging (front face) → top prop reaction → ground-floor slab/diaphragm; base reaction → base slab/footing.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">3. Earth Pressure & Stage Forces</h3>
          <p className="font-mono text-xs">
            Construction: {res.construction.kLabel}, k = {res.construction.kUsed} · Permanent: {res.permanent.kLabel}, k = {res.permanent.kUsed}
          </p>
          <p className="font-mono text-xs mt-1">
            Construction base: M_Ed = {res.construction.baseMEd} kNm/m, V_Ed = {res.construction.baseVEd} kN/m
          </p>
          <p className="font-mono text-xs mt-1">
            Permanent: prop reaction P = {res.permanent.propReaction} kN/m · base M_Ed = {res.permanent.baseMEd} kNm/m, V_Ed = {res.permanent.baseVEd} kN/m
            · span M_Ed = {res.permanent.spanMEd} kNm/m at {res.permanent.spanDepthFromTop} mm from top, V_Ed = {res.permanent.spanVEd} kN/m
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">4. Structural Verification (EN 1992-1-1)</h3>
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
              {row("UL-01", "Construction base flexure (inner)", `${res.checks.find((c) => c.id === "UL-01")?.demand ?? 0} mm²/m`, `${res.innerAsProvided} mm²/m`)}
              {row("UL-02", "Construction base shear (inner)", `${res.construction.baseVEd} kN/m`, `${res.innerVRdc} kN/m`)}
              {row("UL-03", "Permanent base flexure (inner)", `${res.checks.find((c) => c.id === "UL-03")?.demand ?? 0} mm²/m`, `${res.innerAsProvided} mm²/m`)}
              {row("UL-04", "Permanent base shear (inner)", `${res.permanent.baseVEd} kN/m`, `${res.innerVRdc} kN/m`)}
              {row("UL-05", "Permanent span flexure (outer)", `${res.checks.find((c) => c.id === "UL-05")?.demand ?? 0} mm²/m`, `${res.outerAsProvided} mm²/m`)}
              {row("UL-06", "Permanent span shear (outer)", `${res.permanent.spanVEd} kN/m`, `${res.outerVRdc} kN/m`)}
              {row("UL-07", "Min. reinforcement (inner)", `${res.innerAsMin} mm²/m`, `${res.innerAsProvided} mm²/m`)}
              {row("UL-08", "Min. reinforcement (outer)", `${res.outerAsMin} mm²/m`, `${res.outerAsProvided} mm²/m`)}
              {row("DT-09", "Base dowel anchorage", `${res.baseDowelAnchorageRequired} mm`, `${res.baseDowelAnchorageAvailable} mm`)}
              {row("SL-13", "Crack width — inner (QP)", `${res.crackWidthInner} mm`, `${res.crackLimit} mm`)}
              {row("SL-14", "Crack width — outer (QP)", `${res.crackWidthOuter} mm`, `${res.crackLimit} mm`)}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">5. Load Path Outputs (Informational)</h3>
          <table className="w-full text-left font-mono text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Output</th>
                <th className="p-2 border-r border-slate-300 text-right">Value</th>
                <th className="p-2">Feeds</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-300">Top prop reaction P</td>
                <td className="p-2 border-r border-slate-300 text-right">{res.permanent.propReaction} kN/m</td>
                <td className="p-2">Ground-floor slab / diaphragm design (out of scope)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-300">Base reaction (M, V)</td>
                <td className="p-2 border-r border-slate-300 text-right">
                  {res.baseMEdGov} kNm/m, {res.baseVEdGov} kN/m
                </td>
                <td className="p-2">Base slab / footing design (out of scope)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">6. Design Limitations</h3>
          <p className="font-mono text-xs">
            Global bearing/sliding/settlement of the raft, curtailment of hogging steel past the point of contraflexure, and waterproofing
            grade/detailing are NOT VERIFIED in this module — the building's overall foundation design, a project geotechnical report and
            specialist waterproofing design are required to close these out.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">7. Conclusion</h3>
          <p>
            Maximum utilization <span className="font-bold">UR_max = {res.utilizationMax}</span> ({res.governingName}). Base design
            governed by the <span className="font-bold">{res.baseGovStage}</span> stage. Overall status:{" "}
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
