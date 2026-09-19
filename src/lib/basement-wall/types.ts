export type BasementWallCheckStatus = "PASS" | "FAIL" | "WARNING" | "NOT VERIFIED";

export type BasementWallStage = "Construction" | "Permanent";

export interface BasementWallCheck {
  id: string;
  name: string;
  category: "Geometry" | "Stability" | "ULS" | "SLS" | "Durability" | "Load Path";
  stage: BasementWallStage | "Both";
  demand: number;
  demandUnit: string;
  resistance: number;
  resistanceUnit: string;
  utilization: number;
  status: BasementWallCheckStatus;
  clause: string;
}

export type BaseSupportType = "raft" | "strip footing";

export interface BasementWallProject {
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
  exposureClassBuried: string; // back (inner/retained) face
  exposureClassWater: string; // front (outer/water) face, or wet internal face
  designLife: number; // years
  cNomBuried: number; // mm
  cNomWater: number; // mm
  wMax: number; // mm crack-width limit

  // Geometry — prismatic wall spanning from base (fixed) to top prop (pinned)
  stemHeight: number; // mm, base slab top to underside of ground-floor slab (prop level)
  wallThickness: number; // mm, constant (prismatic)
  innerFaceBarDiameter: number; // mm, back/retained face — resists base hogging
  innerFaceBarSpacing: number; // mm c/c
  outerFaceBarDiameter: number; // mm, front/exposed face — resists permanent-stage span sagging
  outerFaceBarSpacing: number; // mm c/c

  // Base
  baseThickness: number; // mm, base slab thickness at wall
  baseSupportType: BaseSupportType;
  baseDowelBarDiameter: number; // mm, starter/dowel bars into base slab
  baseDowelBarSpacing: number; // mm c/c

  // Backfill (retained side)
  gammaBackfill: number; // kN/m3
  phiBackfillDeg: number; // deg
  cBackfillKpa: number; // kPa (usually 0 for granular fill)
  backfillSlopeDeg: number; // deg, 0 = horizontal
  useCoulomb: boolean;
  deltaWallFrictionDeg: number; // deg, wall friction (0 = Rankine)

  // Earth pressure basis
  usePermanentK0: boolean; // true = K0 (Jaky) for permanent stage (default); false = Ka

  // Surcharge
  constructionSurchargeKpa: number; // kPa, characteristic, construction stage only
  serviceSurchargeKpa: number; // kPa, characteristic, permanent stage
  psi2Surcharge: number; // quasi-permanent factor for service surcharge (SLS)

  // Groundwater (depth below top of wall / backfill surface; a large value means "no water")
  waterTableDepthConstruction: number; // mm, construction stage
  waterTableDepthPermanent: number; // mm, permanent stage
}

export interface StageForces {
  kUsed: number; // earth pressure coefficient actually used for this stage
  kLabel: string; // "Ka (Rankine)" | "Ka (Coulomb)" | "K0 (Jaky)"
  propReaction: number; // kN/m, horizontal reaction at top prop (0 for construction stage)
  baseMEd: number; // kNm/m, at base (hogging, back face), magnitude
  baseVEd: number; // kN/m, at base
  spanMEd: number; // kNm/m, max sagging (front face), magnitude (0 if none, e.g. construction stage)
  spanVEd: number; // kN/m, at point of max sagging
  spanDepthFromTop: number; // mm, location of max sagging moment measured from top (0 if none)
}

export interface BasementWallAnalysisResult {
  fcd: number;
  fyd: number;
  fctm: number;
  fctk005: number;
  ecm: number;

  dInner: number; // mm, effective depth to inner (back) face reinforcement
  dOuter: number; // mm, effective depth to outer (front) face reinforcement

  construction: StageForces;
  permanent: StageForces;

  // governing (worse-case between stages) design forces used for reinforcement sizing
  baseMEdGov: number; // kNm/m
  baseVEdGov: number; // kN/m
  baseGovStage: BasementWallStage;
  spanMEdGov: number; // kNm/m
  spanVEdGov: number; // kN/m

  innerAsRequired: number; // mm2/m, base hogging
  innerAsProvided: number; // mm2/m
  innerAsMin: number; // mm2/m
  innerVRdc: number; // kN/m
  outerAsRequired: number; // mm2/m, span sagging
  outerAsProvided: number; // mm2/m
  outerAsMin: number; // mm2/m
  outerVRdc: number; // kN/m

  baseDowelAnchorageRequired: number; // mm
  baseDowelAnchorageAvailable: number; // mm

  sigmaSqpInner: number; // MPa, base SLS steel stress
  crackWidthInner: number; // mm
  sigmaSqpOuter: number; // MPa, span SLS steel stress
  crackWidthOuter: number; // mm
  crackLimit: number; // mm

  checks: BasementWallCheck[];
  utilizationMax: number;
  governingName: string;
  overallStatus: BasementWallCheckStatus;
}

export const defaultBasementWallProject = (): BasementWallProject => ({
  projectName: "Demonstration Basement Retaining Wall",
  projectNumber: "BW-2026-PROP",
  client: "Building Client Ltd",
  designer: "Lead Structural Engineer",

  concreteGrade: "C30/37",
  steelGrade: "B500C",
  fck: 30,
  fyk: 500,
  gammaC: 1.5,
  gammaS: 1.15,
  alphaCC: 0.85,

  exposureClassBuried: "XC2",
  exposureClassWater: "XC3",
  designLife: 50,
  cNomBuried: 40,
  cNomWater: 50,
  wMax: 0.3,

  stemHeight: 3500,
  wallThickness: 300,
  innerFaceBarDiameter: 16,
  innerFaceBarSpacing: 150,
  outerFaceBarDiameter: 16,
  outerFaceBarSpacing: 150,

  baseThickness: 400,
  baseSupportType: "raft",
  baseDowelBarDiameter: 16,
  baseDowelBarSpacing: 150,

  gammaBackfill: 18,
  phiBackfillDeg: 32,
  cBackfillKpa: 0,
  backfillSlopeDeg: 0,
  useCoulomb: false,
  deltaWallFrictionDeg: 0,

  usePermanentK0: true,

  constructionSurchargeKpa: 10,
  serviceSurchargeKpa: 10,
  psi2Surcharge: 0.3,

  waterTableDepthConstruction: 50000,
  waterTableDepthPermanent: 0,
});
