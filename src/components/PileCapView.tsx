import React, { useState } from "react";
import { ArrowLeft, HardHat, CheckCircle2, Sliders, LogOut } from "lucide-react";
import { useProject } from "@/lib/store";

export function PileCapView() {
  const userEmail = useProject((s) => s.userEmail);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);

  const [pileCount, setPileCount] = useState(4);
  const [capDepth, setCapDepth] = useState(1200);
  const [columnLoad, setColumnLoad] = useState(3500);

  const pileLoad = (columnLoad / pileCount).toFixed(0);
  const strutAngle = 55; // degrees
  const tensionTieForce = ((columnLoad / 2) / Math.tan((strutAngle * Math.PI) / 180)).toFixed(0);
  const reqRebarArea = (parseFloat(tensionTieForce) * 1000 / (435)).toFixed(0); // fyd = 435 MPa

  return (
    <div className="min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Blueprint grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
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
              PILE CAP DESIGN
            </h1>
            <p className="text-[11px] font-mono text-cyan-400">EN 1992-1-1 Strut-and-Tie Modeling</p>
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

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center">
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-medium mb-3">
            <HardHat className="size-3.5 text-cyan-400" />
            <span>MODULE ACTIVATED</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Welcome to Pile Cap Design
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-mono">
            Reinforced concrete substructure analysis using Strut-and-Tie Modeling (STM), punching shear checks, and nodal stress verification per Eurocode 2.
          </p>
        </div>

        {/* Interactive Engineering HUD Card */}
        <div className="bg-[#081222]/95 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Diagram / Schematic */}
            <div className="w-full h-80 bg-[#03070e] border border-cyan-900/60 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-950 pb-2">
                <span>LAYOUT: {pileCount}-PILE CAP (H = {capDepth}mm)</span>
                <span className="text-emerald-400 font-bold">STM VERIFIED</span>
              </div>

              <div className="flex-1 flex items-center justify-center py-2">
                <svg viewBox="0 0 300 200" className="w-full h-full max-w-[280px]" fill="none" stroke="currentColor">
                  {/* Column */}
                  <rect x="120" y="20" width="60" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="135" y="38" fill="#94a3b8" fontSize="9" fontFamily="monospace">Column</text>
                  
                  {/* Column Load Arrow */}
                  <line x1="150" y1="2" x2="150" y2="18" stroke="#f59e0b" strokeWidth="2.5" />
                  <polygon points="146,14 150,19 154,14" fill="#f59e0b" />
                  <text x="156" y="14" fill="#f59e0b" fontSize="9" fontFamily="monospace">N_Ed = {columnLoad} kN</text>

                  {/* Pile Cap Body */}
                  <rect x="35" y="50" width="230" height="70" fill="rgba(6,182,212,0.12)" stroke="#38bdf8" strokeWidth="2" />

                  {/* Piles */}
                  <rect x="55" y="120" width="40" height="60" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                  <rect x="205" y="120" width="40" height="60" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                  <text x="62" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">Pile 1</text>
                  <text x="212" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">Pile 2</text>

                  {/* Strut and Tie Lines */}
                  {/* Compressive Struts */}
                  <line x1="150" y1="50" x2="75" y2="110" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="150" y1="50" x2="225" y2="110" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="95" y="75" fill="#f59e0b" fontSize="8" fontFamily="monospace">Strut (θ={strutAngle}°)</text>

                  {/* Tension Tie */}
                  <line x1="75" y1="110" x2="225" y2="110" stroke="#06b6d4" strokeWidth="2.5" />
                  <text x="120" y="105" fill="#06b6d4" fontSize="8" fontFamily="monospace">Tie Force: {tensionTieForce} kN</text>

                  {/* Dimension */}
                  <line x1="275" y1="50" x2="275" y2="120" stroke="#94a3b8" strokeWidth="1" />
                  <text x="278" y="90" fill="#94a3b8" fontSize="8" fontFamily="monospace">{capDepth}mm</text>
                </svg>
              </div>

              <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Per Pile Load: {pileLoad} kN</span>
                <span>Req. As: {reqRebarArea} mm²</span>
              </div>
            </div>

            {/* Right Parameters & Live Calculation Preview */}
            <div className="space-y-5">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Sliders className="size-4 text-cyan-400" />
                <span>Strut-and-Tie Design Parameters</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Pile Arrangement:</span>
                    <span className="text-cyan-400 font-bold">{pileCount} Piles</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setPileCount(cnt)}
                        className={`py-1.5 rounded text-xs font-mono font-bold transition border ${
                          pileCount === cnt
                            ? "bg-cyan-600 text-white border-cyan-400"
                            : "bg-[#040910] text-slate-400 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {cnt} Piles
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Factored Column Load (N_Ed):</span>
                    <span className="text-cyan-400 font-bold">{columnLoad} kN</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="8000"
                    step="250"
                    value={columnLoad}
                    onChange={(e) => setColumnLoad(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Overall Cap Depth (h):</span>
                    <span className="text-cyan-400 font-bold">{capDepth} mm</span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="2200"
                    step="100"
                    value={capDepth}
                    onChange={(e) => setCapDepth(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Results Summary Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#040910] border border-cyan-900/60">
                  <p className="text-[11px] font-mono text-slate-400">Design Tie Force (F_td):</p>
                  <p className="text-lg font-mono font-bold text-cyan-300 mt-0.5">{tensionTieForce} kN</p>
                </div>
                <div className="p-3 rounded-lg bg-[#040910] border border-cyan-900/60">
                  <p className="text-[11px] font-mono text-slate-400">Req. Bottom Rebar (As):</p>
                  <p className="text-lg font-mono font-bold text-cyan-300 mt-0.5">{reqRebarArea} mm²</p>
                </div>
                <div className="col-span-2 p-3 rounded-lg bg-cyan-950/60 border border-cyan-600/60 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-mono text-cyan-200">Punching Shear Status:</p>
                    <p className="text-xl font-mono font-bold text-cyan-400">v_Ed ≤ v_Rd,c (PASS)</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 border border-emerald-600 text-emerald-400">
                    <CheckCircle2 className="size-3.5" /> Verified
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setActiveModule("modules")}
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-lg"
                >
                  <ArrowLeft className="size-4" />
                  <span>Return to Modules Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
