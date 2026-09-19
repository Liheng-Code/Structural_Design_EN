import type { PileCapAnalysisResult, PileCapCheck, PileCapCheckStatus, PileCapProject } from "./types";

const UNIT_WEIGHT_CONCRETE = 25; // kN/m3
const ES = 200000; // MPa

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

export function analyzePileCap(project: PileCapProject): PileCapAnalysisResult {
  const checks: PileCapCheck[] = [];

  const push = (
    id: string,
    name: string,
    category: PileCapCheck["category"],
    demand: number,
    demandUnit: string,
    resistance: number,
    resistanceUnit: string,
    utilization: number,
    status: PileCapCheckStatus,
    clause: string,
  ) => {
    checks.push({ id, name, category, demand, demandUnit, resistance, resistanceUnit, utilization, status, clause });
  };

  const p = {
    fck: Math.max(10, pos(project.fck, 30)),
    fyk: Math.max(400, pos(project.fyk, 500)),
    gammaC: pos(project.gammaC, 1.5),
    gammaS: pos(project.gammaS, 1.15),
    alphaCC: Number.isFinite(project.alphaCC) ? project.alphaCC : 0.85,
    cNom: Math.max(10, pos(project.cNom, 40)),
    wMax: nonNeg(project.wMax, 0.3),
    columnLengthX: pos(project.columnLengthX, 600),
    columnWidthY: pos(project.columnWidthY, 400),
    nEd: nonNeg(project.nEd, 0),
    mEd: nonNeg(project.mEd, 0),
    hEd: nonNeg(project.hEd, 0),
    pileDiameter: pos(project.pileDiameter, 800),
    pileSpacing: pos(project.pileSpacing, 2400),
    capLength: pos(project.capLength, 3500),
    capWidth: pos(project.capWidth, 1100),
    capDepth: pos(project.capDepth, 1400),
    tieBarDiameter: pos(project.tieBarDiameter, 25),
    tieBarCount: Math.max(1, Math.round(pos(project.tieBarCount, 7))),
    tieBandWidth: pos(project.tieBandWidth, 800),
    nQp: nonNeg(project.nQp, 0),
    mQp: nonNeg(project.mQp, 0),
  };

  // ----- Concrete / steel material factors -----
  const fcd = p.alphaCC * (p.fck / p.gammaC); // MPa (alphaCC = 0.85 for UK NA)
  const fyd = p.fyk / p.gammaS; // MPa
  const fctm = 0.3 * Math.cbrt(p.fck * p.fck); // EC2 Table 3.1
  const fctk005 = 0.7 * fctm; // MPa
  const nu1 = 0.6 * (1 - p.fck / 250); // EN 1992-1-1 (6.9)
  const ecm = 22000 * Math.pow((p.fck + 8) / 10, 0.3);

  // ----- Geometry / STM -----
  const d = Math.max(50, p.capDepth - p.cNom - p.tieBarDiameter / 2);
  const strutAngleRad = Math.atan((2 * d) / p.pileSpacing);
  const strutAngleDeg = (strutAngleRad * 180) / Math.PI;
  const cotTheta = 1 / Math.tan(strutAngleRad);
  const strutAngleOK = strutAngleDeg >= 45;

  // ----- Actions -----
  const capSelfWeight = (p.capLength / 1000) * (p.capWidth / 1000) * (p.capDepth / 1000) * UNIT_WEIGHT_CONCRETE;
  const totalN = p.nEd + 1.35 * capSelfWeight; // gammaG permanent
  const totalM = p.mEd + p.hEd * (p.capDepth / 1000);
  const meanPerPile = totalN / 2;
  const momentEffect = p.mEd > 0 || p.hEd > 0 ? totalM / (p.pileSpacing / 1000) : 0;
  const reactionHigh = meanPerPile + momentEffect;
  const reactionLow = Math.max(0, meanPerPile - momentEffect);
  const hasUplift = meanPerPile - momentEffect < 0;

  // ----- STM forces -----
  const tieForce = reactionHigh * cotTheta;
  const strutForce = reactionHigh / Math.sin(strutAngleRad);

  // ----- Tie reinforcement -----
  const asRequired = (tieForce * 1000) / fyd;
  const asProvided = p.tieBarCount * barArea(p.tieBarDiameter);
  const rebarRatio = (asProvided / (p.capWidth * d)) * 100;
  const asMin = Math.max(0.26 * (fctm / p.fyk) * p.tieBandWidth * d, 0.0013 * p.tieBandWidth * d);

  // ----- Strut / node stresses -----
  const strutArea = p.pileDiameter * p.capWidth;
  const strutStressEd = (strutForce * 1000) / strutArea;
  const strutStressRd = 0.6 * nu1 * fcd; // transverse-tension strut
  const nodeColStressEd = (totalN * 1000) / (p.columnLengthX * p.columnWidthY);
  const nodeColStressRd = fcd; // CCC node
  const pileArea = (Math.PI * p.pileDiameter * p.pileDiameter) / 4;
  const nodePileStressEd = (reactionHigh * 1000) / pileArea;
  const nodePileStressRd = 0.8 * fcd; // CCT node

  // ----- Shear & punching -----
  const k = Math.min(2, 1 + Math.sqrt(200 / d));
  const rhoL = Math.min(0.02, asProvided / (p.capWidth * d));
  const vRdc = Math.max(
    (0.18 / p.gammaC) * k * Math.cbrt(100 * rhoL * p.fck),
    0.035 * Math.sqrt(k * k * k) * Math.sqrt(p.fck),
  ); // MPa
  const vRdmax = 0.5 * nu1 * fcd;

  const clearPileToColumn = p.pileSpacing / 2 - p.pileDiameter / 2 - p.columnLengthX / 2;
  const avEff = Math.max(0.5 * d, Math.min(Math.max(0, clearPileToColumn), 2 * d));
  const beta = clearPileToColumn > 0 ? (2 * d) / avEff : 1;
  const beamShearEd = reactionHigh;
  const beamShearRd = (beta * vRdc * p.capWidth * d) / 1000;

  const uCol = 2 * (p.columnLengthX + p.columnWidthY) + 2 * Math.PI * 2 * d;
  const colPunchEd = (totalN * 1000) / (uCol * d);
  const colPunchRd = vRdc;

  const uPile = Math.PI * (p.pileDiameter + 4 * d);
  const pilePunchEd = (reactionHigh * 1000) / (uPile * d);
  const pilePunchRd = vRdc;

  // ----- SLS crack width -----
  const rQpHigh = p.nQp / 2 + p.mQp / (p.pileSpacing / 1000);
  const tieForceQp = rQpHigh * cotTheta;
  const sigmaSqp = (tieForceQp * 1000) / asProvided;
  const hMinusD = Math.max(10, p.capDepth - d);
  const acEff = p.tieBandWidth * Math.min(2.5 * hMinusD, 100, p.capDepth / 2);
  const rhoPeff = slot(asProvided / acEff);
  const alphaE = ES / ecm;
  const kt = 0.4;
  const k2 = 0.5;
  const srmax = 3.4 * p.cNom + (0.425 * 0.8 * k2 * p.tieBarDiameter) / rhoPeff;
  const strainTerm = Math.max(
    (sigmaSqp - kt * (fctm / rhoPeff) * (1 + alphaE * rhoPeff)) / ES,
    0.6 * sigmaSqp / ES,
  );
  const crackWidth = srmax * strainTerm;

  // ----- Anchorage -----
  const fbd = 2.25 * (fctk005 / p.gammaC);
  const anchorageLength = (p.tieBarDiameter / 4) * (Math.min(sigmaSqp, fyd) / fbd);
  const lengthPastPile = Math.max(0, (p.pileSpacing - p.pileDiameter) / 2 - p.cNom);

  // ============ Checks matrix ============
  push("EQ-01", "Reaction equilibrium & uplift", "Geometry", reactionLow, "kN", 0, "kN", hasUplift ? 1 : safeRatio(reactionLow, reactionHigh), hasUplift ? "FAIL" : "PASS", "EN 1990 · ΣV");
  push("GE-02", "Strut angle θ ≥ 45°", "Geometry", strutAngleDeg, "°", 45, "°", strutAngleOK ? safeRatio(45, strutAngleDeg) : 1, strutAngleOK ? "PASS" : "WARNING", "EC2 §6.5 · UK practice");
  push("UL-03", "Tension tie As ≥ F_td/fyd", "ULS", asRequired, "mm²", asProvided, "mm²", safeRatio(asRequired, asProvided), passFail(asRequired, asProvided), "EN 1992-1-1 §6.5.3");
  push("UL-04", "Strut compression (transverse tension)", "ULS", strutStressEd, "MPa", strutStressRd, "MPa", safeRatio(strutStressEd, strutStressRd), passFail(strutStressEd, strutStressRd), "EN 1992-1-1 §6.5.2 / (6.14)");
  push("UL-05", "Column CCC node bearing", "ULS", nodeColStressEd, "MPa", nodeColStressRd, "MPa", safeRatio(nodeColStressEd, nodeColStressRd), passFail(nodeColStressEd, nodeColStressRd), "EN 1992-1-1 §6.5.4");
  push("UL-06", "Pile CCT node bearing", "ULS", nodePileStressEd, "MPa", nodePileStressRd, "MPa", safeRatio(nodePileStressEd, nodePileStressRd), passFail(nodePileStressEd, nodePileStressRd), "EN 1992-1-1 §6.5.4");
  push("UL-07", "Wide beam shear (enhanced)", "ULS", beamShearEd, "kN", beamShearRd, "kN", safeRatio(beamShearEd, beamShearRd), passFail(beamShearEd, beamShearRd), "EN 1992-1-1 §6.2.2(6)");
  push("UL-08", "Column punching (2.0d perimeter)", "ULS", colPunchEd, "MPa", colPunchRd, "MPa", safeRatio(colPunchEd, colPunchRd), passFail(colPunchEd, colPunchRd), "EN 1992-1-1 §6.4.3/6.4.4");
  push("UL-09", "Pile punching (2.0d perimeter)", "ULS", pilePunchEd, "MPa", pilePunchRd, "MPa", safeRatio(pilePunchEd, pilePunchRd), passFail(pilePunchEd, pilePunchRd), "EN 1992-1-1 §6.4.7");
  push("UL-10", "Minimum reinforcement", "ULS", asMin, "mm²", asProvided, "mm²", safeRatio(asMin, asProvided), passFail(asMin, asProvided), "EN 1992-1-1 §9.2.1.1");
  push("SL-11", "Tie steel stress (QP)", "SLS", sigmaSqp, "MPa", 0.8 * p.fyk, "MPa", safeRatio(sigmaSqp, 0.8 * p.fyk), passFail(sigmaSqp, 0.8 * p.fyk), "EN 1992-1-1 §7.2(2)");
  push("SL-12", "Crack width (QP)", "SLS", crackWidth, "mm", p.wMax, "mm", safeRatio(crackWidth, p.wMax), passFail(crackWidth, p.wMax), "EN 1992-1-1 §7.3.4");

  const listing = sortChecks(checks);
  const utilizationMax = utilizationMaxOf(listing);
  const failed = listing.find((c) => c.status === "FAIL");
  let overallStatus: PileCapCheckStatus = "PASS";
  if (failed || hasUplift) overallStatus = "FAIL";
  else if (listing.some((c) => c.status === "WARNING") || utilizationMax > 0.9) overallStatus = "WARNING";

  return {
    fcd: round(fcd),
    fyd: round(fyd, 1),
    fctm: round(fctm, 2),
    fctk005: round(fctk005, 2),
    nu1: round(nu1, 3),
    ecm: Math.round(ecm),
    effectiveDepth: round(d),
    strutAngleDeg: round(strutAngleDeg),
    strutAngleOK,
    capSelfWeight: round(capSelfWeight),
    totalN: round(totalN),
    totalM: round(totalM),
    reactionHigh: round(reactionHigh),
    reactionLow: round(reactionLow),
    hasUplift,
    tieForce: round(tieForce),
    strutForce: round(strutForce),
    asRequired: Math.round(asRequired),
    asProvided: Math.round(asProvided),
    rebarRatio: round(rebarRatio, 2),
    strutStressEd: round(strutStressEd, 2),
    strutStressRd: round(strutStressRd, 2),
    nodeColStressEd: round(nodeColStressEd, 2),
    nodeColStressRd: round(nodeColStressRd, 2),
    nodePileStressEd: round(nodePileStressEd, 2),
    nodePileStressRd: round(nodePileStressRd, 2),
    vRdc: round(vRdc, 3),
    vRdmax: round(vRdmax, 2),
    beamShearEd: round(beamShearEd),
    beamShearRd: round(beamShearRd),
    colPunchEd: round(colPunchEd, 3),
    colPunchRd: round(colPunchRd, 3),
    pilePunchEd: round(pilePunchEd, 3),
    pilePunchRd: round(pilePunchRd, 3),
    asMin: Math.round(asMin),
    sigmaSqp: round(sigmaSqp),
    crackWidth: round(crackWidth, 3),
    crackLimit: p.wMax,
    srmax: Math.round(srmax),
    anchorageLength: Math.round(anchorageLength),
    lengthPastPile: Math.round(lengthPastPile),
    checks: listing,
    utilizationMax: round(utilizationMax, 2),
    governingName: listing[0]?.name ?? "—",
    overallStatus,
  };
}

function slot(value: number): number {
  return Math.max(1e-4, value);
}

function safeRatio(demand: number, resistance: number): number {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return 1;
  if (resistance <= 0) return 1;
  return round(demand / resistance, 3);
}

function passFail(demand: number, resistance: number): PileCapCheckStatus {
  if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return "NOT VERIFIED";
  return demand > resistance ? "FAIL" : "PASS";
}

function utilizationMaxOf(list: PileCapCheck[]): number {
  return list.reduce((a, b) => Math.max(a, b.utilization), 0);
}

function sortChecks(list: PileCapCheck[]): PileCapCheck[] {
  return [...list].sort((a, b) => b.utilization - a.utilization);
}