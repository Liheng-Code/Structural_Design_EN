import type {
  BasementWallAnalysisResult,
  BasementWallCheck,
  BasementWallCheckStatus,
  BasementWallProject,
  BasementWallStage,
  StageForces,
} from "./types";
import { kaRankine, kaCoulomb, k0Jak, ecmFromFck, fctm as fctmOf, toRad, trap } from "../engine/math";

const GAMMA_W = 9.81; // kN/m3
const ES = 200000; // MPa

// EN 1997-1 Annex A — Design Approach 1 partial factors (UK NA recommended values)
const DA1_C1 = { label: "DA1-C1", gammaGUnfav: 1.35, gammaQ: 1.5, gammaPhi: 1.0 };
const DA1_C2 = { label: "DA1-C2", gammaGUnfav: 1.0, gammaQ: 1.3, gammaPhi: 1.25 };

function round(value: number, decimals = 1): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function barArea(diameter: number): number {
  return (Math.PI * diameter * diameter) / 4;
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

function passFail(demand: number, resistance: number): BasementWallCheckStatus {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return "NOT VERIFIED";
  return Math.abs(demand) > resistance ? "FAIL" : "PASS";
}

/** Design (factored) friction angle per EN 1997-1 Annex A: phi_d = atan(tan(phi_k)/gamma_phi). */
function designPhi(phiDeg: number, gammaPhi: number): number {
  return Math.atan(Math.tan(toRad(phiDeg)) / gammaPhi) / toRad(1);
}

/**
 * Integration stations (m) from the top/free end (z=0) to the base (z=H), including the
 * water-table breakpoint so the trapezoidal pressure diagram is captured exactly at the
 * dry/buoyant transition.
 */
function buildStations(heightM: number, waterDepthFromTopM: number, n = 41): number[] {
  const pts = new Set<number>();
  for (let i = 0; i < n; i++) pts.add(round((heightM * i) / (n - 1), 6));
  const zw = waterDepthFromTopM;
  if (zw > 1e-6 && zw < heightM - 1e-6) pts.add(round(zw, 6));
  return Array.from(pts).sort((a, b) => a - b);
}

/** Characteristic horizontal earth / water / surcharge pressure components (kPa) at depth z (m from top). */
function pressureComponents(zM: number, kUsed: number, gammaK: number, waterDepthFromTopM: number, surchargeKpa: number) {
  const zw = waterDepthFromTopM;
  const sigmaV = zM <= zw ? gammaK * zM : gammaK * zw + Math.max(0, gammaK - GAMMA_W) * (zM - zw);
  const earthP = kUsed * sigmaV;
  const waterP = zM > zw ? GAMMA_W * (zM - zw) : 0;
  const surchargeP = kUsed * surchargeKpa;
  return { earthP, waterP, surchargeP };
}

/**
 * Cumulative load -> shear -> moment integration from the free (top) end, z[0]=0.
 * Identical numerical pattern to the V/M-recovery step used in engine/math.ts's beamFem
 * (equilibrium integration from a free end), reimplemented locally since the stiffness/
 * spring machinery of the full FEM solver is not needed for this closed-form model.
 */
function integrateFreeEnd(z: number[], p: number[]): { V: number[]; M: number[] } {
  const n = z.length;
  const V = new Array(n).fill(0);
  const M = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    const dz = z[i]! - z[i - 1]!;
    V[i] = V[i - 1]! + 0.5 * (p[i - 1]! + p[i]!) * dz;
    M[i] = M[i - 1]! + 0.5 * (V[i - 1]! + V[i]!) * dz;
  }
  return { V, M };
}

interface FlexureResult {
  asRequired: number; // mm2/m
  mRd: number; // kNm/m
}

/** Concise EC2 singly-reinforced rectangular section design, per metre width (b = 1000 mm). */
function flexuralDesign(mEdKnmPerM: number, dMm: number, fckMpa: number, fydMpa: number): FlexureResult {
  const b = 1000;
  const mEd = Math.abs(mEdKnmPerM) * 1e6; // Nmm/m
  if (mEd <= 0 || dMm <= 0) return { asRequired: 0, mRd: 0 };
  const K = mEd / (b * dMm * dMm * fckMpa);
  const Kbal = 0.167; // EC2 concise method, x/d limit ~0.45 (no compression steel)
  const Kuse = Math.min(K, Kbal);
  const z = Math.min(0.95 * dMm, dMm * (0.5 + Math.sqrt(Math.max(0, 0.25 - Kuse / 1.134))));
  const asRequired = mEd / (fydMpa * z);
  const mRd = (fydMpa * asRequired * z) / 1e6;
  return { asRequired, mRd };
}

function vRdcOf(rho: number, dMm: number, fckMpa: number, gammaC: number): number {
  const k = Math.min(2, 1 + Math.sqrt(200 / dMm));
  const rhoL = Math.min(0.02, rho);
  return Math.max((0.18 / gammaC) * k * Math.cbrt(100 * rhoL * fckMpa), 0.035 * Math.sqrt(k ** 3) * Math.sqrt(fckMpa)); // MPa
}

function crackWidthOf(mQpKnmPerM: number, asProvided: number, dMm: number, hMm: number, barDiameter: number, cNom: number, fctm: number, ecm: number) {
  const sigmaSqp = mQpKnmPerM > 0 ? (mQpKnmPerM * 1e6) / (asProvided * 0.9 * dMm) / 1000 : 0; // MPa, lever arm ~0.9d approx
  const hMinusD = Math.max(10, hMm - dMm);
  const acEff = 1000 * Math.min(2.5 * hMinusD, hMm / 2);
  const rhoPeff = Math.max(1e-4, asProvided / acEff);
  const alphaE = ES / ecm;
  const kt = 0.4;
  const k2 = 0.5;
  const srmax = 3.4 * cNom + (0.425 * 0.8 * k2 * barDiameter) / rhoPeff;
  const strainTerm = Math.max((sigmaSqp - kt * (fctm / rhoPeff) * (1 + alphaE * rhoPeff)) / ES, (0.6 * sigmaSqp) / ES);
  return { sigmaSqp, crackWidth: srmax * strainTerm };
}

interface ComboStageResult {
  kUsed: number;
  kLabel: string;
  propReaction: number; // kN/m
  baseMEd: number; // kNm/m, magnitude
  baseVEd: number; // kN/m, magnitude
  spanMEd: number; // kNm/m, magnitude (0 if no sagging reversal)
  spanVEd: number; // kN/m, magnitude
  spanDepthFromTop: number; // m
}

export function analyzeBasementWall(project: BasementWallProject): BasementWallAnalysisResult {
  const checks: BasementWallCheck[] = [];
  const push = (
    id: string,
    name: string,
    category: BasementWallCheck["category"],
    stage: BasementWallCheck["stage"],
    demand: number,
    demandUnit: string,
    resistance: number,
    resistanceUnit: string,
    utilization: number,
    status: BasementWallCheckStatus,
    clause: string,
  ) => checks.push({ id, name, category, stage, demand, demandUnit, resistance, resistanceUnit, utilization, status, clause });

  const p = {
    fck: Math.max(10, pos(project.fck, 30)),
    fyk: Math.max(400, pos(project.fyk, 500)),
    gammaC: pos(project.gammaC, 1.5),
    gammaS: pos(project.gammaS, 1.15),
    alphaCC: Number.isFinite(project.alphaCC) ? project.alphaCC : 0.85,
    cNomBuried: Math.max(10, pos(project.cNomBuried, 40)),
    cNomWater: Math.max(10, pos(project.cNomWater, 50)),
    wMax: nonNeg(project.wMax, 0.3),
    stemHeight: pos(project.stemHeight, 3500),
    wallThickness: pos(project.wallThickness, 300),
    innerFaceBarDiameter: pos(project.innerFaceBarDiameter, 16),
    innerFaceBarSpacing: pos(project.innerFaceBarSpacing, 150),
    outerFaceBarDiameter: pos(project.outerFaceBarDiameter, 16),
    outerFaceBarSpacing: pos(project.outerFaceBarSpacing, 150),
    baseThickness: pos(project.baseThickness, 400),
    baseSupportType: project.baseSupportType === "strip footing" ? "strip footing" : "raft",
    baseDowelBarDiameter: pos(project.baseDowelBarDiameter, 16),
    baseDowelBarSpacing: pos(project.baseDowelBarSpacing, 150),
    gammaBackfill: pos(project.gammaBackfill, 18),
    phiBackfillDeg: pos(project.phiBackfillDeg, 32),
    cBackfillKpa: nonNeg(project.cBackfillKpa, 0),
    backfillSlopeDeg: nonNeg(project.backfillSlopeDeg, 0),
    useCoulomb: !!project.useCoulomb,
    deltaWallFrictionDeg: nonNeg(project.deltaWallFrictionDeg, 0),
    usePermanentK0: project.usePermanentK0 !== false,
    constructionSurchargeKpa: nonNeg(project.constructionSurchargeKpa, 10),
    serviceSurchargeKpa: nonNeg(project.serviceSurchargeKpa, 10),
    psi2Surcharge: nonNeg(project.psi2Surcharge, 0.3),
    waterTableDepthConstruction: nonNeg(project.waterTableDepthConstruction, 50000),
    waterTableDepthPermanent: nonNeg(project.waterTableDepthPermanent, 0),
  };

  // ----- Material properties (EN 1992-1-1) -----
  const fcd = p.alphaCC * (p.fck / p.gammaC);
  const fyd = p.fyk / p.gammaS;
  const fctm = fctmOf(p.fck);
  const fctk005 = 0.7 * fctm;
  const ecm = ecmFromFck(p.fck);

  // ----- Geometry -----
  const Hm = p.stemHeight / 1000;
  const dInner = Math.max(50, p.wallThickness - p.cNomBuried - p.innerFaceBarDiameter / 2);
  const dOuter = Math.max(50, p.wallThickness - p.cNomWater - p.outerFaceBarDiameter / 2);

  /**
   * Runs one stage under one partial-factor combination. Construction stage: free cantilever,
   * base moment/shear read directly from the cumulative integration. Permanent stage: force
   * (unit-load) method — release the top prop, integrate the cantilever moment M0(z), then
   * solve the redundant prop reaction P = delta0/delta11 where delta0 = INTEGRAL[M0(z)*z dz]
   * and delta11 = H^3/3 (EI cancels for the prismatic wall, so it is omitted entirely).
   */
  function runStage(stage: BasementWallStage, f: typeof DA1_C1): ComboStageResult {
    const waterM = (stage === "Construction" ? p.waterTableDepthConstruction : p.waterTableDepthPermanent) / 1000;
    const surchargeKpa = stage === "Construction" ? p.constructionSurchargeKpa : p.serviceSurchargeKpa;

    let kUsed: number;
    let kLabel: string;
    if (stage === "Permanent" && p.usePermanentK0) {
      kUsed = k0Jak(p.phiBackfillDeg);
      kLabel = "K0 (Jaky)";
    } else {
      const phiD = designPhi(p.phiBackfillDeg, f.gammaPhi);
      const deltaD = designPhi(p.deltaWallFrictionDeg, f.gammaPhi);
      kUsed = p.useCoulomb ? kaCoulomb(phiD, 0, p.backfillSlopeDeg, deltaD) : kaRankine(phiD);
      kLabel = p.useCoulomb ? "Ka (Coulomb)" : "Ka (Rankine)";
    }

    const z = buildStations(Hm, waterM);
    const pDes = z.map((zM) => {
      const { earthP, waterP, surchargeP } = pressureComponents(zM, kUsed, p.gammaBackfill, waterM, surchargeKpa);
      return f.gammaGUnfav * (earthP + waterP) + f.gammaQ * surchargeP;
    });

    const { V: V0, M: M0 } = integrateFreeEnd(z, pDes);

    if (stage === "Construction") {
      return {
        kUsed,
        kLabel,
        propReaction: 0,
        baseMEd: Math.abs(M0[M0.length - 1]!),
        baseVEd: Math.abs(V0[V0.length - 1]!),
        spanMEd: 0,
        spanVEd: 0,
        spanDepthFromTop: 0,
      };
    }

    // Permanent stage — solve the prop reaction and correct the moment/shear diagrams.
    const integrand = M0.map((m, i) => m * z[i]!);
    const numerator = trap(integrand, z);
    const denominator = Hm ** 3 / 3;
    const P = denominator > 1e-9 ? numerator / denominator : 0;

    const M = M0.map((m, i) => m - P * z[i]!);
    const V = V0.map((v) => v - P);

    const baseMEd = Math.abs(M[M.length - 1]!);
    const baseVEd = Math.abs(V[V.length - 1]!);

    let minM = 0;
    let minIdx = -1;
    for (let i = 1; i < M.length - 1; i++) {
      if (M[i]! < minM) {
        minM = M[i]!;
        minIdx = i;
      }
    }
    const spanMEd = minIdx >= 0 ? Math.abs(minM) : 0;
    const spanVEd = minIdx >= 0 ? Math.abs(V[minIdx]!) : 0;
    const spanDepthFromTop = minIdx >= 0 ? z[minIdx]! : 0;

    return { kUsed, kLabel, propReaction: P, baseMEd, baseVEd, spanMEd, spanVEd, spanDepthFromTop };
  }

  function governStage(stage: BasementWallStage): StageForces {
    const c1 = runStage(stage, DA1_C1);
    const c2 = runStage(stage, DA1_C2);
    const baseGov = c1.baseMEd >= c2.baseMEd ? c1 : c2;
    return {
      kUsed: round(baseGov.kUsed, 4),
      kLabel: baseGov.kLabel,
      propReaction: round(Math.max(Math.abs(c1.propReaction), Math.abs(c2.propReaction))),
      baseMEd: round(Math.max(c1.baseMEd, c2.baseMEd)),
      baseVEd: round(Math.max(c1.baseVEd, c2.baseVEd)),
      spanMEd: round(Math.max(c1.spanMEd, c2.spanMEd)),
      spanVEd: round(Math.max(c1.spanVEd, c2.spanVEd)),
      spanDepthFromTop: Math.round(baseGov.spanDepthFromTop * 1000),
    };
  }

  const construction = governStage("Construction");
  const permanent = governStage("Permanent");

  // ----- Governing design forces (max magnitude across stages) -----
  const baseMEdGov = Math.max(construction.baseMEd, permanent.baseMEd);
  const baseGovStage: BasementWallStage = construction.baseMEd >= permanent.baseMEd ? "Construction" : "Permanent";
  const baseVEdGov = Math.max(construction.baseVEd, permanent.baseVEd);
  const spanMEdGov = permanent.spanMEd;
  const spanVEdGov = permanent.spanVEd;

  // ----- Reinforcement design -----
  const innerAsProvided = barArea(p.innerFaceBarDiameter) * (1000 / p.innerFaceBarSpacing);
  const innerAsMin = Math.max(0.26 * (fctm / p.fyk) * 1000 * dInner, 0.0013 * 1000 * dInner);
  const innerVRdc = (vRdcOf(innerAsProvided / (1000 * dInner), dInner, p.fck, p.gammaC) * 1000 * dInner) / 1000;

  const outerAsProvided = barArea(p.outerFaceBarDiameter) * (1000 / p.outerFaceBarSpacing);
  const outerAsMin = Math.max(0.26 * (fctm / p.fyk) * 1000 * dOuter, 0.0013 * 1000 * dOuter);
  const outerVRdc = (vRdcOf(outerAsProvided / (1000 * dOuter), dOuter, p.fck, p.gammaC) * 1000 * dOuter) / 1000;

  const csBaseFlex = flexuralDesign(construction.baseMEd, dInner, p.fck, fyd);
  const psBaseFlex = flexuralDesign(permanent.baseMEd, dInner, p.fck, fyd);
  const psSpanFlex = flexuralDesign(permanent.spanMEd, dOuter, p.fck, fyd);
  const innerAsRequired = Math.max(csBaseFlex.asRequired, psBaseFlex.asRequired);
  const outerAsRequired = psSpanFlex.asRequired;

  // ----- ULS checks -----
  push("UL-01", "Construction-stage base flexure (back face)", "ULS", "Construction", csBaseFlex.asRequired, "mm²/m", innerAsProvided, "mm²/m", safeRatio(csBaseFlex.asRequired, innerAsProvided), passFail(csBaseFlex.asRequired, innerAsProvided), "EN 1992-1-1 §6.1");
  push("UL-02", "Construction-stage base shear (back face)", "ULS", "Construction", construction.baseVEd, "kN/m", innerVRdc, "kN/m", safeRatio(construction.baseVEd, innerVRdc), passFail(construction.baseVEd, innerVRdc), "EN 1992-1-1 §6.2.2");
  push("UL-03", "Permanent-stage base flexure (back face)", "ULS", "Permanent", psBaseFlex.asRequired, "mm²/m", innerAsProvided, "mm²/m", safeRatio(psBaseFlex.asRequired, innerAsProvided), passFail(psBaseFlex.asRequired, innerAsProvided), "EN 1992-1-1 §6.1");
  push("UL-04", "Permanent-stage base shear (back face)", "ULS", "Permanent", permanent.baseVEd, "kN/m", innerVRdc, "kN/m", safeRatio(permanent.baseVEd, innerVRdc), passFail(permanent.baseVEd, innerVRdc), "EN 1992-1-1 §6.2.2");
  push("UL-05", "Permanent-stage span flexure (front face)", "ULS", "Permanent", psSpanFlex.asRequired, "mm²/m", outerAsProvided, "mm²/m", safeRatio(psSpanFlex.asRequired, outerAsProvided), passFail(psSpanFlex.asRequired, outerAsProvided), "EN 1992-1-1 §6.1");
  push("UL-06", "Permanent-stage span shear (front face)", "ULS", "Permanent", permanent.spanVEd, "kN/m", outerVRdc, "kN/m", safeRatio(permanent.spanVEd, outerVRdc), passFail(permanent.spanVEd, outerVRdc), "EN 1992-1-1 §6.2.2");
  push("UL-07", "Minimum reinforcement — inner (back) face", "ULS", "Both", innerAsMin, "mm²/m", innerAsProvided, "mm²/m", safeRatio(innerAsMin, innerAsProvided), passFail(innerAsMin, innerAsProvided), "EN 1992-1-1 §9.2.1.1");
  push("UL-08", "Minimum reinforcement — outer (front) face", "ULS", "Permanent", outerAsMin, "mm²/m", outerAsProvided, "mm²/m", safeRatio(outerAsMin, outerAsProvided), passFail(outerAsMin, outerAsProvided), "EN 1992-1-1 §9.2.1.1");

  // ----- Detailing -----
  const fbd = 2.25 * (fctk005 / p.gammaC);
  const baseDowelAnchorageRequired = (p.baseDowelBarDiameter / 4) * (fyd / fbd);
  const baseDowelAnchorageAvailable = Math.max(0, p.baseThickness - 2 * p.cNomBuried);
  push("DT-09", "Base dowel / starter bar anchorage into base slab", "Durability", "Both", baseDowelAnchorageRequired, "mm", baseDowelAnchorageAvailable, "mm", safeRatio(baseDowelAnchorageRequired, baseDowelAnchorageAvailable), passFail(baseDowelAnchorageRequired, baseDowelAnchorageAvailable), "EN 1992-1-1 §8.4 (simplified straight length)");
  push("DT-10", "Curtailment of hogging steel past point of contraflexure", "Durability", "Permanent", 0, "-", 0, "-", 0, "NOT VERIFIED", "Out of scope — verify bar cut-off/anchorage lengths separately per EN 1992-1-1 §9.2.1.3 / §8.4");

  // ----- Load path outputs (informational, feeding adjacent element design) -----
  push("LP-11", "Top prop reaction -> ground-floor slab/diaphragm design input", "Load Path", "Permanent", permanent.propReaction, "kN/m", 0, "-", 0, "NOT VERIFIED", "Load path — demand only; ground-floor slab/diaphragm design out of scope");
  push("LP-12", "Base reaction (M, V) -> base slab/footing design input", "Load Path", "Both", baseMEdGov, "kNm/m", baseVEdGov, "kN/m", 0, "NOT VERIFIED", "Load path — demand only; base slab/footing design out of scope");

  // ----- SLS crack width (quasi-permanent combination: G characteristic + psi2*Q) -----
  const QP = { label: "QP", gammaGUnfav: 1.0, gammaQ: p.psi2Surcharge, gammaPhi: 1.0 };
  const qpPermanent = runStage("Permanent", QP);
  const innerCrack = crackWidthOf(qpPermanent.baseMEd, innerAsProvided, dInner, p.wallThickness, p.innerFaceBarDiameter, p.cNomBuried, fctm, ecm);
  const outerCrack = crackWidthOf(qpPermanent.spanMEd, outerAsProvided, dOuter, p.wallThickness, p.outerFaceBarDiameter, p.cNomWater, fctm, ecm);
  push("SL-13", "Crack width — inner face at base (quasi-permanent)", "SLS", "Permanent", innerCrack.crackWidth, "mm", p.wMax, "mm", safeRatio(innerCrack.crackWidth, p.wMax), passFail(innerCrack.crackWidth, p.wMax), "EN 1992-1-1 §7.3.4");
  push("SL-14", "Crack width — outer face at span (quasi-permanent)", "SLS", "Permanent", outerCrack.crackWidth, "mm", p.wMax, "mm", safeRatio(outerCrack.crackWidth, p.wMax), passFail(outerCrack.crackWidth, p.wMax), "EN 1992-1-1 §7.3.4");

  // ----- Durability / delegated checks -----
  push("DR-15", `Global bearing / sliding of raft (baseSupportType="${p.baseSupportType}")`, "Durability", "Both", 0, "-", 0, "-", 0, "NOT VERIFIED", "Delegated to the building's overall raft/foundation design — not verified in this module");
  push("DR-16", "Water resistance / waterproofing grade (e.g. BS 8102)", "Durability", "Both", 0, "-", 0, "-", 0, "NOT VERIFIED", "Specialist waterproofing design — out of structural scope; structural water pressure only is included in loading");

  const listing = [...checks].sort((a, b) => b.utilization - a.utilization);
  const utilizationMax = listing.reduce((a, b) => Math.max(a, b.utilization), 0);
  const failed = listing.find((c) => c.status === "FAIL");
  let overallStatus: BasementWallCheckStatus = "PASS";
  if (failed) overallStatus = "FAIL";
  else if (listing.some((c) => c.status === "WARNING") || utilizationMax > 0.9) overallStatus = "WARNING";

  return {
    fcd: round(fcd),
    fyd: round(fyd, 1),
    fctm: round(fctm, 2),
    fctk005: round(fctk005, 2),
    ecm: Math.round(ecm),
    dInner: Math.round(dInner),
    dOuter: Math.round(dOuter),
    construction,
    permanent,
    baseMEdGov: round(baseMEdGov),
    baseVEdGov: round(baseVEdGov),
    baseGovStage,
    spanMEdGov: round(spanMEdGov),
    spanVEdGov: round(spanVEdGov),
    innerAsRequired: Math.round(innerAsRequired),
    innerAsProvided: Math.round(innerAsProvided),
    innerAsMin: Math.round(innerAsMin),
    innerVRdc: round(innerVRdc),
    outerAsRequired: Math.round(outerAsRequired),
    outerAsProvided: Math.round(outerAsProvided),
    outerAsMin: Math.round(outerAsMin),
    outerVRdc: round(outerVRdc),
    baseDowelAnchorageRequired: Math.round(baseDowelAnchorageRequired),
    baseDowelAnchorageAvailable: Math.round(baseDowelAnchorageAvailable),
    sigmaSqpInner: round(innerCrack.sigmaSqp),
    crackWidthInner: round(innerCrack.crackWidth, 3),
    sigmaSqpOuter: round(outerCrack.sigmaSqp),
    crackWidthOuter: round(outerCrack.crackWidth, 3),
    crackLimit: p.wMax,
    checks: listing,
    utilizationMax: round(utilizationMax, 2),
    governingName: listing[0]?.name ?? "—",
    overallStatus,
  };
}
