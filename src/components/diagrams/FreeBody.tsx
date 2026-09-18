import type { LoadCaseResult, Project } from "@/lib/engine/types";
import { fmt } from "@/lib/utils";

export function FreeBody({ project, lc }: { project: Project; lc: LoadCaseResult }) {
  const H = project.geometry.retainedHeight;
  const D = project.geometry.embedment;
  const W = 560;
  const Ht = 460;
  const top = H + 0.6;
  const bot = -D - 0.4;
  const sx = (x: number) => 280 + x * 28;
  const sy = (z: number) => 24 + ((top - z) / (top - bot)) * (Ht - 48);
  const wallX = 0;

  const arrows = (n: number, z0: number, z1: number, dir: number, color: string) => {
    const items = [];
    for (let i = 0; i < n; i++) {
      const z = z0 - ((i + 0.5) / n) * (z0 - z1);
      const len = 18 + i * 7;
      const x1 = sx(wallX);
      const x2 = x1 + dir * len;
      items.push(
        <g key={`${z}-${dir}-${color}`}>
          <line x1={x1} y1={sy(z)} x2={x2} y2={sy(z)} stroke={color} strokeWidth="1.6" markerEnd="url(#ah)" />
        </g>,
      );
    }
    return items;
  };

  return (
    <svg viewBox={`0 0 ${W} ${Ht}`} className="w-full h-auto bg-panel" role="img" aria-label="Free body diagram">
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1c1917" />
        </marker>
      </defs>
      <rect width={W} height={Ht} fill="#f7f4ec" />
      <rect x={sx(wallX) - 10} y={sy(H)} width="20" height={sy(-D) - sy(H)} fill="#5f656c" stroke="#1c1917" />
      {arrows(5, H, 0, -1, "#2f5f8a")}
      {arrows(4, H, 0, 1, "#8a6a3a")}
      {arrows(4, 0, -D, 1, "#1f6b45")}
      {lc.left.ties.map((t) => (
        <g key={t.id}>
          <line x1={sx(wallX) + 10} y1={sy(t.elevation)} x2={sx(wallX) + 70} y2={sy(t.elevation)} stroke="#9b2f28" strokeWidth="2" markerEnd="url(#ah)" />
          <text x={sx(wallX) + 76} y={sy(t.elevation) + 4} fontSize="10" fill="#9b2f28" fontFamily="IBM Plex Sans">
            {t.name} {fmt(t.T_kN, 1)} kN
          </text>
        </g>
      ))}
      <text x={40} y={sy(H / 2)} fontSize="11" fill="#2f5f8a" fontFamily="IBM Plex Sans Condensed">
        WATER {fmt(lc.forces.PwL, 0)} kN/m
      </text>
      <text x={W - 150} y={sy(H / 2)} fontSize="11" fill="#8a6a3a" fontFamily="IBM Plex Sans Condensed">
        FILL {fmt(lc.forces.PaL, 0)} kN/m
      </text>
      <text x={W - 170} y={sy(-D / 2)} fontSize="11" fill="#1f6b45" fontFamily="IBM Plex Sans Condensed">
        PASSIVE {fmt(lc.forces.Pp, 0)} kN/m
      </text>
      <text x={sx(wallX)} y={Ht - 10} textAnchor="middle" fontSize="11" fill="#5c564e" fontFamily="IBM Plex Sans">
        Upstream wall FBD · {lc.name}
      </text>
    </svg>
  );
}
