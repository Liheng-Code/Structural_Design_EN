export type WindLoadCheckStatus = "PASS" | "FAIL" | "WARNING" | "NOT VERIFIED";

export interface WindLoadCheck {
  id: string;
  name: string;
  category: "Applicability" | "Load Path" | "SLS";
  demand: number;
  demandUnit: string;
  resistance: number;
  resistanceUnit: string;
  utilization: number;
  status: WindLoadCheckStatus;
  clause: string;
}

export interface WindLoadProject {
  projectName: string;
  projectNumber: string;
  client: string;
  designer: string;

  // Site & terrain
  terrainCategory: "0" | "I" | "II" | "III" | "IV";
  siteAltitudeM: number; // m AMSL
  vbMap: number; // m/s, fundamental basic wind velocity from the NA wind map
  cDir: number; // directional factor
  cSeason: number; // season factor
  airDensity: number; // kg/m3
  turbulenceFactorKl: number;
  orographyCo: number; // co(z) override multiplier, 1.0 = flat terrain
  nationalAnnex: string;

  // Building geometry (rectangular prismatic tower, wind normal to the B face)
  buildingHeightM: number; // H
  crosswindBreadthM: number; // B (crosswind breadth, "b" in EN 1991-1-4)
  alongwindDepthM: number; // D (along-wind depth, "d" in EN 1991-1-4)

  // Dynamic properties
  naturalFreqMode: "estimate" | "given";
  naturalFreqHz: number; // used when naturalFreqMode = "given"
  dampingLogDecrement: number; // delta_s, structural damping only
  massPerHeightTPerM: number; // t/m, assumed uniform with height
  modeShapeExponent: number; // zeta, fundamental mode shape exponent (Annex B.4)

  // Serviceability / comfort
  comfortAccelLimit: number; // m/s2, peak along-wind acceleration benchmark (ISO 10137-informed)
  driftLimitDenominator: number; // along-wind drift limit = H / driftLimitDenominator
}

export interface WindLoadAnalysisResult {
  // Basic wind velocity
  z0: number; // m
  zmin: number; // m
  kr: number;
  vb: number; // m/s
  vb0: number; // m/s

  // Height mesh (z = 0 at base .. H at roof), one entry per node
  z: number[]; // m
  ze: number[]; // m, reference height per Fig 7.4
  cr: number[];
  Iv: number[];
  vm: number[]; // m/s
  qp: number[]; // kN/m2
  w: number[]; // kN/m of height (quasi-static, before cscd)
  fwDist: number[]; // kN/m of height (design force, after cscd)

  // Force coefficient
  dOverB: number;
  cf0: number;
  lOverB: number;
  lambda: number;
  psiLambda: number;
  psiR: number;
  cf: number;

  // Structural factor, Annex B
  zs: number; // m
  vmZs: number; // m/s
  IvZs: number;
  alphaTL: number;
  Lzs: number; // m
  B2: number;
  n1: number; // Hz
  fL: number;
  SL: number;
  etaH: number;
  etaB: number;
  Rh: number;
  Rb: number;
  R2: number;
  nu: number; // Hz
  kp: number;
  cscd: number;

  // Force resultants
  vBase: number; // kN
  mOverturning: number; // kNm, about foundation level

  // Along-wind dynamic response
  eiEff: number; // kN.m2
  tipDeflectionM: number; // m
  driftRatioDenominator: number; // H / tipDeflection
  driftLimitM: number; // m
  sigmaAccel: number; // m/s2, RMS
  peakAccel: number; // m/s2

  checks: WindLoadCheck[];
  utilizationMax: number;
  governingName: string;
  overallStatus: WindLoadCheckStatus;
}

export const defaultWindLoadProject = (): WindLoadProject => ({
  projectName: "Demonstration Tall Building",
  projectNumber: "WL-2026-TOWER",
  client: "Development Client Ltd",
  designer: "Lead Structural Engineer",

  terrainCategory: "II",
  siteAltitudeM: 10,
  vbMap: 24,
  cDir: 1.0,
  cSeason: 1.0,
  airDensity: 1.25,
  turbulenceFactorKl: 1.0,
  orographyCo: 1.0,
  nationalAnnex: "UK NA (provisional)",

  buildingHeightM: 100,
  crosswindBreadthM: 30,
  alongwindDepthM: 20,

  naturalFreqMode: "estimate",
  naturalFreqHz: 0.46,
  dampingLogDecrement: 0.1,
  massPerHeightTPerM: 230,
  modeShapeExponent: 1.0,

  comfortAccelLimit: 0.15,
  driftLimitDenominator: 500,
});
