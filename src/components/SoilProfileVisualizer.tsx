import React, { useState } from "react";
import {
  Layers,
  AlertTriangle,
  Sparkles,
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2,
  Ruler,
  GripVertical,
  Droplets,
  Waves,
  Sliders,
  ChevronDown,
  ChevronUp,
  Minimize2,
} from "lucide-react";
import type { SoilLayer, PorePressureMode } from "@/lib/engine/types";
import { computeLayerPorePressure } from "@/lib/engine/calculate";
import { SoilTextureIcon } from "./SoilTextureIcon";

export interface SoilProfileVisualizerProps {
  layers: SoilLayer[];
  waterLevel?: number; // Elevation in m (e.g. 0.0 or -2.0)
  toeLevel?: number; // Wall or pile toe elevation in m (e.g. -6.0)
  riverbedLevel?: number; // Retained / dredge line elevation in m
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  hoveredId?: string | null;
  onHoverId?: (id: string | null) => void;
  onUpdateLayer?: (index: number, patch: Partial<SoilLayer>) => void;
  onAddLayer?: () => void;
  onRemoveLayer?: (index: number) => void;
  onReorderLayer?: (from: number, to: number, autoRestack?: boolean) => void;
  onAutoAlign?: () => void;
  onApplyPreset?: (presetKey: string) => void;
  className?: string;
  compact?: boolean;
  onToggleCompact?: (compact: boolean) => void;
  searchQuery?: string;
  selectedMaterialFilter?: string;
}

// Visual theme and hatching pattern definitions for geotechnical materials
export interface SoilMaterialStyle {
  fill: string;
  patternFill: string;
  stroke: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  hatchId: string;
  category: "clay" | "sand" | "gravel" | "rock" | "silt" | "fill" | "generic";
}

export function getSoilMaterialStyle(layer: SoilLayer, index: number): SoilMaterialStyle {
  const nameLower = (layer.name + " " + (layer.soilType || "") + " " + (layer.description || "")).toLowerCase();

  if (nameLower.includes("rock") || nameLower.includes("sandstone") || nameLower.includes("granite") || nameLower.includes("limestone") || nameLower.includes("siltstone") || nameLower.includes("shale")) {
    return {
      fill: "#6d597a",
      patternFill: "#544360",
      stroke: "#43344d",
      text: "#f5effa",
      badgeBg: "#43344d",
      badgeText: "#d8b4e2",
      hatchId: "hatch-rock",
      category: "rock",
    };
  }

  if (nameLower.includes("gravel") || nameLower.includes("cobble") || nameLower.includes("boulder")) {
    return {
      fill: "#a3704c",
      patternFill: "#8a5836",
      stroke: "#6c4125",
      text: "#fdf8f5",
      badgeBg: "#6c4125",
      badgeText: "#f0cbaf",
      hatchId: "hatch-gravel",
      category: "gravel",
    };
  }

  if (nameLower.includes("clay") || layer.drainage === "undrained" || nameLower.includes("mud") || nameLower.includes("cohesive")) {
    const isStiff = layer.cu > 60 || nameLower.includes("stiff") || nameLower.includes("hard");
    return {
      fill: isStiff ? "#5e6973" : "#7c8996",
      patternFill: isStiff ? "#4a535c" : "#687480",
      stroke: isStiff ? "#394149" : "#515c67",
      text: "#f8fafc",
      badgeBg: isStiff ? "#394149" : "#515c67",
      badgeText: "#cbd5e1",
      hatchId: "hatch-clay",
      category: "clay",
    };
  }

  if (nameLower.includes("silt") || nameLower.includes("loess")) {
    return {
      fill: "#a89f91",
      patternFill: "#8f8576",
      stroke: "#6e665a",
      text: "#ffffff",
      badgeBg: "#6e665a",
      badgeText: "#e2ddd5",
      hatchId: "hatch-silt",
      category: "silt",
    };
  }

  if (nameLower.includes("sand") || nameLower.includes("granular") || nameLower.includes("alluv")) {
    const isDense = layer.phi >= 34 || (layer.sptN && layer.sptN > 25);
    return {
      fill: isDense ? "#c89d58" : "#dcb773",
      patternFill: isDense ? "#ab8240" : "#c49f5c",
      stroke: isDense ? "#8a662e" : "#9e7d44",
      text: "#291e0a",
      badgeBg: isDense ? "#8a662e" : "#9e7d44",
      badgeText: "#fff8eb",
      hatchId: "hatch-sand",
      category: "sand",
    };
  }

  if (nameLower.includes("fill") || nameLower.includes("made ground") || nameLower.includes("waste")) {
    return {
      fill: "#b89065",
      patternFill: "#997349",
      stroke: "#755431",
      text: "#ffffff",
      badgeBg: "#755431",
      badgeText: "#faede0",
      hatchId: "hatch-fill",
      category: "fill",
    };
  }

  // Fallback cyclic palette
  const fallbacks: SoilMaterialStyle[] = [
    { fill: "#dbc49b", patternFill: "#c2aa80", stroke: "#8f764c", text: "#2c200e", badgeBg: "#8f764c", badgeText: "#fff8eb", hatchId: "hatch-sand", category: "generic" },
    { fill: "#c7a876", patternFill: "#ad8e5c", stroke: "#785f34", text: "#241a0a", badgeBg: "#785f34", badgeText: "#fff8eb", hatchId: "hatch-sand", category: "generic" },
    { fill: "#b89462", patternFill: "#9c7949", stroke: "#6e522d", text: "#ffffff", badgeBg: "#6e522d", badgeText: "#faede0", hatchId: "hatch-silt", category: "generic" },
    { fill: "#879b72", patternFill: "#6d8058", stroke: "#4f603c", text: "#ffffff", badgeBg: "#4f603c", badgeText: "#e6f0de", hatchId: "hatch-clay", category: "generic" },
    { fill: "#9e8970", patternFill: "#826e57", stroke: "#5e4e3b", text: "#ffffff", badgeBg: "#5e4e3b", badgeText: "#faede0", hatchId: "hatch-gravel", category: "generic" },
    { fill: "#7a8b99", patternFill: "#61717e", stroke: "#47545e", text: "#ffffff", badgeBg: "#47545e", badgeText: "#e2e8f0", hatchId: "hatch-clay", category: "generic" },
  ];

  return fallbacks[index % fallbacks.length];
}

export const SOIL_ARCHETYPES = [
  {
    key: "soft-clay",
    label: "Soft Clay",
    type: "clay",
    soilType: "Soft alluvial clay",
    description: "Normally consolidated soft cohesive stratum",
    gamma: 16.5,
    gammaSat: 17.5,
    phi: 22,
    c: 0,
    cu: 25,
    E: 10000,
    sptN: 4,
    drainage: "undrained" as const,
  },
  {
    key: "stiff-clay",
    label: "Stiff Clay",
    type: "stiff-clay",
    soilType: "Overconsolidated stiff clay",
    description: "Firm to stiff overconsolidated clay",
    gamma: 19.5,
    gammaSat: 20.5,
    phi: 26,
    c: 5,
    cu: 90,
    E: 45000,
    sptN: 18,
    drainage: "undrained" as const,
  },
  {
    key: "medium-sand",
    label: "Med Sand",
    type: "sand",
    soilType: "Medium dense sand",
    description: "Uniform medium alluvial sand",
    gamma: 18.5,
    gammaSat: 19.5,
    phi: 32,
    c: 0,
    cu: 0,
    E: 30000,
    sptN: 16,
    drainage: "drained" as const,
  },
  {
    key: "dense-gravel",
    label: "Dense Gravel",
    type: "gravel",
    soilType: "Dense sandy gravel",
    description: "Coarse well-graded gravel / cobbles",
    gamma: 20.5,
    gammaSat: 21.5,
    phi: 38,
    c: 0,
    cu: 0,
    E: 75000,
    sptN: 35,
    drainage: "drained" as const,
  },
  {
    key: "bedrock",
    label: "Bedrock",
    type: "rock",
    soilType: "Weathered bedrock",
    description: "Competent bedrock / hard founding stratum",
    gamma: 23.0,
    gammaSat: 23.5,
    phi: 42,
    c: 25,
    cu: 300,
    E: 250000,
    sptN: 60,
    drainage: "drained" as const,
  },
  {
    key: "engineered-fill",
    label: "Engineered Fill",
    type: "fill",
    soilType: "Compacted granular fill",
    description: "Engineered granular fill (95% MDD)",
    gamma: 19.0,
    gammaSat: 20.0,
    phi: 34,
    c: 0,
    cu: 0,
    E: 35000,
    sptN: 20,
    drainage: "drained" as const,
  },
];

export function SoilProfileVisualizer({
  layers,
  waterLevel,
  toeLevel,
  riverbedLevel,
  selectedId,
  onSelectId,
  hoveredId,
  onHoverId,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  onReorderLayer,
  onAutoAlign,
  onApplyPreset,
  className = "",
  compact: propCompact,
  onToggleCompact,
  searchQuery,
  selectedMaterialFilter,
}: SoilProfileVisualizerProps) {
  const isLayerMatching = (layer: SoilLayer) => {
    if (selectedMaterialFilter && selectedMaterialFilter !== "all") {
      const mat = (layer.soilType || "").toLowerCase();
      const name = (layer.name || "").toLowerCase();
      const desc = (layer.description || "").toLowerCase();
      const target = selectedMaterialFilter.toLowerCase();
      if (!mat.includes(target) && !name.includes(target) && !desc.includes(target)) {
        return false;
      }
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const nameMatch = layer.name.toLowerCase().includes(q);
      const matMatch = (layer.soilType || "").toLowerCase().includes(q);
      const descMatch = (layer.description || "").toLowerCase().includes(q);
      const drainageMatch = (layer.drainage || "").toLowerCase().includes(q);
      if (!nameMatch && !matMatch && !descMatch && !drainageMatch) {
        return false;
      }
    }
    return true;
  };

  const isFilterActive = Boolean(searchQuery?.trim() || (selectedMaterialFilter && selectedMaterialFilter !== "all"));

  const [internalHoverId, setInternalHoverId] = useState<string | null>(null);
  const activeHoverId = hoveredId !== undefined ? hoveredId : internalHoverId;
  const [internalCompact, setInternalCompact] = useState<boolean>(propCompact ?? false);
  const isCompact = propCompact !== undefined ? propCompact : internalCompact;

  const handleToggleCompact = () => {
    const nextVal = !isCompact;
    setInternalCompact(nextVal);
    onToggleCompact?.(nextVal);
  };

  // Drag-and-drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(null);
  const [autoCascadeElevations, setAutoCascadeElevations] = useState<boolean>(true);

  // Groundwater Table & Pore Pressure visualization state
  const [showPorePressure, setShowPorePressure] = useState<boolean>(true);
  const [expandedHydroId, setExpandedHydroId] = useState<string | null>(null);
  const [cursorHoverZ, setCursorHoverZ] = useState<number | null>(null);

  const handleDropOnIndex = (targetIndex: number, position: "before" | "after") => {
    if (draggedIndex === null || onReorderLayer === undefined) return;
    let finalTarget = position === "before" ? targetIndex : targetIndex + 1;
    if (draggedIndex < finalTarget) {
      finalTarget -= 1;
    }
    if (finalTarget !== draggedIndex && finalTarget >= 0 && finalTarget < layers.length) {
      onReorderLayer(draggedIndex, finalTarget, autoCascadeElevations);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  // Stratigraphy bounds calculation
  const topElevation = layers.length > 0 ? Math.max(...layers.map((l) => l.zTop)) : 0;
  const bottomElevation = layers.length > 0 ? Math.min(...layers.map((l) => l.zBot)) : -10;
  const totalThickness = Math.max(0.1, topElevation - bottomElevation);

  // Check for gaps or overlaps between consecutive strata
  const boundaryIssues: { index: number; type: "gap" | "overlap"; fromZ: number; toZ: number; delta: number }[] = [];
  for (let i = 0; i < layers.length - 1; i++) {
    const current = layers[i];
    const next = layers[i + 1];
    const diff = current.zBot - next.zTop;
    if (Math.abs(diff) > 0.02) {
      if (diff > 0) {
        // Current bottom is higher than next top -> gap!
        boundaryIssues.push({
          index: i,
          type: "gap",
          fromZ: current.zBot,
          toZ: next.zTop,
          delta: diff,
        });
      } else {
        // Current bottom is lower than next top -> overlap!
        boundaryIssues.push({
          index: i,
          type: "overlap",
          fromZ: next.zTop,
          toZ: current.zBot,
          delta: Math.abs(diff),
        });
      }
    }
  }

  // Dimension scaling
  // SVG Canvas configuration
  const svgWidth = showPorePressure ? 710 : 440;
  const colX = showPorePressure ? 95 : 110;
  const colWidth = showPorePressure ? 195 : 220;
  const rulerX = showPorePressure ? 75 : 90;
  const pressX = showPorePressure ? 385 : 0;
  const pressWidth = showPorePressure ? 240 : 0;
  const marginY = 32;
  const availableH = Math.max(390, Math.min(700, 72 * Math.max(1, layers.length)));
  const pxPerMeter = (availableH - 2 * marginY) / totalThickness;

  const getSvgY = (z: number) => {
    return marginY + (topElevation - z) * pxPerMeter;
  };

  // Sample discrete pore water pressure points across depth profile
  const zTargets = new Set<number>();
  zTargets.add(topElevation);
  zTargets.add(bottomElevation);
  if (waterLevel !== undefined && waterLevel <= topElevation && waterLevel >= bottomElevation) {
    zTargets.add(waterLevel);
  }
  for (const l of layers) {
    zTargets.add(l.zTop);
    zTargets.add(l.zBot);
    if (l.hasWaterTable && l.waterTable !== undefined && l.waterTable <= topElevation && l.waterTable >= bottomElevation) {
      zTargets.add(l.waterTable);
    }
    if (l.piezometricHead !== undefined && l.piezometricHead <= topElevation && l.piezometricHead >= bottomElevation) {
      zTargets.add(l.piezometricHead);
    }
  }
  // Sample intermediate points every 0.25m for smooth gradient representation
  for (let z = topElevation; z >= bottomElevation; z -= 0.25) {
    zTargets.add(Number(z.toFixed(2)));
  }

  const sortedZ = Array.from(zTargets).sort((a, b) => b - a);
  let maxPorePressure = 10;
  const samplePoints: { z: number; u: number; uHydro: number }[] = [];

  for (const z of sortedZ) {
    const u = computeLayerPorePressure(layers, z, waterLevel ?? 0, 9.81);
    const uHydro = Math.max(0, (waterLevel ?? 0) - z) * 9.81;
    if (u > maxPorePressure) maxPorePressure = u;
    samplePoints.push({ z, u, uHydro });
  }

  const niceMaxU = Math.max(25, Math.ceil(maxPorePressure / 25) * 25);
  const uToX = (u: number) => pressX + (Math.max(0, Math.min(niceMaxU * 1.15, u)) / niceMaxU) * pressWidth;

  let pressurePathD = `M ${pressX} ${getSvgY(topElevation)}`;
  for (const pt of samplePoints) {
    const x = uToX(pt.u);
    const y = getSvgY(pt.z);
    pressurePathD += ` L ${x} ${y}`;
  }
  pressurePathD += ` L ${pressX} ${getSvgY(bottomElevation)} Z`;

  let hydroPathD = `M ${pressX} ${getSvgY(topElevation)}`;
  for (const pt of samplePoints) {
    const x = uToX(pt.uHydro);
    const y = getSvgY(pt.z);
    hydroPathD += ` L ${x} ${y}`;
  }

  // Key pressure callout points at layer boundaries and water tables
  const keyElevations = new Set<number>();
  keyElevations.add(topElevation);
  keyElevations.add(bottomElevation);
  if (waterLevel !== undefined) keyElevations.add(waterLevel);
  for (const l of layers) {
    keyElevations.add(l.zTop);
    keyElevations.add(l.zBot);
    if (l.hasWaterTable && l.waterTable !== undefined) keyElevations.add(l.waterTable);
  }
  const keyPoints = Array.from(keyElevations)
    .sort((a, b) => b - a)
    .map((z) => ({
      z,
      u: computeLayerPorePressure(layers, z, waterLevel ?? 0, 9.81),
    }));

  // Cursor hover measurement calculations
  let cursorInfo: { z: number; depth: number; u: number; uHydro: number; sigmaV: number; sigmaVEff: number; layerName: string } | null = null;
  if (cursorHoverZ !== null) {
    const z = cursorHoverZ;
    const depth = topElevation - z;
    const u = computeLayerPorePressure(layers, z, waterLevel ?? 0, 9.81);
    const uHydro = Math.max(0, (waterLevel ?? 0) - z) * 9.81;
    let sigmaV = 0;
    const sorted = [...layers].sort((a, b) => b.zTop - a.zTop);
    let cursor = topElevation;
    for (const l of sorted) {
      const top = Math.min(cursor, l.zTop);
      const bot = Math.max(z, l.zBot);
      if (bot < top) {
        const midZ = (top + bot) / 2;
        const lyrWl = l.hasWaterTable && l.waterTable !== undefined ? l.waterTable : (waterLevel ?? 0);
        const isSat = midZ < lyrWl;
        const gamma = isSat ? l.gammaSat : l.gamma;
        sigmaV += gamma * (top - bot);
        cursor = bot;
      }
      if (cursor <= z + 1e-6) break;
    }
    const currentL = layers.find((l) => z <= l.zTop + 1e-6 && z >= l.zBot - 1e-6) ?? null;
    cursorInfo = {
      z,
      depth: Math.max(0, depth),
      u,
      uHydro,
      sigmaV,
      sigmaVEff: Math.max(0, sigmaV - u),
      layerName: currentL ? currentL.name : "Soil Profile",
    };
  }

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = ((e.clientY - rect.top) / rect.height) * availableH;
    if (relY >= marginY && relY <= availableH - marginY) {
      const z = topElevation - ((relY - marginY) / (availableH - 2 * marginY)) * totalThickness;
      setCursorHoverZ(Number(z.toFixed(2)));
    } else {
      setCursorHoverZ(null);
    }
  };

  return (
    <div className={`flex flex-col bg-panel border border-rule rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Visualizer Header */}
      <div className="bg-paper-2 border-b border-rule px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-sm bg-navy text-paper flex items-center justify-center font-bold">
            <Layers className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy flex items-center gap-1.5 font-display uppercase tracking-wider">
              Visual Soil Stratigraphy Profile
            </h3>
            <p className="text-xs text-muted">
              {layers.length} strata defined • Ground Level:{" "}
              <span className="font-mono text-ink font-medium">
                {topElevation >= 0 ? `+${topElevation.toFixed(2)}` : topElevation.toFixed(2)} m
              </span>{" "}
              to{" "}
              <span className="font-mono text-ink font-medium">
                {bottomElevation.toFixed(2)} m
              </span>{" "}
              (Total depth: {totalThickness.toFixed(2)} m)
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Pore Water Pressure Profile Diagram */}
          <button
            type="button"
            onClick={() => setShowPorePressure(!showPorePressure)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm font-medium text-xs transition border ${
              showPorePressure
                ? "bg-sky-50 text-sky-800 border-sky-300 font-semibold"
                : "bg-paper text-muted border-rule hover:text-ink"
            }`}
            title="Toggle display of the Pore Water Pressure (u) profile diagram alongside the stratigraphy column"
          >
            <Droplets className="size-3.5 text-sky-600" />
            <span>{showPorePressure ? "Pore Pressure (u) Active" : "Show Pore Pressure (u)"}</span>
          </button>

          {boundaryIssues.length > 0 && onAutoAlign && (
            <button
              type="button"
              onClick={onAutoAlign}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-warn text-paper hover:opacity-90 font-medium text-xs transition"
              title="Align stratum elevations to eliminate gaps and overlaps"
            >
              <Sparkles className="size-3.5" />
              <span>Auto-Align Depths ({boundaryIssues.length})</span>
            </button>
          )}

          {onAddLayer && (
            <button
              type="button"
              onClick={onAddLayer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-navy text-paper hover:bg-navy-mid font-medium text-xs transition"
            >
              <Plus className="size-3.5" />
              <span>Add Stratum</span>
            </button>
          )}
        </div>
      </div>

      {/* Discontinuity Warning Banner if present */}
      {boundaryIssues.length > 0 && (
        <div className="bg-warn-bg border-b border-warn/30 px-4 py-2 text-xs text-warn flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>
              <strong>Boundary Discontinuity:</strong> {boundaryIssues.length} gap(s) or overlap(s) detected in the soil column. Align stratum boundaries for reliable geotechnical results.
            </span>
          </div>
          {onAutoAlign && (
            <button
              type="button"
              onClick={onAutoAlign}
              className="underline font-semibold hover:text-ink shrink-0 ml-2"
            >
              Fix automatically
            </button>
          )}
        </div>
      )}

      {/* Main Soil Column Display Area */}
      <div className="p-4 flex flex-col lg:flex-row gap-6 items-start justify-center overflow-x-auto">
        {/* The SVG Column Container */}
        <div className="relative shrink-0 flex flex-col items-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${availableH}`}
            className={`${showPorePressure ? "w-[580px] lg:w-[660px]" : "w-[400px]"} max-w-full h-auto drop-shadow-xs select-none cursor-crosshair`}
            role="img"
            aria-label="Stacked colored soil profile and pore water pressure distribution"
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={() => setCursorHoverZ(null)}
          >
            <defs>
              {/* Sand Stipple Pattern */}
              <pattern id="hatch-sand" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#785f34" opacity="0.45" />
                <circle cx="8" cy="5" r="0.9" fill="#785f34" opacity="0.4" />
                <circle cx="4" cy="9" r="1.0" fill="#785f34" opacity="0.45" />
                <circle cx="10" cy="11" r="0.8" fill="#785f34" opacity="0.35" />
              </pattern>

              {/* Clay Laminar Pattern */}
              <pattern id="hatch-clay" width="16" height="14" patternUnits="userSpaceOnUse">
                <path d="M0 4c3-1.5 5 1.5 8 0s5 1.5 8 0M0 11c3-1.5 5 1.5 8 0s5 1.5 8 0" fill="none" stroke="#2c343d" strokeWidth="0.9" opacity="0.3" />
              </pattern>

              {/* Gravel Pebbles Pattern */}
              <pattern id="hatch-gravel" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="2.8" fill="none" stroke="#4a2e18" strokeWidth="1.1" opacity="0.45" />
                <circle cx="15" cy="13" r="2.2" fill="none" stroke="#4a2e18" strokeWidth="1.1" opacity="0.45" />
                <circle cx="13" cy="4" r="1.5" fill="#4a2e18" opacity="0.4" />
                <circle cx="6" cy="15" r="1.3" fill="#4a2e18" opacity="0.4" />
              </pattern>

              {/* Rock Joints Pattern */}
              <pattern id="hatch-rock" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M0 16L12 4M10 22L22 10M3 3L8 8M14 14L19 19" stroke="#251b2b" strokeWidth="1.2" opacity="0.4" />
              </pattern>

              {/* Silt Fine Hatch */}
              <pattern id="hatch-silt" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#4a4237" strokeWidth="0.8" opacity="0.25" />
              </pattern>

              {/* Fill Mixed Debris Pattern */}
              <pattern id="hatch-fill" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M2 3l4-2M10 5l3-2M4 12l3-1M11 13l3-2M2 10h3M12 9v3" stroke="#4d351d" strokeWidth="1.2" opacity="0.45" />
              </pattern>

              {/* Gap Stripes Pattern */}
              <pattern id="hatch-gap" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#b45309" strokeWidth="3" opacity="0.35" />
              </pattern>

              {/* Groundwater Saturation Hatch */}
              <pattern id="hatch-saturation" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#0284c7" strokeWidth="1.4" strokeOpacity="0.35" />
              </pattern>

              {/* Pore Pressure Diagram Fill Gradient */}
              <linearGradient id="pore-pressure-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.55" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="block-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
              </filter>

              {/* CSS Keyframes & Transitions for Soil Profile Visualization */}
              <style>{`
                @keyframes profileSelectedGlow {
                  0%, 100% {
                    opacity: 0.95;
                    stroke-width: 2.5px;
                    filter: drop-shadow(0 0 4px #0284c7) drop-shadow(0 0 10px rgba(14, 165, 233, 0.6));
                  }
                  50% {
                    opacity: 0.55;
                    stroke-width: 4px;
                    filter: drop-shadow(0 0 10px #0284c7) drop-shadow(0 0 20px rgba(14, 165, 233, 0.9));
                  }
                }
                @keyframes profileGentleScale {
                  0%, 100% {
                    transform: scaleX(1.02);
                  }
                  50% {
                    transform: scaleX(1.032);
                  }
                }
                .profile-layer-group {
                  transform-box: fill-box;
                  transform-origin: center;
                  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
                }
                .profile-layer-group:hover:not(.is-active) {
                  transform: scaleX(1.01);
                }
                .profile-layer-group.is-active {
                  transform: scaleX(1.025);
                  animation: profileGentleScale 3s ease-in-out infinite;
                }
                .profile-pulse-aura {
                  animation: profileSelectedGlow 2s ease-in-out infinite;
                }
              `}</style>
            </defs>

            {/* Background Grid & Axis Line */}
            <line x1={rulerX} y1={marginY} x2={rulerX} y2={availableH - marginY} stroke="#8f8676" strokeWidth="1.5" />

            {/* Ground Surface Top Line */}
            <g>
              <line x1={colX - 45} y1={marginY} x2={colX + colWidth + 45} y2={marginY} stroke="#1c1917" strokeWidth="2.5" />
              {/* Ground Hash Pattern */}
              {Array.from({ length: 18 }).map((_, i) => (
                <line
                  key={`gh-${i}`}
                  x1={colX - 40 + i * 18}
                  y1={marginY}
                  x2={colX - 46 + i * 18}
                  y2={marginY - 8}
                  stroke="#5c564e"
                  strokeWidth="1.5"
                />
              ))}
              <text
                x={colX + colWidth / 2}
                y={marginY - 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="IBM Plex Sans, sans-serif"
                fill="#1c1917"
              >
                GROUND SURFACE (GL {topElevation >= 0 ? `+${topElevation.toFixed(2)}` : topElevation.toFixed(2)} m)
              </text>
            </g>

            {/* Stacked Colored Blocks */}
            {layers.map((layer, index) => {
              const yTop = getSvgY(layer.zTop);
              const yBot = getSvgY(layer.zBot);
              const blockH = Math.max(12, yBot - yTop);
              const thickness = layer.zTop - layer.zBot;
              const isSelected = selectedId === layer.id;
              const isHovered = activeHoverId === layer.id;
              const style = getSoilMaterialStyle(layer, index);
              const matchesFilter = isLayerMatching(layer);

              return (
                <g
                  key={layer.id}
                  className={`cursor-pointer transition-all duration-200 profile-layer-group ${isSelected ? "is-active" : ""} ${draggedIndex === index ? "opacity-35" : ""} ${isFilterActive && !matchesFilter ? "opacity-25 saturate-50" : ""}`}
                  onClick={() => onSelectId?.(layer.id)}
                  {...({ draggable: !!onReorderLayer } as any)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index.toString());
                    e.dataTransfer.effectAllowed = "move";
                    setDraggedIndex(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (draggedIndex === null || draggedIndex === index) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
                    if (dragOverIndex !== index || dropPosition !== pos) {
                      setDragOverIndex(index);
                      setDropPosition(pos);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    handleDropOnIndex(index, dropPosition || "after");
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                    setDropPosition(null);
                  }}
                  onMouseEnter={() => {
                    setInternalHoverId(layer.id);
                    onHoverId?.(layer.id);
                  }}
                  onMouseLeave={() => {
                    setInternalHoverId(null);
                    onHoverId?.(null);
                  }}
                >
                  {/* Base Colored Block */}
                  <rect
                    x={colX}
                    y={yTop}
                    width={colWidth}
                    height={blockH}
                    fill={style.fill}
                    stroke={isSelected ? "#0b2545" : isHovered ? "#163a5f" : style.stroke}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.2}
                    filter={isSelected ? "url(#block-shadow)" : undefined}
                    rx="2"
                  />

                  {/* Geotechnical Pattern Hatch Overlay */}
                  <rect
                    x={colX}
                    y={yTop}
                    width={colWidth}
                    height={blockH}
                    fill={`url(#${style.hatchId})`}
                    opacity="0.85"
                    pointerEvents="none"
                    rx="2"
                  />

                  {/* Stratum-specific or Global Groundwater Saturation Wash */}
                  {(() => {
                    const hasLyrWt = (layer.hasWaterTable ?? (layer.waterTable !== undefined)) && layer.waterTable !== undefined;
                    const lyrWt = hasLyrWt ? layer.waterTable! : (waterLevel !== undefined ? waterLevel : undefined);
                    if (lyrWt === undefined) return null;
                    const satTop = Math.min(layer.zTop, lyrWt);
                    const satBot = layer.zBot;
                    if (satTop <= satBot) return null;
                    const ySatTop = getSvgY(satTop);
                    const ySatBot = getSvgY(satBot);
                    const satH = Math.max(1, ySatBot - ySatTop);
                    return (
                      <g pointerEvents="none">
                        <rect
                          x={colX}
                          y={ySatTop}
                          width={colWidth}
                          height={satH}
                          fill="#0284c7"
                          fillOpacity={hasLyrWt ? 0.22 : 0.12}
                          rx="2"
                        />
                        <rect
                          x={colX}
                          y={ySatTop}
                          width={colWidth}
                          height={satH}
                          fill="url(#hatch-saturation)"
                          opacity={hasLyrWt ? 0.8 : 0.45}
                          rx="2"
                        />
                      </g>
                    );
                  })()}

                  {/* Stratum Pore Water Pressure Tag on right side of block */}
                  {(() => {
                    const uBot = computeLayerPorePressure(layers, layer.zBot, waterLevel ?? 0, 9.81);
                    const isCustom = layer.porePressureMode && layer.porePressureMode !== "hydrostatic";
                    if (blockH < 26 && !isCustom) return null;

                    return (
                      <g pointerEvents="none">
                        <rect
                          x={colX + colWidth - 84}
                          y={yTop + blockH - 18}
                          width={80}
                          height={15}
                          fill={isCustom ? "#eff6ff" : "#f8fafc"}
                          stroke={isCustom ? "#3b82f6" : "#cbd5e1"}
                          strokeWidth="1"
                          rx="2"
                        />
                        <text
                          x={colX + colWidth - 44}
                          y={yTop + blockH - 7}
                          textAnchor="middle"
                          fontSize="8"
                          fontFamily="IBM Plex Mono, monospace"
                          fontWeight={isCustom ? "700" : "500"}
                          fill={isCustom ? "#1d4ed8" : "#475569"}
                        >
                          u={uBot.toFixed(1)}kPa
                        </text>
                      </g>
                    );
                  })()}

                  {/* Stratum-specific Groundwater Table (Phreatic Surface) line */}
                  {layer.hasWaterTable && layer.waterTable !== undefined && (
                    <g pointerEvents="none">
                      {(() => {
                        const yLyrWt = getSvgY(layer.waterTable);
                        return (
                          <>
                            <line
                              x1={colX - 10}
                              y1={yLyrWt}
                              x2={colX + colWidth + 10}
                              y2={yLyrWt}
                              stroke="#0284c7"
                              strokeWidth="2.2"
                              strokeDasharray="5 3"
                            />
                            {/* Inverted triangle water table symbol */}
                            <polygon
                              points={`${colX - 8},${yLyrWt} ${colX - 1},${yLyrWt} ${colX - 4.5},${yLyrWt + 6}`}
                              fill="#0284c7"
                            />
                            <line
                              x1={colX - 8}
                              y1={yLyrWt + 8}
                              x2={colX - 1}
                              y2={yLyrWt + 8}
                              stroke="#0284c7"
                              strokeWidth="1.2"
                            />
                            {/* Layer GWL label badge */}
                            <rect
                              x={colX + 6}
                              y={yLyrWt - 15}
                              width={112}
                              height={14}
                              fill="#ffffff"
                              stroke="#0284c7"
                              strokeWidth="1"
                              rx="2"
                            />
                            <text
                              x={colX + 10}
                              y={yLyrWt - 4.5}
                              fontSize="8.5"
                              fontFamily="IBM Plex Mono, monospace"
                              fontWeight="700"
                              fill="#0369a1"
                            >
                              ▼ L#{index + 1} GWL {layer.waterTable >= 0 ? `+${layer.waterTable.toFixed(2)}` : layer.waterTable.toFixed(2)}m
                            </text>
                          </>
                        );
                      })()}
                    </g>
                  )}

                  {/* Selection / Hover Accent Glow & Pointer */}
                  {isSelected && (
                    <g pointerEvents="none">
                      {/* Pulsing Outer Neon Highlight Box */}
                      <rect
                        x={colX - 3}
                        y={yTop - 3}
                        width={colWidth + 6}
                        height={blockH + 6}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        rx="5"
                        className="profile-pulse-aura"
                      />
                      {/* Left Selection Pointer Chevron */}
                      <polygon
                        points={`${colX - 1},${yTop + blockH / 2} ${colX - 12},${yTop + blockH / 2 - 7} ${colX - 12},${yTop + blockH / 2 + 7}`}
                        fill="#0284c7"
                        filter="drop-shadow(0 0 4px rgba(2, 132, 199, 0.8))"
                      />
                    </g>
                  )}

                  {/* Block Content (Labels & Geotechnical Badges) */}
                  {blockH >= 24 && (
                    <g pointerEvents="none">
                      {/* Stratum Index Tag */}
                      <rect
                        x={colX + 8}
                        y={yTop + 7}
                        width={22}
                        height={16}
                        fill={style.badgeBg}
                        rx="2"
                      />
                      <text
                        x={colX + 19}
                        y={yTop + 19}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, monospace"
                        fill={style.badgeText}
                      >
                        {index + 1}
                      </text>

                      {/* Stratum Name */}
                      <text
                        x={colX + 35}
                        y={yTop + 19}
                        fontSize={blockH > 40 ? "11.5" : "10"}
                        fontWeight="600"
                        fontFamily="IBM Plex Sans, sans-serif"
                        fill={style.text}
                      >
                        {layer.name.length > 22 ? layer.name.slice(0, 20) + "…" : layer.name}
                      </text>

                      {/* Layer Parameters (if height allows) */}
                      {blockH >= 46 && (
                        <text
                          x={colX + 10}
                          y={yTop + 35}
                          fontSize="9.5"
                          fontFamily="IBM Plex Mono, monospace"
                          fill={style.text}
                          opacity="0.9"
                        >
                          γ={layer.gamma} | φ'={layer.phi}° | c'={layer.c} kPa
                        </text>
                      )}

                      {blockH >= 64 && (
                        <text
                          x={colX + 10}
                          y={yTop + 49}
                          fontSize="9"
                          fontFamily="IBM Plex Mono, monospace"
                          fill={style.text}
                          opacity="0.85"
                        >
                          E={Math.round(layer.E / 1000)} MPa • {layer.drainage.toUpperCase()}
                        </text>
                      )}
                    </g>
                  )}

                  {/* Thickness Callout Badge on Right of Block */}
                  <g pointerEvents="none">
                    <line
                      x1={colX + colWidth + 5}
                      y1={yTop + 2}
                      x2={colX + colWidth + 12}
                      y2={yTop + 2}
                      stroke="#8f8676"
                      strokeWidth="1"
                    />
                    <line
                      x1={colX + colWidth + 12}
                      y1={yTop + 2}
                      x2={colX + colWidth + 12}
                      y2={yBot - 2}
                      stroke="#8f8676"
                      strokeWidth="1"
                    />
                    <line
                      x1={colX + colWidth + 5}
                      y1={yBot - 2}
                      x2={colX + colWidth + 12}
                      y2={yBot - 2}
                      stroke="#8f8676"
                      strokeWidth="1"
                    />
                    <text
                      x={colX + colWidth + 16}
                      y={(yTop + yBot) / 2 + 3}
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="600"
                      fill="#5c564e"
                    >
                      t={thickness.toFixed(1)}m
                    </text>
                  </g>

                  {/* Elevation Ticks on Left Ruler */}
                  <g pointerEvents="none">
                    {/* Top Tick */}
                    <line
                      x1={rulerX - 6}
                      y1={yTop}
                      x2={rulerX + 6}
                      y2={yTop}
                      stroke="#5c564e"
                      strokeWidth="1.2"
                    />
                    <text
                      x={rulerX - 10}
                      y={yTop + 3.5}
                      textAnchor="end"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="500"
                      fill="#1c1917"
                    >
                      {layer.zTop >= 0 ? `+${layer.zTop.toFixed(1)}` : layer.zTop.toFixed(1)}m
                    </text>

                    {/* Bottom Tick */}
                    <line
                      x1={rulerX - 6}
                      y1={yBot}
                      x2={rulerX + 6}
                      y2={yBot}
                      stroke="#5c564e"
                      strokeWidth="1.2"
                    />
                    <text
                      x={rulerX - 10}
                      y={yBot + 3.5}
                      textAnchor="end"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="500"
                      fill="#1c1917"
                    >
                      {layer.zBot >= 0 ? `+${layer.zBot.toFixed(1)}` : layer.zBot.toFixed(1)}m
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Gap Warning Blocks if discontinuity exists */}
            {boundaryIssues.map((issue, idx) => {
              if (issue.type === "gap") {
                const gapY1 = getSvgY(issue.fromZ);
                const gapY2 = getSvgY(issue.toZ);
                const gapH = Math.max(8, gapY2 - gapY1);
                return (
                  <g key={`gap-${idx}`}>
                    <rect
                      x={colX}
                      y={gapY1}
                      width={colWidth}
                      height={gapH}
                      fill="#fef3c7"
                      stroke="#d97706"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      rx="2"
                    />
                    <rect
                      x={colX}
                      y={gapY1}
                      width={colWidth}
                      height={gapH}
                      fill="url(#hatch-gap)"
                      opacity="0.6"
                      rx="2"
                    />
                    <text
                      x={colX + colWidth / 2}
                      y={gapY1 + gapH / 2 + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="IBM Plex Mono, monospace"
                      fill="#b45309"
                    >
                      ⚠ GAP: {issue.delta.toFixed(2)}m (z={issue.fromZ.toFixed(1)} to {issue.toZ.toFixed(1)})
                    </text>
                  </g>
                );
              }
              return null;
            })}

            {/* Drag & Drop Visual Target Insertion Beam in SVG Column */}
            {dragOverIndex !== null && draggedIndex !== null && dragOverIndex !== draggedIndex && (
              (() => {
                const targetLayer = layers[dragOverIndex];
                if (!targetLayer) return null;
                const insertZ = dropPosition === "before" ? targetLayer.zTop : targetLayer.zBot;
                const insertY = getSvgY(insertZ);
                return (
                  <g pointerEvents="none">
                    <line
                      x1={colX - 18}
                      y1={insertY}
                      x2={colX + colWidth + 18}
                      y2={insertY}
                      stroke="#0b2545"
                      strokeWidth="3.5"
                    />
                    <circle cx={colX - 18} cy={insertY} r="4.5" fill="#0b2545" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={colX + colWidth + 18} cy={insertY} r="4.5" fill="#0b2545" stroke="#ffffff" strokeWidth="1.5" />
                    <rect
                      x={colX + colWidth / 2 - 58}
                      y={insertY - 10}
                      width="116"
                      height="20"
                      fill="#0b2545"
                      rx="3"
                    />
                    <text
                      x={colX + colWidth / 2}
                      y={insertY + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="IBM Plex Mono, monospace"
                      fill="#ffffff"
                    >
                      INSERT AT {insertZ >= 0 ? `+${insertZ.toFixed(2)}` : insertZ.toFixed(2)}m
                    </text>
                  </g>
                );
              })()
            )}

            {/* Groundwater Table (GWL) Level Line */}
            {waterLevel !== undefined && (
              <g pointerEvents="none">
                {(() => {
                  const gwlY = getSvgY(waterLevel);
                  return (
                    <>
                      <line
                        x1={colX - 25}
                        y1={gwlY}
                        x2={colX + colWidth + 25}
                        y2={gwlY}
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                      />
                      {/* Inverted triangle water symbol */}
                      <polygon
                        points={`${colX - 12},${gwlY} ${colX - 4},${gwlY} ${colX - 8},${gwlY + 7}`}
                        fill="#2563eb"
                      />
                      <line
                        x1={colX - 12}
                        y1={gwlY + 9}
                        x2={colX - 4}
                        y2={gwlY + 9}
                        stroke="#2563eb"
                        strokeWidth="1"
                      />
                      <line
                        x1={colX - 10}
                        y1={gwlY + 11}
                        x2={colX - 6}
                        y2={gwlY + 11}
                        stroke="#2563eb"
                        strokeWidth="1"
                      />
                      <rect
                        x={colX + colWidth + 5}
                        y={gwlY - 9}
                        width={65}
                        height={16}
                        fill="#dbeafe"
                        stroke="#93c5fd"
                        rx="2"
                      />
                      <text
                        x={colX + colWidth + 37}
                        y={gwlY + 2.5}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#1d4ed8"
                      >
                        GWL {waterLevel.toFixed(1)}m
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* Retaining Wall / Riverbed Level Line */}
            {riverbedLevel !== undefined && (
              <g pointerEvents="none">
                {(() => {
                  const rbY = getSvgY(riverbedLevel);
                  return (
                    <>
                      <line
                        x1={colX - 15}
                        y1={rbY}
                        x2={colX + colWidth + 15}
                        y2={rbY}
                        stroke="#78716c"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={colX - 18}
                        y={rbY + 3.5}
                        textAnchor="end"
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#78716c"
                      >
                        Dredge {riverbedLevel.toFixed(1)}m
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* Wall / Pile Toe Level Marker */}
            {toeLevel !== undefined && (
              <g pointerEvents="none">
                {(() => {
                  const toeY = getSvgY(toeLevel);
                  return (
                    <>
                      <line
                        x1={colX - 25}
                        y1={toeY}
                        x2={colX + colWidth + 25}
                        y2={toeY}
                        stroke="#b91c1c"
                        strokeWidth="2"
                        strokeDasharray="5 2.5"
                      />
                      <polygon
                        points={`${colX + colWidth + 2},${toeY - 4} ${colX + colWidth + 10},${toeY} ${colX + colWidth + 2},${toeY + 4}`}
                        fill="#b91c1c"
                      />
                      <rect
                        x={colX + colWidth + 12}
                        y={toeY - 9}
                        width={75}
                        height={16}
                        fill="#fee2e2"
                        stroke="#fca5a5"
                        rx="2"
                      />
                      <text
                        x={colX + colWidth + 49}
                        y={toeY + 2.5}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#b91c1c"
                      >
                        Toe {toeLevel.toFixed(1)}m
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* PORE WATER PRESSURE (u) PROFILE DIAGRAM */}
            {showPorePressure && (
              <g id="pore-pressure-diagram-group">
                {/* Diagram Background Card */}
                <rect
                  x={pressX}
                  y={marginY}
                  width={pressWidth + 40}
                  height={availableH - 2 * marginY}
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                  rx="4"
                />

                {/* Header Title */}
                <g pointerEvents="none">
                  <text
                    x={pressX + 12}
                    y={marginY - 12}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="IBM Plex Sans, sans-serif"
                    fill="#0369a1"
                    letterSpacing="0.04em"
                  >
                    PORE WATER PRESSURE u (kPa)
                  </text>
                  <text
                    x={pressX + pressWidth + 28}
                    y={marginY - 12}
                    textAnchor="end"
                    fontSize="8.5"
                    fontFamily="IBM Plex Mono, monospace"
                    fill="#64748b"
                  >
                    0 – {niceMaxU} kPa
                  </text>
                </g>

                {/* Vertical Grid Lines & Axis Ticks */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
                  const gridU = frac * niceMaxU;
                  const gx = uToX(gridU);
                  return (
                    <g key={`pgrid-${frac}`} pointerEvents="none">
                      <line
                        x1={gx}
                        y1={marginY}
                        x2={gx}
                        y2={availableH - marginY}
                        stroke={frac === 0 ? "#64748b" : "#e2e8f0"}
                        strokeWidth={frac === 0 ? 1.5 : 1}
                        strokeDasharray={frac === 0 ? undefined : "2 2"}
                      />
                      {/* Top Tick */}
                      <text
                        x={gx}
                        y={marginY - 2.5}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#64748b"
                        fontWeight={frac === 0 ? "700" : "500"}
                      >
                        {Math.round(gridU)}
                      </text>
                      {/* Bottom Tick */}
                      <text
                        x={gx}
                        y={availableH - marginY + 11}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#64748b"
                      >
                        {Math.round(gridU)}
                      </text>
                    </g>
                  );
                })}

                {/* Horizontal Stratum Boundary Extension Guides */}
                {layers.map((l) => {
                  const gy = getSvgY(l.zBot);
                  return (
                    <line
                      key={`pbound-${l.id}`}
                      x1={pressX}
                      y1={gy}
                      x2={pressX + pressWidth + 30}
                      y2={gy}
                      stroke="#cbd5e1"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      pointerEvents="none"
                    />
                  );
                })}

                {/* Hydrostatic Reference Curve (Dashed line) */}
                <path
                  d={hydroPathD}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.85"
                  pointerEvents="none"
                />

                {/* Active Pore Water Pressure Profile Fill and Stroke */}
                <path
                  d={pressurePathD}
                  fill="url(#pore-pressure-grad)"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  pointerEvents="none"
                />

                {/* Key Pressure Value Markers & Callout Labels */}
                {keyPoints.map((kp, kidx) => {
                  const px = uToX(kp.u);
                  const py = getSvgY(kp.z);
                  return (
                    <g key={`kpoint-${kidx}`} pointerEvents="none">
                      <circle
                        cx={px}
                        cy={py}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#0284c7"
                        strokeWidth="2"
                      />
                      <rect
                        x={px + 6}
                        y={py - 7}
                        width={46}
                        height={14}
                        fill="#ffffff"
                        stroke="#bae6fd"
                        strokeWidth="0.9"
                        rx="2"
                      />
                      <text
                        x={px + 29}
                        y={py + 3.5}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="700"
                        fill="#0369a1"
                      >
                        {kp.u.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Stratum Pore Pressure Mode Badges */}
                {layers.map((l) => {
                  if (!l.porePressureMode || l.porePressureMode === "hydrostatic") return null;
                  const midY = getSvgY((l.zTop + l.zBot) / 2);
                  const modeLabel =
                    l.porePressureMode === "user-defined"
                      ? "User u"
                      : l.porePressureMode === "ru"
                        ? `ru=${l.ru ?? 0}`
                        : l.porePressureMode === "piezometric"
                          ? `hp=${l.piezometricHead}m`
                          : "Zero / Dry";

                  return (
                    <g key={`pmode-${l.id}`} pointerEvents="none">
                      <rect
                        x={pressX + pressWidth - 48}
                        y={midY - 8}
                        width={74}
                        height={16}
                        fill="#eff6ff"
                        stroke="#60a5fa"
                        strokeWidth="1"
                        rx="3"
                      />
                      <text
                        x={pressX + pressWidth - 11}
                        y={midY + 3.5}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="700"
                        fill="#1d4ed8"
                      >
                        {modeLabel}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Interactive Crosshair Depth Guide Line */}
            {cursorHoverZ !== null && (
              <g pointerEvents="none">
                {(() => {
                  const guideY = getSvgY(cursorHoverZ);
                  return (
                    <>
                      <line
                        x1={rulerX - 25}
                        y1={guideY}
                        x2={showPorePressure ? pressX + pressWidth + 35 : colX + colWidth + 25}
                        y2={guideY}
                        stroke="#0284c7"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                      />
                      <circle cx={rulerX} cy={guideY} r="3" fill="#0284c7" />
                      {showPorePressure && (
                        <circle
                          cx={uToX(computeLayerPorePressure(layers, cursorHoverZ, waterLevel ?? 0, 9.81))}
                          cy={guideY}
                          r="4"
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      )}
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Interactive Depth & Stress HUD Readout */}
          {cursorInfo ? (
            <div className="mt-2 w-full max-w-[660px] px-3 py-2 rounded bg-sky-50 border border-sky-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-navy">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sky-800">
                  z = {cursorInfo.z >= 0 ? `+${cursorInfo.z.toFixed(2)}` : cursorInfo.z.toFixed(2)}m
                </span>
                <span className="text-muted">(Depth d = {cursorInfo.depth.toFixed(2)}m)</span>
                <span className="px-1.5 py-0.5 rounded bg-white border border-sky-300 text-[11px] font-sans font-medium text-ink">
                  {cursorInfo.layerName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>
                  u: <strong className="text-sky-700">{cursorInfo.u.toFixed(1)} kPa</strong>
                </span>
                <span>
                  σv: <strong className="text-ink">{cursorInfo.sigmaV.toFixed(1)} kPa</strong>
                </span>
                <span>
                  σ'v: <strong className="text-emerald-700">{cursorInfo.sigmaVEff.toFixed(1)} kPa</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-center text-[11px] text-muted font-mono">
              Hover across diagram to inspect continuous depth, pore water pressure (u), and vertical stresses (σv, σ'v)
            </div>
          )}
        </div>

        {/* Interactive Strata Inspector & Legend Sidebar */}
        <div className="flex-1 min-w-[280px] w-full space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-rule pb-2 gap-2 flex-wrap">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy flex items-center gap-1.5 font-display">
              <Ruler className="size-3.5" />
              <span>Strata Hierarchy & Legend</span>
            </h4>
            <div className="flex items-center gap-2">
              {/* Compact Mode Toggle */}
              <button
                type="button"
                id="toggle-compact-strata-list"
                onClick={handleToggleCompact}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer border select-none ${
                  isCompact
                    ? "bg-navy text-paper border-navy shadow-xs font-semibold"
                    : "bg-paper-2 text-navy border-rule hover:bg-paper-3 hover:border-rule-strong"
                }`}
                title={
                  isCompact
                    ? "Compact view active: optional pore pressure and groundwater settings are hidden for a clean stratigraphy sequence overview. Click to expand."
                    : "Switch to Compact view: hide optional pore pressure and groundwater settings for a cleaner stratigraphy sequence overview."
                }
              >
                <Minimize2 className="size-3" />
                <span>Compact</span>
                <span
                  className={`size-1.5 rounded-full ${
                    isCompact ? "bg-accent shadow-[0_0_4px_currentColor]" : "bg-muted"
                  }`}
                />
              </button>

              <span className="text-[11px] font-mono text-muted hidden sm:inline">
                {onReorderLayer ? "Drag to reorder" : "Click to highlight"}
              </span>
            </div>
          </div>

          {/* Drag & drop instructions banner + auto-cascade z-elevation toggle */}
          {onReorderLayer && (
            <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-paper-2 border border-rule text-xs">
              <div className="flex items-center gap-1.5 text-muted">
                <GripVertical className="size-3.5 text-navy shrink-0" />
                <span className="text-[11px] font-medium text-navy">Drag & drop cards to reorder</span>
              </div>
              <label
                className="flex items-center gap-1.5 text-[11px] cursor-pointer text-navy font-mono font-medium hover:text-ink select-none"
                title="Automatically cascades elevations downward from ground level, preserving each stratum's exact thickness Δz"
              >
                <input
                  type="checkbox"
                  checked={autoCascadeElevations}
                  onChange={(e) => setAutoCascadeElevations(e.target.checked)}
                  className="size-3.5 rounded border-rule text-navy focus:ring-0 cursor-pointer"
                />
                <span>Auto-cascade z</span>
              </label>
            </div>
          )}

          {/* List of Stratum cards corresponding to the stacked blocks */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {isFilterActive && (
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-paper-2 rounded border border-rule text-xs mb-2">
                <span className="text-muted text-[11px] font-mono">
                  Showing {layers.filter(isLayerMatching).length} of {layers.length} strata
                </span>
                <span className="text-[10px] text-navy font-semibold uppercase tracking-wider">
                  Filter Active
                </span>
              </div>
            )}
            {layers.filter(isLayerMatching).length === 0 ? (
              <div className="py-6 text-center bg-paper-2 rounded border border-rule text-xs text-muted">
                No strata cards match your filter criteria.
              </div>
            ) : (
              layers
                .map((layer, index) => ({ layer, index }))
                .filter(({ layer }) => !isFilterActive || isLayerMatching(layer))
                .map(({ layer, index }) => {
                  const isSelected = selectedId === layer.id;
                  const isHovered = activeHoverId === layer.id;
                  const thickness = layer.zTop - layer.zBot;
                  const isBeingDragged = draggedIndex === index;
                  const isDropTarget = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

              return (
                <div
                  key={layer.id}
                  draggable={!!onReorderLayer}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index.toString());
                    e.dataTransfer.effectAllowed = "move";
                    setDraggedIndex(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (draggedIndex === null || draggedIndex === index) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relY = e.clientY - rect.top;
                    const pos = relY < rect.height / 2 ? "before" : "after";
                    if (dragOverIndex !== index || dropPosition !== pos) {
                      setDragOverIndex(index);
                      setDropPosition(pos);
                    }
                  }}
                  onDragLeave={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (
                      e.clientX < rect.left ||
                      e.clientX >= rect.right ||
                      e.clientY < rect.top ||
                      e.clientY >= rect.bottom
                    ) {
                      if (dragOverIndex === index) {
                        setDragOverIndex(null);
                        setDropPosition(null);
                      }
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    handleDropOnIndex(index, dropPosition || "after");
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                    setDropPosition(null);
                  }}
                  onClick={() => onSelectId?.(layer.id)}
                  onMouseEnter={() => {
                    setInternalHoverId(layer.id);
                    onHoverId?.(layer.id);
                  }}
                  onMouseLeave={() => {
                    setInternalHoverId(null);
                    onHoverId?.(null);
                  }}
                  className={`relative ${isCompact ? "p-2.5" : "p-3"} rounded-sm border transition text-xs select-none ${
                    isBeingDragged
                      ? "opacity-35 border-dashed border-accent bg-paper-2 scale-[0.98] cursor-grabbing"
                      : isSelected
                        ? "bg-paper-2 border-navy ring-1 ring-navy cursor-pointer"
                        : isHovered
                          ? "bg-paper-2 border-rule-strong cursor-pointer"
                          : "bg-panel border-rule hover:border-rule-strong cursor-pointer"
                  }`}
                >
                  {/* Drop Target Insertion Indicator Line */}
                  {isDropTarget && (
                    <div
                      className={`absolute left-0 right-0 z-30 pointer-events-none flex items-center ${
                        dropPosition === "before" ? "-top-1.5" : "-bottom-1.5"
                      }`}
                    >
                      <div className="size-2.5 rounded-full bg-navy ring-2 ring-panel shrink-0 -ml-1 shadow-sm" />
                      <div className="h-1 flex-1 bg-navy shadow-sm" />
                      <div className="size-2.5 rounded-full bg-navy ring-2 ring-panel shrink-0 -mr-1 shadow-sm" />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Drag Handle Grip Icon */}
                      {onReorderLayer && (
                        <div
                          className="p-1 -ml-1.5 text-muted hover:text-navy cursor-grab active:cursor-grabbing rounded hover:bg-paper-2 shrink-0 transition-colors"
                          title="Click & drag to reorder stratigraphy sequence"
                        >
                          <GripVertical className="size-3.5" />
                        </div>
                      )}
                      {/* Representative Soil Texture Icon */}
                      <SoilTextureIcon layerOrType={layer} size="xs" />
                      <span className="font-semibold text-navy">
                        #{index + 1} · {layer.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCompact && (layer.hasWaterTable || (layer.porePressureMode && layer.porePressureMode !== "hydrostatic")) && (
                        <div className="flex items-center gap-1">
                          {layer.hasWaterTable && (
                            <span title={`Stratum has perched GWL at ${layer.waterTable ?? 0}m`}>
                              <Droplets className="size-3 text-sky-600" />
                            </span>
                          )}
                          {layer.porePressureMode && layer.porePressureMode !== "hydrostatic" && (
                            <span title={`Stratum has custom pore pressure mode: ${layer.porePressureMode}`}>
                              <Waves className="size-3 text-indigo-600" />
                            </span>
                          )}
                        </div>
                      )}
                      <span className="font-mono text-[11px] text-muted">
                        Δz = {thickness.toFixed(2)} m
                      </span>
                    </div>
                  </div>

                  {isCompact ? (
                    <div className="mt-1.5 flex items-center justify-between gap-x-2 gap-y-0.5 font-mono text-[11px] text-muted flex-wrap">
                      <span>z: <span className="text-ink font-medium">{layer.zTop.toFixed(2)} to {layer.zBot.toFixed(2)}m</span></span>
                      <span>γ: <span className="text-ink">{layer.gamma}/{layer.gammaSat}</span></span>
                      <span>φ': <span className="text-ink">{layer.phi}°</span>{layer.c ? ` · c': ${layer.c}k` : ""}</span>
                      <span>E: <span className="text-ink">{(layer.E / 1000).toFixed(0)}MPa</span></span>
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-muted">
                      <div>
                        Elevations: <span className="text-ink">{layer.zTop.toFixed(2)} to {layer.zBot.toFixed(2)}m</span>
                      </div>
                      <div>
                        Unit weight: <span className="text-ink">{layer.gamma} / {layer.gammaSat} kN/m³</span>
                      </div>
                      <div>
                        Shear: <span className="text-ink">φ'={layer.phi}° {layer.c ? `· c'=${layer.c}kPa` : ""}</span>
                      </div>
                      <div>
                        Stiffness: <span className="text-ink">E={(layer.E / 1000).toFixed(0)} MPa</span>
                      </div>
                    </div>
                  )}

                  {/* Stratum Groundwater Table & Pore Pressure Parameters (hidden in Compact mode) */}
                  {!isCompact && (
                    <div className="mt-2 pt-2 border-t border-rule/50 space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      {/* Groundwater Table Badge */}
                      {layer.hasWaterTable && layer.waterTable !== undefined ? (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-semibold"
                          title="Perched or stratum-specific groundwater table"
                        >
                          <Droplets className="size-3 text-sky-600" />
                          GWL: {layer.waterTable >= 0 ? `+${layer.waterTable.toFixed(2)}` : layer.waterTable.toFixed(2)}m (perched)
                        </span>
                      ) : waterLevel !== undefined ? (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper-2 text-muted font-mono text-[10px]"
                          title="Uses global phreatic surface"
                        >
                          <Droplets className="size-3 text-blue-500" />
                          Global GWL: {waterLevel >= 0 ? `+${waterLevel.toFixed(1)}` : waterLevel.toFixed(1)}m
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper-2 text-muted font-mono text-[10px]">
                          Dry / No GWL
                        </span>
                      )}

                      {/* Pore Water Pressure Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] font-medium ${
                          layer.porePressureMode && layer.porePressureMode !== "hydrostatic"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-paper-2 text-muted"
                        }`}
                        title="Pore water pressure at stratum base"
                      >
                        <Waves className="size-3 text-indigo-500" />
                        u: {computeLayerPorePressure(layers, layer.zBot, waterLevel ?? 0, 9.81).toFixed(1)} kPa
                        {layer.porePressureMode && layer.porePressureMode !== "hydrostatic" && ` (${layer.porePressureMode})`}
                      </span>

                      {/* Expand / Collapse Parameter Controls Button */}
                      {onUpdateLayer && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedHydroId(expandedHydroId === layer.id ? null : layer.id);
                          }}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                            expandedHydroId === layer.id
                              ? "bg-navy text-paper"
                              : "bg-paper-2 text-navy hover:bg-paper-3"
                          }`}
                          title="Edit groundwater table and pore pressure parameters for this stratum"
                        >
                          <Sliders className="size-3" />
                          <span>Hydro/u</span>
                          {expandedHydroId === layer.id ? (
                            <ChevronUp className="size-3" />
                          ) : (
                            <ChevronDown className="size-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Expandable Parameter Editor */}
                    {expandedHydroId === layer.id && onUpdateLayer && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded bg-sky-50/70 border border-sky-200 text-xs space-y-2 mt-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-navy flex items-center gap-1 text-[11px]">
                            <Droplets className="size-3 text-sky-600" />
                            Groundwater & Pore Pressure Controls
                          </span>
                          <span className="text-[10px] text-muted font-mono">
                            Stratum #{index + 1} ({layer.zTop.toFixed(1)} to {layer.zBot.toFixed(1)}m)
                          </span>
                        </div>

                        {/* Stratum-specific Water Table Toggle & Elevation */}
                        <div className="bg-panel p-2 rounded border border-rule space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[11px] font-medium text-navy cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!layer.hasWaterTable}
                              onChange={(e) => {
                                const enabled = e.target.checked;
                                onUpdateLayer(index, {
                                  hasWaterTable: enabled,
                                  waterTable: enabled ? (layer.waterTable ?? Number(((layer.zTop + layer.zBot) / 2).toFixed(2))) : undefined,
                                });
                              }}
                              className="size-3.5 rounded border-rule text-navy cursor-pointer"
                            />
                            <span>Define stratum-specific groundwater table (perched/aquifer)</span>
                          </label>

                          {layer.hasWaterTable && (
                            <div className="pl-5 pt-1 flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] text-muted">GWL elevation:</span>
                              <input
                                type="number"
                                step={0.1}
                                value={layer.waterTable ?? layer.zTop}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    onUpdateLayer(index, { waterTable: val });
                                  }
                                }}
                                className="w-20 px-1.5 py-0.5 text-xs font-mono rounded border border-rule bg-paper text-ink"
                              />
                              <span className="text-[11px] font-mono text-muted">m</span>

                              {/* Quick preset buttons */}
                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  type="button"
                                  onClick={() => onUpdateLayer(index, { waterTable: layer.zTop })}
                                  className="px-1.5 py-0.5 rounded bg-paper-2 text-[10px] text-navy hover:bg-sky-100"
                                  title="Set GWL to stratum top elevation"
                                >
                                  Top
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateLayer(index, { waterTable: Number(((layer.zTop + layer.zBot) / 2).toFixed(2)) })}
                                  className="px-1.5 py-0.5 rounded bg-paper-2 text-[10px] text-navy hover:bg-sky-100"
                                  title="Set GWL to stratum midpoint"
                                >
                                  Mid
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateLayer(index, { waterTable: layer.zBot })}
                                  className="px-1.5 py-0.5 rounded bg-paper-2 text-[10px] text-navy hover:bg-sky-100"
                                  title="Set GWL to stratum base elevation"
                                >
                                  Base
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pore Water Pressure Mode Selection */}
                        <div className="bg-panel p-2 rounded border border-rule space-y-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] font-medium text-navy flex items-center gap-1">
                              <Waves className="size-3 text-indigo-500" />
                              Pore Water Pressure Mode:
                            </span>
                            <select
                              value={layer.porePressureMode ?? "hydrostatic"}
                              onChange={(e) => {
                                const mode = e.target.value as PorePressureMode;
                                onUpdateLayer(index, {
                                  porePressureMode: mode,
                                  porePressure: mode === "user-defined" ? (layer.porePressure ?? 30) : layer.porePressure,
                                  ru: mode === "ru" ? (layer.ru ?? 0.25) : layer.ru,
                                  piezometricHead: mode === "piezometric" ? (layer.piezometricHead ?? layer.zTop + 1) : layer.piezometricHead,
                                });
                              }}
                              className="text-[11px] font-medium px-2 py-0.5 rounded border border-rule bg-paper text-navy"
                            >
                              <option value="hydrostatic">Hydrostatic (γw · hw)</option>
                              <option value="piezometric">Piezometric Head hp (Artesian)</option>
                              <option value="user-defined">User-Defined Pressure u (kPa)</option>
                              <option value="ru">Pore Pressure Ratio ru (u / σv)</option>
                              <option value="zero">Zero / Drained (u = 0)</option>
                            </select>
                          </div>

                          {/* Dynamic Mode Fields */}
                          {layer.porePressureMode === "user-defined" && (
                            <div className="space-y-1.5 pt-1 text-[11px]">
                              <div className="flex items-center gap-2">
                                <span className="text-muted">Target u at base:</span>
                                <input
                                  type="number"
                                  step={5}
                                  min={0}
                                  value={layer.porePressure ?? 30}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (!isNaN(val)) onUpdateLayer(index, { porePressure: val });
                                  }}
                                  className="w-20 px-1.5 py-0.5 font-mono text-xs rounded border border-rule bg-paper text-ink"
                                />
                                <span className="font-mono text-muted">kPa</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rule/50">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted">u Top:</span>
                                  <input
                                    type="number"
                                    step={5}
                                    value={layer.porePressureTop ?? 0}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val)) onUpdateLayer(index, { porePressureTop: val });
                                    }}
                                    className="w-16 px-1.5 py-0.5 font-mono text-[11px] rounded border border-rule bg-paper text-ink"
                                  />
                                  <span className="text-muted">kPa</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted">u Bot:</span>
                                  <input
                                    type="number"
                                    step={5}
                                    value={layer.porePressureBot ?? (layer.porePressure ?? 30)}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val)) onUpdateLayer(index, { porePressureBot: val });
                                    }}
                                    className="w-16 px-1.5 py-0.5 font-mono text-[11px] rounded border border-rule bg-paper text-ink"
                                  />
                                  <span className="text-muted">kPa</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {layer.porePressureMode === "ru" && (
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="text-muted">ru ratio (0.00 – 0.60):</span>
                              <input
                                type="number"
                                step={0.05}
                                min={0}
                                max={0.8}
                                value={layer.ru ?? 0.25}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) onUpdateLayer(index, { ru: val });
                                }}
                                className="w-20 px-1.5 py-0.5 font-mono text-xs rounded border border-rule bg-paper text-ink"
                              />
                              <span className="text-muted">(= u / σv)</span>
                            </div>
                          )}

                          {layer.porePressureMode === "piezometric" && (
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="text-muted">Piezometric head hp:</span>
                              <input
                                type="number"
                                step={0.2}
                                value={layer.piezometricHead ?? layer.zTop + 1}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) onUpdateLayer(index, { piezometricHead: val });
                                }}
                                className="w-20 px-1.5 py-0.5 font-mono text-xs rounded border border-rule bg-paper text-ink"
                              />
                              <span className="font-mono text-muted">m</span>
                              <span className="text-[10px] text-indigo-700 italic font-sans">(Artesian when &gt; ground)</span>
                            </div>
                          )}

                          {(layer.porePressureMode === "hydrostatic" || !layer.porePressureMode) && (
                            <div className="text-[11px] text-muted flex items-center justify-between pt-0.5">
                              <span>Hydrostatic gradient (γw = 9.81 kN/m³):</span>
                              <span className="font-mono font-medium text-ink">
                                Top: {computeLayerPorePressure(layers, layer.zTop, waterLevel ?? 0, 9.81).toFixed(1)} kPa · Base: {computeLayerPorePressure(layers, layer.zBot, waterLevel ?? 0, 9.81).toFixed(1)} kPa
                              </span>
                            </div>
                          )}

                          {layer.porePressureMode === "zero" && (
                            <div className="text-[11px] text-muted italic">
                              Zero pore water pressure assumed throughout this stratum (dry, drained, or negative pore suction neglected).
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Reorder and Quick Edit Bar */}
                  {(onReorderLayer || onRemoveLayer) && (
                    <div className={`${isCompact ? "mt-1.5 pt-1.5" : "mt-2 pt-2"} border-t border-rule/50 flex items-center justify-between text-[11px]`}>
                      <div className="flex items-center gap-1">
                        {onReorderLayer && (
                          <>
                            <button
                              type="button"
                              title="Move stratum up"
                              disabled={index === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReorderLayer(index, index - 1, autoCascadeElevations);
                              }}
                              className="p-1 text-muted hover:text-navy disabled:opacity-30"
                            >
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Move stratum down"
                              disabled={index === layers.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReorderLayer(index, index + 1, autoCascadeElevations);
                              }}
                              className="p-1 text-muted hover:text-navy disabled:opacity-30"
                            >
                              <ArrowDown className="size-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {onRemoveLayer && (
                        <button
                          type="button"
                          title="Remove stratum"
                          disabled={layers.length <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveLayer(index);
                          }}
                          className="text-fail hover:underline disabled:opacity-30 inline-flex items-center gap-1"
                        >
                          <Trash2 className="size-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          </div>

          {/* Preset Archetypes Quick-Apply Bar */}
          {onApplyPreset && (
            <div className="pt-2 border-t border-rule space-y-1.5">
              <span className="text-[11px] font-semibold text-navy uppercase tracking-wider block font-display">
                Quick Stratum Archetype Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SOIL_ARCHETYPES.map((arch) => (
                  <button
                    key={arch.key}
                    type="button"
                    onClick={() => onApplyPreset(arch.key)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-rule bg-panel text-[11px] font-medium text-navy hover:bg-paper-2 transition cursor-pointer"
                  >
                    <SoilTextureIcon layerOrType={arch} size="xs" />
                    <span>+ {arch.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
