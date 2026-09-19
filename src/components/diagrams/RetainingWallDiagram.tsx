import type { CantileverWallAnalysisResult, CantileverWallProject } from "@/lib/retaining-wall/types";

const MONO = "JetBrains Mono, monospace";

export function RetainingWallSection({ project, result }: { project: CantileverWallProject; result: CantileverWallAnalysisResult }) {
  const W = 780;
  const H = 460;
  const padX = 70;
  const padTop = 40;
  const padBottom = 60;

  const Bmm = result.baseWidth;
  const Hmm = result.totalHeight;
  const scale = Math.min((W - 2 * padX) / Bmm, (H - padTop - padBottom) / Hmm);

  const baseY = padTop + Hmm * scale; // underside of footing (screen y)
  const footingTopY = baseY - project.baseThickness * scale;
  const stemTopY = footingTopY - project.stemHeight * scale;

  const toeX0 = padX;
  const toeX1 = toeX0 + project.toeLength * scale;
  const stemX0 = toeX1;
  const stemX1 = stemX0 + project.stemBaseThickness * scale;
  const stemTopX0 = stemX0;
  const stemTopX1 = stemX0 + project.stemTopThickness * scale;
  const heelX0 = stemX1;
  const heelX1 = heelX0 + project.heelLength * scale;

  const frontGradeY = baseY - project.embedmentDepth * scale;

  const c1 = result.combos.c1;
  const eSign = c1.heelPressure >= c1.toePressure ? 1 : -1;
  const pressureScale = 24 / Math.max(1, Math.max(c1.toePressure, c1.heelPressure));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-full" role="img" aria-label="Cantilever retaining wall cross-section">
      <defs>
        <pattern id="rwSoilRetained" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#7d6650" strokeWidth="1.2" strokeOpacity="0.55" />
        </pattern>
        <pattern id="rwSoilFront" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#5b7d6c" strokeWidth="1.2" strokeOpacity="0.55" />
        </pattern>
      </defs>

      {/* retained backfill (right side, up to top of stem) */}
      <rect x={heelX0} y={stemTopY} width={W - padX - heelX0} height={baseY - stemTopY} fill="url(#rwSoilRetained)" />
      <line x1={heelX0} y1={stemTopY} x2={W - padX + 10} y2={stemTopY} stroke="#a3866a" strokeWidth="1.5" />

      {/* front-side ground (left side, down to front grade) */}
      <rect x={padX - 20} y={frontGradeY} width={toeX0 - (padX - 20)} height={baseY - frontGradeY} fill="url(#rwSoilFront)" />
      <line x1={padX - 20} y1={frontGradeY} x2={toeX0} y2={frontGradeY} stroke="#7fa08c" strokeWidth="1.5" />
      {/* soil cover over the toe */}
      <rect x={toeX0} y={frontGradeY} width={toeX1 - toeX0} height={Math.max(0, footingTopY - frontGradeY)} fill="url(#rwSoilFront)" />

      {/* footing */}
      <rect x={toeX0} y={footingTopY} width={heelX1 - toeX0} height={baseY - footingTopY} fill="rgba(6,182,212,0.12)" stroke="#38bdf8" strokeWidth="2" />

      {/* stem (trapezoid: vertical back face at stemX1, battered front face) */}
      <polygon
        points={`${stemX0},${footingTopY} ${stemX1},${footingTopY} ${stemTopX1},${stemTopY} ${stemTopX0},${stemTopY}`}
        fill="rgba(6,182,212,0.12)"
        stroke="#38bdf8"
        strokeWidth="2"
      />

      {/* shear key */}
      {project.hasShearKey && (
        <rect
          x={toeX0 + (project.keyDistanceFromToe * scale)}
          y={baseY}
          width={project.keyWidth * scale}
          height={project.keyDepth * scale}
          fill="rgba(6,182,212,0.12)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
      )}

      {/* active pressure triangle on the retained (virtual back) face at x = heelX1 */}
      <polygon
        points={`${heelX1},${stemTopY} ${heelX1 + 26},${baseY} ${heelX1},${baseY}`}
        fill="rgba(245,158,11,0.18)"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <text x={heelX1 + 30} y={(stemTopY + baseY) / 2} fill="#f59e0b" fontSize="10" fontFamily={MONO}>
        Pa,active
      </text>

      {/* base pressure diagram beneath footing */}
      <polygon
        points={`${toeX0},${baseY} ${toeX0},${baseY + Math.max(2, c1.toePressure * pressureScale)} ${heelX1},${baseY + Math.max(2, c1.heelPressure * pressureScale)} ${heelX1},${baseY}`}
        fill="rgba(34,211,238,0.18)"
        stroke="#22d3ee"
        strokeWidth="1.5"
      />
      <text x={toeX0} y={baseY + Math.max(2, c1.toePressure * pressureScale) + 12} fill="#22d3ee" fontSize="10" fontFamily={MONO}>
        q_toe {c1.toePressure.toFixed(0)} kPa
      </text>
      <text x={heelX1 - 90} y={baseY + Math.max(2, c1.heelPressure * pressureScale) + 12} fill="#22d3ee" fontSize="10" fontFamily={MONO}>
        q_heel {c1.heelPressure.toFixed(0)} kPa
      </text>

      {/* resultant marker */}
      <g>
        <line
          x1={toeX0 + (result.baseWidth / 2000 + eSign * c1.eccentricity) * scale * 1000}
          y1={baseY - 14}
          x2={toeX0 + (result.baseWidth / 2000 + eSign * c1.eccentricity) * scale * 1000}
          y2={baseY + 6}
          stroke="#fef08a"
          strokeWidth="2"
        />
        <text x={toeX0 + (result.baseWidth / 2000 + eSign * c1.eccentricity) * scale * 1000} y={baseY - 18} textAnchor="middle" fill="#fef08a" fontSize="9" fontFamily={MONO}>
          R (e={c1.eccentricity.toFixed(2)}m)
        </text>
      </g>

      {/* labels */}
      <text x={toeX0} y={footingTopY - 8} fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        Toe {project.toeLength} mm
      </text>
      <text x={heelX0 + 6} y={footingTopY - 8} fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        Heel {project.heelLength} mm
      </text>
      <text x={stemTopX0 - 4} y={stemTopY - 8} fill="#cbd5e1" fontSize="10" fontFamily={MONO}>
        H = {(result.totalHeight / 1000).toFixed(2)} m
      </text>
      <text x={toeX0 - 55} y={baseY + 4} fill="#94a3b8" fontSize="10" fontFamily={MONO}>
        F.G.
      </text>
      <text x={heelX1 + 5} y={stemTopY - 8} fill="#a3866a" fontSize="10" fontFamily={MONO}>
        Backfill γ={project.gammaBackfill} φ'={project.phiBackfillDeg}°
      </text>
    </svg>
  );
}
