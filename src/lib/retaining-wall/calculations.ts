import type {
  CantileverWallAnalysisResult,
  CantileverWallCheck,
  CantileverWallCheckStatus,
  CantileverWallProject,
  ComboSummary,
} from "./types";
import { kaRankine, kaCoulomb, kpRankine, kpCoulomb, ecmFromFck, fctm as fctmOf, toRad, trap, trapMoment } from "../engine/math";

const UNIT_WEIGHT_CONCRETE = 25; // kN/m3
const GAMMA_W = 9.81; // kN/m3
const ES = 200000; // MPa

// EN 1997-1 Annex A — Design Approach 1 partial factors (UK NA recommended values)
const DA1_C1 = { label: "DA1-C1", gammaGUnfav: 1.35, gammaGFav: 1.0, gammaQ: 1.5, gammaPhi: 1.0, gammaC: 1.0, gammaRh: 1.0, gammaRv: 1.0 };
const DA1_C2 = { label: "DA1-C2", gammaGUnfav: 1.0, gammaGFav: 1.0, gammaQ: 1.3, gammaPhi: 1.25, gammaC: 1.25, gammaRh: 1.0, gammaRv: 1.0 };

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

function passFail(demand: number, resistance: number): CantileverWallCheckStatus {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return "NOT VERIFIED";
  return Math.abs(demand) > resistance ? "FAIL" : "PASS";
}

/** Design (factored) friction angle per EN 1997-1 Annex A: phi_d = atan(tan(phi_k)/gamma_phi). */
function designPhi(phiDeg: number, gammaPhi: number): number {
  return Math.atan(Math.tan(toRad(phiDeg)) / gammaPhi) / toRad(1);
}

/**
 * Horizontal earth/water/surcharge actions on a vertical plane of given height (from the
 * retained surface down to the reference level), using a two-zone (dry/buoyant) unit weight
 * split about a water table depth measured from that same surface. Reused for both the
 * full wall height (stability) and the stem-only height (stem flexure/shear) by passing a
 * different heightM. Integration reuses the existing trap()/trapMoment() helpers from the
 * sheet-pile engine rather than re-deriving trapezoidal force/moment formulas.
 */
function earthActions(heightM: number, kaD: number, gammaK: number, waterDepthFromTopM: number, surchargeKpa: number) {
  if (heightM <= 0) return { earthForce: 0, earthMoment: 0, waterForce: 0, waterMoment: 0, surchargeForce: 0, surchargeMoment: 0 };
  const zw = Math.min(Math.max(waterDepthFromTopM, 0), heightM);
  const z = zw > 1e-6 && zw < heightM - 1e-6 ? [0, zw, heightM] : [0, heightM];
  const earthP = z.map((zi) => {
    const sigmaV = zi <= zw ? gammaK * zi : gammaK * zw + Math.max(0, gammaK - GAMMA_W) * (zi - zw);
    return kaD * sigmaV;
  });
  const waterP = z.map((zi) => (zi > zw ? GAMMA_W * (zi - zw) : 0));
  const earthForce = trap(earthP, z);
  const earthMoment = -trapMoment(earthP, z, heightM); // moment about the base of this height range
  const waterForce = trap(waterP, z);
  const waterMoment = -trapMoment(waterP, z, heightM);
  const surchargeForce = kaD * surchargeKpa * heightM;
  const surchargeMoment = surchargeForce * (heightM / 2);
  return { earthForce, earthMoment, waterForce, waterMoment, surchargeForce, surchargeMoment };
}

/** Weight of a soil column of given total depth split into dry (top) / buoyant (below water table) zones. */
function layeredSoilWeight(widthM: number, depthM: number, gammaK: number, waterDepthFromSurfaceM: number): number {
  if (depthM <= 0 || widthM <= 0) return 0;
  const dry = Math.min(depthM, Math.max(0, waterDepthFromSurfaceM));
  const sub = Math.max(0, depthM - dry);
  return widthM * (gammaK * dry + Math.max(0, gammaK - GAMMA_W) * sub);
}

/** Trapezoidal load resultant + centroid, x measured from the free end (x=0) to the fixed end (x=L). */
function trapLoad(qAtFreeEnd: number, qAtFixedEnd: number, length: number): { resultant: number; centroidFromFreeEnd: number } {
  const resultant = 0.5 * (qAtFreeEnd + qAtFixedEnd) * length;
  const denom = qAtFreeEnd + qAtFixedEnd;
  const centroidFromFreeEnd = Math.abs(denom) < 1e-9 ? length / 2 : (length * (qAtFreeEnd + 2 * qAtFixedEnd)) / (3 * denom);
  return { resultant, centroidFromFreeEnd };
}

/** Base contact pressure at each edge for a strip footing under N (kN/m) with signed eccentricity e (m) from centreline. */
function basePressure(nDesign: number, baseWidthM: number, eSigned: number) {
  const eAbs = Math.abs(eSigned);
  if (eAbs <= baseWidthM / 6) {
    const qToe = (nDesign / baseWidthM) * (1 - (6 * eSigned) / baseWidthM);
    const qHeel = (nDesign / baseWidthM) * (1 + (6 * eSigned) / baseWidthM);
    return { qToe: Math.max(0, qToe), qHeel: Math.max(0, qHeel), resultantWithinBase: true };
  }
  if (eAbs >= baseWidthM / 2) {
    return { qToe: 0, qHeel: 0, resultantWithinBase: false };
  }
  // Meyerhof "no-tension" triangular redistribution, contact length from the near edge.
  const contactLength = 3 * (baseWidthM / 2 - eAbs);
  const qPeak = contactLength > 1e-6 ? (2 * nDesign) / contactLength : 0;
  if (eSigned < 0) return { qToe: qPeak, qHeel: 0, resultantWithinBase: true };
  return { qToe: 0, qHeel: qPeak, resultantWithinBase: true };
}

function pressureAt(x: number, baseWidthM: number, qToe: number, qHeel: number): number {
  const t = Math.min(1, Math.max(0, x / baseWidthM));
  return qToe + (qHeel - qToe) * t;
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
  const mRd = (fydMpa * asRequired * z) / 1e6; // kNm/m, capped resistance for provided-style checks
  return { asRequired, mRd };
}

function vRdcOf(rho: number, dMm: number, fckMpa: number, gammaC: number): number {
  const k = Math.min(2, 1 + Math.sqrt(200 / dMm));
  const rhoL = Math.min(0.02, rho);
  return Math.max((0.18 / gammaC) * k * Math.cbrt(100 * rhoL * fckMpa), 0.035 * Math.sqrt(k ** 3) * Math.sqrt(fckMpa)); // MPa
}

export function analyzeCantileverWall(project: CantileverWallProject): CantileverWallAnalysisResult {
  const checks: CantileverWallCheck[] = [];
  const push = (
    id: string,
    name: string,
    category: CantileverWallCheck["category"],
    demand: number,
    demandUnit: string,
    resistance: number,
    resistanceUnit: string,
    utilization: number,
    status: CantileverWallCheckStatus,
    clause: string,
  ) => checks.push({ id, name, category, demand, demandUnit, resistance, resistanceUnit, utilization, status, clause });

  const p = {
    fck: Math.max(10, pos(project.fck, 30)),
    fyk: Math.max(400, pos(project.fyk, 500)),
    gammaC: pos(project.gammaC, 1.5),
    gammaS: pos(project.gammaS, 1.15),
    alphaCC: Number.isFinite(project.alphaCC) ? project.alphaCC : 0.85,
    cNomExposed: Math.max(10, pos(project.cNomExposed, 40)),
    cNomBuried: Math.max(10, pos(project.cNomBuried, 50)),
    wMax: nonNeg(project.wMax, 0.3),
    stemHeight: pos(project.stemHeight, 3500),
    stemTopThickness: pos(project.stemTopThickness, 250),
    stemBaseThickness: pos(project.stemBaseThickness, 400),
    stemBarDiameter: pos(project.stemBarDiameter, 20),
    stemBarSpacing: pos(project.stemBarSpacing, 150),
    toeLength: pos(project.toeLength, 900),
    heelLength: pos(project.heelLength, 1800),
    baseThickness: pos(project.baseThickness, 450),
    embedmentDepth: pos(project.embedmentDepth, 1000),
    toeBarDiameter: pos(project.toeBarDiameter, 20),
    toeBarSpacing: pos(project.toeBarSpacing, 150),
    heelBarDiameter: pos(project.heelBarDiameter, 20),
    heelBarSpacing: pos(project.heelBarSpacing, 150),
    hasShearKey: !!project.hasShearKey,
    keyWidth: pos(project.keyWidth, 300),
    keyDepth: pos(project.keyDepth, 300),
    keyDistanceFromToe: nonNeg(project.keyDistanceFromToe, 1500),
    gammaBackfill: pos(project.gammaBackfill, 18),
    phiBackfillDeg: pos(project.phiBackfillDeg, 32),
    cBackfillKpa: nonNeg(project.cBackfillKpa, 0),
    backfillSlopeDeg: nonNeg(project.backfillSlopeDeg, 0),
    useCoulomb: !!project.useCoulomb,
    deltaWallFrictionDeg: nonNeg(project.deltaWallFrictionDeg, 0),
    surchargeKpa: nonNeg(project.surchargeKpa, 0),
    psi2Surcharge: nonNeg(project.psi2Surcharge, 0.3),
    gammaFoundation: pos(project.gammaFoundation, 19),
    phiFoundationDeg: pos(project.phiFoundationDeg, 28),
    cFoundationKpa: nonNeg(project.cFoundationKpa, 0),
    baseFrictionAngleDeg: pos(project.baseFrictionAngleDeg, 25),
    gammaPassive: pos(project.gammaPassive, 18),
    phiPassiveDeg: pos(project.phiPassiveDeg, 30),
    includePassiveResistance: !!project.includePassiveResistance,
    passiveReductionFactor: nonNeg(project.passiveReductionFactor, 0.5),
    waterTableDepthBehindWall: nonNeg(project.waterTableDepthBehindWall, 50000),
    waterTableDepthInFront: nonNeg(project.waterTableDepthInFront, 50000),
  };

  // ----- Material properties (EN 1992-1-1) -----
  const fcd = p.alphaCC * (p.fck / p.gammaC);
  const fyd = p.fyk / p.gammaS;
  const fctm = fctmOf(p.fck);
  const fctk005 = 0.7 * fctm;
  const ecm = ecmFromFck(p.fck);

  // ----- Geometry -----
  const Hmm = p.stemHeight + p.baseThickness;
  const Hm = Hmm / 1000;
  const stemHeightM = p.stemHeight / 1000;
  const baseThicknessM = p.baseThickness / 1000;
  const toeLengthM = p.toeLength / 1000;
  const heelLengthM = p.heelLength / 1000;
  const Bmm = p.toeLength + p.stemBaseThickness + p.heelLength;
  const Bm = Bmm / 1000;
  const stemAvgThickness = (p.stemTopThickness + p.stemBaseThickness) / 2;
  const stemAvgThicknessM = stemAvgThickness / 1000;
  const embedmentM = p.embedmentDepth / 1000;
  const frontSoilCoverToeM = Math.max(0, embedmentM - baseThicknessM);

  const dStem = Math.max(50, p.stemBaseThickness - p.cNomBuried - p.stemBarDiameter / 2);
  const dToe = Math.max(50, p.baseThickness - p.cNomBuried - p.toeBarDiameter / 2);
  const dHeel = Math.max(50, p.baseThickness - p.cNomBuried - p.heelBarDiameter / 2);

  // ----- Self-weights (characteristic, favourable -> gammaG,fav = 1.0 in both DA1 combinations) -----
  const wStemK = stemAvgThicknessM * stemHeightM * UNIT_WEIGHT_CONCRETE;
  const xStem = toeLengthM + stemAvgThicknessM / 2;
  const wBaseK = Bm * baseThicknessM * UNIT_WEIGHT_CONCRETE;
  const xBase = Bm / 2;
  const wKeyK = p.hasShearKey ? (p.keyWidth / 1000) * (p.keyDepth / 1000) * UNIT_WEIGHT_CONCRETE : 0;
  const xKey = p.keyDistanceFromToe / 1000 + p.keyWidth / 1000 / 2;
  const waterBehindM = p.waterTableDepthBehindWall / 1000;
  const waterFrontM = p.waterTableDepthInFront / 1000;
  const wSoilHeelK = layeredSoilWeight(heelLengthM, stemHeightM, p.gammaBackfill, waterBehindM);
  const xHeel = Bm - heelLengthM / 2;
  const wSoilToeK = layeredSoilWeight(toeLengthM, frontSoilCoverToeM, p.gammaPassive, waterFrontM);
  const xToe = toeLengthM / 2;
  const qHeelK = p.surchargeKpa * heelLengthM; // vertical surcharge over the heel footprint

  // simplified average uplift at the underside of the base (informative; not a rigorous flow-net analysis)
  const headBehind = Math.max(0, Hm - waterBehindM);
  const headFront = Math.max(0, embedmentM - waterFrontM);
  const upliftPressureK = GAMMA_W * ((headBehind + headFront) / 2);
  const upliftForceK = upliftPressureK * Bm;

  function runCombo(f: typeof DA1_C1): ComboSummary {
    const phiBackfillD = designPhi(p.phiBackfillDeg, f.gammaPhi);
    const phiFoundationD = designPhi(p.phiFoundationDeg, f.gammaPhi);
    const phiPassiveD = designPhi(p.phiPassiveDeg, f.gammaPhi);
    const deltaD = designPhi(p.deltaWallFrictionDeg, f.gammaPhi);
    const baseFrictionD = designPhi(p.baseFrictionAngleDeg, f.gammaPhi);

    const kA = p.useCoulomb
      ? kaCoulomb(phiBackfillD, 0, p.backfillSlopeDeg, deltaD)
      : kaRankine(phiBackfillD);
    const kP = p.useCoulomb ? kpCoulomb(phiPassiveD, 0, 0, 0) : kpRankine(phiPassiveD);

    // ----- Overall (full-height) actions for stability -----
    const overall = earthActions(Hm, kA, p.gammaBackfill, waterBehindM, p.surchargeKpa);
    const hDesign = f.gammaGUnfav * (overall.earthForce + overall.waterForce) + f.gammaQ * overall.surchargeForce;
    const mOverturning = f.gammaGUnfav * (overall.earthMoment + overall.waterMoment) + f.gammaQ * overall.surchargeMoment;

    // ----- Vertical equilibrium & eccentricity -----
    const nDesign =
      f.gammaGFav * (wStemK + wBaseK + wKeyK + wSoilHeelK + wSoilToeK) + f.gammaQ * qHeelK - f.gammaGUnfav * upliftForceK;
    const mStabilizing =
      f.gammaGFav * (wStemK * xStem + wBaseK * xBase + wKeyK * xKey + wSoilHeelK * xHeel + wSoilToeK * xToe) +
      f.gammaQ * qHeelK * xHeel -
      f.gammaGUnfav * upliftForceK * (Bm / 2);

    const resultantWithinBase = nDesign > 0 && mStabilizing - mOverturning >= 0 && mStabilizing - mOverturning <= nDesign * Bm;
    const xR = nDesign > 0 ? (mStabilizing - mOverturning) / nDesign : Bm / 2;
    const eSigned = Bm / 2 - xR; // + toward toe, - toward heel (xR measured from toe)
    const eccentricity = Math.abs(eSigned);
    const resultantWithinMiddleThird = eccentricity <= Bm / 6;

    const { qToe, qHeel } = basePressure(Math.max(0, nDesign), Bm, -eSigned);
    const effectiveWidth = Math.max(0, Bm - 2 * eccentricity);

    // ----- Sliding -----
    let passiveForceD = 0;
    if (p.includePassiveResistance) {
      const dry = Math.min(embedmentM, waterFrontM);
      const sub = Math.max(0, embedmentM - dry);
      const gEff = p.gammaPassive;
      const earthPp = kP * (0.5 * gEff * dry * dry + gEff * dry * sub + 0.5 * Math.max(0, gEff - GAMMA_W) * sub * sub);
      passiveForceD = p.passiveReductionFactor * earthPp;
    }
    const slidingDemand = hDesign;
    const slidingResistance = (Math.max(0, nDesign) * Math.tan(toRad(baseFrictionD))) / f.gammaRh + passiveForceD;

    // ----- Bearing (EC7 Annex D) -----
    const Bp = Math.max(0.05, effectiveWidth);
    const cD = p.cFoundationKpa / f.gammaC;
    const phiFRad = toRad(phiFoundationD);
    const Nq = Math.exp(Math.PI * Math.tan(phiFRad)) * Math.tan(Math.PI / 4 + phiFRad / 2) ** 2;
    const Nc = phiFoundationD > 0.05 ? (Nq - 1) / Math.tan(phiFRad) : 5.14;
    const Ngamma = 2 * (Nq - 1) * Math.tan(phiFRad);
    const dryF = Math.min(embedmentM, waterFrontM);
    const subF = Math.max(0, embedmentM - dryF);
    const qOverburden = p.gammaFoundation * dryF + Math.max(0, p.gammaFoundation - GAMMA_W) * subF;
    const acTerm = cD > 0 && phiFoundationD > 0.05 ? (Bp * cD) / Math.tan(phiFRad) : 0;
    const m = 2; // strip footing, load inclined in the B direction
    const base = Math.min(1, Math.max(0, 1 - hDesign / Math.max(1e-6, nDesign + acTerm)));
    const iq = base ** m;
    const iGamma = base ** (m + 1);
    const iC = phiFoundationD > 0.05 ? iq - (1 - iq) / (Nc * Math.tan(phiFRad)) : iq;
    const rdPerArea = cD * Nc * iC + qOverburden * Nq * iq + 0.5 * p.gammaFoundation * Bp * Ngamma * iGamma;
    const bearingResistance = rdPerArea / f.gammaRv;
    const bearingDemand = Math.max(0, nDesign) / Bp;

    // ----- Stem design forces (stem-only height, fixed at footing top) -----
    const stemAct = earthActions(stemHeightM, kA, p.gammaBackfill, waterBehindM, p.surchargeKpa);
    const stemVEd = f.gammaGUnfav * (stemAct.earthForce + stemAct.waterForce) + f.gammaQ * stemAct.surchargeForce;
    const stemMEd = f.gammaGUnfav * (stemAct.earthMoment + stemAct.waterMoment) + f.gammaQ * stemAct.surchargeMoment;

    // ----- Toe cantilever (free end at toe tip x=0, fixed end at stem front face x=toeLength) -----
    const qToeTip = qToe;
    const qAtStemFace = pressureAt(toeLengthM, Bm, qToe, qHeel);
    const toeSelfWeightUdl = UNIT_WEIGHT_CONCRETE * baseThicknessM;
    const toeSoilUdl = toeLengthM > 0 ? wSoilToeK / toeLengthM : 0;
    const toeNetFree = qToeTip - toeSelfWeightUdl - toeSoilUdl;
    const toeNetFixed = qAtStemFace - toeSelfWeightUdl - toeSoilUdl;
    const toeLoad = trapLoad(toeNetFree, toeNetFixed, toeLengthM);
    const toeMEd = toeLoad.resultant * (toeLengthM - toeLoad.centroidFromFreeEnd);
    const toeVEd = toeLoad.resultant;

    // ----- Heel cantilever (free end at heel tip x=0 [global x=B], fixed end at stem back face x=heelLength [global x=toeLength+stemBaseThickness]) -----
    const heelDownUdl = UNIT_WEIGHT_CONCRETE * baseThicknessM + (heelLengthM > 0 ? wSoilHeelK / heelLengthM : 0) + p.surchargeKpa;
    const qHeelTip = qHeel;
    const qAtStemBack = pressureAt(toeLengthM + p.stemBaseThickness / 1000, Bm, qToe, qHeel);
    const heelNetFree = heelDownUdl - qHeelTip;
    const heelNetFixed = heelDownUdl - qAtStemBack;
    const heelLoad = trapLoad(heelNetFree, heelNetFixed, heelLengthM);
    const heelMEd = heelLoad.resultant * (heelLengthM - heelLoad.centroidFromFreeEnd);
    const heelVEd = heelLoad.resultant;

    return {
      label: f.label,
      kA: round(kA, 4),
      kP: round(kP, 4),
      phiBackfillD: round(phiBackfillD, 2),
      phiFoundationD: round(phiFoundationD, 2),
      phiPassiveD: round(phiPassiveD, 2),
      hDesign: round(hDesign),
      nDesign: round(nDesign),
      mOverturning: round(mOverturning),
      mStabilizing: round(mStabilizing),
      eccentricity: round(eccentricity, 3),
      resultantWithinMiddleThird,
      resultantWithinBase,
      toePressure: round(qToe),
      heelPressure: round(qHeel),
      effectiveWidth: round(effectiveWidth, 3),
      slidingDemand: round(slidingDemand),
      slidingResistance: round(slidingResistance),
      bearingDemand: round(bearingDemand),
      bearingResistance: round(bearingResistance),
      stemMEd: round(stemMEd),
      stemVEd: round(stemVEd),
      toeMEd: round(toeMEd),
      toeVEd: round(toeVEd),
      heelMEd: round(heelMEd),
      heelVEd: round(heelVEd),
    };
  }

  const c1 = runCombo(DA1_C1);
  const c2 = runCombo(DA1_C2);

  // ----- Stability checks: report both combinations explicitly -----
  push("ST-01", "Sliding resistance (DA1-C1)", "Stability", c1.slidingDemand, "kN/m", c1.slidingResistance, "kN/m", safeRatio(c1.slidingDemand, c1.slidingResistance), passFail(c1.slidingDemand, c1.slidingResistance), "EN 1997-1 §6.5.3");
  push("ST-02", "Sliding resistance (DA1-C2)", "Stability", c2.slidingDemand, "kN/m", c2.slidingResistance, "kN/m", safeRatio(c2.slidingDemand, c2.slidingResistance), passFail(c2.slidingDemand, c2.slidingResistance), "EN 1997-1 §6.5.3");
  push("ST-03", "Bearing resistance (DA1-C1)", "Stability", c1.bearingDemand, "kPa", c1.bearingResistance, "kPa", safeRatio(c1.bearingDemand, c1.bearingResistance), passFail(c1.bearingDemand, c1.bearingResistance), "EN 1997-1 Annex D");
  push("ST-04", "Bearing resistance (DA1-C2)", "Stability", c2.bearingDemand, "kPa", c2.bearingResistance, "kPa", safeRatio(c2.bearingDemand, c2.bearingResistance), passFail(c2.bearingDemand, c2.bearingResistance), "EN 1997-1 Annex D");

  const eccGov = c1.eccentricity >= c2.eccentricity ? c1 : c2;
  const eccStatus: CantileverWallCheckStatus = !eccGov.resultantWithinBase
    ? "FAIL"
    : eccGov.eccentricity > Bm / 3
      ? "FAIL"
      : eccGov.eccentricity > Bm / 6
        ? "WARNING"
        : "PASS";
  push("ST-05", `Eccentricity e ≤ B/6 (${eccGov.label})`, "Stability", eccGov.eccentricity, "m", Bm / 6, "m", safeRatio(eccGov.eccentricity, Bm / 6), eccStatus, "EN 1997-1 §9.8.1 note (Meyerhof)");

  const otRatioC1 = c1.mOverturning > 0 ? c1.mStabilizing / c1.mOverturning : 999;
  const otRatioC2 = c2.mOverturning > 0 ? c2.mStabilizing / c2.mOverturning : 999;
  const otGov = otRatioC1 <= otRatioC2 ? { r: otRatioC1, label: c1.label } : { r: otRatioC2, label: c2.label };
  push("ST-06", `Overturning moment ratio (${otGov.label}, cross-check)`, "Stability", 1, "-", otGov.r, "-", safeRatio(1, otGov.r), passFail(1, otGov.r), "EN 1997-1 §9.8.1 note");

  // ----- Structural design forces: governing (larger) of the two combinations -----
  const stemMEdGov = Math.max(Math.abs(c1.stemMEd), Math.abs(c2.stemMEd));
  const stemVEdGov = Math.max(Math.abs(c1.stemVEd), Math.abs(c2.stemVEd));
  const toeMEdGov = Math.max(Math.abs(c1.toeMEd), Math.abs(c2.toeMEd));
  const toeVEdGov = Math.max(Math.abs(c1.toeVEd), Math.abs(c2.toeVEd));
  const heelMEdGov = Math.max(Math.abs(c1.heelMEd), Math.abs(c2.heelMEd));
  const heelVEdGov = Math.max(Math.abs(c1.heelVEd), Math.abs(c2.heelVEd));

  const stemFlex = flexuralDesign(stemMEdGov, dStem, p.fck, fyd);
  const stemAsProvided = barArea(p.stemBarDiameter) * (1000 / p.stemBarSpacing);
  const stemAsMin = Math.max(0.26 * (fctm / p.fyk) * 1000 * dStem, 0.0013 * 1000 * dStem);
  const stemVRdc = (vRdcOf(stemAsProvided / (1000 * dStem), dStem, p.fck, p.gammaC) * 1000 * dStem) / 1000; // kN/m

  const toeFlex = flexuralDesign(toeMEdGov, dToe, p.fck, fyd);
  const toeAsProvided = barArea(p.toeBarDiameter) * (1000 / p.toeBarSpacing);
  const toeAsMin = Math.max(0.26 * (fctm / p.fyk) * 1000 * dToe, 0.0013 * 1000 * dToe);
  const toeVRdc = (vRdcOf(toeAsProvided / (1000 * dToe), dToe, p.fck, p.gammaC) * 1000 * dToe) / 1000;

  const heelFlex = flexuralDesign(heelMEdGov, dHeel, p.fck, fyd);
  const heelAsProvided = barArea(p.heelBarDiameter) * (1000 / p.heelBarSpacing);
  const heelAsMin = Math.max(0.26 * (fctm / p.fyk) * 1000 * dHeel, 0.0013 * 1000 * dHeel);
  const heelVRdc = (vRdcOf(heelAsProvided / (1000 * dHeel), dHeel, p.fck, p.gammaC) * 1000 * dHeel) / 1000;

  push("UL-07", "Stem flexure at footing top", "ULS", stemFlex.asRequired, "mm²/m", stemAsProvided, "mm²/m", safeRatio(stemFlex.asRequired, stemAsProvided), passFail(stemFlex.asRequired, stemAsProvided), "EN 1992-1-1 §6.1");
  push("UL-08", "Stem shear at footing top", "ULS", stemVEdGov, "kN/m", stemVRdc, "kN/m", safeRatio(stemVEdGov, stemVRdc), passFail(stemVEdGov, stemVRdc), "EN 1992-1-1 §6.2.2");
  push("UL-09", "Toe flexure at stem face", "ULS", toeFlex.asRequired, "mm²/m", toeAsProvided, "mm²/m", safeRatio(toeFlex.asRequired, toeAsProvided), passFail(toeFlex.asRequired, toeAsProvided), "EN 1992-1-1 §6.1");
  push("UL-10", "Toe shear at stem face", "ULS", toeVEdGov, "kN/m", toeVRdc, "kN/m", safeRatio(toeVEdGov, toeVRdc), passFail(toeVEdGov, toeVRdc), "EN 1992-1-1 §6.2.2");
  push("UL-11", "Heel flexure at stem face", "ULS", heelFlex.asRequired, "mm²/m", heelAsProvided, "mm²/m", safeRatio(heelFlex.asRequired, heelAsProvided), passFail(heelFlex.asRequired, heelAsProvided), "EN 1992-1-1 §6.1");
  push("UL-12", "Heel shear at stem face", "ULS", heelVEdGov, "kN/m", heelVRdc, "kN/m", safeRatio(heelVEdGov, heelVRdc), passFail(heelVEdGov, heelVRdc), "EN 1992-1-1 §6.2.2");

  // ----- Shear key (simplified short-cantilever nib check) -----
  let keyMEd = 0;
  let keyVEd = 0;
  let keyAsRequired = 0;
  if (p.hasShearKey) {
    const keyDepthM = p.keyDepth / 1000;
    const dryK = Math.min(embedmentM + keyDepthM, waterFrontM);
    const subK = Math.max(0, embedmentM + keyDepthM - dryK);
    const kPUse = c2.kP; // key checked under the more adverse (DA1-C2) passive strength
    const netPressureAtKeyTip = kPUse * (p.gammaPassive * dryK + Math.max(0, p.gammaPassive - GAMMA_W) * subK);
    const netPressureAtKeyTop = kPUse * (p.gammaPassive * Math.min(embedmentM, waterFrontM));
    const keyLoad = trapLoad(netPressureAtKeyTop, netPressureAtKeyTip, keyDepthM);
    keyMEd = keyLoad.resultant * (keyDepthM - keyLoad.centroidFromFreeEnd);
    keyVEd = keyLoad.resultant;
    const dKey = Math.max(50, p.keyWidth - p.cNomBuried * 2);
    keyAsRequired = flexuralDesign(keyMEd, dKey, p.fck, fyd).asRequired;
    push("UL-13", "Shear key flexure (simplified nib model)", "ULS", keyAsRequired, "mm²/m", stemAsProvided, "mm²/m", safeRatio(keyAsRequired, stemAsProvided), passFail(keyAsRequired, stemAsProvided), "EN 1992-1-1 §6.1 (simplified)");
  } else {
    push("UL-13", "Shear key flexure", "ULS", 0, "-", 0, "-", 0, "NOT VERIFIED", "No shear key modelled");
  }

  push("UL-14", "Minimum reinforcement — stem", "ULS", stemAsMin, "mm²/m", stemAsProvided, "mm²/m", safeRatio(stemAsMin, stemAsProvided), passFail(stemAsMin, stemAsProvided), "EN 1992-1-1 §9.2.1.1");
  push("UL-15", "Minimum reinforcement — toe", "ULS", toeAsMin, "mm²/m", toeAsProvided, "mm²/m", safeRatio(toeAsMin, toeAsProvided), passFail(toeAsMin, toeAsProvided), "EN 1992-1-1 §9.2.1.1");
  push("UL-16", "Minimum reinforcement — heel", "ULS", heelAsMin, "mm²/m", heelAsProvided, "mm²/m", safeRatio(heelAsMin, heelAsProvided), passFail(heelAsMin, heelAsProvided), "EN 1992-1-1 §9.2.1.1");

  // ----- Anchorage of stem bars into the footing (simplified) -----
  const fbd = 2.25 * (fctk005 / p.gammaC);
  const stemAnchorageRequired = (p.stemBarDiameter / 4) * (fyd / fbd);
  const stemAnchorageAvailable = Math.max(0, p.baseThickness - 2 * p.cNomBuried);
  push("DT-17", "Stem bar anchorage into footing", "Durability", stemAnchorageRequired, "mm", stemAnchorageAvailable, "mm", safeRatio(stemAnchorageRequired, stemAnchorageAvailable), passFail(stemAnchorageRequired, stemAnchorageAvailable), "EN 1992-1-1 §8.4 (simplified straight length)");

  push("DT-18", "Construction-joint shear-friction / dowel check", "Durability", 0, "-", 0, "-", 0, "NOT VERIFIED", "Out of scope — verify separately per EN 1992-1-1 §6.2.5");
  push("DT-19", "Global (slope) stability", "Durability", 0, "-", 0, "-", 0, "NOT VERIFIED", "Requires specialist slope-stability software");
  push("DT-20", "Settlement", "Durability", 0, "-", 0, "-", 0, "NOT VERIFIED", "Requires project geotechnical report");

  // ----- SLS crack width at stem base (quasi-permanent) -----
  const qpAct = earthActions(stemHeightM, kaRankine(p.phiBackfillDeg), p.gammaBackfill, waterBehindM, p.surchargeKpa * p.psi2Surcharge);
  const mQpStem = qpAct.earthMoment + qpAct.waterMoment + qpAct.surchargeMoment;
  const sigmaSqp = mQpStem > 0 ? (mQpStem * 1e6) / (stemAsProvided * 0.9 * dStem) / 1000 : 0; // MPa, lever arm ~0.9d approx
  const hMinusD = Math.max(10, p.stemBaseThickness - dStem);
  const acEff = 1000 * Math.min(2.5 * hMinusD, p.stemBaseThickness / 2);
  const rhoPeff = Math.max(1e-4, stemAsProvided / acEff);
  const alphaE = ES / ecm;
  const kt = 0.4;
  const k2 = 0.5;
  const srmax = 3.4 * p.cNomBuried + (0.425 * 0.8 * k2 * p.stemBarDiameter) / rhoPeff;
  const strainTerm = Math.max((sigmaSqp - kt * (fctm / rhoPeff) * (1 + alphaE * rhoPeff)) / ES, (0.6 * sigmaSqp) / ES);
  const crackWidthStem = srmax * strainTerm;
  push("SL-21", "Crack width — stem (quasi-permanent)", "SLS", crackWidthStem, "mm", p.wMax, "mm", safeRatio(crackWidthStem, p.wMax), passFail(crackWidthStem, p.wMax), "EN 1992-1-1 §7.3.4");
  push("SL-22", "Crack width — heel/toe (quasi-permanent)", "SLS", 0, "-", 0, "-", 0, "NOT VERIFIED", "Not automated in this version — check separately if governing");

  const listing = [...checks].sort((a, b) => b.utilization - a.utilization);
  const utilizationMax = listing.reduce((a, b) => Math.max(a, b.utilization), 0);
  const failed = listing.find((c) => c.status === "FAIL");
  let overallStatus: CantileverWallCheckStatus = "PASS";
  if (failed) overallStatus = "FAIL";
  else if (listing.some((c) => c.status === "WARNING") || utilizationMax > 0.9) overallStatus = "WARNING";

  return {
    fcd: round(fcd),
    fyd: round(fyd, 1),
    fctm: round(fctm, 2),
    fctk005: round(fctk005, 2),
    ecm: Math.round(ecm),
    totalHeight: Math.round(Hmm),
    baseWidth: Math.round(Bmm),
    stemAvgThickness: Math.round(stemAvgThickness),
    dStem: Math.round(dStem),
    dToe: Math.round(dToe),
    dHeel: Math.round(dHeel),
    combos: { c1, c2 },
    stemMEdGov: round(stemMEdGov),
    stemVEdGov: round(stemVEdGov),
    toeMEdGov: round(toeMEdGov),
    toeVEdGov: round(toeVEdGov),
    heelMEdGov: round(heelMEdGov),
    heelVEdGov: round(heelVEdGov),
    stemAsRequired: Math.round(stemFlex.asRequired),
    stemAsProvided: Math.round(stemAsProvided),
    stemAsMin: Math.round(stemAsMin),
    stemVRdc: round(stemVRdc),
    toeAsRequired: Math.round(toeFlex.asRequired),
    toeAsProvided: Math.round(toeAsProvided),
    toeAsMin: Math.round(toeAsMin),
    toeVRdc: round(toeVRdc),
    heelAsRequired: Math.round(heelFlex.asRequired),
    heelAsProvided: Math.round(heelAsProvided),
    heelAsMin: Math.round(heelAsMin),
    heelVRdc: round(heelVRdc),
    keyMEd: round(keyMEd),
    keyVEd: round(keyVEd),
    keyAsRequired: Math.round(keyAsRequired),
    stemAnchorageRequired: Math.round(stemAnchorageRequired),
    stemAnchorageAvailable: Math.round(stemAnchorageAvailable),
    sigmaSqp: round(sigmaSqp),
    crackWidthStem: round(crackWidthStem, 3),
    crackLimit: p.wMax,
    checks: listing,
    utilizationMax: round(utilizationMax, 2),
    governingName: listing[0]?.name ?? "—",
    overallStatus,
  };
}
