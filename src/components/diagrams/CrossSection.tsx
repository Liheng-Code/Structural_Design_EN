import type { Project } from "@/lib/engine/types";
import type { WaterState } from "@/lib/engine/calculate";

export function CrossSection({
  project,
  water,
  traffic,
}: {
  project: Project;
  water: WaterState;
  traffic: boolean;
}) {
  const H = project.geometry.retainedHeight;
  const D = project.geometry.embedment;
  const B = project.geometry.totalWidth;
  const t = project.geometry.wallThickness;
  const road = project.geometry.roadWidth;
  const capH = project.capping.enabled ? project.capping.h : 0;
  const capB = project.capping.enabled ? project.capping.b : 0;
  const rb = project.geometry.riverbed;
  const pav = project.pavement.asphalt + project.pavement.subbase;
  const top = rb + H + capH + 0.2;
  const bot = rb - D - 0.8;
  const xL = -B / 2;
  const xR = B / 2;
  const padL = 4.2;
  const padR = 4.2;
  const W = 920;
  const Ht = 520;
  const xMin = xL - padL;
  const xMax = xR + padR;
  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const sy = (z: number) => ((top - z) / (top - bot)) * Ht;
  const leftFace = xL;
  const rightFace = xR - t;

  const waterPoly = (side: "L" | "R", wl: number) => {
    if (wl <= rb) return "";
    const x0 = side === "L" ? xMin : xR;
    const x1 = side === "L" ? leftFace : xMax;
    return `${sx(x0)},${sy(wl)} ${sx(x1)},${sy(wl)} ${sx(x1)},${sy(rb)} ${sx(x0)},${sy(rb)}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${Ht}`} className="w-full h-auto max-w-full bg-panel" role="img" aria-label="U-shape sheet pile cross-section">
      <defs>
        <pattern id="hatch-soil" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#b08968" strokeWidth="1.2" />
        </pattern>
        <pattern id="hatch-fill" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#8a7b5a" opacity="0.45" />
        </pattern>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7eabcc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#4d7a9c" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={Ht} fill="#f7f4ec" />

      <line x1="0" y1={sy(rb)} x2={W} y2={sy(rb)} stroke="#c9c0b0" strokeWidth="1" />

      <rect x={sx(xMin)} y={sy(rb)} width={sx(leftFace) - sx(xMin)} height={sy(bot) - sy(rb)} fill="url(#hatch-soil)" />
      <rect x={sx(xR)} y={sy(rb)} width={sx(xMax) - sx(xR)} height={sy(bot) - sy(rb)} fill="url(#hatch-soil)" />
      <rect x={sx(leftFace + t)} y={sy(rb)} width={sx(rightFace) - sx(leftFace + t)} height={sy(bot) - sy(rb)} fill="url(#hatch-soil)" opacity="0.55" />

      {water.up > rb ? <polygon points={waterPoly("L", water.up)} fill="url(#waterGrad)" /> : null}
      {water.down > rb ? <polygon points={waterPoly("R", water.down)} fill="url(#waterGrad)" /> : null}

      <rect
        x={sx(leftFace + t)}
        y={sy(rb + H)}
        width={sx(rightFace) - sx(leftFace + t)}
        height={sy(rb) - sy(rb + H)}
        fill="url(#hatch-fill)"
        stroke="#8a7b5a"
        strokeWidth="0.6"
      />

      <rect x={sx(leftFace + t)} y={sy(rb + H)} width={sx(rightFace) - sx(leftFace + t)} height={sy(rb + H - pav) - sy(rb + H)} fill="#3a3f46" />
      <rect x={sx(leftFace + t)} y={sy(rb + H - project.pavement.subbase)} width={sx(rightFace) - sx(leftFace + t)} height={sy(rb + H - pav) - sy(rb + H - project.pavement.subbase)} fill="#9a9386" />

      <rect x={sx(leftFace)} y={sy(rb + H)} width={sx(leftFace + t) - sx(leftFace)} height={sy(rb - D) - sy(rb + H)} fill="#5f656c" stroke="#2c3036" strokeWidth="1" />
      <rect x={sx(rightFace)} y={sy(rb + H)} width={sx(rightFace + t) - sx(rightFace)} height={sy(rb - D) - sy(rb + H)} fill="#5f656c" stroke="#2c3036" strokeWidth="1" />

      {project.capping.enabled ? (
        <>
          <rect x={sx(leftFace - (capB - t) / 2)} y={sy(rb + H + capH)} width={sx(capB) - sx(0)} height={sy(rb + H) - sy(rb + H + capH)} fill="#2a3138" />
          <rect x={sx(rightFace - (capB - t) / 2)} y={sy(rb + H + capH)} width={sx(capB) - sx(0)} height={sy(rb + H) - sy(rb + H + capH)} fill="#2a3138" />
        </>
      ) : null}

      {project.ties
        .filter((tr) => tr.enabled)
        .map((tr, i) => {
          const y = sy(tr.elevation);
          const dash = i === 0 ? undefined : "6 4";
          return (
            <g key={tr.id}>
              <line x1={sx(leftFace + t)} y1={y} x2={sx(rightFace)} y2={y} stroke="#9b2f28" strokeWidth="2.4" strokeDasharray={dash} />
              <circle cx={sx(leftFace + t)} cy={y} r="3.5" fill="#9b2f28" />
              <circle cx={sx(rightFace)} cy={y} r="3.5" fill="#9b2f28" />
              <text x={(sx(leftFace + t) + sx(rightFace)) / 2} y={y - 6} textAnchor="middle" fill="#9b2f28" fontSize="11" fontFamily="IBM Plex Sans Condensed, sans-serif">
                {tr.name} Ø{tr.diameter} mm @ y=+{tr.elevation.toFixed(2)} m
              </text>
            </g>
          );
        })}

      {traffic ? (
        <g>
          <rect x={sx(-2.6)} y={sy(rb + H + 0.05 + 1.4)} width={sx(2.1) - sx(0)} height={sy(0) - sy(1.4)} fill="#c45c2a" rx="3" />
          <rect x={sx(-2.4)} y={sy(rb + H + 0.05 + 2.1)} width={sx(1.2) - sx(0)} height={sy(0) - sy(0.7)} fill="#d9e6f2" />
          <rect x={sx(0.7)} y={sy(rb + H + 0.05 + 1.15)} width={sx(1.6) - sx(0)} height={sy(0) - sy(1.15)} fill="#2f5f8a" rx="3" />
          <rect x={sx(0.85)} y={sy(rb + H + 0.05 + 1.75)} width={sx(1.1) - sx(0)} height={sy(0) - sy(0.55)} fill="#d9e6f2" />
        </g>
      ) : null}

      <line x1={sx(xMin + 0.2)} y1={sy(rb)} x2={sx(xMax - 0.2)} y2={sy(rb)} stroke="#5c564e" strokeWidth="1.2" />

      <Dim
        x1={sx(leftFace)}
        x2={sx(xR)}
        y={sy(rb + H + capH + 1.55)}
        label={`${B.toFixed(2)} m OUT-TO-OUT`}
      />
      <Dim
        x1={sx(leftFace + t)}
        x2={sx(rightFace)}
        y={sy(rb + H + capH + 0.85)}
        label={`${road.toFixed(2)} m ROADWAY`}
      />

      <VDim x={sx(leftFace) - 36} y1={sy(rb + H)} y2={sy(rb)} label={`${H.toFixed(2)} m H`} />
      <VDim x={sx(leftFace) - 36} y1={sy(rb)} y2={sy(rb - D)} label={`${D.toFixed(2)} m D`} />

      {water.up > rb ? (
        <text x={sx((xMin + leftFace) / 2)} y={sy(water.up) - 8} textAnchor="middle" fill="#163a5f" fontSize="11" fontFamily="IBM Plex Sans Condensed">
          UP HWL = +{water.up.toFixed(2)} m
        </text>
      ) : (
        <text x={sx((xMin + leftFace) / 2)} y={sy(rb) - 10} textAnchor="middle" fill="#9b2f28" fontSize="10" fontFamily="IBM Plex Sans">
          Dry season · no inundation
        </text>
      )}
      {water.down > rb ? (
        <text x={sx((xR + xMax) / 2)} y={sy(water.down) - 8} textAnchor="middle" fill="#163a5f" fontSize="11" fontFamily="IBM Plex Sans Condensed">
          DOWN = +{water.down.toFixed(2)} m
        </text>
      ) : null}

      <text x={sx(0)} y={sy((rb + H) / 2)} textAnchor="middle" fill="#5c564e" fontSize="12" fontFamily="IBM Plex Sans Condensed">
        Compacted granular fill · {project.coreFill.compaction}% MDD
      </text>
      <text x={sx(0)} y={Ht - 14} textAnchor="middle" fill="#5c564e" fontSize="11" fontFamily="IBM Plex Sans">
        Riverbed / original ground y = {rb.toFixed(2)} m · precast RC T&G {project.sheetPile.sectionName}
      </text>
    </svg>
  );
}

function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#1c1917" strokeWidth="1" />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke="#1c1917" strokeWidth="1" />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke="#1c1917" strokeWidth="1" />
      <rect x={(x1 + x2) / 2 - 70} y={y - 14} width="140" height="16" fill="#f7f4ec" />
      <text x={(x1 + x2) / 2} y={y - 2} textAnchor="middle" fontSize="11" fontFamily="IBM Plex Sans Condensed" fill="#1c1917">
        {label}
      </text>
    </g>
  );
}

function VDim({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#1c1917" strokeWidth="1" />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke="#1c1917" strokeWidth="1" />
      <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke="#1c1917" strokeWidth="1" />
      <text x={x - 8} y={(y1 + y2) / 2} textAnchor="end" fontSize="11" fontFamily="IBM Plex Sans Condensed" fill="#1c1917">
        {label}
      </text>
    </g>
  );
}
