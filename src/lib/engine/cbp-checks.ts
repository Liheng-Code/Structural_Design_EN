import type { AnalysisResult, CalcBundle, CbpInteractionResult, CheckResult, LoadCaseDef, Project, VariableRow } from "./types";
import { mkCheck } from "./math";
import {
  anchorageLength,
  capacityMAtN,
  cbpSolidRatio,
  circularGeometry,
  crackWidthCircular,
  lapLength,
  minMaxLongitudinalRatio,
  nmInteractionEnvelope,
  nmUtilization,
  transverseCheck,
  vrdCircular,
  type CircularSectionInput,
} from "./cbp-section";
import { fmt } from "../utils";

function sectionInput(p: Project): CircularSectionInput {
  return {
    diameter: p.cbp.diameter,
    cover: p.cbp.cover,
    barDiameter: p.cbp.barDiameter,
    barCount: p.cbp.barCount,
    stirrupDiameter: p.cbp.stirrupDiameter,
    fck: p.cbp.fck,
    fyk: p.cbp.fyk,
    gammaCconc: p.factors.gammaCconc,
    gammaS: p.factors.gammaS,
    alphaCc: p.factors.alphaCc,
  };
}

export function cbpWallChecks(
  p: Project,
  lc: LoadCaseDef,
  analysis: AnalysisResult,
  side: string,
): { checks: CheckResult[]; interaction: CbpInteractionResult } {
  const sIn = sectionInput(p);
  const geo = circularGeometry(sIn);
  const fyd = p.cbp.fyk / p.factors.gammaS;
  const spacing = p.cbp.spacing;

  // Per-pile demand: the beam analysis reports moment/shear per metre run of wall;
  // convert to a single-pile value using the tributary width (pile spacing).
  const MEd = Math.max(Math.abs(analysis.Mmax), Math.abs(analysis.Mmin)) * spacing;
  const VEd = Math.abs(analysis.Vmax) * spacing;
  const NEd = 25 * (geo.Ac_mm2 / 1e6) * (p.geometry.retainedHeight + p.geometry.embedment) * 0.5 * p.factors.gammaG;

  const { envelope, NRd0, MRd0, balanced } = nmInteractionEnvelope(sIn);
  const utilization = nmUtilization(envelope, NEd, MEd);
  const MRdAtNEd = capacityMAtN(envelope, NEd);

  const out: CheckResult[] = [];

  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-axial`,
        name: `CBP pile axial (${side})`,
        category: "ULS",
        demand: NEd,
        resistance: NRd0,
        unit: "kN",
        utilization: NRd0 > 0 ? NEd / NRd0 : 99,
        explanation:
          "Axial force from the pile's own self-weight above the critical section, compared with the pure-axial (squash) capacity of the circular RC section.",
        formula: "N_{Rd0}=A_c f_{cd}+A_s f_{yd}",
        substitution: `N_Ed=${fmt(NEd, 1)} kN, A_c=${fmt(geo.Ac_mm2 / 1e6, 3)} m², N_Rd0=${fmt(NRd0, 1)} kN`,
        assumptions: ["Self-weight only; no designed vertical prestress or superstructure load transfer modelled"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-flexure`,
        name: `CBP pile flexure (${side})`,
        category: "ULS",
        demand: MEd,
        resistance: MRdAtNEd,
        unit: "kNm",
        utilization: MRdAtNEd > 0 ? MEd / MRdAtNEd : 99,
        explanation:
          "The net lateral pressure on the wall is applied to a beam-on-elastic-foundation model of a single pile (per-metre demand scaled by pile spacing). Peak moment is compared with the circular-section moment capacity at the concurrent axial force, read off the EN 1992-1-1 N-M interaction envelope (fibre discretisation, parabola-rectangle stress block).",
        formula: "M_{Rd}(N_{Ed}) \\text{ read off the } N\\text{-}M \\text{ interaction envelope}",
        substitution: `M_Ed=${fmt(MEd, 1)} kNm/pile, N_Ed=${fmt(NEd, 1)} kN, M_Rd(N_Ed)=${fmt(MRdAtNEd, 1)} kNm`,
        assumptions: [
          `Lateral model: ${p.cbp.lateralModel} (Master Prompt §20 — individual pile vs equivalent wall)`,
          "Concrete compression integrated over gross circular area, no bar-hole deduction (ASSUMPTION)",
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
        id: `${lc.id}-${side}-cbp-nm`,
        name: `CBP combined N-M (${side})`,
        category: "ULS",
        demand: MEd,
        resistance: utilization > 1e-9 ? MEd / utilization : MRdAtNEd,
        unit: "kNm",
        utilization,
        explanation:
          "Radial-scaling utilization on the N-M interaction envelope: the ratio of the origin-to-operating-point distance to the origin-to-envelope distance along the same (N_Ed, M_Ed) ray. This accounts for the combined effect of axial force and moment, not moment alone.",
        formula: "\\eta = |OP_{Ed}| / |OP_{Rd}| \\text{ along the ray through } (N_{Ed}, M_{Ed})",
        substitution: `N_Ed=${fmt(NEd, 1)} kN, M_Ed=${fmt(MEd, 1)} kNm, η=${fmt(utilization, 2)}, balanced point N_bal=${fmt(balanced.N, 1)} kN / M_bal=${fmt(balanced.M, 1)} kNm, M_Rd0=${fmt(MRd0, 1)} kNm`,
        assumptions: ["EN 1992-1-1 methodology; National Annex partial factors as adopted elsewhere in this calculation"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const VRd = vrdCircular(geo.Dmm, geo.As_mm2, p.cbp.fck, p.factors.gammaCconc, NEd, geo.Ac_mm2);
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-shear`,
        name: `CBP pile shear (${side})`,
        category: "ULS",
        demand: VEd,
        resistance: VRd,
        unit: "kN",
        utilization: VRd > 0 ? VEd / VRd : 99,
        explanation:
          "Peak shear (per pile) compared with V_Rd,c of EN 1992-1-1 §6.2.2 for members without shear reinforcement, generalised for a circular section and enhanced for the concurrent axial compression.",
        formula: "V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}+k_1\\sigma_{cp}]\\,b_w d",
        substitution: `V_Ed=${fmt(VEd, 1)} kN, V_Rd,c=${fmt(VRd, 1)} kN`,
        assumptions: [
          "Effective rectangular chord bw≈0.9D, d≈0.8D (ASSUMPTION — circular-section shear reduction pending validated method)",
          "No designed shear reinforcement (stirrups/spiral provide confinement and buildability, not a designed shear resistance)",
        ],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const { asMin, asMax } = minMaxLongitudinalRatio(NEd, geo.Ac_mm2, fyd);
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-asmin`,
        name: `CBP minimum longitudinal reinforcement (${side})`,
        category: "DET",
        demand: asMin,
        resistance: geo.As_mm2,
        unit: "mm²",
        utilization: geo.As_mm2 > 0 ? asMin / geo.As_mm2 : 99,
        explanation:
          "EN 1992-1-1 §9.8.5 pile-specific minimum longitudinal reinforcement (0.5% Ac tapering to 0.25% Ac for Ac ≥ 1.0 m²), cross-checked against the §9.5.2 general column minimum.",
        formula: "A_{s,min}=\\max(0.10 N_{Ed}/f_{yd},\\,0.002 A_c,\\,\\rho_{pile}A_c)",
        substitution: `A_s,min=${fmt(asMin, 0)} mm², A_s,provided=${fmt(geo.As_mm2, 0)} mm² (${p.cbp.barCount}×${p.cbp.barDiameter} mm)`,
        assumptions: ["Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-asmax`,
        name: `CBP maximum longitudinal reinforcement (${side})`,
        category: "DET",
        demand: geo.As_mm2,
        resistance: asMax,
        unit: "mm²",
        utilization: asMax > 0 ? geo.As_mm2 / asMax : 99,
        explanation: "EN 1992-1-1 §9.5.2 maximum longitudinal reinforcement ratio, 4% of the gross concrete area outside lap zones.",
        formula: "A_{s,max}=0.04 A_c",
        substitution: `A_s,provided=${fmt(geo.As_mm2, 0)} mm², A_s,max=${fmt(asMax, 0)} mm²`,
        assumptions: ["Outside lap zones; lapped sections may permit up to 0.08 A_c per the National Annex"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const { diaMin, spacingMax } = transverseCheck(p.cbp.barDiameter, p.cbp.stirrupDiameter, geo.Dmm);
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-transverse`,
        name: `CBP transverse reinforcement (${side})`,
        category: "DET",
        demand: diaMin,
        resistance: p.cbp.stirrupDiameter,
        unit: "mm",
        utilization: p.cbp.stirrupDiameter > 0 ? diaMin / p.cbp.stirrupDiameter : 99,
        explanation: "EN 1992-1-1 §9.5.3 general column transverse reinforcement provisions (minimum diameter and maximum pitch).",
        formula: "\\phi_{t,min}=\\max(6\\,\\text{mm},\\,\\phi_l/4),\\quad s_{cl,t,max}=\\min(20\\phi_l, D, 400\\,\\text{mm})",
        substitution: `φ_t,min=${fmt(diaMin, 0)} mm, φ_t,provided=${p.cbp.stirrupDiameter} mm, s_max=${fmt(spacingMax, 0)} mm`,
        assumptions: ["Stirrup/spiral pitch is not currently a modelled input — verify the provided pitch ≤ s_max on the pile shop drawings"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const lb = anchorageLength(p.cbp.barDiameter, p.cbp.fck, p.cbp.fyk, p.factors.gammaCconc, p.factors.gammaS);
  const cappingDepth = p.capping.enabled ? Math.max(p.capping.h * 1000 - p.capping.cover, 1) : 0;
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-anchorage`,
        name: `CBP bar anchorage into capping beam (${side})`,
        category: "DET",
        demand: lb,
        resistance: cappingDepth,
        unit: "mm",
        utilization: cappingDepth > 0 ? lb / cappingDepth : 99,
        explanation: "EN 1992-1-1 §8.4 basic anchorage length for the pile main bars, checked against the available embedment depth into the capping beam.",
        formula: "l_{b,rqd}=(\\phi/4)(f_{yd}/f_{bd}),\\quad f_{bd}=2.25 f_{ctd}",
        substitution: `l_b,rqd=${fmt(lb, 0)} mm, available depth=${fmt(cappingDepth, 0)} mm`,
        assumptions: ["Good bond conditions, η1=η2=1 (ASSUMPTION)", "Pile main bars assumed to anchor directly into the capping beam"],
        applicable: p.capping.enabled,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const l0 = lapLength(p.cbp.barDiameter, p.cbp.fck, p.cbp.fyk, p.factors.gammaCconc, p.factors.gammaS, 50);
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-lap`,
        name: `CBP lap length (${side})`,
        category: "DET",
        demand: l0,
        resistance: l0,
        unit: "mm",
        status: "NOT VERIFIED",
        utilization: 1,
        explanation:
          "EN 1992-1-1 §8.7 required lap length for the pile main bars (50% lapped at one section assumed). Actual lap detailing is not a modelled input and must be confirmed against the reinforcement shop drawings.",
        formula: "l_0=\\max(\\alpha_6\\, l_{b,rqd},\\,15\\phi,\\,200\\,\\text{mm})",
        substitution: `l_0=${fmt(l0, 0)} mm (α_6 for 50% lapped)`,
        assumptions: ["α1=α2=α3=α5=1 (straight bars, no confinement credit) (ASSUMPTION)", "SPECIALIST CHECK REQUIRED against actual bar detailing"],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const wk = crackWidthCircular(sIn, MEd / Math.max(p.factors.gammaG, 1));
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-crack`,
        name: `CBP crack width (${side})`,
        category: "SLS",
        demand: wk,
        resistance: p.limits.wkLimit,
        unit: "mm",
        utilization: p.limits.wkLimit > 0 ? wk / p.limits.wkLimit : 99,
        explanation: "Simplified EN 1992-1-1 crack-width estimate for the circular section's tension chord, using quasi-permanent steel stress from the unfactored moment.",
        formula: "w_k=s_{r,max}(\\varepsilon_{sm}-\\varepsilon_{cm})",
        substitution: `w_k=${fmt(wk, 3)} mm, w_lim=${p.limits.wkLimit} mm`,
        assumptions: [
          "Tension-side steel taken as half the pile cage, effective tension area referenced to the full diameter (ASSUMPTION)",
          "Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition.",
        ],
        applicable: true,
        loadCaseId: lc.id,
      },
      p.limits,
    ),
  );

  const cmin = p.limits.crackForWaterRetaining ? 40 : 30;
  out.push(
    mkCheck(
      {
        id: `${lc.id}-${side}-cbp-cover`,
        name: `CBP durability cover (${side})`,
        category: "DUR",
        demand: cmin,
        resistance: p.cbp.cover,
        unit: "mm",
        utilization: p.cbp.cover > 0 ? cmin / p.cbp.cover : 99,
        explanation: "Nominal cover to the pile main bars. Water-retaining/flood exposure is more onerous than internal XC1. Confirm exposure class with the project specification.",
        formula: "c_{nom}\\ge c_{min}",
        substitution: `c_min=${cmin} mm, c_nom=${p.cbp.cover} mm, exposure ${p.limits.exposure}`,
        assumptions: ["c_min provisionally 40 mm for XC4/XF3 flood structure (ASSUMPTION)"],
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
          explanation: "Tie force is the Winkler-beam support reaction at the tie elevation, converted from force per metre of wall to force per bar using the tributary spacing.",
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

  return {
    checks: out,
    interaction: { envelope, NRd0, MRd0, balanced, operating: { NEd, MEd }, utilization },
  };
}

export function variablesCbp(p: Project, d: CalcBundle["derived"]): VariableRow[] {
  const geo = circularGeometry(sectionInput(p));
  return [
    { symbol: "H", description: "Retained / exposed height", value: fmt(p.geometry.retainedHeight, 2), unit: "m", source: "USER INPUT" },
    { symbol: "D_{emb}", description: "Embedment below riverbed", value: fmt(p.geometry.embedment, 2), unit: "m", source: "USER INPUT" },
    { symbol: "D", description: "Pile diameter", value: fmt(p.cbp.diameter, 2), unit: "m", source: "USER INPUT" },
    { symbol: "s", description: "Pile centre spacing", value: fmt(p.cbp.spacing, 2), unit: "m", source: "USER INPUT" },
    { symbol: "D/s", description: "Wall solid ratio", value: fmt(cbpSolidRatio(p.cbp.diameter, p.cbp.spacing), 3), unit: "–", source: "DERIVED VALUE" },
    { symbol: "\\text{model}", description: "Lateral interaction model", value: p.cbp.lateralModel, unit: "–", source: "USER INPUT" },
    { symbol: "L_{pile}", description: "Pile length", value: fmt(p.cbp.pileLength, 2), unit: "m", source: "USER INPUT" },
    { symbol: "f_{ck}", description: "Concrete cylinder strength", value: fmt(p.cbp.fck, 0), unit: "MPa", source: "USER INPUT" },
    { symbol: "f_{yk}", description: "Reinforcement yield", value: fmt(p.cbp.fyk, 0), unit: "MPa", source: "USER INPUT" },
    { symbol: "c_{nom}", description: "Nominal cover", value: fmt(p.cbp.cover, 0), unit: "mm", source: "USER INPUT" },
    { symbol: "n\\times\\phi_l", description: "Longitudinal bars", value: `${p.cbp.barCount}×${p.cbp.barDiameter}`, unit: "mm", source: "USER INPUT" },
    { symbol: "\\phi_t", description: "Stirrup/spiral diameter", value: fmt(p.cbp.stirrupDiameter, 0), unit: "mm", source: "USER INPUT" },
    { symbol: "A_c", description: "Gross pile section area", value: fmt(geo.Ac_mm2 / 1e6, 3), unit: "m²", source: "DERIVED VALUE" },
    { symbol: "A_s", description: "Longitudinal reinforcement area", value: fmt(geo.As_mm2, 0), unit: "mm²", source: "DERIVED VALUE" },
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
    { symbol: "n_h", description: "Subgrade modulus rate", value: fmt(p.cbp.nh, 0), unit: "kN/m³", source: "ASSUMPTION" },
    { symbol: "E_{cm}", description: "Concrete secant modulus", value: fmt(d.Ecm, 0), unit: "MPa", source: "CODE PARAMETER" },
    { symbol: "I_g", description: "Gross pile section inertia", value: fmt(geo.Ig_m4 * 1e12, 0), unit: "mm⁴", source: "DERIVED VALUE" },
  ];
}
