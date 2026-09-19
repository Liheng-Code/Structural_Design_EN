import type {
  Project,
  Station,
  AnalysisResult,
  CheckResult,
  QCItem,
  VariableRow,
  LoadCaseResult,
  LoadCaseDef,
  CalcBundle,
  Status,
  TieForce,
  ParametricRow,
  SoilLayer,
} from "./types";
import {
  kaRankine,
  kpRankine,
  k0Jak,
  kaCoulomb,
  kpCoulomb,
  trap,
  beamFem,
  ecmFromFck,
  fctm,
  statusFromEta,
  mkCheck,
} from "./math";
import { cbpWallChecks, variablesCbp } from "./cbp-checks";
import { cbpSolidRatio } from "./cbp-section";
import { fmt } from "../utils";

const N = 49;

function nativeAt(layers: SoilLayer[], z: number): SoilLayer | null {
  const hit = layers.find((l) => z <= l.zTop + 1e-9 && z >= l.zBot - 1e-9);
  if (hit) return hit;
  const sorted = [...layers].sort((a, b) => b.zTop - a.zTop);
  if (!sorted.length) return null;
  if (z > sorted[0]!.zTop) return sorted[0]!;
  return sorted[sorted.length - 1]!;
}

function phiDesign(phi: number, gPhi: number): number {
  return (Math.atan(Math.tan((phi * Math.PI) / 180) / gPhi) * 180) / Math.PI;
}

function coeffs(project: Project, phi: number): { Ka: number; Kp: number; K0: number } {
  const pd = phiDesign(phi, project.factors.gammaPhi);
  const method = project.earth.method;
  const K0 = k0Jak(pd);
  if (method === "user-ka") return { Ka: project.earth.userKa, Kp: project.earth.userKp, K0 };
  if (method === "coulomb") {
    return {
      Ka: kaCoulomb(pd, 0, project.earth.backfillSlope, project.earth.wallFriction),
      Kp: kpCoulomb(pd, 0, project.earth.backfillSlope, project.earth.wallFriction) * project.earth.passiveReduction,
      K0,
    };
  }
  if (method === "at-rest" || project.earth.useK0IfRestrained) {
    return { Ka: K0, Kp: kpRankine(pd) * project.earth.passiveReduction, K0 };
  }
  return { Ka: kaRankine(pd), Kp: kpRankine(pd) * project.earth.passiveReduction, K0 };
}

export interface WaterState {
  up: number;
  down: number;
  core: number;
}

export function waterForCase(p: Project, lc: LoadCaseDef): WaterState {
  const w = p.water;
  switch (lc.waterMode) {
    case "dry":
      return { up: w.dryUp, down: w.dryDown, core: w.coreDry };
    case "flood":
      return { up: w.floodUp, down: w.floodDown, core: w.coreFlood };
    case "flood-up":
      return { up: w.floodUp, down: w.dryDown, core: w.coreFlood };
    case "flood-down":
      return { up: w.dryUp, down: w.floodDown, core: w.coreFlood };
    case "max-diff":
      return { up: Math.max(w.floodUp, w.dryUp), down: Math.min(w.floodDown, w.dryDown), core: w.coreFlood };
    case "rapid-drawdown":
      return { up: w.dryUp, down: w.dryDown, core: Math.max(w.coreFlood, w.floodUp * 0.7) };
    case "custom":
      return { up: lc.customUp ?? w.floodUp, down: lc.customDown ?? w.floodDown, core: lc.customCore ?? w.coreFlood };
    default:
      return { up: w.dryUp, down: w.dryDown, core: w.coreDry };
  }
}

function surcharge(p: Project, trafficOn: boolean, constructionOn: boolean): number {
  if (!trafficOn && !constructionOn) return 0;
  const t = p.traffic;
  let q = 0;
  if (t.model === "uniform" || t.model === "combined" || t.model === "user") q += t.q;
  if (t.model === "vehicle" || t.model === "combined") {
    const area = Math.max(t.distWidth * Math.max(t.axleSpacing * t.nAxles, 1), 0.5);
    q += (t.axleLoad * t.nAxles * t.DAF) / area;
  }
  if (t.model === "strip" || t.model === "combined") q += t.q;
  if (constructionOn) q += t.plantLoad + t.craneLoad + t.stockpile;
  return q;
}

function uAt(z: number, wl: number, gw: number): number {
  const water = Math.max(wl, gw);
  return Math.max(0, water - z) * 9.81;
}

function sigVNative(p: Project, z: number, wl: number): { tot: number; u: number; eff: number } {
  if (z >= p.geometry.riverbed) return { tot: 0, u: Math.max(0, wl - z) * p.water.gammaW, eff: 0 };
  let tot = 0;
  const layers = [...p.nativeLayers].sort((a, b) => b.zTop - a.zTop);
  let cursor = p.geometry.riverbed;
  for (const L of layers) {
    const top = Math.min(cursor, L.zTop);
    const bot = Math.max(z, L.zBot);
    if (bot >= top) continue;
    const sat = 0.5 * (top + bot) < wl;
    tot += (sat ? L.gammaSat : L.gamma) * (top - bot);
    cursor = bot;
    if (cursor <= z + 1e-9) break;
  }
  const u = Math.max(0, wl - z) * p.water.gammaW;
  return { tot, u, eff: Math.max(0, tot - u) };
}

function sigVCore(p: Project, z: number, fillPlaced: boolean, roadPlaced: boolean, coreWL: number): { tot: number; u: number; eff: number } {
  const H = p.geometry.retainedHeight;
  const rb = p.geometry.riverbed;
  const topFill = rb + H;
  let tot = 0;
  if (roadPlaced) {
    tot += p.pavement.asphalt * p.pavement.gammaAsphalt + p.pavement.subbase * p.pavement.gammaSubbase;
  }
  if (fillPlaced && z < topFill) {
    const zTop = topFill;
    const zBot = Math.max(z, rb);
    if (zBot < zTop) {
      const mid = 0.5 * (zTop + zBot);
      const sat = mid < coreWL;
      tot += (sat ? p.coreFill.gammaSat : p.coreFill.gamma) * (zTop - zBot);
    }
  }
  if (z < rb) {
    const nat = sigVNative(p, z, Math.max(coreWL, p.water.gwlNative));
    tot += nat.tot;
    const u = Math.max(0, Math.max(coreWL, p.water.gwlNative) - z) * p.water.gammaW;
    return { tot, u, eff: Math.max(0, tot - u) };
  }
  const u = Math.max(0, coreWL - z) * p.water.gammaW;
  return { tot, u, eff: Math.max(0, tot - u) };
}

export function buildStations(
  p: Project,
  water: WaterState,
  opts: { trafficOn: boolean; constructionOn: boolean; fillPlaced: boolean; roadPlaced: boolean; oneSided: boolean },
): Station[] {
  const top = p.geometry.riverbed + p.geometry.retainedHeight + (p.capping.enabled ? p.capping.h : 0);
  const toe = p.geometry.riverbed - p.geometry.embedment;
  const q = surcharge(p, opts.trafficOn, opts.constructionOn);
  const fillC = coeffs(p, p.coreFill.phi);
  const stations: Station[] = [];
  for (let i = 0; i < N; i++) {
    const z = top - (i / (N - 1)) * (top - toe);
    const nat = nativeAt(p.nativeLayers, Math.min(z, p.geometry.riverbed - 0.001));
    const phiOut = z > p.geometry.riverbed ? p.coreFill.phi : (nat?.phi ?? 30);
    const outC = coeffs(p, phiOut);
    const cCore = p.earth.assumeNoCohesion ? 0 : p.coreFill.c / p.factors.gammaC;
    const cOut = p.earth.assumeNoCohesion ? 0 : (nat?.c ?? 0) / p.factors.gammaC;

    const outL = sigVNative(p, z, water.up);
    const outR = sigVNative(p, z, water.down);
    const core = sigVCore(p, z, opts.fillPlaced, opts.roadPlaced, water.core);

    const uUp = Math.max(0, water.up - z) * p.water.gammaW;
    const uDown = Math.max(0, water.down - z) * p.water.gammaW;
    const uCore = Math.max(0, water.core - z) * p.water.gammaW;

    const KaOut = outC.Ka;
    const KaCore = fillC.Ka;
    const KpOut = outC.Kp;
    const K0Core = fillC.K0;

    const KhCore = p.earth.useK0IfRestrained ? K0Core : KaCore;

    const pSoilCore = Math.max(0, KhCore * core.eff - 2 * cCore * Math.sqrt(Math.max(KhCore, 0)));
    const pSoilOutL = z <= p.geometry.riverbed ? Math.max(0, KaOut * outL.eff - 2 * cOut * Math.sqrt(Math.max(KaOut, 0))) : 0;
    const pSoilOutR = z <= p.geometry.riverbed ? Math.max(0, KaOut * outR.eff - 2 * cOut * Math.sqrt(Math.max(KaOut, 0))) : 0;
    const pPassive = z <= p.geometry.riverbed ? Math.max(0, KpOut * outL.eff + 2 * cOut * Math.sqrt(Math.max(KpOut, 0))) : 0;

    const pSur = opts.fillPlaced ? KhCore * q : 0;

    const pWaterNetL = uUp - uCore;
    const pWaterNetR = uDown - uCore;

    const extL = z > p.geometry.riverbed ? uUp : pSoilOutL + uUp;
    const extR = z > p.geometry.riverbed ? uDown : pSoilOutR + uDown;
    const inn = (opts.fillPlaced ? pSoilCore + pSur : 0) + uCore;

    let pNetL = inn - extL;
    let pNetR = inn - extR;
    if (opts.oneSided) {
      pNetL = inn + (z <= p.geometry.riverbed ? 0 : 0) - 0;
      pNetR = 0;
    }

    stations.push({
      z,
      uUp,
      uDown,
      uCore,
      sigVOut: outL.tot,
      sigVCore: core.tot,
      sigEffOut: outL.eff,
      sigEffCore: core.eff,
      pSoilOut: pSoilOutL,
      pSoilCore,
      pWaterNetL,
      pWaterNetR,
      pSur,
      pNetL,
      pNetR,
      pPassive,
      KaOut,
      KaCore,
      KpOut,
    });
  }
  return stations;
}

function analyseWall(
  p: Project,
  stations: Station[],
  netKey: "pNetL" | "pNetR",
  tiesEnabled: boolean,
  nTies: number,
  accidentalFail: boolean,
): AnalysisResult {
  const t = p.geometry.wallThickness;
  const b = 1.0;
  let EI: number;
  let kSoil: number[];
  if (p.wallSystem === "cbp") {
    const s = Math.max(p.cbp.spacing, 0.05);
    const Ecm = ecmFromFck(p.cbp.fck);
    if (p.cbp.lateralModel === "individual-pile") {
      // Each pile's own stiffness, smeared to a per-metre-of-wall value by dividing by
      // the pile spacing (Master Prompt §20 — do not treat spaced piles as a solid
      // diaphragm wall).
      const IgPile = (Math.PI / 64) * p.cbp.diameter ** 4;
      EI = (Ecm * IgPile * 1000) / s;
      kSoil = stations.map((st) => {
        if (st.z > p.geometry.riverbed) return 0;
        const depth = p.geometry.riverbed - st.z;
        const kh = p.cbp.khUser && p.cbp.khUser > 0 ? p.cbp.khUser : p.cbp.nh * Math.max(depth, 0.1);
        // Soil reacts against the pile width only, not the full metre run.
        return kh * (p.cbp.diameter / s);
      });
    } else {
      // Equivalent-wall idealisation: a solid rectangular section of thickness D — the
      // riskier assumption flagged by the mandatory Master Prompt §61 warning.
      const IgWall = (1 * p.cbp.diameter ** 3) / 12;
      EI = Ecm * IgWall * 1000;
      kSoil = stations.map((st) => {
        if (st.z > p.geometry.riverbed) return 0;
        const depth = p.geometry.riverbed - st.z;
        return p.cbp.khUser && p.cbp.khUser > 0 ? p.cbp.khUser : p.cbp.nh * Math.max(depth, 0.1);
      });
    }
  } else {
    const Ig = p.sheetPile.Ioverride ?? (b * t ** 3) / 12;
    const Ecm = p.sheetPile.EcmOverride ?? ecmFromFck(p.sheetPile.fck);
    EI = Ecm * Ig * p.sheetPile.IeffFactor * 1000;
    kSoil = stations.map((st) => {
      if (st.z > p.geometry.riverbed) return 0;
      const depth = p.geometry.riverbed - st.z;
      if (p.sheetPile.khUser && p.sheetPile.khUser > 0) return p.sheetPile.khUser;
      return p.sheetPile.nh * Math.max(depth, 0.1);
    });
  }
  const z = stations.map((s) => s.z);
  const pNet = stations.map((s) => s[netKey]);

  const springs: { z: number; k: number }[] = [];
  const activeTies = tiesEnabled
    ? p.ties.filter((tr) => tr.enabled).slice(0, nTies < 0 ? 99 : nTies)
    : [];
  if (accidentalFail && activeTies.length) activeTies.pop();

  const Binner = p.geometry.totalWidth - 2 * p.geometry.wallThickness;
  const isU =
    p.designType.startsWith("u-shape") || p.designType === "double-sheet" || p.designType === "custom";

  for (const tr of activeTies) {
    const dNet = Math.max(tr.diameter - 2 * tr.corrosion, 1) / 1000;
    const A = (Math.PI / 4) * dNet * dNet;
    const Es = 210e6;
    const Ltie = Math.max(Binner, 0.5);
    const kOne = (Es * A) / Ltie;
    const kPerM = ((isU ? 2 : 1) * kOne * tr.threadEff * tr.connectionEff) / Math.max(tr.spacing, 0.3);
    springs.push({ z: tr.elevation, k: kPerM });
  }

  const fem = beamFem({ z, p: pNet, kSoil, springs, EI });

  const ties: TieForce[] = activeTies.map((tr) => {
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < fem.z.length; i++) {
      const d = Math.abs(fem.z[i]! - tr.elevation);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    const y = fem.y[nearest] ?? 0;
    const spr = springs.find((s) => Math.abs(s.z - tr.elevation) < 1e-6);
    const T_kNpm = (spr?.k ?? 0) * y;
    const T_kN = T_kNpm * tr.spacing;
    const dNet = Math.max(tr.diameter - 2 * tr.corrosion, 1);
    const Anet = (Math.PI / 4) * dNet * dNet;
    const TRd = ((Anet * (tr.fy / p.factors.gammaS) * tr.threadEff * tr.connectionEff) / 1000) * (accidentalFail ? 1 : 1);
    const eta = TRd > 0 ? Math.abs(T_kN) / TRd : 99;
    return {
      id: tr.id,
      name: tr.name,
      elevation: tr.elevation,
      T_kNpm,
      T_kN,
      TRd,
      eta,
      status: statusFromEta(eta, p.limits.etaPass, p.limits.etaWarn),
    };
  });

  let Mmax = -Infinity,
    Mmin = Infinity,
    Vmax = 0,
    dmax = 0,
    zMmax = 0,
    zVmax = 0,
    zDmax = 0;
  for (let i = 0; i < fem.z.length; i++) {
    const M = fem.M[i] ?? 0;
    const V = fem.V[i] ?? 0;
    const dmm = (fem.y[i] ?? 0) * 1000;
    if (M > Mmax) {
      Mmax = M;
      zMmax = fem.z[i]!;
    }
    if (M < Mmin) Mmin = M;
    if (Math.abs(V) > Math.abs(Vmax)) {
      Vmax = V;
      zVmax = fem.z[i]!;
    }
    if (Math.abs(dmm) > Math.abs(dmax)) {
      dmax = dmm;
      zDmax = fem.z[i]!;
    }
  }

  let soilReaction = 0;
  for (let i = 1; i < stations.length; i++) {
    const z0 = stations[i - 1]!.z;
    const z1 = stations[i]!.z;
    const y0 = fem.y[i - 1] ?? 0;
    const y1 = fem.y[i] ?? 0;
    const k0 = kSoil[i - 1] ?? 0;
    const k1 = kSoil[i] ?? 0;
    soilReaction += 0.5 * (k0 * y0 + k1 * y1) * (z0 - z1);
  }

  const profile = fem.z.map((zz, i) => ({
    z: zz,
    p: fem.p[i] ?? 0,
    V: fem.V[i] ?? 0,
    M: fem.M[i] ?? 0,
    dmm: (fem.y[i] ?? 0) * 1000,
  }));

  return {
    stations: profile,
    Mmax,
    Mmin,
    Vmax,
    dmax,
    zMmax,
    zVmax,
    zDmax,
    ties,
    soilReaction,
    EI,
  };
}

function mrdRect(bmm: number, dmm: number, As: number, fck: number, fyk: number, gC: number, gS: number, aCc: number): number {
  const fcd = (aCc * fck) / gC;
  const fyd = fyk / gS;
  const fcuN = fcd;
  let x = (As * fyd) / (1.0 * fcuN * bmm * 0.8);
  const d = dmm;
  if (x < 0) x = 0;
  const xuLim = 0.45 * d;
  let AsEff = As;
  if (x > xuLim) {
    x = xuLim;
    AsEff = (1.0 * fcuN * bmm * 0.8 * x) / fyd;
  }
  const z = d - 0.5 * 0.8 * x;
  const MRdNmm = AsEff * fyd * z;
  return MRdNmm / 1e6;
}

function vrdc(bmm: number, dmm: number, As: number, fck: number, gC: number): number {
  const k = Math.min(1 + Math.sqrt(200 / dmm), 2.0);
  const rho = Math.min(As / (bmm * dmm), 0.02);
  const Crd = 0.18 / gC;
  const v = Crd * k * (100 * rho * fck) ** (1 / 3);
  const vmin = 0.035 * k ** 1.5 * Math.sqrt(fck);
  const vuse = Math.max(v, vmin);
  return (vuse * bmm * dmm) / 1000;
}

function crackWidth(p: Project, MEd: number): number {
  const t = p.geometry.wallThickness * 1000;
  const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
  const d = t - cnom - p.sheetPile.barDia / 2;
  const As = p.sheetPile.asMainEachFace;
  const z = 0.9 * d;
  const sigmaS = Math.abs(MEd) * 1e6 / Math.max(As * z, 1);
  const Es = 200000;
  const fct = fctm(p.sheetPile.fck);
  const hcEff = Math.min(2.5 * (t - d), (t - p.sheetPile.cover) / 2, t / 2);
  const AcEff = Math.max(hcEff, 20) * 1000;
  const rhoP = As / Math.max(AcEff, 1);
  const kt = 0.4;
  const ae = Es / Math.max(ecmFromFck(p.sheetPile.fck), 1);
  let eps = (sigmaS - kt * (fct / Math.max(rhoP, 1e-6)) * (1 + ae * rhoP)) / Es;
  eps = Math.max(eps, 0.6 * sigmaS / Es);
  const k1 = 0.8;
  const k2 = 0.5;
  const k3 = 3.4;
  const k4 = 0.425;
  const sr = k3 * cnom + k1 * k2 * k4 * p.sheetPile.barDia / Math.max(rhoP, 1e-6);
  const wk = sr * eps;
  return Math.max(wk, 0);
}

function wallChecks(
  p: Project,
  lc: LoadCaseDef,
  analysis: AnalysisResult,
  side: string,
): CheckResult[] {
  const tmm = p.geometry.wallThickness * 1000;
  const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
  const dmm = tmm - cnom - p.sheetPile.barDia / 2;
  const As = p.sheetPile.asMainEachFace;
  const MEd = Math.max(Math.abs(analysis.Mmax), Math.abs(analysis.Mmin));
  const VEd = Math.abs(analysis.Vmax);
  const MRd = mrdRect(1000, dmm, As, p.sheetPile.fck, p.sheetPile.fyk, p.factors.gammaCconc, p.factors.gammaS, p.factors.alphaCc);
  const VRd = vrdc(1000, dmm, As, p.sheetPile.fck, p.factors.gammaCconc);
  const wk = crackWidth(p, MEd / Math.max(p.factors.gammaG, 1));
  const deflLim = Math.min(p.limits.deflAbs, (p.geometry.retainedHeight * 1000) / p.limits.deflSpanRatio);
  const NEd = 25 * p.geometry.wallThickness * (p.geometry.retainedHeight + p.geometry.embedment) * 0.5 * p.factors.gammaG;

  const out: CheckResult[] = [];
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-flexure`,
        name: `Sheet pile flexure (${side})`,
        category: "ULS",
        demand: MEd,
        resistance: MRd,
        unit: "kNm/m",
        utilization: MRd > 0 ? MEd / MRd : 99,
        explanation:
          "The net lateral pressure on the wall (earth + water + surcharge) is applied to a beam-on-elastic-foundation model of the precast unit. The peak bending moment is compared with the EN 1992 rectangular-section design resistance of the vertical reinforcement.",
        formula: "M_{Rd}=A_s f_{yd} z,\\quad z=d-0.4x,\\quad x=A_s f_{yd}/(0.8 f_{cd} b)",
        substitution: `M_Ed=${fmt(MEd, 1)} kNm/m, d=${fmt(dmm, 0)} mm, A_s=${fmt(As, 0)} mm²/m, f_ck=${p.sheetPile.fck} MPa → M_Rd=${fmt(MRd, 1)} kNm/m`,
        assumptions: [
          "Singly reinforced rectangular metre-strip",
          `I_eff = ${p.sheetPile.IeffFactor} I_g (ASSUMPTION)`,
          "Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition.",
        ],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-shear`,
        name: `Sheet pile shear (${side})`,
        category: "ULS",
        demand: VEd,
        resistance: VRd,
        unit: "kN/m",
        utilization: VRd > 0 ? VEd / VRd : 99,
        explanation:
          "Peak shear from the wall analysis is compared with V_Rd,c of EN 1992-1-1 for members without shear reinforcement. Precast sheet piles typically rely on concrete shear resistance plus distribution steel.",
        formula: "V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}] b d",
        substitution: `V_Ed=${fmt(VEd, 1)} kN/m, V_Rd,c=${fmt(VRd, 1)} kN/m, d=${fmt(dmm, 0)} mm`,
        assumptions: ["No designed shear links in the precast unit (typical T&G sheet pile)", "C_Rd,c = 0.18/γ_c recommended value"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-nm`,
        name: `Combined N–M (${side})`,
        category: "ULS",
        demand: MEd,
        resistance: MRd,
        unit: "kNm/m",
        utilization: MRd > 0 ? MEd / MRd : 99,
        explanation:
          "Axial compression from wall self-weight is small relative to the squash load. The wall is flexure-governed; N–M interaction is reported as the flexural ratio with N noted.",
        formula: "N_{Ed}/N_{Rd}+M_{Ed}/M_{Rd}\\le 1",
        substitution: `N_Ed≈${fmt(NEd, 1)} kN/m (self-weight above critical section), M_Ed=${fmt(MEd, 1)} kNm/m`,
        assumptions: ["Self-weight only; no designed vertical prestress"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-defl`,
        name: `Wall deflection (${side})`,
        category: "SLS",
        demand: Math.abs(analysis.dmax),
        resistance: deflLim,
        unit: "mm",
        utilization: deflLim > 0 ? Math.abs(analysis.dmax) / deflLim : 99,
        explanation:
          "Service deflection of the wall axis from the Winkler beam model, using I_eff. Limit is the more onerous of the absolute cap and H/n.",
        formula: "\\eta_\\delta=\\delta_{Ed}/\\delta_{lim},\\quad \\delta_{lim}=\\min(\\delta_{abs}, H/n)",
        substitution: `δ_Ed=${fmt(analysis.dmax, 1)} mm at z=${fmt(analysis.zDmax, 2)} m, δ_lim=${fmt(deflLim, 1)} mm`,
        assumptions: [`I_eff factor = ${p.sheetPile.IeffFactor}`, "Winkler n_h is a USER/ASSUMED subgrade modulus"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-crack`,
        name: `Crack width (${side})`,
        category: "SLS",
        demand: wk,
        resistance: p.limits.wkLimit,
        unit: "mm",
        utilization: p.limits.wkLimit > 0 ? wk / p.limits.wkLimit : 99,
        explanation:
          "Simplified EN 1992-1-1 crack-width estimate using quasi-permanent steel stress from the unfactored moment. Water-retaining flood structures typically adopt a tighter limit than XC exposure alone.",
        formula: "w_k=s_{r,max}(\\varepsilon_{sm}-\\varepsilon_{cm})",
        substitution: `w_k=${fmt(wk, 3)} mm, w_lim=${p.limits.wkLimit} mm, exposure ${p.limits.exposure}`,
        assumptions: [
          p.limits.crackForWaterRetaining ? "Water-retaining crack limit applied" : "Standard XC crack limit",
          "Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition.",
        ],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  for (const T of analysis.ties) {
    out.push(
      mkCheck(
        {
          id: `${lc.id}-${side}-${T.id}`,
          name: `${T.name} (${side})`,
          category: "ULS",
          demand: Math.abs(T.T_kN),
          resistance: T.TRd,
          unit: "kN",
          utilization: T.eta,
          explanation:
            "Tie force is the Winkler-beam support reaction at the tie elevation, converted from force per metre of wall to force per bar using the tributary spacing. Tension is positive (walls spreading). Compression means the wall is being pushed into the core; the bar is then slack unless lock-off preload is specified.",
          formula: "T_{Ed}=k_{tie} \\, \\delta_{tie}\\, s,\\quad T_{Rd}=A_{net} f_{yd} k_{th} k_{conn}",
          substitution: `T_Ed=${fmt(T.T_kN, 1)} kN/bar, T_Rd=${fmt(T.TRd, 1)} kN, z=${fmt(T.elevation, 2)} m`,
          assumptions: ["Symmetric U-system: extension ≈ 2δ (both walls)", "No lock-off preload modelled"],
          applicable: true,
          loadCaseId: lc.id,
        },
        p.limits,
      ),
    );
  }
  return out;
}

function globalChecks(p: Project, lc: LoadCaseDef, st: Station[], water: WaterState, fillPlaced: boolean): CheckResult[] {
  const z = st.map((s) => s.z);
  const rb = p.geometry.riverbed;
  const B = p.geometry.totalWidth;
  const t = p.geometry.wallThickness;
  const Binner = B - 2 * t;
  const H = p.geometry.retainedHeight;
  const D = p.geometry.embedment;

  const pL = st.map((s) => -s.pNetL);
  const pR = st.map((s) => -s.pNetR);
  const Fnet = trap(st.map((s) => s.pWaterNetL - s.pWaterNetR + (s.z <= rb ? s.pSoilOut : 0) * 0), z.map((zz, i) => (i ? z[i - 1]! - zz : 0)));
  let FwaterL = 0;
  let FwaterR = 0;
  let FsoilOut = 0;
  let Ffill = 0;
  let Fsur = 0;
  let Pp = 0;
  for (let i = 1; i < st.length; i++) {
    const dz = st[i - 1]!.z - st[i]!.z;
    FwaterL += 0.5 * (st[i - 1]!.uUp + st[i]!.uUp) * dz;
    FwaterR += 0.5 * (st[i - 1]!.uDown + st[i]!.uDown) * dz;
    Ffill += 0.5 * (st[i - 1]!.pSoilCore + st[i]!.pSoilCore) * dz;
    Fsur += 0.5 * (st[i - 1]!.pSur + st[i]!.pSur) * dz;
    if (st[i]!.z <= rb) {
      Pp += 0.5 * (st[i - 1]!.pPassive + st[i]!.pPassive) * dz;
      FsoilOut += 0.5 * (st[i - 1]!.pSoilOut + st[i]!.pSoilOut) * dz;
    }
  }

  const Wfill = fillPlaced ? p.coreFill.gamma * Binner * H : 0;
  const Wpave = p.pavement.asphalt * p.pavement.gammaAsphalt * p.geometry.roadWidth + p.pavement.subbase * p.pavement.gammaSubbase * p.geometry.roadWidth;
  const Wwall = 25 * t * (H + D) * 2;
  const Wcap = p.capping.enabled ? 25 * p.capping.b * p.capping.h * 2 : 0;
  const W = Wfill + Wpave + Wwall + Wcap;

  const Fdst = Math.abs(FwaterL - FwaterR) * p.factors.gammaW;
  const delta = Math.min(p.coreFill.phi, 30) * (2 / 3);
  const tanD = Math.tan((delta * Math.PI) / 180) / p.factors.gammaPhi;
  const Rslide = W * p.factors.gammaGinf * tanD + Pp * 0.5;
  const etaSlide = Rslide > 0 ? Fdst / Rslide : 99;

  const armW = B / 2;
  const Mstb = W * p.factors.gammaGinf * armW;
  const hUp = Math.max(water.up - rb, 0);
  const hDn = Math.max(water.down - rb, 0);
  const FwL = 0.5 * p.water.gammaW * hUp * hUp * p.factors.gammaW;
  const FwR = 0.5 * p.water.gammaW * hDn * hDn * p.factors.gammaW;
  const Mdst = FwL * (hUp / 3) + Math.max(Ffill, 0) * 0.01;
  const etaOT = Mstb > 0 ? Mdst / Mstb : 99;

  const Nphi = phiDesign(p.nativeLayers.at(-1)?.phi ?? 32, p.factors.gammaPhi);
  const Nq = Math.exp(Math.PI * Math.tan(toRadSafe(Nphi))) * Math.tan(Math.PI / 4 + toRadSafe(Nphi) / 2) ** 2;
  const Ng = 2 * (Nq - 1) * Math.tan(toRadSafe(Nphi));
  const Btoe = t;
  const Wpile = (Wwall + Wcap) / 2;
  const qPile = (Wpile / Math.max(Btoe, 0.1)) * p.factors.gammaG;
  const sigmaRd = 0.5 * (p.nativeLayers.at(-1)?.gamma ?? 19) * Btoe * Ng + (p.nativeLayers.at(-1)?.gamma ?? 19) * D * Nq;
  const etaBrg = sigmaRd > 0 ? qPile / sigmaRd : 99;
  const qCore = fillPlaced ? ((Wfill + Wpave) / Math.max(Binner, 0.5)) * p.factors.gammaG : 0;
  const sigmaRdCore = (p.nativeLayers[0]?.gamma ?? 18) * Math.max(D, 1) * Math.min(Nq, 20);
  const etaCore = sigmaRdCore > 0 && qCore > 0 ? qCore / sigmaRdCore : 0;

  const U = p.water.gammaW * Math.max(Math.max(water.up, water.down) - (rb - D), 0) * B;
  const etaUplift = W > 0 ? (U * 0.25) / W : 99;

  const creep = D + B + D;
  const dh = Math.abs(water.up - water.down);
  const i = creep > 0 ? dh / creep : 0;
  const Gs = 2.65;
  const gamSat = p.nativeLayers[0]?.gammaSat ?? 20;
  const e0 = (Gs * 9.81) / Math.max(gamSat - p.water.gammaW, 1) - 1;
  const icr = (Gs - 1) / (1 + Math.max(e0, 0.3));
  const etaPipe = icr > 0 ? i / Math.min(p.limits.iAllow, 0.5 * icr) : 99;

  const heave = (p.nativeLayers[0]?.gammaSat ?? 20) * D;
  const uToe = p.water.gammaW * Math.max(Math.max(water.up, water.down) - (rb - D), 0);
  const etaHeave = heave > 0 ? uToe / (heave + 1e-6) * 0.5 : 0;

  void pL;
  void pR;
  void Fnet;
  void FsoilOut;
  void Fsur;
  void FwR;

  const checks: CheckResult[] = [
    mkCheck(
      {
        id: `${lc.id}-slide`,
        name: "Global sliding (U-block)",
        category: "GEO",
        demand: Fdst,
        resistance: Rslide,
        unit: "kN/m",
        utilization: etaSlide,
        explanation:
          "The U-shaped embankment is treated as a gravity block. Destabilising force is the factored net hydrostatic resultant. Resistance is base friction of the fill/wall weight plus a reduced passive contribution on the downstream embedment.",
        formula: "H_{dst}=\\gamma_w \\tfrac12 \\gamma_w (h_u^2-h_d^2),\\quad R_d=V_d \\tan\\delta_d + R_{p,d}",
        substitution: `H_dst=${fmt(Fdst, 1)} kN/m, W=${fmt(W, 0)} kN/m, δ=${fmt(delta, 1)}°, R_d=${fmt(Rslide, 1)} kN/m`,
        assumptions: [
          `Design Approach ${p.codes.designApproach}`,
          "Wall friction δ = (2/3)φ' of fill (ENGINEERING JUDGEMENT)",
          "Passive on embedment reduced (not full Kp mobilisation)",
        ],
        applicable: p.designType !== "single-cantilever" && p.designType !== "single-anchored",
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-ot`,
        name: "Global overturning",
        category: "GEO",
        demand: Mdst,
        resistance: Mstb,
        unit: "kNm/m",
        utilization: etaOT,
        explanation:
          "Overturning of the U-block about the downstream toe. Stabilising moment from self-weight of fill, walls, capping and pavement. Destabilising moment from upstream hydrostatic resultant.",
        formula: "M_{dst}=F_{w,up}\\, h_u/3,\\quad M_{stb}=W\\, B/2",
        substitution: `M_dst=${fmt(Mdst, 1)} kNm/m, M_stb=${fmt(Mstb, 1)} kNm/m, h_up=${fmt(hUp, 2)} m`,
        assumptions: ["EQU-style comparison using γ_G,inf on stabilising weight", "Recommended EN 1990 factors — confirm NA"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-brg`,
        name: "Toe bearing",
        category: "GEO",
        demand: qPile,
        resistance: Math.max(sigmaRd, 1),
        unit: "kPa",
        utilization: etaBrg,
        explanation:
          "Vertical stress under each sheet-pile toe from wall and capping self-weight only. Granular core and pavement bear on the formation between the piles, not through the toes. Screening uses the EN 1997 Annex D drained bearing form.",
        formula: "R/A' = c N_c + q N_q + 0.5 \\gamma B' N_\\gamma",
        substitution: `σ_Ed,toe=${fmt(qPile, 1)} kPa, σ_Rd=${fmt(sigmaRd, 1)} kPa, D=${fmt(D, 2)} m, B'= ${fmt(Btoe, 2)} m. Core contact ${fmt(qCore, 1)} kPa (η=${fmt(etaCore, 2)}).`,
        assumptions: ["Drained bearing, strip footing analogue", "SPECIALIST CHECK REQUIRED for layered/soft soils"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-uplift`,
        name: "Uplift of U-box",
        category: "GEO",
        demand: U * 0.25,
        resistance: W,
        unit: "kN/m",
        utilization: etaUplift,
        explanation:
          "Uplift screening uses a reduced hydrostatic area under the box (seepage dissipation). Full undissipated uplift would require a seepage analysis.",
        formula: "U=\\gamma_w h A_{eq},\\quad \\eta=U_d/W_d",
        substitution: `U_eq=${fmt(U * 0.25, 1)} kN/m, W=${fmt(W, 0)} kN/m`,
        assumptions: ["Equivalent uplift 25% of full hydrostatic (ASSUMPTION — seepage dependent)"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-pipe`,
        name: "Piping / hydraulic gradient",
        category: "HYD",
        demand: i,
        resistance: Math.min(p.limits.iAllow, 0.5 * icr),
        unit: "–",
        utilization: etaPipe,
        explanation:
          "Lane weighted-creep screening: i = Δh / (D + B + D). Critical gradient from (G_s−1)/(1+e). This is a simplified screening check, not a finite-element seepage analysis.",
        formula: "i=\\Delta h / L_{creep},\\quad i_{cr}=(G_s-1)/(1+e)",
        substitution: `Δh=${fmt(dh, 2)} m, L=${fmt(creep, 2)} m, i=${fmt(i, 3)}, i_cr=${fmt(icr, 2)}, i_all=${fmt(Math.min(p.limits.iAllow, 0.5 * icr), 2)}`,
        assumptions: ["Simplified creep-length screening", "SPECIALIST CHECK REQUIRED for detailed seepage / filters"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-heave`,
        name: "Hydraulic heave at toe",
        category: "HYD",
        demand: uToe * 0.5,
        resistance: heave,
        unit: "kPa",
        utilization: etaHeave,
        explanation:
          "Heave screening compares pore pressure at formation with the saturated overburden of the embedment prism. Full verification follows EN 1997 hydraulic-failure format with seepage exit gradients.",
        formula: "S_{dst,d}=u_{exit} A,\\quad S_{stb,d}=\\gamma' D A",
        substitution: `u_toe=${fmt(uToe, 1)} kPa, γ_sat D=${fmt(heave, 1)} kPa`,
        assumptions: ["Exit gradient approximated; confirm with seepage net"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  ];
  return checks;
}

function toRadSafe(d: number): number {
  return (d * Math.PI) / 180;
}

function cappingChecks(p: Project, lc: LoadCaseDef, left: AnalysisResult): CheckResult[] {
  if (!p.capping.enabled) return [];
  const bmm = p.capping.b * 1000;
  const hmm = p.capping.h * 1000;
  const dmm = hmm - p.capping.cover - 16;
  const cappingFyk = p.wallSystem === "cbp" ? p.cbp.fyk : p.sheetPile.fyk;
  const MRd = mrdRect(bmm, dmm, p.capping.asBot, p.capping.fck, cappingFyk, p.factors.gammaCconc, p.factors.gammaS, p.factors.alphaCc);
  const VRd = vrdc(bmm, dmm, p.capping.asBot, p.capping.fck, p.factors.gammaCconc);
  const T = left.ties[0]?.T_kNpm ?? 0;
  const s = p.ties[0]?.spacing ?? 1.5;
  const MEd = Math.abs(T) * s * s / 8;
  const VEd = Math.abs(T) * s / 2;
  return [
    mkCheck(
      {
        id: `${lc.id}-cap-m`,
        name: "Capping beam flexure",
        category: "ULS",
        demand: MEd,
        resistance: MRd,
        unit: "kNm",
        utilization: MRd > 0 ? MEd / MRd : 99,
        explanation:
          "The capping beam is treated as a continuous beam spanning between tie / pile head reactions. Tributary tie force per spacing is applied as a concentrated load.",
        formula: "M_{Ed}=T s^2/8\\quad\\text{(continuous-beam screening)}",
        substitution: `T=${fmt(T, 1)} kN/m, s=${fmt(s, 2)} m, M_Ed=${fmt(MEd, 1)} kNm, M_Rd=${fmt(MRd, 1)} kNm`,
        assumptions: ["Screening continuous-beam model — refine with 3D frame if heads are rigidly connected"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
    mkCheck(
      {
        id: `${lc.id}-cap-v`,
        name: "Capping beam shear",
        category: "ULS",
        demand: VEd,
        resistance: VRd,
        unit: "kN",
        utilization: VRd > 0 ? VEd / VRd : 99,
        explanation: "Shear screening of the capping beam under tributary tie / wall-head force.",
        formula: "V_{Ed}=T s/2",
        substitution: `V_Ed=${fmt(VEd, 1)} kN, V_Rd=${fmt(VRd, 1)} kN`,
        assumptions: ["No designed links unless specified by the user"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  ];
}

function handlingCheck(p: Project): CheckResult {
  const w = 25 * p.geometry.wallThickness;
  const L = p.geometry.retainedHeight + p.geometry.embedment;
  const Mlift = (w * L * L) / 40;
  const tmm = p.geometry.wallThickness * 1000;
  const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
  const dmm = tmm - cnom - p.sheetPile.barDia / 2;
  const MRd = mrdRect(1000, dmm, p.sheetPile.asMainEachFace, p.sheetPile.fck, p.sheetPile.fyk, 1.5, 1.15, 1);
  return mkCheck(
    {
      id: "handling",
      name: "Precast handling / two-point lift",
      category: "CON",
      demand: Mlift,
      resistance: MRd,
      unit: "kNm/m",
      utilization: MRd > 0 ? Mlift / MRd : 99,
      explanation:
        "Self-weight bending for a two-point lift near the 0.21L positions. Installation stresses depend on the driving method and must be confirmed by the specialist contractor.",
      formula: "M_{lift}\\approx w L^2/40",
      substitution: `w=${fmt(w, 2)} kN/m, L=${fmt(L, 2)} m, M_lift=${fmt(Mlift, 1)} kNm/m`,
      assumptions: ["Two-point lift ASSUMPTION", "SPECIALIST CHECK REQUIRED for driving / press-in"],
      applicable: true,
    },
    p.limits,
  );
}

function durabilityCheck(p: Project): CheckResult {
  const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
  const cmin = p.limits.crackForWaterRetaining ? 40 : 30;
  const req = cmin + p.sheetPile.deltaCdev;
  return mkCheck(
    {
      id: "cover",
      name: "Durability cover",
      category: "DUR",
      demand: req,
      resistance: cnom,
      unit: "mm",
      utilization: cnom > 0 ? req / cnom : 99,
      explanation: "Nominal cover c_nom = c_min + Δc_dev. Water-retaining flood exposure is more onerous than internal XC1. Confirm exposure class with the project specification.",
      formula: "c_{nom}=c_{min}+\\Delta c_{dev}",
      substitution: `c_min=${cmin} mm, Δc_dev=${p.sheetPile.deltaCdev} mm, c_nom=${cnom} mm, exposure ${p.limits.exposure}`,
      assumptions: ["c_min provisionally 40 mm for XC4/XF3 flood structure (ASSUMPTION)"],
      applicable: true,
    },
    p.limits,
  );
}

function runQC(p: Project): QCItem[] {
  const items: QCItem[] = [];
  const ok = (id: string, name: string, pass: boolean, detail: string): QCItem => ({
    id,
    name,
    status: pass ? "PASS" : "FAIL",
    detail,
  });
  items.push(ok("QC-01", "Units consistent", true, "Internal SI: m, kN, kPa, kNm"));
  const mand = p.geometry.retainedHeight > 0 && p.geometry.embedment > 0 && p.geometry.wallThickness > 0;
  items.push(ok("QC-02", "Mandatory geometry present", mand, mand ? "H, D, t provided" : "H, D or t missing"));
  items.push(ok("QC-05", "Water levels valid", p.water.floodUp >= p.water.floodDown - 1e-6, `HWL_up=${p.water.floodUp}, HWL_down=${p.water.floodDown}`));
  const cont = p.nativeLayers.length > 0;
  items.push(ok("QC-06", "Soil layers present", cont, cont ? `${p.nativeLayers.length} native layer(s)` : "No native layers"));
  items.push(ok("QC-07", "Wall geometry valid", p.geometry.totalWidth > 2 * p.geometry.wallThickness, `B=${p.geometry.totalWidth} m, t=${p.geometry.wallThickness} m`));
  const tiesOk = p.ties.every((t) => t.elevation <= p.geometry.retainedHeight + p.capping.h + 0.5 && t.elevation >= -p.geometry.embedment);
  items.push(ok("QC-08", "Tie levels within wall", tiesOk, tiesOk ? "All tie elevations inside the wall" : "Tie elevation outside wall range"));
  items.push(ok("QC-09", "Embedment positive", p.geometry.embedment > 0, `D=${p.geometry.embedment} m`));
  const reinfOk = p.wallSystem === "cbp" ? p.cbp.barCount > 0 && p.cbp.barDiameter > 0 : p.sheetPile.asMainEachFace > 0;
  items.push(
    ok(
      "QC-10",
      "Reinforcement area positive",
      reinfOk,
      p.wallSystem === "cbp" ? `${p.cbp.barCount}×${p.cbp.barDiameter} mm bars` : `As=${p.sheetPile.asMainEachFace} mm²/m`,
    ),
  );
  items.push(ok("QC-11", "Design approach selected", !!p.codes.designApproach, p.codes.designApproach));
  const topWater = Math.max(p.water.floodUp, p.water.floodDown);
  const wallTop = p.geometry.retainedHeight + (p.capping.enabled ? p.capping.h : 0);
  items.push({
    id: "QC-water-top",
    name: "Water vs wall top",
    status: topWater > wallTop ? "WARNING" : "PASS",
    detail: topWater > wallTop ? "Water level exceeds wall top elevation." : "Water remains below structure top",
  });
  if (p.coreFill.phi < 0 || p.coreFill.phi > 50) {
    items.push({ id: "QC-phi", name: "Friction angle range", status: "WARNING", detail: "φ' outside typical 0–50° range" });
  }
  if (p.codes.nationalAnnex.toLowerCase().includes("none")) {
    items.push({
      id: "QC-na",
      name: "National Annex",
      status: "WARNING",
      detail: "No project-specific National Annex has been provided. Recommended Eurocode values are used provisionally and shall be confirmed against the governing national requirements.",
    });
  }
  return items;
}

function variables(p: Project, d: CalcBundle["derived"]): VariableRow[] {
  return [
    { symbol: "H", description: "Retained / exposed height", value: fmt(p.geometry.retainedHeight, 2), unit: "m", source: "USER INPUT" },
    { symbol: "D", description: "Embedment below riverbed", value: fmt(p.geometry.embedment, 2), unit: "m", source: "USER INPUT" },
    { symbol: "L", description: "Total sheet pile length", value: fmt(d.L, 2), unit: "m", source: "DERIVED VALUE" },
    { symbol: "B_{road}", description: "Roadway width", value: fmt(p.geometry.roadWidth, 2), unit: "m", source: "USER INPUT" },
    { symbol: "B_{tot}", description: "Out-to-out width", value: fmt(p.geometry.totalWidth, 2), unit: "m", source: "USER INPUT" },
    { symbol: "t", description: "Sheet pile thickness", value: fmt(p.geometry.wallThickness * 1000, 0), unit: "mm", source: "USER INPUT" },
    { symbol: "f_{cu}", description: "Cube strength", value: fmt(p.sheetPile.fcu, 0), unit: "MPa", source: "USER INPUT" },
    { symbol: "f_{ck}", description: "Cylinder strength", value: fmt(p.sheetPile.fck, 0), unit: "MPa", source: "DERIVED VALUE" },
    { symbol: "f_{yk}", description: "Reinforcement yield", value: fmt(p.sheetPile.fyk, 0), unit: "MPa", source: "USER INPUT" },
    { symbol: "c_{nom}", description: "Nominal cover", value: fmt(d.cnom, 0), unit: "mm", source: "DERIVED VALUE" },
    { symbol: "\\varphi'_{fill}", description: "Fill friction angle", value: fmt(p.coreFill.phi, 1), unit: "°", source: "USER INPUT" },
    { symbol: "\\gamma_{fill}", description: "Fill bulk unit weight", value: fmt(p.coreFill.gamma, 1), unit: "kN/m³", source: "USER INPUT" },
    { symbol: "K_a", description: "Active coefficient (fill, design φ)", value: fmt(d.KaFill, 3), unit: "–", source: "CALCULATED RESULT" },
    { symbol: "K_p", description: "Passive coefficient (native, design φ)", value: fmt(d.KpNative, 2), unit: "–", source: "CALCULATED RESULT" },
    { symbol: "K_0", description: "At-rest coefficient (fill)", value: fmt(d.K0Fill, 3), unit: "–", source: "CALCULATED RESULT" },
    { symbol: "\\gamma_w", description: "Unit weight of water", value: fmt(p.water.gammaW, 2), unit: "kN/m³", source: "CODE PARAMETER" },
    { symbol: "HWL_{up}", description: "Flood upstream water", value: fmt(p.water.floodUp, 2), unit: "m", source: "USER INPUT" },
    { symbol: "HWL_{down}", description: "Flood downstream water", value: fmt(p.water.floodDown, 2), unit: "m", source: "USER INPUT" },
    { symbol: "q", description: "Traffic surcharge", value: fmt(p.traffic.q, 1), unit: "kPa", source: "ASSUMPTION" },
    { symbol: "\\gamma_G", description: "Permanent action factor", value: fmt(p.factors.gammaG, 2), unit: "–", source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER" },
    { symbol: "\\gamma_Q", description: "Variable action factor", value: fmt(p.factors.gammaQ, 2), unit: "–", source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER" },
    { symbol: "\\gamma_{\\varphi}", description: "Friction factor (EN 1997)", value: fmt(p.factors.gammaPhi, 2), unit: "–", source: "CODE PARAMETER" },
    { symbol: "n_h", description: "Subgrade modulus rate", value: fmt(p.sheetPile.nh, 0), unit: "kN/m³", source: "ASSUMPTION" },
    { symbol: "E_{cm}", description: "Concrete secant modulus", value: fmt(d.Ecm, 0), unit: "MPa", source: "CODE PARAMETER" },
    { symbol: "I_g", description: "Gross metre-strip inertia", value: fmt(d.Ig * 1e12, 0), unit: "mm⁴/m", source: "DERIVED VALUE" },
  ];
}

function nTiesFor(p: Project, stageTies?: number): number {
  if (typeof stageTies === "number") return stageTies;
  if (p.designType === "single-cantilever") return 0;
  return p.ties.filter((t) => t.enabled).length;
}

function analyseCase(
  p: Project,
  lc: LoadCaseDef,
  extras?: { fillPlaced?: boolean; roadPlaced?: boolean; nTies?: number; notes?: string[] },
): LoadCaseResult {
  const water = waterForCase(p, lc);
  const fillPlaced = extras?.fillPlaced ?? true;
  const roadPlaced = extras?.roadPlaced ?? true;
  const stations = buildStations(p, water, {
    trafficOn: lc.trafficOn,
    constructionOn: lc.constructionOn,
    fillPlaced,
    roadPlaced,
    oneSided: lc.oneSidedExcavation,
  });
  const nTies = extras?.nTies ?? nTiesFor(p);
  const tiesOn = nTies > 0 && p.designType !== "single-cantilever";
  const left = analyseWall(p, stations, "pNetL", tiesOn, nTies, lc.accidentalTieFail);
  const right = analyseWall(p, stations, "pNetR", tiesOn, nTies, lc.accidentalTieFail);

  let checks: CheckResult[];
  let cbpResult: LoadCaseResult["cbp"];
  if (p.wallSystem === "cbp") {
    const up = cbpWallChecks(p, lc, left, "upstream");
    const down = cbpWallChecks(p, lc, right, "downstream");
    checks = [...up.checks, ...down.checks, ...globalChecks(p, lc, stations, water, fillPlaced), ...cappingChecks(p, lc, left)];
    cbpResult = {
      solidRatio: cbpSolidRatio(p.cbp.diameter, p.cbp.spacing),
      lateralModel: p.cbp.lateralModel,
      upstream: up.interaction,
      downstream: down.interaction,
    };
  } else {
    checks = [
      ...wallChecks(p, lc, left, "upstream"),
      ...wallChecks(p, lc, right, "downstream"),
      ...globalChecks(p, lc, stations, water, fillPlaced),
      ...cappingChecks(p, lc, left),
    ];
  }

  let PaL = 0,
    PwL = 0,
    PwR = 0,
    PsL = 0,
    Pp = 0;
  for (let i = 1; i < stations.length; i++) {
    const dz = stations[i - 1]!.z - stations[i]!.z;
    PaL += 0.5 * (stations[i - 1]!.pSoilCore + stations[i]!.pSoilCore) * dz;
    PwL += 0.5 * (stations[i - 1]!.uUp + stations[i]!.uUp) * dz;
    PwR += 0.5 * (stations[i - 1]!.uDown + stations[i]!.uDown) * dz;
    PsL += 0.5 * (stations[i - 1]!.pSur + stations[i]!.pSur) * dz;
    if (stations[i]!.z <= p.geometry.riverbed) Pp += 0.5 * (stations[i - 1]!.pPassive + stations[i]!.pPassive) * dz;
  }
  const Binner = p.geometry.totalWidth - 2 * p.geometry.wallThickness;
  const Wfill = fillPlaced ? p.coreFill.gamma * Binner * p.geometry.retainedHeight : 0;
  const Wstruct =
    25 * p.geometry.wallThickness * (p.geometry.retainedHeight + p.geometry.embedment) * 2 +
    (p.capping.enabled ? 25 * p.capping.b * p.capping.h * 2 : 0);
  const FnetGlobal = PwL - PwR;
  const Mdst = PwL * Math.max(water.up, 0) / 3;
  const Mstb = (Wfill + Wstruct) * (p.geometry.totalWidth / 2);

  const notes = [
    ...(extras?.notes ?? []),
    lc.waterMode === "rapid-drawdown"
      ? "Rapid drawdown: external water is lowered while the core remains saturated. Outward effective-stress imbalance can govern tie force and wall flexure."
      : "",
    lc.accidentalTieFail ? "Accidental case: one tie level removed (robustness). Remaining ties and embedment must redistributed the load." : "",
    p.earth.method === "rankine" && tiesOn
      ? "Rankine Ka assumes sufficient movement. Stiff ties may keep pressures closer to K0 — toggle ‘restrained wall uses K0’ if movement is locked off."
      : "",
  ].filter(Boolean);

  return {
    id: lc.id,
    name: lc.name,
    situation: lc.situation,
    notes,
    stations,
    left,
    right,
    checks,
    cbp: cbpResult,
    forces: { PaL, PaR: PaL, PwL, PwR, PsL, Pp, Wfill, Wstruct, FnetGlobal, Mdst, Mstb },
  };
}

export function runCalculation(p: Project): CalcBundle {
  try {
    return runCalculationInner(p);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Calculation error";
    return {
      qc: [{ id: "QC-crash", name: "Engine", status: "FAIL", detail: msg }],
      variables: [],
      loadCases: [],
      stageResults: [],
      summary: [],
      governing: null,
      warnings: [msg, "A calculation exception occurred. Check inputs (geometry, soil layers, tie elevations)."],
      overall: "FAIL",
      derived: {
        L: p.geometry.retainedHeight + p.geometry.embedment,
        Binner: p.geometry.totalWidth - 2 * p.geometry.wallThickness,
        cnom: p.sheetPile.cover + p.sheetPile.deltaCdev,
        dEff: 0,
        fcd: 0,
        fyd: 0,
        KaFill: 0,
        KpNative: 0,
        K0Fill: 0,
        Ecm: 0,
        Ig: 0,
        gammaSubFill: 0,
      },
    };
  }
}

function runCalculationInner(p: Project): CalcBundle {
  const qc = runQC(p);
  const t = p.geometry.wallThickness;
  const isCbp = p.wallSystem === "cbp";
  const derived = isCbp
    ? {
        L: p.cbp.pileLength,
        Binner: p.geometry.totalWidth - 2 * t,
        cnom: p.cbp.cover,
        dEff: 0.8 * (p.cbp.diameter * 1000),
        fcd: (p.factors.alphaCc * p.cbp.fck) / p.factors.gammaCconc,
        fyd: p.cbp.fyk / p.factors.gammaS,
        KaFill: coeffs(p, p.coreFill.phi).Ka,
        KpNative: coeffs(p, p.nativeLayers[0]?.phi ?? 30).Kp,
        K0Fill: k0Jak(phiDesign(p.coreFill.phi, p.factors.gammaPhi)),
        Ecm: ecmFromFck(p.cbp.fck),
        Ig: (Math.PI / 64) * p.cbp.diameter ** 4,
        gammaSubFill: p.coreFill.gammaSat - p.water.gammaW,
      }
    : {
        L: p.geometry.retainedHeight + p.geometry.embedment,
        Binner: p.geometry.totalWidth - 2 * t,
        cnom: p.sheetPile.cover + p.sheetPile.deltaCdev,
        dEff: t * 1000 - (p.sheetPile.cover + p.sheetPile.deltaCdev) - p.sheetPile.barDia / 2,
        fcd: (p.factors.alphaCc * p.sheetPile.fck) / p.factors.gammaCconc,
        fyd: p.sheetPile.fyk / p.factors.gammaS,
        KaFill: coeffs(p, p.coreFill.phi).Ka,
        KpNative: coeffs(p, p.nativeLayers[0]?.phi ?? 30).Kp,
        K0Fill: k0Jak(phiDesign(p.coreFill.phi, p.factors.gammaPhi)),
        Ecm: p.sheetPile.EcmOverride ?? ecmFromFck(p.sheetPile.fck),
        Ig: p.sheetPile.Ioverride ?? (1 * t ** 3) / 12,
        gammaSubFill: p.coreFill.gammaSat - p.water.gammaW,
      };

  const loadCases = p.loadCases.filter((lc) => lc.enabled).map((lc) => analyseCase(p, lc));
  const stageResults = p.stages
    .filter((s) => s.enabled)
    .map((s) =>
      analyseCase(
        p,
        {
          id: s.id,
          name: s.name,
          situation: "construction",
          waterMode: s.waterMode,
          trafficOn: s.trafficOn,
          constructionOn: s.id === "ST-08",
          accidentalTieFail: false,
          oneSidedExcavation: s.id === "ST-03",
          enabled: true,
        },
        {
          fillPlaced: s.fillPlaced,
          roadPlaced: s.roadPlaced,
          nTies: s.tiesInstalled,
          notes: [s.description],
        },
      ),
    );

  // Precast handling/two-point lift and the generic sheet-pile durability check do not
  // apply to cast-in-place CBP piles — cbpWallChecks() already reports its own cover check.
  const extraChecks = isCbp ? [] : [handlingCheck(p), durabilityCheck(p)];

  const all = [...loadCases.flatMap((lc) => lc.checks), ...stageResults.flatMap((s) => s.checks), ...extraChecks];
  const applicable = all.filter((c) => c.applicable && c.status !== "N/A");
  const byId = new Map<string, CheckResult>();
  for (const c of applicable) {
    const key = c.name.replace(/ \((upstream|downstream)\)/, "");
    const prev = byId.get(key);
    if (!prev || c.utilization > prev.utilization) byId.set(key, c);
  }
  const summary = [...byId.values()].sort((a, b) => b.utilization - a.utilization);

  let governing: CalcBundle["governing"] = null;
  if (summary.length) {
    const g = summary[0]!;
    governing = { name: g.name, eta: g.utilization, loadCase: g.loadCaseId ?? "—", status: g.status };
  }

  const warnings: string[] = [];
  warnings.push("PRELIMINARY ENGINEERING DESIGN TOOL. Results shall be reviewed by a suitably qualified structural/geotechnical engineer before construction.");
  if (p.codes.nationalAnnex.toLowerCase().includes("none")) {
    warnings.push("No project-specific National Annex has been provided. Recommended Eurocode values are used provisionally.");
  }
  if (!p.codes.seismic) warnings.push("Seismic action is not included. Enable EN 1998 only when the site requires it.");
  if (p.earth.assumeNoScour) warnings.push("Scour at the riverbed is not modelled. Embedment may be unconservative if scour is credible.");
  if (p.traffic.model === "uniform") warnings.push("Traffic is a user-defined equivalent surcharge. It is not an EN 1991-2 Load Model 1 representation unless the user has calibrated q accordingly.");
  if (isCbp) {
    if (p.cbp.lateralModel === "equivalent-wall") {
      warnings.push("CBP equivalent wall stiffness assumption requires engineering review.");
    }
    warnings.push("Do not treat spaced CBP piles as a solid diaphragm wall unless the equivalent-wall model has been explicitly justified.");
    if (p.cbp.waterCutoff === "none") {
      warnings.push("No water-control measure selected between CBP piles — seepage through the gaps has not been assessed.");
    }
  } else if (p.sheetPile.IeffFactor < 1) {
    warnings.push(`Effective inertia I_eff = ${p.sheetPile.IeffFactor} I_g is an ASSUMPTION for cracked RC.`);
  }
  warnings.push("The granular core is not treated as a rigid structural diaphragm unless the user selects otherwise.");
  warnings.push("Passive resistance mobilisation depends on wall movement, construction disturbance and scour. A user-controlled reduction factor is provided.");
  if (qc.some((q) => q.status === "FAIL")) warnings.push("QC reported FAIL items — do not treat the calculation as complete.");

  let overall: Status = "PASS";
  if (summary.some((c) => c.status === "FAIL")) overall = "FAIL";
  else if (summary.some((c) => c.status === "WARNING" || c.status === "INPUT REQUIRED")) overall = "WARNING";
  if (qc.some((q) => q.status === "FAIL")) overall = overall === "FAIL" ? "FAIL" : "WARNING";

  return {
    qc,
    variables: isCbp ? variablesCbp(p, derived) : variables(p, derived),
    loadCases,
    stageResults,
    summary,
    governing,
    warnings,
    overall,
    derived,
  };
}

export function runParametric(p: Project, key: "embedment" | "thickness" | "tieDia" | "spacing", min: number, max: number, step: number): ParametricRow[] {
  const rows: ParametricRow[] = [];
  const n = Math.max(1, Math.round((max - min) / step));
  for (let i = 0; i <= n; i++) {
    const value = min + i * step;
    const q: Project = structuredClone(p);
    if (key === "embedment") q.geometry.embedment = value;
    if (key === "thickness") q.geometry.wallThickness = value / (value > 2 ? 1000 : 1);
    if (key === "tieDia") q.ties.forEach((t) => (t.diameter = value));
    if (key === "spacing") q.geometry.totalWidth = value + 2 * q.geometry.wallThickness;
    const r = runCalculation(q);
    const flex = r.summary.find((c) => c.name.toLowerCase().includes("flexure"));
    const shear = r.summary.find((c) => c.name.toLowerCase().includes("shear"));
    const tie = r.summary.find((c) => c.name.toLowerCase().includes("tie"));
    const defl = r.summary.find((c) => c.name.toLowerCase().includes("deflection"));
    const etaMax = r.governing?.eta ?? 0;
    rows.push({
      value,
      MEd: flex?.demand ?? 0,
      VEd: shear?.demand ?? 0,
      Tmax: tie?.demand ?? 0,
      dmax: defl?.demand ?? 0,
      etaMax,
      status: etaMax > 1 ? "FAIL" : etaMax >= 0.9 ? "WARNING" : "PASS",
    });
  }
  return rows;
}

export function runSensitivity(p: Project): { name: string; delta: string; dM: number; dT: number; dEta: number }[] {
  const base = runCalculation(p);
  const baseM = base.summary.find((c) => c.name.toLowerCase().includes("flexure"))?.demand ?? 0;
  const baseT = base.summary.find((c) => c.name.toLowerCase().includes("tie"))?.demand ?? 0;
  const baseE = base.governing?.eta ?? 0;
  const trials: { name: string; delta: string; mut: (q: Project) => void }[] = [
    { name: "φ' fill", delta: "−2°", mut: (q) => (q.coreFill.phi -= 2) },
    { name: "φ' fill", delta: "+2°", mut: (q) => (q.coreFill.phi += 2) },
    { name: "γ fill", delta: "+1 kN/m³", mut: (q) => (q.coreFill.gamma += 1) },
    { name: "Flood up", delta: "+0.50 m", mut: (q) => (q.water.floodUp += 0.5) },
    { name: "Flood down", delta: "−0.50 m", mut: (q) => (q.water.floodDown -= 0.5) },
    { name: "Traffic q", delta: "+10 kPa", mut: (q) => (q.traffic.q += 10) },
    { name: "Embedment", delta: "−1.00 m", mut: (q) => (q.geometry.embedment -= 1) },
    { name: "Tie level (upper)", delta: "−0.50 m", mut: (q) => { if (q.ties[0]) q.ties[0].elevation -= 0.5; } },
    { name: "Tie diameter", delta: "−8 mm", mut: (q) => q.ties.forEach((t) => (t.diameter -= 8)) },
  ];
  return trials.map((t) => {
    const q = structuredClone(p);
    t.mut(q);
    const r = runCalculation(q);
    const M = r.summary.find((c) => c.name.toLowerCase().includes("flexure"))?.demand ?? 0;
    const T = r.summary.find((c) => c.name.toLowerCase().includes("tie"))?.demand ?? 0;
    const E = r.governing?.eta ?? 0;
    return {
      name: t.name,
      delta: t.delta,
      dM: baseM ? ((M - baseM) / baseM) * 100 : 0,
      dT: baseT ? ((T - baseT) / baseT) * 100 : 0,
      dEta: baseE ? ((E - baseE) / baseE) * 100 : 0,
    };
  });
}

export function resultants(st: Station[]): { Pa: number; zPa: number; PwL: number; zPwL: number; Psur: number } {
  let Pa = 0,
    PwL = 0,
    Psur = 0,
    mA = 0,
    mW = 0;
  for (let i = 1; i < st.length; i++) {
    const dz = st[i - 1]!.z - st[i]!.z;
    const zmid = 0.5 * (st[i - 1]!.z + st[i]!.z);
    const dA = 0.5 * (st[i - 1]!.pSoilCore + st[i]!.pSoilCore) * dz;
    const dW = 0.5 * (st[i - 1]!.uUp + st[i]!.uUp) * dz;
    const dS = 0.5 * (st[i - 1]!.pSur + st[i]!.pSur) * dz;
    Pa += dA;
    PwL += dW;
    Psur += dS;
    mA += dA * zmid;
    mW += dW * zmid;
  }
  return { Pa, zPa: Pa ? mA / Pa : 0, PwL, zPwL: PwL ? mW / PwL : 0, Psur };
}

export { coeffs, phiDesign, surcharge, mrdRect, vrdc, crackWidth };
