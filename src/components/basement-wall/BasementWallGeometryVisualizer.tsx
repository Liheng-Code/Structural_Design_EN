import { useState, useMemo } from "react";
import { 
  Layers, 
  Activity, 
  Ruler, 
  Compass,
  TrendingUp,
  GitCommit,
  Waves,
  ZoomIn
} from "lucide-react";
import type { BasementWallProject, BasementWallAnalysisResult } from "@/lib/basement-wall/types";

interface VisualizerProps {
  project: BasementWallProject;
  result: BasementWallAnalysisResult;
}

type ViewMode = "elevation" | "rebar" | "deflection" | "moment" | "shear" | "combined";

export function BasementWallGeometryVisualizer({ project, result }: VisualizerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("elevation");
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [deflectionScale, setDeflectionScale] = useState<number>(300); // Exaggeration multiplier for bent shape

  // Clean Mode Logic:
  // - "Section" (elevation): shows clean geometry shape, dimension lines, surcharge loads, water strata, prop force. ZERO rebar.
  // - "Rebar": shows clean concrete shape, full rebar detailing & leader annotations. ZERO load/surcharge/water/dimensions.
  const isSectionMode = viewMode === "elevation";
  const isRebarMode = viewMode === "rebar";
  const isDeflectionMode = viewMode === "deflection";

  const showDimensions = isSectionMode;
  const showLoadsAndProps = isSectionMode;
  const showSoilWater = isSectionMode;
  const showRebar = isRebarMode;

  // SVG Geometry Dimensions & Coordinate System
  const svgWidth = 920;
  const svgHeight = 620;
  const margin = { top: 90, right: 30, bottom: 65, left: 140 };

  const usableHeight = svgHeight - margin.top - margin.bottom;

  // Scale calculations
  const totalHeightMm = project.stemHeight + project.baseThickness;
  const scaleY = usableHeight / totalHeightMm;
  
  // Wall thickness visual proportion
  const visualThicknessPx = Math.max(28, Math.min(65, project.wallThickness * 0.09));
  const baseSlabThicknessPx = Math.max(26, Math.min(55, project.baseThickness * scaleY * 1.25));
  const topSlabThicknessMm = project.topSlabThickness || 250;
  const topSlabThicknessPx = Math.max(18, Math.min(45, topSlabThicknessMm * scaleY * 1.25));

  // Coordinates
  const groundLevelY = margin.top;
  const wallTopY = groundLevelY;
  const baseTopY = groundLevelY + project.stemHeight * scaleY;
  const baseBottomY = baseTopY + baseSlabThicknessPx;
  
  // Wall Stem X coordinates
  const wallStemLeftX = margin.left + 50; // Interior basement face
  const wallStemRightX = wallStemLeftX + visualThicknessPx; // Exterior back face (flush boundary)
  
  // Base & Top slab X coordinates (flush with outer wall face)
  const baseInnerLeftX = wallStemLeftX - 100; // Extends into basement interior raft
  const baseOuterRightX = wallStemRightX; // FLUSH with outer wall face

  const topSlabInnerLeftX = wallStemLeftX - 90; // Extends into basement interior diaphragm
  const topSlabOuterRightX = wallStemRightX; // FLUSH with boundary edge

  // Ground water level & Backfill
  const waterDepthMm = project.waterTableDepthPermanent;
  const hasWater = waterDepthMm < project.stemHeight + 500;
  const isWaterAtGround = waterDepthMm <= 100;
  const waterLevelY = Math.min(baseBottomY + 30, groundLevelY + Math.max(0, waterDepthMm) * scaleY);

  // Rebar covers in px
  const innerCoverPx = Math.min(visualThicknessPx * 0.35, Math.max(5, (project.cNomBuried / project.wallThickness) * visualThicknessPx));
  const outerCoverPx = Math.min(visualThicknessPx * 0.35, Math.max(5, (project.cNomWater / project.wallThickness) * visualThicknessPx));

  // Capacity calculations
  const innerUtil = result.innerAsRequired > 0 ? result.innerAsRequired / Math.max(1, result.innerAsProvided) : 0;
  const outerUtil = result.outerAsRequired > 0 ? result.outerAsRequired / Math.max(1, result.outerAsProvided) : 0;

  // Compute Moment, Shear, and Deflection Profiles along height
  const { momentPts, shearPts, deflectionPts, maxDeflectionMm, peakDepthRatio, intermediateStations } = useMemo(() => {
    const n = 61;
    const H = project.stemHeight / 1000; // m
    const baseM = result.permanent.baseMEd; // kNm/m
    const spanM = result.permanent.spanMEd; // kNm/m
    const propR = result.permanent.propReaction; // kN/m
    const baseV = result.permanent.baseVEd; // kN/m
    const spanDepthM = result.permanent.spanDepthFromTop / 1000;

    // Estimate flexural stiffness EI (cracked SLS)
    const Ecm = result.ecm * 1e6; // kPa
    const tM = project.wallThickness / 1000;
    const Ig = (1.0 * Math.pow(tM, 3)) / 12;
    const Icr = 0.5 * Ig; // approximate cracked inertia for RC wall
    const EI = Ecm * Icr; // kNm²

    const mArr: { y: number; m: number }[] = [];
    const vArr: { y: number; v: number }[] = [];
    const dArr: { y: number; delta: number; normalizedShape: number; zM: number; xi: number }[] = [];

    let maxDelta = 0;
    let maxDeltaRatio = 0.42;

    for (let i = 0; i <= n; i++) {
      const zM = (H * i) / n; // 0 to H
      const yPx = wallTopY + zM * 1000 * scaleY;
      const xi = zM / H;

      // Realistic propped cantilever bending moment M(z)
      let mVal = 0;
      if (spanDepthM > 0 && spanDepthM < H) {
        if (zM <= spanDepthM) {
          const ratio = zM / spanDepthM;
          mVal = -spanM * Math.sin((ratio * Math.PI) / 2);
        } else {
          const ratio = (zM - spanDepthM) / (H - spanDepthM);
          mVal = -spanM * Math.cos((ratio * Math.PI) / 2) + baseM * Math.pow(ratio, 2);
        }
      } else {
        mVal = baseM * Math.pow(xi, 2) - propR * zM * (1 - xi);
      }

      // Shear force V(z)
      const vVal = -propR + (baseV + propR) * Math.pow(xi, 1.3);

      // SLS Lateral Deflection delta(z) for propped cantilever under trapezoidal pressure
      // Boundary conditions: delta(0)=0 (pinned prop), delta(H)=0 (fixed base), slope(H)=0
      const shape = xi * Math.pow(1 - xi, 2) * (2 - xi);
      const normalizedShape = shape / 0.148; // Peak normalized to 1.0 at ~0.42H
      const qChar = (project.gammaBackfill * H + project.serviceSurchargeKpa) * 0.45;
      const calcDelta = (qChar * Math.pow(H, 4) * 1000 * 3.2 * shape) / Math.max(1000, EI);
      const deltaMm = Math.max(0, calcDelta);

      if (deltaMm > maxDelta) {
        maxDelta = deltaMm;
        maxDeltaRatio = xi;
      }

      mArr.push({ y: yPx, m: mVal });
      vArr.push({ y: yPx, v: vVal });
      dArr.push({ y: yPx, delta: deltaMm, normalizedShape, zM, xi });
    }

    const maxDefl = Math.min(25, Math.max(0.6, maxDelta));

    // Intermediate readout stations (20%, 70%) cleanly spaced from peak at ~42%
    const stations = [0.20, 0.70].map((ratio) => {
      const zM = H * ratio;
      const yPx = wallTopY + zM * 1000 * scaleY;
      const shape = ratio * Math.pow(1 - ratio, 2) * (2 - ratio);
      const deltaMm = maxDefl * (shape / 0.148);
      return { ratio, zM, yPx, deltaMm };
    });

    return {
      momentPts: mArr,
      shearPts: vArr,
      deflectionPts: dArr,
      maxDeflectionMm: maxDefl,
      peakDepthRatio: maxDeltaRatio,
      intermediateStations: stations,
    };
  }, [project, result, scaleY, wallTopY]);

  // Deflection limit check
  const allowableDeflectionMm = project.stemHeight / 500; // H/500
  const deflectionStatus = maxDeflectionMm <= allowableDeflectionMm ? "PASS" : "WARNING";

  // Bent wall shape path calculation for Wall Elevation (scaled by deflectionScale)
  const bentWallLeftPath = useMemo(() => {
    return deflectionPts.map((p, idx) => {
      const shiftX = -p.delta * (deflectionScale / 100) * 1.5;
      const x = wallStemLeftX + shiftX;
      return `${idx === 0 ? "M" : "L"} ${x} ${p.y}`;
    }).join(" ");
  }, [deflectionPts, deflectionScale, wallStemLeftX]);

  const bentWallRightPath = useMemo(() => {
    return [...deflectionPts].reverse().map((p, idx) => {
      const shiftX = -p.delta * (deflectionScale / 100) * 1.5;
      const x = wallStemRightX + shiftX;
      return `${idx === 0 ? "L" : "L"} ${x} ${p.y}`;
    }).join(" ");
  }, [deflectionPts, deflectionScale, wallStemRightX]);

  // Concrete volume per metre run
  const concreteVolumePerM = (
    (project.stemHeight / 1000) * (project.wallThickness / 1000) + 
    (1.1 * (project.baseThickness / 1000)) + 
    (0.9 * (topSlabThicknessMm / 1000))
  ).toFixed(3);
  const concreteWeightPerM = (Number(concreteVolumePerM) * 25).toFixed(1);

  return (
    <div className="flex flex-col bg-[#050c17] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#081528] border-b border-cyan-900/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
            <Compass className="size-3.5" />
            <span>Interactive 2D Visualizer</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
            Boundary Edge Wall · Real-time CAD Engine
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#030913] p-1 rounded-xl border border-slate-700/80 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setViewMode("elevation")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "elevation"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Ruler className="size-3.5" />
            <span>Section</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("rebar")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "rebar"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Rebar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("deflection")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "deflection"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Waves className="size-3.5 text-emerald-400" />
            <span>Deflection δ</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("moment")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "moment"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="size-3.5 text-cyan-400" />
            <span>Moment M</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("shear")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "shear"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="size-3.5 text-amber-400" />
            <span>Shear V</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("combined")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              viewMode === "combined"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCommit className="size-3.5 text-purple-400" />
            <span>All Graphs</span>
          </button>
        </div>

        {/* Scale & Bent Shape Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 bg-[#030913] px-2 py-1 rounded-lg border border-slate-700 text-slate-300">
            <ZoomIn className="size-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">Scale:</span>
            {[150, 300, 600].map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setDeflectionScale(sc)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                  deflectionScale === sc
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sc}×
              </button>
            ))}
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#040a14] border border-slate-700/80 text-cyan-300 hidden sm:block">
            <strong>{project.concreteGrade}</strong> (fcd {result.fcd}MPa)
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full bg-[#03070f] flex items-center justify-center p-2 min-h-[420px] sm:min-h-[520px] select-none">
        {/* Engineering Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d1c31_1px,transparent_1px),linear-gradient(to_bottom,#0d1c31_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 pointer-events-none" />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-w-[920px] drop-shadow-md"
          role="img"
          aria-label="Basement Wall Scaled Bent Shape, Geometry, Rebar and Diagrams"
        >
          <defs>
            {/* Retained soil hatching */}
            <pattern id="soilHatchPattern" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#8c7355" strokeWidth="1.2" strokeOpacity="0.35" />
              <circle cx="6" cy="6" r="1" fill="#8c7355" fillOpacity="0.35" />
            </pattern>

            {/* Submerged soil hatching */}
            <pattern id="waterSoilPattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.45" />
              <line x1="0" y1="5" x2="10" y2="5" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.25" />
            </pattern>

            {/* Concrete diagonal crosshatch */}
            <pattern id="concreteHatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="16" y2="0" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.25" />
              <line x1="0" y1="8" x2="16" y2="8" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.15" />
              <circle cx="4" cy="4" r="0.8" fill="#38bdf8" fillOpacity="0.35" />
              <circle cx="12" cy="12" r="0.8" fill="#38bdf8" fillOpacity="0.35" />
            </pattern>

            {/* Deformed Wall Emerald Gradient */}
            <linearGradient id="deformedWallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.45)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.35)" />
            </linearGradient>

            {/* Deflection Graph Fill Gradient (from baseline to curve) */}
            <linearGradient id="deformGraphGradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.45)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.08)" />
            </linearGradient>

            {/* Foundation bed hatching */}
            <pattern id="groundBedHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
              <line x1="0" y1="0" x2="8" y2="0" stroke="#475569" strokeWidth="1.2" strokeOpacity="0.4" />
            </pattern>

            {/* Arrow markers */}
            <marker id="dimArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
            <marker id="dimArrowAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#fbbf24" />
            </marker>
            <marker id="propArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
            <marker id="rebarLeaderArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444" />
            </marker>
            <marker id="rebarLeaderArrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
            </marker>
            <marker id="deltaArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
            </marker>
            <marker id="deltaArrowBoth" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
            </marker>
          </defs>

          {/* 1. RETAINED SOIL, WATER STRATUM & SURCHARGE (Only in Section Mode) */}
          {showSoilWater && (
            <g>
              {/* Backfill stratum */}
              <rect
                x={baseOuterRightX}
                y={groundLevelY}
                width={svgWidth - baseOuterRightX - 20}
                height={Math.max(0, waterLevelY - groundLevelY)}
                fill="url(#soilHatchPattern)"
                className="transition-all duration-300"
              />

              {/* Submerged backfill stratum (if water table exists) */}
              {hasWater && waterLevelY < baseBottomY + 30 && (
                <g>
                  <rect
                    x={baseOuterRightX}
                    y={waterLevelY}
                    width={svgWidth - baseOuterRightX - 20}
                    height={baseBottomY - waterLevelY + 40}
                    fill="url(#waterSoilPattern)"
                    fillOpacity="0.75"
                  />
                  <rect
                    x={baseOuterRightX}
                    y={waterLevelY}
                    width={svgWidth - baseOuterRightX - 20}
                    height={baseBottomY - waterLevelY + 40}
                    fill="#0284c7"
                    fillOpacity="0.12"
                  />
                  {/* Water Table Line & Level Indicator */}
                  <line
                    x1={baseOuterRightX}
                    y1={waterLevelY}
                    x2={svgWidth - 25}
                    y2={waterLevelY}
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeDasharray="6 3"
                  />
                  <polygon
                    points={`${baseOuterRightX + 45},${waterLevelY} ${baseOuterRightX + 38},${waterLevelY + 8} ${baseOuterRightX + 52},${waterLevelY + 8}`}
                    fill="#38bdf8"
                  />
                  <line x1={baseOuterRightX + 35} y1={waterLevelY + 10} x2={baseOuterRightX + 55} y2={waterLevelY + 10} stroke="#38bdf8" strokeWidth="1.2" />
                  <text
                    x={baseOuterRightX + 60}
                    y={isWaterAtGround ? waterLevelY + 14 : waterLevelY - 4}
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    GWT -{(project.waterTableDepthPermanent / 1000).toFixed(2)}m
                  </text>
                </g>
              )}

              {/* Ground Level Surface Line */}
              <line
                x1={baseOuterRightX}
                y1={groundLevelY}
                x2={svgWidth - 25}
                y2={groundLevelY}
                stroke="#d97706"
                strokeWidth="2.5"
              />
              <text
                x={baseOuterRightX + 15}
                y={groundLevelY - 8}
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ▼ +0.00m Retained Ground
              </text>

              {/* Boundary property line indicator (dashed line down outer face) */}
              <line
                x1={baseOuterRightX}
                y1={24}
                x2={baseOuterRightX}
                y2={baseBottomY + 30}
                stroke="#f43f5e"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text
                x={baseOuterRightX + 6}
                y={20}
                fill="#f87171"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Site Boundary / Outside Edge
              </text>

              {/* Surcharge Load Banner */}
              {project.serviceSurchargeKpa > 0 && (
                <g>
                  <text
                    x={baseOuterRightX + 45}
                    y={groundLevelY - 46}
                    fill="#fbbf24"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Surcharge q_k = {project.serviceSurchargeKpa} kPa
                  </text>
                  <line
                    x1={baseOuterRightX + 35}
                    y1={groundLevelY - 38}
                    x2={baseOuterRightX + 225}
                    y2={groundLevelY - 38}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />
                  {Array.from({ length: 5 }).map((_, i) => {
                    const arrowX = baseOuterRightX + 45 + i * 42;
                    return (
                      <line
                        key={i}
                        x1={arrowX}
                        y1={groundLevelY - 38}
                        x2={arrowX}
                        y2={groundLevelY - 18}
                        stroke="#fbbf24"
                        strokeWidth="1.4"
                        markerEnd="url(#dimArrowAmber)"
                      />
                    );
                  })}
                </g>
              )}
            </g>
          )}

          {/* 2. BASEMENT EXCAVATION ZONE (Only in Section Mode) */}
          {isSectionMode && (
            <g>
              <line
                x1={baseInnerLeftX - 30}
                y1={baseTopY}
                x2={wallStemLeftX}
                y2={baseTopY}
                stroke="#64748b"
                strokeWidth="2"
              />
              <line
                x1={baseInnerLeftX}
                y1={baseTopY}
                x2={baseInnerLeftX}
                y2={baseBottomY}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text
                x={wallStemLeftX - 14}
                y={baseTopY - 10}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
              >
                ▼ -{(project.stemHeight / 1000).toFixed(2)}m Formation Level
              </text>
              <text
                x={wallStemLeftX - 14}
                y={baseTopY - 24}
                textAnchor="end"
                fill="#38bdf8"
                fontSize="9"
                fontFamily="monospace"
              >
                ← Basement Interior (Raft continues)
              </text>
            </g>
          )}

          {/* 3. GROUND FOUNDATION BED (Below base slab) */}
          {(isSectionMode || isDeflectionMode) && (
            <rect
              x={baseInnerLeftX - 15}
              y={baseBottomY}
              width={baseOuterRightX - (baseInnerLeftX - 15)}
              height={30}
              fill="url(#groundBedHatch)"
              stroke="#334155"
              strokeWidth="1"
            />
          )}

          {/* 4. BASE SLAB / RAFT FOUNDATION */}
          <g
            onMouseEnter={() => setHoveredElement("base")}
            onMouseLeave={() => setHoveredElement(null)}
            className="cursor-pointer transition-all"
          >
            <rect
              x={baseInnerLeftX}
              y={baseTopY}
              width={baseOuterRightX - baseInnerLeftX}
              height={baseSlabThicknessPx}
              fill="rgba(6, 182, 212, 0.16)"
              stroke={hoveredElement === "base" ? "#38bdf8" : "#0284c7"}
              strokeWidth={hoveredElement === "base" ? "2.5" : "2"}
            />
            <rect
              x={baseInnerLeftX}
              y={baseTopY}
              width={baseOuterRightX - baseInnerLeftX}
              height={baseSlabThicknessPx}
              fill="url(#concreteHatch)"
            />
            {isSectionMode && (
              <text
                x={(baseInnerLeftX + wallStemLeftX) / 2}
                y={baseTopY + baseSlabThicknessPx / 2 + 4}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {project.baseSupportType === "raft" ? "Raft Slab" : "Base Footing"} ({project.baseThickness}mm)
              </text>
            )}
          </g>

          {/* 5A. UNDEFORMED WALL STEM (Clean concrete body) */}
          <g>
            <rect
              x={wallStemLeftX}
              y={wallTopY}
              width={visualThicknessPx}
              height={baseTopY - wallTopY}
              fill={isDeflectionMode ? "none" : "rgba(6, 182, 212, 0.18)"}
              stroke={isDeflectionMode ? "#475569" : "#0ea5e9"}
              strokeWidth="2"
              strokeDasharray={isDeflectionMode ? "4 2" : "none"}
            />
            {!isDeflectionMode && (
              <rect
                x={wallStemLeftX}
                y={wallTopY}
                width={visualThicknessPx}
                height={baseTopY - wallTopY}
                fill="url(#concreteHatch)"
              />
            )}
          </g>

          {/* 5B. BENT WALL SHAPE ON ELEVATION (Only in Deflection view) */}
          {isDeflectionMode && (
            <g className="transition-all duration-300">
              <path
                d={`${bentWallLeftPath} ${bentWallRightPath} Z`}
                fill="url(#deformedWallGradient)"
                stroke="#10b981"
                strokeWidth="2.6"
                className="drop-shadow-lg"
              />
              <path
                d={deflectionPts.map((p, idx) => {
                  const shiftX = -p.delta * (deflectionScale / 100) * 1.5;
                  const x = (wallStemLeftX + wallStemRightX) / 2 + shiftX;
                  return `${idx === 0 ? "M" : "L"} ${x} ${p.y}`;
                }).join(" ")}
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {(() => {
                const peakY = wallTopY + (project.stemHeight * peakDepthRatio) * scaleY;
                const peakShiftX = -maxDeflectionMm * (deflectionScale / 100) * 1.5;
                const peakBentX = wallStemLeftX + peakShiftX;

                return (
                  <g>
                    <line
                      x1={wallStemLeftX}
                      y1={peakY}
                      x2={peakBentX}
                      y2={peakY}
                      stroke="#10b981"
                      strokeWidth="2"
                      markerEnd="url(#deltaArrow)"
                    />
                    <circle cx={peakBentX} cy={peakY} r={4} fill="#10b981" />
                  </g>
                );
              })()}
            </g>
          )}

          {/* 6. TOP SLAB (GROUND FLOOR DIAPHRAGM) */}
          <g
            onMouseEnter={() => setHoveredElement("topSlab")}
            onMouseLeave={() => setHoveredElement(null)}
            className="cursor-pointer transition-all"
          >
            <rect
              x={topSlabInnerLeftX}
              y={wallTopY - topSlabThicknessPx}
              width={topSlabOuterRightX - topSlabInnerLeftX}
              height={topSlabThicknessPx}
              fill={hoveredElement === "topSlab" ? "rgba(56, 189, 248, 0.28)" : "rgba(56, 189, 248, 0.16)"}
              stroke={hoveredElement === "topSlab" ? "#38bdf8" : "#0284c7"}
              strokeWidth="2"
            />
            <rect
              x={topSlabInnerLeftX}
              y={wallTopY - topSlabThicknessPx}
              width={topSlabOuterRightX - topSlabInnerLeftX}
              height={topSlabThicknessPx}
              fill="url(#concreteHatch)"
            />
            <line
              x1={topSlabInnerLeftX}
              y1={wallTopY - topSlabThicknessPx}
              x2={topSlabInnerLeftX}
              y2={wallTopY}
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            {isSectionMode && (
              <text
                x={(topSlabInnerLeftX + wallStemLeftX) / 2}
                y={wallTopY - topSlabThicknessPx / 2 + 3}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Top Slab ({topSlabThicknessMm}mm)
              </text>
            )}

            {/* Pinned Prop Pin Symbol (Shown in Section & Deflection modes) */}
            {(isSectionMode || isDeflectionMode) && (
              <circle
                cx={(wallStemLeftX + wallStemRightX) / 2}
                cy={wallTopY - topSlabThicknessPx / 2}
                r={4.5}
                fill="#061224"
                stroke="#fbbf24"
                strokeWidth="2"
              />
            )}

            {/* Prop Reaction Arrow & Force (ONLY in Section Mode) */}
            {showLoadsAndProps && (
              <g>
                <line
                  x1={wallStemLeftX - 42}
                  y1={wallTopY - topSlabThicknessPx - 8}
                  x2={wallStemLeftX - 4}
                  y2={wallTopY - topSlabThicknessPx - 8}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  markerEnd="url(#propArrow)"
                />
                <text
                  x={wallStemLeftX - 8}
                  y={wallTopY - topSlabThicknessPx - 14}
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Prop R = {result.permanent.propReaction.toFixed(1)} kN/m
                </text>
              </g>
            )}
          </g>

          {/* ========================================================
              7. REBAR LAYOUT & ANNOTATIONS (ONLY in Rebar Mode!)
              ======================================================== */}
          {showRebar && (
            <g className="font-mono">
              {/* Inner Face Tension Rebar (Red with hook into base raft) */}
              <line
                x1={wallStemRightX - innerCoverPx}
                y1={wallTopY - 8}
                x2={wallStemRightX - innerCoverPx}
                y2={baseBottomY - 14}
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${wallStemRightX - innerCoverPx} ${baseBottomY - 14} L ${wallStemLeftX - 45} ${baseBottomY - 14}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Outer Face Front Rebar (Green) */}
              <line
                x1={wallStemLeftX + outerCoverPx}
                y1={wallTopY - 8}
                x2={wallStemLeftX + outerCoverPx}
                y2={baseTopY + 10}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Top Dowels into Top Slab (Purple) */}
              <path
                d={`M ${topSlabInnerLeftX + 25} ${wallTopY - topSlabThicknessPx + 7} L ${wallStemLeftX + outerCoverPx} ${wallTopY - topSlabThicknessPx + 7} L ${wallStemLeftX + outerCoverPx} ${wallTopY + 55}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.4"
                strokeDasharray="4 2"
              />
              <path
                d={`M ${topSlabInnerLeftX + 35} ${wallTopY - 7} L ${wallStemRightX - innerCoverPx} ${wallTopY - 7} L ${wallStemRightX - innerCoverPx} ${wallTopY + 70}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.4"
                strokeDasharray="4 2"
              />

              {/* Bottom Dowels into Base Raft (Purple) */}
              <path
                d={`M ${baseInnerLeftX + 30} ${baseBottomY - 18} L ${wallStemLeftX + 8} ${baseBottomY - 18} L ${wallStemLeftX + 8} ${baseTopY - 60}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.2"
                strokeDasharray="4 2"
              />
              <path
                d={`M ${wallStemLeftX - 35} ${baseBottomY - 10} L ${wallStemRightX - 8} ${baseBottomY - 10} L ${wallStemRightX - 8} ${baseTopY - 70}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.2"
                strokeDasharray="4 2"
              />

              {/* Distribution Rebar dots */}
              {Array.from({ length: 9 }).map((_, idx) => {
                const dotY = wallTopY + 25 + (idx * (baseTopY - wallTopY - 40)) / 8;
                return (
                  <g key={idx}>
                    <circle cx={wallStemRightX - innerCoverPx - 5} cy={dotY} r="2.4" fill="#fca5a5" />
                    <circle cx={wallStemLeftX + outerCoverPx + 5} cy={dotY} r="2.4" fill="#86efac" />
                  </g>
                );
              })}

              {/* Rebar Leader Callouts on Drawing (Clean coordinates with NO overlaps) */}
              <g>
                {/* Outer Face Callout Leader (Left Side) */}
                <line
                  x1={wallStemLeftX + outerCoverPx}
                  y1={wallTopY + 180}
                  x2={168}
                  y2={wallTopY + 180}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  markerStart="url(#rebarLeaderArrowGreen)"
                />
                <rect
                  x={14}
                  y={wallTopY + 160}
                  width={152}
                  height={44}
                  rx="6"
                  fill="#041f15"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  className="shadow-lg"
                />
                <text x={22} y={wallTopY + 176} fill="#86efac" fontSize="9.5" fontWeight="bold">
                  Outer Face (Sagging):
                </text>
                <text x={22} y={wallTopY + 189} fill="#ffffff" fontSize="8.5">
                  T{project.outerFaceBarDiameter} @ {project.outerFaceBarSpacing}mm
                </text>
                <text x={22} y={wallTopY + 199} fill="#34d399" fontSize="8">
                  As = {result.outerAsProvided} mm²/m
                </text>

                {/* Inner Face Callout Leader (Between wall and schedule card) */}
                <line
                  x1={wallStemRightX - innerCoverPx}
                  y1={wallTopY + 120}
                  x2={250}
                  y2={wallTopY + 120}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  markerStart="url(#rebarLeaderArrow)"
                />
                <rect
                  x={252}
                  y={wallTopY + 100}
                  width={150}
                  height={44}
                  rx="6"
                  fill="#1c070c"
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  className="shadow-lg"
                />
                <text x={260} y={wallTopY + 116} fill="#fca5a5" fontSize="9.5" fontWeight="bold">
                  Inner Face (Hogging):
                </text>
                <text x={260} y={wallTopY + 129} fill="#ffffff" fontSize="8.5">
                  T{project.innerFaceBarDiameter} @ {project.innerFaceBarSpacing}mm
                </text>
                <text x={260} y={wallTopY + 139} fill="#f87171" fontSize="8">
                  As = {result.innerAsProvided} mm²/m
                </text>
              </g>

              {/* Dedicated Rebar Schedule & Detailing Card on Right Side */}
              <g className="font-mono">
                <rect x={420} y={20} width={480} height={baseBottomY + 15} rx="10" fill="#020813" stroke="#a855f7" strokeWidth="1.4" className="shadow-2xl" />

                {/* Card Header */}
                <rect x={432} y={28} width={456} height={26} rx="5" fill="#170828" stroke="#c084fc" strokeWidth="1.2" />
                <text x={660} y={45} textAnchor="middle" fill="#d8b4fe" fontSize="11" fontWeight="bold">
                  Reinforcement Schedule & Detailing Summary
                </text>

                {/* 1. Inner Face Schedule Row */}
                <g transform="translate(435, 68)">
                  <rect x={0} y={0} width={450} height={52} rx="6" fill="#14060c" stroke="#ef4444" strokeWidth="1" />
                  <circle cx={14} cy={16} r={4} fill="#ef4444" />
                  <text x={26} y={19} fill="#fca5a5" fontSize="10" fontWeight="bold">
                    Inner / Retained Face Main Bars (Base Hogging M_Ed)
                  </text>
                  <text x={26} y={35} fill="#ffffff" fontSize="9.5">
                    Provided: <tspan fill="#fca5a5" fontWeight="bold">T{project.innerFaceBarDiameter} @ {project.innerFaceBarSpacing}mm</tspan> ({result.innerAsProvided} mm²/m)
                  </text>
                  <text x={26} y={46} fill="#94a3b8" fontSize="8.5">
                    Demand: req {result.innerAsRequired} mm²/m · UR = {(result.innerAsRequired / Math.max(1, result.innerAsProvided)).toFixed(2)} ({result.innerAsProvided >= result.innerAsRequired ? "PASS" : "FAIL"})
                  </text>
                </g>

                {/* 2. Outer Face Schedule Row */}
                <g transform="translate(435, 130)">
                  <rect x={0} y={0} width={450} height={52} rx="6" fill="#04160f" stroke="#10b981" strokeWidth="1" />
                  <circle cx={14} cy={16} r={4} fill="#10b981" />
                  <text x={26} y={19} fill="#86efac" fontSize="10" fontWeight="bold">
                    Outer / Exposed Face Main Bars (Span Sagging M_Ed)
                  </text>
                  <text x={26} y={35} fill="#ffffff" fontSize="9.5">
                    Provided: <tspan fill="#86efac" fontWeight="bold">T{project.outerFaceBarDiameter} @ {project.outerFaceBarSpacing}mm</tspan> ({result.outerAsProvided} mm²/m)
                  </text>
                  <text x={26} y={46} fill="#94a3b8" fontSize="8.5">
                    Demand: req {result.outerAsRequired} mm²/m · UR = {(result.outerAsRequired / Math.max(1, result.outerAsProvided)).toFixed(2)} ({result.outerAsProvided >= result.outerAsRequired ? "PASS" : "FAIL"})
                  </text>
                </g>

                {/* 3. Top Slab & Base Starter Dowels */}
                <g transform="translate(435, 192)">
                  <rect x={0} y={0} width={450} height={60} rx="6" fill="#130822" stroke="#a855f7" strokeWidth="1" />
                  <circle cx={14} cy={16} r={4} fill="#c084fc" />
                  <text x={26} y={19} fill="#d8b4fe" fontSize="10" fontWeight="bold">
                    Connection Dowels & Starter Bars
                  </text>
                  <text x={26} y={35} fill="#ffffff" fontSize="9">
                    • Top Slab Dowels: <tspan fill="#d8b4fe" fontWeight="bold">T{project.topDowelBarDiameter || 16} @ {project.topDowelBarSpacing || 150}mm</tspan>
                  </text>
                  <text x={26} y={49} fill="#ffffff" fontSize="9">
                    • Base Raft Dowels: <tspan fill="#d8b4fe" fontWeight="bold">T{project.baseDowelBarDiameter} @ {project.baseDowelBarSpacing}mm</tspan> (Anchorage l_bd req {result.baseDowelAnchorageRequired}mm)
                  </text>
                </g>

                {/* 4. Durability & Concrete Nominal Covers */}
                <g transform="translate(435, 262)">
                  <rect x={0} y={0} width={450} height={52} rx="6" fill="#051020" stroke="#0284c7" strokeWidth="1" />
                  <circle cx={14} cy={16} r={4} fill="#38bdf8" />
                  <text x={26} y={19} fill="#7dd3fc" fontSize="10" fontWeight="bold">
                    Durability, Nominal Cover & Crack Limits
                  </text>
                  <text x={26} y={34} fill="#94a3b8" fontSize="9">
                    Inner Cover: <tspan fill="#ffffff" fontWeight="bold">{project.cNomBuried}mm</tspan> ({project.exposureClassBuried}) · Outer Cover: <tspan fill="#ffffff" fontWeight="bold">{project.cNomWater}mm</tspan> ({project.exposureClassWater})
                  </text>
                  <text x={26} y={45} fill="#94a3b8" fontSize="8.5">
                    Crack Control: w_k = {result.crackWidthInner.toFixed(2)}mm ≤ {project.wMax}mm (EN 1992-1-1 §7.3)
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ========================================================
              8. DIMENSIONS & CALLOUTS (ONLY in Section Mode!)
              ======================================================== */}
          {showDimensions && (
            <g className="font-mono text-[10px]">
              {/* Stem Height H Dimension line */}
              <g>
                <line x1={margin.left - 48} y1={wallTopY} x2={wallStemLeftX - 8} y2={wallTopY} stroke="#475569" strokeWidth="0.8" />
                <line x1={margin.left - 48} y1={baseTopY} x2={baseInnerLeftX - 8} y2={baseTopY} stroke="#475569" strokeWidth="0.8" />
                <line
                  x1={margin.left - 42}
                  y1={wallTopY}
                  x2={margin.left - 42}
                  y2={baseTopY}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  markerStart="url(#dimArrow)"
                  markerEnd="url(#dimArrow)"
                />
                <text
                  x={margin.left - 50}
                  y={(wallTopY + baseTopY) / 2}
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  H = {project.stemHeight} mm
                </text>
                <text
                  x={margin.left - 50}
                  y={(wallTopY + baseTopY) / 2 + 13}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                >
                  ({(project.stemHeight / 1000).toFixed(2)} m)
                </text>
              </g>

              {/* Wall Thickness t Dimension line */}
              <g>
                <line x1={wallStemLeftX} y1={wallTopY - topSlabThicknessPx - 26} x2={wallStemLeftX} y2={wallTopY - topSlabThicknessPx - 2} stroke="#475569" strokeWidth="0.8" />
                <line x1={wallStemRightX} y1={wallTopY - topSlabThicknessPx - 26} x2={wallStemRightX} y2={wallTopY - topSlabThicknessPx - 2} stroke="#475569" strokeWidth="0.8" />
                <line
                  x1={wallStemLeftX}
                  y1={wallTopY - topSlabThicknessPx - 20}
                  x2={wallStemRightX}
                  y2={wallTopY - topSlabThicknessPx - 20}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  markerStart="url(#dimArrow)"
                  markerEnd="url(#dimArrow)"
                />
                <text
                  x={(wallStemLeftX + wallStemRightX) / 2}
                  y={wallTopY - topSlabThicknessPx - 28}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="bold"
                >
                  t = {project.wallThickness}mm
                </text>
              </g>

              {/* Base Slab Thickness */}
              <g>
                <line x1={baseInnerLeftX - 15} y1={baseTopY} x2={baseInnerLeftX} y2={baseTopY} stroke="#475569" strokeWidth="0.8" />
                <line x1={baseInnerLeftX - 15} y1={baseBottomY} x2={baseInnerLeftX} y2={baseBottomY} stroke="#475569" strokeWidth="0.8" />
                <line
                  x1={baseInnerLeftX - 10}
                  y1={baseTopY}
                  x2={baseInnerLeftX - 10}
                  y2={baseBottomY}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  markerStart="url(#dimArrow)"
                  markerEnd="url(#dimArrow)"
                />
                <text
                  x={baseInnerLeftX - 14}
                  y={(baseTopY + baseBottomY) / 2 + 3}
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {project.baseThickness}mm
                </text>
              </g>
            </g>
          )}

          {/* ========================================================
              ENGINEERING GRAPH OVERLAYS: MOMENT, SHEAR & DEFLECTION
              ======================================================== */}

          {/* 9A. MOMENT DIAGRAM VIEW */}
          {(viewMode === "moment" || viewMode === "combined") && (
            <g>
              {(() => {
                const isDedicated = viewMode === "moment";
                const cardLeftX = isDedicated ? 390 : 330;
                const graphWidth = isDedicated ? 515 : 185;
                const graphX = isDedicated ? cardLeftX + graphWidth / 2 : 415;
                const mMax = Math.max(1, result.baseMEdGov, result.spanMEdGov);
                const scaleM = (graphWidth * (isDedicated ? 0.30 : 0.22)) / mMax;

                const pathD = momentPts.map((p, idx) => {
                  const x = graphX + p.m * scaleM;
                  return `${idx === 0 ? "M" : "L"} ${x} ${p.y}`;
                }).join(" ");

                return (
                  <g className="font-mono">
                    <rect x={cardLeftX} y={20} width={graphWidth} height={baseBottomY + 15} rx="10" fill="#020813" stroke="#0284c7" strokeWidth="1.4" className="shadow-2xl" />
                    
                    <rect x={cardLeftX + 10} y={28} width={graphWidth - 20} height={26} rx="5" fill="#041224" stroke="#06b6d4" strokeWidth="1.2" />
                    <text x={cardLeftX + graphWidth / 2} y={45} textAnchor="middle" fill="#22d3ee" fontSize={isDedicated ? "11" : "9.5"} fontWeight="bold">
                      {isDedicated ? "Bending Moment M_Ed (kNm/m) Envelope" : "Moment M_Ed"}
                    </text>
                    
                    <line x1={graphX} y1={wallTopY} x2={graphX} y2={baseTopY} stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <path
                      d={`${pathD} L ${graphX} ${baseTopY} L ${graphX} ${wallTopY} Z`}
                      fill="rgba(6, 182, 212, 0.18)"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />

                    {/* Base Hogging Moment Point */}
                    <circle cx={graphX + result.baseMEdGov * scaleM} cy={baseTopY} r={4} fill="#06b6d4" />
                    <text x={graphX + result.baseMEdGov * scaleM + 5} y={baseTopY + 3} fill="#22d3ee" fontSize={isDedicated ? "10" : "8.5"} fontWeight="bold">
                      +{result.baseMEdGov.toFixed(1)}
                    </text>

                    {/* Span Sagging Moment Point */}
                    <circle cx={graphX - result.spanMEdGov * scaleM} cy={wallTopY + (result.permanent.spanDepthFromTop / 1000) * 1000 * scaleY} r={4} fill="#10b981" />
                    <text
                      x={graphX - result.spanMEdGov * scaleM - 5}
                      y={wallTopY + (result.permanent.spanDepthFromTop / 1000) * 1000 * scaleY + 3}
                      textAnchor="end"
                      fill="#4ade80"
                      fontSize={isDedicated ? "10" : "8.5"}
                      fontWeight="bold"
                    >
                      -{result.spanMEdGov.toFixed(1)}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 9B. SHEAR DIAGRAM VIEW */}
          {(viewMode === "shear" || viewMode === "combined") && (
            <g>
              {(() => {
                const isDedicated = viewMode === "shear";
                const cardLeftX = isDedicated ? 390 : 525;
                const graphWidth = isDedicated ? 515 : 185;
                const graphX = isDedicated ? cardLeftX + graphWidth / 2 : 610;
                const vMax = Math.max(1, result.baseVEdGov, result.permanent.propReaction);
                const scaleV = (graphWidth * (isDedicated ? 0.30 : 0.22)) / vMax;

                const pathD = shearPts.map((p, idx) => {
                  const x = graphX + p.v * scaleV;
                  return `${idx === 0 ? "M" : "L"} ${x} ${p.y}`;
                }).join(" ");

                return (
                  <g className="font-mono">
                    <rect x={cardLeftX} y={20} width={graphWidth} height={baseBottomY + 15} rx="10" fill="#020813" stroke="#d97706" strokeWidth="1.4" className="shadow-2xl" />

                    <rect x={cardLeftX + 10} y={28} width={graphWidth - 20} height={26} rx="5" fill="#181206" stroke="#f59e0b" strokeWidth="1.2" />
                    <text x={cardLeftX + graphWidth / 2} y={45} textAnchor="middle" fill="#fbbf24" fontSize={isDedicated ? "11" : "9.5"} fontWeight="bold">
                      {isDedicated ? "Shear Force V_Ed (kN/m) Diagram" : "Shear V_Ed"}
                    </text>
                    
                    <line x1={graphX} y1={wallTopY} x2={graphX} y2={baseTopY} stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <path
                      d={`${pathD} L ${graphX} ${baseTopY} L ${graphX} ${wallTopY} Z`}
                      fill="rgba(245, 158, 11, 0.18)"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />

                    {/* Top Prop Reaction Point */}
                    <circle cx={graphX - result.permanent.propReaction * scaleV} cy={wallTopY} r={4} fill="#f59e0b" />
                    <text x={graphX - result.permanent.propReaction * scaleV - 5} y={wallTopY + 12} textAnchor="end" fill="#fbbf24" fontSize={isDedicated ? "10" : "8.5"} fontWeight="bold">
                      -{result.permanent.propReaction.toFixed(1)}
                    </text>

                    {/* Base Shear Point */}
                    <circle cx={graphX + result.baseVEdGov * scaleV} cy={baseTopY} r={4} fill="#f59e0b" />
                    <text x={graphX + result.baseVEdGov * scaleV + 5} y={baseTopY + 3} fill="#fbbf24" fontSize={isDedicated ? "10" : "8.5"} fontWeight="bold">
                      +{result.baseVEdGov.toFixed(1)}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* ========================================================
              9C. DEDICATED DEFLECTION DIAGRAM (1-LINE BASE + SCALED BOW)
              ======================================================== */}
          {(viewMode === "deflection" || viewMode === "combined") && (
            <g>
              {(() => {
                const isDedicated = viewMode === "deflection";
                const cardLeftX = isDedicated ? 390 : 720;
                const graphWidth = isDedicated ? 515 : 185;
                
                const baselineX = isDedicated ? cardLeftX + graphWidth - 145 : cardLeftX + graphWidth - 38;
                const maxCurveWidthPx = isDedicated ? 160 : 45;

                const pathD = deflectionPts.map((p, idx) => {
                  const curveShift = -p.normalizedShape * maxCurveWidthPx;
                  const x = baselineX + curveShift;
                  return `${idx === 0 ? "M" : "L"} ${x} ${p.y}`;
                }).join(" ");

                const peakY = wallTopY + (project.stemHeight * peakDepthRatio) * scaleY;
                const peakCurveX = baselineX - maxCurveWidthPx;

                return (
                  <g className="font-mono">
                    <rect
                      x={cardLeftX}
                      y={20}
                      width={graphWidth}
                      height={baseBottomY + 15}
                      rx="10"
                      fill="#020813"
                      stroke="#059669"
                      strokeWidth="1.4"
                      className="shadow-2xl"
                    />

                    <rect
                      x={cardLeftX + 10}
                      y={28}
                      width={graphWidth - 20}
                      height={26}
                      rx="5"
                      fill="#041f14"
                      stroke="#10b981"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cardLeftX + graphWidth / 2}
                      y={45}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize={isDedicated ? "11" : "9.5"}
                      fontWeight="bold"
                    >
                      {isDedicated ? "Deflection δ(z) Profile · 1-Line Base Reference" : "Deflection δ"}
                    </text>

                    {isDedicated && (
                      <g>
                        <line x1={baselineX - maxCurveWidthPx - 10} y1={wallTopY - 16} x2={baselineX + 10} y2={wallTopY - 16} stroke="#334155" strokeWidth="1" />
                        {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                          const tickX = baselineX - frac * maxCurveWidthPx;
                          const mmVal = (frac * maxDeflectionMm).toFixed(1);
                          return (
                            <g key={idx}>
                              <line x1={tickX} y1={wallTopY - 20} x2={tickX} y2={wallTopY - 12} stroke="#64748b" strokeWidth="1" />
                              <text x={tickX} y={wallTopY - 24} textAnchor="middle" fill="#94a3b8" fontSize="8">
                                {mmVal}mm
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                    <path
                      d={`${pathD} L ${baselineX} ${baseTopY} L ${baselineX} ${wallTopY} Z`}
                      fill="url(#deformGraphGradient)"
                      stroke="#10b981"
                      strokeWidth="3.2"
                    />

                    <line
                      x1={baselineX}
                      y1={wallTopY}
                      x2={baselineX}
                      y2={baseTopY}
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    <text
                      x={baselineX + 6}
                      y={wallTopY - 4}
                      fill="#38bdf8"
                      fontSize={isDedicated ? "10" : "8"}
                      fontWeight="bold"
                    >
                      {isDedicated ? "1 Line Base (δ=0)" : "δ=0"}
                    </text>

                    <polygon
                      points={`${baselineX},${wallTopY} ${baselineX + 7},${wallTopY - 9} ${baselineX - 7},${wallTopY - 9}`}
                      fill="#082f49"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    <circle cx={baselineX} cy={wallTopY} r={3.5} fill="#fbbf24" />
                    {isDedicated && (
                      <text x={baselineX + 10} y={wallTopY + 12} fill="#38bdf8" fontSize="8.5">
                        Prop (z=0, δ=0)
                      </text>
                    )}

                    <line x1={baselineX - 16} y1={baseTopY} x2={baselineX + 16} y2={baseTopY} stroke="#38bdf8" strokeWidth="2.5" />
                    {[-12, -8, -4, 0, 4, 8, 12].map((dx, i) => (
                      <line key={i} x1={baselineX + dx} y1={baseTopY} x2={baselineX + dx - 4} y2={baseTopY + 6} stroke="#64748b" strokeWidth="1.2" />
                    ))}
                    {isDedicated && (
                      <text x={baselineX + 10} y={baseTopY - 4} fill="#38bdf8" fontSize="8.5">
                        Fixed Base (z=H, δ=0)
                      </text>
                    )}

                    {isDedicated && intermediateStations.map((st, i) => {
                      const stShift = -(st.deltaMm / maxDeflectionMm) * maxCurveWidthPx;
                      const stX = baselineX + stShift;
                      return (
                        <g key={i}>
                          <line
                            x1={baselineX}
                            y1={st.yPx}
                            x2={stX}
                            y2={st.yPx}
                            stroke="#10b981"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            strokeOpacity="0.6"
                          />
                          <circle cx={stX} cy={st.yPx} r={3} fill="#10b981" />
                          <text x={stX - 6} y={st.yPx + 3} textAnchor="end" fill="#6ee7b7" fontSize="8">
                            {st.deltaMm.toFixed(2)} mm
                          </text>
                          <text x={baselineX + 8} y={st.yPx + 3} fill="#94a3b8" fontSize="7.5">
                            z={(st.zM).toFixed(2)}m
                          </text>
                        </g>
                      );
                    })}

                    <g>
                      <line
                        x1={baselineX}
                        y1={peakY}
                        x2={peakCurveX}
                        y2={peakY}
                        stroke="#10b981"
                        strokeWidth="2.2"
                        markerStart="url(#deltaArrowBoth)"
                        markerEnd="url(#deltaArrowBoth)"
                      />
                      <circle cx={peakCurveX} cy={peakY} r={4.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

                      {/* Prominent Peak Displacement Callout Card (RELOCATED BELOW THE LINE) */}
                      {(() => {
                        const midVectorX = (peakCurveX + baselineX) / 2;
                        const badgeWidth = isDedicated ? 152 : 64;
                        const badgeHeight = isDedicated ? 34 : 20;
                        const badgeLeftX = midVectorX - badgeWidth / 2;
                        const badgeTopY = peakY + (isDedicated ? 8 : 6);

                        return (
                          <g>
                            <rect
                              x={badgeLeftX}
                              y={badgeTopY}
                              width={badgeWidth}
                              height={badgeHeight}
                              rx="5"
                              fill="#052e1f"
                              stroke="#10b981"
                              strokeWidth="1.2"
                              className="shadow-lg"
                            />
                            <text
                              x={midVectorX}
                              y={isDedicated ? badgeTopY + 15 : badgeTopY + 14}
                              textAnchor="middle"
                              fill="#34d399"
                              fontSize={isDedicated ? "10.5" : "8"}
                              fontWeight="bold"
                            >
                              δ_max = {maxDeflectionMm.toFixed(2)} mm
                            </text>
                            {isDedicated && (
                              <text
                                x={midVectorX}
                                y={badgeTopY + 27}
                                textAnchor="middle"
                                fill="#a7f3d0"
                                fontSize="7.5"
                              >
                                at depth z = {(project.stemHeight * peakDepthRatio / 1000).toFixed(2)} m (≈0.42H)
                              </text>
                            )}
                          </g>
                        );
                      })()}
                    </g>

                    {isDedicated && (
                      <g>
                        <rect
                          x={cardLeftX + 12}
                          y={baseBottomY - 14}
                          width={graphWidth - 24}
                          height={24}
                          rx="4"
                          fill="#04160f"
                          stroke="#059669"
                          strokeWidth="1"
                        />
                        <text
                          x={cardLeftX + graphWidth / 2}
                          y={baseBottomY + 2}
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Limit: δ ≤ H/500 ({allowableDeflectionMm.toFixed(1)} mm) · {deflectionStatus}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}
            </g>
          )}

          {/* Hover Tooltip Overlay */}
          {hoveredElement && (
            <div className="absolute bottom-3 left-3 bg-[#08172c]/95 backdrop-blur-md border border-cyan-500/50 rounded-xl px-3 py-2 text-xs font-mono shadow-xl text-cyan-200 pointer-events-none transition-all">
              {hoveredElement === "stem" && (
                <div>
                  <span className="font-bold text-white">Wall Stem:</span> {project.wallThickness}mm thick · {project.stemHeight}mm high ({project.concreteGrade})
                </div>
              )}
              {hoveredElement === "topSlab" && (
                <div>
                  <span className="font-bold text-cyan-300">Top Floor Slab:</span> {topSlabThicknessMm}mm thick (Reaction: {result.permanent.propReaction} kN/m)
                </div>
              )}
              {hoveredElement === "base" && (
                <div>
                  <span className="font-bold text-white">Base Foundation:</span> {project.baseThickness}mm {project.baseSupportType} connection
                </div>
              )}
            </div>
          )}
        </svg>
      </div>

      {/* Real-time Engineering Result & Capacity HUD Summary */}
      <div className="p-4 bg-[#061122] border-t border-cyan-900/60 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Base Hogging Utilization */}
        <div className="p-2.5 rounded-xl bg-[#030913] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Base Hogging M_Ed</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              innerUtil <= 1.0 ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
            }`}>
              {innerUtil <= 1.0 ? "PASS" : "FAIL"}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white mt-1">
            {result.baseMEdGov.toFixed(1)} <span className="text-[10px] text-cyan-400">kNm/m</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${innerUtil > 1.0 ? "bg-rose-500" : innerUtil > 0.85 ? "bg-amber-400" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, innerUtil * 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            As: {result.innerAsProvided} / req {result.innerAsRequired} mm²/m
          </p>
        </div>

        {/* Mid-Span Sagging Utilization */}
        <div className="p-2.5 rounded-xl bg-[#030913] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Span Sagging M_Ed</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              outerUtil <= 1.0 ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
            }`}>
              {outerUtil <= 1.0 ? "PASS" : "FAIL"}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white mt-1">
            {result.spanMEdGov.toFixed(1)} <span className="text-[10px] text-cyan-400">kNm/m</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${outerUtil > 1.0 ? "bg-rose-500" : outerUtil > 0.85 ? "bg-amber-400" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, outerUtil * 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            As: {result.outerAsProvided} / req {result.outerAsRequired} mm²/m
          </p>
        </div>

        {/* Base Shear Resistance */}
        <div className="p-2.5 rounded-xl bg-[#030913] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Base Shear V_Ed</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              result.baseVEdGov <= result.innerVRdc ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
            }`}>
              {result.baseVEdGov <= result.innerVRdc ? "PASS" : "FAIL"}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white mt-1">
            {result.baseVEdGov.toFixed(1)} <span className="text-[10px] text-cyan-400">kN/m</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            VRd,c = {result.innerVRdc.toFixed(1)} kN/m
          </p>
        </div>

        {/* Lateral Deflection SLS */}
        <div className="p-2.5 rounded-xl bg-[#030913] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">SLS Deflection δ</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              deflectionStatus === "PASS" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"
            }`}>
              {deflectionStatus}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
            {maxDeflectionMm.toFixed(2)} <span className="text-[10px] text-cyan-400">mm</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            Limit: ≤ {allowableDeflectionMm.toFixed(1)} mm (H/500)
          </p>
        </div>

        {/* SLS Crack & Concrete Takeoff */}
        <div className="p-2.5 rounded-xl bg-[#030913] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">SLS Crack Width</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              result.crackWidthInner <= project.wMax ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"
            }`}>
              w_k ≤ {project.wMax}mm
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white mt-1">
            {result.crackWidthInner.toFixed(2)} <span className="text-[10px] text-cyan-400">mm</span>
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">
            Vol: {concreteVolumePerM} m³/m ({concreteWeightPerM} kN/m)
          </p>
        </div>
      </div>
    </div>
  );
}
