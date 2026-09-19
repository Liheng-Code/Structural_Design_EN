import React, { useState, useMemo } from "react";
import { read, utils, write } from "xlsx";
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
  Plus,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { useProject } from "@/lib/store";
import { defaultBoredPileProject, analyzeBoredPile } from "@/lib/bored-pile/calculations";
import type { BoredPileProject, SoilLayerInput } from "@/lib/bored-pile/types";
import { Equation } from "@/components/Equation";

const emptyLayer = (index: number, topDepth: number): SoilLayerInput => ({
  id: `L${index}`,
  name: "Custom soil layer",
  type: "custom",
  behaviorType: "custom",
  topDepth,
  bottomDepth: topDepth + 2,
  gamma: 18,
  gammaSat: 19,
  gammaEffective: 9.2,
  phi: 30,
  c: 0,
  cu: 0,
  sptN: 0,
  cptQc: 0,
  e50: 20000,
  eoed: 16000,
  eur: 60000,
  nu: 0.3,
  permeability: 1e-7,
  ocr: 1,
  initialVoidRatio: 0.7,
  compressionIndex: 0.2,
  recompressionIndex: 0.03,
  preconsolidationStress: 100,
  k0: 0.5,
  rInter: 0.7,
  characteristicShaftFriction: 0,
  characteristicBaseResistance: 0,
  drainage: "drained",
  method: "beta",
});

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function numberFrom(row: Record<string, string>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = Number(row[key]);
    if (row[key] !== undefined && Number.isFinite(value)) return value;
  }
  return undefined;
}

function parseSoilCsv(text: string): SoilLayerInput[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (lines.length < 2 || lines[0].trim().startsWith("PK")) {
    throw new Error("This file is an Excel workbook, not a CSV text file.");
  }
  const headers = parseCsvLine(lines[0]).map((header) =>
    header.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ""]));
    const layer = emptyLayer(
      index + 1,
      numberFrom(row, "topdepth", "topdepthmbgl", "top", "depthtop") ?? index * 2,
    );
    return {
      ...layer,
      id: row.id || row.layer || `L${index + 1}`,
      name:
        row.name ||
        row.soildescription ||
        row.soildescriptionclassificationuscs ||
        row.description ||
        layer.name,
      type:
        (row.type as SoilLayerInput["type"]) ||
        (row.behaviortype?.toLowerCase().includes("cohesive")
          ? "clay"
          : row.behaviortype?.toLowerCase().includes("granular")
            ? "sand"
            : "custom"),
      behaviorType: row.behaviortype?.toLowerCase().includes("rock")
        ? "rock"
        : row.behaviortype?.toLowerCase().includes("cohesive")
          ? "cohesive"
          : row.behaviortype?.toLowerCase().includes("granular")
            ? "granular"
            : "custom",
      topDepth: numberFrom(row, "topdepth", "topdepthmbgl", "top", "depthtop") ?? layer.topDepth,
      bottomDepth:
        numberFrom(row, "bottomdepth", "bottomdepthmbgl", "bottom", "depthbottom") ??
        layer.bottomDepth,
      gamma:
        numberFrom(
          row,
          "gamma",
          "gammatotal",
          "bulkunitweight",
          "bulkunitweightgamma",
          "unitweight",
        ) ?? layer.gamma,
      gammaSat:
        numberFrom(row, "gammasat", "saturatedunitweight") ??
        (numberFrom(row, "effectiveunitweight", "effectiveunitweightgamma") !== undefined
          ? (numberFrom(row, "effectiveunitweight", "effectiveunitweightgamma") as number) + 9.81
          : layer.gammaSat),
      gammaEffective:
        numberFrom(
          row,
          "gammaeffective",
          "effectiveunitweight",
          "effectiveunitweightgamma",
          "gammaseffective",
        ) ?? layer.gammaEffective,
      phi:
        numberFrom(row, "phi", "phieffective", "effectivefrictionangle", "frictionangle") ??
        layer.phi,
      c: numberFrom(row, "c", "cohesion", "effectivecohesionc") ?? layer.c,
      cu: numberFrom(row, "cu", "undrainedshearstrength", "undrainedshearstrengthcu") ?? layer.cu,
      sptN: numberFrom(row, "sptn", "spt", "sptnvalueblows300mm") ?? layer.sptN,
      cptQc: numberFrom(row, "cptqc", "qc", "cptconeres", "cptconeresqc") ?? layer.cptQc,
      e50: row.youngsmoduluse
        ? (numberFrom(row, "youngsmoduluse") ?? 0) * 1000
        : (numberFrom(row, "e50", "e50ref") ?? layer.e50),
      eoed: row.oedometermoduluseoed
        ? (numberFrom(row, "oedometermoduluseoed") ?? 0) * 1000
        : (numberFrom(row, "eoed", "oedometerstiffness") ?? layer.eoed),
      eur: numberFrom(row, "eur", "eurref") ?? layer.eur,
      nu: numberFrom(row, "nu", "poissonsratio") ?? layer.nu,
      permeability: numberFrom(row, "permeability", "k") ?? layer.permeability,
      ocr: numberFrom(row, "ocr") ?? layer.ocr,
      initialVoidRatio:
        numberFrom(row, "initialvoidratio", "initialvoidratioe0", "e0") ?? layer.initialVoidRatio,
      compressionIndex:
        numberFrom(row, "compressionindex", "compressionindexcc", "cc") ?? layer.compressionIndex,
      recompressionIndex:
        numberFrom(row, "recompressionindex", "recompressionindexcs", "cs") ??
        layer.recompressionIndex,
      preconsolidationStress:
        numberFrom(row, "preconsolidationstress", "preconsolidationstressp0", "p0") ??
        layer.preconsolidationStress,
      k0: numberFrom(row, "k0") ?? layer.k0,
      rInter: numberFrom(row, "rinter", "interfacefactor") ?? layer.rInter,
      characteristicShaftFriction:
        numberFrom(row, "characteristicshaftfriction", "charshaftfrictionqsk", "qsk") ??
        layer.characteristicShaftFriction,
      characteristicBaseResistance:
        numberFrom(row, "characteristicbaseresistance", "charbaseresistanceqbk", "qbk") ??
        layer.characteristicBaseResistance,
      drainage: (row.drainage || row.drainageconditionundraineddrained || "")
        .toLowerCase()
        .includes("undrained")
        ? "undrained"
        : layer.drainage,
      method: row.method === "alpha" || row.method === "empirical" ? row.method : layer.method,
    };
  });
}

function parseSoilWorkbook(buffer: ArrayBuffer): SoilLayerInput[] {
  const workbook = read(buffer, { type: "array" });
  const sheetName =
    workbook.SheetNames.find((name) => name.toLowerCase().includes("custom ground profile")) ||
    workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("The workbook does not contain a worksheet.");
  const matrix = utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  const headerIndex = matrix.findIndex(
    (row) =>
      String(row[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") === "layerid",
  );
  if (headerIndex < 0) throw new Error("Could not find the v2 Layer ID header row.");
  const headers = (matrix[headerIndex] ?? []).map((header) => String(header));
  const dataRows = matrix.slice(headerIndex + 1).filter((row) => String(row[0]).trim());
  const csv = [
    headers.map(csvCell).join(","),
    ...dataRows.map((row) => headers.map((_, index) => csvCell(row[index])).join(",")),
  ].join("\n");
  return parseSoilCsv(csv);
}

const v2TemplateHeaders = [
  "Layer ID",
  "Top Depth (m bgl)",
  "Bottom Depth (m bgl)",
  "Thickness (m)",
  "Soil Description & Classification (USCS)",
  "Behavior Type (Cohesive/Granular/Rock)",
  "Drainage Condition (Undrained/Drained)",
  "Bulk Unit Weight gamma (kN/m3)",
  "Effective Unit Weight gamma' (kN/m3)",
  "SPT N-value (blows/300mm)",
  "CPT Cone Res. qc (MPa)",
  "Undrained Shear Strength cu (kPa)",
  "Effective Friction Angle phi' (deg)",
  "Effective Cohesion c' (kPa)",
  "Young's Modulus E' (MPa)",
  "Oedometer Modulus Eoed (MPa)",
  "Initial Void Ratio e0",
  "Compression Index Cc",
  "Recompression Index Cs",
  "Preconsolidation Stress p0 (kPa)",
  "Overconsolidation Ratio OCR",
  "Char. Shaft Friction qs,k (kPa)",
  "Char. Base Resistance qb,k (kPa)",
];

function v2Row(layer: SoilLayerInput): unknown[] {
  return [
    layer.id,
    layer.topDepth,
    layer.bottomDepth,
    layer.bottomDepth - layer.topDepth,
    layer.name,
    layer.behaviorType ?? "custom",
    layer.drainage,
    layer.gamma,
    layer.gammaEffective ?? layer.gammaSat,
    layer.sptN ?? "",
    layer.cptQc ?? "",
    layer.cu,
    layer.phi,
    layer.c,
    layer.e50 ? layer.e50 / 1000 : "",
    layer.eoed ? layer.eoed / 1000 : "",
    layer.initialVoidRatio ?? "",
    layer.compressionIndex ?? "",
    layer.recompressionIndex ?? "",
    layer.preconsolidationStress ?? "",
    layer.ocr ?? "",
    layer.characteristicShaftFriction ?? "",
    layer.characteristicBaseResistance ?? "",
  ];
}

function downloadV2Template(layers: SoilLayerInput[]): void {
  const workbook = utils.book_new();
  const sheet = utils.aoa_to_sheet([
    ["EUROCODE 7 - BOREHOLE SOIL STRATA MODEL"],
    ["Fill the layer table below, save as .xlsx, then import it into the bored pile soil model."],
    [],
    v2TemplateHeaders,
    ...layers.map(v2Row),
  ]);
  utils.book_append_sheet(workbook, sheet, "Custom Ground Profile");
  const output = write(workbook, { bookType: "xlsx", type: "array" });
  const url = URL.createObjectURL(
    new Blob([output], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "borehole_soil_data_template-v2.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

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
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Custom Soil Model</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Layered ground profile with GEO5 / PLAXIS-style material inputs
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2 font-mono text-xs">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 cursor-pointer">
                    <Upload className="size-3.5" /> Import Excel / CSV
                    <input
                      type="file"
                      accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        try {
                          const buffer = await file.arrayBuffer();
                          const isWorkbook = new TextDecoder().decode(buffer.slice(0, 2)) === "PK";
                          const layers = isWorkbook
                            ? parseSoilWorkbook(buffer)
                            : parseSoilCsv(new TextDecoder().decode(buffer));
                          setProject({ ...project, layers });
                          setSoilMessage(`${layers.length} layer(s) imported from ${file.name}`);
                        } catch (error) {
                          setSoilMessage(
                            error instanceof Error
                              ? error.message
                              : "Could not read the soil file.",
                          );
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <button
                    onClick={() => downloadV2Template(project.layers)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-cyan-950 border border-cyan-700 text-cyan-200 hover:bg-cyan-900"
                  >
                    <Download className="size-3.5" /> Download v2 Template
                  </button>
                  <button
                    onClick={() => {
                      const headers = [
                        "id",
                        "name",
                        "type",
                        "topDepth",
                        "bottomDepth",
                        "gamma",
                        "gammaSat",
                        "phi",
                        "c",
                        "cu",
                        "sptN",
                        "e50",
                        "eoed",
                        "eur",
                        "nu",
                        "permeability",
                        "ocr",
                        "k0",
                        "rInter",
                        "drainage",
                        "method",
                      ];
                      const rows = project.layers.map((layer) =>
                        headers
                          .map((header) => csvCell(layer[header as keyof SoilLayerInput]))
                          .join(","),
                      );
                      const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
                        type: "text/csv;charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "bored-pile-soil-model.csv";
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    <Download className="size-3.5" /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(600px,1.25fr)] 2xl:grid-cols-[minmax(0,0.92fr)_minmax(680px,1.35fr)] gap-6 items-start">
              <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
                <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#040910] border border-slate-800 text-slate-300">
                    Layers: <strong className="text-cyan-300">{project.layers.length}</strong>
                  </div>
                  <label className="rounded-lg border border-cyan-700/70 bg-cyan-950/40 p-3 text-slate-300">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-cyan-300">
                      Groundwater level (m bgl)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={project.waterLevel}
                      onChange={(event) =>
                        setProject({
                          ...project,
                          waterLevel: Math.max(0, Number(event.target.value) || 0),
                        })
                      }
                      className="w-full rounded border border-cyan-700 bg-[#040910] px-2 py-1.5 text-base font-bold text-cyan-200"
                    />
                    <span className="mt-1 block text-[10px] text-slate-500">
                      Below ground level; updates effective stress and diagrams.
                    </span>
                  </label>
                  <div className="p-3 rounded-lg bg-[#040910] border border-slate-800 text-slate-300">
                    Pile toe:{" "}
                    <strong className="text-cyan-300">{project.length.toFixed(2)} m</strong>
                  </div>
                </div>

                {soilMessage && (
                  <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 font-mono text-xs text-amber-200">
                    {soilMessage}
                  </p>
                )}

                <div className="space-y-4">
                  {project.layers.map((layer, index) => {
                    const updateLayer = (patch: Partial<SoilLayerInput>) => {
                      setProject({
                        ...project,
                        layers: project.layers.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, ...patch } : item,
                        ),
                      });
                    };
                    const input = (label: string, key: keyof SoilLayerInput, unit = "") => (
                      <label className="block">
                        <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">
                          {label}
                          {unit && ` (${unit})`}
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={typeof layer[key] === "number" ? layer[key] : ""}
                          onChange={(event) =>
                            updateLayer({
                              [key]: Number(event.target.value),
                            } as Partial<SoilLayerInput>)
                          }
                          className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
                        />
                      </label>
                    );
                    return (
                      <section
                        key={layer.id}
                        className="rounded-xl border border-cyan-900/60 bg-[#040910]/80 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="rounded bg-cyan-950 px-2 py-1 font-mono text-xs font-bold text-cyan-300">
                              {layer.id}
                            </span>
                            <input
                              value={layer.name}
                              onChange={(event) => updateLayer({ name: event.target.value })}
                              className="min-w-0 border-b border-slate-700 bg-transparent px-1 py-1 font-semibold text-white outline-none focus:border-cyan-400"
                            />
                          </div>
                          <button
                            title="Remove layer"
                            onClick={() =>
                              setProject({
                                ...project,
                                layers: project.layers.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              })
                            }
                            className="rounded p-2 text-slate-500 hover:bg-rose-950/60 hover:text-rose-300"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <p className="mb-3 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400">
                          1. Stratum geometry and basic classification
                        </p>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs">
                          {input("Top", "topDepth", "m")}
                          {input("Bottom", "bottomDepth", "m")}
                          {input("γ total", "gamma", "kN/m³")}
                          {input("γ saturated", "gammaSat", "kN/m³")}
                          {input("SPT N", "sptN")}
                          {input("CPT qc", "cptQc", "MPa")}
                          <label>
                            <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">
                              Behavior type
                            </span>
                            <select
                              value={layer.behaviorType ?? "custom"}
                              onChange={(event) =>
                                updateLayer({
                                  behaviorType: event.target
                                    .value as SoilLayerInput["behaviorType"],
                                })
                              }
                              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
                            >
                              <option value="cohesive">Cohesive</option>
                              <option value="granular">Granular</option>
                              <option value="rock">Rock</option>
                              <option value="custom">Custom</option>
                            </select>
                          </label>
                          <label>
                            <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">
                              Drainage condition
                            </span>
                            <select
                              value={layer.drainage ?? "drained"}
                              onChange={(event) =>
                                updateLayer({
                                  drainage: event.target.value as SoilLayerInput["drainage"],
                                  method: event.target.value === "undrained" ? "alpha" : "beta",
                                })
                              }
                              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
                            >
                              <option value="drained">Drained</option>
                              <option value="undrained">Undrained</option>
                            </select>
                          </label>
                        </div>

                        <p className="mb-3 mt-5 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400">
                          2. Strength and stiffness parameters
                        </p>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs">
                          {input("φ'", "phi", "°")}
                          {input("c'", "c", "kPa")}
                          {input("cu", "cu", "kPa")}
                          {input("E' / E50", "e50", "kPa")}
                          {input("Eoed", "eoed", "kPa")}
                          {input("Eur", "eur", "kPa")}
                          {input("ν", "nu")}
                          {input("Permeability", "permeability", "m/s")}
                        </div>

                        <p className="mb-3 mt-5 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400">
                          3. Consolidation and pile resistance
                        </p>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs">
                          {input("OCR", "ocr")}
                          {input("K0", "k0")}
                          {input("Rinter", "rInter")}
                          {input("e0", "initialVoidRatio")}
                          {input("Cc", "compressionIndex")}
                          {input("Cs", "recompressionIndex")}
                          {input("p0", "preconsolidationStress", "kPa")}
                          {input("qs,k", "characteristicShaftFriction", "kPa")}
                          {input("qb,k", "characteristicBaseResistance", "kPa")}
                          <label>
                            <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">
                              Material type
                            </span>
                            <select
                              value={layer.type}
                              onChange={(event) =>
                                updateLayer({ type: event.target.value as SoilLayerInput["type"] })
                              }
                              className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
                            >
                              <option value="custom">Custom</option>
                              <option value="fill">Fill</option>
                              <option value="sand">Sand</option>
                              <option value="dense-sand">Dense sand</option>
                              <option value="clay">Clay</option>
                              <option value="stiff-clay">Stiff clay</option>
                            </select>
                          </label>
                        </div>
                      </section>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs">
                  <button
                    onClick={() =>
                      setProject({
                        ...project,
                        layers: [
                          ...project.layers,
                          emptyLayer(
                            project.layers.length + 1,
                            project.layers.at(-1)?.bottomDepth ?? 0,
                          ),
                        ],
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500"
                  >
                    <Plus className="size-4" /> Add soil layer
                  </button>
                  <span className="text-slate-500">
                    Parameters are user inputs; verify values against the geotechnical investigation
                    before issuing design.
                  </span>
                </div>
              </div>

              <aside className="xl:sticky xl:top-6 min-h-[900px] bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 border-b border-cyan-900/60 pb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      Ground Cross-Section
                    </h2>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      Live profile preview • click a stratum to focus it
                    </p>
                  </div>
                  <span className="rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300">
                    LIVE
                  </span>
                </div>

                {(() => {
                  const maxDepth = Math.max(
                    project.length,
                    ...project.layers.map((layer) => layer.bottomDepth),
                    1,
                  );
                  const top = 48;
                  const bottom = 770;
                  const scale = (bottom - top) / maxDepth;
                  const pileWidth = Math.max(22, Math.min(48, project.diameter / 25));
                  const waterY = top + Math.max(0, project.waterLevel) * scale;
                  return (
                    <div className="mt-4">
                      <svg
                        viewBox="0 0 760 820"
                        className="h-[820px] w-full overflow-visible"
                        role="img"
                        aria-label="Interactive bored pile soil cross-section"
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
                        <rect
                          x="160"
                          y={top}
                          width="360"
                          height={bottom - top}
                          rx="3"
                          fill="#0a1525"
                          stroke="#334155"
                        />
                        <rect
                          x="160"
                          y={top}
                          width="360"
                          height={bottom - top}
                          fill="url(#soil-hatch)"
                          pointerEvents="none"
                        />
                        <line
                          x1="160"
                          y1={top}
                          x2="520"
                          y2={top}
                          stroke="#f8fafc"
                          strokeWidth="2"
                        />
                        <text x="160" y="26" fill="#cbd5e1" fontSize="13" fontFamily="monospace">
                          GROUND LEVEL 0.00 m
                        </text>

                        {project.layers.map((layer) => {
                          const y = top + Math.max(0, layer.topDepth) * scale;
                          const height = Math.max(
                            4,
                            (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) *
                              scale,
                          );
                          const colors = soilLayerColor(layer);
                          const selected = selectedLayerId === layer.id;
                          return (
                            <g
                              key={layer.id}
                              onClick={() => setSelectedLayerId(layer.id)}
                              className="cursor-pointer"
                            >
                              <rect
                                x="160"
                                y={y}
                                width="360"
                                height={height}
                                fill={colors.fill}
                                fillOpacity={selected ? 0.72 : 0.42}
                                stroke={selected ? "#f8fafc" : colors.stroke}
                                strokeWidth={selected ? 2 : 1}
                              />
                              <rect
                                x="160"
                                y={y}
                                width="360"
                                height={height}
                                fill={`url(#${soilPatternId(layer)})`}
                              />
                              {height > 8 && (
                                <line
                                  x1="520"
                                  y1={y + Math.min(height / 2, 12)}
                                  x2="542"
                                  y2={y + Math.min(height / 2, 12)}
                                  stroke={selected ? "#f8fafc" : colors.stroke}
                                />
                              )}
                              {height > 8 && (
                                <text
                                  x="550"
                                  y={y + Math.min(height / 2 + 4, height - 2)}
                                  fill="#f8fafc"
                                  fontSize="13"
                                  fontFamily="monospace"
                                  pointerEvents="none"
                                >
                                  {layer.id} · {layer.name.slice(0, 30)}
                                </text>
                              )}
                              <text
                                x="530"
                                y={y + 13}
                                fill="#94a3b8"
                                fontSize="10"
                                fontFamily="monospace"
                              >
                                {layer.topDepth.toFixed(1)}
                              </text>
                            </g>
                          );
                        })}

                        {waterY <= bottom && (
                          <g>
                            <line
                              x1="160"
                              y1={waterY}
                              x2="520"
                              y2={waterY}
                              stroke="#38bdf8"
                              strokeWidth="2"
                              strokeDasharray="7 4"
                            />
                            <text
                              x="174"
                              y={waterY - 8}
                              fill="#7dd3fc"
                              fontSize="13"
                              fontFamily="monospace"
                            >
                              GWL -{project.waterLevel.toFixed(2)} m
                            </text>
                          </g>
                        )}

                        <rect
                          x={340 - pileWidth / 2}
                          y={top}
                          width={pileWidth}
                          height={Math.min(project.length, maxDepth) * scale}
                          fill="#22d3ee"
                          fillOpacity="0.2"
                          stroke="#67e8f9"
                          strokeWidth="2"
                        />
                        <line
                          x1="340"
                          y1="12"
                          x2="340"
                          y2={top - 2}
                          stroke="#fbbf24"
                          strokeWidth="3"
                        />
                        <polygon
                          points={`334,${top - 8} 340,${top} 346,${top - 8}`}
                          fill="#fbbf24"
                        />
                        <text
                          x="355"
                          y="24"
                          fill="#fbbf24"
                          fontSize="13"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          N_Ed {project.nEd} kN
                        </text>
                        <line
                          x1="160"
                          y1={top + project.length * scale}
                          x2="520"
                          y2={top + project.length * scale}
                          stroke="#fbbf24"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <text
                          x="174"
                          y={Math.min(805, top + project.length * scale + 20)}
                          fill="#fbbf24"
                          fontSize="13"
                          fontFamily="monospace"
                        >
                          PILE TOE {project.length.toFixed(2)} m
                        </text>

                        {Array.from(
                          { length: Math.floor(maxDepth / 5) + 1 },
                          (_, index) => index * 5,
                        ).map((depth) => {
                          const y = top + depth * scale;
                          return y <= bottom ? (
                            <g key={depth}>
                              <line x1="144" y1={y} x2="160" y2={y} stroke="#64748b" />
                              <text
                                x="92"
                                y={y + 4}
                                fill="#64748b"
                                fontSize="11"
                                fontFamily="monospace"
                              >
                                {depth}m
                              </text>
                            </g>
                          ) : null;
                        })}
                      </svg>

                      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                        <div className="rounded border border-slate-700 bg-[#040910] p-2">
                          Pile diameter{" "}
                          <strong className="text-cyan-300">{project.diameter} mm</strong>
                        </div>
                        <div className="rounded border border-slate-700 bg-[#040910] p-2">
                          Pile length <strong className="text-cyan-300">{project.length} m</strong>
                        </div>
                        <div className="rounded border border-slate-700 bg-[#040910] p-2">
                          Selected{" "}
                          <strong className="text-cyan-300">{selectedLayerId ?? "none"}</strong>
                        </div>
                        <div className="rounded border border-slate-700 bg-[#040910] p-2">
                          Toe layer{" "}
                          <strong className="text-cyan-300">
                            {project.layers.find(
                              (layer) =>
                                project.length >= layer.topDepth &&
                                project.length <= layer.bottomDepth,
                            )?.id ?? "outside profile"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </aside>
            </div>
          </div>
        )}

        {/* 3. GEOMETRY & LOADS */}
        {activeTab === "geometry" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.78fr)_minmax(560px,1.22fr)] gap-6 items-start">
            <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="border-b border-cyan-900/60 pb-4 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                  Input panel / geometry & actions
                </p>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  Pile Design Parameters
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Edit the pile and the diagrams update immediately.
                </p>
              </div>

              <div className="space-y-5 font-mono text-xs">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                    Pile geometry
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Diameter (mm)</span>
                      <input
                        type="number"
                        min="300"
                        step="50"
                        value={project.diameter}
                        onChange={(e) =>
                          setProject({ ...project, diameter: parseFloat(e.target.value) || 800 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Length (m)</span>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={project.length}
                        onChange={(e) =>
                          setProject({ ...project, length: parseFloat(e.target.value) || 25 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="col-span-2 block">
                      <span className="mb-1 block text-slate-400">Concrete grade</span>
                      <input
                        type="text"
                        value={project.concreteGrade}
                        onChange={(e) => setProject({ ...project, concreteGrade: e.target.value })}
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                    Design actions
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-slate-400">
                        N<sub>Ed</sub> (kN)
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={project.nEd}
                        onChange={(e) =>
                          setProject({ ...project, nEd: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">
                        M<sub>Ed</sub> (kNm)
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={project.mEd}
                        onChange={(e) =>
                          setProject({ ...project, mEd: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Nominal cover (mm)</span>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={project.cover}
                        onChange={(e) =>
                          setProject({ ...project, cover: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Groundwater (m bgl)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={project.waterLevel}
                        onChange={(e) =>
                          setProject({ ...project, waterLevel: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-cyan-900/60 pt-5">
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Toe layer</p>
                    <p className="mt-1 font-bold text-cyan-300">
                      {project.layers.find(
                        (layer) =>
                          project.length >= layer.topDepth && project.length <= layer.bottomDepth,
                      )?.id ?? "Outside profile"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">ULS utilization</p>
                    <p
                      className={`mt-1 font-bold ${results.utilizationGeotechnical <= 1 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {Number.isFinite(results.utilizationGeotechnical)
                        ? `${(results.utilizationGeotechnical * 100).toFixed(1)}%`
                        : "INPUT REQUIRED"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="xl:sticky xl:top-6 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between border-b border-cyan-900/60 pb-4 mb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                    Live visualization / scale model
                  </p>
                  <h2 className="font-display text-xl font-bold text-white mt-1">
                    Bored Pile Geometry
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Plan view and longitudinal section through every soil stratum.
                  </p>
                </div>
                <span className="rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-5">
                <div className="rounded-xl border border-slate-700 bg-[#040910] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-slate-200">PLAN VIEW</h3>
                    <span className="font-mono text-[10px] text-slate-500">
                      Ø {project.diameter} mm
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 260 260"
                    className="mx-auto w-full max-w-[280px]"
                    role="img"
                    aria-label="Bored pile plan view"
                  >
                    <defs>
                      <pattern id="plan-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path
                          d="M 16 0 L 0 0 0 16"
                          fill="none"
                          stroke="#1e3a5f"
                          strokeWidth="0.7"
                          opacity="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect
                      x="8"
                      y="8"
                      width="244"
                      height="244"
                      fill="url(#plan-grid)"
                      stroke="#334155"
                    />
                    <circle
                      cx="130"
                      cy="130"
                      r="92"
                      fill="#0b192c"
                      stroke="#64748b"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="130"
                      cy="130"
                      r={Math.min(82, Math.max(20, project.diameter / 11))}
                      fill="#155e75"
                      fillOpacity="0.75"
                      stroke="#67e8f9"
                      strokeWidth="3"
                    />
                    <circle
                      cx="130"
                      cy="130"
                      r={Math.min(68, Math.max(14, project.diameter / 14))}
                      fill="#07111f"
                      stroke="#22d3ee"
                      strokeOpacity="0.5"
                    />
                    <line
                      x1="38"
                      y1="130"
                      x2="222"
                      y2="130"
                      stroke="#94a3b8"
                      strokeDasharray="5 4"
                    />
                    <line
                      x1="130"
                      y1="38"
                      x2="130"
                      y2="222"
                      stroke="#94a3b8"
                      strokeDasharray="5 4"
                    />
                    <line
                      x1="130"
                      y1="130"
                      x2="130"
                      y2={130 - Math.min(82, Math.max(20, project.diameter / 11))}
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x="130"
                      y="238"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      SECTION A-A
                    </text>
                    <text
                      x="130"
                      y="25"
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      N_Ed
                    </text>
                  </svg>
                  <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-400">
                    <span>
                      Area{" "}
                      <strong className="text-cyan-300">{results.pileArea.toFixed(3)} m²</strong>
                    </span>
                    <span>
                      Perimeter{" "}
                      <strong className="text-cyan-300">
                        {results.pilePerimeter.toFixed(2)} m
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-[#040910] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-slate-200">SECTION A-A</h3>
                    <span className="font-mono text-[10px] text-slate-500">
                      0.00 to {project.length.toFixed(1)} m
                    </span>
                  </div>
                  {(() => {
                    const maxDepth = Math.max(
                      project.length,
                      ...project.layers.map((layer) => layer.bottomDepth),
                      1,
                    );
                    const topDepth = 28;
                    const bottomDepth = 510;
                    const depthScale = (bottomDepth - topDepth) / maxDepth;
                    return (
                      <svg
                        viewBox="0 0 360 550"
                        className="h-[520px] w-full"
                        role="img"
                        aria-label="Bored pile longitudinal section through soil strata"
                      >
                        <defs>
                          <pattern
                            id="section-pattern-fill"
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
                            id="section-pattern-clay"
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
                            id="section-pattern-sand"
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
                            id="section-pattern-rock"
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
                            id="section-pattern-custom"
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
                        <rect
                          x="72"
                          y={topDepth}
                          width="190"
                          height={bottomDepth - topDepth}
                          fill="#0a1525"
                          stroke="#334155"
                        />
                        {project.layers.map((layer) => {
                          const y = topDepth + Math.max(0, layer.topDepth) * depthScale;
                          const height = Math.max(
                            3,
                            (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) *
                              depthScale,
                          );
                          const colors = soilLayerColor(layer);
                          const patternId = soilPatternId(layer).replace(
                            "soil-pattern",
                            "section-pattern",
                          );
                          return (
                            <g key={layer.id}>
                              <rect
                                x="72"
                                y={y}
                                width="190"
                                height={height}
                                fill={colors.fill}
                                fillOpacity="0.5"
                                stroke={colors.stroke}
                              />
                              <rect
                                x="72"
                                y={y}
                                width="190"
                                height={height}
                                fill={`url(#${patternId})`}
                              />
                              <text
                                x="82"
                                y={y + Math.min(height - 3, 14)}
                                fill="#f8fafc"
                                fontSize="9"
                                fontFamily="monospace"
                              >
                                {layer.id} {layer.name.slice(0, 20)}
                              </text>
                              <text
                                x="270"
                                y={y + 11}
                                fill="#94a3b8"
                                fontSize="9"
                                fontFamily="monospace"
                              >
                                {layer.topDepth.toFixed(1)}
                              </text>
                            </g>
                          );
                        })}
                        <line
                          x1="72"
                          y1={topDepth + project.waterLevel * depthScale}
                          x2="262"
                          y2={topDepth + project.waterLevel * depthScale}
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="7 4"
                        />
                        <text
                          x="80"
                          y={topDepth + project.waterLevel * depthScale - 6}
                          fill="#7dd3fc"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          GWL -{project.waterLevel.toFixed(1)} m
                        </text>
                        <rect
                          x="150"
                          y={topDepth}
                          width={Math.max(22, Math.min(44, project.diameter / 25))}
                          height={Math.min(project.length, maxDepth) * depthScale}
                          fill="#22d3ee"
                          fillOpacity="0.25"
                          stroke="#67e8f9"
                          strokeWidth="2"
                        />
                        <line x1="171" y1="7" x2="171" y2="24" stroke="#fbbf24" strokeWidth="3" />
                        <polygon points="165,20 171,28 177,20" fill="#fbbf24" />
                        <line
                          x1="72"
                          y1={topDepth + project.length * depthScale}
                          x2="262"
                          y2={topDepth + project.length * depthScale}
                          stroke="#fbbf24"
                          strokeDasharray="3 3"
                        />
                        <text
                          x="80"
                          y={Math.min(542, topDepth + project.length * depthScale + 15)}
                          fill="#fbbf24"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          TOE {project.length.toFixed(1)} m
                        </text>
                        {Array.from(
                          { length: Math.floor(maxDepth / 5) + 1 },
                          (_, index) => index * 5,
                        ).map((depth) => {
                          const y = topDepth + depth * depthScale;
                          return y <= bottomDepth ? (
                            <g key={depth}>
                              <line x1="60" y1={y} x2="72" y2={y} stroke="#64748b" />
                              <text
                                x="28"
                                y={y + 4}
                                fill="#64748b"
                                fontSize="9"
                                fontFamily="monospace"
                              >
                                {depth}m
                              </text>
                            </g>
                          ) : null;
                        })}
                      </svg>
                    );
                  })()}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 4. GEOTECHNICAL ULS */}
        {activeTab === "geotechnical" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Geotechnical Ultimate Limit State (EN 1997-1)
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Shaft friction and base bearing capacity breakdown
                  </p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-xs text-slate-400">Total Characteristic Resistance R_c,k:</p>
                  <p className="text-lg font-bold text-cyan-300">
                    {results.totalCharacteristicResistance} kN
                  </p>
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
                        <td className="p-3 font-bold text-white">
                          {l.layerId}: {l.name}
                        </td>
                        <td className="p-3 text-cyan-300">{l.effectiveLength.toFixed(1)} m</td>
                        <td className="p-3 text-slate-400">{l.methodUsed}</td>
                        <td className="p-3 text-right font-bold text-white">
                          {l.shaftResistance.toFixed(1)} kN
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
                  <p className="text-xs text-slate-400">Total Shaft Resistance (R_sk):</p>
                  <p className="text-xl font-bold text-cyan-300 mt-1">
                    {results.totalShaftResistance} kN
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#040910] border border-cyan-900/60">
                  <p className="text-xs text-slate-400">Base Bearing Resistance (R_bk):</p>
                  <p className="text-xl font-bold text-cyan-300 mt-1">
                    {results.baseResistance} kN
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-600/60">
                  <p className="text-xs text-cyan-200">Design Resistance (R_c,d / γ_t):</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">
                    {results.designResistance} kN
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTLEMENT SLS */}
        {activeTab === "settlement" && (
          <div className="space-y-6">
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-2">
                Single-Pile Settlement Analysis (SLS)
              </h2>
              <p className="text-xs font-mono text-slate-400 mb-6">
                Evaluation under serviceability load combinations
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                <div className="p-5 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Pile Elastic Shortening:</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {results.settlementElastic} mm
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">ΔL = N × L / (A_c × E_c)</p>
                </div>
                <div className="p-5 rounded-xl bg-[#040910] border border-slate-800">
                  <p className="text-xs text-slate-400">Soil Deformation & Base Settlement:</p>
                  <p className="text-2xl font-bold text-white mt-1">{results.settlementSoil} mm</p>
                  <p className="text-[11px] text-slate-500 mt-1">Load transfer & consolidation</p>
                </div>
                <div className="p-5 rounded-xl bg-cyan-950/60 border border-cyan-600/60">
                  <p className="text-xs text-cyan-200">Total Calculated Settlement:</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {results.settlementTotal} mm
                  </p>
                  <p className="text-[11px] text-cyan-300 mt-1">
                    Allowable limit: {results.allowableSettlement} mm (PASS)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. RC STRUCTURAL (EC2) */}
        {activeTab === "rc" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.78fr)_minmax(620px,1.22fr)] gap-6 items-start">
            <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
              <div className="border-b border-cyan-900/60 pb-4 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                  Input panel / EN 1992-1-1
                </p>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  RC Reinforcement Cage
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Adjust the reinforcement arrangement and inspect the cage on the right.
                </p>
              </div>

              <div className="space-y-5 font-mono text-xs">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                    Concrete and durability
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="col-span-2 block">
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

                <div className="grid grid-cols-2 gap-3 border-t border-cyan-900/60 pt-5">
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Pile diameter</p>
                    <p className="mt-1 font-bold text-cyan-300">{project.diameter} mm</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Pile length</p>
                    <p className="mt-1 font-bold text-cyan-300">{project.length} m</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">
                      A<sub>s</sub> provided
                    </p>
                    <p className="mt-1 font-bold text-cyan-300">{results.rebarArea} mm²</p>
                  </div>
                  <div className="rounded-lg border border-cyan-900/60 bg-[#040910] p-3">
                    <p className="text-slate-500">Utilization</p>
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
          </div>
        )}

        {/* 7. CALCULATION REPORT */}
        {activeTab === "report" && (
          <div className="report-document space-y-6 bg-[#f4f0e6] text-slate-900 p-4 sm:p-8 rounded-2xl shadow-2xl font-sans text-xs leading-relaxed">
            <div className="flex justify-end gap-2 font-sans no-print">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs flex items-center gap-1.5"
              >
                <Printer className="size-3.5" /> Print / Save PDF
              </button>
            </div>

            <section className="report-cover min-h-[620px] flex flex-col justify-between border-8 border-double border-[#173b5f] bg-[#f8f5ed] p-10 text-center">
              <div className="font-mono text-xs tracking-[0.25em] text-[#173b5f]">
                STRUCTURAL DESIGN PLATFORM
              </div>
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
            </section>

            <section className="report-page min-h-[520px] bg-[#f8f5ed] p-10">
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
                  <span>5. RC pile and reinforcement calculation</span>
                  <span>7</span>
                </p>
                <p className="flex justify-between border-b border-dotted border-slate-400">
                  <span>6. Soil strata and resistance schedule</span>
                  <span>8</span>
                </p>
              </div>
            </section>

            <section className="report-page bg-[#f8f5ed] p-10">
              <h2 className="border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]">
                1. Design Basis & Input Summary
              </h2>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <p>Project: {project.projectName}</p>
                <p>Designer: {project.designer}</p>
                <p>Diameter: {project.diameter} mm</p>
                <p>Length: {project.length} m</p>
                <p>
                  Design load N<sub>Ed</sub>: {project.nEd} kN
                </p>
                <p>
                  Moment M<sub>Ed</sub>: {project.mEd} kNm
                </p>
                <p>Water level: {project.waterLevel} m bgl</p>
                <p>
                  Design approach: {project.designApproach}, SF {project.safetyFactor.toFixed(1)}
                </p>
              </div>
              <div className="mt-8 border-t border-[#173b5f]/30 pt-5">
                <h3 className="text-base font-bold text-[#173b5f]">
                  1.1 Soil Parameters and Ground Profile
                </h3>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
                  <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                    <p>Layers: {project.layers.length}</p>
                    <p>Groundwater: {project.waterLevel} m bgl</p>
                    <p>Toe depth: {project.length} m</p>
                    <p>
                      Toe layer:{" "}
                      {project.layers.find(
                        (layer) =>
                          project.length >= layer.topDepth && project.length <= layer.bottomDepth,
                      )?.id ?? "INPUT REQUIRED"}
                    </p>
                    <p>
                      Profile depth:{" "}
                      {Math.max(0, ...project.layers.map((layer) => layer.bottomDepth))} m
                    </p>
                    <p>Analysis: EC7 shaft + base</p>
                  </div>
                  <svg
                    viewBox="0 0 520 220"
                    className="h-56 w-full rounded border border-slate-300 bg-white"
                    role="img"
                    aria-label="Soil strata report diagram"
                  >
                    {(() => {
                      const maxDepth = Math.max(
                        project.length,
                        ...project.layers.map((layer) => layer.bottomDepth),
                        1,
                      );
                      const top = 22;
                      const bottom = 198;
                      const scale = (bottom - top) / maxDepth;
                      return (
                        <>
                          <rect
                            x="54"
                            y={top}
                            width="190"
                            height={bottom - top}
                            fill="#eef2f7"
                            stroke="#173b5f"
                          />
                          {project.layers.map((layer) => {
                            const y = top + layer.topDepth * scale;
                            const height = Math.max(
                              3,
                              (Math.min(maxDepth, layer.bottomDepth) - layer.topDepth) * scale,
                            );
                            const colors = soilLayerColor(layer);
                            return (
                              <g key={layer.id}>
                                <rect
                                  x="54"
                                  y={y}
                                  width="190"
                                  height={height}
                                  fill={colors.fill}
                                  fillOpacity="0.62"
                                  stroke={colors.stroke}
                                />
                                <text
                                  x="62"
                                  y={y + Math.min(13, Math.max(9, height - 2))}
                                  fontSize="9"
                                  fontFamily="Arial, sans-serif"
                                  fill="#172033"
                                >
                                  {layer.id} {layer.name.slice(0, 22)}
                                </text>
                              </g>
                            );
                          })}
                          <line
                            x1="54"
                            y1={top + project.waterLevel * scale}
                            x2="244"
                            y2={top + project.waterLevel * scale}
                            stroke="#147fa3"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                          <text
                            x="262"
                            y={top + project.waterLevel * scale + 4}
                            fontSize="10"
                            fill="#147fa3"
                          >
                            GWL {project.waterLevel} m
                          </text>
                          <rect
                            x="137"
                            y={top}
                            width="24"
                            height={Math.min(project.length, maxDepth) * scale}
                            fill="#22a6bd"
                            fillOpacity="0.3"
                            stroke="#0d7185"
                            strokeWidth="2"
                          />
                          <text x="262" y="28" fontSize="10" fill="#173b5f">
                            Bored pile
                          </text>
                          <text x="262" y="42" fontSize="10" fill="#173b5f">
                            L = {project.length} m
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <table className="mt-4 w-full border border-slate-300 text-left text-[11px]">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="p-2">Layer</th>
                      <th className="p-2">Depth</th>
                      <th className="p-2">Material</th>
                      <th className="p-2">γ / γ′</th>
                      <th className="p-2">φ′</th>
                      <th className="p-2">cu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.layers.map((layer) => (
                      <tr key={`basis-${layer.id}`} className="border-t border-slate-300">
                        <td className="p-2">{layer.id}</td>
                        <td className="p-2">
                          {layer.topDepth}–{layer.bottomDepth} m
                        </td>
                        <td className="p-2">{layer.name}</td>
                        <td className="p-2">
                          {layer.gamma} / {(layer.gammaSat ?? layer.gamma) - 9.81} kN/m³
                        </td>
                        <td className="p-2">{layer.phi}°</td>
                        <td className="p-2">{layer.cu} kPa</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 border-t border-[#173b5f]/30 pt-5">
                <h3 className="text-base font-bold text-[#173b5f]">1.2 Geometry and Load Inputs</h3>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <p>Diameter: {project.diameter} mm</p>
                  <p>Length: {project.length} m</p>
                  <p>
                    N<sub>Ed</sub>: {project.nEd} kN
                  </p>
                  <p>
                    M<sub>Ed</sub>: {project.mEd} kNm
                  </p>
                  <p>Concrete: {project.concreteGrade}</p>
                  <p>Ground level: {project.groundLevel} m</p>
                  <p>Water: {project.waterLevel} m bgl</p>
                  <p>Approach: {project.designApproach}</p>
                </div>
                <div className="mt-3 border-l-4 border-[#b8863b] bg-white/60 p-3">
                  Design load N<sub>Ed</sub> is checked against geotechnical design resistance and
                  RC axial resistance. Bending moment M<sub>Ed</sub> is retained as a design action
                  input for structural review.
                </div>
              </div>
              <div className="mt-8 border-t border-[#173b5f]/30 pt-5">
                <h3 className="text-base font-bold text-[#173b5f]">
                  1.3 RC Structural Design (EN2)
                </h3>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <p>Concrete grade: {project.concreteGrade}</p>
                  <p>
                    f<sub>ck</sub>: {project.fck} MPa
                  </p>
                  <p>Steel grade: {project.steelGrade}</p>
                  <p>
                    f<sub>yk</sub>: {project.fyk} MPa
                  </p>
                  <p>
                    Main bars: {project.numBars} × Ø{project.barDiameter}
                  </p>
                  <p>
                    Spiral: Ø{project.spiralBarDiameter} @ {project.spiralSpacing} mm
                  </p>
                  <p>
                    Stiffener: Ø{project.stiffenerBarDiameter} @ {project.stiffenerSpacing} mm
                  </p>
                  <p>Cover: {project.cover} mm</p>
                </div>
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-slate-300 bg-white p-3">
                    <p className="mb-2 text-xs">Reinforcement plan view</p>
                    <svg
                      viewBox="0 0 360 240"
                      className="h-56 w-full"
                      role="img"
                      aria-label="RC reinforcement plan for calculation report"
                    >
                      <circle
                        cx="125"
                        cy="120"
                        r="92"
                        fill="#dbe4ea"
                        stroke="#173b5f"
                        strokeWidth="2"
                      />
                      <circle
                        cx="125"
                        cy="120"
                        r="72"
                        fill="none"
                        stroke="#d66a7a"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx="125"
                        cy="120"
                        r="57"
                        fill="none"
                        stroke="#8b6fc4"
                        strokeWidth="3"
                        strokeDasharray="9 5"
                      />
                      {Array.from({ length: project.numBars }, (_, index) => {
                        const angle = (index / project.numBars) * Math.PI * 2 - Math.PI / 2;
                        return (
                          <circle
                            key={index}
                            cx={125 + Math.cos(angle) * 66}
                            cy={120 + Math.sin(angle) * 66}
                            r="5"
                            fill="#c4912f"
                          />
                        );
                      })}
                      <line x1="225" y1="70" x2="181" y2="83" stroke="#8b6fc4" />
                      <text x="232" y="68" fontSize="10" fill="#513c86">
                        Stiffener Ø{project.stiffenerBarDiameter} @ {project.stiffenerSpacing}
                      </text>
                      <line x1="225" y1="115" x2="197" y2="105" stroke="#d66a7a" />
                      <text x="232" y="113" fontSize="10" fill="#9d3d4e">
                        Spiral Ø{project.spiralBarDiameter} @ {project.spiralSpacing}
                      </text>
                      <line x1="225" y1="160" x2="183" y2="158" stroke="#c4912f" />
                      <text x="232" y="158" fontSize="10" fill="#805c14">
                        {project.numBars} main bars Ø{project.barDiameter}
                      </text>
                      <text x="125" y="230" textAnchor="middle" fontSize="10" fill="#173b5f">
                        Pile Ø{project.diameter} mm / cover {project.cover} mm
                      </text>
                    </svg>
                  </div>
                  <div className="border border-slate-300 bg-white p-3">
                    <p className="mb-2 text-xs">Longitudinal cage elevation</p>
                    <svg
                      viewBox="0 0 360 240"
                      className="h-56 w-full"
                      role="img"
                      aria-label="RC reinforcement elevation for calculation report"
                    >
                      <rect x="70" y="18" width="90" height="195" fill="#dbe4ea" stroke="#173b5f" />
                      {Array.from({ length: Math.min(project.numBars, 8) }, (_, index) => {
                        const x = 82 + (index / Math.max(1, Math.min(project.numBars, 8) - 1)) * 66;
                        return (
                          <line
                            key={index}
                            x1={x}
                            y1="23"
                            x2={x}
                            y2="208"
                            stroke="#c4912f"
                            strokeWidth="2"
                          />
                        );
                      })}
                      <polyline
                        points={Array.from({ length: 80 }, (_, index) => {
                          const progress = index / 79;
                          return `${115 + 28 * Math.sin(progress * Math.max(1, (project.length * 1000) / project.spiralSpacing) * Math.PI * 2)},${23 + progress * 185}`;
                        }).join(" ")}
                        fill="none"
                        stroke="#d66a7a"
                        strokeWidth="1.5"
                      />
                      {Array.from(
                        {
                          length: Math.max(
                            1,
                            Math.ceil((project.length * 1000) / project.stiffenerSpacing),
                          ),
                        },
                        (_, index) => (
                          <line
                            key={index}
                            x1="78"
                            y1={
                              28 +
                              index *
                                (180 /
                                  Math.max(
                                    1,
                                    Math.ceil((project.length * 1000) / project.stiffenerSpacing) -
                                      1,
                                  ))
                            }
                            x2="152"
                            y2={
                              28 +
                              index *
                                (180 /
                                  Math.max(
                                    1,
                                    Math.ceil((project.length * 1000) / project.stiffenerSpacing) -
                                      1,
                                  ))
                            }
                            stroke="#8b6fc4"
                            strokeWidth="1.5"
                          />
                        ),
                      )}
                      <text x="180" y="48" fontSize="10" fill="#805c14">
                        Main: {project.numBars} × Ø{project.barDiameter}
                      </text>
                      <text x="180" y="72" fontSize="10" fill="#9d3d4e">
                        Spiral: Ø{project.spiralBarDiameter} @ {project.spiralSpacing}
                      </text>
                      <text x="180" y="96" fontSize="10" fill="#513c86">
                        Stiffener: Ø{project.stiffenerBarDiameter} @ {project.stiffenerSpacing}
                      </text>
                      <text x="180" y="120" fontSize="10" fill="#173b5f">
                        Length: {project.length} m
                      </text>
                    </svg>
                  </div>
                </div>
                <table className="mt-4 w-full border border-slate-300 text-left text-[11px]">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="p-2">Reinforcement type</th>
                      <th className="p-2">Quantity / spacing</th>
                      <th className="p-2">Diameter</th>
                      <th className="p-2">Calculated weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-300">
                      <td className="p-2">Main longitudinal bars</td>
                      <td className="p-2">
                        {project.numBars} bars × {project.length} m
                      </td>
                      <td className="p-2">Ø{project.barDiameter}</td>
                      <td className="p-2">{results.mainBarWeight.toFixed(1)} kg</td>
                    </tr>
                    <tr className="border-t border-slate-300">
                      <td className="p-2">Spiral reinforcement</td>
                      <td className="p-2">
                        @ {project.spiralSpacing} mm over {project.length} m
                      </td>
                      <td className="p-2">Ø{project.spiralBarDiameter}</td>
                      <td className="p-2">{results.spiralWeight.toFixed(1)} kg</td>
                    </tr>
                    <tr className="border-t border-slate-300">
                      <td className="p-2">Stiffener reinforcement</td>
                      <td className="p-2">
                        @ {project.stiffenerSpacing} mm over {project.length} m
                      </td>
                      <td className="p-2">Ø{project.stiffenerBarDiameter}</td>
                      <td className="p-2">{results.stiffenerWeight.toFixed(1)} kg</td>
                    </tr>
                    <tr className="border-t border-slate-300">
                      <td className="p-2">Total reinforcement</td>
                      <td className="p-2">Main + spiral + stiffener</td>
                      <td className="p-2">-</td>
                      <td className="p-2">{results.totalRebarWeight.toFixed(1)} kg</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 border border-slate-300 bg-white p-3">
                  <p>As: {results.rebarArea} mm²</p>
                  <p>ρ: {results.reinforcementRatio}%</p>
                  <p>
                    N<sub>Rd</sub>: {results.structuralAxialResistance} kN
                  </p>
                  <p>RC utilization: {(results.utilizationStructural * 100).toFixed(1)}%</p>
                </div>
                <p className="mt-3">
                  Reference basis: EN 1992-1-1 concrete compression and reinforcement provisions.
                  Exact clause and National Annex values shall be confirmed for the adopted project
                  edition.
                </p>
              </div>
              <div className="mt-6 border-l-4 border-[#b8863b] bg-white/60 p-4 text-xs leading-relaxed">
                Applicable basis: EN 1990, EN 1997-1, EN 1997-2 and EN 1992-1-1. Exact clause
                references and National Annex parameters shall be confirmed against the adopted
                project edition. This report is a preliminary calculation aid and does not replace
                geotechnical investigation or engineering approval.
              </div>
            </section>

            <section className="report-page bg-[#f8f5ed] p-10">
              <h2 className="border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]">
                2. Executive Summary & Verification
              </h2>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="border border-slate-300 bg-white p-4">
                  <span>
                    End bearing R<sub>b,k</sub>
                  </span>
                  <span className="mt-2 block">{results.baseResistance} kN</span>
                </div>
                <div className="border border-slate-300 bg-white p-4">
                  <span>
                    Shaft friction R<sub>s,k</sub>
                  </span>
                  <span className="mt-2 block">{results.totalShaftResistance} kN</span>
                </div>
                <div className="border border-slate-300 bg-white p-4">
                  <span>
                    Total R<sub>c,k</sub>
                  </span>
                  <span className="mt-2 block">{results.totalCharacteristicResistance} kN</span>
                </div>
                <div className="border border-[#b8863b] bg-[#fffaf0] p-4">
                  <span>
                    Design R<sub>c,d</sub>
                  </span>
                  <span className="mt-2 block">{results.designResistance} kN</span>
                </div>
              </div>
              <table className="mt-6 w-full border border-slate-300 text-left text-xs">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="p-2">Check</th>
                    <th className="p-2">Demand</th>
                    <th className="p-2">Resistance / limit</th>
                    <th className="p-2">Utilization</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-300">
                    <td className="p-2">EC7 compression</td>
                    <td className="p-2">{project.nEd} kN</td>
                    <td className="p-2">{results.designResistance} kN</td>
                    <td className="p-2">{(results.utilizationGeotechnical * 100).toFixed(1)}%</td>
                    <td className="p-2">
                      {results.utilizationGeotechnical <= 1 ? "PASS" : "FAIL"}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-300">
                    <td className="p-2">Settlement SLS</td>
                    <td className="p-2">{results.settlementTotal} mm</td>
                    <td className="p-2">{results.allowableSettlement} mm</td>
                    <td className="p-2">
                      {((results.settlementTotal / results.allowableSettlement) * 100).toFixed(1)}%
                    </td>
                    <td className="p-2">
                      {results.settlementTotal <= results.allowableSettlement ? "PASS" : "FAIL"}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-300">
                    <td className="p-2">RC axial resistance</td>
                    <td className="p-2">{project.nEd} kN</td>
                    <td className="p-2">{results.structuralAxialResistance} kN</td>
                    <td className="p-2">{(results.utilizationStructural * 100).toFixed(1)}%</td>
                    <td className="p-2">{results.utilizationStructural <= 1 ? "PASS" : "FAIL"}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="report-page bg-[#f8f5ed] p-10">
              <h2 className="border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]">
                3. Detailed Calculation
              </h2>
              <p className="mt-3 text-xs leading-relaxed">
                Detailed calculation trail with implemented parameters, substituted values,
                formulas, and results. Exact Eurocode clause references shall be confirmed against
                the adopted edition and National Annex before issue.
              </p>
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">
                3.1 Geometry and section properties
              </h3>
              <p className="text-xs">
                Reference: EN 1997-1 pile geometry model and EN 1992-1-1 concrete section
                properties.
              </p>
              <Equation
                latex={`D=${project.diameter}\\,\\text{mm},\\quad A_b=${results.pileArea.toFixed(3)}\\,\\text{m}^2,\\quad u=${results.pilePerimeter.toFixed(3)}\\,\\text{m}`}
                tag="3.1.1"
              />
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">
                3.2 Effective stress by layer
              </h3>
              <p className="text-xs">
                Reference: EN 1997-1 effective-stress approach. Below groundwater, γ′ = γsat − γw; a
                minimum effective stress of 10 kPa is applied.
              </p>
              {results.layers.map((resultLayer) => {
                const layer = project.layers.find((item) => item.id === resultLayer.layerId);
                if (!layer) return null;
                const midpoint = layer.topDepth + resultLayer.effectiveLength / 2;
                const submergedGamma = Math.max(1, (layer.gammaSat ?? layer.gamma) - 9.81);
                const stress =
                  midpoint <= project.waterLevel
                    ? layer.gamma * midpoint
                    : layer.gamma * project.waterLevel +
                      submergedGamma * (midpoint - project.waterLevel);
                return (
                  <div
                    key={`stress-${resultLayer.layerId}`}
                    className="mt-3 border-l-2 border-[#b8863b] pl-4"
                  >
                    <p className="font-mono text-xs font-bold">
                      {resultLayer.layerId} · {layer.name}
                    </p>
                    <Equation
                      latex={`L_{eff}=${resultLayer.effectiveLength.toFixed(2)}\\,\\text{m},\\quad z_m=${midpoint.toFixed(2)}\\,\\text{m},\\quad \\sigma'_{v0}=${Math.max(10, stress).toFixed(1)}\\,\\text{kPa}`}
                      tag={`${resultLayer.layerId}.1`}
                    />
                    <p className="text-[11px] text-slate-600">
                      Inputs: γ = {layer.gamma} kN/m³, γ′ = {submergedGamma.toFixed(2)} kN/m³, GWL ={" "}
                      {project.waterLevel} m bgl.
                    </p>
                  </div>
                );
              })}
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">3.3 Shaft friction by layer</h3>
              <p className="text-xs">
                Reference: EN 1997-1 pile shaft resistance provisions. Alpha/beta correlations are
                preliminary and require geotechnical confirmation.
              </p>
              {results.layers.map((resultLayer) => {
                const layer = project.layers.find((item) => item.id === resultLayer.layerId);
                if (!layer) return null;
                const alpha = layer.cu <= 40 ? 0.55 : 0.45;
                const beta = 0.8 * Math.tan(((layer.phi * Math.PI) / 180) * 0.75);
                const alphaMethod = layer.method === "alpha" && layer.cu > 0;
                return (
                  <div
                    key={`shaft-detail-${resultLayer.layerId}`}
                    className="mt-3 border-l-2 border-cyan-700 pl-4"
                  >
                    <p className="font-mono text-xs font-bold">
                      {resultLayer.layerId} · {alphaMethod ? "Alpha / undrained" : "Beta / drained"}
                    </p>
                    <Equation
                      latex={
                        alphaMethod
                          ? `q_{s,k}=\\alpha c_u=${alpha.toFixed(2)}\\times${layer.cu}=${resultLayer.unitResistance.toFixed(2)}\\,\\text{kPa}`
                          : `\\beta=K\\tan(0.75\\varphi')=${beta.toFixed(3)},\\quad q_{s,k}=\\beta\\sigma'_{v0}=${resultLayer.unitResistance.toFixed(2)}\\,\\text{kPa}`
                      }
                      tag={`${resultLayer.layerId}.2`}
                    />
                    <Equation
                      latex={`R_{s,i}=q_{s,k}uL_{eff}=${resultLayer.shaftResistance.toFixed(1)}\\,\\text{kN}`}
                      tag={`${resultLayer.layerId}.3`}
                    />
                  </div>
                );
              })}
              <Equation
                latex={`R_{s,k}=\\sum R_{s,i}=${results.totalShaftResistance}\\,\\text{kN}`}
                tag="3.3.4"
              />
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">
                3.4 Toe resistance and design factor
              </h3>
              <p className="text-xs">
                Reference: EN 1997-1 pile base resistance and design resistance provisions. Confirm
                exact clause and National Annex values before issue.
              </p>
              <Equation
                latex={`q_{b,k}=${results.baseUnitResistance}\\,\\text{kPa},\\quad R_{b,k}=q_{b,k}A_b=${results.baseResistance}\\,\\text{kN}`}
                tag="3.4.1"
              />
              <Equation
                latex={`R_{c,k}=R_{s,k}+R_{b,k}=${results.totalCharacteristicResistance}\\,\\text{kN}`}
                tag="3.4.2"
              />
              <Equation
                latex={`R_{c,d}=R_{c,k}/\\gamma_R=${results.totalCharacteristicResistance}/${project.safetyFactor.toFixed(1)}=${results.designResistance}\\,\\text{kN}`}
                tag="3.4.3"
              />
              <Equation
                latex={`\\eta_{GEO}=N_{Ed}/R_{c,d}=${project.nEd}/${results.designResistance}=${Number.isFinite(results.utilizationGeotechnical) ? results.utilizationGeotechnical.toFixed(3) : "INPUT REQUIRED"}`}
                tag="3.4.4"
              />
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">3.5 Settlement verification</h3>
              <p className="text-xs">
                Reference: EN 1997-1 serviceability verification; soil settlement is the
                application&apos;s preliminary empirical estimate.
              </p>
              <Equation
                latex={`s_{elastic}=${results.settlementElastic}\\,\\text{mm},\\quad s_{soil}=${results.settlementSoil}\\,\\text{mm}`}
                tag="3.5.1"
              />
              <Equation
                latex={`s_{tot}=s_{elastic}+s_{soil}=${results.settlementTotal}\\,\\text{mm}\\leq${results.allowableSettlement}\\,\\text{mm}`}
                tag="3.5.2"
              />
              <h3 className="mt-6 text-lg font-bold text-[#173b5f]">
                3.6 RC axial resistance and reinforcement
              </h3>
              <p className="text-xs">
                Reference: EN 1992-1-1 concrete compression and reinforcement resistance provisions;
                exact clause to be confirmed for the adopted project edition.
              </p>
              <Equation
                latex={`f_{cd}=${(project.fck / 1.5).toFixed(2)}\\,\\text{MPa},\\quad f_{yd}=${(project.fyk / 1.15).toFixed(1)}\\,\\text{MPa}`}
                tag="3.6.1"
              />
              <Equation
                latex={`A_s=${project.numBars}\\pi(${project.barDiameter}/2)^2=${results.rebarArea}\\,\\text{mm}^2`}
                tag="3.6.2"
              />
              <Equation
                latex={`N_{Rd}=A_cf_{cd}+A_sf_{yd}=${results.structuralAxialResistance}\\,\\text{kN},\\quad \\eta_{RC}=${(results.utilizationStructural * 100).toFixed(1)}\\%`}
                tag="3.6.3"
              />
            </section>

            <section className="bg-[#f8f5ed] p-10">
              <h2 className="border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]">
                4. Soil Strata Schedule
              </h2>
              <table className="mt-5 w-full border border-slate-300 text-left font-mono text-[11px]">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="p-2">Layer</th>
                    <th className="p-2">Depth</th>
                    <th className="p-2">Material</th>
                    <th className="p-2">γ</th>
                    <th className="p-2">φ'</th>
                    <th className="p-2">cu</th>
                    <th className="p-2">
                      R<sub>s,k</sub>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.layers.map((layer) => (
                    <tr key={layer.layerId} className="border-t border-slate-300">
                      <td className="p-2">{layer.layerId}</td>
                      <td className="p-2">{layer.effectiveLength.toFixed(2)} m</td>
                      <td className="p-2">{layer.name}</td>
                      <td className="p-2">
                        {project.layers.find((item) => item.id === layer.layerId)?.gamma ?? "-"}
                      </td>
                      <td className="p-2">
                        {project.layers.find((item) => item.id === layer.layerId)?.phi ?? "-"}
                      </td>
                      <td className="p-2">
                        {project.layers.find((item) => item.id === layer.layerId)?.cu ?? "-"}
                      </td>
                      <td className="p-2">{layer.shaftResistance.toFixed(1)} kN</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
