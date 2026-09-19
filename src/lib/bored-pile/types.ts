export interface SoilLayerInput {
  id: string;
  name: string;
  type: "fill" | "clay" | "sand" | "stiff-clay" | "dense-sand";
  topDepth: number;
  bottomDepth: number;
  gamma: number; // kN/m3 (total/sat unit weight)
  phi: number; // degrees (friction angle)
  c: number; // kPa (cohesion)
  cu: number; // kPa (undrained shear strength)
  sptN?: number; // SPT N-value
  method: "alpha" | "beta" | "empirical";
}

export interface BoredPileProject {
  projectName: string;
  projectNumber: string;
  client: string;
  designer: string;
  groundLevel: number; // m
  waterLevel: number; // m below GL
  diameter: number; // mm
  length: number; // m
  concreteGrade: string; // e.g. C30/37
  steelGrade: string; // e.g. B500B
  fck: number; // MPa (20, 25, 30, 35, 40, 50)
  fyk: number; // MPa (500)
  cover: number; // mm
  nEd: number; // kN (Design axial compression load)
  mEd: number; // kNm (Design bending moment)
  layers: SoilLayerInput[];
  numBars: number;
  barDiameter: number; // mm
}

export interface LayerResistanceResult {
  layerId: string;
  name: string;
  thickness: number;
  effectiveLength: number;
  unitResistance: number; // kPa
  shaftResistance: number; // kN
  methodUsed: string;
}

export interface BoredPileAnalysisResult {
  pileArea: number; // m2
  pilePerimeter: number; // m
  layers: LayerResistanceResult[];
  totalShaftResistance: number; // kN (R_sk)
  baseUnitResistance: number; // kPa (q_b)
  baseResistance: number; // kN (R_bk)
  totalCharacteristicResistance: number; // kN (R_c,k)
  designResistance: number; // kN (R_c,d with partial factor gamma_t = 1.3 or 1.4)
  utilizationGeotechnical: number; // ratio
  settlementElastic: number; // mm
  settlementSoil: number; // mm
  settlementTotal: number; // mm
  allowableSettlement: number; // mm
  grossArea: number; // mm2
  rebarArea: number; // mm2
  reinforcementRatio: number; // %
  structuralAxialResistance: number; // kN (N_Rd)
  utilizationStructural: number; // ratio
  overallStatus: "PASS" | "FAIL" | "WARNING";
}
