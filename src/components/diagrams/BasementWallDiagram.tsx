import type { BasementWallAnalysisResult, BasementWallProject } from "@/lib/basement-wall/types";

const MONO = "JetBrains Mono, monospace";

/** Elevation: base fixity, top prop (slab), and the moment-diagram sign reversal for the permanent stage. */
export function BasementWallSection({ project, result }: { project: BasementWallProject; result: BasementWallAnalysisResult }) {
  const W = 780;
  const H = 460;
  const padX = 110;
  const padTop = 50;
  const padBottom = 40;

  const Hmm = project.stemHeight + project.baseThickness;
  const scale = (H - padTop - padBottom) / Hmm;
  const wallScale = Math.max(scale * 6, 0.6); // exaggerate thickness for legibility

  const baseTopY = padTop + project.stemHeight * scale; // top of base slab
  const baseBottomY = baseTopY + project.baseThickness * scale;
  const topY = padTop; // underside of ground-floor slab (prop level)

  const wallX0 = padX;
  const wallX1 = wallX0 + project.wallThickness * wallScale;
  const backfillX1 = W - padX + 40;

  // moment diagram (right side): hogging at base, sagging near mid-height for the permanent stage
  const mdX0 = W - padX + 70;
  const mdWidth = 90;
  const baseM = result.permanent.baseMEd;
  const spanM = result.permanent.spanMEd;
  const mScale = 30 / Math.max(1, Math.max(baseM, spanM));
  const spanY = padTop + (result.permanent.spanDepthFromTop / 1000) * scale;

  return (
    <svg viewBox={`0 0 ${W + 90} ${H}`} className="w-full h-auto max-w-full" role="img" aria-label="Basement retaining wall elevation">
      <defs>
        <pattern id="bwSoil" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#7d6650" strokeWidth="1.2" strokeOpacity="0.55" />
        </pattern>
        <pattern id="bwHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1" />
        </pattern>
      </defs>

      {/* retained backfill, right side of wall */}
      <rect x={wallX1} y={topY} width={backfillX1 - wallX1} height={baseBottomY - topY} fill="url(#bwSoil)" />
      <line x1={wallX1} y1={topY} x2={backfillX1} y2={topY} stroke="#a3866a" strokeWidth="1.5" />

      {/* base slab */}
      <rect x={wallX0 - 90} y={baseTopY} width={backfillX1 - (wallX0 - 90)} height={baseBottomY - baseTopY} fill="rgba(6,182,212,0.1)" stroke="#38bdf8" strokeWidth="2" />
      <rect x={wallX0 - 90} y={baseTopY - 8} width={40} height={8} fill="url(#bwHatch)" stroke="#64748b" strokeWidth="1" />
      <text x={wallX0 - 85} y={baseTopY - 12} fill="#64748b" fontSize="9" fontFamily={MONO}>
        Fixed base
      </text>

      {/* prismatic wall */}
      <rect x={wallX0} y={topY} width={wallX1 - wallX0} height={baseTopY - topY} fill="rgba(6,182,212,0.14)" stroke="#38bdf8" strokeWidth="2" />

      {/* top prop (ground-floor slab), pin symbol */}
      <rect x={wallX0 - 60} y={topY - 10} width={wallX1 - wallX0 + 60} height={10} fill="rgba(6,182,212,0.1)" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx={(wallX0 + wallX1) / 2} cy={topY} r={5} fill="#0b1a2c" stroke="#fef08a" strokeWidth="2" />
      <text x={wallX0 - 58} y={topY - 14} fill="#64748b" fontSize="9" fontFamily={MONO}>
        Pinned prop (G.F. slab)
      </text>

      {/* construction-stage pressure (triangular, dashed) */}
      <polygon
        points={`${wallX1},${topY} ${wallX1 + 20},${baseTopY} ${wallX1},${baseTopY}`}
        fill="none"
        stroke="#94a3b8"
        strokeDasharray="4 3"
        strokeWidth="1.3"
      />
      <text x={wallX1 + 24} y={(topY + baseTopY) / 2 - 30} fill="#94a3b8" fontSize="9" fontFamily={MONO}>
        Construction (Ka)
      </text>

      {/* permanent-stage pressure (trapezoidal, solid, incl. water) */}
      <polygon
        points={`${wallX1},${topY} ${wallX1 + 38},${baseTopY} ${wallX1},${baseTopY}`}
        fill="rgba(245,158,11,0.16)"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <text x={wallX1 + 42} y={(topY + baseTopY) / 2 + 10} fill="#f59e0b" fontSize="9" fontFamily={MONO}>
        Permanent ({result.permanent.kLabel})
      </text>

      {/* moment diagram: hogging (+, toward wall) at base, sagging (-, away) near mid-height */}
      <line x1={mdX0} y1={topY} x2={mdX0} y2={baseTopY} stroke="#475569" strokeWidth="1" />
      <polyline
        points={`${mdX0},${topY} ${mdX0 - spanM * mScale},${spanY} ${mdX0 + baseM * mScale},${baseTopY}`}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.8"
      />
      <text x={mdX0 + 4} y={topY + 10} fill="#94a3b8" fontSize="9" fontFamily={MONO}>
        M(z)
      </text>
      <text x={mdX0 - spanM * mScale - 6} y={spanY} textAnchor="end" fill="#22d3ee" fontSize="9" fontFamily={MONO}>
        sag {spanM.toFixed(0)}
      </text>
      <text x={mdX0 + baseM * mScale + 6} y={baseTopY} fill="#22d3ee" fontSize="9" fontFamily={MONO}>
        hog {baseM.toFixed(0)}
      </text>

      {/* labels */}
      <text x={wallX0 - 6} y={topY - 20} textAnchor="end" fill="#cbd5e1" fontSize="10" fontFamily={MONO}>
        H = {(project.stemHeight / 1000).toFixed(2)} m
      </text>
      <text x={wallX1 + 4} y={topY - 20} fill="#a3866a" fontSize="9" fontFamily={MONO}>
        γ={project.gammaBackfill} φ&apos;={project.phiBackfillDeg}°
      </text>
      <text x={wallX0} y={baseBottomY + 16} fill="#94a3b8" fontSize="9" fontFamily={MONO}>
        t = {project.wallThickness} mm · base {project.baseThickness} mm
      </text>
      <text x={wallX0} y={baseBottomY + 30} fill="#fef08a" fontSize="9" fontFamily={MONO}>
        Prop reaction P = {result.permanent.propReaction} kN/m
      </text>
    </svg>
  );
}
