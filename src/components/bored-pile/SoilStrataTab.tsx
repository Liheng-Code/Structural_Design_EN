import React, { useState, useMemo } from "react";
import { read, utils, write } from "xlsx";
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Copy,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Droplets,
  Anchor,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ruler,
  Grid,
} from "lucide-react";
import type { BoredPileProject, SoilLayerInput, BoredPileAnalysisResult } from "@/lib/bored-pile/types";
import {
  SOIL_PRESETS,
  createLayerFromPreset,
  diagnoseStratigraphy,
  autoAlignStratigraphy,
} from "@/lib/bored-pile/presets";
import { AddLayerDialog } from "./AddLayerDialog";
import { SoilTextureIcon } from "../SoilTextureIcon";

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

const emptyLayer = (index: number, topDepth: number): SoilLayerInput => ({
  id: `L${index}`,
  name: "Custom Soil Stratum",
  type: "custom",
  behaviorType: "custom",
  topDepth,
  bottomDepth: topDepth + 3,
  gamma: 18.5,
  gammaSat: 19.5,
  gammaEffective: 9.7,
  phi: 30,
  c: 0,
  cu: 0,
  sptN: 15,
  cptQc: 4,
  e50: 25000,
  eoed: 20000,
  eur: 75000,
  nu: 0.3,
  permeability: 1e-6,
  ocr: 1,
  initialVoidRatio: 0.7,
  compressionIndex: 0.18,
  recompressionIndex: 0.025,
  preconsolidationStress: 100,
  k0: 0.5,
  rInter: 0.7,
  characteristicShaftFriction: 30,
  characteristicBaseResistance: 1500,
  drainage: "drained",
  method: "beta",
});

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

function soilLayerColor(layer: SoilLayerInput): { fill: string; stroke: string; accent: string } {
  if (layer.behaviorType === "rock" || layer.type === "custom" && layer.name.toLowerCase().includes("rock")) {
    return { fill: "#3b2354", stroke: "#c084fc", accent: "#d8b4fe" };
  }
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained" || layer.behaviorType === "cohesive") {
    return { fill: "#1e293b", stroke: "#94a3b8", accent: "#cbd5e1" };
  }
  if (layer.type === "sand" || layer.type === "dense-sand" || layer.behaviorType === "granular") {
    return { fill: "#453216", stroke: "#eab308", accent: "#fef08a" };
  }
  if (layer.type === "fill") {
    return { fill: "#3a2d21", stroke: "#d97706", accent: "#fde68a" };
  }
  return { fill: "#16384c", stroke: "#38bdf8", accent: "#bae6fd" };
}

function soilPatternId(layer: SoilLayerInput): string {
  if (
    layer.behaviorType === "rock" ||
    (layer.type === "custom" && layer.name.toLowerCase().includes("rock"))
  )
    return "soil-pattern-rock";
  if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained" || layer.behaviorType === "cohesive")
    return "soil-pattern-clay";
  if (layer.type === "sand" || layer.type === "dense-sand" || layer.behaviorType === "granular")
    return "soil-pattern-sand";
  if (layer.type === "fill") return "soil-pattern-fill";
  return "soil-pattern-custom";
}

interface SoilStrataTabProps {
  project: BoredPileProject;
  setProject: React.Dispatch<React.SetStateAction<BoredPileProject>>;
  results: BoredPileAnalysisResult;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  soilMessage: string;
  setSoilMessage: (msg: string) => void;
}

export function SoilStrataTab({
  project,
  setProject,
  results,
  selectedLayerId,
  setSelectedLayerId,
  soilMessage,
  setSoilMessage,
}: SoilStrataTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedAdvancedCards, setExpandedAdvancedCards] = useState<Record<string, boolean>>({});
  const [showGroundwaterAndPressure, setShowGroundwaterAndPressure] = useState(true);
  const [showLegendDrawer, setShowLegendDrawer] = useState(false);

  // Dynamic Auto-Scaling State for Ground Cross-Section
  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);
  const [autoScaleMode, setAutoScaleMode] = useState<"fit-all" | "fit-pile" | "fit-strata">("fit-all");
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [scaleNotification, setScaleNotification] = useState<string | null>(null);

  // Vertical Depth Axis Ruler Settings
  const [rulerIntervalMode, setRulerIntervalMode] = useState<"auto" | "1m" | "5m">("auto");
  const [rulerDisplayMode, setRulerDisplayMode] = useState<"dual" | "depth" | "elevation">("dual");
  const [showRulerGridlines, setShowRulerGridlines] = useState(true);
  const [hoverProbeDepth, setHoverProbeDepth] = useState<number | null>(null);

  // Stratigraphy diagnostics
  const diagnostic = useMemo(() => diagnoseStratigraphy(project.layers), [project.layers]);

  // Toe founding layer info
  const toeLayer = useMemo(() => {
    return (
      project.layers.find(
        (l) => project.length >= l.topDepth && project.length <= l.bottomDepth,
      ) || project.layers[project.layers.length - 1]
    );
  }, [project.layers, project.length]);

  // Dynamic profile extents calculation for auto-scaling
  const profileExtents = useMemo(() => {
    const layerDepths = project.layers.flatMap((l) => [l.topDepth, l.bottomDepth]);
    const maxLayer = layerDepths.length > 0 ? Math.max(...layerDepths) : 0;
    const pileToe = project.length;
    const waterLevel = Math.max(0, project.waterLevel);

    let rawTargetDepth = maxLayer;
    if (autoScaleMode === "fit-all") {
      rawTargetDepth = Math.max(maxLayer, pileToe, waterLevel, 4);
    } else if (autoScaleMode === "fit-pile") {
      rawTargetDepth = Math.max(pileToe, 4);
    } else if (autoScaleMode === "fit-strata") {
      rawTargetDepth = Math.max(maxLayer, 4);
    }

    // Dynamic clearance cushion at bottom to guarantee toe tags, stratum labels, and ticks never clip
    const bottomCushion = Math.max(1.8, rawTargetDepth * 0.08);
    const autoDepth = Math.max(6, Math.round((rawTargetDepth + bottomCushion) * 10) / 10);

    const effectiveMaxDepth = autoScaleEnabled
      ? autoDepth
      : Math.max(3, Math.round((autoDepth / zoomFactor) * 10) / 10);

    return {
      rawTargetDepth,
      maxLayer,
      pileToe,
      waterLevel,
      autoDepth,
      effectiveMaxDepth,
      bottomCushion,
    };
  }, [project.layers, project.length, project.waterLevel, autoScaleMode, autoScaleEnabled, zoomFactor]);

  // Track profile depth changes to trigger live auto-scale visual confirmation
  const lastAutoDepthRef = React.useRef(profileExtents.autoDepth);
  React.useEffect(() => {
    if (profileExtents.autoDepth !== lastAutoDepthRef.current) {
      const diff = profileExtents.autoDepth - lastAutoDepthRef.current;
      lastAutoDepthRef.current = profileExtents.autoDepth;
      if (autoScaleEnabled) {
        setScaleNotification(
          `Auto-scaled: ${profileExtents.effectiveMaxDepth.toFixed(1)}m profile (${diff > 0 ? "+" : ""}${diff.toFixed(1)}m adjustment)`
        );
        const timer = setTimeout(() => setScaleNotification(null), 3200);
        return () => clearTimeout(timer);
      }
    }
  }, [profileExtents.autoDepth, profileExtents.effectiveMaxDepth, autoScaleEnabled]);

  const maxProfileDepth = useMemo(() => {
    return Math.max(
      project.length + 2,
      ...project.layers.map((l) => l.bottomDepth),
      10,
    );
  }, [project.layers, project.length]);

  const toggleExpandAdvanced = (id: string) => {
    setExpandedAdvancedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddLayerFromDialog = (newLayer: SoilLayerInput) => {
    setProject((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
    setSelectedLayerId(newLayer.id);
    setSoilMessage(`Stratum ${newLayer.id} (${newLayer.name}) added to ground model.`);
  };

  const handleQuickAddPreset = (presetId: string) => {
    const preset = SOIL_PRESETS.find((p) => p.id === presetId) || SOIL_PRESETS[0];
    const lastLayer = project.layers[project.layers.length - 1];
    const nextTop = lastLayer ? Math.round(lastLayer.bottomDepth * 100) / 100 : 0;
    const newLayer = createLayerFromPreset(
      preset,
      project.layers.length + 1,
      nextTop,
      preset.defaultThickness,
    );
    setProject((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
    setSelectedLayerId(newLayer.id);
    setSoilMessage(`Added ${preset.name} (${newLayer.topDepth}m to ${newLayer.bottomDepth}m)`);
  };

  const handleAutoAlign = () => {
    const aligned = autoAlignStratigraphy(project.layers);
    setProject((prev) => ({
      ...prev,
      layers: aligned,
    }));
    setSoilMessage("All strata depth boundaries successfully aligned from ground surface (0.0 m).");
  };

  const handleUpdateLayer = (index: number, patch: Partial<SoilLayerInput>) => {
    setProject((prev) => ({
      ...prev,
      layers: prev.layers.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  };

  const handleThicknessChange = (index: number, newThickness: number) => {
    const safeT = Math.max(0.1, newThickness);
    const layer = project.layers[index];
    const newBottom = Math.round((layer.topDepth + safeT) * 100) / 100;
    handleUpdateLayer(index, { bottomDepth: newBottom });
  };

  const handleMoveLayer = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= project.layers.length) return;
    const reordered = [...project.layers];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    // Reassign IDs and auto align depths to keep model continuous
    const reIndexed = reordered.map((l, i) => ({ ...l, id: `L${i + 1}` }));
    setProject((prev) => ({ ...prev, layers: autoAlignStratigraphy(reIndexed) }));
    setSoilMessage(`Reordered stratum ${temp.name}. Depths adjusted automatically.`);
  };

  const handleDuplicateLayer = (index: number) => {
    const target = project.layers[index];
    const thickness = Math.max(1.0, target.bottomDepth - target.topDepth);
    const lastLayer = project.layers[project.layers.length - 1];
    const newTop = lastLayer ? lastLayer.bottomDepth : 0;
    const duplicated: SoilLayerInput = {
      ...target,
      id: `L${project.layers.length + 1}`,
      name: `${target.name} (Copy)`,
      topDepth: newTop,
      bottomDepth: newTop + thickness,
    };
    setProject((prev) => ({
      ...prev,
      layers: [...prev.layers, duplicated],
    }));
    setSoilMessage(`Duplicated stratum ${target.name}.`);
  };

  const handleDeleteLayer = (index: number) => {
    if (project.layers.length <= 1) {
      setSoilMessage("Cannot delete the only remaining stratum.");
      return;
    }
    const filtered = project.layers.filter((_, i) => i !== index);
    const reIndexed = filtered.map((l, i) => ({ ...l, id: `L${i + 1}` }));
    setProject((prev) => ({
      ...prev,
      layers: autoAlignStratigraphy(reIndexed),
    }));
    setSoilMessage("Stratum deleted and remaining layers re-aligned.");
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Top Banner & Geotechnical HUD */}
      <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-900/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-white tracking-wide">
                Borehole Stratigraphy & Soil Model
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[11px] font-bold">
                EN 1997-1 EC7
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Layered geotechnical profile with intuitive presets, live cross-section, and dual card/table views
            </p>
          </div>

          {/* Import / Export actions */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/80 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 transition cursor-pointer">
              <Upload className="size-3.5" />
              <span>Import Excel / CSV</span>
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
                    setSoilMessage(`${layers.length} stratum/strata imported from ${file.name}`);
                  } catch (error) {
                    setSoilMessage(
                      error instanceof Error ? error.message : "Could not read the soil file.",
                    );
                  }
                  event.target.value = "";
                }}
              />
            </label>

            <button
              onClick={() => downloadV2Template(project.layers)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0c1c30] border border-cyan-800/80 text-cyan-200 hover:bg-cyan-900/60 transition"
              title="Download standardized Excel template compatible with EC7 geotechnical design"
            >
              <Download className="size-3.5 text-cyan-400" />
              <span>Excel Template</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 transition"
            >
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Diagnostic alert banner if gaps/overlaps exist */}
        {(diagnostic.hasGaps || diagnostic.hasOverlaps) && (
          <div className="mb-4 rounded-xl border border-amber-500/50 bg-amber-950/40 p-3.5 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Stratum Boundary Discontinuity Detected:</strong>
                <p className="text-[11px] text-amber-200/90 mt-0.5">
                  {diagnostic.issues[0]?.message} (Total {diagnostic.issues.length} issue(s)). Strata should be continuous for accurate geotechnical shaft resistance integration.
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoAlign}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="size-3.5" />
              <span>Auto-Align All Depths</span>
            </button>
          </div>
        )}

        {/* Soil Message toast */}
        {soilMessage && (
          <div className="mb-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2.5 font-mono text-xs text-cyan-200 flex items-center justify-between">
            <span>{soilMessage}</span>
            <button
              onClick={() => setSoilMessage("")}
              className="text-cyan-400 hover:text-white ml-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* 4 Summary Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {/* Tile 1: Strata Count & Status */}
          <div className="p-3.5 rounded-xl bg-[#040a14] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ground Strata</p>
              <p className="text-lg font-bold text-white mt-0.5">
                {project.layers.length} <span className="text-xs text-cyan-400 font-normal">layers defined</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Total Depth: {maxProfileDepth.toFixed(1)} m</p>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Layers className="size-5" />
            </div>
          </div>

          {/* Tile 2: Groundwater Level with quick edit */}
          <div className="p-3.5 rounded-xl bg-[#040a14] border border-cyan-900/60 flex items-center justify-between">
            <div className="flex-1 mr-2">
              <p className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Droplets className="size-3 text-cyan-400" />
                Groundwater Table (GWL)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={project.waterLevel}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      waterLevel: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-20 bg-[#071324] border border-cyan-600 rounded px-2 py-1 text-base font-bold text-cyan-200 outline-none"
                />
                <span className="text-xs text-slate-400">m bgl</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Effective stress active below GWL</p>
            </div>
          </div>

          {/* Tile 3: Pile Toe Founding Stratum */}
          <div className="p-3.5 rounded-xl bg-[#040a14] border border-amber-900/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Anchor className="size-3 text-amber-400" />
                Pile Toe Founding Layer
              </p>
              <p className="text-sm font-bold text-amber-200 mt-0.5 line-clamp-1">
                {toeLayer?.id} · {toeLayer?.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Toe @ {project.length.toFixed(1)} m • qb,k = {toeLayer ? (toeLayer.characteristicBaseResistance || 1500) : 0} kPa
              </p>
            </div>
          </div>

          {/* Tile 4: Geotechnical Shaft Contribution preview */}
          <div className="p-3.5 rounded-xl bg-[#040a14] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Shaft Resistance (R_s,k)</p>
              <p className="text-lg font-bold text-cyan-300 mt-0.5">
                {results.totalShaftResistance} <span className="text-xs text-cyan-400">kN</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Base R_b,k: {results.baseResistance} kN</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
        </div>

        {/* Quick Stratum Creation & Toolbar */}
        <div className="mt-5 pt-4 border-t border-cyan-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Main Add Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg transition shadow-cyan-900/30"
            >
              <Plus className="size-4" />
              <span>Add Soil Stratum</span>
            </button>

            {/* Quick 1-click Preset Adders */}
            <span className="text-slate-500 text-[11px] ml-1 mr-0.5 hidden sm:inline">Quick Add:</span>
            <button
              onClick={() => handleQuickAddPreset("soft-clay")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 transition text-[11px] cursor-pointer"
              title="Add soft cohesive clay stratum with cross-hatch texture"
            >
              <SoilTextureIcon layerOrType="clay" size="xs" />
              <span>+ Soft Clay</span>
            </button>
            <button
              onClick={() => handleQuickAddPreset("stiff-clay")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/60 text-sky-300 transition text-[11px] cursor-pointer"
              title="Add stiff cohesive clay stratum with cross-hatch texture"
            >
              <SoilTextureIcon layerOrType="clay" size="xs" />
              <span>+ Stiff Clay</span>
            </button>
            <button
              onClick={() => handleQuickAddPreset("medium-sand")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-700/60 text-yellow-300 transition text-[11px] cursor-pointer"
              title="Add medium sand stratum with stippled grain texture"
            >
              <SoilTextureIcon layerOrType="sand" size="xs" />
              <span>+ Med Sand</span>
            </button>
            <button
              onClick={() => handleQuickAddPreset("dense-gravel")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/80 border border-orange-700/60 text-orange-300 transition text-[11px] cursor-pointer"
              title="Add dense gravel/coarse stratum with rounded pebble texture"
            >
              <SoilTextureIcon layerOrType="gravel" size="xs" />
              <span>+ Dense Sand</span>
            </button>
            <button
              onClick={() => handleQuickAddPreset("weathered-rock")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 text-purple-300 transition text-[11px] cursor-pointer"
              title="Add competent bedrock stratum with joint fracture texture"
            >
              <SoilTextureIcon layerOrType="rock" size="xs" />
              <span>+ Bedrock</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 bg-[#040a14] border border-slate-800 rounded-lg p-1 font-mono text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === "cards"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Stratum Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === "table"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TableIcon className="size-3.5" />
              <span>Spreadsheet Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Editor on Left, Cross-Section on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(540px,1.15fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(620px,1.25fr)] gap-6 items-start">
        {/* LEFT COLUMN: Stratum Cards or Table */}
        <div className="space-y-4">
          {viewMode === "cards" ? (
            /* CARD VIEW */
            project.layers.map((layer, index) => {
              const isSelected = selectedLayerId === layer.id;
              const isExpanded = !!expandedAdvancedCards[layer.id];
              const thickness = Math.round((layer.bottomDepth - layer.topDepth) * 100) / 100;
              const isToeHere = project.length >= layer.topDepth && project.length <= layer.bottomDepth;
              const isCohesive = layer.behaviorType === "cohesive";
              const colors = soilLayerColor(layer);

              // Shaft resistance contribution for this layer
              const layerRes = results.layers.find((l) => l.layerId === layer.id);

              return (
                <div
                  key={layer.id}
                  id={`stratum-card-${layer.id}`}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`rounded-2xl border transition-all duration-200 bg-[#081222]/95 p-5 ${
                    isSelected
                      ? "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/40"
                      : "border-slate-800/90 hover:border-slate-700"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                      {/* Representative Soil Texture Icon (Sand grains, clay cross-hatch, etc.) */}
                      <SoilTextureIcon layerOrType={layer} size="md" />

                      <span
                        className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold shrink-0 border"
                        style={{
                          backgroundColor: colors.fill,
                          borderColor: colors.stroke,
                          color: colors.accent,
                        }}
                      >
                        {layer.id}
                      </span>
                      <input
                        value={layer.name}
                        onChange={(e) => handleUpdateLayer(index, { name: e.target.value })}
                        className="min-w-0 flex-1 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 px-1 py-0.5 font-display font-semibold text-white text-sm outline-none transition"
                      />
                    </div>

                    {/* Header Badges & Actions */}
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {isToeHere && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-600/70 text-amber-300 text-[10px] font-bold">
                          TOE FOUNDING
                        </span>
                      )}

                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          backgroundColor: `${colors.fill}99`,
                          borderColor: colors.stroke,
                          color: colors.accent,
                        }}
                      >
                        {layer.behaviorType?.toUpperCase() || "CUSTOM"} ·{" "}
                        {layer.method === "alpha" ? "α-METHOD" : "β-METHOD"}
                      </span>

                      {/* Reorder Up */}
                      <button
                        title="Move stratum up"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayer(index, "up");
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        title="Move stratum down"
                        disabled={index === project.layers.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayer(index, "down");
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        title="Duplicate stratum"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateLayer(index);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/60 transition"
                      >
                        <Copy className="size-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        title="Delete stratum"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayer(index);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/60 transition"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Depth and Thickness Controls */}
                  <div className="bg-[#040a14] border border-slate-800/80 rounded-xl p-3 mb-4">
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">
                          Top Depth (m)
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          value={layer.topDepth}
                          onChange={(e) => {
                            const newTop = parseFloat(e.target.value) || 0;
                            handleUpdateLayer(index, { topDepth: newTop });
                          }}
                          className="w-full bg-[#071324] border border-slate-700 rounded px-2.5 py-1.5 text-white font-semibold outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] text-cyan-400 uppercase mb-1 font-bold">
                          Thickness (m)
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={thickness}
                          onChange={(e) => handleThicknessChange(index, parseFloat(e.target.value) || 0.1)}
                          className="w-full bg-[#071324] border border-cyan-600 rounded px-2.5 py-1.5 text-cyan-200 font-semibold outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase mb-1">
                          Bottom Depth (m)
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          value={layer.bottomDepth}
                          onChange={(e) => {
                            const newBottom = parseFloat(e.target.value) || 0;
                            handleUpdateLayer(index, { bottomDepth: newBottom });
                          }}
                          className="w-full bg-[#071324] border border-slate-700 rounded px-2.5 py-1.5 text-white font-semibold outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Layer Shaft Contribution info */}
                    {layerRes && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          Effective Embedment:{" "}
                          <strong className="text-cyan-300">{layerRes.effectiveLength.toFixed(1)} m</strong>
                        </span>
                        <span className="text-slate-400">
                          Shaft Contribution R_s,i:{" "}
                          <strong className="text-emerald-400">{layerRes.shaftResistance} kN</strong> (qs = {layerRes.unitResistance.toFixed(1)} kPa)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Core Geotechnical Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 font-mono text-xs">
                    {/* Unit weights */}
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase mb-1">
                        γ Bulk (kN/m³)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        value={layer.gamma}
                        onChange={(e) =>
                          handleUpdateLayer(index, { gamma: parseFloat(e.target.value) || 18 })
                        }
                        className="w-full bg-[#040a14] border border-slate-700 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase mb-1">
                        γ Sat (kN/m³)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        value={layer.gammaSat ?? layer.gamma + 1}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 19;
                          handleUpdateLayer(index, {
                            gammaSat: val,
                            gammaEffective: val - 9.81,
                          });
                        }}
                        className="w-full bg-[#040a14] border border-slate-700 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Strength parameter */}
                    {isCohesive ? (
                      <div>
                        <span className="block text-[10px] text-cyan-300 uppercase mb-1 font-bold">
                          cu Strength (kPa)
                        </span>
                        <input
                          type="number"
                          step="5"
                          min="0"
                          value={layer.cu}
                          onChange={(e) =>
                            handleUpdateLayer(index, { cu: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-[#040a14] border border-cyan-600 rounded px-2 py-1.5 text-cyan-200 outline-none focus:border-cyan-400"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="block text-[10px] text-amber-300 uppercase mb-1 font-bold">
                          φ' Friction (deg)
                        </span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="50"
                          value={layer.phi}
                          onChange={(e) =>
                            handleUpdateLayer(index, { phi: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-[#040a14] border border-amber-600 rounded px-2 py-1.5 text-amber-200 outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}

                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase mb-1">
                        SPT N-Value
                      </span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={layer.sptN ?? 0}
                        onChange={(e) =>
                          handleUpdateLayer(index, { sptN: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#040a14] border border-slate-700 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase mb-1">
                        Behavior
                      </span>
                      <select
                        value={layer.behaviorType || "custom"}
                        onChange={(e) => {
                          const val = e.target.value as SoilLayerInput["behaviorType"];
                          handleUpdateLayer(index, {
                            behaviorType: val,
                            drainage: val === "cohesive" ? "undrained" : "drained",
                            method: val === "cohesive" ? "alpha" : "beta",
                          });
                        }}
                        className="w-full bg-[#040a14] border border-slate-700 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                      >
                        <option value="cohesive">Cohesive</option>
                        <option value="granular">Granular</option>
                        <option value="rock">Rock</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase mb-1">
                        Method
                      </span>
                      <select
                        value={layer.method}
                        onChange={(e) =>
                          handleUpdateLayer(index, {
                            method: e.target.value as SoilLayerInput["method"],
                          })
                        }
                        className="w-full bg-[#040a14] border border-slate-700 rounded px-2 py-1.5 text-white outline-none focus:border-cyan-400"
                      >
                        <option value="alpha">α-method</option>
                        <option value="beta">β-method</option>
                        <option value="empirical">Empirical</option>
                      </select>
                    </div>
                  </div>

                  {/* Collapsible Advanced Parameters */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => toggleExpandAdvanced(layer.id)}
                      className="flex items-center justify-between w-full text-slate-400 hover:text-cyan-300 font-mono text-[11px] py-1 transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <SlidersHorizontal className="size-3.5 text-cyan-400" />
                        <span>Advanced Geotechnical & Settlement Parameters (E50, Eoed, OCR, K0...)</span>
                      </span>
                      {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#040a14] border border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 font-mono text-xs">
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            E50 (MPa)
                          </span>
                          <input
                            type="number"
                            step="1"
                            value={layer.e50 ? layer.e50 / 1000 : ""}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                e50: (parseFloat(e.target.value) || 0) * 1000,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            Eoed (MPa)
                          </span>
                          <input
                            type="number"
                            step="1"
                            value={layer.eoed ? layer.eoed / 1000 : ""}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                eoed: (parseFloat(e.target.value) || 0) * 1000,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            Eur (MPa)
                          </span>
                          <input
                            type="number"
                            step="1"
                            value={layer.eur ? layer.eur / 1000 : ""}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                eur: (parseFloat(e.target.value) || 0) * 1000,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            Poisson's ν
                          </span>
                          <input
                            type="number"
                            step="0.02"
                            value={layer.nu ?? 0.3}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                nu: parseFloat(e.target.value) || 0.3,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            OCR
                          </span>
                          <input
                            type="number"
                            step="0.2"
                            value={layer.ocr ?? 1}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                ocr: parseFloat(e.target.value) || 1,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">K0</span>
                          <input
                            type="number"
                            step="0.05"
                            value={layer.k0 ?? 0.5}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                k0: parseFloat(e.target.value) || 0.5,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            qs,k Char (kPa)
                          </span>
                          <input
                            type="number"
                            step="5"
                            value={layer.characteristicShaftFriction ?? 0}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                characteristicShaftFriction: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            qb,k Base (kPa)
                          </span>
                          <input
                            type="number"
                            step="50"
                            value={layer.characteristicBaseResistance ?? 0}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                characteristicBaseResistance: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            Rinter Factor
                          </span>
                          <input
                            type="number"
                            step="0.05"
                            value={layer.rInter ?? 0.7}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                rInter: parseFloat(e.target.value) || 0.7,
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase mb-1">
                            Drainage
                          </span>
                          <select
                            value={layer.drainage ?? "drained"}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                drainage: e.target.value as SoilLayerInput["drainage"],
                              })
                            }
                            className="w-full bg-[#071324] border border-slate-700 rounded px-2 py-1 text-white"
                          >
                            <option value="drained">Drained</option>
                            <option value="undrained">Undrained</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* TABLE / SPREADSHEET VIEW */
            <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-4 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cyan-900/60 text-[11px] text-cyan-300">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">Stratum Description</th>
                    <th className="py-2.5 px-2">Top (m)</th>
                    <th className="py-2.5 px-2">Bottom (m)</th>
                    <th className="py-2.5 px-2">Thick (m)</th>
                    <th className="py-2.5 px-2">Behavior</th>
                    <th className="py-2.5 px-2">γ (kN/m³)</th>
                    <th className="py-2.5 px-2">cu (kPa)</th>
                    <th className="py-2.5 px-2">φ' (deg)</th>
                    <th className="py-2.5 px-2">SPT N</th>
                    <th className="py-2.5 px-2">E50 (MPa)</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {project.layers.map((layer, index) => {
                    const thickness = Math.round((layer.bottomDepth - layer.topDepth) * 100) / 100;
                    const isSelected = selectedLayerId === layer.id;
                    const colors = soilLayerColor(layer);
                    return (
                      <tr
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`hover:bg-slate-900/60 cursor-pointer ${
                          isSelected ? "bg-cyan-950/40" : ""
                        }`}
                      >
                        <td className="py-2 px-2 font-bold whitespace-nowrap" style={{ color: colors.stroke }}>
                          <div className="flex items-center gap-1.5">
                            <SoilTextureIcon layerOrType={layer} size="xs" />
                            <span>{layer.id}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            value={layer.name}
                            onChange={(e) => handleUpdateLayer(index, { name: e.target.value })}
                            className="bg-transparent border-b border-slate-700 hover:border-cyan-400 px-1 py-0.5 text-white w-full outline-none"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.1"
                            value={layer.topDepth}
                            onChange={(e) =>
                              handleUpdateLayer(index, { topDepth: parseFloat(e.target.value) || 0 })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-white w-16"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.1"
                            value={layer.bottomDepth}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                bottomDepth: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-white w-16"
                          />
                        </td>
                        <td className="py-2 px-2 text-cyan-300 font-semibold">{thickness}</td>
                        <td className="py-2 px-2">
                          <select
                            value={layer.behaviorType ?? "custom"}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                behaviorType: e.target.value as SoilLayerInput["behaviorType"],
                                drainage: e.target.value === "cohesive" ? "undrained" : "drained",
                                method: e.target.value === "cohesive" ? "alpha" : "beta",
                              })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1 py-0.5 text-white text-[11px]"
                          >
                            <option value="cohesive">Cohesive</option>
                            <option value="granular">Granular</option>
                            <option value="rock">Rock</option>
                            <option value="custom">Custom</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.1"
                            value={layer.gamma}
                            onChange={(e) =>
                              handleUpdateLayer(index, { gamma: parseFloat(e.target.value) || 18 })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-white w-16"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="5"
                            value={layer.cu}
                            onChange={(e) =>
                              handleUpdateLayer(index, { cu: parseFloat(e.target.value) || 0 })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-cyan-200 w-16"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="1"
                            value={layer.phi}
                            onChange={(e) =>
                              handleUpdateLayer(index, { phi: parseFloat(e.target.value) || 0 })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-amber-200 w-14"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="1"
                            value={layer.sptN ?? 0}
                            onChange={(e) =>
                              handleUpdateLayer(index, { sptN: parseFloat(e.target.value) || 0 })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-white w-14"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="1"
                            value={layer.e50 ? layer.e50 / 1000 : ""}
                            onChange={(e) =>
                              handleUpdateLayer(index, {
                                e50: (parseFloat(e.target.value) || 0) * 1000,
                              })
                            }
                            className="bg-[#040a14] border border-slate-700 rounded px-1.5 py-0.5 text-white w-16"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              title="Move up"
                              disabled={index === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(index, "up");
                              }}
                              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
                            >
                              <ArrowUp className="size-3" />
                            </button>
                            <button
                              title="Move down"
                              disabled={index === project.layers.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(index, "down");
                              }}
                              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
                            >
                              <ArrowDown className="size-3" />
                            </button>
                            <button
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLayer(index);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/60"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Stratum Creation Bottom Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#081222]/90 border border-slate-800/80 font-mono text-xs">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow transition"
            >
              <Plus className="size-4" />
              <span>Add New Soil Stratum</span>
            </button>

            <button
              onClick={handleAutoAlign}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#040a14] border border-cyan-800/80 text-cyan-300 hover:bg-cyan-950 transition"
              title="Ensure all stratum top and bottom depths connect without gaps or overlaps"
            >
              <Sparkles className="size-3.5 text-cyan-400" />
              <span>Auto-Align All Stratum Boundaries</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Stratigraphy Cross-Section */}
        <aside className="xl:sticky xl:top-6 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-3">
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                Interactive Ground Cross-Section
              </h3>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                Live geotechnical stratigraphy • Click stratum to inspect & highlight
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono text-[10px] font-bold animate-pulse">
              LIVE PREVIEW
            </span>
          </div>

          {/* Interactive Legend & View Controls Toolbar with Auto-Scale Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950 pb-3 mb-3">
            {/* Left Group: Groundwater Table & Pore Pressure (u) Toggle */}
            <button
              type="button"
              id="toggle-gwl-pore-pressure"
              onClick={() => setShowGroundwaterAndPressure((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all border cursor-pointer select-none ${
                showGroundwaterAndPressure
                  ? "bg-cyan-950/80 hover:bg-cyan-900/90 border-cyan-400/80 text-cyan-100 shadow-[0_0_14px_rgba(6,182,212,0.25)]"
                  : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title={
                showGroundwaterAndPressure
                  ? "Click to hide groundwater table (GWL) and pore water pressure (u) indicators to reduce visual clutter"
                  : "Click to show groundwater table (GWL) and pore water pressure (u) indicators"
              }
            >
              <div className="flex items-center gap-1.5">
                <Droplets
                  className={`size-3.5 ${
                    showGroundwaterAndPressure ? "text-cyan-400" : "text-slate-500 opacity-60"
                  }`}
                />
                <span className="font-semibold">Water Table & Pore Pressure (u):</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${
                  showGroundwaterAndPressure
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    showGroundwaterAndPressure
                      ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse"
                      : "bg-slate-500"
                  }`}
                />
                {showGroundwaterAndPressure ? "SHOWN" : "HIDDEN (CLUTTER-FREE)"}
              </span>
            </button>

            {/* Right Group: Dynamic Auto-Scaling and View Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Auto-Scale Toggle Button */}
              <button
                type="button"
                id="toggle-auto-scale"
                onClick={() => {
                  setAutoScaleEnabled((prev) => !prev);
                  if (!autoScaleEnabled) {
                    setZoomFactor(1.0);
                    setScaleNotification(`Auto-scale re-enabled: dynamic fit active (${profileExtents.effectiveMaxDepth.toFixed(1)}m)`);
                    setTimeout(() => setScaleNotification(null), 3000);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs transition border cursor-pointer ${
                  autoScaleEnabled && zoomFactor === 1.0
                    ? "bg-emerald-950/80 hover:bg-emerald-900/80 border-emerald-500/80 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300"
                }`}
                title={
                  autoScaleEnabled
                    ? "Auto-Scale is active: view scale adjusts dynamically as layers are added or depths change to keep entire profile visible"
                    : "Click to re-enable dynamic auto-scaling to fit entire profile"
                }
              >
                <Maximize2 className={`size-3.5 ${autoScaleEnabled && zoomFactor === 1.0 ? "text-emerald-400" : "text-slate-400"}`} />
                <span className="font-semibold">Auto-Scale:</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    autoScaleEnabled && zoomFactor === 1.0
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {autoScaleEnabled && zoomFactor === 1.0 ? "DYNAMIC FIT" : "MANUAL"}
                </span>
              </button>

              {/* Fit Scope Segmented Selector */}
              <div className="inline-flex items-center rounded-xl bg-slate-950/90 border border-slate-800 p-0.5 font-mono text-xs">
                <button
                  type="button"
                  id="autoscale-mode-fit-all"
                  onClick={() => {
                    setAutoScaleMode("fit-all");
                    setAutoScaleEnabled(true);
                    setZoomFactor(1.0);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    autoScaleMode === "fit-all" && autoScaleEnabled && zoomFactor === 1.0
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Fit entire geotechnical ground profile (all soil strata, pile embedment, water table)"
                >
                  Fit All
                </button>
                <button
                  type="button"
                  id="autoscale-mode-fit-strata"
                  onClick={() => {
                    setAutoScaleMode("fit-strata");
                    setAutoScaleEnabled(true);
                    setZoomFactor(1.0);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    autoScaleMode === "fit-strata" && autoScaleEnabled && zoomFactor === 1.0
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Fit view scale to deepest soil stratum boundary"
                >
                  Strata
                </button>
                <button
                  type="button"
                  id="autoscale-mode-fit-pile"
                  onClick={() => {
                    setAutoScaleMode("fit-pile");
                    setAutoScaleEnabled(true);
                    setZoomFactor(1.0);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    autoScaleMode === "fit-pile" && autoScaleEnabled && zoomFactor === 1.0
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Fit view scale to pile embedment toe depth"
                >
                  Pile Toe
                </button>
              </div>

              {/* Zoom In / Zoom Out / Reset Controls */}
              <div className="inline-flex items-center gap-1 rounded-xl bg-slate-950/90 border border-slate-800 p-1">
                <button
                  type="button"
                  id="btn-zoom-in"
                  onClick={() => {
                    setAutoScaleEnabled(false);
                    setZoomFactor((prev) => Math.min(3.0, Math.round((prev + 0.15) * 100) / 100));
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <span
                  className="text-[10px] font-mono text-cyan-300 px-1 font-bold min-w-[34px] text-center"
                  title="Current Zoom Level"
                >
                  {Math.round(zoomFactor * 100)}%
                </span>
                <button
                  type="button"
                  id="btn-zoom-out"
                  onClick={() => {
                    setAutoScaleEnabled(false);
                    setZoomFactor((prev) => Math.max(0.4, Math.round((prev - 0.15) * 100) / 100));
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                {(!autoScaleEnabled || zoomFactor !== 1.0) && (
                  <button
                    type="button"
                    id="btn-reset-zoom"
                    onClick={() => {
                      setAutoScaleEnabled(true);
                      setZoomFactor(1.0);
                      setAutoScaleMode("fit-all");
                      setScaleNotification("Reset to 100% Dynamic Auto-Fit");
                      setTimeout(() => setScaleNotification(null), 2500);
                    }}
                    className="p-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 transition ml-0.5 cursor-pointer"
                    title="Reset to Full Auto-Fit Profile"
                  >
                    <RotateCcw className="size-3" />
                  </button>
                )}
              </div>

              {/* Expandable Symbol & Strata Legend Drawer Button */}
              <button
                type="button"
                id="toggle-cross-section-legend-drawer"
                onClick={() => setShowLegendDrawer((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs transition border cursor-pointer ${
                  showLegendDrawer
                    ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title="View full cross-section geotechnical symbols, patterns, and strata legend"
              >
                <Info className="size-3.5 text-indigo-400" />
                <span>Legend</span>
                <ChevronDown
                  className={`size-3 text-slate-400 transition-transform duration-200 ${
                    showLegendDrawer ? "rotate-180 text-indigo-300" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Interactive Geotechnical Cross-Section Legend Panel */}
          {showLegendDrawer && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#030914] border border-indigo-500/40 font-mono text-xs shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-indigo-950 pb-2 mb-2.5">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Info className="size-3.5 text-indigo-400" />
                  Geotechnical Cross-Section Legend & Overlays
                </span>
                <span className="text-[10px] text-slate-400">Click GWL to toggle display</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {/* Legend Item 1: Ground Level */}
                <div className="flex items-center gap-2 p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <svg width="28" height="14" className="shrink-0">
                    <line x1="2" y1="7" x2="26" y2="7" stroke="#f8fafc" strokeWidth="2.5" />
                  </svg>
                  <div>
                    <span className="font-bold text-slate-200">Ground Surface (GL)</span>
                    <p className="text-[10px] text-slate-500">Elevation 0.00 m bgl</p>
                  </div>
                </div>

                {/* Legend Item 2: Bored Pile Shaft */}
                <div className="flex items-center gap-2 p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <svg width="28" height="14" className="shrink-0">
                    <rect x="4" y="2" width="20" height="10" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="1.5" />
                    <line x1="8" y1="2" x2="16" y2="12" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="16" y1="2" x2="8" y2="12" stroke="#22d3ee" strokeWidth="0.8" />
                  </svg>
                  <div>
                    <span className="font-bold text-cyan-300">Bored Pile Shaft</span>
                    <p className="text-[10px] text-slate-500">D = {project.diameter}mm, N_Ed = {project.nEd}kN</p>
                  </div>
                </div>

                {/* Legend Item 3: Founding Toe Elevation */}
                <div className="flex items-center gap-2 p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <svg width="28" height="14" className="shrink-0">
                    <line x1="2" y1="7" x2="26" y2="7" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
                    <polygon points="14,3 10,11 18,11" fill="#fbbf24" />
                  </svg>
                  <div>
                    <span className="font-bold text-amber-300">Founding Toe Elevation</span>
                    <p className="text-[10px] text-slate-500">Toe -{project.length.toFixed(2)} m (Base stratum)</p>
                  </div>
                </div>

                {/* Legend Item 4: Groundwater Table & Pore Pressure (Interactive Toggle in Legend) */}
                <div
                  onClick={() => setShowGroundwaterAndPressure((prev) => !prev)}
                  className={`flex items-center justify-between gap-2 p-1.5 rounded border transition-all cursor-pointer select-none ${
                    showGroundwaterAndPressure
                      ? "bg-cyan-950/60 border-cyan-500/60 hover:bg-cyan-900/60"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80 opacity-60"
                  }`}
                  title="Click to toggle groundwater and pore pressure indicators on/off"
                >
                  <div className="flex items-center gap-2">
                    <svg width="28" height="14" className="shrink-0">
                      <line x1="2" y1="7" x2="26" y2="7" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                      <polygon points="14,1 10,7 18,7" fill="#38bdf8" />
                    </svg>
                    <div>
                      <span className={`font-bold ${showGroundwaterAndPressure ? "text-cyan-300" : "text-slate-400"}`}>
                        GWL & Pore Pressure (u)
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {showGroundwaterAndPressure
                          ? `GWL -${project.waterLevel.toFixed(2)}m • u = γw·hw`
                          : "Hidden to reduce clutter"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      showGroundwaterAndPressure
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {showGroundwaterAndPressure ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Active Stratum Banner Indicator */}
          {selectedLayerId && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-400/60 text-xs font-mono mb-4 text-cyan-100 shadow-[0_0_18px_rgba(6,182,212,0.25)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                {(() => {
                  const lyr = project.layers.find((l) => l.id === selectedLayerId);
                  return lyr ? <SoilTextureIcon layerOrType={lyr} size="xs" /> : null;
                })()}
                <span className="text-white font-bold truncate">
                  ACTIVE FOCUS: {project.layers.find((l) => l.id === selectedLayerId)?.id} · {project.layers.find((l) => l.id === selectedLayerId)?.name}
                </span>
                {(() => {
                  const lyr = project.layers.find((l) => l.id === selectedLayerId);
                  return lyr ? (
                    <span className="text-cyan-300/90 text-[11px] shrink-0">
                      ({lyr.topDepth.toFixed(1)}m – {lyr.bottomDepth.toFixed(1)}m, H={(lyr.bottomDepth - lyr.topDepth).toFixed(1)}m)
                    </span>
                  ) : null;
                })()}
              </div>
              <button
                type="button"
                onClick={() => setSelectedLayerId(null)}
                className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 hover:text-white border border-cyan-500/50 transition cursor-pointer shrink-0 ml-2"
                title="Deselect active stratum"
              >
                Clear Focus ✕
              </button>
            </div>
          )}

          {/* SVG Canvas & Auto-Scaled Geotechnical Cross-Section */}
          {(() => {
            const maxDepth = profileExtents.effectiveMaxDepth;
            const top = 50;
            const bottom = 780;
            const scale = (bottom - top) / maxDepth;
            const pileWidth = Math.max(26, Math.min(54, project.diameter / 22));
            const waterY = top + Math.max(0, project.waterLevel) * scale;
            const pileToeY = top + Math.min(project.length, maxDepth) * scale;

            const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);
            const selectedLayerRes = results.layers.find((l) => l.layerId === selectedLayerId);

            return (
              <div className="relative">
                {/* Dynamic Scale & Auto-Fit Geotechnical Status HUD */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#040d1a] border border-cyan-950 text-xs font-mono mb-3">
                  <div className="flex flex-wrap items-center gap-2.5 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="size-3.5 text-cyan-400" />
                      <span className="font-semibold text-cyan-200">Scale:</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                        1m = {scale.toFixed(1)}px
                      </span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <div>
                      <span className="text-slate-400">Profile Extent:</span>{" "}
                      <span className="text-white font-bold">0.0 – {profileExtents.rawTargetDepth.toFixed(1)}m</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <div>
                      <span className="text-slate-400">Viewport:</span>{" "}
                      <span className="text-emerald-300 font-bold">0.0 – {profileExtents.effectiveMaxDepth.toFixed(1)}m</span>{" "}
                      <span className="text-[10px] text-slate-500">(+{profileExtents.bottomCushion.toFixed(1)}m buffer)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {scaleNotification ? (
                      <span className="text-emerald-300 bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 rounded text-[11px] font-bold animate-in fade-in slide-in-from-right-1 duration-200 shadow-sm">
                        {scaleNotification}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] text-cyan-400/90 font-medium">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {autoScaleEnabled && zoomFactor === 1.0 ? "Dynamic Scale Active" : "Custom View Scale"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vertical Axis Ruler & Absolute Elevation Calibration Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#040e1d] border border-cyan-900/60 font-mono text-xs mb-3 shadow-inner">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-cyan-300 font-bold text-[11px]">
                      <Ruler className="size-3.5 text-cyan-400" />
                      Vertical Ruler:
                    </span>
                    {/* Markings Interval Selector */}
                    <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setRulerIntervalMode("auto")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerIntervalMode === "auto"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Automatic markings every 1m or 5m according to current scale and viewport depth"
                      >
                        Auto (1m / 5m)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRulerIntervalMode("1m")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerIntervalMode === "1m"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Force detailed depth markings every 1 meter"
                      >
                        Every 1m
                      </button>
                      <button
                        type="button"
                        onClick={() => setRulerIntervalMode("5m")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerIntervalMode === "5m"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Force macro depth markings every 5 meters"
                      >
                        Every 5m
                      </button>
                    </div>

                    {/* Display Units Selector */}
                    <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setRulerDisplayMode("dual")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerDisplayMode === "dual"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Display both Depth (m bgl) and Absolute Elevation (m RL) on ruler ticks"
                      >
                        Depth + Elev
                      </button>
                      <button
                        type="button"
                        onClick={() => setRulerDisplayMode("depth")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerDisplayMode === "depth"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Display Depth below ground level only"
                      >
                        Depth Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setRulerDisplayMode("elevation")}
                        className={`px-2 py-0.5 rounded transition ${
                          rulerDisplayMode === "elevation"
                            ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Display Absolute Elevation relative to datum level only"
                      >
                        Elev Only
                      </button>
                    </div>

                    {/* Gridlines Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowRulerGridlines((prev) => !prev)}
                      className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                        showRulerGridlines
                          ? "bg-slate-900 border-cyan-800/80 text-cyan-300"
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                      title="Toggle horizontal elevation alignment gridlines across soil layers"
                    >
                      <Grid className="size-3 text-cyan-400" />
                      <span>Grid: {showRulerGridlines ? "ON" : "OFF"}</span>
                    </button>
                  </div>

                  {/* Ground Level Datum Adjustment & Real-Time Laser Probe */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                      <span className="text-slate-400">Site Datum GL:</span>
                      <input
                        type="number"
                        step="0.5"
                        value={project.groundLevel ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setProject((prev) => ({ ...prev, groundLevel: val }));
                        }}
                        className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-200 text-right font-mono font-bold text-[11px] focus:border-cyan-400 focus:outline-none"
                        title="Adjust site ground level datum elevation (m RL) for absolute elevations"
                      />
                      <span className="text-slate-500">m RL</span>
                    </div>

                    {hoverProbeDepth !== null && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/70 text-cyan-200 text-[11px] font-bold animate-in fade-in shadow-sm">
                        Probe: -{hoverProbeDepth.toFixed(2)}m (El {((project.groundLevel ?? 0) - hoverProbeDepth).toFixed(2)}m)
                      </span>
                    )}
                  </div>
                </div>

                <svg
                  viewBox="0 0 760 840"
                  className="h-[780px] w-full overflow-visible"
                  role="img"
                  aria-label="Interactive bored pile stratigraphy cross-section"
                  onMouseMove={(e) => {
                    const svg = e.currentTarget;
                    const pt = svg.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const ctm = svg.getScreenCTM();
                    if (ctm) {
                      const svgPoint = pt.matrixTransform(ctm.inverse());
                      if (svgPoint.y >= top && svgPoint.y <= bottom) {
                        const depth = (svgPoint.y - top) / scale;
                        setHoverProbeDepth(Math.max(0, Math.min(maxDepth, depth)));
                      } else {
                        setHoverProbeDepth(null);
                      }
                    }
                  }}
                  onMouseLeave={() => setHoverProbeDepth(null)}
                >
                  <defs>
                    {/* Fill pattern */}
                    <pattern id="soil-pattern-fill" width="18" height="18" patternUnits="userSpaceOnUse">
                      <path d="M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2" stroke="#d97706" strokeWidth="1.3" opacity="0.65" />
                    </pattern>
                    {/* Clay laminar pattern */}
                    <pattern id="soil-pattern-clay" width="22" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 5c4-2.5 7 2.5 11 0s7 2.5 11 0M0 15c4-2.5 7 2.5 11 0s7 2.5 11 0" fill="none" stroke="#94a3b8" strokeWidth="1.1" opacity="0.6" />
                    </pattern>
                    {/* Sand stipple pattern */}
                    <pattern id="soil-pattern-sand" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="3" cy="4" r="1.3" fill="#eab308" opacity="0.8" />
                      <circle cx="11" cy="8" r="1.1" fill="#facc15" opacity="0.8" />
                      <circle cx="6" cy="14" r="1.2" fill="#eab308" opacity="0.8" />
                      <circle cx="14" cy="13" r="1.0" fill="#fef08a" opacity="0.8" />
                    </pattern>
                    {/* Rock fracture pattern */}
                    <pattern id="soil-pattern-rock" width="26" height="26" patternUnits="userSpaceOnUse">
                      <path d="M1 18L9 4l8 6 8-7M3 24l7-9 7 4 8-8" fill="none" stroke="#c084fc" strokeWidth="1.3" opacity="0.75" />
                    </pattern>
                    {/* Custom pattern */}
                    <pattern id="soil-pattern-custom" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 10h20M10 0v20" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
                    </pattern>
                    {/* Rebar cage pattern for pile */}
                    <pattern id="pile-rebar-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M0 8L8 0M0 0L8 8" stroke="#06b6d4" strokeWidth="0.7" opacity="0.35" />
                    </pattern>

                    {/* High-visibility glowing aura filter for active stratum */}
                    <filter id="stratum-neon-glow" x="-20%" y="-30%" width="140%" height="160%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f0ff" floodOpacity="0.95" />
                      <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#0284c7" floodOpacity="0.75" />
                    </filter>
                    {/* Electric cyan border gradient */}
                    <linearGradient id="stratum-selected-border" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="25%" stopColor="#00f0ff" />
                      <stop offset="75%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    {/* Illuminated stratum wash overlay */}
                    <linearGradient id="stratum-selected-wash" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
                    </linearGradient>
                    {/* Animated diagonal pattern overlay */}
                    <pattern id="stratum-selected-stripes" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="16" stroke="#00f0ff" strokeWidth="2.5" strokeOpacity="0.3" />
                    </pattern>

                    {/* Submerged Saturated Zone Water Gradient */}
                    <linearGradient id="water-submerged-zone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity="0.22" />
                    </linearGradient>

                    {/* Hydrostatic Pore Pressure Wedge Gradient */}
                    <linearGradient id="pore-pressure-wedge-grad" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.12" />
                    </linearGradient>

                    {/* CSS Keyframes & Transitions for Interactive Strata */}
                    <style>{`
                      @keyframes stratumPulseGlow {
                        0%, 100% {
                          opacity: 0.95;
                          stroke-width: 3.5px;
                          filter: drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 16px rgba(2, 132, 199, 0.7));
                        }
                        50% {
                          opacity: 0.55;
                          stroke-width: 5px;
                          filter: drop-shadow(0 0 14px #00f0ff) drop-shadow(0 0 28px rgba(14, 165, 233, 0.95));
                        }
                      }
                      @keyframes stratumGentleBreathing {
                        0%, 100% {
                          transform: scaleX(1.025);
                        }
                        50% {
                          transform: scaleX(1.038);
                        }
                      }
                      .soil-stratum-row {
                        transform-box: fill-box;
                        transform-origin: center;
                        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
                      }
                      .soil-stratum-row:hover:not(.is-active) {
                        transform: scaleX(1.012);
                      }
                      .soil-stratum-row.is-active {
                        transform: scaleX(1.028);
                        animation: stratumGentleBreathing 3s ease-in-out infinite;
                      }
                      .soil-stratum-aura {
                        animation: stratumPulseGlow 2s ease-in-out infinite;
                      }
                    `}</style>
                  </defs>

                  {/* Ground Level Line */}
                  <line x1="140" y1={top} x2="540" y2={top} stroke="#f8fafc" strokeWidth="2.5" />
                  <text x="140" y="32" fill="#cbd5e1" fontSize="13" fontFamily="monospace" fontWeight="bold">
                    GROUND LEVEL (GL 0.00 m)
                  </text>

                  {/* Strata Rectangles */}
                  {project.layers.map((layer) => {
                    const y = top + Math.max(0, layer.topDepth) * scale;
                    const height = Math.max(
                      6,
                      (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) * scale,
                    );
                    const colors = soilLayerColor(layer);
                    const isSelected = selectedLayerId === layer.id;
                    const anySelected = Boolean(selectedLayerId);
                    const isToeInThisLayer = project.length >= layer.topDepth && project.length <= layer.bottomDepth;

                    return (
                      <g
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`cursor-pointer group soil-stratum-row ${isSelected ? "is-active" : ""}`}
                      >
                        {/* Ambient Pulsing Neon Aura when selected */}
                        {isSelected && (
                          <rect
                            x="136"
                            y={y - 2.5}
                            width="408"
                            height={Math.max(6, height) + 5}
                            fill="none"
                            stroke="#00f0ff"
                            strokeWidth="3.5"
                            strokeOpacity="0.9"
                            rx="6"
                            className="soil-stratum-aura"
                            pointerEvents="none"
                          />
                        )}

                        {/* Background color */}
                        <rect
                          x="140"
                          y={y}
                          width="400"
                          height={height}
                          fill={colors.fill}
                          fillOpacity={isSelected ? 0.95 : anySelected ? 0.28 : 0.5}
                          stroke={isSelected ? "url(#stratum-selected-border)" : colors.stroke}
                          strokeWidth={isSelected ? 3.5 : 1}
                          rx={isSelected ? 4 : 0}
                          className="transition-all"
                        />
                        {/* Geological hatch pattern */}
                        <rect
                          x="140"
                          y={y}
                          width="400"
                          height={height}
                          fill={`url(#${soilPatternId(layer)})`}
                          opacity={isSelected ? 0.9 : anySelected ? 0.35 : 0.65}
                          rx={isSelected ? 4 : 0}
                        />

                        {/* Selected stratum illuminated wash & hazard stripes */}
                        {isSelected && (
                          <g pointerEvents="none">
                            <rect
                              x="140"
                              y={y}
                              width="400"
                              height={height}
                              fill="url(#stratum-selected-wash)"
                              rx={4}
                            />
                            <rect
                              x="140"
                              y={y}
                              width="400"
                              height={height}
                              fill="url(#stratum-selected-stripes)"
                              rx={4}
                            />

                            {/* Precision Reticle Corner Brackets (L-shaped targeting corners) */}
                            {height >= 14 && (
                              <g stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" filter="url(#stratum-neon-glow)">
                                {/* Top-Left */}
                                <path d={`M 141 ${y + 12} L 141 ${y + 1} L 153 ${y + 1}`} fill="none" />
                                {/* Top-Right */}
                                <path d={`M 527 ${y + 1} L 539 ${y + 1} L 539 ${y + 12}`} fill="none" />
                                {/* Bottom-Left */}
                                <path d={`M 141 ${y + height - 12} L 141 ${y + height - 1} L 153 ${y + height - 1}`} fill="none" />
                                {/* Bottom-Right */}
                                <path d={`M 527 ${y + height - 1} L 539 ${y + height - 1} L 539 ${y + height - 12}`} fill="none" />
                              </g>
                            )}

                            {/* Left Pointer & Depth Bracket */}
                            {/* Glowing Neon Pointer Arrow */}
                            <polygon
                              points={`139,${y + height / 2} 128,${y + height / 2 - 6} 128,${y + height / 2 + 6}`}
                              fill="#00f0ff"
                              filter="url(#stratum-neon-glow)"
                            />
                            {/* Vertical dimension bracket in margin */}
                            <line x1="126" y1={y + 1} x2="126" y2={y + height - 1} stroke="#00f0ff" strokeWidth="2.5" />
                            <line x1="122" y1={y + 1} x2="130" y2={y + 1} stroke="#00f0ff" strokeWidth="2.5" />
                            <line x1="122" y1={y + height - 1} x2="130" y2={y + height - 1} stroke="#00f0ff" strokeWidth="2.5" />

                            {/* Stratum Thickness Callout Badge inside layer edge */}
                            {height >= 26 && (
                              <g filter="url(#stratum-neon-glow)">
                                <rect
                                  x="146"
                                  y={y + height / 2 - 10}
                                  width="74"
                                  height="20"
                                  rx="4"
                                  fill="#021526"
                                  stroke="#00f0ff"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x="183"
                                  y={y + height / 2 + 4}
                                  textAnchor="middle"
                                  fill="#38bdf8"
                                  fontSize="10"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  H={(layer.bottomDepth - layer.topDepth).toFixed(2)}m
                                </text>
                              </g>
                            )}

                            {/* Glowing Top Boundary Tag */}
                            <text
                              x="136"
                              y={y + 3.5}
                              textAnchor="end"
                              fill="#00f0ff"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                              filter="url(#stratum-neon-glow)"
                            >
                              {layer.topDepth.toFixed(1)}m
                            </text>

                            {/* Glowing Bottom Boundary Tag */}
                            <text
                              x="136"
                              y={y + height + 3.5}
                              textAnchor="end"
                              fill="#00f0ff"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                              filter="url(#stratum-neon-glow)"
                            >
                              {layer.bottomDepth.toFixed(1)}m
                            </text>
                          </g>
                        )}

                        {/* Top boundary depth label (when not selected) */}
                        {!isSelected && (
                          <text
                            x="136"
                            y={y + 3.5}
                            textAnchor="end"
                            fill={anySelected ? "#64748b" : "#94a3b8"}
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            {layer.topDepth.toFixed(1)}m
                          </text>
                        )}

                        {/* Stratum connector and label on right */}
                        {height > 10 && (
                          isSelected ? (
                            <g pointerEvents="none">
                              {/* Glowing connecting leader */}
                              <line
                                x1="540"
                                y1={y + height / 2}
                                x2="568"
                                y2={y + height / 2}
                                stroke="#00f0ff"
                                strokeWidth="3"
                                strokeDasharray="5 3"
                              />
                              {/* Illuminated Target Stratum Badge */}
                              <g filter="url(#stratum-neon-glow)">
                                <rect
                                  x="568"
                                  y={y + height / 2 - (isToeInThisLayer ? 20 : 14)}
                                  width={Math.max(180, (layer.name.length + 8) * 8.5)}
                                  height={isToeInThisLayer ? 40 : 28}
                                  rx="6"
                                  fill="#03182b"
                                  stroke="#00f0ff"
                                  strokeWidth="2"
                                />
                                {/* Pulsing Radar Ring & Dot */}
                                <circle
                                  cx="583"
                                  cy={y + height / 2 - (isToeInThisLayer ? 6 : 0)}
                                  r="5"
                                  fill="#00f0ff"
                                  opacity="0.4"
                                  className="animate-ping"
                                />
                                <circle
                                  cx="583"
                                  cy={y + height / 2 - (isToeInThisLayer ? 6 : 0)}
                                  r="3.5"
                                  fill="#00f0ff"
                                />
                                <text
                                  x="595"
                                  y={y + height / 2 - (isToeInThisLayer ? 2 : -4)}
                                  fill="#ffffff"
                                  fontSize="12"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  {layer.id} · {layer.name.slice(0, 20)}
                                </text>
                                {isToeInThisLayer && (
                                  <text
                                    x="595"
                                    y={y + height / 2 + 13}
                                    fill="#fbbf24"
                                    fontSize="9"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    ★ TOE BEARING STRATUM
                                  </text>
                                )}
                              </g>
                            </g>
                          ) : (
                            <g opacity={anySelected ? 0.45 : 1.0}>
                              <line
                                x1="540"
                                y1={y + height / 2}
                                x2="565"
                                y2={y + height / 2}
                                stroke={colors.stroke}
                                strokeWidth={1}
                              />
                              <text
                                x="572"
                                y={y + height / 2 + 4}
                                fill={colors.accent}
                                fontSize="12"
                                fontFamily="monospace"
                              >
                                {layer.id} · {layer.name.slice(0, 24)}
                              </text>
                              {isToeInThisLayer && (
                                <text
                                  x="572"
                                  y={y + height / 2 + 18}
                                  fill="#fbbf24"
                                  fontSize="10"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  [TOE BEARING STRATUM]
                                </text>
                              )}
                            </g>
                          )
                        )}
                      </g>
                    );
                  })}

                  {/* Bottom boundary of last layer */}
                  {project.layers.length > 0 && (
                    <text
                      x="132"
                      y={top + project.layers[project.layers.length - 1].bottomDepth * scale + 4}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {project.layers[project.layers.length - 1].bottomDepth.toFixed(1)}m
                    </text>
                  )}

                  {/* Groundwater Level (GWL) & Pore Water Pressure Indicators (Toggleable via Legend) */}
                  {showGroundwaterAndPressure && waterY <= bottom && (
                    <g id="groundwater-pore-pressure-group">
                      {/* Submerged Saturated Zone Tint */}
                      <rect
                        x="140"
                        y={waterY}
                        width="400"
                        height={Math.max(0, bottom - waterY)}
                        fill="url(#water-submerged-zone-grad)"
                        pointerEvents="none"
                      />

                      {/* Hydrostatic Pore Water Pressure Wedge (u = γw · hw) */}
                      {bottom > waterY + 12 && (() => {
                        const uMax = 9.81 * Math.max(0, maxDepth - project.waterLevel);
                        const wedgeW = 28; // width of triangular pressure isobar wedge
                        return (
                          <g id="pore-pressure-hydrostatic-gradient" pointerEvents="none">
                            {/* Triangular isobar diagram along depth */}
                            <polygon
                              points={`140,${waterY} 140,${bottom} ${140 - wedgeW},${bottom}`}
                              fill="url(#pore-pressure-wedge-grad)"
                              stroke="#38bdf8"
                              strokeWidth="1.4"
                              strokeDasharray="3 2"
                            />
                            {/* Maximum Pore Pressure Label at bottom */}
                            <text
                              x={140 - wedgeW - 4}
                              y={bottom - 3}
                              textAnchor="end"
                              fill="#38bdf8"
                              fontSize="9.5"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              u_max≈{uMax.toFixed(0)} kPa
                            </text>
                            <text
                              x={140 - wedgeW / 2}
                              y={waterY + (bottom - waterY) * 0.48}
                              textAnchor="middle"
                              fill="#7dd3fc"
                              fontSize="8"
                              fontFamily="monospace"
                              transform={`rotate(-90 ${140 - wedgeW / 2} ${waterY + (bottom - waterY) * 0.48})`}
                            >
                              u = γw·hw
                            </text>

                            {/* Pore Water Pressure at Founding Pile Toe (if submerged) */}
                            {project.length > project.waterLevel && pileToeY <= bottom && (
                              <g>
                                <line
                                  x1={140 - 20}
                                  y1={pileToeY}
                                  x2={140}
                                  y2={pileToeY}
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                  strokeDasharray="2 2"
                                />
                                <rect
                                  x={140 - 92}
                                  y={pileToeY - 9}
                                  width="70"
                                  height="18"
                                  rx="3"
                                  fill="#031b2e"
                                  stroke="#38bdf8"
                                  strokeWidth="1.2"
                                />
                                <text
                                  x={140 - 57}
                                  y={pileToeY + 4}
                                  textAnchor="middle"
                                  fill="#38bdf8"
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  u={(9.81 * (project.length - project.waterLevel)).toFixed(0)} kPa
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })()}

                      {/* Groundwater Surface Line */}
                      <line
                        x1="140"
                        y1={waterY}
                        x2="540"
                        y2={waterY}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="8 5"
                      />

                      {/* Piezometric Groundwater Symbol */}
                      <polygon
                        points={`145,${waterY - 1} 153,${waterY - 9} 161,${waterY - 1}`}
                        fill="#38bdf8"
                      />
                      <polygon
                        points={`148,${waterY + 1} 153,${waterY + 6} 158,${waterY + 1}`}
                        fill="#38bdf8"
                        opacity="0.8"
                      />

                      {/* GWL Elevation & Datum Tag */}
                      <rect
                        x="166"
                        y={waterY - 18}
                        width="186"
                        height="18"
                        rx="3"
                        fill="#021424"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                      />
                      <text
                        x="172"
                        y={waterY - 5}
                        fill="#7dd3fc"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        GWL -{project.waterLevel.toFixed(2)} m bgl (u=0)
                      </text>
                    </g>
                  )}

                  {/* Unobtrusive Canvas Indicator when Water Table is Hidden */}
                  {!showGroundwaterAndPressure && (
                    <g
                      onClick={() => setShowGroundwaterAndPressure(true)}
                      className="cursor-pointer"
                      id="gwl-hidden-indicator-chip"
                    >
                      <rect
                        x="142"
                        y="40"
                        width="276"
                        height="22"
                        rx="4"
                        fill="#071322"
                        fillOpacity="0.9"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="150"
                        y="55"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        👁 GWL & Pore Pressure Hidden (Click to Restore)
                      </text>
                    </g>
                  )}

                  {/* Bored Pile Shaft */}
                  <rect
                    x={340 - pileWidth / 2}
                    y={top}
                    width={pileWidth}
                    height={Math.min(project.length, maxDepth) * scale}
                    fill="#06b6d4"
                    fillOpacity="0.25"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                  />
                  <rect
                    x={340 - pileWidth / 2}
                    y={top}
                    width={pileWidth}
                    height={Math.min(project.length, maxDepth) * scale}
                    fill="url(#pile-rebar-hatch)"
                  />

                  {/* Load Arrow at top */}
                  <line x1="340" y1="12" x2="340" y2={top - 2} stroke="#fbbf24" strokeWidth="3.5" />
                  <polygon points={`332,${top - 10} 340,${top} 348,${top - 10}`} fill="#fbbf24" />
                  <text
                    x="355"
                    y="25"
                    fill="#fbbf24"
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    N_Ed = {project.nEd} kN
                  </text>

                  {/* Pile Toe Marker */}
                  <line
                    x1="140"
                    y1={pileToeY}
                    x2="540"
                    y2={pileToeY}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <polygon
                    points={`340,${pileToeY} 332,${pileToeY + 12} 348,${pileToeY + 12}`}
                    fill="#fbbf24"
                  />
                  <text
                    x="150"
                    y={Math.min(bottom + 22, pileToeY + 18)}
                    fill="#fbbf24"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    PILE TOE FOUNDING ELEVATION: -{project.length.toFixed(2)} m
                  </text>

                  {/* Vertical Axis Ruler on Left Side with Automatic Depth & Elevation Markings */}
                  {(() => {
                    const siteDatum = project.groundLevel ?? 0.0;

                    // Determine major and minor tick intervals based on rulerIntervalMode & profile depth
                    let majorInterval = 5;
                    let minorInterval = 1;
                    let subMinorInterval = 0;

                    if (rulerIntervalMode === "1m") {
                      majorInterval = 1;
                      minorInterval = 0.5;
                      if (scale >= 35) subMinorInterval = 0.1;
                    } else if (rulerIntervalMode === "5m") {
                      majorInterval = 5;
                      minorInterval = 1;
                      if (scale >= 45) subMinorInterval = 0.5;
                    } else {
                      // "auto" mode: dynamically pick based on effectiveMaxDepth
                      if (maxDepth <= 10) {
                        majorInterval = 1;
                        minorInterval = 0.5;
                        if (scale >= 35) subMinorInterval = 0.1;
                      } else if (maxDepth <= 18) {
                        majorInterval = 2;
                        minorInterval = 1;
                        if (scale >= 30) subMinorInterval = 0.5;
                      } else if (maxDepth <= 45) {
                        majorInterval = 5;
                        minorInterval = 1;
                      } else if (maxDepth <= 90) {
                        majorInterval = 10;
                        minorInterval = 2;
                      } else {
                        majorInterval = 20;
                        minorInterval = 5;
                      }
                    }

                    // Generate ticks
                    const majorTickCount = Math.floor(maxDepth / majorInterval);
                    const majorTicks = Array.from({ length: majorTickCount + 1 }, (_, i) => i * majorInterval);

                    // Minor ticks (excluding values that coincide with major ticks)
                    const minorTickCount = Math.floor(maxDepth / minorInterval);
                    const minorTicks = Array.from({ length: minorTickCount + 1 }, (_, i) => i * minorInterval).filter(
                      (d) => !majorTicks.some((maj) => Math.abs(maj - d) < 0.001),
                    );

                    // Sub-minor ticks (if enabled)
                    const subMinorTicks =
                      subMinorInterval > 0
                        ? Array.from({ length: Math.floor(maxDepth / subMinorInterval) + 1 }, (_, i) => i * subMinorInterval).filter(
                            (d) =>
                              !majorTicks.some((m) => Math.abs(m - d) < 0.001) &&
                              !minorTicks.some((m) => Math.abs(m - d) < 0.001),
                          )
                        : [];

                    const rulerLeft = 14;
                    const rulerWidth = 106;
                    const rulerSpineX = rulerLeft + rulerWidth; // 120

                    return (
                      <g id="vertical-axis-ruler-system">
                        {/* Background Horizontal Gridlines across profile */}
                        {showRulerGridlines && (
                          <g id="ruler-gridlines" opacity="0.65">
                            {/* Minor Gridlines */}
                            {minorTicks.map((d) => {
                              const y = top + d * scale;
                              if (y > bottom) return null;
                              return (
                                <line
                                  key={`grid-minor-${d}`}
                                  x1={rulerSpineX}
                                  y1={y}
                                  x2="540"
                                  y2={y}
                                  stroke="#172538"
                                  strokeWidth="0.6"
                                  strokeDasharray="2 3"
                                />
                              );
                            })}
                            {/* Major Gridlines */}
                            {majorTicks.map((d) => {
                              const y = top + d * scale;
                              if (y > bottom) return null;
                              return (
                                <line
                                  key={`grid-major-${d}`}
                                  x1={rulerSpineX}
                                  y1={y}
                                  x2="540"
                                  y2={y}
                                  stroke="#2a3c53"
                                  strokeWidth="0.9"
                                  strokeDasharray="4 3"
                                />
                              );
                            })}
                          </g>
                        )}

                        {/* Ruler Body Housing Canvas */}
                        <rect
                          x={rulerLeft}
                          y={top}
                          width={rulerWidth}
                          height={bottom - top}
                          rx="5"
                          fill="#030b17"
                          stroke="#1e293b"
                          strokeWidth="1.2"
                        />

                        {/* Ruler Header Badge */}
                        <g>
                          <rect
                            x={rulerLeft}
                            y={top - 24}
                            width={rulerWidth}
                            height="20"
                            rx="4"
                            fill="#041224"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                          <text
                            x={rulerLeft + rulerWidth / 2}
                            y={top - 10}
                            textAnchor="middle"
                            fill="#38bdf8"
                            fontSize="8.5"
                            fontFamily="monospace"
                            fontWeight="bold"
                            letterSpacing="0.5"
                          >
                            ▼ RULER · {majorInterval}m MARKS
                          </text>
                        </g>

                        {/* Ruler Vertical Spine Line */}
                        <line
                          x1={rulerSpineX}
                          y1={top}
                          x2={rulerSpineX}
                          y2={bottom}
                          stroke="#475569"
                          strokeWidth="2"
                        />

                        {/* Sub-Minor Graduation Ticks (when high zoom) */}
                        {subMinorTicks.map((d) => {
                          const y = top + d * scale;
                          if (y > bottom) return null;
                          return (
                            <line
                              key={`tick-sub-${d}`}
                              x1={rulerSpineX - 3}
                              y1={y}
                              x2={rulerSpineX}
                              y2={y}
                              stroke="#334155"
                              strokeWidth="0.6"
                            />
                          );
                        })}

                        {/* Minor Ticks (Every 1m or intermediate) */}
                        {minorTicks.map((d) => {
                          const y = top + d * scale;
                          if (y > bottom) return null;
                          const showLabel = scale >= 14 && d % 1 === 0;
                          return (
                            <g key={`tick-minor-${d}`}>
                              <line
                                x1={rulerSpineX - 6}
                                y1={y}
                                x2={rulerSpineX}
                                y2={y}
                                stroke="#64748b"
                                strokeWidth="1.2"
                              />
                              {showLabel && (
                                <text
                                  x={rulerSpineX - 8}
                                  y={y + 3}
                                  textAnchor="end"
                                  fill="#64748b"
                                  fontSize="8"
                                  fontFamily="monospace"
                                >
                                  {d}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Major Ticks & Markings (Every 1m or 5m) */}
                        {majorTicks.map((d) => {
                          const y = top + d * scale;
                          if (y > bottom) return null;
                          const elevation = siteDatum - d;

                          return (
                            <g key={`tick-major-${d}`}>
                              {/* Extended Tick Notch */}
                              <line
                                x1={rulerSpineX - 14}
                                y1={y}
                                x2={rulerSpineX}
                                y2={y}
                                stroke="#cbd5e1"
                                strokeWidth="1.8"
                              />

                              {/* Depth & Absolute Elevation Markings */}
                              {rulerDisplayMode === "dual" ? (
                                <>
                                  <text
                                    x={rulerSpineX - 16}
                                    y={y - 1}
                                    textAnchor="end"
                                    fill="#f8fafc"
                                    fontSize="10"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    {d}m
                                  </text>
                                  <text
                                    x={rulerSpineX - 16}
                                    y={y + 9}
                                    textAnchor="end"
                                    fill="#38bdf8"
                                    fontSize="8.5"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    El {elevation >= 0 ? "+" : ""}{elevation.toFixed(1)}
                                  </text>
                                </>
                              ) : rulerDisplayMode === "depth" ? (
                                <text
                                  x={rulerSpineX - 16}
                                  y={y + 3.5}
                                  textAnchor="end"
                                  fill="#f8fafc"
                                  fontSize="10"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  -{d.toFixed(1)}m bgl
                                </text>
                              ) : (
                                <text
                                  x={rulerSpineX - 16}
                                  y={y + 3.5}
                                  textAnchor="end"
                                  fill="#38bdf8"
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  El {elevation >= 0 ? "+" : ""}{elevation.toFixed(1)}m
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Stratum Boundary Notches & Caliper along Ruler Edge */}
                        {project.layers.map((layer, idx) => {
                          const yTop = top + layer.topDepth * scale;
                          const yBot = top + layer.bottomDepth * scale;
                          if (yTop > bottom && yBot > bottom) return null;

                          const isLayerSelected = selectedLayerId === layer.id;

                          return (
                            <g key={`ruler-boundary-${layer.id}-${idx}`}>
                              {/* Boundary pip notch on spine */}
                              <circle
                                cx={rulerSpineX}
                                cy={yTop}
                                r="2"
                                fill={isLayerSelected ? "#00f0ff" : "#38bdf8"}
                                opacity={isLayerSelected ? 1 : 0.6}
                              />
                              <circle
                                cx={rulerSpineX}
                                cy={yBot}
                                r="2"
                                fill={isLayerSelected ? "#00f0ff" : "#38bdf8"}
                                opacity={isLayerSelected ? 1 : 0.6}
                              />

                              {/* Active Caliper bracket along Ruler edge when layer is selected */}
                              {isLayerSelected && (
                                <g>
                                  <line
                                    x1={rulerLeft + 2}
                                    y1={yTop}
                                    x2={rulerLeft + 2}
                                    y2={yBot}
                                    stroke="#00f0ff"
                                    strokeWidth="3"
                                    filter="url(#stratum-neon-glow)"
                                  />
                                  <line x1={rulerLeft + 2} y1={yTop} x2={rulerLeft + 8} y2={yTop} stroke="#00f0ff" strokeWidth="2.5" />
                                  <line x1={rulerLeft + 2} y1={yBot} x2={rulerLeft + 8} y2={yBot} stroke="#00f0ff" strokeWidth="2.5" />
                                </g>
                              )}
                            </g>
                          );
                        })}

                        {/* Ground Level (GL 0.00m) Elevation Marker */}
                        <g>
                          <line x1={rulerLeft + 4} y1={top} x2={rulerSpineX} y2={top} stroke="#10b981" strokeWidth="2.5" />
                          <polygon points={`${rulerSpineX},${top} ${rulerSpineX - 6},${top - 4} ${rulerSpineX - 6},${top + 4}`} fill="#10b981" />
                          <rect
                            x={rulerLeft + 4}
                            y={top + 2}
                            width="50"
                            height="14"
                            rx="2"
                            fill="#062d1d"
                            stroke="#10b981"
                            strokeWidth="0.8"
                          />
                          <text
                            x={rulerLeft + 29}
                            y={top + 12}
                            textAnchor="middle"
                            fill="#34d399"
                            fontSize="8.5"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            GL 0.0m
                          </text>
                        </g>

                        {/* Pile Toe Founding Elevation Marker on Ruler */}
                        {pileToeY <= bottom && (
                          <g>
                            <line x1={rulerLeft + 4} y1={pileToeY} x2={rulerSpineX} y2={pileToeY} stroke="#fbbf24" strokeWidth="2" />
                            <polygon
                              points={`${rulerSpineX},${pileToeY} ${rulerSpineX - 6},${pileToeY - 4} ${rulerSpineX - 6},${pileToeY + 4}`}
                              fill="#fbbf24"
                            />
                            <rect
                              x={rulerLeft + 4}
                              y={pileToeY - 14}
                              width="56"
                              height="13"
                              rx="2"
                              fill="#2d2105"
                              stroke="#fbbf24"
                              strokeWidth="0.8"
                            />
                            <text
                              x={rulerLeft + 32}
                              y={pileToeY - 4}
                              textAnchor="middle"
                              fill="#fde047"
                              fontSize="8"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              TOE -{project.length.toFixed(1)}m
                            </text>
                          </g>
                        )}

                        {/* Groundwater Table (GWL) Marker on Ruler */}
                        {showGroundwaterAndPressure && waterY <= bottom && (
                          <g>
                            <line
                              x1={rulerLeft + 4}
                              y1={waterY}
                              x2={rulerSpineX}
                              y2={waterY}
                              stroke="#38bdf8"
                              strokeWidth="1.8"
                              strokeDasharray="3 2"
                            />
                            <polygon
                              points={`${rulerSpineX},${waterY} ${rulerSpineX - 6},${waterY - 3} ${rulerSpineX - 6},${waterY + 3}`}
                              fill="#38bdf8"
                            />
                          </g>
                        )}

                        {/* Interactive Hover Laser Probe on Ruler */}
                        {hoverProbeDepth !== null && (
                          <g pointerEvents="none">
                            {/* Laser Hairline Across Canvas */}
                            <line
                              x1={rulerLeft}
                              y1={top + hoverProbeDepth * scale}
                              x2="540"
                              y2={top + hoverProbeDepth * scale}
                              stroke="#00f0ff"
                              strokeWidth="1.2"
                              strokeDasharray="4 2"
                              opacity="0.85"
                            />
                            {/* Laser Pointer Badge on Ruler */}
                            <g>
                              <rect
                                x={rulerLeft - 2}
                                y={top + hoverProbeDepth * scale - 11}
                                width={rulerWidth + 4}
                                height="22"
                                rx="4"
                                fill="#031b2e"
                                stroke="#00f0ff"
                                strokeWidth="1.8"
                                filter="url(#stratum-neon-glow)"
                              />
                              <text
                                x={rulerLeft + rulerWidth / 2}
                                y={top + hoverProbeDepth * scale + 3.5}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                -{hoverProbeDepth.toFixed(2)}m · El {(siteDatum - hoverProbeDepth).toFixed(2)}m
                              </text>
                            </g>
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>

                {/* Floating Selected Stratum Inspector Box */}
                {selectedLayer && (
                  <div className="mt-4 p-4 rounded-xl bg-[#040a14] border border-cyan-500/50 font-mono text-xs shadow-xl">
                    <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2 mb-2">
                      <span className="font-bold text-cyan-300">
                        Inspecting Stratum: {selectedLayer.id} · {selectedLayer.name}
                      </span>
                      <span className="text-slate-400">
                        {selectedLayer.topDepth.toFixed(2)} m → {selectedLayer.bottomDepth.toFixed(2)} m
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Thickness:</span>{" "}
                        <strong className="text-white">
                          {(selectedLayer.bottomDepth - selectedLayer.topDepth).toFixed(2)} m
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Method:</span>{" "}
                        <strong className="text-cyan-300">
                          {selectedLayer.method === "alpha"
                            ? `α-method (cu = ${selectedLayer.cu} kPa)`
                            : `β-method (φ' = ${selectedLayer.phi}°)`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Bulk γ:</span>{" "}
                        <strong className="text-white">{selectedLayer.gamma} kN/m³</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">SPT N:</span>{" "}
                        <strong className="text-white">{selectedLayer.sptN ?? "—"}</strong>
                      </div>

                      {/* Hydrostatic Pore Pressure Range for Active Stratum (Shown when GWL & Pore Pressure is active) */}
                      {showGroundwaterAndPressure && (
                        <div className="col-span-2 sm:col-span-4 mt-1 pt-1.5 border-t border-cyan-950/80 flex items-center justify-between text-[11px]">
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Droplets className="size-3" /> Hydrostatic Pore Pressure (u):
                          </span>
                          <strong className="text-cyan-200">
                            {selectedLayer.bottomDepth <= project.waterLevel
                              ? "0.0 kPa (Dry / Above GWL)"
                              : selectedLayer.topDepth < project.waterLevel
                              ? `0.0 → ${(9.81 * (selectedLayer.bottomDepth - project.waterLevel)).toFixed(1)} kPa`
                              : `${(9.81 * (selectedLayer.topDepth - project.waterLevel)).toFixed(1)} → ${(9.81 * (selectedLayer.bottomDepth - project.waterLevel)).toFixed(1)} kPa`}
                          </strong>
                        </div>
                      )}
                    </div>

                    {selectedLayerRes && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400">
                        <span>
                          Intersects Pile Shaft: {selectedLayerRes.effectiveLength.toFixed(2)} m embedment
                        </span>
                        <span>
                          Shaft Resistance: <strong>+{selectedLayerRes.shaftResistance} kN</strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick Footer info */}
          <div className="mt-4 pt-3 border-t border-cyan-900/60 grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-[#040a14] border border-slate-800">
              Diameter: <strong className="text-cyan-300">{project.diameter} mm</strong>
            </div>
            <div className="p-2 rounded-lg bg-[#040a14] border border-slate-800">
              Length: <strong className="text-cyan-300">{project.length} m</strong>
            </div>

            {/* Quick Cross-Section Status & GWL Toggle */}
            <div className="p-2 rounded-lg bg-[#040a14] border border-slate-800 flex items-center justify-between col-span-2">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Droplets className={`size-3 ${showGroundwaterAndPressure ? "text-cyan-400" : "text-slate-500"}`} />
                <span>Water Table & Pore Pressure:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGroundwaterAndPressure((prev) => !prev)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                  showGroundwaterAndPressure
                    ? "bg-cyan-950 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900"
                    : "bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800"
                }`}
              >
                {showGroundwaterAndPressure ? "Visible (Click to Hide)" : "Hidden (Click to Show)"}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Add Layer Dialog Modal */}
      <AddLayerDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLayer={handleAddLayerFromDialog}
        existingLayers={project.layers}
        pileLength={project.length}
      />
    </div>
  );
}
