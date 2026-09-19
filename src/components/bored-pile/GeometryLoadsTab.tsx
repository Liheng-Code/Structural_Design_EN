import React, { useState } from "react";
import {
  Ruler,
  Grid,
  Layers,
  ArrowDown,
  Sparkles,
  Compass,
  Sliders,
  Zap,
} from "lucide-react";
import type { BoredPileProject, BoredPileAnalysisResult, SoilLayerInput } from "@/lib/bored-pile/types";

interface GeometryLoadsTabProps {
  project: BoredPileProject;
  setProject: React.Dispatch<React.SetStateAction<BoredPileProject>>;
  results: BoredPileAnalysisResult;
}

function soilLayerColor(layer: SoilLayerInput): { fill: string; stroke: string; accent: string } {
  if (layer.behaviorType === "rock" || (layer.type === "custom" && layer.name.toLowerCase().includes("rock"))) {
    return { fill: "#6d597a", stroke: "#c084fc", accent: "#d8b4e2" };
  }
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") {
    return { fill: "#334155", stroke: "#94a3b8", accent: "#cbd5e1" };
  }
  if (layer.type === "sand" || layer.type === "dense-sand") {
    return { fill: "#78592c", stroke: "#eab308", accent: "#fde047" };
  }
  if (layer.type === "fill") {
    return { fill: "#5c4033", stroke: "#d97706", accent: "#fbbf24" };
  }
  return { fill: "#1e3a5f", stroke: "#38bdf8", accent: "#7dd3fc" };
}

function soilPatternId(layer: SoilLayerInput): string {
  if (layer.behaviorType === "rock" || (layer.type === "custom" && layer.name.toLowerCase().includes("rock"))) {
    return "geo-pattern-rock";
  }
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") {
    return "geo-pattern-clay";
  }
  if (layer.type === "sand" || layer.type === "dense-sand") {
    return "geo-pattern-sand";
  }
  if (layer.type === "fill") {
    return "geo-pattern-fill";
  }
  return "geo-pattern-custom";
}

const COMMON_DIAMETERS = [600, 800, 1000, 1200, 1500, 1800];
const CONCRETE_GRADES = [
  { grade: "C25/30", fck: 25 },
  { grade: "C30/37", fck: 30 },
  { grade: "C35/45", fck: 35 },
  { grade: "C40/50", fck: 40 },
  { grade: "C45/55", fck: 45 },
  { grade: "C50/60", fck: 50 },
];

export function GeometryLoadsTab({ project, setProject, results }: GeometryLoadsTabProps) {
  // Vertical Axis Ruler settings (synced with soil strata tab features)
  const [rulerIntervalMode, setRulerIntervalMode] = useState<"auto" | "1m" | "5m">("auto");
  const [rulerDisplayMode, setRulerDisplayMode] = useState<"dual" | "depth" | "elevation">("dual");
  const [showRulerGridlines, setShowRulerGridlines] = useState(true);
  const [hoverProbeDepth, setHoverProbeDepth] = useState<number | null>(null);
  const [activePlanView, setActivePlanView] = useState<"rebar" | "stress">("rebar");

  // Toe layer lookup
  const toeLayer = project.layers.find(
    (layer) => project.length >= layer.topDepth && project.length <= layer.bottomDepth
  );

  // Geometric calculations
  const radiusMm = project.diameter / 2;
  const areaM2 = results.pileArea;
  const perimeterM = results.pilePerimeter;
  const pileVolumeM3 = areaM2 * project.length;
  const pileConcreteWeightKn = pileVolumeM3 * 24.5; // ~24.5 kN/m3 for reinforced concrete
  const averageBearingStressKpa = project.nEd > 0 && areaM2 > 0 ? project.nEd / areaM2 : 0;
  const siteDatum = project.groundLevel ?? 0.0;
  const toeElevation = siteDatum - project.length;
  const gwlElevation = siteDatum - project.waterLevel;

  // Maximum profile depth for plotting
  const maxDepth = Math.max(
    project.length + 3,
    ...project.layers.map((l) => l.bottomDepth),
    10
  );

  // Geometry cross section coordinates
  const topY = 44;
  const bottomY = 580;
  const canvasHeight = bottomY - topY;
  const scale = canvasHeight / maxDepth;

  const rulerLeft = 14;
  const rulerWidth = 96;
  const rulerSpineX = rulerLeft + rulerWidth; // 110

  const strataLeftX = rulerSpineX + 16; // 126
  const strataRightX = 460;
  const strataWidth = strataRightX - strataLeftX; // 334

  const pileCenterX = (strataLeftX + strataRightX) / 2; // 293
  // Scaled pile width on canvas, proportional to diameter (e.g. 600mm -> 36px, 1500mm -> 76px)
  const pilePixelWidth = Math.max(28, Math.min(84, (project.diameter / 1000) * 44));
  const pileToeY = topY + project.length * scale;
  const waterY = topY + project.waterLevel * scale;

  return (
    <div className="space-y-6">
      {/* TOP HUD KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pile Diameter</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-white">Ø{project.diameter}</span>
            <span className="text-xs text-cyan-400">mm</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Radius = {radiusMm} mm</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Embedment Length</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-cyan-300">{project.length.toFixed(1)}</span>
            <span className="text-xs text-cyan-400">m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Toe El: {toeElevation >= 0 ? "+" : ""}{toeElevation.toFixed(2)} m RL
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cross-Section Area</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-white">{areaM2.toFixed(3)}</span>
            <span className="text-xs text-cyan-400">m²</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Perimeter = {perimeterM.toFixed(2)} m</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Concrete Volume</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-cyan-300">{pileVolumeM3.toFixed(1)}</span>
            <span className="text-xs text-cyan-400">m³</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Self-wt ≈ {pileConcreteWeightKn.toFixed(0)} kN</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Design Axial Load</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-amber-300">{project.nEd}</span>
            <span className="text-xs text-amber-400">kN</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Stress σ ≈ {(averageBearingStressKpa / 1000).toFixed(2)} MPa</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Toe Founding Layer</p>
          <div className="flex items-baseline gap-1 mt-1 truncate">
            <span className="text-sm font-bold text-emerald-300 truncate">
              {toeLayer ? `${toeLayer.id} · ${toeLayer.name}` : "Outside Profile"}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            Util: {(results.utilizationGeotechnical * 100).toFixed(1)}% ({results.utilizationGeotechnical <= 1 ? "PASSED" : "CHECK"})
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT: INPUT PANEL + LIVE TECHNICAL DIAGRAMS */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(380px,0.85fr)_minmax(600px,1.15fr)] gap-6 items-start">
        {/* LEFT COLUMN: PILE DESIGN PARAMETERS & LOAD DEFINITION */}
        <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <div className="border-b border-cyan-900/60 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-cyan-400" />
                Input Specifications
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-[10px] font-mono text-cyan-300">
                EN 1997-1 / EC7 & EC2
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              Pile Geometry & Loading
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Configure pile dimensions, concrete grade, groundwater level, and structural action loads.
            </p>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {/* Section 1: Shaft Geometry */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Ruler className="size-3.5 text-cyan-400" />
                  1. Bored Pile Shaft Geometry
                </p>
                <span className="text-[10px] text-slate-400">Quick presets</span>
              </div>

              {/* Diameter Preset Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {COMMON_DIAMETERS.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => setProject((prev) => ({ ...prev, diameter: dia }))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition font-bold border ${
                      project.diameter === dia
                        ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20"
                        : "bg-[#040910] text-slate-300 border-slate-700 hover:border-cyan-700 hover:text-cyan-200"
                    }`}
                  >
                    Ø{dia}mm
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-slate-400 font-semibold">Shaft Diameter (mm)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="300"
                      max="3000"
                      step="50"
                      value={project.diameter}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, diameter: parseFloat(e.target.value) || 800 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">mm</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-slate-400 font-semibold">Embedment Length (m)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      value={project.length}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, length: parseFloat(e.target.value) || 20 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-cyan-300 font-bold text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">m bgl</span>
                  </div>
                </label>
              </div>

              {/* Length quick adjustment stepper & Wall Equivalent info */}
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] bg-[#040910] p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Toe Elevation vs Ground Datum:</span>
                  <span className="font-bold text-cyan-300">
                    {toeElevation >= 0 ? "+" : ""}{toeElevation.toFixed(2)} m RL
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setProject((prev) => ({ ...prev, length: Math.max(1, prev.length - 1) }))}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      title="Shorten pile by 1m"
                    >
                      -1m
                    </button>
                    <button
                      type="button"
                      onClick={() => setProject((prev) => ({ ...prev, length: prev.length + 1 }))}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      title="Extend pile by 1m"
                    >
                      +1m
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10.5px] bg-[#031525]/70 px-2.5 py-1.5 rounded-lg border border-cyan-900/50 text-cyan-200">
                  <span>CBP Wall Equiv. Thickness: <strong className="text-white font-mono">{((Math.PI * (project.diameter / 1000) ** 2) / (4 * ((project.diameter / 1000) * 1.15))).toFixed(2)}m</strong> (at 1.15Ø c/c)</span>
                  <span className="text-slate-400 font-mono">Embedment: {project.length.toFixed(1)}m</span>
                </div>
              </div>
            </div>

            {/* Section 2: Concrete Material & Reinforcement Cover */}
            <div className="border-t border-slate-800/80 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                <Layers className="size-3.5 text-cyan-400" />
                2. Concrete & Cover Specification
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-slate-400">Concrete Strength Grade</span>
                  <select
                    value={project.concreteGrade}
                    onChange={(e) => {
                      const selected = CONCRETE_GRADES.find((c) => c.grade === e.target.value);
                      setProject((prev) => ({
                        ...prev,
                        concreteGrade: e.target.value,
                        fck: selected ? selected.fck : prev.fck,
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
                  >
                    {CONCRETE_GRADES.map((c) => (
                      <option key={c.grade} value={c.grade}>
                        {c.grade} (f_ck = {c.fck} MPa)
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-slate-400">Nominal Concrete Cover (mm)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="35"
                      max="150"
                      step="5"
                      value={project.cover}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, cover: parseFloat(e.target.value) || 75 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">mm</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 3: Design Actions & Load Combinations */}
            <div className="border-t border-slate-800/80 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                <ArrowDown className="size-3.5 text-amber-400" />
                3. Design Actions (ULS Combination)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-slate-400 font-semibold flex items-center justify-between">
                    <span>Axial Load N<sub>Ed</sub> (kN)</span>
                    <span className="text-[10px] text-amber-400">Compression</span>
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="50"
                      value={project.nEd}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, nEd: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-amber-300 font-bold text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">kN</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-slate-400 font-semibold flex items-center justify-between">
                    <span>Bending Moment M<sub>Ed</sub></span>
                    <span className="text-[10px] text-cyan-400">Head moment</span>
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="10"
                      value={project.mEd}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, mEd: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-cyan-300 font-bold text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">kNm</span>
                  </div>
                </label>
              </div>

              {/* Load eccentricity indicator */}
              <div className="mt-2 text-[11px] flex items-center justify-between bg-[#040910] px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">Load Eccentricity (e = M_Ed / N_Ed):</span>
                <span className="font-bold text-cyan-200">
                  {project.nEd > 0 ? `${((project.mEd / project.nEd) * 1000).toFixed(1)} mm` : "N/A (N_Ed = 0)"}
                </span>
              </div>
            </div>

            {/* Section 4: Site Datum & Water Table Elevation */}
            <div className="border-t border-slate-800/80 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                <Compass className="size-3.5 text-cyan-400" />
                4. Site Elevations & Groundwater Table
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-slate-400">Site Ground Datum (m RL)</span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={project.groundLevel ?? 0}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, groundLevel: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-emerald-300 font-bold focus:border-emerald-400 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">m RL</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-slate-400">Groundwater Depth (m bgl)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={project.waterLevel}
                      onChange={(e) =>
                        setProject((prev) => ({ ...prev, waterLevel: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2.5 text-sky-300 font-bold focus:border-sky-400 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500 text-xs">m bgl</span>
                  </div>
                </label>
              </div>

              <div className="mt-2 text-[11px] flex items-center justify-between bg-[#040910] px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">Absolute GWL Elevation:</span>
                <span className="font-bold text-sky-300">
                  {gwlElevation >= 0 ? "+" : ""}{gwlElevation.toFixed(2)} m RL
                </span>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="rounded-xl border border-cyan-900/60 bg-gradient-to-br from-[#051120] to-[#040a14] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Geotechnical Safety Check:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-xs ${
                    results.utilizationGeotechnical <= 1
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                      : "bg-rose-950 text-rose-300 border border-rose-500/50"
                  }`}
                >
                  {results.utilizationGeotechnical <= 1 ? "ADEQUATE" : "OVERLOADED"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Design Compressive Resistance R_cd:</span>
                <strong className="text-cyan-300 font-mono font-bold">
                  {results.designResistance.toFixed(0)} kN
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Applied Design Load N_Ed:</span>
                <strong className="text-amber-300 font-mono font-bold">{project.nEd} kN</strong>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: LIVE INTERACTIVE DIAGRAMS WITH VERTICAL RULER */}
        <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
          {/* Header with Live Status */}
          <div className="flex flex-wrap items-start justify-between border-b border-cyan-900/60 pb-4 gap-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="size-3 text-cyan-400" />
                Dynamic Engineering Cross-Section
              </p>
              <h2 className="font-display text-xl font-bold text-white mt-1">
                Bored Pile Longitudinal & Plan View
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Calibrated with vertical depth ruler, absolute RL elevations, and soil stratigraphy.
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-mono text-[11px] text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE MODEL
            </span>
          </div>

          {/* Vertical Ruler Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#040e1d] border border-cyan-900/60 font-mono text-xs shadow-inner">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-300 font-bold text-[11px]">
                <Ruler className="size-3.5 text-cyan-400" />
                Vertical Ruler:
              </span>

              {/* Markings Interval Selector */}
              <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setRulerIntervalMode("auto")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerIntervalMode === "auto"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Automatic markings every 1m or 5m according to current depth"
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setRulerIntervalMode("1m")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerIntervalMode === "1m"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Mark every 1 meter"
                >
                  1m
                </button>
                <button
                  type="button"
                  onClick={() => setRulerIntervalMode("5m")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerIntervalMode === "5m"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Mark every 5 meters"
                >
                  5m
                </button>
              </div>

              {/* Units Selector */}
              <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setRulerDisplayMode("dual")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerDisplayMode === "dual"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Display both Depth (m bgl) and Absolute Elevation (m RL)"
                >
                  Depth + Elev
                </button>
                <button
                  type="button"
                  onClick={() => setRulerDisplayMode("depth")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerDisplayMode === "depth"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Display Depth below ground only"
                >
                  Depth
                </button>
                <button
                  type="button"
                  onClick={() => setRulerDisplayMode("elevation")}
                  className={`px-2 py-0.5 rounded transition ${
                    rulerDisplayMode === "elevation"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Display Absolute Elevation (m RL) only"
                >
                  Elev RL
                </button>
              </div>

              {/* Gridlines Toggle */}
              <button
                type="button"
                onClick={() => setShowRulerGridlines((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                  showRulerGridlines
                    ? "bg-slate-900 border-cyan-800/80 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Toggle horizontal alignment gridlines"
              >
                <Grid className="size-3 text-cyan-400" />
                <span>Grid: {showRulerGridlines ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* Probe Readout */}
            {hoverProbeDepth !== null && (
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/70 text-cyan-200 text-[11px] font-bold shadow-sm">
                Probe: -{hoverProbeDepth.toFixed(2)}m (El {(siteDatum - hoverProbeDepth).toFixed(2)}m)
              </span>
            )}
          </div>

          {/* TWO DIAGRAM CARDS: LONGITUDINAL SECTION + CIRCULAR PLAN VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5">
            {/* SECTION A-A: LONGITUDINAL PROFILE WITH VERTICAL RULER */}
            <div className="rounded-xl border border-slate-700/80 bg-[#040910] p-4 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs font-bold text-slate-200">SECTION A-A · ELEVATION</h3>
                  <span className="font-mono text-[10px] text-cyan-400">Ø{project.diameter}mm × L={project.length.toFixed(1)}m</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  Toe: {toeElevation >= 0 ? "+" : ""}{toeElevation.toFixed(2)} m RL
                </span>
              </div>

              <div className="relative overflow-visible">
                <svg
                  viewBox="0 0 490 620"
                  className="w-full h-[560px] overflow-visible select-none"
                  role="img"
                  aria-label="Bored pile longitudinal section through soil strata"
                  onMouseMove={(e) => {
                    const svg = e.currentTarget;
                    const pt = svg.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const ctm = svg.getScreenCTM();
                    if (ctm) {
                      const svgPoint = pt.matrixTransform(ctm.inverse());
                      if (svgPoint.y >= topY && svgPoint.y <= bottomY) {
                        const depth = (svgPoint.y - topY) / scale;
                        setHoverProbeDepth(Math.max(0, Math.min(maxDepth, depth)));
                      } else {
                        setHoverProbeDepth(null);
                      }
                    }
                  }}
                  onMouseLeave={() => setHoverProbeDepth(null)}
                >
                  <defs>
                    {/* Soil patterns */}
                    <pattern id="geo-pattern-fill" width="18" height="18" patternUnits="userSpaceOnUse">
                      <path d="M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2" stroke="#d97706" strokeWidth="1.3" opacity="0.65" />
                    </pattern>
                    <pattern id="geo-pattern-clay" width="22" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 5c4-2.5 7 2.5 11 0s7 2.5 11 0M0 15c4-2.5 7 2.5 11 0s7 2.5 11 0" fill="none" stroke="#94a3b8" strokeWidth="1.1" opacity="0.6" />
                    </pattern>
                    <pattern id="geo-pattern-sand" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="3" cy="4" r="1.3" fill="#eab308" opacity="0.8" />
                      <circle cx="11" cy="8" r="1.1" fill="#facc15" opacity="0.8" />
                      <circle cx="6" cy="14" r="1.2" fill="#eab308" opacity="0.8" />
                      <circle cx="14" cy="13" r="1.0" fill="#fef08a" opacity="0.8" />
                    </pattern>
                    <pattern id="geo-pattern-rock" width="26" height="26" patternUnits="userSpaceOnUse">
                      <path d="M1 18L9 4l8 6 8-7M3 24l7-9 7 4 8-8" fill="none" stroke="#c084fc" strokeWidth="1.3" opacity="0.75" />
                    </pattern>
                    <pattern id="geo-pattern-custom" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 10h20M10 0v20" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
                    </pattern>
                    {/* Concrete rebar hatch */}
                    <pattern id="geo-pile-rebar" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M0 8L8 0M0 0L8 8" stroke="#06b6d4" strokeWidth="0.7" opacity="0.35" />
                    </pattern>
                    {/* Neon glow filter */}
                    <filter id="geo-glow" x="-20%" y="-30%" width="140%" height="160%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f0ff" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* 1. SOIL STRATA BACKGROUND BLOCKS */}
                  {project.layers.map((layer) => {
                    const y = topY + Math.max(0, layer.topDepth) * scale;
                    const height = Math.max(
                      3,
                      (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) * scale
                    );
                    const colors = soilLayerColor(layer);
                    const patternId = soilPatternId(layer);
                    const isToeInThisLayer =
                      project.length >= layer.topDepth && project.length <= layer.bottomDepth;

                    return (
                      <g key={layer.id}>
                        <rect
                          x={strataLeftX}
                          y={y}
                          width={strataWidth}
                          height={height}
                          fill={colors.fill}
                          fillOpacity="0.4"
                          stroke={colors.stroke}
                          strokeWidth="0.8"
                        />
                        <rect
                          x={strataLeftX}
                          y={y}
                          width={strataWidth}
                          height={height}
                          fill={`url(#${patternId})`}
                        />

                        {/* Layer Label on Right Side */}
                        <text
                          x={strataRightX - 6}
                          y={y + Math.min(height - 4, 15)}
                          textAnchor="end"
                          fill={colors.accent}
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {layer.id} · {layer.name.slice(0, 16)}
                        </text>

                        {isToeInThisLayer && (
                          <text
                            x={strataRightX - 6}
                            y={y + Math.min(height - 4, 27)}
                            textAnchor="end"
                            fill="#fbbf24"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            ★ TOE STRATUM
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* 2. VERTICAL AXIS RULER SYSTEM */}
                  {(() => {
                    let majorInterval = 5;
                    let minorInterval = 1;

                    if (rulerIntervalMode === "1m") {
                      majorInterval = 1;
                      minorInterval = 0.5;
                    } else if (rulerIntervalMode === "5m") {
                      majorInterval = 5;
                      minorInterval = 1;
                    } else {
                      if (maxDepth <= 12) {
                        majorInterval = 1;
                        minorInterval = 0.5;
                      } else if (maxDepth <= 24) {
                        majorInterval = 2;
                        minorInterval = 1;
                      } else if (maxDepth <= 50) {
                        majorInterval = 5;
                        minorInterval = 1;
                      } else {
                        majorInterval = 10;
                        minorInterval = 2;
                      }
                    }

                    const majorTickCount = Math.floor(maxDepth / majorInterval);
                    const majorTicks = Array.from({ length: majorTickCount + 1 }, (_, i) => i * majorInterval);

                    const minorTickCount = Math.floor(maxDepth / minorInterval);
                    const minorTicks = Array.from({ length: minorTickCount + 1 }, (_, i) => i * minorInterval).filter(
                      (d) => !majorTicks.some((m) => Math.abs(m - d) < 0.001)
                    );

                    return (
                      <g id="geo-ruler-group">
                        {/* Horizontal Gridlines */}
                        {showRulerGridlines && (
                          <g opacity="0.6">
                            {majorTicks.map((d) => {
                              const y = topY + d * scale;
                              if (y > bottomY) return null;
                              return (
                                <line
                                  key={`ruler-grid-${d}`}
                                  x1={rulerSpineX}
                                  y1={y}
                                  x2={strataRightX}
                                  y2={y}
                                  stroke="#223348"
                                  strokeWidth="0.8"
                                  strokeDasharray="4 3"
                                />
                              );
                            })}
                          </g>
                        )}

                        {/* Ruler Housing */}
                        <rect
                          x={rulerLeft}
                          y={topY}
                          width={rulerWidth}
                          height={bottomY - topY}
                          rx="4"
                          fill="#030a14"
                          stroke="#1e293b"
                          strokeWidth="1.2"
                        />

                        {/* Ruler Header */}
                        <rect
                          x={rulerLeft}
                          y={topY - 20}
                          width={rulerWidth}
                          height="18"
                          rx="3"
                          fill="#06182c"
                          stroke="#0284c7"
                          strokeWidth="0.8"
                        />
                        <text
                          x={rulerLeft + rulerWidth / 2}
                          y={topY - 8}
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ▼ RULER · {majorInterval}m
                        </text>

                        {/* Ruler Spine */}
                        <line
                          x1={rulerSpineX}
                          y1={topY}
                          x2={rulerSpineX}
                          y2={bottomY}
                          stroke="#475569"
                          strokeWidth="2"
                        />

                        {/* Minor Ticks */}
                        {minorTicks.map((d) => {
                          const y = topY + d * scale;
                          if (y > bottomY) return null;
                          return (
                            <line
                              key={`minor-${d}`}
                              x1={rulerSpineX - 5}
                              y1={y}
                              x2={rulerSpineX}
                              y2={y}
                              stroke="#64748b"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Major Ticks & Markings */}
                        {majorTicks.map((d) => {
                          const y = topY + d * scale;
                          if (y > bottomY) return null;
                          const elevation = siteDatum - d;

                          return (
                            <g key={`major-${d}`}>
                              <line
                                x1={rulerSpineX - 12}
                                y1={y}
                                x2={rulerSpineX}
                                y2={y}
                                stroke="#cbd5e1"
                                strokeWidth="1.8"
                              />

                              {rulerDisplayMode === "dual" ? (
                                <>
                                  <text
                                    x={rulerSpineX - 15}
                                    y={y - 1}
                                    textAnchor="end"
                                    fill="#f8fafc"
                                    fontSize="9.5"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    {d}m
                                  </text>
                                  <text
                                    x={rulerSpineX - 15}
                                    y={y + 8}
                                    textAnchor="end"
                                    fill="#38bdf8"
                                    fontSize="8"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    El {elevation >= 0 ? "+" : ""}{elevation.toFixed(1)}
                                  </text>
                                </>
                              ) : rulerDisplayMode === "depth" ? (
                                <text
                                  x={rulerSpineX - 15}
                                  y={y + 3.5}
                                  textAnchor="end"
                                  fill="#f8fafc"
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  -{d}m
                                </text>
                              ) : (
                                <text
                                  x={rulerSpineX - 15}
                                  y={y + 3.5}
                                  textAnchor="end"
                                  fill="#38bdf8"
                                  fontSize="8.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  El {elevation >= 0 ? "+" : ""}{elevation.toFixed(1)}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Ground Level Badge */}
                        <g>
                          <line x1={rulerLeft + 2} y1={topY} x2={rulerSpineX} y2={topY} stroke="#10b981" strokeWidth="2.5" />
                          <polygon points={`${rulerSpineX},${topY} ${rulerSpineX - 5},${topY - 3} ${rulerSpineX - 5},${topY + 3}`} fill="#10b981" />
                          <text x={rulerLeft + 4} y={topY + 11} fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                            GL 0.0m
                          </text>
                        </g>

                        {/* Toe Level Marker on Ruler */}
                        {pileToeY <= bottomY && (
                          <g>
                            <line x1={rulerLeft + 2} y1={pileToeY} x2={rulerSpineX} y2={pileToeY} stroke="#fbbf24" strokeWidth="2" />
                            <polygon points={`${rulerSpineX},${pileToeY} ${rulerSpineX - 5},${pileToeY - 3} ${rulerSpineX - 5},${pileToeY + 3}`} fill="#fbbf24" />
                            <text x={rulerLeft + 4} y={pileToeY - 3} fill="#fde047" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                              TOE -{project.length.toFixed(1)}m
                            </text>
                          </g>
                        )}

                        {/* Laser Probe */}
                        {hoverProbeDepth !== null && (
                          <g pointerEvents="none">
                            <line
                              x1={rulerLeft}
                              y1={topY + hoverProbeDepth * scale}
                              x2={strataRightX}
                              y2={topY + hoverProbeDepth * scale}
                              stroke="#00f0ff"
                              strokeWidth="1.2"
                              strokeDasharray="4 2"
                            />
                            <rect
                              x={rulerLeft - 2}
                              y={topY + hoverProbeDepth * scale - 10}
                              width={rulerWidth + 4}
                              height="20"
                              rx="3"
                              fill="#031b2e"
                              stroke="#00f0ff"
                              strokeWidth="1.5"
                              filter="url(#geo-glow)"
                            />
                            <text
                              x={rulerLeft + rulerWidth / 2}
                              y={topY + hoverProbeDepth * scale + 3}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="8.5"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              -{hoverProbeDepth.toFixed(2)}m · El {(siteDatum - hoverProbeDepth).toFixed(2)}m
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* 3. GROUNDWATER TABLE SURFACE */}
                  {waterY <= bottomY && (
                    <g>
                      <line
                        x1={strataLeftX}
                        y1={waterY}
                        x2={strataRightX}
                        y2={waterY}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                      <polygon points={`${strataLeftX + 10},${waterY - 1} ${strataLeftX + 16},${waterY - 7} ${strataLeftX + 22},${waterY - 1}`} fill="#38bdf8" />
                      <rect
                        x={strataLeftX + 26}
                        y={waterY - 14}
                        width="142"
                        height="14"
                        rx="2"
                        fill="#021424"
                        stroke="#38bdf8"
                        strokeWidth="0.8"
                      />
                      <text
                        x={strataLeftX + 30}
                        y={waterY - 4}
                        fill="#7dd3fc"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        GWL -{project.waterLevel.toFixed(1)}m (El {gwlElevation.toFixed(1)}m)
                      </text>
                    </g>
                  )}

                  {/* 4. BORED PILE SHAFT BODY */}
                  <g id="geo-pile-body">
                    {/* Reinforced Concrete Shaft */}
                    <rect
                      x={pileCenterX - pilePixelWidth / 2}
                      y={topY}
                      width={pilePixelWidth}
                      height={Math.min(project.length, maxDepth) * scale}
                      fill="#06b6d4"
                      fillOpacity="0.25"
                      stroke="#22d3ee"
                      strokeWidth="2.2"
                    />
                    <rect
                      x={pileCenterX - pilePixelWidth / 2}
                      y={topY}
                      width={pilePixelWidth}
                      height={Math.min(project.length, maxDepth) * scale}
                      fill="url(#geo-pile-rebar)"
                    />

                    {/* Shaft Centerline */}
                    <line
                      x1={pileCenterX}
                      y1={topY - 8}
                      x2={pileCenterX}
                      y2={pileToeY + 8}
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeDasharray="8 4 2 4"
                      opacity="0.8"
                    />

                    {/* Pile Diameter Dimension Bracket at Head */}
                    <line
                      x1={pileCenterX - pilePixelWidth / 2}
                      y1={topY - 12}
                      x2={pileCenterX + pilePixelWidth / 2}
                      y2={topY - 12}
                      stroke="#67e8f9"
                      strokeWidth="1.4"
                    />
                    <line
                      x1={pileCenterX - pilePixelWidth / 2}
                      y1={topY - 16}
                      x2={pileCenterX - pilePixelWidth / 2}
                      y2={topY - 8}
                      stroke="#67e8f9"
                      strokeWidth="1.4"
                    />
                    <line
                      x1={pileCenterX + pilePixelWidth / 2}
                      y1={topY - 16}
                      x2={pileCenterX + pilePixelWidth / 2}
                      y2={topY - 8}
                      stroke="#67e8f9"
                      strokeWidth="1.4"
                    />
                    <text
                      x={pileCenterX}
                      y={topY - 15}
                      textAnchor="middle"
                      fill="#67e8f9"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Ø{project.diameter}mm
                    </text>

                    {/* Pile Length Dimension on Pile Side */}
                    <line
                      x1={pileCenterX + pilePixelWidth / 2 + 10}
                      y1={topY}
                      x2={pileCenterX + pilePixelWidth / 2 + 10}
                      y2={pileToeY}
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                    />
                    <line
                      x1={pileCenterX + pilePixelWidth / 2 + 6}
                      y1={topY}
                      x2={pileCenterX + pilePixelWidth / 2 + 14}
                      y2={topY}
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                    />
                    <line
                      x1={pileCenterX + pilePixelWidth / 2 + 6}
                      y1={pileToeY}
                      x2={pileCenterX + pilePixelWidth / 2 + 14}
                      y2={pileToeY}
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                    />
                    <text
                      x={pileCenterX + pilePixelWidth / 2 + 18}
                      y={topY + (pileToeY - topY) / 2 + 3}
                      fill="#22d3ee"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      L={project.length.toFixed(1)}m
                    </text>

                    {/* Axial Load Arrow at Pile Head */}
                    <line x1={pileCenterX} y1="6" x2={pileCenterX} y2={topY - 2} stroke="#fbbf24" strokeWidth="3" />
                    <polygon points={`${pileCenterX - 5},${topY - 8} ${pileCenterX},${topY} ${pileCenterX + 5},${topY - 8}`} fill="#fbbf24" />
                    <text
                      x={pileCenterX + 8}
                      y="16"
                      fill="#fbbf24"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      N_Ed = {project.nEd} kN
                    </text>

                    {/* Moment Curved Indicator if M_Ed > 0 */}
                    {project.mEd > 0 && (
                      <g>
                        <path
                          d={`M ${pileCenterX - 18} 18 A 12 12 0 0 1 ${pileCenterX - 18} 34`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        <polygon points={`${pileCenterX - 18},34 ${pileCenterX - 22},28 ${pileCenterX - 14},28`} fill="#38bdf8" />
                        <text
                          x={pileCenterX - 24}
                          y="28"
                          textAnchor="end"
                          fill="#38bdf8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          M={project.mEd} kNm
                        </text>
                      </g>
                    )}

                    {/* Pile Toe Base Resistance Arrows & Guideline */}
                    <line
                      x1={strataLeftX}
                      y1={pileToeY}
                      x2={strataRightX}
                      y2={pileToeY}
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                    />
                    <polygon
                      points={`${pileCenterX},${pileToeY} ${pileCenterX - 6},${pileToeY + 9} ${pileCenterX + 6},${pileToeY + 9}`}
                      fill="#fbbf24"
                    />
                    <rect
                      x={strataLeftX + 6}
                      y={pileToeY + 4}
                      width="180"
                      height="16"
                      rx="2"
                      fill="#1e1805"
                      stroke="#fbbf24"
                      strokeWidth="0.8"
                    />
                    <text
                      x={strataLeftX + 10}
                      y={pileToeY + 15}
                      fill="#fde047"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      TOE -{project.length.toFixed(2)}m (El {toeElevation.toFixed(2)}m)
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* PLAN VIEW & REBAR CAGE CROSS-SECTION */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-700/80 bg-[#040910] p-4 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-slate-200">CROSS-SECTION PLAN</h3>
                    <p className="font-mono text-[10px] text-slate-500">Normal to pile longitudinal axis</p>
                  </div>
                  {/* Mode Toggle */}
                  <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActivePlanView("rebar")}
                      className={`px-2 py-0.5 rounded transition ${
                        activePlanView === "rebar" ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-800" : "text-slate-400"
                      }`}
                    >
                      Rebar Cage
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePlanView("stress")}
                      className={`px-2 py-0.5 rounded transition ${
                        activePlanView === "stress" ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-800" : "text-slate-400"
                      }`}
                    >
                      Stress
                    </button>
                  </div>
                </div>

                {/* SVG Circular Plan View */}
                <svg
                  viewBox="0 0 260 260"
                  className="mx-auto w-full max-w-[240px] aspect-square"
                  role="img"
                  aria-label="Bored pile circular plan view"
                >
                  <defs>
                    <radialGradient id="stress-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </radialGradient>
                  </defs>

                  {/* Engineering Grid */}
                  <rect x="10" y="10" width="240" height="240" rx="8" fill="#030812" stroke="#1e293b" />
                  <line x1="20" y1="130" x2="240" y2="130" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="130" y1="20" x2="130" y2="240" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />

                  {/* Outer Excavation Circle */}
                  <circle cx="130" cy="130" r="95" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Concrete Shaft Perimeter */}
                  <circle
                    cx="130"
                    cy="130"
                    r="84"
                    fill={activePlanView === "stress" ? "url(#stress-grad)" : "#0c2438"}
                    stroke="#22d3ee"
                    strokeWidth="3"
                  />

                  {/* Cover Zone Ring */}
                  <circle
                    cx="130"
                    cy="130"
                    r={Math.max(20, 84 - (project.cover / (project.diameter / 2)) * 84)}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.8"
                  />

                  {/* Rebar Bars Arrangement (Calculated evenly around cage radius) */}
                  {(() => {
                    const cageR = Math.max(20, 84 - (project.cover / (project.diameter / 2)) * 84);
                    const nBars = project.numBars || 8;
                    const barElements = [];

                    for (let i = 0; i < nBars; i++) {
                      const angle = (i * 2 * Math.PI) / nBars - Math.PI / 2;
                      const bx = 130 + cageR * Math.cos(angle);
                      const by = 130 + cageR * Math.sin(angle);
                      barElements.push(
                        <g key={`bar-${i}`}>
                          <circle cx={bx} cy={by} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                        </g>
                      );
                    }
                    return barElements;
                  })()}

                  {/* Spiral/Hoop Link Inner Core */}
                  <circle
                    cx="130"
                    cy="130"
                    r={Math.max(14, 84 - (project.cover / (project.diameter / 2)) * 84 - 8)}
                    fill="#05101a"
                    stroke="#0ea5e9"
                    strokeWidth="1.2"
                    opacity="0.6"
                  />

                  {/* Dimension Annotations */}
                  <text x="130" y="134" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    Ø{project.diameter}
                  </text>
                  <text x="130" y="148" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    cover={project.cover}mm
                  </text>

                  <text x="130" y="234" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                    SECTION A-A PLAN
                  </text>
                </svg>

                {/* Plan View Metric Readouts */}
                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Cross Area</span>
                    <strong className="text-cyan-300 font-bold">{areaM2.toFixed(3)} m²</strong>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Perimeter</span>
                    <strong className="text-cyan-300 font-bold">{perimeterM.toFixed(2)} m</strong>
                  </div>
                </div>
              </div>

              {/* GEOTECHNICAL RESISTANCE QUICK SUMMARY TABLE */}
              <div className="rounded-xl border border-slate-700/80 bg-[#040910] p-4 shadow-inner font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Zap className="size-3.5 text-amber-400" />
                    Resistance Breakdown
                  </span>
                  <span className="text-[10px] text-slate-400">kN</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Shaft Friction R_sk:</span>
                    <strong className="text-cyan-300 font-bold">{results.totalShaftResistance.toFixed(0)} kN</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Base End Bearing R_bk:</span>
                    <strong className="text-cyan-300 font-bold">{results.baseResistance.toFixed(0)} kN</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-1.5">
                    <span>Total Characteristic R_ck:</span>
                    <strong className="text-white font-bold">{results.totalCharacteristicResistance.toFixed(0)} kN</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 font-bold border-t border-slate-800/80 pt-1.5">
                    <span>Design Resistance R_cd:</span>
                    <span className="text-emerald-300">{results.designResistance.toFixed(0)} kN</span>
                  </div>
                </div>

                <div className="mt-3 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400">
                  <span>Method: Layer-by-layer integration using α/β-method and base bearing q_b = {results.baseUnitResistance} kPa.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
