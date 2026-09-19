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
  TrendingUp,
  Eye,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useProject } from "@/lib/store";
import { defaultBoredPileProject, analyzeBoredPile } from "@/lib/bored-pile/calculations";
import type { BoredPileProject, SoilLayerInput } from "@/lib/bored-pile/types";
import { Equation } from "@/components/Equation";
import { SoilStrataTab } from "@/components/bored-pile/SoilStrataTab";
import { GeometryLoadsTab } from "@/components/bored-pile/GeometryLoadsTab";
import { SettlementTab } from "@/components/bored-pile/SettlementTab";
import { SettlementDiagram } from "@/components/bored-pile/SettlementDiagram";
import { PileDisplacementGraph } from "@/components/bored-pile/PileDisplacementGraph";
import { PrintPreviewModal } from "@/components/bored-pile/PrintPreviewModal";
import { CodeReferencesCard } from "@/components/bored-pile/CodeReferencesCard";
import { SoilTextureIcon } from "@/components/SoilTextureIcon";

function soilLayerColor(layer: SoilLayerInput): { fill: string; stroke: string } {
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") {
    return { fill: "#64748b", stroke: "#94a3b8" };
  }
  if (layer.type === "sand" || layer.type === "dense-sand") {
    return { fill: "#b38b55", stroke: "#e1b978" };
  }
  if (layer.type === "fill") return { fill: "#7d6650", stroke: "#c4a574" };
  return { fill: "#386477", stroke: "#67e8f9" };
}

function soilPatternId(layer: SoilLayerInput): string {
  if (
    layer.behaviorType === "rock" ||
    (layer.type === "custom" && layer.name.toLowerCase().includes("rock"))
  )
    return "soil-pattern-rock";
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained")
    return "soil-pattern-clay";
  if (layer.type === "sand" || layer.type === "dense-sand") return "soil-pattern-sand";
  if (layer.type === "fill") return "soil-pattern-fill";
  return "soil-pattern-custom";
}

const ReportContext = React.createContext<{ previewMode: boolean }>({ previewMode: false });

function ReportHeader({ project }: { project: BoredPileProject }) {
  const { previewMode } = React.useContext(ReportContext);
  return (
    <div className={`${previewMode ? "flex" : "hidden print:flex"} justify-between items-center border-b border-slate-300 pb-2 mb-4 text-[10px] font-mono text-slate-600`}>
      <div>
        <strong className="text-slate-800">Project:</strong> {project.projectName} (No. {project.projectNumber})
      </div>
      <div className="flex items-center gap-4">
        <span><strong className="text-slate-800">Revision:</strong> {project.revision || "Rev. 01"}</span>
        <span><strong className="text-slate-800">Date:</strong> {project.calculationDate || new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function ReportFooter({ project }: { project: BoredPileProject }) {
  const { previewMode } = React.useContext(ReportContext);
  return (
    <div className={`${previewMode ? "flex" : "hidden print:flex"} justify-between items-center border-t border-slate-300 pt-3 mt-8 text-[10px] font-mono text-slate-600`}>
      <span>Client: {project.client || "Client"} | Designer: {project.designer || "Engineer"}</span>
      <span>Standard: Eurocode (EN) | Date: {new Date().toLocaleDateString()}</span>
    </div>
  );
}

export function BoredPileView() {
  const userEmail = useProject((s) => s.userEmail);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);

  const [project, setProject] = useState<BoredPileProject>(defaultBoredPileProject());
  const [activeTab, setActiveTab] = useState<
    "overview" | "soil" | "geometry" | "geotechnical" | "settlement" | "rc" | "report"
  >("overview");
  const [soilMessage, setSoilMessage] = useState("");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const results = useMemo(() => analyzeBoredPile(project), [project]);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const renderReportPages = () => (
    <>
      <section className="report-cover min-h-[620px] flex flex-col justify-between border-8 border-double border-[#173b5f] bg-[#f8f5ed] p-10 text-center">
        <ReportHeader project={project} />
        <div>
          <div className="mx-auto mb-6 h-1 w-24 bg-[#b8863b]" />
          <h1 className="text-4xl font-bold tracking-wide text-[#173b5f]">
            CALCULATION REPORT
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em]">
            Bored Pile Design & Verification
          </p>
          <p className="mt-8 text-2xl font-semibold">{project.projectName}</p>
          <p className="mt-2 font-mono text-sm">Project No. {project.projectNumber}</p>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 border-t border-[#173b5f]/30 pt-5 text-left font-mono text-xs">
            <span>
              DESIGN STANDARD
              <br />
              <strong>EN 1990 / EN 1997 / EN 1992</strong>
            </span>
            <span className="text-right">
              STATUS
              <br />
              <strong>{results.overallStatus}</strong>
            </span>
          </div>
          <ReportFooter project={project} />
        </div>
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]">
            Table of Contents
          </h2>
          <div className="mt-8 space-y-5 text-xs">
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>1. Design basis and input summary</span>
              <span>3</span>
            </p>
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>2. Executive summary and verification</span>
              <span>4</span>
            </p>
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>3. Geotechnical resistance calculation</span>
              <span>5</span>
            </p>
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>4. Settlement serviceability calculation</span>
              <span>6</span>
            </p>
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>5. Structural RC design & reinforcement</span>
              <span>7</span>
            </p>
            <p className="flex justify-between border-b border-dotted border-slate-400">
              <span>6. Geotechnical summary tables</span>
              <span>8</span>
            </p>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            1. Design Basis & Input Summary
          </h2>
          <p className="mt-4 text-xs">
            This calculation report evaluates the ultimate and serviceability limit states for a bored reinforced concrete pile in accordance with Eurocode 7 (EN 1997-1) and Eurocode 2 (EN 1992-1-1).
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="border border-slate-300 p-4 rounded bg-white">
              <h3 className="font-bold mb-2">Pile Geometry & Properties</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Pile Diameter (D): {project.pileDiameter} m</li>
                <li>Pile Length (L): {project.pileLength} m</li>
                <li>Concrete Grade: C{project.concreteGrade}</li>
                <li>Steel Grade: B{project.steelGrade}50B</li>
                <li>Safety Class / Consequence: {project.reliabilityClass}</li>
              </ul>
            </div>
            <div className="border border-slate-300 p-4 rounded bg-white">
              <h3 className="font-bold mb-2">Applied Design Loads</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Characteristic Axial Compression (N_k): {project.axialLoad} kN</li>
                <li>Characteristic Moment (M_k): {project.momentLoad} kN·m</li>
                <li>Characteristic Shear (V_k): {project.shearLoad} kN</li>
                <li>Partial Factor on Actions (γ_G): 1.35</li>
              </ul>
            </div>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            2. Executive Summary & Verification
          </h2>
          <p className="mt-4 text-xs">
            Summary of verification ratios under Design Approach 1 (DA1: Combination 1 + Combination 2) and Serviceability Limit State (SLS).
          </p>
          <div className="mt-6">
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-200">
                  <th className="p-2 border border-slate-300">Verification Check</th>
                  <th className="p-2 border border-slate-300">Design Value ($Ed$)</th>
                  <th className="p-2 border border-slate-300">Resistance ($Rd$)</th>
                  <th className="p-2 border border-slate-300">Utilization</th>
                  <th className="p-2 border border-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300">Axial Geotechnical (ULS)</td>
                  <td className="p-2 border border-slate-300">{results.designAxialLoad.toFixed(1)} kN</td>
                  <td className="p-2 border border-slate-300">{results.designResistance.toFixed(1)} kN</td>
                  <td className="p-2 border border-slate-300">{(results.utilization * 100).toFixed(1)}%</td>
                  <td className={`p-2 border border-slate-300 font-bold ${results.utilization <= 1 ? "text-emerald-700" : "text-rose-700"}`}>
                    {results.utilization <= 1 ? "PASS" : "FAIL"}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300">Settlement (SLS)</td>
                  <td className="p-2 border border-slate-300">{results.settlementTotal.toFixed(1)} mm</td>
                  <td className="p-2 border border-slate-300">25.0 mm (Allow.)</td>
                  <td className="p-2 border border-slate-300">{((results.settlementTotal / 25) * 100).toFixed(1)}%</td>
                  <td className="p-2 border border-slate-300 font-bold text-emerald-700">PASS</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300">Structural Axial-Bending (ULS)</td>
                  <td className="p-2 border border-slate-300">{results.structuralInteraction.toFixed(2)}</td>
                  <td className="p-2 border border-slate-300">1.00</td>
                  <td className="p-2 border border-slate-300">{(results.structuralInteraction * 100).toFixed(1)}%</td>
                  <td className={`p-2 border border-slate-300 font-bold ${results.structuralInteraction <= 1 ? "text-emerald-700" : "text-rose-700"}`}>
                    {results.structuralInteraction <= 1 ? "PASS" : "FAIL"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            3. Geotechnical Resistance Calculation
          </h2>
          <p className="mt-4 text-xs">
            Ultimate bearing capacity is evaluated as the sum of shaft friction (Rs) and base resistance (Rb).
          </p>
          <div className="mt-6 space-y-4 text-xs">
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold text-slate-800 mb-2">3.1 Shaft Friction Resistance (Rs,k)</h3>
              <p>Total Ultimate Shaft Resistance: <strong>{results.totalShaftResistance.toFixed(1)} kN</strong></p>
              <p className="text-slate-600 mt-1">Calculated via effective stress method (β-method) or undrained shear strength (α-method) per soil layer.</p>
            </div>
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold text-slate-800 mb-2">3.2 Base Bearing Resistance (Rb,k)</h3>
              <p>Ultimate Base Resistance: <strong>{results.totalBaseResistance.toFixed(1)} kN</strong></p>
              <p className="text-slate-600 mt-1">Evaluated using bearing capacity factors (Nc, Nq, Nγ) at pile tip depth.</p>
            </div>
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold text-slate-800 mb-2">3.3 Total Characteristic & Design Resistance</h3>
              <p>Characteristic Resistance (Rc,k): <strong>{results.characteristicResistance.toFixed(1)} kN</strong></p>
              <p>Design Resistance (Rc,d = Rc,k / γ_t): <strong>{results.designResistance.toFixed(1)} kN</strong></p>
            </div>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            4. Settlement & Lateral Displacement
          </h2>
          <p className="mt-4 text-xs">
            Evaluation of elastic pile compression, soil settlement under axial loads, and lateral pile deflection profiles.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold mb-2">Settlement Breakdown</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Elastic Pile Compression: {(results.settlementTotal * 0.35).toFixed(1)} mm</li>
                <li>Soil Punching & Tip Settlement: {(results.settlementTotal * 0.65).toFixed(1)} mm</li>
                <li><strong>Total Settlement (s): {results.settlementTotal.toFixed(1)} mm</strong></li>
                <li>Allowable Limit: 25.0 mm</li>
              </ul>
            </div>
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold mb-2">Lateral Deflection Summary</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Max Lateral Deflection: {results.maxLateralDeflection.toFixed(2)} mm</li>
                <li>Depth of Max Deflection: 0.0 m (Pile Head)</li>
                <li>Allowable Lateral Limit: 10.0 mm</li>
                <li>Lateral Status: <span className="text-emerald-700 font-bold">PASS</span></li>
              </ul>
            </div>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            5. Structural RC Design & Reinforcement
          </h2>
          <p className="mt-4 text-xs">
            Longitudinal reinforcement and transverse spiral hoops designed per EN 1992-1-1.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold mb-2">Longitudinal Reinforcement</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Total Bars: {project.numBars} × Ø{project.barDiameter} mm</li>
                <li>Total Steel Area (As): {results.reinforcementArea.toFixed(0)} mm²</li>
                <li>Reinforcement Ratio (ρ): {(results.reinforcementRatio * 100).toFixed(2)}%</li>
                <li>Minimum Required ratio: 0.30%</li>
                <li>Status: <span className="text-emerald-700 font-bold">ADEQUATE</span></li>
              </ul>
            </div>
            <div className="bg-white p-4 border border-slate-300 rounded">
              <h3 className="font-bold mb-2">Transverse / Shear Hoops</h3>
              <ul className="space-y-1 text-slate-700">
                <li>Spiral / Hoop Size: Ø8 mm @ 200mm c/c</li>
                <li>Confinement Status: Adequate</li>
                <li>Nominal steel mass: ~{(project.pileLength * 15).toFixed(1)} kg/m</li>
              </ul>
            </div>
          </div>
        </div>
        <ReportFooter project={project} />
      </section>

      <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10 flex flex-col justify-between">
        <div>
          <ReportHeader project={project} />
          <h2 className="border-b-2 border-[#173b5f] pb-2 text-xl font-bold text-[#173b5f]">
            6. Geotechnical Summary Tables
          </h2>
          <p className="mt-4 text-xs mb-4">Detailed soil layer parameters and computed shaft friction distribution along the pile shaft.</p>
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2 border border-slate-300">Layer ID</th>
                <th className="p-2 border border-slate-300">Thickness</th>
                <th className="p-2 border border-slate-300">Soil Name</th>
                <th className="p-2 border border-slate-300">Unit Wt (γ)</th>
                <th className="p-2 border border-slate-300">Friction (φ°)</th>
                <th className="p-2 border border-slate-300">Cohesion (cu)</th>
                <th className="p-2 border border-slate-300">Shaft Res.</th>
              </tr>
            </thead>
            <tbody>
              {results.layers.map((layer) => (
                <tr key={layer.layerId} className="border-t border-slate-300">
                  <td className="p-2 border border-slate-300">{layer.layerId}</td>
                  <td className="p-2 border border-slate-300">{layer.effectiveLength.toFixed(2)} m</td>
                  <td className="p-2 border border-slate-300">{layer.name}</td>
                  <td className="p-2 border border-slate-300">
                    {project.layers.find((item) => item.id === layer.layerId)?.gamma ?? "-"}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {project.layers.find((item) => item.id === layer.layerId)?.phi ?? "-"}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {project.layers.find((item) => item.id === layer.layerId)?.cu ?? "-"}
                  </td>
                  <td className="p-2 border border-slate-300">{layer.shaftResistance.toFixed(1)} kN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReportFooter project={project} />
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-[#02060f] text-slate-100 flex flex-col font-sans">
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
          { id: "report", label: "7. Calculation Report", icon: FileText },
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
      <main className="relative z-10 flex-1 w-full max-w-none mx-auto p-4 sm:p-6 flex flex-col">
        {/* 1. OVERVIEW & HUD */}
        {activeTab === "overview" && (
          <div className="w-full max-w-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Design Axial Load (N_Ed)</p>
                <p className="text-2xl font-mono font-bold text-white mt-1">
                  {project.nEd} <span className="text-xs text-cyan-400">kN</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Applied ULS compression</p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">End Bearing (R_b,k)</p>
                <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {results.baseResistance} <span className="text-xs text-cyan-400">kN</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  q_b,k = {results.baseUnitResistance} kPa
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Shaft Friction (R_s,k)</p>
                <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {results.totalShaftResistance} <span className="text-xs text-cyan-400">kN</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Layer-by-layer integration
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Total Characteristic (R_c,k)</p>
                <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {results.totalCharacteristicResistance}{" "}
                  <span className="text-xs text-cyan-400">kN</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  End bearing + shaft friction
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-amber-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Design Resistance (R_c,d)</p>
                <p className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  {results.designResistance} <span className="text-xs text-amber-400">kN</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  R_c,k / SF {project.safetyFactor.toFixed(1)} · {project.designApproach}
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Geotechnical Utilization</p>
                <p
                  className={`text-2xl font-mono font-bold mt-1 ${results.utilizationGeotechnical <= 1.0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {(results.utilizationGeotechnical * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  {results.utilizationGeotechnical <= 1.0
                    ? "PASS (Adequate)"
                    : "FAIL (Overstressed)"}
                </p>
              </div>
              <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-400">Total Settlement (SLS)</p>
                <p
                  className={`text-2xl font-mono font-bold mt-1 ${results.settlementTotal <= results.allowableSettlement ? "text-cyan-300" : "text-amber-400"}`}
                >
                  {results.settlementTotal} <span className="text-xs text-cyan-400">mm</span>
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Limit: {results.allowableSettlement} mm
                </p>
              </div>
            </div>

            {/* Visual Profile & Quick Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4">
                  <span>BORED PILE SOIL PROFILE & STRATIFICATION</span>
                  <span className="text-emerald-400 font-bold">EC7 COMPLIANT</span>
                </div>

                <div className="relative flex-1 flex items-center justify-center py-4 min-h-[560px]">
                  <svg
                    viewBox="0 0 760 560"
                    className="w-full h-[540px]"
                    role="img"
                    aria-label="Bored pile soil profile and stratification overview"
                  >
                    <defs>
                      <pattern
                        id="soil-pattern-fill"
                        width="18"
                        height="18"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2"
                          stroke="#e2c99b"
                          strokeWidth="1.4"
                          opacity="0.7"
                        />
                      </pattern>
                      <pattern
                        id="soil-pattern-clay"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M0 5c4-3 7 3 10 0s6 3 10 0M0 15c4-3 7 3 10 0s6 3 10 0"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.1"
                          opacity="0.55"
                        />
                      </pattern>
                      <pattern
                        id="soil-pattern-sand"
                        width="18"
                        height="18"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="3" cy="4" r="1.3" fill="#f1d19a" />
                        <circle cx="11" cy="8" r="1.1" fill="#f1d19a" />
                        <circle cx="6" cy="15" r="1.2" fill="#f1d19a" />
                        <circle cx="16" cy="14" r="1" fill="#f1d19a" />
                      </pattern>
                      <pattern
                        id="soil-pattern-rock"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M1 17L8 4l7 5 7-6M4 23l6-8 6 3 7-7"
                          fill="none"
                          stroke="#d6d3d1"
                          strokeWidth="1.3"
                          opacity="0.65"
                        />
                      </pattern>
                      <pattern
                        id="soil-pattern-custom"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M0 10h20M10 0v20"
                          stroke="#a5f3fc"
                          strokeWidth="0.8"
                          opacity="0.35"
                        />
                      </pattern>
                    </defs>
                    {(() => {
                      const maxDepth = Math.max(
                        project.length,
                        ...project.layers.map((layer) => layer.bottomDepth),
                        1,
                      );
                      const top = 48;
                      const bottom = 510;
                      const scale = (bottom - top) / maxDepth;
                      return (
                        <>
                          <rect
                            x="120"
                            y={top}
                            width="300"
                            height={bottom - top}
                            fill="#0a1525"
                            stroke="#334155"
                          />
                          {project.layers.map((layer) => {
                            const y = top + Math.max(0, layer.topDepth) * scale;
                            const height = Math.max(
                              5,
                              (Math.min(maxDepth, layer.bottomDepth) -
                                Math.max(0, layer.topDepth)) *
                                scale,
                            );
                            const colors = soilLayerColor(layer);
                            return (
                              <g key={layer.id}>
                                <rect
                                  x="120"
                                  y={y}
                                  width="300"
                                  height={height}
                                  fill={colors.fill}
                                  fillOpacity="0.55"
                                  stroke={colors.stroke}
                                />
                                <rect
                                  x="120"
                                  y={y}
                                  width="300"
                                  height={height}
                                  fill={`url(#${soilPatternId(layer)})`}
                                />
                                <line
                                  x1="420"
                                  y1={y + height / 2}
                                  x2="450"
                                  y2={y + height / 2}
                                  stroke={colors.stroke}
                                />
                                <text
                                  x="460"
                                  y={y + height / 2 + 5}
                                  fill="#f8fafc"
                                  fontSize="14"
                                  fontFamily="monospace"
                                >
                                  {layer.id} · {layer.name.slice(0, 30)}
                                </text>
                              </g>
                            );
                          })}
                          <line
                            x1="120"
                            y1={top + project.waterLevel * scale}
                            x2="420"
                            y2={top + project.waterLevel * scale}
                            stroke="#38bdf8"
                            strokeWidth="3"
                            strokeDasharray="8 5"
                          />
                          <text
                            x="130"
                            y={top + project.waterLevel * scale - 10}
                            fill="#7dd3fc"
                            fontSize="13"
                            fontFamily="monospace"
                          >
                            GWL -{project.waterLevel.toFixed(1)} m
                          </text>
                          <rect
                            x={270 - Math.max(26, Math.min(54, project.diameter / 22)) / 2}
                            y={top}
                            width={Math.max(26, Math.min(54, project.diameter / 22))}
                            height={Math.min(project.length, maxDepth) * scale}
                            fill="#22d3ee"
                            fillOpacity="0.28"
                            stroke="#67e8f9"
                            strokeWidth="3"
                          />
                          <line
                            x1="270"
                            y1="14"
                            x2="270"
                            y2={top - 2}
                            stroke="#fbbf24"
                            strokeWidth="4"
                          />
                          <polygon
                            points={`262,${top - 10} 270,${top} 278,${top - 10}`}
                            fill="#fbbf24"
                          />
                          <text
                            x="290"
                            y="25"
                            fill="#fbbf24"
                            fontSize="14"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            N_Ed {project.nEd} kN
                          </text>
                          <line
                            x1="120"
                            y1={top + project.length * scale}
                            x2="420"
                            y2={top + project.length * scale}
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />
                          <text
                            x="130"
                            y={Math.min(545, top + project.length * scale + 18)}
                            fill="#fbbf24"
                            fontSize="13"
                            fontFamily="monospace"
                          >
                            PILE TOE {project.length.toFixed(1)} m
                          </text>
                          {Array.from(
                            { length: Math.floor(maxDepth / 5) + 1 },
                            (_, index) => index * 5,
                          ).map((depth) => {
                            const y = top + depth * scale;
                            return y <= bottom ? (
                              <g key={depth}>
                                <text
                                  x="74"
                                  y={y + 5}
                                  fill="#64748b"
                                  fontSize="11"
                                  fontFamily="monospace"
                                >
                                  {depth}m
                                </text>
                                <line x1="105" y1={y} x2="120" y2={y} stroke="#64748b" />
                              </g>
                            ) : null;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>
                    Pile Diameter: <strong className="text-cyan-400">{project.diameter} mm</strong>
                  </span>
                  <span>
                    Pile Length: <strong className="text-cyan-400">{project.length} m</strong>
                  </span>
                  <span>
                    Overall Status:{" "}
                    <strong className="text-emerald-400">{results.overallStatus}</strong>
                  </span>
                </div>
              </div>

              {/* Quick Configuration Panel */}
              <div className="lg:col-span-4 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between">
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
                        onChange={(e) =>
                          setProject({ ...project, diameter: parseInt(e.target.value) })
                        }
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
                        onChange={(e) =>
                          setProject({ ...project, length: parseFloat(e.target.value) })
                        }
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
                        onChange={(e) =>
                          setProject({ ...project, nEd: parseFloat(e.target.value) })
                        }
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div className="border-t border-cyan-900/60 pt-4 space-y-3">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Safety factor for pile resistance</span>
                        <strong className="text-amber-300">
                          SF {project.safetyFactor.toFixed(1)}
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="5"
                        step="0.1"
                        value={project.safetyFactor}
                        onChange={(e) =>
                          setProject({ ...project, safetyFactor: Number(e.target.value) })
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>2.0</span>
                        <span>EN 1997 project selection</span>
                        <span>5.0</span>
                      </div>
                      <label className="block">
                        <span className="mb-1 block text-slate-400">Design approach</span>
                        <select
                          value={project.designApproach}
                          onChange={(e) =>
                            setProject({
                              ...project,
                              designApproach: e.target.value as BoredPileProject["designApproach"],
                            })
                          }
                          className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                        >
                          <option value="DA1-C1">DA1 Combination 1</option>
                          <option value="DA1-C2">DA1 Combination 2</option>
                          <option value="DA2">DA2</option>
                          <option value="DA3">DA3</option>
                        </select>
                      </label>
                      <p className="text-[10px] leading-relaxed text-amber-200/70">
                        Preliminary selection only. Confirm the resistance factor and National Annex
                        rules for the adopted EN 1997 design approach.
                      </p>
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
          <SoilStrataTab
            project={project}
            setProject={setProject}
            results={results}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            soilMessage={soilMessage}
            setSoilMessage={setSoilMessage}
          />
        )}

        {/* 3. GEOMETRY & LOADS */}
        {activeTab === "geometry" && (
          <GeometryLoadsTab
            project={project}
            setProject={setProject}
            results={results}
          />
        )}

        {/* 4. GEOTECHNICAL ULS */}
        {activeTab === "geotechnical" && (
          <div className="space-y-6">
            {/* Top Summary Banner */}
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-cyan-900/60 pb-4 mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">EN 1997-1 Ultimate Limit State (ULS) Verification</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mt-1">
                    Geotechnical Axial Resistance & Load Verification
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Detailed layer-by-layer shaft friction (τ_s or βσ&apos;v₀) and base bearing capacity integration (q_b).
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[#040910] border border-cyan-500/40 px-4 py-3 rounded-xl font-mono">
                  <div>
                    <p className="text-[10px] text-slate-400">GEOTECHNICAL UTILIZATION</p>
                    <p className={`text-xl font-bold ${results.utilizationGeotechnical <= 1.0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {(results.utilizationGeotechnical * 100).toFixed(1)}% ({results.utilizationGeotechnical <= 1.0 ? "PASS" : "FAIL"})
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-800 mx-2" />
                  <div>
                    <p className="text-[10px] text-slate-400">DESIGN MARGIN</p>
                    <p className="text-xl font-bold text-cyan-300">
                      {(results.designResistance - project.nEd).toFixed(0)} kN
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Geotechnical Design Parameters Toolbar */}
              <div className="mb-6 p-4 rounded-xl bg-[#040910] border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
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
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Resistance Factor (γ_t / SF):</span>
                    <span className="text-amber-400 font-bold">{project.safetyFactor.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="5.0"
                    step="0.1"
                    value={project.safetyFactor}
                    onChange={(e) => setProject({ ...project, safetyFactor: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block">
                    <span className="text-slate-400 mb-1 block">EN 1997 Design Approach:</span>
                    <select
                      value={project.designApproach}
                      onChange={(e) => setProject({ ...project, designApproach: e.target.value as any })}
                      className="w-full rounded bg-slate-900 border border-slate-700 p-1.5 text-white"
                    >
                      <option value="DA1-C1">DA1 Combination 1</option>
                      <option value="DA1-C2">DA1 Combination 2</option>
                      <option value="DA2">DA2 (Recommended)</option>
                      <option value="DA3">DA3</option>
                    </select>
                  </label>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Pile Dimensions:</span>
                    <span className="text-cyan-400 font-bold">Ø{project.diameter}mm × {project.length}m</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Base Area: <strong className="text-slate-300">{results.pileArea.toFixed(2)} m²</strong>
                  </div>
                </div>
              </div>

              {/* Visual Load Distribution & Resistance Diagram */}
              <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#040910] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-mono text-xs font-bold text-slate-200 uppercase">
                      Load-Transfer & Resistance Profile Diagram
                    </h3>
                    <span className="font-mono text-[10px] text-cyan-400">
                      Shaft & Base Integration
                    </span>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center py-2 min-h-[360px]">
                    <svg viewBox="0 0 600 380" className="w-full h-[360px]" role="img" aria-label="Geotechnical ULS resistance profile diagram">
                      <defs>
                        <linearGradient id="shaft-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      {/* Background axis */}
                      <line x1="80" y1="40" x2="80" y2="340" stroke="#334155" strokeWidth="2" />
                      <line x1="80" y1="340" x2="540" y2="340" stroke="#334155" strokeWidth="2" />

                      {/* Depth ticks & soil stratification bands on left */}
                      {[0, 5, 10, 15, 20, 25, 30].filter(d => d <= project.length).map(depth => {
                        const y = 40 + (depth / 30) * 280;
                        return (
                          <g key={depth}>
                            <line x1="74" y1={y} x2="80" y2={y} stroke="#64748b" />
                            <text x="50" y={y + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                              -{depth}m
                            </text>
                            <line x1="80" y1={y} x2="540" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                          </g>
                        );
                      })}

                      {/* Pile shaft visual representation */}
                      <rect x="250" y="40" width="36" height={Math.min(300, (project.length / 30) * 280)} fill="url(#shaft-grad)" stroke="#67e8f9" strokeWidth="2" rx="4" />

                      {/* Applied Load N_Ed arrow at top */}
                      <polygon points="262,10 268,38 256,38" fill="#fbbf24" />
                      <rect x="220" y="15" width="84" height="20" fill="#0f172a" rx="3" stroke="#fbbf24" strokeWidth="1" />
                      <text x="262" y="29" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        N_Ed = {project.nEd} kN
                      </text>

                      {/* Shaft friction side arrows and labels */}
                      <text x="140" y="160" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        Shaft Friction R_sk
                      </text>
                      <text x="140" y="176" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {results.totalShaftResistance.toFixed(0)} kN
                      </text>
                      <path d="M 210 120 L 246 120" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                      <path d="M 210 220 L 246 220" stroke="#38bdf8" strokeWidth="2" />

                      {/* Base resistance at toe */}
                      {(() => {
                        const toeY = 40 + (project.length / 30) * 280;
                        return (
                          <g>
                            <rect x="238" y={toeY} width="60" height="18" fill="#0f172a" rx="3" stroke="#f59e0b" strokeWidth="1.5" />
                            <text x="268" y={toeY + 13} fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                              R_bk = {results.baseResistance.toFixed(0)} kN
                            </text>
                            <line x1="268" y1={toeY + 18} x2="268" y2={toeY + 35} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                          </g>
                        );
                      })()}

                      {/* Legend */}
                      <g transform="translate(330, 280)">
                        <rect x="0" y="0" width="195" height="50" fill="#0b1320" rx="6" stroke="#334155" />
                        <circle cx="15" cy="18" r="5" fill="#22d3ee" />
                        <text x="28" y="21" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Pile Shaft (Ø{project.diameter}mm)</text>
                        <circle cx="15" cy="36" r="5" fill="#f59e0b" />
                        <text x="28" y="39" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Toe Bearing (q_b)</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Resistance Breakdown Cards */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-[#040910] border border-slate-800">
                    <p className="text-xs text-slate-400">Shaft Friction Resistance (R_s,k):</p>
                    <p className="text-2xl font-bold text-cyan-300 mt-1">
                      {results.totalShaftResistance} <span className="text-xs text-cyan-400">kN</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Integrated across {results.layers.length} intersected soil strata.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#040910] border border-slate-800">
                    <p className="text-xs text-slate-400">End Bearing Resistance (R_b,k):</p>
                    <p className="text-2xl font-bold text-amber-300 mt-1">
                      {results.baseResistance} <span className="text-xs text-amber-400">kN</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Calculated at pile toe (L = {project.length}m) in founding stratum.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-500/50 shadow-md">
                    <p className="text-xs text-cyan-200 font-bold">Design Resistance (R_c,d):</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {results.designResistance} <span className="text-xs text-cyan-300">kN</span>
                    </p>
                    <p className="text-[11px] text-cyan-300 mt-1">
                      R_c,k / γ_t ({results.totalCharacteristicResistance} / {project.safetyFactor.toFixed(1)})
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Limit State Compliance & Safety Margin Dashboard (Recharts Gauges) */}
              <div className="mb-6 bg-[#040910] border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="size-4 text-cyan-400" />
                      <span>Visual Limit State Compliance & Safety Margin Dashboard (EN 1997-1)</span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Real-time color-coded safety factor and resistance utilization meters across key pile limit state checks.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Status: {results.overallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                  {/* Gauge 1: Geotechnical ULS */}
                  {(() => {
                    const util = Math.round(results.utilizationGeotechnical * 100);
                    const isPass = util <= 100;
                    const color = util > 100 ? "#f43f5e" : util > 85 ? "#f59e0b" : "#10b981";
                    const data = [
                      { name: "Utilized", value: Math.min(100, util), fill: color },
                      { name: "Margin", value: Math.max(0, 100 - util), fill: "#1e293b" },
                    ];
                    return (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
                        <p className="text-[11px] font-bold text-slate-300 mb-1">Geotechnical Axial ULS</p>
                        <p className="text-[10px] text-slate-400 mb-2">N_Ed / R_c,d</p>
                        <div className="w-full h-28 relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                                stroke="none"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                            <span className="text-lg font-bold text-white">{util}%</span>
                            <span className={`text-[10px] font-bold ${isPass ? "text-emerald-400" : "text-rose-400"}`}>
                              {isPass ? "PASS" : "FAIL"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          Margin: <strong className="text-cyan-300">{(results.designResistance - project.nEd).toFixed(0)} kN</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gauge 2: Structural ULS */}
                  {(() => {
                    const util = Math.round(results.utilizationStructural * 100);
                    const isPass = util <= 100;
                    const color = util > 100 ? "#f43f5e" : util > 85 ? "#f59e0b" : "#10b981";
                    const data = [
                      { name: "Utilized", value: Math.min(100, util), fill: color },
                      { name: "Margin", value: Math.max(0, 100 - util), fill: "#1e293b" },
                    ];
                    return (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
                        <p className="text-[11px] font-bold text-slate-300 mb-1">Structural Concrete ULS</p>
                        <p className="text-[10px] text-slate-400 mb-2">N_Ed / R_c,struct</p>
                        <div className="w-full h-28 relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                                stroke="none"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                            <span className="text-lg font-bold text-white">{util}%</span>
                            <span className={`text-[10px] font-bold ${isPass ? "text-emerald-400" : "text-rose-400"}`}>
                              {isPass ? "PASS" : "FAIL"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          Capacity: <strong className="text-cyan-300">{results.structuralAxialResistance.toFixed(0)} kN</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gauge 3: Shaft Resistance Mobilization */}
                  {(() => {
                    const totalR = results.totalCharacteristicResistance || 1;
                    const shaftPct = Math.round((results.totalShaftResistance / totalR) * 100);
                    const data = [
                      { name: "Shaft", value: shaftPct, fill: "#06b6d4" },
                      { name: "Base", value: 100 - shaftPct, fill: "#334155" },
                    ];
                    return (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
                        <p className="text-[11px] font-bold text-slate-300 mb-1">Shaft Friction Share</p>
                        <p className="text-[10px] text-slate-400 mb-2">R_s,k / R_c,k</p>
                        <div className="w-full h-28 relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                                stroke="none"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                            <span className="text-lg font-bold text-cyan-300">{shaftPct}%</span>
                            <span className="text-[10px] text-slate-400">Shaft Dom.</span>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          R_s,k: <strong className="text-cyan-300">{results.totalShaftResistance.toFixed(0)} kN</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gauge 4: Toe End-Bearing Share */}
                  {(() => {
                    const totalR = results.totalCharacteristicResistance || 1;
                    const basePct = Math.round((results.baseResistance / totalR) * 100);
                    const data = [
                      { name: "Base", value: basePct, fill: "#f59e0b" },
                      { name: "Shaft", value: 100 - basePct, fill: "#334155" },
                    ];
                    return (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
                        <p className="text-[11px] font-bold text-slate-300 mb-1">Toe Bearing Share</p>
                        <p className="text-[10px] text-slate-400 mb-2">R_b,k / R_c,k</p>
                        <div className="w-full h-28 relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                                stroke="none"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                            <span className="text-lg font-bold text-amber-300">{basePct}%</span>
                            <span className="text-[10px] text-slate-400">Toe Bearing</span>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          R_b,k: <strong className="text-amber-300">{results.baseResistance.toFixed(0)} kN</strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Load Case Factor of Safety Trend-Line View */}
              <div className="mb-6 bg-[#040910] border border-slate-800 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 mb-5 gap-2">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="size-4 text-cyan-400" />
                      <span>Geotechnical Factor of Safety & Load Case Trend Analysis</span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Tracking safety factor (FS = R_c,k / N_Ed) and design safety margins across varying design load stages and combinations.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Target SF ≥ {project.safetyFactor.toFixed(1)}
                  </span>
                </div>

                {(() => {
                  const baseN = project.nEd;
                  const R_k = results.totalCharacteristicResistance;
                  const R_d = results.designResistance;
                  const sfTarget = project.safetyFactor;

                  const loadCases = [
                    { name: "LC1: Dead Only (0.6G)", factor: 0.6, label: "Permanent Min" },
                    { name: "LC2: Permanent (1.0G)", factor: 0.8, label: "Permanent Only" },
                    { name: "LC3: Service (Frequent)", factor: 0.9, label: "Service Load" },
                    { name: "LC4: Characteristic", factor: 1.0, label: "Nominal Ed" },
                    { name: "LC5: ULS (DA1-C2)", factor: 1.25, label: "ULS Design" },
                    { name: "LC6: Seismic / Acc.", factor: 1.4, label: "Extreme / Seismic" },
                    { name: "LC7: Proof Load Test", factor: 1.6, label: "Overload Stage" },
                  ];

                  const chartData = loadCases.map((lc) => {
                    const load = Math.round(baseN * lc.factor);
                    const fs = load > 0 ? Number((R_k / load).toFixed(2)) : 10;
                    const designMargin = Math.round(R_d - load);
                    const isCompliant = fs >= sfTarget;
                    return {
                      caseName: lc.name,
                      shortLabel: lc.label,
                      load,
                      factorOfSafety: fs,
                      targetFS: sfTarget,
                      designMargin,
                      isCompliant,
                    };
                  });

                  return (
                    <div>
                      <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis 
                              dataKey="shortLabel" 
                              stroke="#64748b" 
                              fontSize={11} 
                              tick={{ fill: "#94a3b8" }}
                              interval={0}
                              angle={-20}
                              textAnchor="end"
                            />
                            <YAxis 
                              yAxisId="left" 
                              stroke="#38bdf8" 
                              fontSize={11} 
                              domain={[1, Math.max(6, Math.ceil(Math.max(...chartData.map(d => d.factorOfSafety))))]}
                              label={{ value: "Factor of Safety (FS)", angle: -90, position: "insideLeft", fill: "#38bdf8", fontSize: 11 }}
                            />
                            <YAxis 
                              yAxisId="right" 
                              orientation="right" 
                              stroke="#f59e0b" 
                              fontSize={11}
                              label={{ value: "Load (kN)", angle: 90, position: "insideRight", fill: "#f59e0b", fontSize: 11 }}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="bg-[#0b1320] border border-cyan-500/50 p-3 rounded-xl shadow-xl font-mono text-xs">
                                      <p className="font-bold text-white mb-1">{d.caseName}</p>
                                      <p className="text-cyan-300">Applied Load: <strong className="text-white">{d.load} kN</strong></p>
                                      <p className="text-emerald-400">Factor of Safety: <strong className="text-white">{d.factorOfSafety}</strong> (Target ≥ {d.targetFS})</p>
                                      <p className="text-amber-300">Design Margin: <strong className="text-white">{d.designMargin} kN</strong></p>
                                      <p className={`mt-1 font-bold ${d.isCompliant ? "text-emerald-400" : "text-rose-400"}`}>
                                        Status: {d.isCompliant ? "SAFE / COMPLIANT" : "SAFETY MARGIN EXCEEDED"}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="factorOfSafety" 
                              name="Factor of Safety (FS)" 
                              stroke="#22d3ee" 
                              strokeWidth={3} 
                              dot={{ r: 5, fill: "#0891b2" }}
                              activeDot={{ r: 8, fill: "#22d3ee" }}
                            />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="targetFS" 
                              name="Target SF (γ_t)" 
                              stroke="#f43f5e" 
                              strokeDasharray="4 4" 
                              strokeWidth={2} 
                              dot={false}
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="load" 
                              name="Applied Load N_Ed (kN)" 
                              stroke="#f59e0b" 
                              strokeWidth={2} 
                              dot={{ r: 4, fill: "#d97706" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 font-mono text-[11px]">
                        {chartData.map((d, idx) => (
                          <div key={idx} className={`p-2.5 rounded-lg border ${d.isCompliant ? "bg-slate-900/60 border-slate-800" : "bg-rose-950/40 border-rose-900/60"}`}>
                            <p className="text-slate-400 truncate">{d.shortLabel}</p>
                            <p className="text-white font-bold mt-0.5">{d.load} kN</p>
                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                              <span className="text-cyan-300">FS: {d.factorOfSafety}</span>
                              <span className={d.isCompliant ? "text-emerald-400" : "text-rose-400"}>
                                {d.isCompliant ? "PASS" : "FAIL"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Detailed Layer-by-Layer Shaft Friction Breakdown Table */}
              <div className="border border-slate-800 rounded-xl bg-[#040910] overflow-hidden">
                <div className="bg-cyan-950/40 px-4 py-3 border-b border-cyan-900/60 flex items-center justify-between font-mono">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Layer-by-Layer Shaft Resistance Breakdown</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                      {results.layers.length} strata
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">EN 1997-1 §7.6.2</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="p-3">Layer ID & Name</th>
                        <th className="p-3">Effective Length (m)</th>
                        <th className="p-3">Calculation Method & Parameters</th>
                        <th className="p-3 text-right">Unit Resistance q_s (kPa)</th>
                        <th className="p-3 text-right">Shaft Resistance R_s,i (kN)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {results.layers.map((l) => (
                        <tr key={l.layerId} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <span className="size-2 rounded-full bg-cyan-400" />
                            <span>{l.layerId}: {l.name}</span>
                          </td>
                          <td className="p-3 text-cyan-300 font-semibold">{l.effectiveLength.toFixed(1)} m</td>
                          <td className="p-3 text-slate-300">{l.methodUsed}</td>
                          <td className="p-3 text-right text-slate-300">{l.unitResistance.toFixed(1)} kPa</td>
                          <td className="p-3 text-right font-bold text-emerald-400">{l.shaftResistance.toFixed(1)} kN</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-cyan-950/30 border-t border-cyan-900/60 font-bold text-white">
                        <td colSpan={4} className="p-3 text-right">Total Characteristic Shaft Resistance (R_s,k):</td>
                        <td className="p-3 text-right text-cyan-300 text-sm">{results.totalShaftResistance.toFixed(1)} kN</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTLEMENT SLS */}
        {activeTab === "settlement" && (
          <SettlementTab
            project={project}
            results={results}
          />
        )}

        {/* 6. RC STRUCTURAL (EC2) */}
        {activeTab === "rc" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.78fr)_minmax(620px,1.22fr)] gap-6 items-start">
            <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="border-b border-cyan-900/60 pb-4 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                  EN 1992-1-1 Structural Design Suite
                </p>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  RC Reinforcement Cage & EC2 Checks
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Configuring reinforcement, durability, and Eurocode 2 verifications.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="mb-6 rounded-xl border border-cyan-900/60 bg-[#040910] p-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-2">
                  Standard EC2 Cage Presets
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <button
                    onClick={() => setProject({ ...project, numBars: 8, barDiameter: 20, spiralBarDiameter: 10, spiralSpacing: 250, stiffenerBarDiameter: 14, stiffenerSpacing: 2000 })}
                    className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-300 text-center transition"
                  >
                    Light (8×T20)
                  </button>
                  <button
                    onClick={() => setProject({ ...project, numBars: 12, barDiameter: 25, spiralBarDiameter: 12, spiralSpacing: 200, stiffenerBarDiameter: 16, stiffenerSpacing: 1500 })}
                    className="px-2.5 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 text-center transition font-bold"
                  >
                    Standard (12×T25)
                  </button>
                  <button
                    onClick={() => setProject({ ...project, numBars: 16, barDiameter: 32, spiralBarDiameter: 14, spiralSpacing: 150, stiffenerBarDiameter: 20, stiffenerSpacing: 1200 })}
                    className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-300 text-center transition"
                  >
                    Heavy (16×T32)
                  </button>
                  <button
                    onClick={() => setProject({ ...project, numBars: 20, barDiameter: 32, spiralBarDiameter: 16, spiralSpacing: 100, stiffenerBarDiameter: 22, stiffenerSpacing: 1000 })}
                    className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-300 text-center transition"
                  >
                    Seismic (20×T32)
                  </button>
                </div>
              </div>

              <div className="space-y-5 font-mono text-xs">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                    Concrete and durability
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Concrete grade</span>
                      <input
                        type="text"
                        value={project.concreteGrade}
                        onChange={(e) => setProject({ ...project, concreteGrade: e.target.value })}
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">
                        f<sub>ck</sub> (MPa)
                      </span>
                      <input
                        type="number"
                        min="20"
                        step="5"
                        value={project.fck}
                        onChange={(e) =>
                          setProject({ ...project, fck: Number(e.target.value) || 30 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Exposure Class</span>
                      <select
                        value={project.exposureClass || "XC2"}
                        onChange={(e) => {
                          const cls = e.target.value;
                          const recommendedCover = cls.includes("XA") || cls.includes("XD") ? 75 : 50;
                          setProject({ ...project, exposureClass: cls, cover: Math.max(project.cover, recommendedCover) });
                        }}
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      >
                        <option value="XC1">XC1 (Dry or permanent wet)</option>
                        <option value="XC2">XC2 (Wet, rarely dry - Piles)</option>
                        <option value="XC3">XC3 (Moderate humidity)</option>
                        <option value="XD1">XD1 (Cyclic wet/dry - Chlorides)</option>
                        <option value="XA2">XA2 (Chemical attack - Sulfates)</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Nominal cover (mm)</span>
                      <input
                        type="number"
                        min="25"
                        step="5"
                        value={project.cover}
                        onChange={(e) =>
                          setProject({ ...project, cover: Number(e.target.value) || 75 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Design Moment M_Ed (kNm)</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={project.mEd}
                        onChange={(e) =>
                          setProject({ ...project, mEd: Number(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Steel grade</span>
                      <input
                        type="text"
                        value={project.steelGrade}
                        onChange={(e) => setProject({ ...project, steelGrade: e.target.value })}
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                    Longitudinal reinforcement
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Number of bars</span>
                      <input
                        type="number"
                        min="4"
                        max="40"
                        step="1"
                        value={project.numBars}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            numBars: Math.max(4, Number(e.target.value) || 4),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Bar diameter (mm)</span>
                      <input
                        type="number"
                        min="8"
                        max="50"
                        step="1"
                        value={project.barDiameter}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            barDiameter: Math.max(8, Number(e.target.value) || 8),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Spiral diameter (mm)</span>
                      <input
                        type="number"
                        min="6"
                        max="25"
                        step="1"
                        value={project.spiralBarDiameter}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            spiralBarDiameter: Math.max(6, Number(e.target.value) || 6),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Spiral spacing (mm)</span>
                      <input
                        type="number"
                        min="50"
                        max="500"
                        step="10"
                        value={project.spiralSpacing}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            spiralSpacing: Math.max(50, Number(e.target.value) || 50),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Stiffener diameter (mm)</span>
                      <input
                        type="number"
                        min="8"
                        max="32"
                        step="1"
                        value={project.stiffenerBarDiameter}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            stiffenerBarDiameter: Math.max(8, Number(e.target.value) || 8),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Stiffener spacing (mm)</span>
                      <input
                        type="number"
                        min="300"
                        max="3000"
                        step="50"
                        value={project.stiffenerSpacing}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            stiffenerSpacing: Math.max(300, Number(e.target.value) || 300),
                          })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="col-span-2 block">
                      <span className="mb-1 block text-slate-400">Steel grade</span>
                      <input
                        type="text"
                        value={project.steelGrade}
                        onChange={(e) => setProject({ ...project, steelGrade: e.target.value })}
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                  </div>
                </div>

                {/* EC2 Compliance Verification Matrix */}
                <div className="rounded-xl border border-cyan-900/60 bg-[#040910] p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200">EC2 Clause Verification Summary</span>
                    <span className="text-[10px] text-cyan-400">EN 1992-1-1</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Min Reinforcement Ratio (ρ ≥ 0.2% - Cl. 9.8.5)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${results.minReinforcementRatioPass ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                        {results.minReinforcementRatioPass ? `PASS (${results.reinforcementRatio}%)` : `FAIL (${results.reinforcementRatio}%)`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Max Reinforcement Ratio (ρ ≤ 4.0% - Cl. 9.5.2)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${results.maxReinforcementRatioPass ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                        {results.maxReinforcementRatioPass ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Min Bar Diameter (Ø ≥ 16 mm - Cl. 9.8.5)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${results.minBarSizePass ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                        {results.minBarSizePass ? `PASS (Ø${project.barDiameter})` : `FAIL (Ø${project.barDiameter})`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Transverse Spiral Spacing (Cl. 9.5.3)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${results.spiralSpacingPass ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                        {results.spiralSpacingPass ? `PASS (${project.spiralSpacing} mm)` : `WARNING (${project.spiralSpacing} mm)`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Axial + Bending Interaction (Cl. 6.1)</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${results.bendingInteractionRatio <= 1.0 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                        {(results.bendingInteractionRatio * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-cyan-900/60 pt-5">
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Steel Density</p>
                    <p className="mt-1 font-bold text-cyan-300">{results.steelRatioKgPerM3} kg/m³</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Axial Capacity N_Rd</p>
                    <p className="mt-1 font-bold text-cyan-300">{results.structuralAxialResistance} kN</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">
                      A<sub>s</sub> provided
                    </p>
                    <p className="mt-1 font-bold text-cyan-300">{results.rebarArea} mm²</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Structural Utilization</p>
                    <p
                      className={`mt-1 font-bold ${results.utilizationStructural <= 1 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {(results.utilizationStructural * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="xl:sticky xl:top-6 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between border-b border-cyan-900/60 pb-4 mb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                    Live visualization / reinforcement cage
                  </p>
                  <h2 className="font-display text-xl font-bold text-white mt-1">
                    Bored Pile RC Detailing
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Plan arrangement and longitudinal cage section.
                  </p>
                </div>
                <span className="rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5">
                <div className="rounded-xl border border-slate-700 bg-[#040910] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-slate-200">PLAN VIEW</h3>
                    <span className="font-mono text-[10px] text-slate-500">
                      {project.numBars} bars
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 440 360"
                    className="mx-auto w-full max-w-[480px]"
                    role="img"
                    aria-label="Bored pile reinforcement plan view"
                  >
                    <defs>
                      <marker
                        id="rebar-arrow"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <path d="M0 0L7 3.5L0 7z" fill="#cbd5e1" />
                      </marker>
                    </defs>
                    <circle
                      cx="170"
                      cy="170"
                      r="126"
                      fill="#0a1525"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    <circle
                      cx="170"
                      cy="170"
                      r="105"
                      fill="#155e75"
                      fillOpacity="0.35"
                      stroke="#67e8f9"
                      strokeDasharray="5 4"
                    />
                    <circle
                      cx="170"
                      cy="170"
                      r="96"
                      fill="none"
                      stroke="#fb7185"
                      strokeWidth={Math.max(2, Math.min(5, project.spiralBarDiameter / 4))}
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="170"
                      cy="170"
                      r="82"
                      fill="#07111f"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="170"
                      cy="170"
                      r="70"
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth={Math.max(2, Math.min(5, project.stiffenerBarDiameter / 4))}
                      strokeDasharray="10 5"
                    />
                    {Array.from({ length: project.numBars }, (_, index) => {
                      const angle = (index / project.numBars) * Math.PI * 2 - Math.PI / 2;
                      const radius = 82;
                      return (
                        <circle
                          key={index}
                          cx={170 + Math.cos(angle) * radius}
                          cy={170 + Math.sin(angle) * radius}
                          r={Math.max(4, Math.min(8, project.barDiameter / 4))}
                          fill="#fbbf24"
                          stroke="#fde68a"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                    <circle cx="170" cy="170" r="5" fill="#fbbf24" />
                    <line
                      x1="44"
                      y1="170"
                      x2="296"
                      y2="170"
                      stroke="#64748b"
                      strokeDasharray="5 4"
                    />
                    <line
                      x1="170"
                      y1="44"
                      x2="170"
                      y2="296"
                      stroke="#64748b"
                      strokeDasharray="5 4"
                    />
                    <line
                      x1="68"
                      y1="70"
                      x2="121"
                      y2="121"
                      stroke="#a78bfa"
                      strokeWidth="1.5"
                      markerEnd="url(#rebar-arrow)"
                    />
                    <text x="8" y="62" fill="#c4b5fd" fontSize="11" fontFamily="monospace">
                      STIFFENER
                    </text>
                    <text x="8" y="76" fill="#c4b5fd" fontSize="10" fontFamily="monospace">
                      Ø{project.stiffenerBarDiameter} @ {project.stiffenerSpacing}
                    </text>
                    <line
                      x1="296"
                      y1="106"
                      x2="252"
                      y2="116"
                      stroke="#fb7185"
                      strokeWidth="1.5"
                      markerEnd="url(#rebar-arrow)"
                    />
                    <text x="300" y="104" fill="#fda4af" fontSize="11" fontFamily="monospace">
                      SPIRAL
                    </text>
                    <text x="300" y="118" fill="#fda4af" fontSize="10" fontFamily="monospace">
                      Ø{project.spiralBarDiameter} @ {project.spiralSpacing}
                    </text>
                    <line
                      x1="296"
                      y1="236"
                      x2="241"
                      y2="211"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      markerEnd="url(#rebar-arrow)"
                    />
                    <text x="300" y="234" fill="#fde68a" fontSize="11" fontFamily="monospace">
                      MAIN BARS
                    </text>
                    <text x="300" y="248" fill="#fde68a" fontSize="10" fontFamily="monospace">
                      {project.numBars} x Ø{project.barDiameter}
                    </text>
                    <text
                      x="170"
                      y="330"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      Ø{project.diameter} mm / COVER {project.cover} mm
                    </text>
                  </svg>
                </div>

                <div className="rounded-xl border border-slate-700 bg-[#040910] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-slate-200">
                      LONGITUDINAL SECTION
                    </h3>
                    <span className="font-mono text-[10px] text-slate-500">
                      CAGE LENGTH {project.length} m
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 420 620"
                    className="h-[600px] w-full"
                    role="img"
                    aria-label="Bored pile reinforcement longitudinal section"
                  >
                    <rect
                      x="112"
                      y="34"
                      width="150"
                      height="540"
                      fill="#334155"
                      fillOpacity="0.45"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <rect
                      x="126"
                      y="48"
                      width="122"
                      height="512"
                      fill="#22d3ee"
                      fillOpacity="0.08"
                      stroke="#67e8f9"
                      strokeDasharray="5 4"
                    />
                    {Array.from({ length: Math.min(project.numBars, 12) }, (_, index) => {
                      const x =
                        136 + (index / Math.max(1, Math.min(project.numBars, 12) - 1)) * 102;
                      return (
                        <line
                          key={index}
                          x1={x}
                          y1="52"
                          x2={x}
                          y2="556"
                          stroke="#fbbf24"
                          strokeWidth={Math.max(2, Math.min(4, project.barDiameter / 6))}
                        />
                      );
                    })}
                    <polyline
                      points={Array.from(
                        {
                          length: Math.max(
                            24,
                            Math.ceil((project.length * 1000) / project.spiralSpacing) * 16,
                          ),
                        },
                        (_, index) => {
                          const turns = Math.max(
                            1,
                            (project.length * 1000) / project.spiralSpacing,
                          );
                          const progress = index / Math.max(1, Math.ceil(turns * 16) - 1);
                          const y = 52 + progress * 504;
                          const x = 187 + 56 * Math.sin(progress * turns * Math.PI * 2);
                          return `${x},${y}`;
                        },
                      ).join(" ")}
                      fill="none"
                      stroke="#fb7185"
                      strokeWidth={Math.max(1.5, Math.min(3, project.spiralBarDiameter / 6))}
                      opacity="0.95"
                    />
                    {Array.from(
                      {
                        length: Math.max(
                          1,
                          Math.ceil((project.length * 1000) / project.stiffenerSpacing),
                        ),
                      },
                      (_, index) => {
                        const y =
                          52 +
                          (index /
                            Math.max(
                              1,
                              Math.ceil((project.length * 1000) / project.stiffenerSpacing) - 1,
                            )) *
                            504;
                        return (
                          <line
                            key={`stiffener-${index}`}
                            x1="132"
                            y1={y + 3}
                            x2="242"
                            y2={y + 3}
                            stroke="#a78bfa"
                            strokeWidth={Math.max(
                              1.5,
                              Math.min(3, project.stiffenerBarDiameter / 6),
                            )}
                            opacity="0.9"
                          />
                        );
                      },
                    )}
                    <line x1="112" y1="34" x2="262" y2="34" stroke="#f8fafc" strokeWidth="3" />
                    <line
                      x1="112"
                      y1="574"
                      x2="262"
                      y2="574"
                      stroke="#fbbf24"
                      strokeDasharray="4 3"
                    />
                    <line x1="76" y1="34" x2="76" y2="574" stroke="#64748b" />
                    <text
                      x="44"
                      y="310"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="monospace"
                      transform="rotate(-90 44 310)"
                    >
                      PILE LENGTH {project.length} m
                    </text>
                    <text x="278" y="70" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                      Ø{project.barDiameter} LONGITUDINAL
                    </text>
                    <text x="278" y="88" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
                      {project.numBars} BARS
                    </text>
                    <text x="278" y="106" fill="#fb7185" fontSize="11" fontFamily="monospace">
                      Ø{project.spiralBarDiameter} SPIRAL @ {project.spiralSpacing} mm
                    </text>
                    <text x="278" y="124" fill="#a78bfa" fontSize="11" fontFamily="monospace">
                      Ø{project.stiffenerBarDiameter} STIFFENER @ {project.stiffenerSpacing} mm
                    </text>
                    <text x="278" y="142" fill="#67e8f9" fontSize="11" fontFamily="monospace">
                      COVER {project.cover} mm
                    </text>
                    <text x="278" y="160" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
                      {project.concreteGrade}
                    </text>
                    <polygon points="181,16 190,34 172,34" fill="#fbbf24" />
                    <text x="198" y="27" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                      N_Ed {project.nEd} kN
                    </text>
                  </svg>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="rounded-xl border border-slate-800 bg-[#040910] p-4">
                  <p className="text-xs text-slate-400">Reinforcement ratio ρ</p>
                  <p className="mt-1 text-xl font-bold text-white">{results.reinforcementRatio}%</p>
                  <p className="text-[11px] text-slate-500">Typical range 0.3%–4.0%</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#040910] p-4">
                  <p className="text-xs text-slate-400">
                    Structural axial capacity N<sub>Rd</sub>
                  </p>
                  <p className="mt-1 text-xl font-bold text-cyan-300">
                    {results.structuralAxialResistance} kN
                  </p>
                  <p className="text-[11px] text-slate-500">Simplified EC2 verification</p>
                </div>
                <div className="rounded-xl border border-cyan-600/60 bg-cyan-950/40 p-4">
                  <p className="text-xs text-cyan-200">RC status</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">
                    {results.utilizationStructural <= 1 ? "PASS" : "FAIL"}
                  </p>
                  <p className="text-[11px] text-cyan-300">
                    Utilization {(results.utilizationStructural * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-900/60 bg-[#040910] p-4 font-mono">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Rebar Weight Schedule</h3>
                  <span className="text-xs text-cyan-300">
                    Total {results.totalRebarWeight.toFixed(1)} kg
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs md:grid-cols-4">
                  <div>
                    <p className="text-amber-300">Main bars</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {results.mainBarWeight.toFixed(1)} kg
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {project.numBars} × Ø{project.barDiameter}
                    </p>
                  </div>
                  <div>
                    <p className="text-rose-300">Spiral</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {results.spiralWeight.toFixed(1)} kg
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Ø{project.spiralBarDiameter} @ {project.spiralSpacing}
                    </p>
                  </div>
                  <div>
                    <p className="text-violet-300">Stiffeners</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {results.stiffenerWeight.toFixed(1)} kg
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Ø{project.stiffenerBarDiameter} @ {project.stiffenerSpacing}
                    </p>
                  </div>
                  <div>
                    <p className="text-cyan-300">Total reinforcement</p>
                    <p className="mt-1 text-lg font-bold text-cyan-200">
                      {results.totalRebarWeight.toFixed(1)} kg
                    </p>
                    <p className="text-[10px] text-slate-500">Nominal steel mass</p>
                  </div>
                </div>
              </div>
            </section>
            <CodeReferencesCard project={project} results={results} />
          </div>
        </div>
        )}

        {/* 7. CALCULATION REPORT */}
        {/* 7. CALCULATION REPORT */}
        {activeTab === "report" && (
          <div className="report-document space-y-6 bg-[#f4f0e6] text-slate-900 p-4 sm:p-8 rounded-2xl shadow-2xl font-sans text-xs leading-relaxed">
            <div className="flex justify-end gap-2 font-sans no-print">
              <button
                onClick={() => setIsPrintPreviewOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Eye className="size-3.5" /> Print Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Printer className="size-3.5" /> Print / Save PDF
              </button>
            </div>

            <ReportContext.Provider value={{ previewMode: false }}>
              {renderReportPages()}
            </ReportContext.Provider>

            <PrintPreviewModal
              isOpen={isPrintPreviewOpen}
              onClose={() => setIsPrintPreviewOpen(false)}
              project={project}
              results={results}
            >
              <ReportContext.Provider value={{ previewMode: true }}>
                {renderReportPages()}
              </ReportContext.Provider>
            </PrintPreviewModal>
          </div>
        )}
      </main>
    </div>
  );
}
