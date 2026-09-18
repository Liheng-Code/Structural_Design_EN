import type { AnalysisResult } from "@/lib/engine/types";

export function MVDiagram({ analysis, mode }: { analysis: AnalysisResult; mode: "M" | "V" | "d" }) {
  const st = analysis.stations;
  if (!st.length) return null;
  const zTop = st[0]!.z;
  const zBot = st[st.length - 1]!.z;
  const pick = (s: (typeof st)[0]) => (mode === "M" ? s.M : mode === "V" ? s.V : s.dmm);
  const vals = st.map(pick);
  const maxAbs = Math.max(10, ...vals.map((v) => Math.abs(v)));
  const W = 420;
  const H = 420;
  const ml = 48;
  const mr = 12;
  const mt = 16;
  const mb = 28;
  const mid = ml + (W - ml - mr) / 2;
  const sx = (v: number) => mid + (v / maxAbs) * ((W - ml - mr) / 2);
  const sy = (z: number) => mt + ((zTop - z) / (zTop - zBot)) * (H - mt - mb);
  const d = st.map((s, i) => `${i === 0 ? "M" : "L"} ${sx(pick(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`).join(" ");
  const title = mode === "M" ? "Bending M (kNm/m)" : mode === "V" ? "Shear V (kN/m)" : "Deflection δ (mm)";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-panel" role="img" aria-label={title}>
      <rect width={W} height={H} fill="#f7f4ec" />
      <line x1={mid} y1={mt} x2={mid} y2={H - mb} stroke="#1c1917" />
      <path d={`${d} L ${mid} ${sy(zBot)} L ${mid} ${sy(zTop)} Z`} fill="#1a4a7a" fillOpacity="0.18" stroke="#1a4a7a" strokeWidth="1.8" />
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#5c564e" fontFamily="IBM Plex Sans">
        {title}
      </text>
      <text x={12} y={mt + 8} fontSize="10" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zTop.toFixed(1)}
      </text>
      <text x={12} y={H - mb} fontSize="10" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zBot.toFixed(1)}
      </text>
    </svg>
  );
}
