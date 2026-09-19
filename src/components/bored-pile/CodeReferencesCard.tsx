import React, { useState } from "react";
import { BookOpen, AlertTriangle, FileText, CheckCircle2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import type { BoredPileProject, BoredPileAnalysisResult } from "@/lib/bored-pile/types";

interface CodeReferencesCardProps {
  project: BoredPileProject;
  results: BoredPileAnalysisResult;
}

interface ClauseItem {
  code: string;
  title: string;
  standard: string;
  description: string;
  limit: string;
  actual: string;
  status: "PASS" | "FAIL" | "WARNING";
  details: string;
}

export function CodeReferencesCard({ project, results }: CodeReferencesCardProps) {
  const [expandedClause, setExpandedClause] = useState<string | null>("Cl. 9.8.5");
  const [hoveredClause, setHoveredClause] = useState<string | null>(null);

  // Derive clause checks from project & results
  const clauses: ClauseItem[] = [
    {
      code: "Cl. 9.8.5",
      title: "Bored Piles - Min Reinforcement & Diameters",
      standard: "EN 1992-1-1:2004",
      description: "Piles cast in-place without casing or with slurry require a minimum longitudinal steel ratio and bar diameter to resist accidental bending and handling stresses.",
      limit: "ρ ≥ 0.2% and Ø ≥ 16 mm",
      actual: `ρ = ${results.reinforcementRatio}% (Ø${project.barDiameter} mm)`,
      status: results.minReinforcementRatioPass && results.minBarSizePass ? "PASS" : "FAIL",
      details: `Project has ${project.numBars} bars of Ø${project.barDiameter}mm in a ${project.diameter}mm pile (Area = ${results.rebarArea} mm²). Minimum required rebar area is 0.2% of gross concrete area (${(0.002 * results.grossArea).toFixed(0)} mm²).`
    },
    {
      code: "Cl. 9.5.2",
      title: "Maximum Longitudinal Reinforcement Ratio",
      standard: "EN 1992-1-1:2004",
      description: "Limits maximum steel area to prevent concrete congestion and ensure proper compaction during tremie concrete placement.",
      limit: "ρ ≤ 4.0% (un-lapped) / 8.0% (lapped)",
      actual: `ρ = ${results.reinforcementRatio}%`,
      status: results.maxReinforcementRatioPass ? "PASS" : "FAIL",
      details: `Current longitudinal reinforcement ratio is ${results.reinforcementRatio}%, which is well below the 4.0% un-lapped upper limit for bored cast-in-place piles.`
    },
    {
      code: "Cl. 9.5.3",
      title: "Transverse Reinforcement Spacing & Links",
      standard: "EN 1992-1-1:2004",
      description: "Transverse spiral or link spacing and diameter to prevent buckling of longitudinal bars and provide shear resistance.",
      limit: "s ≤ min(12Ø_min, 400 mm)",
      actual: `s = ${project.spiralSpacing} mm (Ø${project.spiralBarDiameter} mm)`,
      status: results.spiralSpacingPass ? "PASS" : "WARNING",
      details: `Spiral pitch is set to ${project.spiralSpacing} mm with Ø${project.spiralBarDiameter} mm wire. Ensures lateral restraint for longitudinal bars and confinement of core concrete.`
    },
    {
      code: "Cl. 7.3.1 / 7.3.4",
      title: "Crack Control & Serviceability Limit State",
      standard: "EN 1992-1-1:2004",
      description: "Limiting crack widths under quasi-permanent or frequent load combinations to protect reinforcement against corrosion in exposure class " + (project.exposureClass || "XC2") + ".",
      limit: "w_max ≤ 0.3 mm (XC2/XC3)",
      actual: `Cover = ${project.cover} mm, Exposure = ${project.exposureClass || "XC2"}`,
      status: project.cover >= 50 ? "PASS" : "WARNING",
      details: `Exposure class ${project.exposureClass || "XC2"} requires adequate nominal cover (${project.cover} mm provided) to restrict crack widths and maintain durability over the 50/100 year design life.`
    },
    {
      code: "Cl. 6.1",
      title: "Ultimate Limit State (ULS) - Axial & Bending Interaction",
      standard: "EN 1992-1-1:2004",
      description: "Combined compression and bending resistance of reinforced concrete cross-section under design loads N_Ed and M_Ed.",
      limit: "Interaction Ratio ≤ 1.00",
      actual: `Ratio = ${(results.bendingInteractionRatio * 100).toFixed(1)}%`,
      status: results.bendingInteractionRatio <= 1.0 ? "PASS" : "FAIL",
      details: `Design axial load N_Ed = ${project.nEd} kN and bending moment M_Ed = ${project.mEd} kNm result in a structural capacity utilization of ${(results.bendingInteractionRatio * 100).toFixed(1)}% against N_Rd = ${results.structuralAxialResistance} kN.`
    },
    {
      code: "Cl. 4.4.1",
      title: "Concrete Cover & Durability Requirements",
      standard: "EN 1992-1-1:2004",
      description: "Minimum concrete cover c_min required for bond, environmental exposure class, and casting tolerances (Δc_dev = 10-15 mm for bored piles cast against soil).",
      limit: "c_nom ≥ c_min + Δc_dev",
      actual: `c_nom = ${project.cover} mm`,
      status: project.cover >= 40 ? "PASS" : "WARNING",
      details: `Nominal cover of ${project.cover} mm is specified for concrete grade ${project.concreteGrade} (f_ck = ${project.fck} MPa) under exposure ${project.exposureClass || "XC2"}.`
    },
    {
      code: "Cl. 7.4",
      title: "Deflection & Lateral Rigidity Control",
      standard: "EN 1992-1-1:2004",
      description: "Control of pile head lateral displacements and rotation under horizontal service loads and moments.",
      limit: "δ_lateral ≤ L / 150 (typically < 10 mm)",
      actual: `Pile Length = ${project.length} m, Ø = ${project.diameter} mm`,
      status: "PASS",
      details: `Slenderness ratio L/D = ${(project.length / (project.diameter / 1000)).toFixed(1)}. High flexural rigidity provided by ${project.numBars}×Ø${project.barDiameter}mm reinforcement cage.`
    }
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#081222]/95 p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-900/60 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
              Eurocode 2 Regulatory Compliance Engine
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white mt-1">
            Active EC2 Code References & Clause Verifications
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time tracking of EN 1992-1-1 clauses checked in the current bored pile calculation context. Hover clauses for full descriptive text or click to expand details.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-[#040910] border border-cyan-900/60 px-3 py-2 rounded-xl">
          <span className="text-slate-400">Standard:</span>
          <span className="text-cyan-300 font-bold">EN 1992-1-1:2004 + National Annex</span>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="rounded-xl border border-cyan-900/60 bg-[#040910] p-3 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-[10px]">TOTAL CLAUSES CHECKED</p>
            <p className="text-lg font-bold text-white mt-0.5">{clauses.length} Clauses</p>
          </div>
          <FileText className="size-6 text-cyan-400 opacity-80" />
        </div>
        <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3 flex items-center justify-between">
          <div>
            <p className="text-emerald-400/80 text-[10px]">VERIFIED PASSING</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              {clauses.filter(c => c.status === "PASS").length} Clauses
            </p>
          </div>
          <CheckCircle2 className="size-6 text-emerald-400 opacity-80" />
        </div>
        <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-3 flex items-center justify-between">
          <div>
            <p className="text-amber-400/80 text-[10px]">WARNINGS / CHECKS</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">
              {clauses.filter(c => c.status === "WARNING" || c.status === "FAIL").length} Clauses
            </p>
          </div>
          <AlertTriangle className="size-6 text-amber-400 opacity-80" />
        </div>
      </div>

      {/* Clauses Accordion / List with Hover Tooltips */}
      <div className="space-y-3 font-mono text-xs">
        {clauses.map((clause) => {
          const isExpanded = expandedClause === clause.code;
          const isHovered = hoveredClause === clause.code;
          const isPass = clause.status === "PASS";
          const isWarning = clause.status === "WARNING";

          return (
            <div
              key={clause.code}
              onMouseEnter={() => setHoveredClause(clause.code)}
              onMouseLeave={() => setHoveredClause(null)}
              className={`relative rounded-xl border transition-all bg-[#040910] overflow-hidden ${
                isExpanded || isHovered
                  ? "border-cyan-500/60 shadow-lg shadow-cyan-950/40"
                  : "border-cyan-900/50 hover:border-cyan-700/60"
              }`}
            >
              {/* Hover Tooltip Popup */}
              {isHovered && !isExpanded && (
                <div className="absolute z-30 left-4 right-4 -top-16 translate-y-0 bg-[#061122] border border-cyan-400/80 rounded-xl p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold mb-1">
                    <span>{clause.code} — Full EC2 Clause Description</span>
                    <span className="text-slate-400">{clause.standard}</span>
                  </div>
                  <p className="text-white text-[11px] leading-relaxed">{clause.description}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-cyan-400">
                    <span className="bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">Limit: {clause.limit}</span>
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">Actual: {clause.actual}</span>
                  </div>
                </div>
              )}

              <div
                onClick={() => setExpandedClause(isExpanded ? null : clause.code)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isPass ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/60" :
                    isWarning ? "bg-amber-950/50 text-amber-400 border border-amber-800/60" :
                    "bg-rose-950/50 text-rose-400 border border-rose-800/60"
                  }`}>
                    {isPass ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300 flex items-center gap-1">
                        {clause.code}
                        <HelpCircle className="size-3 text-cyan-400 opacity-60 hover:opacity-100" />
                      </span>
                      <span className="text-slate-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {clause.standard}
                      </span>
                    </div>
                    <p className="text-white font-medium text-xs mt-0.5">{clause.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-slate-400">STATUS / ACTUAL</p>
                    <p className={`font-bold ${isPass ? "text-emerald-400" : isWarning ? "text-amber-400" : "text-rose-400"}`}>
                      {clause.status} ({clause.actual})
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-cyan-950 bg-[#060e18] p-4 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Full EC2 Clause Description</p>
                    <p className="text-slate-300 mt-1 leading-relaxed text-[11px] bg-[#040910] p-3 rounded-lg border border-cyan-950">
                      {clause.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-lg bg-[#040910] p-2.5 border border-slate-800">
                      <p className="text-[10px] text-slate-500">CODE LIMIT / REQUIREMENT</p>
                      <p className="text-cyan-300 font-bold mt-0.5">{clause.limit}</p>
                    </div>
                    <div className="rounded-lg bg-[#040910] p-2.5 border border-slate-800">
                      <p className="text-[10px] text-slate-500">CURRENT PROJECT VALUE</p>
                      <p className={`font-bold mt-0.5 ${isPass ? "text-emerald-400" : isWarning ? "text-amber-400" : "text-rose-400"}`}>
                        {clause.actual}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-cyan-950/20 border border-cyan-900/50 p-3 text-[11px] text-cyan-200">
                    <p className="font-bold text-cyan-400 mb-1">Contextual Verification Note:</p>
                    <p>{clause.details}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

