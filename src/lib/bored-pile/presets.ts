import type { SoilLayerInput } from "./types";

export interface SoilPreset {
  id: string;
  name: string;
  category: "clay" | "sand" | "rock" | "fill" | "custom";
  uscs: string;
  description: string;
  badgeColor: string;
  defaultThickness: number;
  primaryMetric: string;
  data: Omit<SoilLayerInput, "id" | "topDepth" | "bottomDepth">;
}

export const SOIL_PRESETS: SoilPreset[] = [
  {
    id: "soft-clay",
    name: "Soft Clay / Marine Silt",
    category: "clay",
    uscs: "CL / ML",
    description: "Low shear strength cohesive stratum. Characterized by undrained response.",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-700/60",
    defaultThickness: 4.0,
    primaryMetric: "cu = 25 kPa · α-method",
    data: {
      name: "Soft Clay / Marine Silt",
      type: "clay",
      behaviorType: "cohesive",
      gamma: 16.8,
      gammaSat: 17.5,
      gammaEffective: 7.7,
      phi: 0,
      c: 0,
      cu: 25,
      sptN: 4,
      cptQc: 0.8,
      e50: 6000,
      eoed: 4500,
      eur: 18000,
      nu: 0.45,
      permeability: 1e-9,
      ocr: 1.0,
      initialVoidRatio: 0.95,
      compressionIndex: 0.35,
      recompressionIndex: 0.05,
      preconsolidationStress: 50,
      k0: 0.58,
      rInter: 0.65,
      characteristicShaftFriction: 12,
      characteristicBaseResistance: 220,
      drainage: "undrained",
      method: "alpha",
    },
  },
  {
    id: "medium-clay",
    name: "Medium Stiff Clay",
    category: "clay",
    uscs: "CI / CL",
    description: "Firm alluvial or glacial clay with moderate shear strength and bearing capacity.",
    badgeColor: "bg-blue-950/80 text-blue-300 border-blue-700/60",
    defaultThickness: 4.5,
    primaryMetric: "cu = 60 kPa · α-method",
    data: {
      name: "Medium Stiff Clay",
      type: "clay",
      behaviorType: "cohesive",
      gamma: 18.2,
      gammaSat: 19.0,
      gammaEffective: 9.2,
      phi: 0,
      c: 0,
      cu: 60,
      sptN: 12,
      cptQc: 1.8,
      e50: 15000,
      eoed: 12000,
      eur: 45000,
      nu: 0.40,
      permeability: 5e-9,
      ocr: 1.5,
      initialVoidRatio: 0.75,
      compressionIndex: 0.22,
      recompressionIndex: 0.035,
      preconsolidationStress: 90,
      k0: 0.62,
      rInter: 0.70,
      characteristicShaftFriction: 28,
      characteristicBaseResistance: 540,
      drainage: "undrained",
      method: "alpha",
    },
  },
  {
    id: "stiff-clay",
    name: "Stiff Overconsolidated Clay",
    category: "clay",
    uscs: "CH",
    description: "Competent overconsolidated stratum (e.g., London Clay, Boom Clay).",
    badgeColor: "bg-sky-950/80 text-sky-300 border-sky-700/60",
    defaultThickness: 6.0,
    primaryMetric: "cu = 110 kPa · α-method",
    data: {
      name: "Stiff Overconsolidated Clay",
      type: "stiff-clay",
      behaviorType: "cohesive",
      gamma: 19.5,
      gammaSat: 20.2,
      gammaEffective: 10.4,
      phi: 0,
      c: 0,
      cu: 110,
      sptN: 26,
      cptQc: 3.2,
      e50: 25000,
      eoed: 20000,
      eur: 75000,
      nu: 0.38,
      permeability: 1e-10,
      ocr: 2.5,
      initialVoidRatio: 0.65,
      compressionIndex: 0.18,
      recompressionIndex: 0.025,
      preconsolidationStress: 220,
      k0: 0.78,
      rInter: 0.70,
      characteristicShaftFriction: 50,
      characteristicBaseResistance: 990,
      drainage: "undrained",
      method: "alpha",
    },
  },
  {
    id: "hard-clay",
    name: "Very Stiff / Hard Clay",
    category: "clay",
    uscs: "CH / Hard",
    description: "High-strength heavily overconsolidated clay or mudstone precursor.",
    badgeColor: "bg-teal-950/80 text-teal-300 border-teal-700/60",
    defaultThickness: 5.0,
    primaryMetric: "cu = 180 kPa · α-method",
    data: {
      name: "Very Stiff / Hard Clay",
      type: "stiff-clay",
      behaviorType: "cohesive",
      gamma: 20.5,
      gammaSat: 21.0,
      gammaEffective: 11.2,
      phi: 0,
      c: 0,
      cu: 180,
      sptN: 38,
      cptQc: 5.5,
      e50: 45000,
      eoed: 36000,
      eur: 135000,
      nu: 0.35,
      permeability: 1e-10,
      ocr: 3.5,
      initialVoidRatio: 0.55,
      compressionIndex: 0.14,
      recompressionIndex: 0.02,
      preconsolidationStress: 400,
      k0: 0.90,
      rInter: 0.75,
      characteristicShaftFriction: 75,
      characteristicBaseResistance: 1600,
      drainage: "undrained",
      method: "alpha",
    },
  },
  {
    id: "loose-sand",
    name: "Loose to Medium Sand",
    category: "sand",
    uscs: "SP / SM",
    description: "Fine-to-medium sand, drained behavior governed by friction angle φ'.",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-700/60",
    defaultThickness: 4.0,
    primaryMetric: "φ' = 30° · N = 10 · β-method",
    data: {
      name: "Loose to Medium Sand",
      type: "sand",
      behaviorType: "granular",
      gamma: 17.8,
      gammaSat: 18.8,
      gammaEffective: 9.0,
      phi: 30,
      c: 0,
      cu: 0,
      sptN: 10,
      cptQc: 4.0,
      e50: 18000,
      eoed: 15000,
      eur: 54000,
      nu: 0.30,
      permeability: 5e-5,
      ocr: 1.0,
      initialVoidRatio: 0.72,
      compressionIndex: 0.15,
      recompressionIndex: 0.02,
      preconsolidationStress: 80,
      k0: 0.50,
      rInter: 0.70,
      characteristicShaftFriction: 25,
      characteristicBaseResistance: 1200,
      drainage: "drained",
      method: "beta",
    },
  },
  {
    id: "medium-sand",
    name: "Medium Dense Sand",
    category: "sand",
    uscs: "SW",
    description: "Well-graded sand with good shaft friction and reliable end bearing.",
    badgeColor: "bg-yellow-950/80 text-yellow-300 border-yellow-700/60",
    defaultThickness: 5.0,
    primaryMetric: "φ' = 34° · N = 22 · β-method",
    data: {
      name: "Medium Dense Sand",
      type: "sand",
      behaviorType: "granular",
      gamma: 19.0,
      gammaSat: 20.0,
      gammaEffective: 10.2,
      phi: 34,
      c: 0,
      cu: 0,
      sptN: 22,
      cptQc: 9.0,
      e50: 35000,
      eoed: 28000,
      eur: 105000,
      nu: 0.28,
      permeability: 2e-4,
      ocr: 1.0,
      initialVoidRatio: 0.62,
      compressionIndex: 0.10,
      recompressionIndex: 0.015,
      preconsolidationStress: 120,
      k0: 0.44,
      rInter: 0.75,
      characteristicShaftFriction: 45,
      characteristicBaseResistance: 2500,
      drainage: "drained",
      method: "beta",
    },
  },
  {
    id: "dense-gravel",
    name: "Dense Sand & Gravel (Bearing Stratum)",
    category: "sand",
    uscs: "GW / SW",
    description: "High-density granular stratum, ideal founding layer for bored pile toe.",
    badgeColor: "bg-orange-950/80 text-orange-300 border-orange-700/60",
    defaultThickness: 6.0,
    primaryMetric: "φ' = 38° · N = 42 · High End Bearing",
    data: {
      name: "Dense Sand & Gravel (Bearing Stratum)",
      type: "dense-sand",
      behaviorType: "granular",
      gamma: 20.5,
      gammaSat: 21.5,
      gammaEffective: 11.7,
      phi: 38,
      c: 0,
      cu: 0,
      sptN: 42,
      cptQc: 18.0,
      e50: 60000,
      eoed: 50000,
      eur: 180000,
      nu: 0.25,
      permeability: 1e-3,
      ocr: 1.0,
      initialVoidRatio: 0.50,
      compressionIndex: 0.06,
      recompressionIndex: 0.01,
      preconsolidationStress: 180,
      k0: 0.38,
      rInter: 0.80,
      characteristicShaftFriction: 70,
      characteristicBaseResistance: 4800,
      drainage: "drained",
      method: "beta",
    },
  },
  {
    id: "weathered-rock",
    name: "Weathered Rock / Siltstone Bedrock",
    category: "rock",
    uscs: "Rock / Siltstone",
    description: "Competent weak to moderately strong rock formation with high end-bearing resistance.",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-700/60",
    defaultThickness: 7.0,
    primaryMetric: "Rock · qb,k = 5000 kPa · qs,k = 150 kPa",
    data: {
      name: "Weathered Rock / Siltstone Bedrock",
      type: "custom",
      behaviorType: "rock",
      gamma: 22.0,
      gammaSat: 23.0,
      gammaEffective: 13.2,
      phi: 40,
      c: 50,
      cu: 0,
      sptN: 60,
      cptQc: 25.0,
      e50: 120000,
      eoed: 100000,
      eur: 360000,
      nu: 0.22,
      permeability: 1e-7,
      ocr: 4.0,
      initialVoidRatio: 0.35,
      compressionIndex: 0.03,
      recompressionIndex: 0.005,
      preconsolidationStress: 800,
      k0: 0.36,
      rInter: 0.85,
      characteristicShaftFriction: 150,
      characteristicBaseResistance: 5000,
      drainage: "drained",
      method: "beta",
    },
  },
  {
    id: "made-ground",
    name: "Made Ground / Uncompacted Fill",
    category: "fill",
    uscs: "Fill",
    description: "Superficial man-made ground or topsoil; typically ignored or discounted for friction.",
    badgeColor: "bg-stone-950/80 text-stone-300 border-stone-700/60",
    defaultThickness: 2.0,
    primaryMetric: "Fill · Superficial Layer",
    data: {
      name: "Made Ground / Uncompacted Fill",
      type: "fill",
      behaviorType: "custom",
      gamma: 17.5,
      gammaSat: 18.2,
      gammaEffective: 8.4,
      phi: 26,
      c: 5,
      cu: 0,
      sptN: 6,
      cptQc: 2.0,
      e50: 12000,
      eoed: 9000,
      eur: 36000,
      nu: 0.32,
      permeability: 1e-5,
      ocr: 1.0,
      initialVoidRatio: 0.80,
      compressionIndex: 0.20,
      recompressionIndex: 0.03,
      preconsolidationStress: 40,
      k0: 0.56,
      rInter: 0.60,
      characteristicShaftFriction: 10,
      characteristicBaseResistance: 400,
      drainage: "drained",
      method: "beta",
    },
  },
];

export function createLayerFromPreset(
  preset: SoilPreset,
  layerIndex: number,
  topDepth: number,
  thickness?: number
): SoilLayerInput {
  const actualThickness = thickness && thickness > 0 ? thickness : preset.defaultThickness;
  return {
    ...preset.data,
    id: `L${layerIndex}`,
    topDepth: Math.round(topDepth * 100) / 100,
    bottomDepth: Math.round((topDepth + actualThickness) * 100) / 100,
  };
}

export interface StratumBoundaryDiagnostic {
  hasGaps: boolean;
  hasOverlaps: boolean;
  issues: Array<{
    layerIndex: number;
    layerId: string;
    type: "gap" | "overlap";
    message: string;
    delta: number;
  }>;
}

export function diagnoseStratigraphy(layers: SoilLayerInput[]): StratumBoundaryDiagnostic {
  const issues: StratumBoundaryDiagnostic["issues"] = [];
  let hasGaps = false;
  let hasOverlaps = false;

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (i === 0 && layer.topDepth > 0) {
      hasGaps = true;
      issues.push({
        layerIndex: 0,
        layerId: layer.id,
        type: "gap",
        message: `Layer ${layer.id} starts at ${layer.topDepth} m instead of Ground Level (0.0 m)`,
        delta: layer.topDepth,
      });
    }

    if (i > 0) {
      const prev = layers[i - 1];
      const diff = Math.round((layer.topDepth - prev.bottomDepth) * 100) / 100;
      if (diff > 0.01) {
        hasGaps = true;
        issues.push({
          layerIndex: i,
          layerId: layer.id,
          type: "gap",
          message: `Gap of ${diff.toFixed(2)} m between ${prev.id} (ends ${prev.bottomDepth} m) and ${layer.id} (starts ${layer.topDepth} m)`,
          delta: diff,
        });
      } else if (diff < -0.01) {
        hasOverlaps = true;
        issues.push({
          layerIndex: i,
          layerId: layer.id,
          type: "overlap",
          message: `Overlap of ${Math.abs(diff).toFixed(2)} m between ${prev.id} and ${layer.id}`,
          delta: diff,
        });
      }
    }
  }

  return { hasGaps, hasOverlaps, issues };
}

export function autoAlignStratigraphy(layers: SoilLayerInput[]): SoilLayerInput[] {
  let currentTop = 0;
  return layers.map((layer, index) => {
    const thickness = Math.max(0.5, layer.bottomDepth - layer.topDepth);
    const top = currentTop;
    const bottom = Math.round((top + thickness) * 100) / 100;
    currentTop = bottom;
    return {
      ...layer,
      id: `L${index + 1}`,
      topDepth: top,
      bottomDepth: bottom,
    };
  });
}
