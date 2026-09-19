import React, { useState } from "react";
import { Info, ShieldCheck, AlertTriangle } from "lucide-react";
import type { BoredPileProject, BoredPileAnalysisResult } from "@/lib/bored-pile/types";
import { SettlementDiagram } from "./SettlementDiagram";
import { SettlementTable } from "./SettlementTable";

interface SettlementTabProps {
  project: BoredPileProject;
  setProject: (p: BoredPileProject) => void;
  results: BoredPileAnalysisResult;
}

export function SettlementTab({ project, results }: SettlementTabProps) {
  const [serviceRatio, setServiceRatio] = useState<number>(0.7);

  const serviceLoad = Math.round(project.nEd * serviceRatio);
  const utilization = (results.settlementTotal / results.allowableSettlement) * 100;
  const isPass = results.settlementTotal <= results.allowableSettlement;
  const isWarning = utilization > 80 && isPass;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-cyan-900/60 pb-4 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                EN 1997-1 Serviceability Limit State (SLS) Settlement Analysis
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              Single-Pile Settlement & Soil Deformation Analysis
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Layer-by-layer immediate elastic settlement and primary consolidation settlement under service loads.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#040910] border border-cyan-500/40 px-4 py-3 rounded-xl font-mono">
            <div>
              <p className="text-[10px] text-slate-400">TOTAL SETTLEMENT</p>
              <p className={`text-xl font-bold ${isPass ? "text-cyan-300" : "text-amber-400"}`}>
                {results.settlementTotal} mm {isPass ? "(PASS)" : "(EXCEEDS)"}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800 mx-2" />
            <div>
              <p className="text-[10px] text-slate-400">ALLOWABLE LIMIT</p>
              <p className="text-xl font-bold text-emerald-400">
                {results.allowableSettlement} mm
              </p>
            </div>
          </div>
        </div>

        {/* Visual SLS Status Indicator & Utilization Banner */}
        <div className={`mb-6 p-4 rounded-xl border font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          !isPass 
            ? "bg-amber-950/30 border-amber-500/50 text-amber-200" 
            : isWarning 
            ? "bg-amber-950/20 border-amber-600/40 text-amber-300"
            : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${!isPass ? "bg-amber-500/20 text-amber-400" : isWarning ? "bg-amber-600/20 text-amber-300" : "bg-emerald-500/20 text-emerald-400"}`}>
              {!isPass ? <AlertTriangle className="size-5" /> : isWarning ? <AlertTriangle className="size-5" /> : <ShieldCheck className="size-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  {!isPass ? "SLS SETTLEMENT LIMIT EXCEEDED" : isWarning ? "SLS WARNING: HIGH UTILIZATION" : "SLS SETTLEMENT VERIFIED (PASS)"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!isPass ? "bg-amber-500/30 text-amber-300" : isWarning ? "bg-amber-600/30 text-amber-300" : "bg-emerald-500/30 text-emerald-300"}`}>
                  {utilization.toFixed(1)}% Capacity Used
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {!isPass 
                  ? `Calculated total settlement (${results.settlementTotal} mm) exceeds the allowable limit (${results.allowableSettlement} mm). Consider increasing pile dimensions or soil stiffness.`
                  : isWarning
                  ? `Calculated total settlement (${results.settlementTotal} mm) is approaching the allowable limit (${results.allowableSettlement} mm).`
                  : `Calculated total settlement (${results.settlementTotal} mm) is safely within the allowable project limit (${results.allowableSettlement} mm).`}
              </p>
            </div>
          </div>
          <div className="w-full md:w-48 bg-slate-900/90 rounded-full h-3 border border-slate-700 overflow-hidden p-0.5 shrink-0">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                !isPass ? "bg-amber-500" : isWarning ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>

        {/* User Input & Parameter Requirements Guide */}
        <div className="mb-6 p-4 rounded-xl bg-[#040910] border border-cyan-900/60 font-mono text-xs space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold border-b border-cyan-900/40 pb-2">
            <Info className="size-4 text-cyan-400" />
            <span>Required User Inputs & Methodology for Settlement SLS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <p className="text-cyan-400 font-bold mb-1">1. Service Load (N_SLS)</p>
              <p className="text-[11px] text-slate-400">
                Typically 60% to 70% of ultimate design load (N_Ed). Adjustable below via service ratio slider.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <p className="text-cyan-400 font-bold mb-1">2. Soil Stiffness (E_50 / E_oed)</p>
              <p className="text-[11px] text-slate-400">
                Secant stiffness modulus (E_50) for immediate elastic settlement and oedometer modulus (E_oed) or compression index (C_c) for consolidation in clay layers (configured in Tab 2).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <p className="text-cyan-400 font-bold mb-1">3. Groundwater Level (GWL)</p>
              <p className="text-[11px] text-slate-400">
                Groundwater level at {project.waterLevel}m bgl governs effective overburden stresses and buoyant unit weights.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs bg-[#040910] p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Service Load Ratio (N_SLS / N_Ed):</span>
              <span className="text-cyan-400 font-bold">{(serviceRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={serviceRatio}
              onChange={(e) => setServiceRatio(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">N_SLS = {serviceLoad} kN (from N_Ed {project.nEd} kN)</p>
          </div>
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Allowable Settlement Limit:</span>
              <span className="text-emerald-400 font-bold">{results.allowableSettlement} mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={results.allowableSettlement}
              readOnly
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Standard structural limit: 25 mm</p>
          </div>
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Concrete Elastic Modulus (E_c):</span>
              <span className="text-cyan-400 font-bold">30.0 GPa ({project.concreteGrade})</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Pile Shortening (ΔL): <strong className="text-white">{results.settlementElastic} mm</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Graphs & Diagrams Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settlement by Soil Layer Diagram */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <SettlementDiagram
            layerSettlements={results.layerSettlements}
            allowableSettlement={results.allowableSettlement}
          />
        </div>

        {/* Visual Soil Stratification & Settlement Profile Diagram */}
        <div className="lg:col-span-5 bg-[#040910] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 font-mono">
            <h3 className="text-xs font-bold text-slate-200 uppercase">
              Stratum Settlement Profile Diagram
            </h3>
            <span className="text-[10px] text-emerald-400">Depth vs Settlement</span>
          </div>

          <div className="relative flex-1 flex items-center justify-center py-2 min-h-[320px]">
            <svg viewBox="0 0 400 340" className="w-full h-[320px]" role="img" aria-label="Settlement profile diagram by soil layer">
              <defs>
                <linearGradient id="settlement-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Axes */}
              <line x1="60" y1="30" x2="60" y2="300" stroke="#334155" strokeWidth="2" />
              <line x1="60" y1="300" x2="360" y2="300" stroke="#334155" strokeWidth="2" />

              <text x="60" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Settlement (mm)</text>
              <text x="360" y="318" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">Depth (m)</text>

              {/* Draw soil layers and cumulative settlement curve */}
              {project.layers.map((layer) => {
                const maxDepth = Math.max(project.length, 30);
                const yTop = 30 + (layer.topDepth / maxDepth) * 270;
                const yBot = 30 + (Math.min(maxDepth, layer.bottomDepth) / maxDepth) * 270;
                const layerRes = results.layerSettlements.find(l => l.layerId === layer.id);
                const sett = layerRes ? layerRes.totalLayerSettlement : 0;

                return (
                  <g key={layer.id}>
                    <rect x="70" y={yTop} width="280" height={Math.max(10, yBot - yTop)} fill="#0f172a" fillOpacity="0.6" stroke="#334155" />
                    <text x="80" y={yTop + 14} fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {layer.id}: {layer.name} ({sett} mm)
                    </text>
                  </g>
                );
              })}

              {/* Settlement curve representation */}
              <path
                d={`M 60 30 C 120 100, 200 200, ${60 + Math.min(280, results.settlementTotal * 8)} 300`}
                fill="none"
                stroke="url(#settlement-grad)"
                strokeWidth="3.5"
              />
              <circle cx={60 + Math.min(280, results.settlementTotal * 8)} cy="300" r="5" fill="#f59e0b" />
              <text x={70 + Math.min(280, results.settlementTotal * 8)} y="295" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Total S = {results.settlementTotal} mm
              </text>
            </svg>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Elastic Shortening: <strong className="text-cyan-400">{results.settlementElastic} mm</strong></span>
            <span>Soil Deformation: <strong className="text-amber-400">{results.settlementSoil} mm</strong></span>
          </div>
        </div>
      </div>

      {/* Detailed Layer Settlement Breakdown Table */}
      <SettlementTable
        layerSettlements={results.layerSettlements}
        allowableSettlement={results.allowableSettlement}
      />
    </div>
  );
}
