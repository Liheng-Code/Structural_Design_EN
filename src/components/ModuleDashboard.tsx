import React from "react";
import { ArrowRight, Layers, ShieldCheck, LogOut, CheckCircle2, Compass, HardHat, CircleDot } from "lucide-react";
import { useProject } from "@/lib/store";

export function ModuleDashboard() {
  const userEmail = useProject((s) => s.userEmail);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);

  return (
    <div className="min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Blueprint grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-sm sm:text-base font-bold tracking-wider text-cyan-400 uppercase">
              STRUCTURAL DESIGN PLATFORM
            </h1>
            <p className="text-[11px] font-mono text-slate-400">Integrated Foundation & Geotechnical Suite</p>
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
      <main className="relative z-10 flex-1 w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-6 sm:py-10 flex flex-col justify-center">
        {/* Banner Section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-medium mb-3">
            <ShieldCheck className="size-3.5 text-cyan-400" />
            <span>EUROCODE VERIFIED PLATFORM</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Structural Design Modules
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-mono">
            Select a specialized engineering module below to execute finite element analysis, geotechnical verification, and detailed calculation reports.
          </p>
        </div>

        {/* 3 VIEW CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* CARD 1: Sheet pile */}
          <div 
            onClick={() => setActiveModule("sheet-pile")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(6,182,212,0.1)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.25)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 font-semibold">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            </div>

            <div>
              {/* Graphic Cross Section Preview */}
              <div className="w-full h-44 bg-[#03070e] border border-cyan-900/60 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Ground strata */}
                  <rect x="20" y="45" width="200" height="85" fill="rgba(196,165,116,0.08)" stroke="#8f8676" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="20" y1="45" x2="220" y2="45" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Water line */}
                  <line x1="20" y1="65" x2="110" y2="65" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="25" y="60" fill="#38bdf8" fontSize="8" fontFamily="monospace">WL +2.8m</text>
                  {/* U-Sheet Pile Cross Section */}
                  <path d="M 110 25 L 110 130 M 116 25 L 116 130" stroke="#38bdf8" strokeWidth="3" />
                  <rect x="105" y="20" width="16" height="8" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Hydrostatic Pressure triangle */}
                  <polygon points="25,100 110,100 110,65" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1" />
                  {/* Moment Curve */}
                  <path d="M 116 30 Q 145 75 116 120" stroke="#06b6d4" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="125" y="75" fill="#06b6d4" fontSize="8" fontFamily="monospace">M_Ed</text>
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                  Earth Retaining & Flood Wall
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Sheet Pile Design
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  Excavation support with staged earth and water pressures, sheet-pile checks, movement review and calculation reporting.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">EC7 Geotechnical</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">EC2 Structural</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">Interactive HUD</span>
              </div>
            </div>

            <button 
              type="button"
              className="w-full py-2.5 px-4 bg-cyan-600 group-hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg"
            >
              <span>Open Design Suite</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 2: Contiguous bored pile wall */}
          <div
            onClick={() => setActiveModule("cbp")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-violet-500/40 hover:border-violet-400 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(139,92,246,0.1)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.25)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-600/60 text-violet-300 font-semibold">
                <CircleDot className="size-3" /> Ready
              </span>
            </div>
            <div>
              <div className="w-full h-44 bg-[#03070e] border border-violet-900/60 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" aria-label="Contiguous bored pile wall and soil layers">
                  <rect x="18" y="30" width="204" height="34" fill="#c7a876" opacity=".55" />
                  <rect x="18" y="64" width="204" height="50" fill="#879b72" opacity=".55" />
                  <line x1="18" y1="64" x2="222" y2="64" stroke="#e2c589" strokeDasharray="4 3" />
                  {[58, 82, 106, 130, 154, 178].map((x) => <circle key={x} cx={x} cy="74" r="13" fill="#596775" stroke="#c4b5fd" strokeWidth="2" />)}
                  <rect x="44" y="16" width="150" height="11" rx="2" fill="#7c6b9c" stroke="#c4b5fd" />
                  <line x1="18" y1="48" x2="222" y2="48" stroke="#38bdf8" strokeDasharray="4 3" />
                  <text x="22" y="43" fill="#7dd3fc" fontSize="8" fontFamily="monospace">GROUNDWATER</text>
                  <text x="22" y="59" fill="#f1dfb5" fontSize="8" fontFamily="monospace">ALLUVIUM</text>
                  <text x="22" y="108" fill="#d8efd0" fontSize="8" fontFamily="monospace">DENSE STRATUM</text>
                </svg>
              </div>
              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-violet-300 font-semibold mb-1">Excavation Retaining Wall</p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-violet-200 transition-colors">CBP Wall Design</h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">Contiguous bored-pile geometry, layer-based ground model, water-control strategy and staged excavation configuration.</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-violet-200 border border-slate-700">CBP Geometry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-violet-200 border border-slate-700">Soil Layers</span>
              </div>
            </div>
            <button type="button" className="w-full py-2.5 px-4 bg-violet-700 group-hover:bg-violet-600 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg">
              <span>Open CBP Design</span><ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 3: Bored Pile Design */}
          <div 
            onClick={() => setActiveModule("bored-pile")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold">
                <Compass className="size-3" /> Active
              </span>
            </div>

            <div>
              {/* Graphic Bored Pile Preview */}
              <div className="w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Soil layers */}
                  <line x1="20" y1="40" x2="220" y2="40" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="25" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">Clay Layer (cu=45kPa)</text>
                  <line x1="20" y1="85" x2="220" y2="85" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="25" y="80" fill="#94a3b8" fontSize="8" fontFamily="monospace">Dense Sand (N=35)</text>
                  {/* Bored Pile Shaft */}
                  <rect x="100" y="15" width="40" height="110" fill="rgba(30,58,95,0.25)" stroke="#38bdf8" strokeWidth="2" />
                  {/* Rebar Cage inside */}
                  <line x1="106" y1="20" x2="106" y2="120" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="134" y1="20" x2="134" y2="120" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Load arrow on top */}
                  <line x1="120" y1="2" x2="120" y2="14" stroke="#f59e0b" strokeWidth="2" />
                  <polygon points="117,12 120,16 123,12" fill="#f59e0b" />
                  <text x="127" y="12" fill="#f59e0b" fontSize="8" fontFamily="monospace">N_Ed</text>
                  {/* Shaft friction side arrows */}
                  <path d="M 94 50 L 98 45 M 94 70 L 98 65 M 146 50 L 142 45 M 146 70 L 142 65" stroke="#38bdf8" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Deep Foundation System
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Bored Pile Design
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  Deep foundation geotechnical and structural verification for cast-in-place bored piles. Skin friction (alpha & beta methods), end-bearing resistance, and rebar reinforcement design.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Axial & Lateral</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Shaft Resistance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Reinforcement Cage</span>
              </div>
            </div>

            <button 
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500"
            >
              <span>View Module</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 4: Pile Cap Design */}
          <div 
            onClick={() => setActiveModule("pile-cap")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold">
                <HardHat className="size-3" /> Active
              </span>
            </div>

            <div>
              {/* Graphic Pile Cap Preview */}
              <div className="w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Concrete Column on Top */}
                  <rect x="95" y="10" width="50" height="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="105" y="26" fill="#94a3b8" fontSize="8" fontFamily="monospace">Column</text>
                  {/* Pile Cap Block */}
                  <rect x="35" y="35" width="170" height="50" fill="rgba(30,58,95,0.3)" stroke="#38bdf8" strokeWidth="2" />
                  {/* Piles supporting underneath */}
                  <rect x="50" y="85" width="30" height="45" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                  <rect x="160" y="85" width="30" height="45" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                  {/* Strut and Tie Lines */}
                  {/* Compression Struts */}
                  <line x1="120" y1="35" x2="65" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="120" y1="35" x2="175" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Tension Tie */}
                  <line x1="65" y1="80" x2="175" y2="80" stroke="#06b6d4" strokeWidth="2" />
                  <text x="100" y="75" fill="#06b6d4" fontSize="8" fontFamily="monospace">Tension Tie</text>
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Substructure & Load Transfer
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Pile Cap Design
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  Reinforced concrete pile cap structural design with multi-pile configurations (2, 3, 4, and 5-pile arrangements). Strut-and-Tie Modeling (STM), punching shear, and nodal zone stress checks.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Strut-and-Tie (STM)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Punching Shear</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Multi-Pile Layouts</span>
              </div>
            </div>

            <button 
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500"
            >
              <span>View Module</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 5: Cantilever RC Retaining Wall */}
          <div
            onClick={() => setActiveModule("retaining-wall")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold">
                <HardHat className="size-3" /> Active
              </span>
            </div>

            <div>
              <div className="w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Backfill */}
                  <rect x="150" y="20" width="70" height="90" fill="rgba(125,102,80,0.25)" stroke="#a3866a" strokeWidth="1" />
                  {/* Stem (battered front face) */}
                  <polygon points="150,50 150,110 110,110 130,50" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Base slab (toe + heel) */}
                  <rect x="55" y="110" width="165" height="18" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Active pressure arrow */}
                  <line x1="150" y1="80" x2="175" y2="80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rwArrow)" />
                  <text x="152" y="72" fill="#f59e0b" fontSize="8" fontFamily="monospace">Pa</text>
                  <defs>
                    <marker id="rwArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  <text x="60" y="122" fill="#94a3b8" fontSize="8" fontFamily="monospace">Toe</text>
                  <text x="190" y="122" fill="#94a3b8" fontSize="8" fontFamily="monospace">Heel</text>
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Earth-Retaining Structure
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Cantilever RC Retaining Wall
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  Cantilever (T/L-shaped) reinforced concrete retaining wall on a spread footing. EN 1997-1 Design Approach 1 sliding,
                  bearing and eccentricity checks plus EN 1992-1-1 stem, toe and heel design.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Sliding & Bearing</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Stem / Toe / Heel</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">DA1-C1 / DA1-C2</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500"
            >
              <span>View Module</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 6: Basement Retaining Wall (Top-Propped) */}
          <div
            onClick={() => setActiveModule("basement-wall")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold">
                <HardHat className="size-3" /> Active
              </span>
            </div>

            <div>
              <div className="w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Backfill */}
                  <rect x="150" y="15" width="70" height="95" fill="rgba(125,102,80,0.25)" stroke="#a3866a" strokeWidth="1" />
                  {/* Ground-floor slab (top prop) */}
                  <rect x="95" y="10" width="60" height="10" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Wall (prismatic, fixed at base, pinned at top) */}
                  <rect x="140" y="20" width="14" height="90" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Base slab */}
                  <rect x="55" y="110" width="165" height="16" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Pin symbol at top prop */}
                  <circle cx="147" cy="20" r="4" fill="#0b1a2c" stroke="#fef08a" strokeWidth="1.5" />
                  {/* Trapezoidal pressure */}
                  <polygon points="154,22 168,60 154,108" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="170" y="65" fill="#f59e0b" fontSize="8" fontFamily="monospace">K0/Ka</text>
                  <text x="98" y="8" fill="#94a3b8" fontSize="8" fontFamily="monospace">G.F. Slab (prop)</text>
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Earth-Retaining Structure
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Basement Retaining Wall
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  Top-propped basement wall (base fixed, ground-floor slab prop). Construction-stage cantilever and permanent propped-stage
                  force-method design, at-rest (K0) or active (Ka) earth pressure, two-face reinforcement.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Top-Propped</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">K0 / Ka</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Two-Stage Design</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500"
            >
              <span>View Module</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 7: Wind Load on Tall Building */}
          <div
            onClick={() => setActiveModule("wind-load")}
            className="group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold">
                <HardHat className="size-3" /> Active
              </span>
            </div>

            <div>
              <div className="w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative">
                <svg viewBox="0 0 240 140" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* Ground line */}
                  <line x1="10" y1="120" x2="230" y2="120" stroke="#334155" strokeWidth="1.5" />
                  {/* Building elevation */}
                  <rect x="120" y="15" width="40" height="105" fill="rgba(30,58,95,0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Wind pressure arrows, increasing with height */}
                  <line x1="78" y1="100" x2="118" y2="100" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#wlArrow)" />
                  <line x1="68" y1="70" x2="118" y2="70" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#wlArrow)" />
                  <line x1="58" y1="40" x2="118" y2="40" stroke="#f59e0b" strokeWidth="2.2" markerEnd="url(#wlArrow)" />
                  <line x1="52" y1="20" x2="118" y2="20" stroke="#f59e0b" strokeWidth="2.6" markerEnd="url(#wlArrow)" />
                  <defs>
                    <marker id="wlArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  <text x="128" y="12" fill="#94a3b8" fontSize="8" fontFamily="monospace">H</text>
                  <text x="40" y="16" fill="#f59e0b" fontSize="8" fontFamily="monospace">qp(z)</text>
                </svg>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Wind Action on Structures
                </p>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Wind Load on Tall Building
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
                  EN 1991-1-4 along-wind action on a rectangular prismatic tower: peak velocity pressure profile, force
                  coefficients, Annex B structural factor (cscd), base shear/overturning moment, and comfort response.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Velocity Pressure Profile</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Structural Factor cscd</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">Base Shear & Overturning</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500"
            >
              <span>View Module</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
