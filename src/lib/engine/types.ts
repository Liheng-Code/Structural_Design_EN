export type DesignType =
  | "single-cantilever"
  | "single-anchored"
  | "double-sheet"
  | "u-shape-core"
  | "u-shape-ties"
  | "u-shape-flood"
  | "custom";

export type EarthMethod = "rankine" | "coulomb" | "user-ka" | "at-rest";

export type StructuralModel =
  | "cantilever"
  | "anchored-beam"
  | "multi-anchor"
  | "winkler"
  | "user-mv";

export type DesignApproach = "DA1" | "DA2" | "DA3";

export type DesignSituation =
  | "permanent"
  | "temporary"
  | "construction"
  | "flood"
  | "extreme"
  | "accidental"
  | "seismic";

export type TrafficModel = "uniform" | "vehicle" | "strip" | "user" | "combined";

export type Status = "PASS" | "WARNING" | "FAIL" | "INPUT REQUIRED" | "NOT VERIFIED" | "N/A";

export type SourceTag =
  | "USER INPUT"
  | "ASSUMPTION"
  | "DERIVED VALUE"
  | "CODE PARAMETER"
  | "NATIONAL PARAMETER"
  | "CALCULATED RESULT"
  | "ENGINEERING JUDGEMENT";

export type Drainage = "drained" | "undrained";

export type RetainingWallSystem = "sheet-pile" | "cbp";

export interface SoilLayer {
  id: string;
  name: string;
  description: string;
  zTop: number;
  zBot: number;
  gamma: number;
  gammaSat: number;
  phi: number;
  c: number;
  cu: number;
  E: number;
  nu: number;
  kPerm: number;
  OCR: number;
  sptN: number;
  drainage: Drainage;
  soilType: string;
}

export interface TieRod {
  id: string;
  name: string;
  elevation: number;
  diameter: number;
  spacing: number;
  fy: number;
  fu: number;
  corrosion: number;
  threadEff: number;
  connectionEff: number;
  inclination: number;
  enabled: boolean;
}

export interface LoadCaseDef {
  id: string;
  name: string;
  situation: DesignSituation;
  waterMode: "dry" | "flood" | "flood-up" | "flood-down" | "max-diff" | "rapid-drawdown" | "custom";
  trafficOn: boolean;
  constructionOn: boolean;
  accidentalTieFail: boolean;
  oneSidedExcavation: boolean;
  customUp?: number;
  customDown?: number;
  customCore?: number;
  enabled: boolean;
}

export interface ConstructionStage {
  id: string;
  name: string;
  description: string;
  tiesInstalled: number;
  fillPlaced: boolean;
  cappingPlaced: boolean;
  roadPlaced: boolean;
  trafficOn: boolean;
  waterMode: LoadCaseDef["waterMode"];
  enabled: boolean;
}

export interface Project {
  meta: {
    projectName: string;
    structure: string;
    option: string;
    revision: string;
    preparedBy: string;
    checkedBy: string;
    date: string;
    status: string;
    notes: string;
  };
  designType: DesignType;
  wallSystem: RetainingWallSystem;
  codes: {
    nationalAnnex: string;
    edition: string;
    designApproach: DesignApproach;
    designLife: number;
    consequenceClass: string;
    reliabilityClass: string;
    executionClass: string;
    seismic: boolean;
    includeEn1998: boolean;
  };
  geometry: {
    retainedHeight: number;
    embedment: number;
    roadWidth: number;
    totalWidth: number;
    wallThickness: number;
    riverbed: number;
    wallSpacing: number;
    autoEmbedment: boolean;
    dMin: number;
    dMax: number;
    dStep: number;
  };
  capping: {
    enabled: boolean;
    b: number;
    h: number;
    cover: number;
    fck: number;
    asTop: number;
    asBot: number;
  };
  pavement: {
    asphalt: number;
    gammaAsphalt: number;
    subbase: number;
    gammaSubbase: number;
  };
  sheetPile: {
    fcu: number;
    fck: number;
    fyk: number;
    cover: number;
    deltaCdev: number;
    asMainEachFace: number;
    asDist: number;
    barDia: number;
    barSpacing: number;
    Ioverride: number | null;
    Aoverride: number | null;
    sectionName: string;
    EcmOverride: number | null;
    IeffFactor: number;
    nh: number;
    khUser: number | null;
  };
  cbp: {
    diameter: number;
    spacing: number;
    pileLength: number;
    fck: number;
    fyk: number;
    cover: number;
    barDiameter: number;
    barCount: number;
    stirrupDiameter: number;
    clearGap: number;
    waterCutoff: "none" | "grout" | "cutoff-wall";
    lateralModel: "individual-pile" | "equivalent-wall";
    nh: number;
    khUser: number | null;
  };
  coreFill: {
    name: string;
    gamma: number;
    gammaSat: number;
    phi: number;
    c: number;
    compaction: number;
    permeability: number;
    drained: boolean;
  };
  nativeLayers: SoilLayer[];
  water: {
    gammaW: number;
    dryUp: number;
    dryDown: number;
    floodUp: number;
    floodDown: number;
    coreDry: number;
    coreFlood: number;
    gwlNative: number;
  };
  traffic: {
    model: TrafficModel;
    q: number;
    axleLoad: number;
    nAxles: number;
    axleSpacing: number;
    wheelSpacing: number;
    footprintB: number;
    footprintL: number;
    DAF: number;
    distWidth: number;
    offsetFromWall: number;
    plantLoad: number;
    craneLoad: number;
    stockpile: number;
  };
  ties: TieRod[];
  earth: {
    method: EarthMethod;
    userKa: number;
    userKp: number;
    wallFriction: number;
    backfillSlope: number;
    passiveReduction: number;
    assumeHorizontal: boolean;
    assumeDrained: boolean;
    assumeNoCohesion: boolean;
    assumeHydrostatic: boolean;
    assumeNoScour: boolean;
    assumePassiveMobilised: boolean;
    useK0IfRestrained: boolean;
  };
  factors: {
    source: "recommended" | "national-annex" | "user";
    gammaG: number;
    gammaQ: number;
    gammaGinf: number;
    gammaPhi: number;
    gammaC: number;
    gammaCu: number;
    gammaGamma: number;
    gammaW: number;
    gammaCconc: number;
    gammaS: number;
    alphaCc: number;
    psi0: number;
    psi1: number;
    psi2: number;
  };
  limits: {
    etaPass: number;
    etaWarn: number;
    deflAbs: number;
    deflSpanRatio: number;
    wkLimit: number;
    iAllow: number;
    exposure: string;
    crackForWaterRetaining: boolean;
  };
  structuralModel: StructuralModel;
  loadCases: LoadCaseDef[];
  stages: ConstructionStage[];
  assumptions: Record<string, boolean>;
}

export interface Station {
  z: number;
  uUp: number;
  uDown: number;
  uCore: number;
  sigVOut: number;
  sigVCore: number;
  sigEffOut: number;
  sigEffCore: number;
  pSoilOut: number;
  pSoilCore: number;
  pWaterNetL: number;
  pWaterNetR: number;
  pSur: number;
  pNetL: number;
  pNetR: number;
  pPassive: number;
  KaOut: number;
  KaCore: number;
  KpOut: number;
}

export interface TieForce {
  id: string;
  name: string;
  elevation: number;
  T_kNpm: number;
  T_kN: number;
  TRd: number;
  eta: number;
  status: Status;
}

export interface AnalysisResult {
  stations: { z: number; p: number; V: number; M: number; dmm: number }[];
  Mmax: number;
  Mmin: number;
  Vmax: number;
  dmax: number;
  zMmax: number;
  zVmax: number;
  zDmax: number;
  ties: TieForce[];
  soilReaction: number;
  EI: number;
}

export interface CheckResult {
  id: string;
  name: string;
  category: "ULS" | "SLS" | "GEO" | "HYD" | "DUR" | "CON" | "QC" | "DET";
  demand: number;
  resistance: number;
  unit: string;
  utilization: number;
  status: Status;
  explanation: string;
  formula: string;
  substitution: string;
  assumptions: string[];
  applicable: boolean;
  loadCaseId?: string;
}

export interface QCItem {
  id: string;
  name: string;
  status: Status;
  detail: string;
}

export interface VariableRow {
  symbol: string;
  description: string;
  value: string;
  unit: string;
  source: SourceTag;
}

export interface NMPoint {
  N: number;
  M: number;
}

export interface CbpInteractionResult {
  envelope: NMPoint[];
  NRd0: number;
  MRd0: number;
  balanced: NMPoint;
  operating: { NEd: number; MEd: number };
  utilization: number;
}

export interface LoadCaseResult {
  id: string;
  name: string;
  situation: DesignSituation;
  notes: string[];
  stations: Station[];
  left: AnalysisResult;
  right: AnalysisResult;
  checks: CheckResult[];
  cbp?: {
    solidRatio: number;
    lateralModel: "individual-pile" | "equivalent-wall";
    upstream: CbpInteractionResult;
    downstream: CbpInteractionResult;
  };
  forces: {
    PaL: number;
    PaR: number;
    PwL: number;
    PwR: number;
    PsL: number;
    Pp: number;
    Wfill: number;
    Wstruct: number;
    FnetGlobal: number;
    Mdst: number;
    Mstb: number;
  };
}

export interface ParametricRow {
  value: number;
  MEd: number;
  VEd: number;
  Tmax: number;
  dmax: number;
  etaMax: number;
  status: Status;
}

export interface CalcBundle {
  qc: QCItem[];
  variables: VariableRow[];
  loadCases: LoadCaseResult[];
  stageResults: LoadCaseResult[];
  summary: CheckResult[];
  governing: { name: string; eta: number; loadCase: string; status: Status } | null;
  warnings: string[];
  overall: Status;
  derived: {
    L: number;
    Binner: number;
    cnom: number;
    dEff: number;
    fcd: number;
    fyd: number;
    KaFill: number;
    KpNative: number;
    K0Fill: number;
    Ecm: number;
    Ig: number;
    gammaSubFill: number;
  };
}
