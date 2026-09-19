import type { LoadCaseResult } from "@/lib/engine/types";
import { fmt } from "@/lib/utils";

export function OverlaidMVDiagram({
  lcA,
  lcB,
  mode,
}: {
  lcA: LoadCaseResult;
  lcB: LoadCaseResult;
  mode: "M" | "V" | "d";
}) {
  const stA = lcA.left.stations;
  const stB = lcB.left.stations;
  if (!stA.length || !stB.length) return null;
  const zTop = stA[0]!.z;
  const zBot = stA[stA.length - 1]!.z;
  const pick = (s: { z: number; M: number; V: number; dmm: number }) => (mode === "M" ? s.M : mode === "V" ? s.V : s.dmm);

  const valsA = stA.map(pick);
  const valsB = stB.map(pick);
  const maxAbs = Math.max(10, ...valsA.map(Math.abs), ...valsB.map(Math.abs));

  const W = 420;
  const H = 420;
  const ml = 48;
  const mr = 12;
  const mt = 20;
  const mb = 38;
  const mid = ml + (W - ml - mr) / 2;
  const sx = (v: number) => mid + (v / maxAbs) * ((W - ml - mr) / 2);
  const sy = (z: number) => mt + ((zTop - z) / (zTop - zBot)) * (H - mt - mb);

  const pathA = stA.map((s, i) => `${i === 0 ? "M" : "L"} ${sx(pick(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`).join(" ");
  const pathB = stB.map((s, i) => `${i === 0 ? "M" : "L"} ${sx(pick(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`).join(" ");
  const title = mode === "M" ? "Bending Moment M (kNm/m)" : mode === "V" ? "Shear Force V (kN/m)" : "Deflection δ (mm)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-panel rounded-lg shadow-sm" role="img" aria-label={title}>
      <rect width={W} height={H} fill="#f7f4ec" rx="8" />
      <line x1={mid} y1={mt} x2={mid} y2={H - mb} stroke="#1c1917" strokeDasharray="3 3" strokeWidth="1" />

      {/* Load Case A */}
      <path d={pathA} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      {/* Load Case B */}
      <path d={pathB} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 3" />

      {/* Legend at bottom */}
      <g transform={`translate(${ml}, ${H - 26})`}>
        <line x1="0" y1="0" x2="16" y2="0" stroke="#2563eb" strokeWidth="2.5" />
        <text x="20" y="4" fontSize="9" fill="#1c1917" fontFamily="IBM Plex Sans" fontWeight="500">
          {lcA.id}: {lcA.name.length > 16 ? lcA.name.slice(0, 14) + "..." : lcA.name}
        </text>
        <line x1="190" y1="0" x2="206" y2="0" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 3" />
        <text x="210" y="4" fontSize="9" fill="#1c1917" fontFamily="IBM Plex Sans" fontWeight="500">
          {lcB.id}: {lcB.name.length > 16 ? lcB.name.slice(0, 14) + "..." : lcB.name}
        </text>
      </g>

      <text x={W / 2} y={12} textAnchor="middle" fontSize="11" fill="#1c1917" fontFamily="IBM Plex Sans" fontWeight="bold">
        {title}
      </text>
      <text x={12} y={mt + 8} fontSize="9" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zTop.toFixed(1)}m
      </text>
      <text x={12} y={H - mb - 6} fontSize="9" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zBot.toFixed(1)}m
      </text>
    </svg>
  );
}
