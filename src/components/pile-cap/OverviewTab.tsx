import { Sliders } from "lucide-react";
import type { Tab } from "./ui";
import type { Body } from "./ui";
import { StatCard } from "./ui";
import { PileCapElevation, PileCapPlan } from "@/components/diagrams/PileCapDiagram";

export function OverviewTab({ body, setActiveTab }: { body: Body; setActiveTab: (t: Tab) => void }) {
  const { project, res, pad } = body;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Design Axial (N_Ed)" value={`${project.nEd}`} unit="kN" sub="ULS compression, input" />
        <StatCard
          label="Tie Force (F_td)"
          value={`${res.tieForce}`}
          unit="kN"
          sub={`θ = ${res.strutAngleDeg}° · cotθ = ${res.reactionHigh > 0 ? (res.tieForce / res.reactionHigh).toFixed(3) : "—"}`}
        />
        <StatCard
          label="Tie Reinforcement"
          value={`${res.asProvided}`}
          unit="mm²"
          sub={`required ${res.asRequired} mm²`}
          tone={res.asProvided >= res.asRequired ? "emerald" : "rose"}
        />
        <StatCard
          label="Overall Status"
          value={res.overallStatus}
          sub={`max UR ${res.utilizationMax}`}
          tone={res.overallStatus === "PASS" ? "emerald" : res.overallStatus === "WARNING" ? "amber" : "rose"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4">
            <span>STRUT-AND-TIE ELEVATION · 2-PILE CAP</span>
            <span className="text-emerald-400 font-bold">{res.overallStatus}</span>
          </div>
          <PileCapElevation project={project} result={res} />
          <div className="pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs font-mono text-slate-300 flex-wrap gap-2">
            <span>
              Cap {project.capLength} × {project.capWidth} × {project.capDepth} mm
            </span>
            <span>
              Piles Ø{project.pileDiameter} @ {project.pileSpacing} c/c
            </span>
            <span>
              Reactions: {res.reactionHigh} / {res.reactionLow} kN
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="size-4 text-cyan-400" />
              <span>Quick Parameters</span>
            </h3>
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cap Depth (h):</span>
                  <span className="text-cyan-400 font-bold">{project.capDepth} mm</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="2000"
                  step="50"
                  value={project.capDepth}
                  onChange={(e) => pad({ capDepth: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Pile Spacing (s, c/c):</span>
                  <span className="text-cyan-400 font-bold">{project.pileSpacing} mm</span>
                </div>
                <input
                  type="range"
                  min="1600"
                  max="3200"
                  step="100"
                  value={project.pileSpacing}
                  onChange={(e) => pad({ pileSpacing: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Factored Column Load (N_Ed):</span>
                  <span className="text-cyan-400 font-bold">{project.nEd} kN</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="100"
                  value={project.nEd}
                  onChange={(e) => pad({ nEd: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Tie Bars:</span>
                  <span className="text-cyan-400 font-bold">
                    {project.tieBarCount} Ø{project.tieBarDiameter} ({res.asProvided} mm²)
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="14"
                  step="1"
                  value={project.tieBarCount}
                  onChange={(e) => pad({ tieBarCount: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-cyan-900/60 mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab("stm")}
              className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg transition shadow-lg"
            >
              STM ULS Checks
            </button>
            <button
              onClick={() => setActiveTab("sls")}
              className="py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 border border-slate-700 hover:border-cyan-500 text-white font-mono text-xs font-semibold rounded-lg transition"
            >
              SLS Cracks
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4">
            <span>PLAN LAYOUT · TIE BAND</span>
            <span>{project.tieBarCount} Ø{project.tieBarDiameter} CONCENTRATED IN BAND</span>
          </div>
          <PileCapPlan project={project} result={res} />
        </div>
        <div className="lg:col-span-4 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Effective depth (d)</span>
              <span className="text-cyan-400 font-bold">{res.effectiveDepth} mm</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Strut angle (θ)</span>
              <span className="text-cyan-400 font-bold">{res.strutAngleDeg}°</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Strut force (C)</span>
              <span className="text-cyan-400 font-bold">{res.strutForce} kN</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>As required / provided</span>
              <span className="text-cyan-400 font-bold">
                {res.asRequired} / {res.asProvided} mm²
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Governing check</span>
              <span className="text-cyan-400 font-bold">{res.governingName}</span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 font-mono text-[11px] text-slate-400 leading-relaxed">
            Load path: column → cap → diagonal struts → pile tops → bottom tension tie. Pile geotechnical capacity is verified
            separately in the Bored Pile module using these reactions.
          </div>
        </div>
      </div>
    </div>
  );
}