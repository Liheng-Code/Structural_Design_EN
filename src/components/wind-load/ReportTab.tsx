import { Printer } from "lucide-react";
import type { Body } from "./ui";

export function ReportTab({ body }: { body: Body }) {
  const { project, res } = body;
  const n = res.z.length;

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
            {project.projectName} — Wind Load on a Tall Building ({project.projectNumber})
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
            <li>Standards: EN 1990 · EN 1991-1-4 (wind actions) · Annex B (structural factor, detailed) · Annex F (frequency/damping)</li>
            <li>National Annex: {project.nationalAnnex} · Terrain category {project.terrainCategory}</li>
            <li>Status: PRELIMINARY — NOT VERIFIED until site wind data / NA / geometry inputs are project-confirmed.</li>
            <li>This is a loads module: outputs feed downstream lateral-system / foundation modules and do not include a resistance-side verification.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">2. Geometry & Load Path</h3>
          <p className="font-mono text-xs">
            H = {project.buildingHeightM} m · B (crosswind) = {project.crosswindBreadthM} m · D (along-wind) = {project.alongwindDepthM} m
          </p>
          <p className="font-mono text-xs mt-1">
            Load path: wind → façade → floor diaphragm → core/frame → foundation → ground. This module derives the along-wind
            façade action; downstream modules carry it through the diaphragm, core/frame, and foundation.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">3. Wind Actions</h3>
          <p className="font-mono text-xs">
            vb = {res.vb} m/s (vb,0 = {res.vb0} m/s) · z0 = {res.z0} m · zmin = {res.zmin} m · kr = {res.kr}
          </p>
          <p className="font-mono text-xs mt-1">
            At z = H: qp(H) = {res.qp[n - 1]} kPa · vm(H) = {res.vm[n - 1]} m/s · Iv(H) = {res.Iv[n - 1]}
          </p>
          <p className="font-mono text-xs mt-1">
            cf = {res.cf} (cf,0 = {res.cf0}, ψλ = {res.psiLambda}) · cscd = {res.cscd} (Annex B: B² = {res.B2}, R² = {res.R2}, kp = {res.kp}, n1 = {res.n1} Hz)
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">4. Resultants & Dynamic Response</h3>
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
              {row("AP-01", "Height applicability", `${project.buildingHeightM} m`, "200 m")}
              {row("AP-04", "cscd sanity range", `${res.cscd}`, "1.30")}
              {row("ULS-05", "Base shear (informational)", `${res.vBase.toFixed(0)} kN`, "—")}
              {row("ULS-06", "Overturning moment (informational)", `${res.mOverturning.toFixed(0)} kNm`, "—")}
              {row("SLS-08", "Along-wind tip drift", `${res.tipDeflectionM} m`, `${res.driftLimitM} m`)}
              {row("SLS-09", "Comfort peak acceleration (informative)", `${res.peakAccel} m/s²`, `${project.comfortAccelLimit} m/s²`)}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">5. Design Limitations</h3>
          <p className="font-mono text-xs">
            Across-wind (vortex-shedding) response, torsional response, and interference/channelling effects are NOT VERIFIED in this
            module. Aerodynamic damping (Annex F.5) is not modelled. Base shear, overturning moment, and the bearing-pressure
            increment are informational only — resistance-side verification is delegated to the lateral-system and foundation
            modules (Pile Cap / Bored Pile). Comfort acceleration reuses the 50-year ULS wind speed rather than a reduced
            (typically 1-year) return-period speed — flagged INPUT REQUIRED.
          </p>
        </section>

        <section>
          <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">6. Conclusion</h3>
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
