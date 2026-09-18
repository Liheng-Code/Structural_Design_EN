export const DEG = Math.PI / 180;

export function toRad(deg: number): number {
  return deg * DEG;
}

export function kaRankine(phiDeg: number): number {
  const p = toRad(phiDeg);
  const t = Math.tan(Math.PI / 4 - p / 2);
  return t * t;
}

export function kpRankine(phiDeg: number): number {
  const p = toRad(phiDeg);
  const t = Math.tan(Math.PI / 4 + p / 2);
  return t * t;
}

export function k0Jak(phiDeg: number): number {
  return 1 - Math.sin(toRad(phiDeg));
}

/** Coulomb active coefficient. Angles in degrees. β wall, i backfill, δ wall friction. */
export function kaCoulomb(phi: number, beta = 0, i = 0, delta = 0): number {
  const p = toRad(phi);
  const b = toRad(beta);
  const ii = toRad(i);
  const d = toRad(delta);
  const num = Math.cos(p - b) ** 2;
  const inner = (Math.sin(p + d) * Math.sin(p - ii)) / (Math.cos(d + b) * Math.cos(b - ii));
  if (inner < 0) return kaRankine(phi);
  const den = Math.cos(b) ** 2 * Math.cos(d + b) * (1 + Math.sqrt(inner)) ** 2;
  if (den <= 1e-12) return kaRankine(phi);
  return num / den;
}

export function kpCoulomb(phi: number, beta = 0, i = 0, delta = 0): number {
  const p = toRad(phi);
  const b = toRad(beta);
  const ii = toRad(i);
  const d = toRad(delta);
  const num = Math.cos(p + b) ** 2;
  const inner = (Math.sin(p + d) * Math.sin(p + ii)) / (Math.cos(d - b) * Math.cos(b - ii));
  if (inner < 0) return kpRankine(phi);
  const den = Math.cos(b) ** 2 * Math.cos(d - b) * (1 - Math.sqrt(inner)) ** 2;
  if (den <= 1e-12) return kpRankine(phi);
  return num / den;
}

export function trap(y: number[], x: number[]): number {
  let s = 0;
  for (let i = 1; i < x.length; i++) s += 0.5 * (y[i]! + y[i - 1]!) * (x[i]! - x[i - 1]!);
  return s;
}

export function trapMoment(p: number[], z: number[], z0: number): number {
  let s = 0;
  for (let i = 1; i < z.length; i++) {
    const p0 = p[i - 1]!;
    const p1 = p[i]!;
    const zA = z[i - 1]!;
    const zB = z[i]!;
    const dz = zB - zA;
    const F = 0.5 * (p0 + p1) * dz;
    const zbar = Math.abs(p0 + p1) < 1e-12 ? 0.5 * (zA + zB) : (p0 * zA + p1 * zB) / (p0 + p1) * 0.5 + 0.5 * 0.5 * (zA + zB);
    const lever = ((2 * p0 + p1) * zA + (p0 + 2 * p1) * zB) / (3 * (p0 + p1) + 1e-12);
    s += F * (lever - z0);
  }
  return s;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interp(xs: number[], ys: number[], x: number): number {
  if (x <= xs[0]!) return ys[0]!;
  if (x >= xs[xs.length - 1]!) return ys[ys.length - 1]!;
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]!) {
      const t = (x - xs[i - 1]!) / (xs[i]! - xs[i - 1]! || 1);
      return lerp(ys[i - 1]!, ys[i]!, t);
    }
  }
  return ys[ys.length - 1]!;
}

export function solveGauss(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    const row = new Array(n + 1);
    const Ai = A[i]!;
    for (let j = 0; j < n; j++) row[j] = Ai[j] ?? 0;
    row[n] = b[i] ?? 0;
    M[i] = row;
  }
  for (let k = 0; k < n; k++) {
    let piv = k;
    let best = Math.abs(M[k]![k]!);
    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(M[i]![k]!);
      if (v > best) {
        best = v;
        piv = i;
      }
    }
    if (best < 1e-18) continue;
    if (piv !== k) {
      const tmp = M[k]!;
      M[k] = M[piv]!;
      M[piv] = tmp;
    }
    const pk = M[k]![k]!;
    for (let j = k; j <= n; j++) M[k]![j]! /= pk;
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const f = M[i]![k]!;
      if (f === 0) continue;
      for (let j = k; j <= n; j++) M[i]![j]! -= f * M[k]![j]!;
    }
  }
  return M.map((row) => row[n]!);
}

export interface BeamResult {
  z: number[];
  y: number[];
  th: number[];
  V: number[];
  M: number[];
  p: number[];
}

/**
 * Hermitian beam FEM, 2 DOF/node (deflection m, rotation rad).
 * z from head (index 0) to toe. p(z) in kN/m² = kPa, positive in +y.
 * kSoil[i] Winkler modulus kN/m³ at node i (reaction -k*y).
 * springs: concentrated kN/m per metre of wall at given z.
 * EI in kN·m².
 */
export function beamFem(opts: {
  z: number[];
  p: number[];
  kSoil: number[];
  springs: { z: number; k: number }[];
  EI: number;
}): BeamResult {
  const z = opts.z;
  const n = z.length;
  const ndof = 2 * n;
  const K: number[][] = Array.from({ length: ndof }, () => Array(ndof).fill(0));
  const F = Array(ndof).fill(0);

  const add = (i: number, j: number, v: number) => {
    if (i < 0 || j < 0 || i >= ndof || j >= ndof) return;
    K[i]![j]! += v;
  };

  for (let e = 0; e < n - 1; e++) {
    const L = Math.abs(z[e + 1]! - z[e]!);
    if (L < 1e-9) continue;
    const EI = opts.EI;
    const a = EI / L ** 3;
    const ke = [
      [12 * a, 6 * a * L, -12 * a, 6 * a * L],
      [6 * a * L, 4 * a * L * L, -6 * a * L, 2 * a * L * L],
      [-12 * a, -6 * a * L, 12 * a, -6 * a * L],
      [6 * a * L, 2 * a * L * L, -6 * a * L, 4 * a * L * L],
    ];
    const idx = [2 * e, 2 * e + 1, 2 * e + 2, 2 * e + 3];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) add(idx[i]!, idx[j]!, ke[i]![j]!);

    const p1 = opts.p[e] ?? 0;
    const p2 = opts.p[e + 1] ?? 0;
    const V1 = (L / 20) * (7 * p1 + 3 * p2);
    const M1 = (L * L / 60) * (3 * p1 + 2 * p2);
    const V2 = (L / 20) * (3 * p1 + 7 * p2);
    const M2 = -(L * L / 60) * (2 * p1 + 3 * p2);
    F[2 * e]! += V1;
    F[2 * e + 1]! += M1;
    F[2 * e + 2]! += V2;
    F[2 * e + 3]! += M2;

    const k1 = opts.kSoil[e] ?? 0;
    const k2 = opts.kSoil[e + 1] ?? 0;
    const kavg = 0.5 * (k1 + k2);
    add(2 * e, 2 * e, kavg * L / 3);
    add(2 * e + 2, 2 * e + 2, kavg * L / 3);
    add(2 * e, 2 * e + 2, kavg * L / 6);
    add(2 * e + 2, 2 * e, kavg * L / 6);
  }

  for (const s of opts.springs) {
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(z[i]! - s.z);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    add(2 * nearest, 2 * nearest, s.k);
  }

  add(0, 0, 1e-4);
  add(ndof - 2, ndof - 2, 1e-4);

  const u = solveGauss(K, F);
  const y = Array(n).fill(0);
  const th = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    y[i] = u[2 * i] ?? 0;
    th[i] = u[2 * i + 1] ?? 0;
  }

  const M = Array(n).fill(0);
  const V = Array(n).fill(0);
  for (let e = 0; e < n - 1; e++) {
    const L = Math.abs(z[e + 1]! - z[e]!);
    if (L < 1e-9) continue;
    const EI = opts.EI;
    const y1 = y[e]!;
    const t1 = th[e]!;
    const y2 = y[e + 1]!;
    const t2 = th[e + 1]!;
    const Me1 = EI * (6 / L ** 2) * (y1 - y2) + EI * (4 / L) * t1 + EI * (2 / L) * t2;
    const Me2 = EI * (6 / L ** 2) * (y2 - y1) + EI * (2 / L) * t1 + EI * (4 / L) * t2;
    M[e] = e === 0 ? Me1 : 0.5 * (M[e]! + Me1);
    M[e + 1] = Me2;
    const p1 = opts.p[e] ?? 0;
    const p2 = opts.p[e + 1] ?? 0;
    const Ve = (Me1 + Me2) / L + 0.5 * (p1 + p2) * L;
    V[e] = e === 0 ? Ve : 0.5 * (V[e]! + Ve);
    V[e + 1] = Ve - 0.5 * (p1 + p2) * L;
  }

  return { z, y, th, V, M, p: opts.p };
}

export function ecmFromFck(fck: number): number {
  const fcm = fck + 8;
  return 22 * (fcm / 10) ** 0.3 * 1000;
}

export function fctm(fck: number): number {
  return 0.3 * fck ** (2 / 3);
}

export function statusFromEta(eta: number, pass = 1, warn = 0.9): "PASS" | "WARNING" | "FAIL" {
  if (!Number.isFinite(eta)) return "FAIL";
  if (eta > pass) return "FAIL";
  if (eta >= warn) return "WARNING";
  return "PASS";
}
