import { useState } from "react";
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Cpu,
  Boxes,
  Activity
} from "lucide-react";
import type { Body } from "./ui";
import { 
  NumField, 
  StatCard, 
  EngineeringSlider, 
  SelectDropdown 
} from "./ui";
import { BasementWallGeometryVisualizer } from "./BasementWallGeometryVisualizer";

const CONCRETE_GRADES = [
  { value: 20, label: "C20/25", sub: "f_ck = 20 MPa, fctm = 2.2 MPa", badge: "20 MPa" },
  { value: 25, label: "C25/30", sub: "f_ck = 25 MPa, fctm = 2.6 MPa", badge: "25 MPa" },
  { value: 30, label: "C30/37", sub: "f_ck = 30 MPa, fctm = 2.9 MPa", badge: "30 MPa" },
  { value: 35, label: "C35/45", sub: "f_ck = 35 MPa, fctm = 3.2 MPa", badge: "35 MPa" },
  { value: 40, label: "C40/50", sub: "f_ck = 40 MPa, fctm = 3.5 MPa", badge: "40 MPa" },
  { value: 45, label: "C45/55", sub: "f_ck = 45 MPa, fctm = 3.8 MPa", badge: "45 MPa" },
  { value: 50, label: "C50/60", sub: "f_ck = 50 MPa, fctm = 4.1 MPa", badge: "50 MPa" },
];

const EXPOSURE_OPTIONS = [
  { value: "XC1", label: "XC1 — Dry / Indoor", sub: "Permanently dry indoor environment (c_min,dur = 15mm)" },
  { value: "XC2", label: "XC2 — Wet, Soil Contact", sub: "Buried soil contact, cyclic moisture (c_min,dur = 25mm)" },
  { value: "XC3", label: "XC3 — Moderate Humidity", sub: "External sheltered concrete (c_min,dur = 25mm)" },
  { value: "XC4", label: "XC4 — Cyclic Wet & Dry", sub: "External exposed surfaces (c_min,dur = 30mm)" },
  { value: "XD1", label: "XD1 — Airborne Chlorides", sub: "Moderate humidity with airborne salts (c_min,dur = 35mm)" },
  { value: "XD2", label: "XD2 — Water Retaining", sub: "Chlorides in water, pools, water-retaining (c_min,dur = 40mm)" },
];

const BAR_DIAMETER_OPTIONS = [
  { value: 10, label: "T10 (10mm)" },
  { value: 12, label: "T12 (12mm)" },
  { value: 16, label: "T16 (16mm)" },
  { value: 20, label: "T20 (20mm)" },
  { value: 25, label: "T25 (25mm)" },
  { value: 32, label: "T32 (32mm)" },
];

const SPACING_OPTIONS = [
  { value: 100, label: "100 mm" },
  { value: 125, label: "125 mm" },
  { value: 150, label: "150 mm" },
  { value: 175, label: "175 mm" },
  { value: 200, label: "200 mm" },
  { value: 250, label: "250 mm" },
  { value: 300, label: "300 mm" },
];

const BASE_SUPPORT_OPTIONS = [
  { value: "raft", label: "Raft Slab (Monolithic Fixed Base)", sub: "Full moment transfer into continuous raft" },
  { value: "strip footing", label: "Strip Footing Base", sub: "Isolated footing with rotational stiffness" },
];

interface PresetConfig {
  name: string;
  desc: string;
  stemHeight: number;
  wallThickness: number;
  topSlabThickness: number;
  baseThickness: number;
  fck: number;
  concreteGrade: string;
  innerDia: number;
  innerSpacing: number;
  outerDia: number;
  outerSpacing: number;
  topDowelDia: number;
  topDowelSpacing: number;
  cNomBuried: number;
  cNomWater: number;
  wMax: number;
}

const PRESETS: PresetConfig[] = [
  {
    name: "🏢 Standard 3.5m Single Basement",
    desc: "Residential / Commercial single level propped by ground floor slab",
    stemHeight: 3500,
    wallThickness: 300,
    topSlabThickness: 250,
    baseThickness: 450,
    fck: 30,
    concreteGrade: "C30/37",
    innerDia: 16,
    innerSpacing: 150,
    outerDia: 16,
    outerSpacing: 150,
    topDowelDia: 16,
    topDowelSpacing: 150,
    cNomBuried: 40,
    cNomWater: 50,
    wMax: 0.3,
  },
  {
    name: "🏬 Deep 4.5m Commercial Basement",
    desc: "Single high-ceiling basement with heavy earth & service surcharge",
    stemHeight: 4500,
    wallThickness: 350,
    topSlabThickness: 300,
    baseThickness: 550,
    fck: 35,
    concreteGrade: "C35/45",
    innerDia: 20,
    innerSpacing: 150,
    outerDia: 16,
    outerSpacing: 150,
    topDowelDia: 16,
    topDowelSpacing: 150,
    cNomBuried: 40,
    cNomWater: 50,
    wMax: 0.3,
  },
  {
    name: "🏗️ 6.0m Double-Height Retaining Wall",
    desc: "Double basement car park wall with high lateral pressure",
    stemHeight: 6000,
    wallThickness: 450,
    topSlabThickness: 350,
    baseThickness: 750,
    fck: 40,
    concreteGrade: "C40/50",
    innerDia: 25,
    innerSpacing: 125,
    outerDia: 20,
    outerSpacing: 150,
    topDowelDia: 20,
    topDowelSpacing: 150,
    cNomBuried: 50,
    cNomWater: 50,
    wMax: 0.3,
  },
  {
    name: "🌊 Water-Retaining Basement (BS EN 1992-3)",
    desc: "Tight crack limit w_max=0.2mm with enhanced water cover",
    stemHeight: 3800,
    wallThickness: 350,
    topSlabThickness: 250,
    baseThickness: 500,
    fck: 35,
    concreteGrade: "C35/45",
    innerDia: 20,
    innerSpacing: 125,
    outerDia: 16,
    outerSpacing: 125,
    topDowelDia: 16,
    topDowelSpacing: 150,
    cNomBuried: 50,
    cNomWater: 50,
    wMax: 0.2,
  },
];

export function GeometryTab({ body }: { body: Body }) {
  const { project, res, pad } = body;
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const setGrade = (fck: number) => {
    const grade = CONCRETE_GRADES.find((g) => g.value === fck);
    pad({ fck, concreteGrade: grade ? grade.label : project.concreteGrade });
  };

  const applyPreset = (preset: PresetConfig) => {
    setActivePreset(preset.name);
    pad({
      stemHeight: preset.stemHeight,
      wallThickness: preset.wallThickness,
      topSlabThickness: preset.topSlabThickness,
      baseThickness: preset.baseThickness,
      fck: preset.fck,
      concreteGrade: preset.concreteGrade,
      innerFaceBarDiameter: preset.innerDia,
      innerFaceBarSpacing: preset.innerSpacing,
      outerFaceBarDiameter: preset.outerDia,
      outerFaceBarSpacing: preset.outerSpacing,
      topDowelBarDiameter: preset.topDowelDia,
      topDowelBarSpacing: preset.topDowelSpacing,
      cNomBuried: preset.cNomBuried,
      cNomWater: preset.cNomWater,
      wMax: preset.wMax,
    });
  };

  return (
    <div className="space-y-6">
      {/* Engineering Presets Selector */}
      <div className="bg-[#081324] border border-cyan-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-400" />
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Quick Engineering Presets & Typologies
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click to preload verified baseline geometry & materials
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`text-left p-3 rounded-xl border transition duration-150 flex flex-col justify-between ${
                activePreset === preset.name
                  ? "bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-950"
                  : "bg-[#040a14] border-slate-700/80 hover:border-cyan-500/60 hover:bg-[#061120]"
              }`}
            >
              <div>
                <p className="font-mono text-xs font-bold text-cyan-300 flex items-center justify-between">
                  <span>{preset.name}</span>
                  {activePreset === preset.name && <Check className="size-3.5 text-cyan-400 shrink-0" />}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>H={preset.stemHeight}mm · t={preset.wallThickness}mm</span>
                <span className="text-cyan-400 font-semibold">{preset.concreteGrade}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-SIDE VIEW: LEFT IS INPUT, RIGHT IS VISUAL RESULT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            LEFT SIDE: INPUT CONFIGURATION & CONTROLS (5 cols on lg)
            ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* 1. Wall Stem, Top Slab & Base Slab Geometry */}
          <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-cyan-400" />
                <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  1. Wall & Floor Slab Geometry
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Fixed Base · Pinned Top</span>
            </div>

            {/* Custom Interactive Engineering Sliders */}
            <div className="space-y-4">
              {/* Stem Height H Slider */}
              <EngineeringSlider
                label="Stem Height H (Clear Span)"
                value={project.stemHeight}
                min={1500}
                max={10000}
                step={50}
                unit="mm"
                sub={`Expressed as ${(project.stemHeight / 1000).toFixed(2)}m`}
                quickSteps={[3000, 3500, 4500, 6000]}
                tone="cyan"
                onChange={(v) => pad({ stemHeight: v })}
              />

              {/* Wall Thickness t Slider */}
              <EngineeringSlider
                label="Wall Stem Thickness t"
                value={project.wallThickness}
                min={150}
                max={1000}
                step={25}
                unit="mm"
                sub="Prismatic retaining stem section"
                quickSteps={[250, 300, 350, 400, 500]}
                tone="cyan"
                onChange={(v) => pad({ wallThickness: v })}
              />

              {/* Top Slab Thickness Slider */}
              <EngineeringSlider
                label="Top Slab Thickness t_top"
                value={project.topSlabThickness || 250}
                min={150}
                max={600}
                step={25}
                unit="mm"
                sub="Ground floor diaphragm prop connection"
                quickSteps={[200, 225, 250, 300, 350]}
                tone="purple"
                onChange={(v) => pad({ topSlabThickness: v })}
              />

              {/* Base Raft Thickness Slider */}
              <EngineeringSlider
                label="Base Slab / Raft Thickness t_base"
                value={project.baseThickness}
                min={250}
                max={1200}
                step={25}
                unit="mm"
                sub="Foundation toe and heel formation"
                quickSteps={[350, 400, 500, 600, 750]}
                tone="emerald"
                onChange={(v) => pad({ baseThickness: v })}
              />

              {/* Base Support Type Custom Dropdown */}
              <SelectDropdown
                label="Base Support Type"
                value={project.baseSupportType}
                options={BASE_SUPPORT_OPTIONS}
                onChange={(v) => pad({ baseSupportType: v === "strip footing" ? "strip footing" : "raft" })}
              />
            </div>
          </div>

          {/* 2. Two-Face Reinforcement & Dowels */}
          <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-cyan-400" />
                <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  2. Reinforcement & Dowel Specification
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Two-Face + Dowels</span>
            </div>

            {/* Inner Face (Back/Soil face - resists base hogging) */}
            <div className="p-3.5 rounded-xl bg-[#14080c]/60 border border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" />
                  Inner / Retained Face (Base Hogging M_Ed)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  res.innerAsProvided >= res.innerAsRequired ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800 font-bold"
                }`}>
                  {res.innerAsProvided >= res.innerAsRequired ? "ADEQUATE" : "DEFICIENT"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Bar Diameter"
                  value={project.innerFaceBarDiameter}
                  options={BAR_DIAMETER_OPTIONS}
                  onChange={(v) => pad({ innerFaceBarDiameter: Number(v) })}
                />
                <SelectDropdown
                  label="Spacing (c/c)"
                  value={project.innerFaceBarSpacing}
                  options={SPACING_OPTIONS}
                  onChange={(v) => pad({ innerFaceBarSpacing: Number(v) })}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400 border-t border-rose-950/60">
                <span>Provided: <strong className="text-white">{res.innerAsProvided} mm²/m</strong></span>
                <span>Required: <strong className={res.innerAsRequired > res.innerAsProvided ? "text-rose-400" : "text-emerald-400"}>{res.innerAsRequired} mm²/m</strong></span>
              </div>
            </div>

            {/* Outer Face (Front/Basement face - resists span sagging) */}
            <div className="p-3.5 rounded-xl bg-[#081812]/60 border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Outer / Exposed Face (Span Sagging M_Ed)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  res.outerAsProvided >= res.outerAsRequired ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800 font-bold"
                }`}>
                  {res.outerAsProvided >= res.outerAsRequired ? "ADEQUATE" : "DEFICIENT"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Bar Diameter"
                  value={project.outerFaceBarDiameter}
                  options={BAR_DIAMETER_OPTIONS}
                  onChange={(v) => pad({ outerFaceBarDiameter: Number(v) })}
                />
                <SelectDropdown
                  label="Spacing (c/c)"
                  value={project.outerFaceBarSpacing}
                  options={SPACING_OPTIONS}
                  onChange={(v) => pad({ outerFaceBarSpacing: Number(v) })}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400 border-t border-emerald-950/60">
                <span>Provided: <strong className="text-white">{res.outerAsProvided} mm²/m</strong></span>
                <span>Required: <strong className={res.outerAsRequired > res.outerAsProvided ? "text-rose-400" : "text-emerald-400"}>{res.outerAsRequired} mm²/m</strong></span>
              </div>
            </div>

            {/* Top Slab Connection Dowels */}
            <div className="p-3.5 rounded-xl bg-[#130d22]/70 border border-purple-900/50 space-y-3">
              <label className="text-xs font-mono font-bold text-purple-300 block flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                Top Floor Slab Dowel Starter Bars
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Top Dowel Diameter"
                  value={project.topDowelBarDiameter || 16}
                  options={BAR_DIAMETER_OPTIONS}
                  onChange={(v) => pad({ topDowelBarDiameter: Number(v) })}
                />
                <SelectDropdown
                  label="Top Dowel Spacing"
                  value={project.topDowelBarSpacing || 150}
                  options={SPACING_OPTIONS}
                  onChange={(v) => pad({ topDowelBarSpacing: Number(v) })}
                />
              </div>
            </div>

            {/* Base Raft Dowel Bars */}
            <div className="p-3.5 rounded-xl bg-[#130d22]/70 border border-purple-900/50 space-y-3">
              <label className="text-xs font-mono font-bold text-purple-300 block flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-400" />
                Base Raft Foundation Dowel Starter Bars
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectDropdown
                  label="Base Dowel Diameter"
                  value={project.baseDowelBarDiameter}
                  options={BAR_DIAMETER_OPTIONS}
                  onChange={(v) => pad({ baseDowelBarDiameter: Number(v) })}
                />
                <SelectDropdown
                  label="Base Dowel Spacing"
                  value={project.baseDowelBarSpacing}
                  options={SPACING_OPTIONS}
                  onChange={(v) => pad({ baseDowelBarSpacing: Number(v) })}
                />
              </div>
            </div>
          </div>

          {/* 3. Concrete & Steel Material Properties */}
          <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-cyan-400" />
                <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  3. Materials & Constitutive Properties
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">EN 1992-1-1 / UK NA</span>
            </div>

            {/* Custom Concrete Class Selector */}
            <SelectDropdown
              label="Concrete Strength Class (f_ck / f_ck,cube)"
              value={project.fck}
              options={CONCRETE_GRADES}
              onChange={(v) => setGrade(Number(v))}
            />

            {/* Partial Safety Factors & Steel Grade */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <NumField label="fyk (Steel Yield)" value={project.fyk} unit="MPa" onChange={(v) => pad({ fyk: v })} />
              <NumField label="γC (Concrete Factor)" value={project.gammaC} step={0.05} onChange={(v) => pad({ gammaC: v })} />
              <NumField label="γS (Steel Factor)" value={project.gammaS} step={0.05} onChange={(v) => pad({ gammaS: v })} />
            </div>

            {/* Auto-derived Design Strengths Card */}
            <div className="p-3.5 rounded-xl bg-[#040a14] border border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">f_cd (Design)</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{res.fcd} MPa</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">f_yd (Design)</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{res.fyd} MPa</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">E_cm (Modulus)</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{res.ecm} GPa</div>
              </div>
            </div>
          </div>

          {/* 4. Durability, Cover & Crack Limit */}
          <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan-400" />
                <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  4. Durability & Concrete Cover
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">BS 8500 / EN 1992</span>
            </div>

            {/* Inner & Outer Face Covers with Custom Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#040a14] border border-slate-800 space-y-3">
                <label className="text-xs font-mono font-bold text-rose-300 block">
                  Inner (Buried) Face
                </label>
                <SelectDropdown
                  label="Exposure Class"
                  value={project.exposureClassBuried}
                  options={EXPOSURE_OPTIONS}
                  onChange={(v) => pad({ exposureClassBuried: String(v) })}
                />
                <NumField label="c_nom inner" value={project.cNomBuried} unit="mm" onChange={(v) => pad({ cNomBuried: v })} />
              </div>

              <div className="p-3.5 rounded-xl bg-[#040a14] border border-slate-800 space-y-3">
                <label className="text-xs font-mono font-bold text-emerald-300 block">
                  Outer (Exposed / Water) Face
                </label>
                <SelectDropdown
                  label="Exposure Class"
                  value={project.exposureClassWater}
                  options={EXPOSURE_OPTIONS}
                  onChange={(v) => pad({ exposureClassWater: String(v) })}
                />
                <NumField label="c_nom outer" value={project.cNomWater} unit="mm" onChange={(v) => pad({ cNomWater: v })} />
              </div>
            </div>

            {/* Crack Limit & Design Life */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <NumField label="Crack Limit w_max" value={project.wMax} unit="mm" step={0.05} onChange={(v) => pad({ wMax: v })} />
              <NumField label="Design Life" value={project.designLife} unit="years" onChange={(v) => pad({ designLife: v })} />
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: REAL-TIME VISUAL OF RESULT INPUT (7 cols on lg)
            ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 lg:sticky lg:top-4">
          {/* Main Visualizer Component */}
          <BasementWallGeometryVisualizer project={project} result={res} />

          {/* Live Section & Material Synthesis Card */}
          <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="size-4 text-cyan-400" />
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Geometric & Section Results Breakdown
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">b = 1000 mm design strip</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Effective Depth d (Inner)"
                value={`${res.dInner}`}
                unit="mm"
                sub="h - c_nom - Φ/2"
              />
              <StatCard
                label="Effective Depth d (Outer)"
                value={`${res.dOuter}`}
                unit="mm"
                sub="h - c_nom - Φ/2"
              />
              <StatCard
                label="Min Steel Area As,min"
                value={`${res.innerAsMin}`}
                unit="mm²/m"
                sub="0.26(fctm/fyk)bd"
              />
              <StatCard
                label="Shear Capacity VRd,c"
                value={`${res.innerVRdc.toFixed(1)}`}
                unit="kN/m"
                sub="without links"
                tone="emerald"
              />
            </div>

            {/* Quick Design Verification Matrix */}
            <div className="p-3.5 rounded-xl bg-[#030913] border border-slate-800 space-y-2">
              <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Activity className="size-3.5 text-cyan-400" />
                <span>Structural Adequacy Summary</span>
              </p>
              <div className="space-y-2 text-xs font-mono">
                {/* Hogging check */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#061224] border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${res.innerAsProvided >= res.innerAsRequired ? "bg-emerald-400" : "bg-rose-500"}`} />
                    <span className="text-slate-200">Base Hogging Resistance (Inner Steel)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">M_Ed = {res.baseMEdGov.toFixed(1)} kNm/m</span>
                    <span className={`font-bold ${res.innerAsProvided >= res.innerAsRequired ? "text-emerald-400" : "text-rose-400"}`}>
                      {res.innerAsProvided >= res.innerAsRequired ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

                {/* Sagging check */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#061224] border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${res.outerAsProvided >= res.outerAsRequired ? "bg-emerald-400" : "bg-rose-500"}`} />
                    <span className="text-slate-200">Span Sagging Resistance (Outer Steel)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">M_Ed = {res.spanMEdGov.toFixed(1)} kNm/m</span>
                    <span className={`font-bold ${res.outerAsProvided >= res.outerAsRequired ? "text-emerald-400" : "text-rose-400"}`}>
                      {res.outerAsProvided >= res.outerAsRequired ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

                {/* Crack width check */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#061224] border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${res.crackWidthInner <= project.wMax ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-slate-200">SLS Flexural Cracking (Inner / Outer)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">w_k = {res.crackWidthInner.toFixed(2)} mm ≤ {project.wMax} mm</span>
                    <span className={`font-bold ${res.crackWidthInner <= project.wMax ? "text-emerald-400" : "text-amber-400"}`}>
                      {res.crackWidthInner <= project.wMax ? "PASS" : "WARNING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
