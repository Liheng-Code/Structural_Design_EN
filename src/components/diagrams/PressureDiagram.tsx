import type { Station } from "@/lib/engine/types";

export function PressureDiagram({ stations, side = "L" }: { stations: Station[]; side?: "L" | "R" }) {
  if (!stations.length) return null;
  const zTop = stations[0]!.z;
  const zBot = stations[stations.length - 1]!.z;
  const values = stations.flatMap((s) => [
    s.pSoilCore,
    s.pPassive,
    side === "L" ? s.uUp : s.uDown,
    Math.abs(side === "L" ? s.pNetL : s.pNetR),
    s.pSur,
  ]);
  const pMax = Math.max(20, ...values, 1);
  const W = 640;
  const H = 480;
  const ml = 54;
  const mr = 16;
  const mt = 18;
  const mb = 36;
  const sx = (p: number) => ml + (p / pMax) * (W - ml - mr);
  const sy = (z: number) => mt + ((zTop - z) / (zTop - zBot)) * (H - mt - mb);

  const path = (pick: (s: Station) => number) => {
    const pts = stations.map((s) => `${sx(Math.max(pick(s), 0)).toFixed(1)},${sy(s.z).toFixed(1)}`);
    return `M ${sx(0)} ${sy(zTop)} L ${pts.join(" L ")} L ${sx(0)} ${sy(zBot)}`;
  };

  const net = (s: Station) => (side === "L" ? s.pNetL : s.pNetR);
  const water = (s: Station) => (side === "L" ? s.uUp : s.uDown);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-panel" role="img" aria-label="Lateral pressure diagram">
      <rect width={W} height={H} fill="#f7f4ec" />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const p = t * pMax;
        return (
          <g key={t}>
            <line x1={sx(p)} y1={mt} x2={sx(p)} y2={H - mb} stroke="#e0d8c8" />
            <text x={sx(p)} y={H - 12} textAnchor="middle" fontSize="10" fill="#5c564e" fontFamily="IBM Plex Mono">
              {p.toFixed(0)}
            </text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#5c564e" fontFamily="IBM Plex Sans">
        Pressure (kPa)
      </text>
      <text x={12} y={mt + 8} fontSize="10" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zTop.toFixed(1)} m
      </text>
      <text x={12} y={H - mb} fontSize="10" fill="#5c564e" fontFamily="IBM Plex Mono">
        {zBot.toFixed(1)} m
      </text>

      <path d={path((s) => s.pSoilCore)} fill="#c4a574" fillOpacity="0.28" stroke="#8a6a3a" strokeWidth="1.5" />
      <path d={path(water)} fill="#6a93b5" fillOpacity="0.28" stroke="#2f5f8a" strokeWidth="1.5" />
      <path d={path((s) => s.pSur)} fill="none" stroke="#8a6414" strokeWidth="1.4" strokeDasharray="4 3" />
      <path d={path((s) => s.pPassive)} fill="none" stroke="#1f6b45" strokeWidth="1.4" />
      <path
        d={stations
          .map((s, i) => `${i === 0 ? "M" : "L"} ${sx(net(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`)
          .join(" ")}
        fill="none"
        stroke="#9b2f28"
        strokeWidth="2.2"
      />
      <line x1={sx(0)} y1={mt} x2={sx(0)} y2={H - mb} stroke="#1c1917" strokeWidth="1.2" />

      <Legend x={W - 170} y={24} />
    </svg>
  );
}

function Legend({ x, y }: { x: number; y: number }) {
  const items = [
    { c: "#8a6a3a", t: "Active fill (soil)" },
    { c: "#2f5f8a", t: "Water" },
    { c: "#8a6414", t: "Surcharge" },
    { c: "#1f6b45", t: "Passive (embedment)" },
    { c: "#9b2f28", t: "Net on wall" },
  ];
  return (
    <g>
      {items.map((it, i) => (
        <g key={it.t} transform={`translate(${x}, ${y + i * 16})`}>
          <rect width="14" height="3" y="4" fill={it.c} />
          <text x="20" y="9" fontSize="10" fill="#1c1917" fontFamily="IBM Plex Sans">
            {it.t}
          </text>
        </g>
      ))}
    </g>
  );
}
