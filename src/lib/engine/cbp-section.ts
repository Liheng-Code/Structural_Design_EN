import type { NMPoint } from "./types";
import { ecmFromFck, fctm } from "./math";

export interface CircularSectionInput {
  diameter: number; // m
  cover: number; // mm
  barDiameter: number; // mm
  barCount: number;
  stirrupDiameter: number; // mm
  fck: number; // MPa
  fyk: number; // MPa
  gammaCconc: number;
  gammaS: number;
  alphaCc: number;
}

export interface CircularGeometry {
  Dmm: number;
  R: number;
  Ac_mm2: number;
  As_mm2: number;
  Ig_m4: number;
  rBar: number;
  barPositions: { angle: number; ymm: number; area: number }[];
}

export function circularGeometry(s: CircularSectionInput): CircularGeometry {
  const Dmm = s.diameter * 1000;
  const R = Dmm / 2;
  const Ac_mm2 = (Math.PI / 4) * Dmm * Dmm;
  const barArea = (Math.PI / 4) * s.barDiameter * s.barDiameter;
  const As_mm2 = s.barCount * barArea;
  const Ig_m4 = (Math.PI / 64) * s.diameter ** 4;
  const rBar = Math.max(R - s.cover - s.stirrupDiameter - s.barDiameter / 2, 1);
  const n = Math.max(Math.round(s.barCount), 0);
  const barPositions = Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / Math.max(n, 1);
    return { angle, ymm: rBar * Math.cos(angle), area: barArea };
  });
  return { Dmm, R, Ac_mm2, As_mm2, Ig_m4, rBar, barPositions };
}

export function cbpSolidRatio(diameter: number, spacing: number): number {
  return spacing > 0 ? diameter / spacing : 0;
}

/** EN 1992-1-1 §3.1.7 parabola-rectangle law, fck ≤ 50 MPa (εc2 = 0.002, εcu2 = 0.0035). */
function concreteStress(strain: number, fcd: number): number {
  const ec2 = 0.002;
  const ecu2 = 0.0035;
  if (strain <= 0) return 0;
  if (strain >= ecu2) return fcd;
  if (strain <= ec2) return fcd * (1 - (1 - strain / ec2) ** 2);
  return fcd;
}

/** Moment capacity read off the envelope at a given axial force (vertical-line method). */
export function capacityMAtN(envelope: NMPoint[], NTarget: number): number {
  return interpAtN(envelope, NTarget);
}

function interpAtN(envelope: NMPoint[], NTarget: number): number {
  for (let i = 1; i < envelope.length; i++) {
    const a = envelope[i - 1]!;
    const b = envelope[i]!;
    if ((a.N <= NTarget && b.N >= NTarget) || (a.N >= NTarget && b.N <= NTarget)) {
      const t = b.N === a.N ? 0 : (NTarget - a.N) / (b.N - a.N);
      return a.M + t * (b.M - a.M);
    }
  }
  return envelope[0]?.M ?? 0;
}

/**
 * N-M interaction envelope for a circular RC pile section, by fibre discretisation
 * (EN 1992-1-1 §3.1.7 stress-strain law), sweeping the neutral-axis depth `c` from the
 * extreme compression fibre with the compression-fibre strain fixed at ε_cu2. Only the
 * M ≥ 0 half is returned (N-M is symmetric about M=0 for a uniformly spaced bar cage) —
 * callers should use |M_Ed| against this envelope.
 *
 * ASSUMPTION: concrete compression is integrated over the gross circular area without
 * deducting the area occupied by the bars (standard simplification for a screening
 * interaction diagram; the effect is small relative to typical CBP reinforcement ratios).
 */
export function nmInteractionEnvelope(
  s: CircularSectionInput,
  opts?: { nSteps?: number },
): { envelope: NMPoint[]; NRd0: number; MRd0: number; balanced: NMPoint } {
  const geo = circularGeometry(s);
  const { R, Ac_mm2, As_mm2, barPositions } = geo;
  const fcd = (s.alphaCc * s.fck) / s.gammaCconc;
  const fyd = s.fyk / s.gammaS;
  const Es = 200000;
  const ecu2 = 0.0035;
  const nSteps = opts?.nSteps ?? 150;
  const nStrips = 150;
  const dy = (2 * R) / nStrips;

  function forcesAt(c: number): { N: number; M: number } {
    let Fc = 0;
    let Mc = 0;
    for (let i = 0; i < nStrips; i++) {
      const yTop = R - i * dy;
      const yMid = yTop - 0.5 * dy;
      const half = Math.sqrt(Math.max(R * R - yMid * yMid, 0));
      const width = 2 * half;
      const strain = (ecu2 * (yMid - (R - c))) / c;
      const stress = concreteStress(strain, fcd);
      const dF = stress * width * dy;
      Fc += dF;
      Mc += dF * yMid;
    }
    let Fs = 0;
    let Ms = 0;
    for (const bar of barPositions) {
      const strain = (ecu2 * (bar.ymm - (R - c))) / c;
      const stress = Math.max(-fyd, Math.min(fyd, Es * strain));
      const dF = stress * bar.area;
      Fs += dF;
      Ms += dF * bar.ymm;
    }
    return { N: (Fc + Fs) / 1000, M: (Mc + Ms) / 1e6 };
  }

  // NRd0/NtRd are the closed-form asymptotes the fibre sweep converges toward (gross Ac,
  // no bar-hole deduction — see the ASSUMPTION above); swept points are clamped to this
  // range so a finite-strip discretisation error can never break monotonicity in N.
  const NRd0 = (Ac_mm2 * fcd) / 1000 + (As_mm2 * fyd) / 1000;
  const NtRd = (As_mm2 * fyd) / 1000;

  const points: NMPoint[] = [];
  const cMin = 0.02 * geo.Dmm;
  const cMax = 30 * geo.Dmm;
  for (let i = 0; i <= nSteps; i++) {
    const t = i / nSteps;
    const c = cMin * (cMax / cMin) ** t;
    const { N, M } = forcesAt(c);
    points.push({ N: Math.min(Math.max(N, -NtRd), NRd0), M: Math.abs(M) });
  }
  points.sort((a, b) => a.N - b.N);

  const envelope: NMPoint[] = [{ N: -NtRd, M: 0 }, ...points, { N: NRd0, M: 0 }];
  let balanced = envelope[0]!;
  for (const p of envelope) if (p.M > balanced.M) balanced = p;
  const MRd0 = interpAtN(envelope, 0);

  return { envelope, NRd0, MRd0, balanced };
}

function raySegmentT(dx: number, dy: number, ax: number, ay: number, bx: number, by: number): number | null {
  const ex = bx - ax;
  const ey = by - ay;
  const det = ex * dy - ey * dx;
  if (Math.abs(det) < 1e-12) return null;
  const t = (ex * ay - ey * ax) / det;
  const s = (dx * ay - dy * ax) / det;
  if (s < -1e-9 || s > 1 + 1e-9 || t < 0) return null;
  return t;
}

/**
 * Radial-scaling utilization: the ratio of the origin-to-operating-point distance to the
 * origin-to-envelope-boundary distance along the same ray through (M_Ed, N_Ed). Handles
 * points outside the envelope (utilization > 1).
 */
export function nmUtilization(envelope: NMPoint[], NEd: number, MEd: number): number {
  const dM = Math.abs(MEd);
  const dN = NEd;
  if (dM < 1e-9 && Math.abs(dN) < 1e-9) return 0;
  const upper = envelope;
  const lower = [...envelope].reverse().map((p) => ({ N: p.N, M: -p.M }));
  const poly = [...upper, ...lower];
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i]!;
    const B = poly[(i + 1) % poly.length]!;
    const t = raySegmentT(dM, dN, A.M, A.N, B.M, B.N);
    if (t !== null && t > 1e-9 && t < best) best = t;
  }
  if (!Number.isFinite(best) || best <= 0) return 99;
  return 1 / best;
}

/**
 * EN 1992-1-1 §6.2.2 shear resistance without designed shear reinforcement, generalised
 * with the axial-compression enhancement term (eq 6.2.a, k1 = 0.15).
 * ASSUMPTION: circular section reduced to an effective rectangular chord, bw ≈ 0.9D,
 * d ≈ 0.8D, pending a validated circular-section shear method — flag for engineering
 * confirmation.
 */
export function vrdCircular(D_mm: number, As_mm2: number, fck: number, gammaC: number, NEdCompression_kN: number, Ac_mm2: number): number {
  const bw = 0.9 * D_mm;
  const d = 0.8 * D_mm;
  const k = Math.min(1 + Math.sqrt(200 / d), 2.0);
  const rho = Math.min(As_mm2 / 2 / (bw * d), 0.02);
  const Crd = 0.18 / gammaC;
  const fcd = fck / gammaC;
  const sigmaCp = Math.min((Math.max(NEdCompression_kN, 0) * 1000) / Math.max(Ac_mm2, 1), 0.2 * fcd);
  const k1 = 0.15;
  const v = Crd * k * (100 * rho * fck) ** (1 / 3) + k1 * sigmaCp;
  const vmin = 0.035 * k ** 1.5 * Math.sqrt(fck) + k1 * sigmaCp;
  const vuse = Math.max(v, vmin);
  return (vuse * bw * d) / 1000;
}

/**
 * EN 1992-1-1 §9.8.5 pile-specific minimum longitudinal reinforcement (0.5% Ac for
 * Ac ≤ 0.5 m², 0.25% Ac for Ac ≥ 1.0 m², linear interpolation between), cross-checked
 * against the general column minimum of §9.5.2 (0.10 N_Ed/f_yd, not less than 0.002 Ac).
 * Maximum per §9.5.2 (0.04 Ac outside laps).
 */
export function minMaxLongitudinalRatio(NEd_kN: number, Ac_mm2: number, fyd: number): { asMin: number; asMax: number } {
  const Ac_m2 = Ac_mm2 / 1e6;
  const t = Math.min(Math.max((Ac_m2 - 0.5) / (1.0 - 0.5), 0), 1);
  const pileRatio = 0.005 + t * (0.0025 - 0.005);
  const asMinPile = pileRatio * Ac_mm2;
  const asMinColumn = Math.max((0.1 * Math.max(NEd_kN, 0) * 1000) / Math.max(fyd, 1), 0.002 * Ac_mm2);
  const asMin = Math.max(asMinPile, asMinColumn);
  const asMax = 0.04 * Ac_mm2;
  return { asMin, asMax };
}

/** EN 1992-1-1 §9.5.3 general column transverse reinforcement provisions. */
export function transverseCheck(barDiameter: number, stirrupDiameter: number, Dmm: number): { diaMin: number; spacingMax: number } {
  const diaMin = Math.max(6, barDiameter / 4);
  const spacingMax = Math.min(20 * barDiameter, Dmm, 400);
  return { diaMin, spacingMax };
}

/** Adapted from the sheet-pile crackWidth() pattern for a circular tension chord. */
export function crackWidthCircular(s: CircularSectionInput, MEd_kNm: number): number {
  const geo = circularGeometry(s);
  const Dmm = geo.Dmm;
  const dEff = 0.8 * Dmm;
  const As = geo.As_mm2 / 2;
  const z = 0.9 * dEff;
  const sigmaS = (Math.abs(MEd_kNm) * 1e6) / Math.max(As * z, 1);
  const Es = 200000;
  const fct = fctm(s.fck);
  const hcEff = Math.min(2.5 * (Dmm - dEff), Dmm / 2);
  const AcEff = Math.max(hcEff, 20) * Dmm;
  const rhoP = As / Math.max(AcEff, 1);
  const kt = 0.4;
  const ae = Es / Math.max(ecmFromFck(s.fck), 1);
  let eps = (sigmaS - kt * (fct / Math.max(rhoP, 1e-6)) * (1 + ae * rhoP)) / Es;
  eps = Math.max(eps, (0.6 * sigmaS) / Es);
  const cnom = s.cover;
  const k1 = 0.8;
  const k2 = 0.5;
  const k3 = 3.4;
  const k4 = 0.425;
  const sr = k3 * cnom + (k1 * k2 * k4 * s.barDiameter) / Math.max(rhoP, 1e-6);
  const wk = sr * eps;
  return Math.max(wk, 0);
}

/** EN 1992-1-1 §8.4 basic anchorage length. ASSUMPTION: good bond conditions, η1=η2=1. */
export function anchorageLength(barDiameter: number, fck: number, fyk: number, gammaC: number, gammaS: number): number {
  const fctd = (0.7 * fctm(fck)) / gammaC;
  const fbd = 2.25 * fctd;
  const fyd = fyk / gammaS;
  return (barDiameter / 4) * (fyd / fbd);
}

/** EN 1992-1-1 §8.7 lap length. ASSUMPTION: α1=α2=α3=α5=1 (straight bars, no transverse pressure/confinement credit). */
export function lapLength(barDiameter: number, fck: number, fyk: number, gammaC: number, gammaS: number, pctLapped: number): number {
  const lbrqd = anchorageLength(barDiameter, fck, fyk, gammaC, gammaS);
  const alpha6 = pctLapped <= 25 ? 1.0 : pctLapped <= 33 ? 1.15 : pctLapped <= 50 ? 1.4 : 1.5;
  const l0min = Math.max(0.3 * alpha6 * lbrqd, 15 * barDiameter, 200);
  return Math.max(alpha6 * lbrqd, l0min);
}
