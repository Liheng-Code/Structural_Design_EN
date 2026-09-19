export type PileCapCheckStatus = "PASS" | "FAIL" | "WARNING" | "NOT VERIFIED";

export interface PileCapCheck {
  id: string;
  name: string;
  category: "Geometry" | "ULS" | "SLS" | "Durability";
  demand: number;
  demandUnit: string;
  resistance: number;
  resistanceUnit: string;
  utilization: number;
  status: PileCapCheckStatus;
  clause: string;
}

export interface PileCapProject {
  projectName: string;
  projectNumber: string;
  client: string;
  designer: string;

  concreteGrade: string;
  steelGrade: string;
  fck: number; // MPa
  fyk: number; // MPa
  gammaC: number;
  gammaS: number;
  alphaCC: number; // UK NA

  exposureClass: string;
  designLife: number; // years
  cNom: number; // mm nominal cover
  wMax: number; // mm crack limit

  columnLengthX: number; // mm, along the line of piles
  columnWidthY: number; // mm
  nEd: number; // kN factored axial
  mEd: number; // kNm in the plane of the piles
  hEd: number; // kN horizontal acting at cap top

  pileDiameter: number; // mm
  pileSpacing: number; // mm centre-to-centre

  capLength: number; // mm (along pile line)
  capWidth: number; // mm
  capDepth: number; // mm overall

  tieBarDiameter: number; // mm
  tieBarCount: number;
  tieBandWidth: number; // mm concentrated band

  topMesh: string;

  nQp: number; // kN quasi-permanent axial
  mQp: number; // kNm quasi-permanent moment
}

export interface PileCapAnalysisResult {
  fcd: number; // MPa
  fyd: number; // MPa
  fctm: number; // MPa
  fctk005: number; // MPa
  nu1: number; // strut efficiency nu1 = 0.6(1-fck/250)
  ecm: number; // MPa

  effectiveDepth: number; // mm
  strutAngleDeg: number; // degrees
  strutAngleOK: boolean;

  capSelfWeight: number; // kN characteristic
  totalN: number; // kN design total at cap base
  totalM: number; // kNm design total
  reactionHigh: number; // kN
  reactionLow: number; // kN
  hasUplift: boolean;

  tieForce: number; // kN F_td
  strutForce: number; // kN C
  asRequired: number; // mm2
  asProvided: number; // mm2
  rebarRatio: number; // %

  strutStressEd: number; // MPa
  strutStressRd: number; // MPa
  nodeColStressEd: number; // MPa
  nodeColStressRd: number; // MPa
  nodePileStressEd: number; // MPa
  nodePileStressRd: number; // MPa

  vRdc: number; // MPa basic punching/beam shear resistance
  vRdmax: number; // MPa crushing limit
  beamShearEd: number; // kN V_Ed wide beam
  beamShearRd: number; // kN (enhanced)
  colPunchEd: number; // MPa v_Ed at 2d perimeter column
  colPunchRd: number; // MPa
  pilePunchEd: number; // MPa v_Ed at 2d perimeter pile
  pilePunchRd: number; // MPa

  asMin: number; // mm2
  sigmaSqp: number; // MPa at quasi-permanent
  crackWidth: number; // mm
  crackLimit: number; // mm
  srmax: number; // mm

  anchorageLength: number; // mm lbd basic
  lengthPastPile: number; // mm available straight anchorage past pile face

  checks: PileCapCheck[];
  utilizationMax: number;
  governingName: string;
  overallStatus: PileCapCheckStatus;
}

export const defaultPileCapProject = (): PileCapProject => ({
  projectName: "Demonstration Building Foundation",
  projectNumber: "PC-2026-STM",
  client: "Structural & Geotechnical Consultants Ltd",
  designer: "Lead Structural Engineer",

  concreteGrade: "C30/37",
  steelGrade: "B500C",
  fck: 30,
  fyk: 500,
  gammaC: 1.5,
  gammaS: 1.15,
  alphaCC: 0.85,

  exposureClass: "XC2",
  designLife: 50,
  cNom: 40,
  wMax: 0.3,

  columnLengthX: 600,
  columnWidthY: 400,
  nEd: 2400,
  mEd: 250,
  hEd: 80,

  pileDiameter: 800,
  pileSpacing: 2400,

  capLength: 3500,
  capWidth: 1100,
  capDepth: 1400,

  tieBarDiameter: 25,
  tieBarCount: 7,
  tieBandWidth: 800,

  topMesh: "Ø12 @ 200 B (nominal mesh)",

  nQp: 1800,
  mQp: 120,
});