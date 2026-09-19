import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WindLoadAnalysisResult, WindLoadProject } from "@/lib/wind-load/types";

const MONO = "JetBrains Mono, monospace";

/** Building elevation schematic with a wind-pressure arrow envelope, in the same hand-drawn-SVG style as the other modules' diagrams. */
export function WindElevationSchematic({ project, result }: { project: WindLoadProject; result: WindLoadAnalysisResult }) {
  const W = 780;
  const H = 460;
  const padX = 90;
  const padTop = 30;
  const padBottom = 40;

  const h = project.buildingHeightM;
  const b = project.crosswindBreadthM;
  const scaleY = (H - padTop - padBottom) / h;
  const buildingWidthPx = 130;

  const baseY = H - padBottom;
  const roofY = padTop;
  const bldgX0 = padX + 60;
  const bldgX1 = bldgX0 + buildingWidthPx;

  const maxFw = Math.max(1, ...result.fwDist);
  const arrowScale = 70 / maxFw;

  const sampleIdx = Array.from({ length: 9 }, (_, i) => Math.round((i * (result.z.length - 1)) / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-full" role="img" aria-label="Tall building elevation with wind pressure envelope">
      <defs>
        <marker id="wlArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
        </marker>
      </defs>

      <line x1={0} y1={baseY} x2={W} y2={baseY} stroke="#334155" strokeWidth="1.5" />
      <rect x={bldgX0} y={roofY} width={buildingWidthPx} height={baseY - roofY} fill="rgba(6,182,212,0.12)" stroke="#38bdf8" strokeWidth="2" />
      <text x={bldgX0 + buildingWidthPx / 2} y={roofY - 10} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={MONO}>
        H = {h.toFixed(0)} m
      </text>
      <text x={bldgX0 + buildingWidthPx / 2} y={baseY + 22} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        B = {b.toFixed(0)} m
      </text>

      {sampleIdx.map((idx) => {
        const z = result.z[idx]!;
        const fw = result.fwDist[idx]!;
        const y = baseY - z * scaleY;
        const len = Math.max(6, fw * arrowScale);
        return (
          <g key={idx}>
            <line x1={bldgX0 - len - 6} y1={y} x2={bldgX0 - 6} y2={y} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#wlArrow)" />
          </g>
        );
      })}
      <text x={bldgX0 - 74} y={roofY - 10} textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily={MONO}>
        Fw(z)
      </text>

      <text x={bldgX1 + 20} y={roofY + 14} fill="#38bdf8" fontSize="10" fontFamily={MONO}>
        qp(H) = {result.qp[result.qp.length - 1]!.toFixed(2)} kPa
      </text>
      <text x={bldgX1 + 20} y={roofY + 30} fill="#38bdf8" fontSize="10" fontFamily={MONO}>
        cscd = {result.cscd}
      </text>
      <text x={bldgX1 + 20} y={roofY + 46} fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        V_base = {result.vBase.toFixed(0)} kN
      </text>
      <text x={bldgX1 + 20} y={roofY + 62} fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        M0 = {result.mOverturning.toFixed(0)} kNm
      </text>
    </svg>
  );
}

/** Height-wise profile chart — quasi-static vs. design (cscd-amplified) wind force per unit height. */
export function WindForceProfileChart({ result }: { result: WindLoadAnalysisResult }) {
  const data = result.z.map((z, i) => ({
    z,
    w: result.w[i],
    fwDist: result.fwDist[i],
  }));

  return (
    <div className="h-80 w-full bg-[#03070e] border border-cyan-900/60 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="z" tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Height z (m)", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "kN/m", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#0b192c", border: "1px solid #164e63", fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="w" name="w(z) quasi-static" stroke="#f59e0b" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="fwDist" name="Fw,dist(z) design (× cscd)" stroke="#22d3ee" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Height-wise profile chart — peak velocity pressure qp(z). */
export function WindPressureProfileChart({ result }: { result: WindLoadAnalysisResult }) {
  const data = result.z.map((z, i) => ({ z, qp: result.qp[i], vm: result.vm[i] }));

  return (
    <div className="h-80 w-full bg-[#03070e] border border-cyan-900/60 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="z" tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Height z (m)", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "qp (kPa)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#0b192c", border: "1px solid #164e63", fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="qp" name="qp(z) peak velocity pressure" stroke="#38bdf8" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
