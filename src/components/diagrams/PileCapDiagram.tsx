import type { PileCapAnalysisResult, PileCapProject } from "@/lib/pile-cap/types";

const MONO = "JetBrains Mono, monospace";

export function PileCapElevation({ project, result }: { project: PileCapProject; result: PileCapAnalysisResult }) {
  const W = 760;
  const H = 400;
  const padX = 60;
  const padTop = 46;
  const capTop = 150;
  const pileBlock = 200;

  const scaleX = (x: number) => padX + (x / project.capLength) * (W - 2 * padX);
  const scaleY = (y: number) => padTop + (y / project.capDepth) * (capTop + pileBlock - padTop);

  const pileX1 = scaleX((project.capLength - project.pileSpacing) / 2);
  const pileX2 = scaleX((project.capLength + project.pileSpacing) / 2);
  const pileR = (project.pileDiameter / project.capLength) * (W - 2 * padX) * 0.5;
  const colR = (project.columnLengthX / project.capLength) * (W - 2 * padX) * 0.5;

  const colX = W / 2;
  const tieY = scaleY(project.capDepth - result.effectiveDepth);
  const colBaseY = scaleY(0);
  const pileTopY = scaleY(project.capDepth);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-full" role="img" aria-label="2-pile pile cap strut-and-tie elevation">
      <defs>
        <pattern id="pcSoil" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#7d6650" strokeWidth="1.2" strokeOpacity="0.5" />
        </pattern>
      </defs>

      {/* ground hatch below cap */}
      <rect x={padX - 20} y={pileTopY} width={W - 2 * padX + 40} height={H - pileTopY} fill="url(#pcSoil)" />

      {/* Piles */}
      <rect x={pileX1 - pileR} y={pileTopY} width={2 * pileR} height={H - pileTopY} fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
      <rect x={pileX2 - pileR} y={pileTopY} width={2 * pileR} height={H - pileTopY} fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
      <text x={pileX1} y={H - 12} textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily={MONO}>
        R-max {result.reactionHigh.toFixed(0)} kN
      </text>
      <text x={pileX2} y={H - 12} textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily={MONO}>
        R-min {result.reactionLow.toFixed(0)} kN
      </text>

      {/* Cap block */}
      <rect x={scaleX(0)} y={colBaseY - 26} width={W - 2 * padX} height={pileTopY - colBaseY + 26} fill="rgba(6,182,212,0.10)" stroke="#38bdf8" strokeWidth="2" />

      {/* Column */}
      <rect x={colX - colR} y={padTop - 30} width={2 * colR} height={30} fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x={colX} y={padTop - 16} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={MONO}>
        Column N={project.nEd} kN
      </text>

      {/* Struts */}
      <line x1={colX} y1={colBaseY} x2={pileX1} y2={pileTopY} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 3" />
      <line x1={colX} y1={colBaseY} x2={pileX2} y2={pileTopY} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 3" />

      {/* Tie */}
      <line x1={pileX1 - pileR} y1={tieY} x2={pileX2 + pileR} y2={tieY} stroke="#22d3ee" strokeWidth="3.5" />
      <text x={colX} y={tieY - 8} textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily={MONO}>
        T = {result.tieForce.toFixed(0)} kN → As {result.asProvided} mm²
      </text>

      {/* theta label */}
      <g>
        <path d={`M ${colX} ${colBaseY} L ${colX + 70} ${colBaseY} L ${pileX1} ${pileTopY}`} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <circle cx={colX + 42} cy={colBaseY - 10} r="10" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.8" />
        <text x={colX + 42} y={colBaseY - 12} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily={MONO}>
          θ
        </text>
      </g>
      <text x={pileX1 + 18} y={(colBaseY + pileTopY) / 2 - 10} fill="#f59e0b" fontSize="10" fontFamily={MONO}>
        θ = {result.strutAngleDeg.toFixed(1)}°
      </text>

      {/* Dimensions */}
      <Dim label={`s = ${project.pileSpacing} mm c/c`} x1={scaleX(project.capLength / 2)} x2={pileX2 + 0} cx={colX} y={H - 30} />
      <Line label="c" x={scaleX(project.capLength)} y1={colBaseY - 26} y2={pileTopY} cy={(colBaseY - 26 + pileTopY) / 2} />

      <text x={13} y={colBaseY + 8} fill="#94a3b8" fontSize="10" fontFamily={MONO}>G.L.</text>
    </svg>
  );
}

export function PileCapPlan({ project, result }: { project: PileCapProject; result: PileCapAnalysisResult }) {
  const W = 520;
  const H = 360;
  const pad = 40;
  const capW = project.capWidth;
  const capL = project.capLength;
  const sx = (x: number) => pad + (x / capL) * (W - 2 * pad);
  const sy = (y: number) => pad + (y / capW) * (H - 2 * pad);
  const pileR = (Math.min(project.pileDiameter / capL, project.pileDiameter / capW) * (W - 2 * pad)) / 2;
  const columnW = (project.columnWidthY / capW) * (H - 2 * pad) / 2;
  const columnH = (project.columnLengthX / capL) * (W - 2 * pad) / 2;
  const pileY = (H - 2 * pad) / 2 + pad;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-full" role="img" aria-label="2-pile pile cap plan layout">
      {/* Cap plan */}
      <rect x={sx(0)} y={sy(0)} width={W - 2 * pad} height={H - 2 * pad} fill="rgba(6,182,212,0.08)" stroke="#38bdf8" strokeWidth="2" />

      {/* Piles */}
      <circle cx={sx((capL - project.pileSpacing) / 2)} cy={pileY} r={pileR} fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
      <circle cx={sx((capL + project.pileSpacing) / 2)} cy={pileY} r={pileR} fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
      <text x={sx((capL - project.pileSpacing) / 2)} y={pileY + 4} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily={MONO}>
        Ø{project.pileDiameter}
      </text>
      <text x={sx((capL + project.pileSpacing) / 2)} y={pileY + 4} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily={MONO}>
        Ø{project.pileDiameter}
      </text>

      {/* Column */}
      <rect x={W / 2 - columnH} y={H / 2 - columnW} width={2 * columnH} height={2 * columnW} fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x={W / 2} y={H / 2 + 3} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily={MONO}>
        {project.columnLengthX}×{project.columnWidthY}
      </text>

      {/* Tie band */}
      <rect
        x={sx((capL - project.pileSpacing) / 2)}
        y={H / 2 - (project.tieBandWidth / capW) * (H - 2 * pad) / 2}
        width={sx((capL + project.pileSpacing) / 2) - sx((capL - project.pileSpacing) / 2)}
        height={(project.tieBandWidth / capW) * (H - 2 * pad)}
        fill="rgba(34,211,238,0.10)"
        stroke="#22d3ee"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text x={sx((capL - project.pileSpacing) / 2)} y={H / 2 - (project.tieBandWidth / capW) * (H - 2 * pad) / 2 - 6} fill="#22d3ee" fontSize="9" fontFamily={MONO}>
        tie band {project.tieBandWidth} mm
      </text>

      <Dim label={`B = ${capW} mm`} x1={sx(capL / 2)} x2={W - 6} cx={sx(capL)} y={H / 2 + 12} />
    </svg>
  );
}

function Dim({ label, x1, x2, cx, y }: { label: string; x1: number; x2: number; cx: number; y: number }) {
  return (
    <g>
      <line x1={x1 + 18} y1={y} x2={x2 - 10} y2={y} stroke="#94a3b8" strokeWidth="1" />
      <line x1={x1 + 18} y1={y - 4} x2={x1 + 18} y2={y + 4} stroke="#94a3b8" strokeWidth="1" />
      <line x1={x2 - 10} y1={y - 4} x2={x2 - 10} y2={y + 4} stroke="#94a3b8" strokeWidth="1" />
      <rect x={cx - 110} y={y - 12} width="220" height="16" fill="#07111f" rx="3" />
      <text x={cx} y={y - 1} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily={MONO}>
        {label}
      </text>
    </g>
  );
}

function Line({ label, x, y1, y2, cy }: { label: string; x: number; y1: number; y2: number; cy: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#94a3b8" strokeWidth="1" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke="#94a3b8" strokeWidth="1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke="#94a3b8" strokeWidth="1" />
      <text x={x - 8} y={cy + 4} textAnchor="end" fill="#cbd5e1" fontSize="10" fontFamily={MONO}>
        {label}
      </text>
    </g>
  );
}