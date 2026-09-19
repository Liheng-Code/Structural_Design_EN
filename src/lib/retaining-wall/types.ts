export type CantileverWallCheckStatus = "PASS" | "FAIL" | "WARNING" | "NOT VERIFIED";

export interface CantileverWallCheck {
  id: string;
  name: string;
  category: "Geometry" | "Stability" | "ULS" | "SLS" | "Durability";
  demand: number;
  demandUnit: string;
  resistance: number;
  resistanceUnit: string;
  utilization: number;
  status: CantileverWallCheckStatus;
  clause: string;
}

export interface CantileverWallProject {
  projectName: string;
  projectNumber: string;
  client: string;
  designer: string;

  // Materials
  concreteGrade: string;
  steelGrade: string;
  fck: number; // MPa
  fyk: number; // MPa
  gammaC: number;
  gammaS: number;
  alphaCC: number; // UK NA

  // Durability
  exposureClassExposed: string; // front stem face, weather-exposed
  exposureClassBuried: string; // back of stem, base top/bottom, buried
  designLife: number; // years
  cNomExposed: number; // mm
  cNomBuried: number; // mm
  wMax: number; // mm crack-width limit

  // Geometry — stem (back face vertical, front face may batter)
  stemHeight: number; // mm, footing top to top of stem (= backfill surface)
  stemTopThickness: number; // mm
  stemBaseThickness: number; // mm, stem thickness at footing top
  stemBarDiameter: number; // mm, main vertical bars at back face
  stemBarSpacing: number; // mm c/c

  // Geometry — base
  toeLength: number; // mm, front face of stem to toe tip
  heelLength: number; // mm, back face of stem to heel tip
  baseThickness: number; // mm
  embedmentDepth: number; // mm, front ground surface to underside of footing
  toeBarDiameter: number; // mm, main bars at underside of toe
  toeBarSpacing: number; // mm c/c
  heelBarDiameter: number; // mm, main bars at top of heel
  heelBarSpacing: number; // mm c/c

  // Shear key
  hasShearKey: boolean;
  keyWidth: number; // mm
  keyDepth: number; // mm, projection below underside of footing
  keyDistanceFromToe: number; // mm, toe tip to near face of key

  // Backfill (retained side)
  gammaBackfill: number; // kN/m3
  phiBackfillDeg: number; // deg
  cBackfillKpa: number; // kPa (usually 0 for granular fill)
  backfillSlopeDeg: number; // deg, 0 = horizontal
  useCoulomb: boolean;
  deltaWallFrictionDeg: number; // deg, wall friction on the virtual-back plane (0 = Rankine)
  surchargeKpa: number; // kPa, uniform characteristic surcharge on backfill
  psi2Surcharge: number; // quasi-permanent factor for surcharge (SLS)

  // Foundation soil (bearing, EC7 Annex D)
  gammaFoundation: number; // kN/m3
  phiFoundationDeg: number; // deg
  cFoundationKpa: number; // kPa
  baseFrictionAngleDeg: number; // deg, delta_b concrete-soil interface

  // Passive side (in front of toe)
  gammaPassive: number; // kN/m3
  phiPassiveDeg: number; // deg
  includePassiveResistance: boolean;
  passiveReductionFactor: number; // 0-1, mobilisation/disturbance allowance

  // Groundwater (depths measured from the adjacent ground surface; a large value means "no water")
  waterTableDepthBehindWall: number; // mm below backfill surface
  waterTableDepthInFront: number; // mm below front ground surface
}

export interface ComboSummary {
  label: string; // "DA1-C1" | "DA1-C2"
  kA: number;
  kP: number;
  phiBackfillD: number; // deg, design value
  phiFoundationD: number; // deg
  phiPassiveD: number; // deg
  hDesign: number; // kN/m, total factored horizontal action (full height)
  nDesign: number; // kN/m, total factored vertical action
  mOverturning: number; // kNm/m, about the toe / base line
  mStabilizing: number; // kNm/m, about the toe
  eccentricity: number; // m, |e| from base centreline
  resultantWithinMiddleThird: boolean;
  resultantWithinBase: boolean;
  toePressure: number; // kPa
  heelPressure: number; // kPa
  effectiveWidth: number; // m, B' = B - 2e
  slidingDemand: number; // kN/m
  slidingResistance: number; // kN/m
  bearingDemand: number; // kPa
  bearingResistance: number; // kPa
  stemMEd: number; // kNm/m at stem base
  stemVEd: number; // kN/m at stem base
  toeMEd: number; // kNm/m at stem front face
  toeVEd: number; // kN/m
  heelMEd: number; // kNm/m at stem back face
  heelVEd: number; // kN/m
}

export interface CantileverWallAnalysisResult {
  fcd: number;
  fyd: number;
  fctm: number;
  fctk005: number;
  ecm: number;

  totalHeight: number; // mm, H = stemHeight + baseThickness
  baseWidth: number; // mm
  stemAvgThickness: number; // mm
  dStem: number; // mm
  dToe: number; // mm
  dHeel: number; // mm

  combos: { c1: ComboSummary; c2: ComboSummary };

  // governing (worse-case between C1/C2) design forces used for reinforcement sizing
  stemMEdGov: number; // kNm/m
  stemVEdGov: number; // kN/m
  toeMEdGov: number; // kNm/m
  toeVEdGov: number; // kN/m
  heelMEdGov: number; // kNm/m
  heelVEdGov: number; // kN/m

  stemAsRequired: number; // mm2/m
  stemAsProvided: number; // mm2/m
  stemAsMin: number; // mm2/m
  stemVRdc: number; // kN/m
  toeAsRequired: number; // mm2/m
  toeAsProvided: number; // mm2/m
  toeAsMin: number; // mm2/m
  toeVRdc: number; // kN/m
  heelAsRequired: number; // mm2/m
  heelAsProvided: number; // mm2/m
  heelAsMin: number; // mm2/m
  heelVRdc: number; // kN/m

  keyMEd: number; // kNm/m
  keyVEd: number; // kN/m
  keyAsRequired: number; // mm2/m

  stemAnchorageRequired: number; // mm
  stemAnchorageAvailable: number; // mm

  sigmaSqp: number; // MPa, stem SLS steel stress
  crackWidthStem: number; // mm
  crackLimit: number; // mm

  checks: CantileverWallCheck[];
  utilizationMax: number;
  governingName: string;
  overallStatus: CantileverWallCheckStatus;
}

export const defaultCantileverWallProject = (): CantileverWallProject => ({
  projectName: "Demonstration Highway Retaining Wall",
  projectNumber: "RW-2026-CANT",
  client: "Infrastructure Client Ltd",
  designer: "Lead Structural Engineer",

  concreteGrade: "C30/37",
  steelGrade: "B500C",
  fck: 30,
  fyk: 500,
  gammaC: 1.5,
  gammaS: 1.15,
  alphaCC: 0.85,

  exposureClassExposed: "XC4",
  exposureClassBuried: "XC2",
  designLife: 50,
  cNomExposed: 40,
  cNomBuried: 50,
  wMax: 0.3,

  stemHeight: 3500,
  stemTopThickness: 250,
  stemBaseThickness: 400,
  stemBarDiameter: 20,
  stemBarSpacing: 150,

  toeLength: 900,
  heelLength: 1800,
  baseThickness: 450,
  embedmentDepth: 1000,
  toeBarDiameter: 20,
  toeBarSpacing: 150,
  heelBarDiameter: 20,
  heelBarSpacing: 150,

  hasShearKey: false,
  keyWidth: 300,
  keyDepth: 300,
  keyDistanceFromToe: 1500,

  gammaBackfill: 18,
  phiBackfillDeg: 32,
  cBackfillKpa: 0,
  backfillSlopeDeg: 0,
  useCoulomb: false,
  deltaWallFrictionDeg: 0,
  surchargeKpa: 10,
  psi2Surcharge: 0.3,

  gammaFoundation: 19,
  phiFoundationDeg: 28,
  cFoundationKpa: 0,
  baseFrictionAngleDeg: 25,

  gammaPassive: 18,
  phiPassiveDeg: 30,
  includePassiveResistance: false,
  passiveReductionFactor: 0.5,

  waterTableDepthBehindWall: 50000,
  waterTableDepthInFront: 50000,
});
