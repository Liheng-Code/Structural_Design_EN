import React, { useState, useMemo } from "react";
import {
  Ruler,
  Sliders,
  ArrowDown,
  Layers,
  Grid,
  Sparkles,
  Anchor,
  Truck,
  Waves,
  Eye,
  Zap,
  Activity,
  Compass,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useProject } from "@/lib/store";

type ValidationSeverity = "valid" | "warning" | "error";

interface ValidationResult {
  status: ValidationSeverity;
  message: string;
}

function ValidationStatusBadge({ status, message }: ValidationResult) {
  if (status === "valid") {
    return (
      <span
        className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px] bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded shadow-sm"
        title={message}
      >
        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
        <span className="font-semibold">Valid</span>
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span
        className="inline-flex items-center gap-1 text-amber-300 font-mono text-[10px] bg-amber-950/80 border border-amber-500/50 px-1.5 py-0.5 rounded shadow-sm"
        title={message}
      >
        <AlertTriangle className="size-3 text-amber-400 shrink-0 animate-pulse" />
        <span className="font-semibold">{message}</span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-rose-300 font-mono text-[10px] bg-rose-950/80 border border-rose-500/50 px-1.5 py-0.5 rounded shadow-sm"
      title={message}
    >
      <AlertCircle className="size-3 text-rose-400 shrink-0" />
      <span className="font-semibold">{message}</span>
    </span>
  );
}

function getInputStatusBorder(status: ValidationSeverity) {
  if (status === "error") return "border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400";
  if (status === "warning") return "border-amber-500/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400";
  return "border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";
}

export function GeometryLoadsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);

  // View preferences for graphical preview
  const [viewMode, setViewMode] = useState<"all" | "loads" | "geometry">("all");
  const [showRuler, setShowRuler] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showDispersion, setShowDispersion] = useState(true);
  const [showPressureOverlay, setShowPressureOverlay] = useState(true);
  const [hoverProbe, setHoverProbe] = useState<{ x: number; z: number; label: string } | null>(null);

  // Active accordion section in the input panel
  const [activeInputSection, setActiveInputSection] = useState<"geometry" | "loads" | "anchors" | "water">("geometry");

  // Geometry shortcuts
  const g = p.geometry;
  const H = Math.max(1, g.retainedHeight);
  const D = Math.max(0.5, g.embedment);
  const L = H + D;
  const t = Math.max(0.1, g.wallThickness);
  const riverbed = g.riverbed;
  const crestEl = riverbed + H;
  const toeEl = riverbed - D;
  const isCbp = p.wallSystem === "cbp";
  const cbpDia = p.cbp?.diameter ?? 0.8;
  const cbpSpacing = p.cbp?.spacing ?? 0.95;

  // Load parameters
  const tr = p.traffic;
  const q_udl = tr.q ?? 10;
  const q_axle = tr.axleLoad ?? 120;
  const x_offset = tr.offsetFromWall ?? 1.5;
  const b_footprint = tr.footprintB ?? 2.0;
  const q_plant = tr.plantLoad ?? 0;
  const q_stock = tr.stockpile ?? 0;

  // Capping beam
  const cap = p.capping;
  const capH = cap.enabled ? cap.h : 0;
  const capB = cap.enabled ? cap.b : t;

  // Water levels
  const wUp = p.water.dryUp ?? (riverbed + H - 2);
  const wDown = p.water.dryDown ?? (riverbed + 0.5);

  // Primary tie rod / anchor
  const primaryTie = p.ties.find((tie) => tie.enabled);
  const tieElev = primaryTie ? primaryTie.elevation : crestEl - 1.5;
  const tieDepthFromCrest = crestEl - tieElev;

  // Real-time engineering validation rules for geometry and loads
  const validation = useMemo(() => {
    // Retained Height H
    let vH: ValidationResult = { status: "valid", message: "Standard range (1–18m)" };
    if (g.retainedHeight <= 0 || g.retainedHeight > 30) {
      vH = { status: "error", message: "Out of bounds (1–30m)" };
    } else if (g.retainedHeight > 18) {
      vH = { status: "warning", message: "Deep wall (>18m), recommend ties/props" };
    } else if (g.retainedHeight < 1.5) {
      vH = { status: "warning", message: "Shallow (<1.5m)" };
    }

    // Embedment Depth D
    let vD: ValidationResult = { status: "valid", message: `D/H = ${(D / H).toFixed(2)} (within design range)` };
    if (g.embedment < 0.5 || g.embedment > 35) {
      vD = { status: "error", message: "Out of bounds (0.5–35m)" };
    } else if (g.embedment < 0.4 * H) {
      vD = { status: "warning", message: `Low embedment (D/H = ${(D / H).toFixed(2)} < 0.4: kick-out risk)` };
    } else if (g.embedment > 2.5 * H) {
      vD = { status: "warning", message: `High embedment (D/H = ${(D / H).toFixed(2)} > 2.5)` };
    }

    // Wall Thickness t
    let vT: ValidationResult = { status: "valid", message: `H/t = ${(H / t).toFixed(1)} (acceptable slenderness)` };
    if (g.wallThickness < 0.05 || g.wallThickness > 3.5) {
      vT = { status: "error", message: "Out of bounds (0.05–3.5m)" };
    } else if (H / t > 35) {
      vT = { status: "warning", message: `High slenderness (H/t = ${(H / t).toFixed(0)} > 35: high bending deflection)` };
    } else if (g.wallThickness > 2.2) {
      vT = { status: "warning", message: "Very thick wall (>2.2m)" };
    }

    // Riverbed
    let vRiver: ValidationResult = { status: "valid", message: "Valid datum" };
    if (g.riverbed < -100 || g.riverbed > 500) {
      vRiver = { status: "error", message: "Out of bounds (-100 to +500m)" };
    }

    // Capping Beam Width & Height
    let vCapB: ValidationResult = { status: "valid", message: "Valid capping width" };
    let vCapH: ValidationResult = { status: "valid", message: "Valid capping depth" };
    if (cap.enabled) {
      if (cap.b < 0.1 || cap.b > 4.0) {
        vCapB = { status: "error", message: "Out of bounds (0.1–4.0m)" };
      } else if (cap.b < t) {
        vCapB = { status: "warning", message: `Width b (${cap.b}m) < wall thickness t (${t}m)` };
      }
      if (cap.h < 0.1 || cap.h > 4.0) {
        vCapH = { status: "error", message: "Out of bounds (0.1–4.0m)" };
      } else if (cap.h > 2.0) {
        vCapH = { status: "warning", message: "Deep capping beam (>2m)" };
      }
    }

    // Roadway & Out-to-out width
    let vRoad: ValidationResult = { status: "valid", message: "Standard roadway" };
    let vTotalW: ValidationResult = { status: "valid", message: "Valid out-to-out" };
    if (g.roadWidth <= 0 || g.roadWidth > 50) {
      vRoad = { status: "error", message: "Out of bounds (0–50m)" };
    }
    if (g.totalWidth <= 0 || g.totalWidth > 60) {
      vTotalW = { status: "error", message: "Out of bounds" };
    } else if (g.totalWidth < g.roadWidth) {
      vTotalW = { status: "warning", message: "Total width < road width" };
    }

    // Auto-embedment limits
    let vDMinMax: ValidationResult = { status: "valid", message: "Valid search range" };
    if (g.dMin >= g.dMax) {
      vDMinMax = { status: "error", message: "Dmin must be strictly less than Dmax" };
    } else if (g.dStep <= 0 || g.dStep > 2) {
      vDMinMax = { status: "error", message: "Step must be between 0.01 and 2m" };
    }

    // Surcharge q UDL
    let vQ: ValidationResult = { status: "valid", message: "Normal design surcharge" };
    if (tr.q < 0 || tr.q > 250) {
      vQ = { status: "error", message: "Out of bounds (0–250 kPa)" };
    } else if (tr.q > 40) {
      vQ = { status: "warning", message: "Heavy surcharge (>40 kPa: crane / heavy industrial)" };
    }

    // Axle Load
    let vAxle: ValidationResult = { status: "valid", message: "Standard highway/urban axle" };
    if (tr.axleLoad < 0 || tr.axleLoad > 1000) {
      vAxle = { status: "error", message: "Out of bounds (0–1000 kN)" };
    } else if (tr.axleLoad > 350) {
      vAxle = { status: "warning", message: "Heavy axle (>350 kN: heavy mining / special transport)" };
    }

    // Setback Offset
    let vOffset: ValidationResult = { status: "valid", message: "Typical traffic setback" };
    const xOff = tr.offsetFromWall ?? 1.5;
    if (xOff < 0 || xOff > 30) {
      vOffset = { status: "error", message: "Out of bounds (0–30m)" };
    } else if (xOff < 0.5) {
      vOffset = { status: "warning", message: "Very close to crest (<0.5m: direct lateral pressure)" };
    } else if (xOff > 15) {
      vOffset = { status: "warning", message: "Far field (>15m: minimal lateral thrust on stem)" };
    }

    // Tire Footprint
    let vFootprint: ValidationResult = { status: "valid", message: "Standard contact width" };
    const bFoot = tr.footprintB ?? 2.0;
    if (bFoot <= 0 || bFoot > 10) {
      vFootprint = { status: "error", message: "Out of bounds (0.1–10m)" };
    }

    // Construction Plant & Stockpile
    let vPlant: ValidationResult = { status: "valid", message: tr.plantLoad ? "Active plant load" : "No plant load" };
    if ((tr.plantLoad ?? 0) < 0 || (tr.plantLoad ?? 0) > 300) {
      vPlant = { status: "error", message: "Out of bounds (0–300 kPa)" };
    } else if ((tr.plantLoad ?? 0) > 50) {
      vPlant = { status: "warning", message: "High plant load (>50 kPa)" };
    }

    let vStock: ValidationResult = { status: "valid", message: tr.stockpile ? "Active stockpile" : "No stockpile" };
    if ((tr.stockpile ?? 0) < 0 || (tr.stockpile ?? 0) > 300) {
      vStock = { status: "error", message: "Out of bounds (0–300 kPa)" };
    } else if ((tr.stockpile ?? 0) > 40) {
      vStock = { status: "warning", message: "Heavy soil stockpile (>40 kPa)" };
    }

    // Tie Rod Anchor
    let vTieElev: ValidationResult = { status: "valid", message: "Valid anchor elevation" };
    let vTieSpacing: ValidationResult = { status: "valid", message: "Standard waler spacing" };
    let vTieDia: ValidationResult = { status: "valid", message: "Standard bar diameter" };
    if (primaryTie) {
      if (primaryTie.elevation <= riverbed) {
        vTieElev = { status: "error", message: "Anchor level is below excavation line!" };
      } else if (primaryTie.elevation > crestEl) {
        vTieElev = { status: "error", message: "Anchor level is above wall crest!" };
      } else if (crestEl - primaryTie.elevation < 0.5) {
        vTieElev = { status: "warning", message: "Near crest (<0.5m: limited passive wedge resistance)" };
      }

      if (primaryTie.spacing <= 0.2 || primaryTie.spacing > 10) {
        vTieSpacing = { status: "error", message: "Out of bounds (0.5–10m)" };
      } else if (primaryTie.spacing > 4.0) {
        vTieSpacing = { status: "warning", message: "Wide spacing (>4.0m: large waler beam needed)" };
      }

      if (primaryTie.diameter < 16 || primaryTie.diameter > 120) {
        vTieDia = { status: "error", message: "Out of bounds (16–120mm)" };
      }
    }

    // Groundwater
    let vWaterUp: ValidationResult = { status: "valid", message: "Valid upstream GWL" };
    let vWaterDown: ValidationResult = { status: "valid", message: "Valid downstream GWL" };
    if (p.water.dryUp > crestEl + 0.5) {
      vWaterUp = { status: "warning", message: "GWL exceeds crest elevation" };
    } else if (p.water.dryUp < riverbed) {
      vWaterUp = { status: "warning", message: "GWL below excavation bed" };
    }

    if (p.water.dryDown > riverbed + 0.2) {
      vWaterDown = { status: "warning", message: "Ponding water in excavation" };
    }

    return {
      vH,
      vD,
      vT,
      vRiver,
      vCapB,
      vCapH,
      vRoad,
      vTotalW,
      vDMinMax,
      vQ,
      vAxle,
      vOffset,
      vFootprint,
      vPlant,
      vStock,
      vTieElev,
      vTieSpacing,
      vTieDia,
      vWaterUp,
      vWaterDown,
    };
  }, [g, H, D, t, riverbed, crestEl, cap, tr, primaryTie, p.water]);

  // Approximate active thrust resultant for visual representation
  const phi_deg = p.nativeLayers[0]?.phi ?? 30;
  const phi_rad = (phi_deg * Math.PI) / 180;
  const Ka_approx = Math.tan(Math.PI / 4 - phi_rad / 2) ** 2;
  const gamma_approx = p.nativeLayers[0]?.gamma ?? 19;
  const Pa_approx = 0.5 * gamma_approx * H * H * Ka_approx + q_udl * H * Ka_approx;
  const z_Pa = riverbed + H / 3;

  // Passive resistance approximation
  const Kp_approx = Math.tan(Math.PI / 4 + phi_rad / 2) ** 2;
  const Pp_approx = 0.5 * gamma_approx * D * D * Kp_approx;
  const z_Pp = riverbed - D / 3;

  // Graphic SVG scale and coordinate system
  // Retained crest at z = crestEl, Toe at z = toeEl
  const marginZ = 1.6;
  const maxZ = crestEl + capH + marginZ;
  const minZ = toeEl - 1.2;
  const spanZ = maxZ - minZ;

  // Horizontal range: from -6m (excavation side) to +9m (retained soil side)
  const minX = -5.5;
  const maxX = Math.max(8.5, x_offset + b_footprint + 3.0);
  const spanX = maxX - minX;

  const svgW = 680;
  const svgH = 550;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 40;
  const padBottom = 40;
  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;

  // Scale transformers: real world meters (x, z) -> SVG pixels (px, py)
  const toSvgX = (x: number) => padLeft + ((x - minX) / spanX) * plotW;
  const toSvgY = (z: number) => padTop + ((maxZ - z) / spanZ) * plotH;

  // Key coordinate milestones
  const wallFaceX = 0; // Backface of retaining wall is at x = 0
  const wallFrontX = -t; // Front face (excavation face) is at x = -t
  const wallPxL = toSvgX(wallFrontX);
  const wallPxR = toSvgX(wallFaceX);
  const wallPxWidth = Math.max(12, wallPxR - wallPxL);

  const crestPy = toSvgY(crestEl);
  const dredgePy = toSvgY(riverbed);
  const toePy = toSvgY(toeEl);
  const capTopPy = toSvgY(crestEl + capH);

  // Surcharge arrow generator
  const surchargeArrows = useMemo(() => {
    if (q_udl <= 0) return [];
    const arrows = [];
    const startX = 0.3;
    const endX = maxX - 0.5;
    const count = Math.min(16, Math.max(5, Math.floor((endX - startX) / 0.8)));
    const step = (endX - startX) / (count - 1);
    for (let i = 0; i < count; i++) {
      const x = startX + i * step;
      arrows.push(x);
    }
    return arrows;
  }, [q_udl, maxX]);

  return (
    <div className="space-y-6">
      {/* TOP KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Wall Thickness t</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-white">{(t * 1000).toFixed(0)}</span>
            <span className="text-xs text-cyan-400">mm</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">t = {t.toFixed(2)} m · {isCbp ? `CBP Ø${cbpDia * 1000}` : "Sheet Pile"}</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Retained Height H</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-cyan-300">{H.toFixed(2)}</span>
            <span className="text-xs text-cyan-400">m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Crest: +{crestEl.toFixed(2)} m RL</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Embedment D</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-cyan-300">{D.toFixed(2)}</span>
            <span className="text-xs text-cyan-400">m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Toe: {toeEl >= 0 ? "+" : ""}{toeEl.toFixed(2)} m RL</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Wall Length L</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-white">{L.toFixed(2)}</span>
            <span className="text-xs text-cyan-400">m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">D/H = {(D / H).toFixed(2)} ({D >= 0.8 * H ? "Robust" : "Slender"})</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Surcharge q</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-amber-300">{q_udl.toFixed(1)}</span>
            <span className="text-xs text-amber-400">kPa</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Axle: {q_axle} kN @ {x_offset.toFixed(1)}m</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-[#081222]/90 p-3.5 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Support System</p>
          <div className="flex items-baseline gap-1 mt-1 truncate">
            <span className="text-sm font-bold text-emerald-300 truncate">
              {primaryTie ? `Tie Rod Ø${primaryTie.diameter}mm` : "Cantilever Wall"}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            {primaryTie ? `@ El +${tieElev.toFixed(2)}m RL` : "Unpropped stem"}
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: CONTROLS & LIVE SIDE-BY-SIDE GRAPHICAL PREVIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(380px,0.88fr)_minmax(600px,1.12fr)] gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE GEOMETRY & LOAD PARAMETER INPUTS */}
        <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <div className="border-b border-cyan-900/60 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-cyan-400" />
                Input Specifications
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-[10px] font-mono text-cyan-300">
                EN 1997-1 / BS 8002
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              Wall Geometry & Load Inputs
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Adjust wall thickness, embedment, retained height, traffic point loads, and surcharge parameters with immediate real-time rendering.
            </p>
          </div>

          {/* Navigation Pill Tabs for Input Categories */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#040910] border border-slate-800 rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveInputSection("geometry")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition flex items-center justify-center gap-1.5 ${
                activeInputSection === "geometry"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Ruler className="size-3.5" />
              1. Geometry
            </button>
            <button
              type="button"
              onClick={() => setActiveInputSection("loads")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition flex items-center justify-center gap-1.5 ${
                activeInputSection === "loads"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowDown className="size-3.5" />
              2. Loads
            </button>
            <button
              type="button"
              onClick={() => setActiveInputSection("anchors")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition flex items-center justify-center gap-1.5 ${
                activeInputSection === "anchors"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Anchor className="size-3.5" />
              3. Anchors
            </button>
            <button
              type="button"
              onClick={() => setActiveInputSection("water")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition flex items-center justify-center gap-1.5 ${
                activeInputSection === "water"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Waves className="size-3.5" />
              4. Water
            </button>
          </div>

          <div className="space-y-5 font-mono text-xs">
            {/* TAB 1: WALL GEOMETRY PARAMETERS */}
            {activeInputSection === "geometry" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Wall System Selection */}
                <div className="bg-[#040910] p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                    Retaining Wall System
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => patch((q) => { q.wallSystem = "sheet-pile"; })}
                      className={`p-2 rounded-lg border text-left transition ${
                        !isCbp
                          ? "border-cyan-400 bg-cyan-950/60 text-cyan-200 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">Sheet Pile Wall</span>
                      <span className="text-[10px] text-slate-400">Interlocking steel/concrete piles</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => patch((q) => { q.wallSystem = "cbp"; })}
                      className={`p-2 rounded-lg border text-left transition ${
                        isCbp
                          ? "border-cyan-400 bg-cyan-950/60 text-cyan-200 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">Contiguous Bored Pile (CBP)</span>
                      <span className="text-[10px] text-slate-400">RC bored piles with spacing</span>
                    </button>
                  </div>
                </div>

                {/* Wall Thickness with Quick Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Wall Thickness t</span>
                    <div className="flex items-center gap-2">
                      <ValidationStatusBadge status={validation.vT.status} message={validation.vT.message} />
                      <span className="text-cyan-400 font-bold">{(t * 1000).toFixed(0)} mm</span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[0.4, 0.6, 0.8, 1.0, 1.2, 1.5].map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => patch((q) => { q.geometry.wallThickness = th; })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition font-bold border ${
                          Math.abs(t - th) < 0.01
                            ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20"
                            : "bg-[#040910] text-slate-300 border-slate-700 hover:border-cyan-700 hover:text-cyan-200"
                        }`}
                      >
                        {(th * 1000).toFixed(0)}mm
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="3.0"
                      value={g.wallThickness}
                      onChange={(e) =>
                        patch((q) => {
                          q.geometry.wallThickness = Math.max(0.1, parseFloat(e.target.value) || 0.6);
                        })
                      }
                      className={`w-full rounded-lg border bg-[#040910] p-2.5 text-white font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vT.status)}`}
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                      {validation.vT.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                      {validation.vT.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                      {validation.vT.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                      <span className="text-slate-500 text-xs">m</span>
                    </div>
                  </div>
                </div>

                {/* Retained Height & Embedment Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Retained Height H</span>
                      <ValidationStatusBadge status={validation.vH.status} message={validation.vH.message} />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.25"
                        min="1"
                        max="30"
                        value={g.retainedHeight}
                        onChange={(e) =>
                          patch((q) => {
                            q.geometry.retainedHeight = Math.max(1, parseFloat(e.target.value) || 6);
                          })
                        }
                        className={`w-full rounded-lg border bg-[#040910] p-2.5 text-cyan-300 font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vH.status)}`}
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        {validation.vH.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                        {validation.vH.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                        {validation.vH.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                        <span className="text-slate-500 text-xs">m</span>
                      </div>
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Embedment Depth D</span>
                      <ValidationStatusBadge status={validation.vD.status} message={validation.vD.message} />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.25"
                        min="0.5"
                        max="30"
                        value={g.embedment}
                        onChange={(e) =>
                          patch((q) => {
                            q.geometry.embedment = Math.max(0.5, parseFloat(e.target.value) || 5);
                          })
                        }
                        className={`w-full rounded-lg border bg-[#040910] p-2.5 text-cyan-300 font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vD.status)}`}
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        {validation.vD.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                        {validation.vD.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                        {validation.vD.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                        <span className="text-slate-500 text-xs">m</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Embedment Quick Stepper */}
                <div className="flex items-center justify-between text-[11px] bg-[#040910] p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Quick Embedment Stepper:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => patch((q) => { q.geometry.embedment = Math.max(0.5, q.geometry.embedment - 0.5); })}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      title="Decrease embedment by 0.5m"
                    >
                      -0.5m
                    </button>
                    <button
                      type="button"
                      onClick={() => patch((q) => { q.geometry.embedment = q.geometry.embedment + 0.5; })}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      title="Increase embedment by 0.5m"
                    >
                      +0.5m
                    </button>
                    <button
                      type="button"
                      onClick={() => patch((q) => { q.geometry.embedment = q.geometry.embedment + 1.0; })}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      title="Increase embedment by 1.0m"
                    >
                      +1.0m
                    </button>
                  </div>
                </div>

                {/* Capping Beam Section */}
                <div className="border-t border-slate-800/80 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                      <Layers className="size-3 text-cyan-400" />
                      Capping Beam at Crest
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cap.enabled}
                        onChange={(e) => patch((q) => { q.capping.enabled = e.target.checked; })}
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-[10px] text-slate-400">Enable</span>
                    </label>
                  </div>

                  {cap.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Beam Width b</span>
                          <ValidationStatusBadge status={validation.vCapB.status} message={validation.vCapB.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.05"
                            value={cap.b}
                            onChange={(e) => patch((q) => { q.capping.b = parseFloat(e.target.value) || 0.8; })}
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vCapB.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m</span>
                        </div>
                      </label>
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Beam Height h</span>
                          <ValidationStatusBadge status={validation.vCapH.status} message={validation.vCapH.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.05"
                            value={cap.h}
                            onChange={(e) => patch((q) => { q.capping.h = parseFloat(e.target.value) || 0.6; })}
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vCapH.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m</span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Riverbed / Excavation Level Datum */}
                <div className="border-t border-slate-800/80 pt-3">
                  <label className="block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-400">Excavation / Riverbed Formation</span>
                      <ValidationStatusBadge status={validation.vRiver.status} message={validation.vRiver.message} />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={g.riverbed}
                        onChange={(e) => patch((q) => { q.geometry.riverbed = parseFloat(e.target.value) || 0; })}
                        className={`w-full rounded-lg border bg-[#040910] p-2.5 text-emerald-300 font-bold focus:outline-none ${getInputStatusBorder(validation.vRiver.status)}`}
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        {validation.vRiver.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                        {validation.vRiver.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                        {validation.vRiver.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                        <span className="text-slate-500 text-xs">m RL</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Additional Dimensions & Auto Embedment Search Range */}
                <details className="border-t border-slate-800/80 pt-3 group">
                  <summary className="cursor-pointer text-slate-400 hover:text-cyan-300 text-[11px] font-bold uppercase flex items-center justify-between">
                    <span>Roadway Widths & Auto-Embedment Search Limits</span>
                    <span className="text-[10px] text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Roadway Width</span>
                          <ValidationStatusBadge status={validation.vRoad.status} message={validation.vRoad.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            value={g.roadWidth}
                            onChange={(e) => patch((q) => { q.geometry.roadWidth = parseFloat(e.target.value) || 7.0; })}
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vRoad.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m</span>
                        </div>
                      </label>
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Out-to-out Width</span>
                          <ValidationStatusBadge status={validation.vTotalW.status} message={validation.vTotalW.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            value={g.totalWidth}
                            onChange={(e) => patch((q) => { q.geometry.totalWidth = parseFloat(e.target.value) || 9.5; })}
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vTotalW.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m</span>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Search Bounds Range:</span>
                        <ValidationStatusBadge status={validation.vDMinMax.status} message={validation.vDMinMax.message} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="block">
                          <span className="mb-1 block text-slate-400 text-[10px]">D Min (auto)</span>
                          <input
                            type="number"
                            step="0.5"
                            value={g.dMin}
                            onChange={(e) => patch((q) => { q.geometry.dMin = parseFloat(e.target.value) || 3.0; })}
                            className="w-full rounded-lg border border-slate-700 bg-[#040910] p-1.5 text-xs text-white font-bold"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-slate-400 text-[10px]">D Max (auto)</span>
                          <input
                            type="number"
                            step="0.5"
                            value={g.dMax}
                            onChange={(e) => patch((q) => { q.geometry.dMax = parseFloat(e.target.value) || 12.0; })}
                            className="w-full rounded-lg border border-slate-700 bg-[#040910] p-1.5 text-xs text-white font-bold"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-slate-400 text-[10px]">D Step (m)</span>
                          <input
                            type="number"
                            step="0.05"
                            value={g.dStep}
                            onChange={(e) => patch((q) => { q.geometry.dStep = parseFloat(e.target.value) || 0.1; })}
                            className="w-full rounded-lg border border-slate-700 bg-[#040910] p-1.5 text-xs text-white font-bold"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            )}

            {/* TAB 2: SURCHARGE & TRAFFIC LOAD PARAMETERS */}
            {activeInputSection === "loads" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Uniform Surcharge q */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Uniform Surcharge q (UDL)</span>
                    <div className="flex items-center gap-2">
                      <ValidationStatusBadge status={validation.vQ.status} message={validation.vQ.message} />
                      <span className="text-amber-300 font-bold">{q_udl} kPa</span>
                    </div>
                  </div>

                  {/* Surcharge presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Pedestrian", val: 5 },
                      { label: "Light Traffic", val: 10 },
                      { label: "Highway", val: 20 },
                      { label: "Crane Zone", val: 35 },
                    ].map((pItem) => (
                      <button
                        key={pItem.val}
                        type="button"
                        onClick={() => patch((q) => { q.traffic.q = pItem.val; })}
                        className={`px-2 py-1 rounded-lg text-[10px] transition font-bold border ${
                          Math.abs(q_udl - pItem.val) < 0.1
                            ? "bg-amber-500 text-slate-950 border-amber-300"
                            : "bg-[#040910] text-slate-300 border-slate-700 hover:border-amber-700"
                        }`}
                      >
                        {pItem.label} ({pItem.val} kPa)
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="200"
                      value={tr.q}
                      onChange={(e) => patch((q) => { q.traffic.q = Math.max(0, parseFloat(e.target.value) || 0); })}
                      className={`w-full rounded-lg border bg-[#040910] p-2.5 text-amber-300 font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vQ.status)}`}
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                      {validation.vQ.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                      {validation.vQ.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                      {validation.vQ.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                      <span className="text-slate-500 text-xs">kN/m² (kPa)</span>
                    </div>
                  </div>
                </div>

                {/* Traffic Axle Load & Application Point */}
                <div className="border-t border-slate-800/80 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                      <Truck className="size-3.5 text-rose-400" />
                      Traffic Axle / Strip Load Point
                    </span>
                    <span className="text-[10px] text-rose-300 font-bold">Q_axle = {q_axle} kN</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Axle Load Q_k</span>
                        <ValidationStatusBadge status={validation.vAxle.status} message={validation.vAxle.message} />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          max="1000"
                          value={tr.axleLoad}
                          onChange={(e) => patch((q) => { q.traffic.axleLoad = Math.max(0, parseFloat(e.target.value) || 0); })}
                          className={`w-full rounded-lg border bg-[#040910] p-2.5 text-rose-300 font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vAxle.status)}`}
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                          {validation.vAxle.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                          {validation.vAxle.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                          {validation.vAxle.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                          <span className="text-slate-500 text-xs">kN</span>
                        </div>
                      </div>
                    </label>

                    <label className="block">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Offset from Wall</span>
                        <ValidationStatusBadge status={validation.vOffset.status} message={validation.vOffset.message} />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={tr.offsetFromWall ?? 1.5}
                          onChange={(e) => patch((q) => { q.traffic.offsetFromWall = Math.max(0, parseFloat(e.target.value) || 0); })}
                          className={`w-full rounded-lg border bg-[#040910] p-2.5 text-cyan-300 font-bold text-sm focus:outline-none ${getInputStatusBorder(validation.vOffset.status)}`}
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                          {validation.vOffset.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                          {validation.vOffset.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                          {validation.vOffset.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                          <span className="text-slate-500 text-xs">m</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-slate-400">Tire Footprint B</span>
                        <ValidationStatusBadge status={validation.vFootprint.status} message={validation.vFootprint.message} />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.2"
                          max="5.0"
                          value={tr.footprintB ?? 2.0}
                          onChange={(e) => patch((q) => { q.traffic.footprintB = Math.max(0.2, parseFloat(e.target.value) || 2.0); })}
                          className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vFootprint.status)}`}
                        />
                        <span className="absolute right-3 top-2 text-slate-500 text-xs">m</span>
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-slate-400">Dynamic Amplification DAF</span>
                      <input
                        type="number"
                        step="0.05"
                        min="1.0"
                        max="2.0"
                        value={tr.DAF ?? 1.2}
                        onChange={(e) => patch((q) => { q.traffic.DAF = Math.max(1.0, parseFloat(e.target.value) || 1.0); })}
                        className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2 text-white font-bold"
                      />
                    </label>
                  </div>
                </div>

                {/* Construction Plant & Stockpile Surcharges */}
                <div className="border-t border-slate-800/80 pt-3 space-y-3">
                  <span className="text-[11px] font-bold text-slate-300 block uppercase">
                    Construction & Secondary Actions
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-slate-400">Plant / Crane Load</span>
                        <ValidationStatusBadge status={validation.vPlant.status} message={validation.vPlant.message} />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="5"
                          min="0"
                          value={tr.plantLoad ?? 0}
                          onChange={(e) => patch((q) => { q.traffic.plantLoad = Math.max(0, parseFloat(e.target.value) || 0); })}
                          className={`w-full rounded-lg border bg-[#040910] p-2 text-purple-300 font-bold ${getInputStatusBorder(validation.vPlant.status)}`}
                        />
                        <span className="absolute right-3 top-2 text-slate-500 text-xs">kPa</span>
                      </div>
                    </label>
                    <label className="block">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-slate-400">Soil Stockpile Load</span>
                        <ValidationStatusBadge status={validation.vStock.status} message={validation.vStock.message} />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="5"
                          min="0"
                          value={tr.stockpile ?? 0}
                          onChange={(e) => patch((q) => { q.traffic.stockpile = Math.max(0, parseFloat(e.target.value) || 0); })}
                          className={`w-full rounded-lg border bg-[#040910] p-2 text-amber-200 font-bold ${getInputStatusBorder(validation.vStock.status)}`}
                        />
                        <span className="absolute right-3 top-2 text-slate-500 text-xs">kPa</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIE RODS & ANCHOR RESTRAINT */}
            {activeInputSection === "anchors" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between bg-[#040910] p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Tie Rod / Prop Anchor System</span>
                    <span className="text-[10px] text-slate-400">Transfers lateral wall thrust to ground deadman</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      patch((q) => {
                        if (q.ties.length === 0) {
                          q.ties.push({
                            id: "T1",
                            name: "Anchor Row 1",
                            elevation: crestEl - 1.5,
                            diameter: 40,
                            spacing: 2.5,
                            fyk: 500,
                            fy: 500,
                            fu: 600,
                            corrosion: 1.0,
                            threadEff: 0.9,
                            connectionEff: 0.95,
                            inclination: 15,
                            capacity_kN: 250,
                            enabled: true,
                          });
                        } else {
                          q.ties[0].enabled = !q.ties[0].enabled;
                        }
                      })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                      primaryTie
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {primaryTie ? "Anchor ACTIVE" : "ENABLE Anchor"}
                  </button>
                </div>

                {primaryTie && (
                  <div className="space-y-3 bg-[#040a14] p-3 rounded-xl border border-cyan-900/60">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Anchor Elevation</span>
                          <ValidationStatusBadge status={validation.vTieElev.status} message={validation.vTieElev.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.25"
                            value={primaryTie.elevation}
                            onChange={(e) =>
                              patch((q) => {
                                if (q.ties[0]) q.ties[0].elevation = parseFloat(e.target.value) || crestEl - 1.5;
                              })
                            }
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-cyan-300 font-bold ${getInputStatusBorder(validation.vTieElev.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m RL</span>
                        </div>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-slate-400">Depth Below Crest (m)</span>
                        <input
                          type="number"
                          step="0.25"
                          value={tieDepthFromCrest}
                          onChange={(e) => {
                            const d = parseFloat(e.target.value) || 1.5;
                            patch((q) => {
                              if (q.ties[0]) q.ties[0].elevation = crestEl - d;
                            });
                          }}
                          className="w-full rounded-lg border border-slate-700 bg-[#040910] p-2 text-white font-bold"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Bar Diameter Ø</span>
                          <ValidationStatusBadge status={validation.vTieDia.status} message={validation.vTieDia.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="5"
                            value={primaryTie.diameter}
                            onChange={(e) =>
                              patch((q) => {
                                if (q.ties[0]) q.ties[0].diameter = parseFloat(e.target.value) || 40;
                              })
                            }
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vTieDia.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">mm</span>
                        </div>
                      </label>
                      <label className="block">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-slate-400">Anchor Spacing</span>
                          <ValidationStatusBadge status={validation.vTieSpacing.status} message={validation.vTieSpacing.message} />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.25"
                            value={primaryTie.spacing}
                            onChange={(e) =>
                              patch((q) => {
                                if (q.ties[0]) q.ties[0].spacing = parseFloat(e.target.value) || 2.5;
                              })
                            }
                            className={`w-full rounded-lg border bg-[#040910] p-2 text-white font-bold ${getInputStatusBorder(validation.vTieSpacing.status)}`}
                          />
                          <span className="absolute right-3 top-2 text-slate-500 text-xs">m c/c</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GROUNDWATER LEVELS */}
            {activeInputSection === "water" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-[11px] font-bold text-slate-300 block uppercase">
                  Groundwater Table Surface Elevations
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-400">Retained / Upstream GWL</span>
                      <ValidationStatusBadge status={validation.vWaterUp.status} message={validation.vWaterUp.message} />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.25"
                        value={p.water.dryUp}
                        onChange={(e) => patch((q) => { q.water.dryUp = parseFloat(e.target.value) || 0; })}
                        className={`w-full rounded-lg border bg-[#040910] p-2.5 text-sky-300 font-bold focus:outline-none ${getInputStatusBorder(validation.vWaterUp.status)}`}
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        {validation.vWaterUp.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                        {validation.vWaterUp.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                        {validation.vWaterUp.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                        <span className="text-slate-500 text-xs">m RL</span>
                      </div>
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-400">Excavation / Downstream GWL</span>
                      <ValidationStatusBadge status={validation.vWaterDown.status} message={validation.vWaterDown.message} />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.25"
                        value={p.water.dryDown}
                        onChange={(e) => patch((q) => { q.water.dryDown = parseFloat(e.target.value) || 0; })}
                        className={`w-full rounded-lg border bg-[#040910] p-2.5 text-sky-300 font-bold focus:outline-none ${getInputStatusBorder(validation.vWaterDown.status)}`}
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 pointer-events-none">
                        {validation.vWaterDown.status === "valid" && <CheckCircle2 className="size-3.5 text-emerald-400/80" />}
                        {validation.vWaterDown.status === "warning" && <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />}
                        {validation.vWaterDown.status === "error" && <AlertCircle className="size-3.5 text-rose-400" />}
                        <span className="text-slate-500 text-xs">m RL</span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="p-3 bg-[#040a14] rounded-xl border border-sky-900/40 text-[11px] text-slate-400">
                  <p className="font-bold text-sky-300 mb-1">Hydrostatic Differential</p>
                  <p>
                    Differential head Δh = {Math.max(0, p.water.dryUp - p.water.dryDown).toFixed(2)} m.
                    Generates lateral water pressure that directly increases bending moment in the wall.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Live Audit Summary Box */}
            <div className="rounded-xl border border-cyan-900/60 bg-gradient-to-br from-[#051120] to-[#040a14] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">Wall Stability Indicators:</span>
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                  REAL-TIME SYNCHRONIZED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Total Wall Length (L = H + D):</span>
                <strong className="text-cyan-300 font-mono font-bold">{L.toFixed(2)} m</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Wall Slenderness Ratio (H / t):</span>
                <strong className="text-white font-mono font-bold">{(H / t).toFixed(1)}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Total Surcharge on Backfill:</span>
                <strong className="text-amber-300 font-mono font-bold">{(q_udl + q_plant + q_stock).toFixed(1)} kPa</strong>
              </div>
              {isCbp && (
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>CBP Pile Geometry:</span>
                  <strong className="text-cyan-300 font-mono font-bold">Ø{(cbpDia * 1000).toFixed(0)}mm @ {cbpSpacing.toFixed(2)}m c/c</strong>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME SIDE-BY-SIDE GRAPHICAL PREVIEW OF WALL & LOADS */}
        <section className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
          {/* Header with Live Status & Mode Selector */}
          <div className="flex flex-wrap items-start justify-between border-b border-cyan-900/60 pb-4 gap-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="size-3 text-cyan-400" />
                Engineering Elevation Cross-Section
              </p>
              <h2 className="font-display text-xl font-bold text-white mt-1">
                Wall Geometry & Load Vectors
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Side-by-side graphical preview updating in real-time with wall thickness, embedment, and load application points.
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-mono text-[11px] text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE PREVIEW
            </span>
          </div>

          {/* Interactive Preview Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#040e1d] border border-cyan-900/60 font-mono text-xs shadow-inner">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-300 font-bold text-[11px]">
                <Eye className="size-3.5 text-cyan-400" />
                View Filter:
              </span>

              {/* View Mode */}
              <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  className={`px-2 py-0.5 rounded transition ${
                    viewMode === "all"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Full Schematic
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("loads")}
                  className={`px-2 py-0.5 rounded transition ${
                    viewMode === "loads"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Loads Focus
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("geometry")}
                  className={`px-2 py-0.5 rounded transition ${
                    viewMode === "geometry"
                      ? "bg-cyan-950 text-cyan-200 font-bold border border-cyan-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Geometry Focus
                </button>
              </div>

              {/* Gridlines Toggle */}
              <button
                type="button"
                onClick={() => setShowGrid((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                  showGrid
                    ? "bg-slate-900 border-cyan-800/80 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Toggle alignment grid"
              >
                <Grid className="size-3 text-cyan-400" />
                <span>Grid: {showGrid ? "ON" : "OFF"}</span>
              </button>

              {/* Stress Dispersion Toggle */}
              <button
                type="button"
                onClick={() => setShowDispersion((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                  showDispersion
                    ? "bg-slate-900 border-cyan-800/80 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Toggle traffic load 45° stress dispersion lines"
              >
                <Zap className="size-3 text-cyan-400" />
                <span>Dispersion: {showDispersion ? "ON" : "OFF"}</span>
              </button>

              {/* Vertical Ruler Toggle */}
              <button
                type="button"
                onClick={() => setShowRuler((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                  showRuler
                    ? "bg-slate-900 border-cyan-800/80 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Toggle vertical elevation & depth ruler"
              >
                <Ruler className="size-3 text-cyan-400" />
                <span>Ruler: {showRuler ? "ON" : "OFF"}</span>
              </button>

              {/* Pressure Distribution Overlay Toggle */}
              <button
                type="button"
                onClick={() => setShowPressureOverlay((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] transition border flex items-center gap-1 ${
                  showPressureOverlay
                    ? "bg-slate-900 border-amber-500/80 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Toggle theoretical pressure distribution lines overlay over soil/wall system"
              >
                <Activity className="size-3 text-amber-400" />
                <span>Overlay: {showPressureOverlay ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* Probe Readout */}
            {hoverProbe && (
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/70 text-cyan-200 text-[11px] font-bold shadow-sm">
                Probe: x={hoverProbe.x.toFixed(2)}m, z={hoverProbe.z.toFixed(2)}m · {hoverProbe.label}
              </span>
            )}
          </div>

          {/* REAL-TIME SVG GRAPHICAL PREVIEW */}
          <div className="rounded-xl border border-slate-700/80 bg-[#040910] p-4 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-slate-200">
                  {isCbp ? "CONTIGUOUS BORED PILE WALL" : "SHEET PILE RETAINING WALL"}
                </span>
                <span className="text-cyan-400 font-bold">
                  t = {(t * 1000).toFixed(0)}mm · H = {H.toFixed(2)}m · D = {D.toFixed(2)}m
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                Toe El: {toeEl >= 0 ? "+" : ""}{toeEl.toFixed(2)} m RL
              </span>
            </div>

            <div className="relative overflow-visible">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full h-[520px] overflow-visible select-none"
                role="img"
                aria-label="Real-time graphical preview of wall geometry and load application points"
                onMouseMove={(e) => {
                  const svg = e.currentTarget;
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const ctm = svg.getScreenCTM();
                  if (ctm) {
                    const svgPoint = pt.matrixTransform(ctm.inverse());
                    // Inverse mapping from SVG to real world
                    const realX = minX + ((svgPoint.x - padLeft) / plotW) * spanX;
                    const realZ = maxZ - ((svgPoint.y - padTop) / plotH) * spanZ;

                    let label = "Free Air / Atmosphere";
                    if (realZ < toeEl) {
                      label = "Sub-Toe Founding Strata";
                    } else if (realX >= wallFrontX && realX <= wallFaceX && realZ <= crestEl + capH && realZ >= toeEl) {
                      label = `Retaining Wall Stem (${realZ >= riverbed ? "Retained Zone" : "Embedded Zone"})`;
                    } else if (realX > wallFaceX && realZ <= crestEl) {
                      label = "Retained Granular Backfill";
                    } else if (realX < wallFrontX && realZ <= riverbed) {
                      label = "Passive Excavation Soil";
                    } else if (realX < wallFrontX && realZ > riverbed && realZ <= crestEl) {
                      label = "Excavation Basin (Clear Void)";
                    }

                    setHoverProbe({ x: realX, z: realZ, label });
                  }
                }}
                onMouseLeave={() => setHoverProbe(null)}
              >
                <defs>
                  {/* Arrow markers */}
                  <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#f59e0b" />
                  </marker>
                  <marker id="arrow-rose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#f43f5e" />
                  </marker>
                  <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#06b6d4" />
                  </marker>
                  <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-emerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#10b981" />
                  </marker>

                  {/* Patterns */}
                  <pattern id="rc-wall-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#475569" strokeWidth="1.2" opacity="0.6" />
                    <line x1="0" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="0.8" opacity="0.4" />
                  </pattern>
                  <pattern id="cbp-circles" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="8" cy="8" r="6" fill="#334155" stroke="#06b6d4" strokeWidth="0.8" opacity="0.7" />
                  </pattern>
                  <pattern id="backfill-hatch" width="14" height="14" patternUnits="userSpaceOnUse">
                    <path d="M2 3l3-2M9 6l3-2M4 11l3-2M11 12l2-2" stroke="#d97706" strokeWidth="1.2" opacity="0.4" />
                  </pattern>
                  <pattern id="passive-soil-hatch" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M0 4h16M0 12h16" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                  </pattern>
                </defs>

                {/* 1. BACKGROUND & GRIDLINES */}
                <rect x="0" y="0" width={svgW} height={svgH} fill="#030812" />

                {showGrid && (
                  <g opacity="0.25">
                    {/* Horizontal lines every 2m */}
                    {Array.from({ length: Math.ceil(spanZ / 2) }).map((_, i) => {
                      const z = Math.floor(minZ) + i * 2;
                      const y = toSvgY(z);
                      if (y < padTop || y > svgH - padBottom) return null;
                      return (
                        <line
                          key={`grid-h-${z}`}
                          x1={padLeft}
                          y1={y}
                          x2={svgW - padRight}
                          y2={y}
                          stroke="#38bdf8"
                          strokeWidth="0.8"
                          strokeDasharray="4 4"
                        />
                      );
                    })}
                  </g>
                )}

                {/* 2. RETAINED BACKFILL & PASSIVE SOIL BLOCKS */}
                {viewMode !== "geometry" && (
                  <>
                    {/* Retained Backfill Zone (right of wall) */}
                    <rect
                      x={wallPxR}
                      y={crestPy}
                      width={toSvgX(maxX) - wallPxR}
                      height={toSvgY(minZ) - crestPy}
                      fill="#78592c"
                      fillOpacity="0.2"
                      stroke="#92400e"
                      strokeWidth="0.5"
                    />
                    <rect
                      x={wallPxR}
                      y={crestPy}
                      width={toSvgX(maxX) - wallPxR}
                      height={toSvgY(minZ) - crestPy}
                      fill="url(#backfill-hatch)"
                    />

                    {/* Passive Ground on Excavation Side (left of wall below riverbed) */}
                    <rect
                      x={toSvgX(minX)}
                      y={dredgePy}
                      width={wallPxL - toSvgX(minX)}
                      height={toSvgY(minZ) - dredgePy}
                      fill="#1e293b"
                      fillOpacity="0.35"
                      stroke="#475569"
                      strokeWidth="0.5"
                    />
                    <rect
                      x={toSvgX(minX)}
                      y={dredgePy}
                      width={wallPxL - toSvgX(minX)}
                      height={toSvgY(minZ) - dredgePy}
                      fill="url(#passive-soil-hatch)"
                    />

                    {/* Excavation Void Shading */}
                    <rect
                      x={toSvgX(minX)}
                      y={crestPy}
                      width={wallPxL - toSvgX(minX)}
                      height={dredgePy - crestPy}
                      fill="#020617"
                      fillOpacity="0.5"
                    />
                  </>
                )}

                {/* THEORETICAL PRESSURE DISTRIBUTION OVERLAY */}
                {showPressureOverlay && viewMode !== "geometry" && (
                  <g id="pressure-distribution-overlay" opacity="0.9">
                    {/* Active Earth Pressure on Retained Side (x > 0) */}
                    {(() => {
                      const pCrest = q_udl * Ka_approx;
                      const pDredge = (gamma_approx * H + q_udl) * Ka_approx;
                      const xCrest = wallFaceX + pCrest * 0.08;
                      const xDredge = wallFaceX + pDredge * 0.08;

                      const crestSvgX = toSvgX(wallFaceX);
                      const crestSvgY = crestPy;
                      const dredgeSvgX = toSvgX(wallFaceX);
                      const dredgeSvgY = dredgePy;

                      const pCrestSvgX = toSvgX(xCrest);
                      const pDredgeSvgX = toSvgX(xDredge);

                      return (
                        <g>
                          <polygon
                            points={`${crestSvgX},${crestSvgY} ${pCrestSvgX},${crestSvgY} ${pDredgeSvgX},${dredgeSvgY} ${dredgeSvgX},${dredgeSvgY}`}
                            fill="#f59e0b"
                            fillOpacity="0.22"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                          />
                          {wUp > riverbed && (
                            <polygon
                              points={`${toSvgX(wallFaceX)},${toSvgY(wUp)} ${toSvgX(wallFaceX + Math.max(0, wUp - riverbed) * 0.12)},${toSvgY(wUp)} ${toSvgX(wallFaceX + Math.max(0, wUp - riverbed) * 0.12)},${dredgePy} ${toSvgX(wallFaceX)},${dredgePy}`}
                              fill="#0284c7"
                              fillOpacity="0.25"
                              stroke="#38bdf8"
                              strokeWidth="1.2"
                            />
                          )}
                          <text x={pCrestSvgX + 6} y={crestSvgY + 4} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            Pa(crest) = {pCrest.toFixed(1)} kPa
                          </text>
                          <text x={pDredgeSvgX + 6} y={dredgeSvgY - 4} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            Pa(dredge) = {pDredge.toFixed(1)} kPa
                          </text>
                        </g>
                      );
                    })()}

                    {/* Passive Resistance on Excavation Side (x < 0, below dredge level) */}
                    {(() => {
                      const pToe = gamma_approx * D * Kp_approx;
                      const xToe = wallFrontX - pToe * 0.08;

                      const dredgeSvgX = toSvgX(wallFrontX);
                      const dredgeSvgY = dredgePy;
                      const toeSvgX = toSvgX(wallFrontX);
                      const toeSvgY = toePy;

                      const pToeSvgX = toSvgX(xToe);

                      return (
                        <g>
                          <polygon
                            points={`${dredgeSvgX},${dredgeSvgY} ${pToeSvgX},${toeSvgY} ${toeSvgX},${toeSvgY}`}
                            fill="#10b981"
                            fillOpacity="0.25"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                          />
                          <text x={pToeSvgX - 8} y={toePy - 4} textAnchor="end" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            Pp(toe) = {pToe.toFixed(1)} kPa
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* 3. GROUNDWATER SURFACES */}
                {viewMode !== "geometry" && (
                  <>
                    {/* Upstream / Retained GWL */}
                    {wUp <= crestEl && wUp >= toeEl && (
                      <g>
                        <line
                          x1={wallPxR}
                          y1={toSvgY(wUp)}
                          x2={toSvgX(maxX)}
                          y2={toSvgY(wUp)}
                          stroke="#38bdf8"
                          strokeWidth="1.8"
                          strokeDasharray="6 3"
                        />
                        <polygon
                          points={`${toSvgX(maxX) - 40},${toSvgY(wUp) - 1} ${toSvgX(maxX) - 34},${toSvgY(wUp) - 7} ${toSvgX(maxX) - 28},${toSvgY(wUp) - 1}`}
                          fill="#38bdf8"
                        />
                        <text
                          x={toSvgX(maxX) - 45}
                          y={toSvgY(wUp) - 3}
                          textAnchor="end"
                          fill="#38bdf8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          GWL +{wUp.toFixed(2)}m RL
                        </text>
                      </g>
                    )}

                    {/* Downstream / Excavation GWL */}
                    {wDown >= riverbed && (
                      <g>
                        <line
                          x1={toSvgX(minX)}
                          y1={toSvgY(wDown)}
                          x2={wallPxL}
                          y2={toSvgY(wDown)}
                          stroke="#0284c7"
                          strokeWidth="1.8"
                          strokeDasharray="6 3"
                        />
                        <text
                          x={toSvgX(minX) + 10}
                          y={toSvgY(wDown) - 3}
                          fill="#0284c7"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          Water +{wDown.toFixed(2)}m
                        </text>
                      </g>
                    )}
                  </>
                )}

                {/* 4. GROUND LEVEL & EXCAVATION FORMATION LINES */}
                {/* Retained ground level */}
                <line
                  x1={wallPxR}
                  y1={crestPy}
                  x2={toSvgX(maxX)}
                  y2={crestPy}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                />
                <text
                  x={toSvgX(maxX) - 6}
                  y={crestPy - 6}
                  textAnchor="end"
                  fill="#fbbf24"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  RETAINED GROUND LEVEL · GL +{crestEl.toFixed(2)}m
                </text>

                {/* Dredge line / Excavation level */}
                <line
                  x1={toSvgX(minX)}
                  y1={dredgePy}
                  x2={wallPxL}
                  y2={dredgePy}
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <text
                  x={toSvgX(minX) + 8}
                  y={dredgePy - 6}
                  fill="#34d399"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  EXCAVATION / DREDGE LINE · RL +{riverbed.toFixed(2)}m
                </text>

                {/* 5. RETAINING WALL STEM (MAIN GEOMETRIC PREVIEW) */}
                <g id="wall-geometry-group">
                  {/* Embedded Wall Section */}
                  <rect
                    x={wallPxL}
                    y={dredgePy}
                    width={wallPxWidth}
                    height={toePy - dredgePy}
                    fill={isCbp ? "url(#cbp-circles)" : "url(#rc-wall-hatch)"}
                    stroke="#00f0ff"
                    strokeWidth="1.8"
                  />

                  {/* Cantilever / Retained Stem */}
                  <rect
                    x={wallPxL}
                    y={crestPy}
                    width={wallPxWidth}
                    height={dredgePy - crestPy}
                    fill={isCbp ? "url(#cbp-circles)" : "url(#rc-wall-hatch)"}
                    stroke="#00f0ff"
                    strokeWidth="2"
                  />

                  {/* Capping Beam at Crest (if enabled) */}
                  {cap.enabled && (
                    <g>
                      <rect
                        x={toSvgX(wallFaceX - capB)}
                        y={capTopPy}
                        width={toSvgX(wallFaceX) - toSvgX(wallFaceX - capB)}
                        height={crestPy - capTopPy}
                        fill="#1e293b"
                        stroke="#38bdf8"
                        strokeWidth="1.8"
                      />
                      <text
                        x={(toSvgX(wallFaceX - capB) + wallPxR) / 2}
                        y={capTopPy - 4}
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        CAP {capB * 1000}×{capH * 1000}
                      </text>
                    </g>
                  )}

                  {/* Wall Toe Level Line & Marker */}
                  <line
                    x1={wallPxL - 8}
                    y1={toePy}
                    x2={wallPxR + 8}
                    y2={toePy}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <text
                    x={wallPxR + 12}
                    y={toePy + 4}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    TOE RL {toeEl >= 0 ? "+" : ""}{toeEl.toFixed(2)}m (Depth -{L.toFixed(2)}m)
                  </text>
                </g>

                {/* 6. STRUCTURAL DIMENSIONS */}
                <g id="dimension-callouts" opacity={viewMode === "loads" ? 0.4 : 1}>
                  {/* Wall Thickness Dimension at Crest */}
                  <line
                    x1={wallPxL}
                    y1={crestPy - 14}
                    x2={wallPxR}
                    y2={crestPy - 14}
                    stroke="#00f0ff"
                    strokeWidth="1.2"
                  />
                  <line x1={wallPxL} y1={crestPy - 19} x2={wallPxL} y2={crestPy - 9} stroke="#00f0ff" strokeWidth="1.2" />
                  <line x1={wallPxR} y1={crestPy - 19} x2={wallPxR} y2={crestPy - 9} stroke="#00f0ff" strokeWidth="1.2" />
                  <text
                    x={(wallPxL + wallPxR) / 2}
                    y={crestPy - 18}
                    textAnchor="middle"
                    fill="#00f0ff"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    t = {(t * 1000).toFixed(0)}mm
                  </text>

                  {/* Retained Height H Dimension (Left of wall) */}
                  <g>
                    const dimX = wallPxL - 26;
                    <line x1={wallPxL - 26} y1={crestPy} x2={wallPxL - 26} y2={dredgePy} stroke="#cbd5e1" strokeWidth="1.2" />
                    <line x1={wallPxL - 32} y1={crestPy} x2={wallPxL - 20} y2={crestPy} stroke="#cbd5e1" strokeWidth="1.2" />
                    <line x1={wallPxL - 32} y1={dredgePy} x2={wallPxL - 20} y2={dredgePy} stroke="#cbd5e1" strokeWidth="1.2" />
                    <text
                      x={wallPxL - 34}
                      y={(crestPy + dredgePy) / 2 + 3}
                      textAnchor="end"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      H = {H.toFixed(2)}m
                    </text>
                  </g>

                  {/* Embedment Depth D Dimension (Left of wall) */}
                  <g>
                    <line x1={wallPxL - 26} y1={dredgePy} x2={wallPxL - 26} y2={toePy} stroke="#cbd5e1" strokeWidth="1.2" />
                    <line x1={wallPxL - 32} y1={toePy} x2={wallPxL - 20} y2={toePy} stroke="#cbd5e1" strokeWidth="1.2" />
                    <text
                      x={wallPxL - 34}
                      y={(dredgePy + toePy) / 2 + 3}
                      textAnchor="end"
                      fill="#38bdf8"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      D = {D.toFixed(2)}m
                    </text>
                  </g>

                  {/* Total Length Bracket */}
                  <g>
                    <line x1={wallPxL - 56} y1={crestPy} x2={wallPxL - 56} y2={toePy} stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                    <text
                      x={wallPxL - 60}
                      y={(crestPy + toePy) / 2 + 3}
                      textAnchor="end"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      L = {L.toFixed(2)}m
                    </text>
                  </g>
                </g>

                {/* 7. LOAD APPLICATION POINTS & VECTORS */}
                {viewMode !== "geometry" && (
                  <g id="loads-and-application-points">
                    {/* A. UNIFORM SURCHARGE LOAD (q_udl) */}
                    {q_udl > 0 && (
                      <g id="surcharge-udl-group">
                        {/* Horizontal distribution bar */}
                        <line
                          x1={wallPxR + 8}
                          y1={crestPy - 28}
                          x2={toSvgX(maxX) - 10}
                          y2={crestPy - 28}
                          stroke="#f59e0b"
                          strokeWidth="2.2"
                        />

                        {/* Distributed downward arrows */}
                        {surchargeArrows.map((xVal, i) => {
                          const px = toSvgX(xVal);
                          return (
                            <line
                              key={`q-arrow-${i}`}
                              x1={px}
                              y1={crestPy - 28}
                              x2={px}
                              y2={crestPy - 2}
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              markerEnd="url(#arrow-amber)"
                            />
                          );
                        })}

                        {/* Surcharge Badge */}
                        <rect
                          x={(wallPxR + toSvgX(maxX)) / 2 - 50}
                          y={crestPy - 45}
                          width="100"
                          height="16"
                          rx="3"
                          fill="#031522"
                          stroke="#f59e0b"
                          strokeWidth="1"
                        />
                        <text
                          x={(wallPxR + toSvgX(maxX)) / 2}
                          y={crestPy - 33}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          SURCHARGE q = {q_udl.toFixed(1)} kPa
                        </text>
                      </g>
                    )}

                    {/* B. TRAFFIC AXLE / STRIP LOAD (Point Load Application Point) */}
                    {q_axle > 0 && (
                      <g id="traffic-axle-group">
                        {(() => {
                          const axleX = wallFaceX + x_offset;
                          const pxAxle = toSvgX(axleX);
                          const pxLeftFoot = toSvgX(axleX - b_footprint / 2);
                          const pxRightFoot = toSvgX(axleX + b_footprint / 2);

                          return (
                            <g>
                              {/* 45° Stress Dispersion Lines */}
                              {showDispersion && (
                                <g opacity="0.35">
                                  <line
                                    x1={pxLeftFoot}
                                    y1={crestPy}
                                    x2={toSvgX(Math.max(wallFaceX, axleX - b_footprint / 2 - H))}
                                    y2={toSvgY(crestEl - H)}
                                    stroke="#f43f5e"
                                    strokeWidth="1.2"
                                    strokeDasharray="4 3"
                                  />
                                  <line
                                    x1={pxRightFoot}
                                    y1={crestPy}
                                    x2={toSvgX(axleX + b_footprint / 2 + H)}
                                    y2={toSvgY(crestEl - H)}
                                    stroke="#f43f5e"
                                    strokeWidth="1.2"
                                    strokeDasharray="4 3"
                                  />
                                  <text
                                    x={pxAxle + 12}
                                    y={crestPy + 40}
                                    fill="#f43f5e"
                                    fontSize="8"
                                    fontFamily="monospace"
                                  >
                                    45° Boussinesq spread
                                  </text>
                                </g>
                              )}

                              {/* Tire Footprint Contact Pad */}
                              <rect
                                x={pxLeftFoot}
                                y={crestPy - 4}
                                width={pxRightFoot - pxLeftFoot}
                                height="4"
                                fill="#f43f5e"
                                rx="1"
                              />

                              {/* Big Downward Force Vector */}
                              <line
                                x1={pxAxle}
                                y1={crestPy - 75}
                                x2={pxAxle}
                                y2={crestPy - 4}
                                stroke="#f43f5e"
                                strokeWidth="3"
                                markerEnd="url(#arrow-rose)"
                              />

                              {/* Axle Load Callout Box */}
                              <rect
                                x={pxAxle - 55}
                                y={crestPy - 95}
                                width="110"
                                height="18"
                                rx="3"
                                fill="#20060e"
                                stroke="#f43f5e"
                                strokeWidth="1.2"
                              />
                              <text
                                x={pxAxle}
                                y={crestPy - 82}
                                textAnchor="middle"
                                fill="#fda4af"
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                Q_axle = {q_axle} kN
                              </text>

                              {/* Offset Dimension Line from Wall Crest */}
                              <line
                                x1={wallPxR}
                                y1={crestPy - 55}
                                x2={pxAxle}
                                y2={crestPy - 55}
                                stroke="#fda4af"
                                strokeWidth="1"
                              />
                              <line x1={wallPxR} y1={crestPy - 60} x2={wallPxR} y2={crestPy - 50} stroke="#fda4af" strokeWidth="1" />
                              <line x1={pxAxle} y1={crestPy - 60} x2={pxAxle} y2={crestPy - 50} stroke="#fda4af" strokeWidth="1" />
                              <text
                                x={(wallPxR + pxAxle) / 2}
                                y={crestPy - 58}
                                textAnchor="middle"
                                fill="#fda4af"
                                fontSize="8.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                Offset x = {x_offset.toFixed(2)}m
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    )}

                    {/* C. TIE ROD / ANCHOR RESTRAINT APPLICATION POINT */}
                    {primaryTie && (
                      <g id="tie-rod-anchor-group">
                        {(() => {
                          const tiePy = toSvgY(tieElev);
                          const anchorEndX = toSvgX(Math.min(maxX, 5.5));

                          return (
                            <g>
                              {/* Inclined Tendon Line */}
                              <line
                                x1={wallPxR}
                                y1={tiePy}
                                x2={anchorEndX}
                                y2={tiePy + 25}
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray="6 3"
                              />

                              {/* Tension Reaction Force Arrow (acting to restrain the wall) */}
                              <line
                                x1={wallPxR + 3}
                                y1={tiePy}
                                x2={wallPxR + 65}
                                y2={tiePy}
                                stroke="#10b981"
                                strokeWidth="2.5"
                                markerEnd="url(#arrow-emerald)"
                              />

                              {/* Waler & Bearing Plate Symbol on Wall */}
                              <rect
                                x={wallPxR - 4}
                                y={tiePy - 8}
                                width="8"
                                height="16"
                                fill="#10b981"
                                stroke="#047857"
                                strokeWidth="1"
                              />
                              <circle cx={wallPxR} cy={tiePy} r="3" fill="#ffffff" />

                              {/* Deadman Anchor Body */}
                              <rect
                                x={anchorEndX - 8}
                                y={tiePy + 13}
                                width="16"
                                height="24"
                                fill="#047857"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                rx="2"
                              />
                              <text
                                x={anchorEndX + 12}
                                y={tiePy + 28}
                                fill="#34d399"
                                fontSize="8.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                Anchor Deadman
                              </text>

                              {/* Anchor Callout on Wall */}
                              <text
                                x={wallPxR + 72}
                                y={tiePy + 4}
                                fill="#34d399"
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                T_Ed ({primaryTie.name}) · Ø{primaryTie.diameter}mm @ El +{tieElev.toFixed(2)}m
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    )}

                    {/* D. ACTIVE & PASSIVE LATERAL EARTH PRESSURE RESULTANTS */}
                    <g id="earth-pressure-resultants">
                      {/* Active Thrust Resultant Pa (acting on retained side) */}
                      <g>
                        const paPy = toSvgY(z_Pa);
                        <line
                          x1={wallPxR + 60}
                          y1={toSvgY(z_Pa)}
                          x2={wallPxR + 2}
                          y2={toSvgY(z_Pa)}
                          stroke="#38bdf8"
                          strokeWidth="2.8"
                          markerEnd="url(#arrow-blue)"
                        />
                        <text
                          x={wallPxR + 66}
                          y={toSvgY(z_Pa) + 3}
                          fill="#38bdf8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          P_a ≈ {Pa_approx.toFixed(0)} kN/m (Active Resultant @ H/3)
                        </text>
                      </g>

                      {/* Passive Earth Resistance Resultant Pp (acting on embedded front face) */}
                      <g>
                        <line
                          x1={wallPxL - 60}
                          y1={toSvgY(z_Pp)}
                          x2={wallPxL - 2}
                          y2={toSvgY(z_Pp)}
                          stroke="#10b981"
                          strokeWidth="2.8"
                          markerEnd="url(#arrow-emerald)"
                        />
                        <text
                          x={wallPxL - 66}
                          y={toSvgY(z_Pp) + 3}
                          textAnchor="end"
                          fill="#34d399"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          P_p ≈ {Pp_approx.toFixed(0)} kN/m (Passive Resistance)
                        </text>
                      </g>
                    </g>
                  </g>
                )}

                {/* 8. VERTICAL AXIS RULER & DATUMS */}
                {showRuler && (
                  <g id="vertical-depth-ruler">
                    <line x1={padLeft - 10} y1={toSvgY(crestEl + 1)} x2={padLeft - 10} y2={toSvgY(toeEl - 0.5)} stroke="#475569" strokeWidth="1.5" />

                    {/* Major tick markings every 2m */}
                    {Array.from({ length: Math.ceil(spanZ / 2) }).map((_, i) => {
                      const z = Math.floor(minZ) + i * 2;
                      const py = toSvgY(z);
                      if (py < padTop - 10 || py > svgH - padBottom + 10) return null;
                      const depth = crestEl - z;

                      return (
                        <g key={`ruler-tick-${z}`}>
                          <line x1={padLeft - 16} y1={py} x2={padLeft - 10} y2={py} stroke="#94a3b8" strokeWidth="1.2" />
                          <text
                            x={padLeft - 19}
                            y={py - 1}
                            textAnchor="end"
                            fill="#cbd5e1"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {depth >= 0 ? `-${depth.toFixed(0)}m` : `+${Math.abs(depth).toFixed(0)}m`}
                          </text>
                          <text
                            x={padLeft - 19}
                            y={py + 7}
                            textAnchor="end"
                            fill="#38bdf8"
                            fontSize="7"
                            fontFamily="monospace"
                          >
                            El {z >= 0 ? "+" : ""}{z.toFixed(0)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 9. REAL-TIME LASER HOVER PROBE */}
                {hoverProbe && (
                  <g pointerEvents="none">
                    <line
                      x1={padLeft}
                      y1={toSvgY(hoverProbe.z)}
                      x2={svgW - padRight}
                      y2={toSvgY(hoverProbe.z)}
                      stroke="#00f0ff"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <line
                      x1={toSvgX(hoverProbe.x)}
                      y1={padTop}
                      x2={toSvgX(hoverProbe.x)}
                      y2={svgH - padBottom}
                      stroke="#00f0ff"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <circle cx={toSvgX(hoverProbe.x)} cy={toSvgY(hoverProbe.z)} r="3.5" fill="#00f0ff" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* LOAD APPLICATION POINTS AUDIT TABLE */}
          <div className="rounded-xl border border-cyan-900/60 bg-[#040e1d] p-4 shadow-md font-mono text-xs">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-950 pb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase text-[11px]">
                <Compass className="size-3.5 text-cyan-400" />
                Active Load Application Points & Lever Arms (Referred to Wall Toe)
              </span>
              <span className="text-[10px] text-slate-500">Eurocode 7 / DA1 & DA2</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="pb-1.5 font-semibold">Action / Load Name</th>
                    <th className="pb-1.5 font-semibold">Magnitude</th>
                    <th className="pb-1.5 font-semibold">Application (x, z)</th>
                    <th className="pb-1.5 font-semibold">Lever Arm to Toe</th>
                    <th className="pb-1.5 font-semibold">Overturning / Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  <tr>
                    <td className="py-1.5 text-amber-300 font-bold">Uniform Surcharge (q)</td>
                    <td className="py-1.5 text-white">{q_udl.toFixed(1)} kPa</td>
                    <td className="py-1.5 text-slate-300">x ≥ 0.0m, z = +{crestEl.toFixed(2)}m RL</td>
                    <td className="py-1.5 text-cyan-300 font-bold">{(H + D).toFixed(2)} m</td>
                    <td className="py-1.5 text-rose-300 font-bold">Destabilizing (Ka × q)</td>
                  </tr>
                  {q_axle > 0 && (
                    <tr>
                      <td className="py-1.5 text-rose-300 font-bold">Traffic Axle Point Load (Q_axle)</td>
                      <td className="py-1.5 text-white">{q_axle} kN</td>
                      <td className="py-1.5 text-slate-300">x = +{x_offset.toFixed(2)}m, z = +{crestEl.toFixed(2)}m</td>
                      <td className="py-1.5 text-cyan-300 font-bold">{(H + D).toFixed(2)} m</td>
                      <td className="py-1.5 text-rose-300 font-bold">Destabilizing lateral thrust</td>
                    </tr>
                  )}
                  {primaryTie && (
                    <tr>
                      <td className="py-1.5 text-emerald-300 font-bold">Tie Rod Restraint (T_Ed)</td>
                      <td className="py-1.5 text-white">Ø{primaryTie.diameter}mm @ {primaryTie.spacing}m c/c</td>
                      <td className="py-1.5 text-slate-300">x = 0.0m, z = +{tieElev.toFixed(2)}m RL</td>
                      <td className="py-1.5 text-emerald-300 font-bold">{(tieElev - toeEl).toFixed(2)} m</td>
                      <td className="py-1.5 text-emerald-300 font-bold">Stabilizing / Restraining</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-1.5 text-sky-300 font-bold">Active Soil Thrust Resultant (P_a)</td>
                    <td className="py-1.5 text-white">≈ {Pa_approx.toFixed(0)} kN/m</td>
                    <td className="py-1.5 text-slate-300">x = 0.0m, z = +{z_Pa.toFixed(2)}m RL</td>
                    <td className="py-1.5 text-cyan-300 font-bold">{(z_Pa - toeEl).toFixed(2)} m</td>
                    <td className="py-1.5 text-rose-300 font-bold">Overturning Action</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-emerald-400 font-bold">Passive Earth Resistance (P_p)</td>
                    <td className="py-1.5 text-white">≈ {Pp_approx.toFixed(0)} kN/m</td>
                    <td className="py-1.5 text-slate-300">x = -t, z = +{z_Pp.toFixed(2)}m RL</td>
                    <td className="py-1.5 text-emerald-300 font-bold">{(z_Pp - toeEl).toFixed(2)} m</td>
                    <td className="py-1.5 text-emerald-400 font-bold">Restoring / Safe embedment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
