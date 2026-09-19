import type { WindLoadAnalysisResult, WindLoadCheck, WindLoadCheckStatus, WindLoadProject } from "./types";
import { interp, trap, trapMoment } from "../engine/math";

const MESH_NODES = 41; // fixed 0..H mesh, fine enough for smooth profiles + accurate trap()/trapMoment() integration
const T_GUST = 600; // s, gust duration for the up-crossing/peak-factor formula (Annex B)

// EN 1991-1-4 Table 4.1 — terrain roughness (recommended values)
const TERRAIN: Record<WindLoadProject["terrainCategory"], { z0: number; zmin: number }> = {
  "0": { z0: 0.003, zmin: 1 },
  I: { z0: 0.01, zmin: 1 },
  II: { z0: 0.05, zmin: 2 },
  III: { z0: 0.3, zmin: 5 },
  IV: { z0: 1.0, zmin: 10 },
};
const Z0_II = 0.05;

// EN 1991-1-4 Fig 7.23 — cf,0 for a rectangular section vs d/b, digitized to a handful of points (approximate — check against the printed figure)
const CF0_DB = [0.1, 0.5, 1, 2, 4, 10];
const CF0_VAL = [2.35, 2.15, 2.05, 1.55, 1.25, 1.2];

// EN 1991-1-4 Table 7.16 — effective slenderness lambda vs l/b, approximate monotonic digitization (sharp-edged prismatic section)
const LAMBDA_LB = [1, 2, 5, 10, 50];
const LAMBDA_VAL = [2, 3.3, 7, 12, 25];

// EN 1991-1-4 Fig 7.36 — end-effect factor psi_lambda vs lambda at solidity phi = 1, approximate digitization
const PSILAMBDA_LAMBDA = [1, 5, 10, 50, 100];
const PSILAMBDA_VAL = [0.62, 0.72, 0.8, 0.92, 1.0];

// Annex B.4 commentary — mode-shape coefficient Kx vs mode-shape exponent zeta
const KX_ZETA = [0, 1, 1.5, 2];
const KX_VAL = [3.14, 1.5, 1.7, 2.0];

function round(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function pos(x: number, fallback: number): number {
  return Number.isFinite(x) && x > 0 ? x : fallback;
}

function nonNeg(x: number, fallback: number): number {
  return Number.isFinite(x) && x >= 0 ? x : fallback;
}

function safeRatio(demand: number, resistance: number): number {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return 1;
  if (resistance <= 0) return demand > 0 ? 999 : 0;
  return round(Math.abs(demand) / resistance, 3);
}

function passFail(demand: number, resistance: number): WindLoadCheckStatus {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return "NOT VERIFIED";
  return Math.abs(demand) > resistance ? "FAIL" : "PASS";
}

/** Non-dimensional aerodynamic admittance function R(eta), Annex B.2 — R(eta)->1 as eta->0. */
function admittance(eta: number): number {
  if (eta < 1e-6) return 1;
  return 1 / eta - (1 / (2 * eta * eta)) * (1 - Math.exp(-2 * eta));
}

export function analyzeWindLoad(project: WindLoadProject): WindLoadAnalysisResult {
  const checks: WindLoadCheck[] = [];
  const push = (
    id: string,
    name: string,
    category: WindLoadCheck["category"],
    demand: number,
    demandUnit: string,
    resistance: number,
    resistanceUnit: string,
    utilization: number,
    status: WindLoadCheckStatus,
    clause: string,
  ) => checks.push({ id, name, category, demand, demandUnit, resistance, resistanceUnit, utilization, status, clause });

  const p = {
    terrainCategory: project.terrainCategory in TERRAIN ? project.terrainCategory : "II",
    siteAltitudeM: nonNeg(project.siteAltitudeM, 10),
    vbMap: pos(project.vbMap, 24),
    cDir: pos(project.cDir, 1.0),
    cSeason: pos(project.cSeason, 1.0),
    airDensity: pos(project.airDensity, 1.25),
    turbulenceFactorKl: pos(project.turbulenceFactorKl, 1.0),
    orographyCo: pos(project.orographyCo, 1.0),
    buildingHeightM: pos(project.buildingHeightM, 100),
    crosswindBreadthM: pos(project.crosswindBreadthM, 30),
    alongwindDepthM: pos(project.alongwindDepthM, 20),
    naturalFreqMode: project.naturalFreqMode === "given" ? "given" : "estimate",
    naturalFreqHz: pos(project.naturalFreqHz, 0.46),
    dampingLogDecrement: pos(project.dampingLogDecrement, 0.1),
    massPerHeightTPerM: pos(project.massPerHeightTPerM, 230),
    modeShapeExponent: nonNeg(project.modeShapeExponent, 1.0),
    comfortAccelLimit: pos(project.comfortAccelLimit, 0.15),
    driftLimitDenominator: pos(project.driftLimitDenominator, 500),
  } as const;

  const h = p.buildingHeightM;
  const b = p.crosswindBreadthM; // crosswind breadth
  const d = p.alongwindDepthM; // along-wind depth

  // ----- Basic wind velocity, §4.2 -----
  const calt = 1 + 0.001 * p.siteAltitudeM; // simplified/PROVISIONAL altitude correction, pending NA confirmation
  const vb0 = calt * p.vbMap;
  const vb = p.cDir * p.cSeason * vb0;

  // ----- Terrain roughness, Table 4.1 -----
  const { z0, zmin } = TERRAIN[p.terrainCategory as WindLoadProject["terrainCategory"]];
  const kr = 0.19 * (z0 / Z0_II) ** 0.07;

  const crOf = (z: number) => kr * Math.log(Math.max(z, zmin) / z0);
  const IvOf = (z: number) => p.turbulenceFactorKl / (p.orographyCo * Math.log(Math.max(z, zmin) / z0));
  const vmOf = (z: number) => crOf(z) * p.orographyCo * vb;
  const qpOf = (z: number) => ((1 + 7 * IvOf(z)) * 0.5 * p.airDensity * vmOf(z) ** 2) / 1000; // kN/m2

  // ----- Reference height ze(z), Fig 7.4 strip logic (evaluated pointwise on the mesh) -----
  const zeOf = (z: number): number => {
    if (h <= b) return h;
    if (h <= 2 * b) return z <= h - b ? b : h;
    if (z <= b) return b;
    if (z >= h - b) return h;
    return z;
  };

  // ----- Height mesh -----
  const zArr: number[] = Array.from({ length: MESH_NODES }, (_, i) => (h * i) / (MESH_NODES - 1));
  const zeArr = zArr.map(zeOf);
  const crArr = zArr.map(crOf);
  const IvArr = zArr.map(IvOf);
  const vmArr = zeArr.map(vmOf);
  const qpArr = zeArr.map(qpOf);

  // ----- Force coefficient, §7.6 -----
  const dOverB = d / b;
  const cf0 = interp(CF0_DB, CF0_VAL, dOverB);
  const psiR = 1.0; // sharp corners assumed (scope-bounding simplification)
  const lOverB = h / b;
  const lambda = interp(LAMBDA_LB, LAMBDA_VAL, lOverB);
  const psiLambda = interp(PSILAMBDA_LAMBDA, PSILAMBDA_VAL, lambda);
  const cf = cf0 * psiR * psiLambda;

  // ----- Design force profile (quasi-static, before cscd), §5.3 -----
  const wArr = qpArr.map((qp) => cf * qp * b); // kN/m of height

  // ----- Structural factor cscd, Annex B (closed-form) -----
  const zs = Math.max(0.6 * h, zmin);
  const vmZs = vmOf(zs);
  const IvZs = IvOf(zs);
  const alphaTL = 0.67 + 0.05 * Math.log(z0);
  const Lzs = 300 * (zs / 200) ** alphaTL;
  const B2 = 1 / (1 + 0.9 * ((b + h) / Lzs) ** 0.63);
  const n1 = p.naturalFreqMode === "given" ? p.naturalFreqHz : 46 / h;
  const fL = (n1 * Lzs) / Math.max(vmZs, 1e-6);
  const SL = (6.8 * fL) / (1 + 10.2 * fL) ** (5 / 3);
  const etaH = (4.6 * h * fL) / Lzs;
  const etaB = (4.6 * b * fL) / Lzs;
  const Rh = admittance(etaH);
  const Rb = admittance(etaB);
  const R2 = ((Math.PI * Math.PI) / (2 * p.dampingLogDecrement)) * SL * Rh * Rb;
  const nu = Math.max(n1 * Math.sqrt(R2 / Math.max(B2 + R2, 1e-9)), 0.08);
  const lnNuT = Math.max(2 * Math.log(Math.max(nu * T_GUST, 1.001)), 1e-6);
  const kp = Math.max(Math.sqrt(lnNuT) + 0.6 / Math.sqrt(lnNuT), 3.0);
  const cscd = (1 + 2 * kp * IvZs * Math.sqrt(B2 + R2)) / (1 + 7 * IvZs);

  const fwDistArr = wArr.map((w) => cscd * w);

  // ----- Base shear / overturning moment -----
  const vBase = trap(fwDistArr, zArr);
  const mOverturning = trapMoment(fwDistArr, zArr, 0);

  // ----- Along-wind tip deflection (cantilever equilibrium integration, top-down) -----
  const massPerHeightKgPerM = p.massPerHeightTPerM * 1000;
  const eiEffNm2 = massPerHeightKgPerM * h ** 4 * ((2 * Math.PI * n1) / 1.875 ** 2) ** 2;
  const eiEff = eiEffNm2 / 1000; // kN.m2

  const n = zArr.length;
  const V = new Array(n).fill(0); // kN, cumulative from the free top end
  const M = new Array(n).fill(0); // kN.m
  for (let i = n - 2; i >= 0; i--) {
    const dz = zArr[i + 1]! - zArr[i]!;
    V[i] = V[i + 1] + 0.5 * (fwDistArr[i]! + fwDistArr[i + 1]!) * dz;
    M[i] = M[i + 1] + 0.5 * (V[i]! + V[i + 1]!) * dz;
  }
  const kappa = M.map((m) => m / Math.max(eiEff, 1e-9)); // 1/m
  const theta = new Array(n).fill(0);
  const y = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    const dz = zArr[i]! - zArr[i - 1]!;
    theta[i] = theta[i - 1] + 0.5 * (kappa[i - 1]! + kappa[i]!) * dz;
    y[i] = y[i - 1] + 0.5 * (theta[i - 1]! + theta[i]!) * dz;
  }
  const tipDeflectionM = y[n - 1]!;
  const driftLimitM = h / p.driftLimitDenominator;
  const driftRatioDenominator = tipDeflectionM > 1e-9 ? h / tipDeflectionM : 999999;

  // ----- Comfort acceleration, Annex B.4 -----
  const Kx = interp(KX_ZETA, KX_VAL, p.modeShapeExponent);
  const R = Math.sqrt(Math.max(R2, 0));
  const sigmaAccel = (cf * p.airDensity * b * IvZs * vmZs ** 2 * (R / massPerHeightKgPerM)) * Kx;
  const peakAccel = kp * sigmaAccel;

  // ----- Applicability checks -----
  push("AP-01", "Height applicability (H ≤ 200 m)", "Applicability", h, "m", 200, "m", safeRatio(h, 200), h <= 200 ? "PASS" : "WARNING", "EN 1991-1-4 §4.3.2 (simplified profile validity)");

  const dbInRange = dOverB >= CF0_DB[0]! && dOverB <= CF0_DB[CF0_DB.length - 1]!;
  push("AP-02", "Force-coefficient chart range (d/b)", "Applicability", dOverB, "-", CF0_DB[CF0_DB.length - 1]!, "-", safeRatio(dOverB, CF0_DB[CF0_DB.length - 1]!), dbInRange ? "PASS" : "NOT VERIFIED", "EN 1991-1-4 Fig 7.23 (digitized, extrapolated outside range)");

  const lbInRange = lOverB >= LAMBDA_LB[0]! && lOverB <= LAMBDA_LB[LAMBDA_LB.length - 1]!;
  push("AP-03", "Effective slenderness chart range (l/b)", "Applicability", lOverB, "-", LAMBDA_LB[LAMBDA_LB.length - 1]!, "-", safeRatio(lOverB, LAMBDA_LB[LAMBDA_LB.length - 1]!), lbInRange ? "PASS" : "NOT VERIFIED", "EN 1991-1-4 Table 7.16 / Fig 7.36 (digitized, extrapolated outside range)");

  const cscdInBand = cscd >= 0.7 && cscd <= 1.3;
  push("AP-04", "Structural factor cscd sanity range", "Applicability", cscd, "-", 1.3, "-", safeRatio(cscd, 1.3), cscdInBand ? "PASS" : "WARNING", "EN 1991-1-4 §6.3.1 (engineering sanity check, typical common-building range)");

  // ----- Load path checks — delegated to downstream modules, always NOT VERIFIED here -----
  push("ULS-05", "Base shear vs. lateral-system/foundation capacity", "Load Path", vBase, "kN", 0, "kN", 0, "NOT VERIFIED", "Out of scope — verify in the lateral-system / foundation module");
  push("ULS-06", "Overturning moment vs. foundation/core overturning capacity", "Load Path", mOverturning, "kNm", 0, "kNm", 0, "NOT VERIFIED", "Out of scope — verify in the foundation module");
  push("ULS-07", "Foundation bearing-pressure increment from overturning", "Load Path", mOverturning, "kNm", 0, "kPa", 0, "NOT VERIFIED", "Out of scope — verify in the Pile Cap / Bored Pile module");

  // ----- SLS -----
  push("SLS-08", "Along-wind tip drift", "SLS", tipDeflectionM, "m", driftLimitM, "m", safeRatio(tipDeflectionM, driftLimitM), passFail(tipDeflectionM, driftLimitM), `Engineering judgement — H/${p.driftLimitDenominator} assumed, not codified in EN 1990/EN 1993`);
  push("SLS-09", "Occupant comfort — along-wind peak acceleration (Informative — ISO 10137, not a codified EN 1991-1-4 limit)", "SLS", peakAccel, "m/s²", p.comfortAccelLimit, "m/s²", safeRatio(peakAccel, p.comfortAccelLimit), passFail(peakAccel, p.comfortAccelLimit), "ISO 10137 (informative benchmark; a real check needs a reduced-return-period wind speed)");

  const listing = [...checks].sort((a, b) => b.utilization - a.utilization);
  const utilizationMax = listing.reduce((a, c) => Math.max(a, c.utilization), 0);
  const failed = listing.find((c) => c.status === "FAIL");
  let overallStatus: WindLoadCheckStatus = "PASS";
  if (failed) overallStatus = "FAIL";
  else if (listing.some((c) => c.status === "WARNING") || utilizationMax > 0.9) overallStatus = "WARNING";

  return {
    z0: round(z0, 4),
    zmin: round(zmin, 2),
    kr: round(kr, 4),
    vb: round(vb, 2),
    vb0: round(vb0, 2),

    z: zArr.map((v) => round(v, 2)),
    ze: zeArr.map((v) => round(v, 2)),
    cr: crArr.map((v) => round(v, 4)),
    Iv: IvArr.map((v) => round(v, 4)),
    vm: vmArr.map((v) => round(v, 2)),
    qp: qpArr.map((v) => round(v, 4)),
    w: wArr.map((v) => round(v, 2)),
    fwDist: fwDistArr.map((v) => round(v, 2)),

    dOverB: round(dOverB, 3),
    cf0: round(cf0, 3),
    lOverB: round(lOverB, 3),
    lambda: round(lambda, 2),
    psiLambda: round(psiLambda, 3),
    psiR: round(psiR, 3),
    cf: round(cf, 3),

    zs: round(zs, 2),
    vmZs: round(vmZs, 2),
    IvZs: round(IvZs, 4),
    alphaTL: round(alphaTL, 4),
    Lzs: round(Lzs, 2),
    B2: round(B2, 4),
    n1: round(n1, 4),
    fL: round(fL, 4),
    SL: round(SL, 5),
    etaH: round(etaH, 4),
    etaB: round(etaB, 4),
    Rh: round(Rh, 4),
    Rb: round(Rb, 4),
    R2: round(R2, 4),
    nu: round(nu, 4),
    kp: round(kp, 3),
    cscd: round(cscd, 3),

    vBase: round(vBase, 1),
    mOverturning: round(mOverturning, 1),

    eiEff: round(eiEff, 0),
    tipDeflectionM: round(tipDeflectionM, 4),
    driftRatioDenominator: round(driftRatioDenominator, 0),
    driftLimitM: round(driftLimitM, 4),
    sigmaAccel: round(sigmaAccel, 4),
    peakAccel: round(peakAccel, 4),

    checks: listing,
    utilizationMax: round(utilizationMax, 2),
    governingName: listing[0]?.name ?? "—",
    overallStatus,
  };
}
