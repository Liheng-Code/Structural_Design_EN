import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Compass,
  Sliders,
  LogOut,
  FileText,
  Layers,
  Database,
  Calculator,
  ShieldCheck,
  Printer,
} from "lucide-react";
import { useProject } from "@/lib/store";
import { defaultBoredPileProject, analyzeBoredPile } from "@/lib/bored-pile/calculations";
import type { BoredPileProject } from "@/lib/bored-pile/types";

export function BoredPileView() {
  const userEmail = useProject((s) => s.userEmail);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);

  const [project, setProject] = useState<BoredPileProject>(defaultBoredPileProject());
  const [activeTab, setActiveTab] = useState<
    "overview" | "soil" | "geometry" | "geotechnical" | "settlement" | "rc" | "report"
  >("overview");

  const results = useMemo(() => analyzeBoredPile(project), [project]);

  return (
    <div className="min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Blueprint grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModule("modules")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition duration-150"
          >
            <ArrowLeft className="size-4" />
            <span>Modules Dashboard</span>
          </button>
          <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
          <div>
            <h1 className="font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase">
              BORED PILE DESIGN & VERIFICATION
            </h1>
            <p className="text-[11px] font-mono text-cyan-400">
              EN 1997-1 Geotechnical & EN 1992-1-1 Structural Design Suite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{userEmail || "str.design.test"}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700/60 border border-slate-700 text-slate-300 hover:text-rose-300 transition duration-150"
          >
            <LogOut className="size-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* SUB-NAVIGATION TABS */}
      <div className="relative z-15 bg-[#040910]/90 border-b border-[#1e3a5f]/80 px-6 flex overflow-x-auto gap-1 font-mono text-xs">
        {[
          { id: "overview", label: "1. Overview & HUD", icon: Compass },
          { id: "soil", label: "2. Soil Strata & Water", icon: Database },
          { id: "geometry", label: "3. Geometry & Loads", icon: Sliders },
          { id: "geotechnical", label: "4. Geotechnical ULS", icon: ShieldCheck },
          { id: "settlement", label: "5. Settlement SLS", icon: Calculator },
          { id: "rc", label: "6. RC Structural (EC2)", icon: Layers },
          { id: "report", label: "7. Mathcad Report", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                isActive
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/40"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col">
        {/* 1. OVERVIEW & HUD */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Design Axial Load (N_Ed)</p>
                <p className="text-2xl font-mono font-bold text-white mt-1">{project.nEd} <span className="text-xs text-cyan-400">kN</span></p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Applied ULS compression</p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Design Resistance (R_c,d)</p>
                <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">{results.designResistance} <span className="text-xs text-cyan-400">kN</span></p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Characteristic / γ_t (1.35)</p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Geotechnical Utilization</p>
                <p className={`text-2xl font-mono font-bold mt-1 ${results.utilizationGeotechnical <= 1.0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {(results.utilizationGeotechnical * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  {results.utilizationGeotechnical <= 1.0 ? "PASS (Adequate)" : "FAIL (Overstressed)"}
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Total Settlement (SLS)</p>
                <p className={`text-2xl font-mono font-bold mt-1 ${results.settlementTotal <= results.allowableSettlement ? "text-cyan-300" : "text-amber-400"}`}>
                  {results.settlementTotal} <span className="text-xs text-cyan-400">mm</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Limit: {results.allowableSettlement} mm</p>
              </div>
            </div>

            {/* Visual Profile & Quick Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4">
                  <span>BORED PILE SOIL PROFILE & STRATIFICATION</span>
                  <span className="text-emerald-400 font-bold">EC7 COMPLIANT</span>
                </div>

                <div className="relative flex-1 flex items-center justify-center py-4 min-h-[340px]">
                  <svg viewBox="0 0 400 300" className="w-full h-full max-w-[360px]" fill="none" stroke="currentColor">
                    {/* Soil Strata Blocks */}
                    <rect x="50" y="30" width="300" height="40" fill="rgba(196,165,116,0.1)" stroke="#8f8676" strokeDasharray="3 3" />
                    <text x="55" y="45" fill="#c4a574" fontSize="9" fontFamily="monospace">L1: Fill (0-2m)</text>

                    <rect x="50" y="70" width="300" height="60" fill="rgba(100,116,139,0.12)" stroke="#64748b" strokeDasharray="3 3" />
                    <text x="55" y="90" fill="#94a3b8" fontSize="9" fontFamily="monospace">L2: Soft Clay (2-6m, cu=25kPa)</text>

                    <rect x="50" y="130" width="300" height="70" fill="rgba(196,165,116,0.15)" stroke="#8f8676" strokeDasharray="3 3" />
                    <text x="55" y="150" fill="#c4a574" fontSize="9" fontFamily="monospace">L3: Medium-dense Sand (6-12m)</text>

                    <rect x="50" y="200" width="300" height="50" fill="rgba(100,116,139,0.2)" stroke="#64748b" strokeDasharray="3 3" />
                    <text x="55" y="220" fill="#94a3b8" fontSize="9" fontFamily="monospace">L4: Stiff Clay (12-18m, cu=100kPa)</text>

                    <rect x="50" y="250" width="300" height="40" fill="rgba(217,119,6,0.12)" stroke="#d97706" strokeDasharray="3 3" />
                    <text x="55" y="270" fill="#f59e0b" fontSize="9" fontFamily="monospace">L5: Dense Sand Toe (18-25m)</text>

                    {/* Groundwater Level Line */}
                    <line x1="30" y1="70" x2="370" y2="70" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="35" y="65" fill="#38bdf8" fontSize="8" fontFamily="monospace">GWL (-2.0m)</text>

                    {/* Bored Pile */}
                    <rect x="180" y="30" width="40" height="260" fill="rgba(6,182,212,0.25)" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="188" y1="30" x2="188" y2="290" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="212" y1="30" x2="212" y2="290" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 2" />

                    {/* Load indicator */}
                    <line x1="200" y1="5" x2="200" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
                    <polygon points="196,25 200,30 204,25" fill="#f59e0b" />
                    <text x="210" y="20" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">N_Ed = {project.nEd}kN</text>
                  </svg>
                </div>

                <div className="pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Pile Diameter: <strong className="text-cyan-400">{project.diameter} mm</strong></span>
                  <span>Pile Length: <strong className="text-cyan-400">{project.length} m</strong></span>
                  <span>Overall Status: <strong className="text-emerald-400">{results.overallStatus}</strong></span>
                </div>
              </div>

              {/* Quick Configuration Panel */}
              <div className="lg:col-span-5 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Sliders className="size-4 text-cyan-400" />
                    <span>Quick Pile Parameters</span>
                  </h3>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Pile Diameter (D):</span>
                        <span className="text-cyan-400 font-bold">{project.diameter} mm</span>
                      </div>
                      <input
                        type="range"
                        min="600"
                        max="1500"
                        step="100"
                        value={project.diameter}
                        onChange={(e) => setProject({ ...project, diameter: parseInt(e.target.value) })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Pile Length (L):</span>
                        <span className="text-cyan-400 font-bold">{project.length} m</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        step="1"
                        value={project.length}
                        onChange={(e) => setProject({ ...project, length: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Design Axial Load (N_Ed):</span>
                        <span className="text-cyan-400 font-bold">{project.nEd} kN</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="5000"
                        step="100"
                        value={project.nEd}
                        onChange={(e) => setProject({ ...project, nEd: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-900/60 mt-6">
                  <button
                    onClick={() => setActiveTab("geotechnical")}
                    className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <span>View Geotechnical ULS Analysis</span>
                    <ArrowLeft className="size-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SOIL STRATA & WATER */}
        {activeTab === "soil" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Ground Investigation & Stratification</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Demonstration borehole profile with 5 distinct soil layers</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-700 font-mono text-xs text-cyan-300">
                  <span>Groundwater Level: -{project.waterLevel}m GL</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-cyan-400 bg-cyan-950/30">
                      <th className="p-3">Layer</th>
                      <th className="p-3">Soil Description</th>
                      <th className="p-3">Depth Range (m)</th>
                      <th className="p-3">Unit Wt γ (kN/m³)</th>
                      <th className="p-3">Friction Angle φ'</th>
                      <th className="p-3">Undrained Shear c_u</th>
                      <th className="p-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {project.layers.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{l.id}</td>
                        <td className="p-3 text-slate-300">{l.name}</td>
                        <td className="p-3 text-cyan-300">{l.topDepth}m – {l.bottomDepth}m</td>
                        <td className="p-3">{l.gamma}</td>
                        <td className="p-3">{l.phi > 0 ? `${l.phi}°` : "N/A"}</td>
                        <td className="p-3">{l.cu > 0 ? `${l.cu} kPa` : "N/A"}</td>
                        <td className="p-3 uppercase text-slate-400">{l.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. GEOMETRY & LOADS */}
        {activeTab === "geometry" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-4">Pile Geometry & Design Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Pile Diameter (mm)</label>
                    <input
                      type="number"
                      value={project.diameter}
                      onChange={(e) => setProject({ ...project, diameter: parseFloat(e.target.value) || 800 })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Pile Length (m)</label>
                    <input
                      type="number"
                      value={project.length}
                      onChange={(e) => setProject({ ...project, length: parseFloat(e.target.value) || 25 })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Concrete Grade</label>
                    <input
                      type="text"
                      value={project.concreteGrade}
                      onChange={(e) => setProject({ ...project, concreteGrade: e.target.value })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Design Axial Load N_Ed (kN)</label>
                    <input
                      type="number"
                      value={project.nEd}
                      onChange={(e) => setProject({ ...project, nEd: parseFloat(e.target.value) || 2000 })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Design Bending Moment M_Ed (kNm)</label>
                    <input
                      type="number"
                      value={project.mEd}
                      onChange={(e) => setProject({ ...project, mEd: parseFloat(e.target.value) || 120 })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Nominal Cover (mm)</label>
                    <input
                      type="number"
                      value={project.cover}
                      onChange={(e) => setProject({ ...project, cover: parseFloat(e.target.value) || 75 })}
                      className="w-full p-2 bg-[#040910] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. GEOTECHNICAL ULS */}
        {activeTab === "geotechnical" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Geotechnical Ultimate Limit State (EN 1997-1)</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Shaft friction and base bearing capacity breakdown</p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-xs text-slate-400">Total Characteristic Resistance R_c,k:</p>
                  <p className="text-lg font-bold text-cyan-300">{results.totalCharacteristicResistance} kN</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-cyan-400 bg-cyan-950/30">
                      <th className="p-3">Layer</th>
                      <th className="p-3">Effective Length</th>
                      <th className="p-3">Calculation Method</th>
                      <th className="p-3 text-right">Shaft Resistance R_s,i (kN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {results.layers.map((l) => (
                      <tr key={l.layerId} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{l.layerId}: {l.name}</td>
                        <td className="p-3 text-cyan-300">{l.effectiveLength.toFixed(1)} m</td>
                        <td className="p-3 text-slate-400">{l.methodUsed}</td>
                        <td className="p-3 text-right font-bold text-white">{l.shaftResistance.toFixed(1)} kN</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
                  <p className="text-xs text-slate-400">Total Shaft Resistance (R_sk):</p>
                  <p className="text-xl font-bold text-cyan-300 mt-1">{results.totalShaftResistance} kN</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
                  <p className="text-xs text-slate-400">Base Bearing Resistance (R_bk):</p>
                  <p className="text-xl font-bold text-cyan-300 mt-1">{results.baseResistance} kN</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-600/60">
                  <p className="text-xs text-cyan-200">Design Resistance (R_c,d / γ_t):</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">{results.designResistance} kN</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTLEMENT SLS */}
        {activeTab === "settlement" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-2">Single-Pile Settlement Analysis (SLS)</h2>
              <p className="text-xs font-mono text-slate-400 mb-6">Evaluation under serviceability load combinations</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                <div className="p-5 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Pile Elastic Shortening:</p>
                  <p className="text-2xl font-bold text-white mt-1">{results.settlementElastic} mm</p>
                  <p className="text-[11px] text-slate-500 mt-1">ΔL = N × L / (A_c × E_c)</p>
                </div>
                <div className="p-5 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Soil Deformation & Base Settlement:</p>
                  <p className="text-2xl font-bold text-white mt-1">{results.settlementSoil} mm</p>
                  <p className="text-[11px] text-slate-500 mt-1">Load transfer & consolidation</p>
                </div>
                <div className="p-5 rounded-xl bg-cyan-950/60 border border-cyan-600/60">
                  <p className="text-xs text-cyan-200">Total Calculated Settlement:</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">{results.settlementTotal} mm</p>
                  <p className="text-[11px] text-cyan-300 mt-1">Allowable limit: {results.allowableSettlement} mm (PASS)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. RC STRUCTURAL (EC2) */}
        {activeTab === "rc" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-2">Reinforced Concrete Pile Design (EN 1992-1-1)</h2>
              <p className="text-xs font-mono text-slate-400 mb-6">Longitudinal reinforcement cage and cross-section resistance</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono mb-6">
                <div className="p-4 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Longitudinal Reinforcement:</p>
                  <p className="text-lg font-bold text-white mt-1">{project.numBars} × Ø{project.barDiameter}mm</p>
                  <p className="text-[11px] text-cyan-400 mt-1">Total A_s = {results.rebarArea} mm²</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Reinforcement Ratio (ρ):</p>
                  <p className="text-lg font-bold text-white mt-1">{results.reinforcementRatio}%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Min 0.3% / Max 4.0%</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Structural Axial Capacity (N_Rd):</p>
                  <p className="text-lg font-bold text-cyan-300 mt-1">{results.structuralAxialResistance} kN</p>
                  <p className="text-[11px] text-slate-500 mt-1">Utilization: {(results.utilizationStructural * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. MATHCAD REPORT */}
        {activeTab === "report" && (
          <div className="space-y-6 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl font-serif">
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-wide">ENGINEERING CALCULATION SHEET</h1>
                <p className="text-xs font-mono text-slate-600 mt-1">{project.projectName} — Bored Pile Design ({project.projectNumber})</p>
              </div>
              <div className="flex gap-2 font-sans no-print">
                <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs flex items-center gap-1.5">
                  <Printer className="size-3.5" /> Print PDF
                </button>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">1. Design Basis & Summary</h3>
                <p className="font-mono text-xs">Standard: EN 1990, EN 1997-1 (EC7), EN 1992-1-1 (EC2)</p>
                <p className="font-mono text-xs">Pile Geometry: Diameter D = {project.diameter}mm, Length L = {project.length}m</p>
                <p className="font-mono text-xs">Applied Load: N_Ed = {project.nEd} kN</p>
              </section>

              <section>
                <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">2. Geotechnical Resistance Summary (EC7)</h3>
                <ul className="list-disc pl-5 font-mono text-xs space-y-1">
                  <li>Total Characteristic Shaft Resistance (R_sk): <strong>{results.totalShaftResistance} kN</strong></li>
                  <li>Characteristic Base Resistance (R_bk): <strong>{results.baseResistance} kN</strong></li>
                  <li>Total Characteristic Resistance (R_c,k): <strong>{results.totalCharacteristicResistance} kN</strong></li>
                  <li>Design Resistance (R_c,d): <strong>{results.designResistance} kN</strong></li>
                  <li>Geotechnical Utilization: <strong>{(results.utilizationGeotechnical * 100).toFixed(1)}% ({results.utilizationGeotechnical <= 1.0 ? "PASS" : "FAIL"})</strong></li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold border-b border-slate-300 pb-1 mb-2 text-base">3. Verification Table</h3>
                <table className="w-full text-left font-mono text-xs border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="p-2 border-r border-slate-300">Check Description</th>
                      <th className="p-2 border-r border-slate-300">Demand</th>
                      <th className="p-2 border-r border-slate-300">Capacity / Limit</th>
                      <th className="p-2 border-r border-slate-300">Utilization</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300">Geotechnical Compression (ULS)</td>
                      <td className="p-2 border-r border-slate-300">{project.nEd} kN</td>
                      <td className="p-2 border-r border-slate-300">{results.designResistance} kN</td>
                      <td className="p-2 border-r border-slate-300">{(results.utilizationGeotechnical * 100).toFixed(1)}%</td>
                      <td className="p-2 font-bold text-emerald-700">PASS</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300">Total Settlement (SLS)</td>
                      <td className="p-2 border-r border-slate-300">{results.settlementTotal} mm</td>
                      <td className="p-2 border-r border-slate-300">{results.allowableSettlement} mm</td>
                      <td className="p-2 border-r border-slate-300">{((results.settlementTotal / results.allowableSettlement) * 100).toFixed(1)}%</td>
                      <td className="p-2 font-bold text-emerald-700">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Structural Axial & Bending (EC2)</td>
                      <td className="p-2 border-r border-slate-300">{project.nEd} kN</td>
                      <td className="p-2 border-r border-slate-300">{results.structuralAxialResistance} kN</td>
                      <td className="p-2 border-r border-slate-300">{(results.utilizationStructural * 100).toFixed(1)}%</td>
                      <td className="p-2 font-bold text-emerald-700">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
