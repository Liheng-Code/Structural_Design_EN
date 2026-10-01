import React, { useState, useRef, useEffect } from "react";
import { 
  CheckCircle2, 
  TriangleAlert, 
  HardHat, 
  ChevronDown, 
  Check, 
  Plus, 
  Minus 
} from "lucide-react";
import type { BasementWallCheckStatus, BasementWallProject, BasementWallAnalysisResult } from "@/lib/basement-wall/types";
import { analyzeBasementWall } from "@/lib/basement-wall/calculations";

export type Tab = "overview" | "geometry" | "soil" | "construction" | "permanent" | "detailing" | "report";

export type Pad = (patch: Partial<BasementWallProject>) => void;

export interface Body {
  project: BasementWallProject;
  res: ReturnType<typeof analyzeBasementWall>;
  pad: Pad;
}

export type Results = BasementWallAnalysisResult;

export function StatusBadge({ status }: { status: BasementWallCheckStatus }) {
  const cls =
    status === "PASS"
      ? "bg-emerald-950 border-emerald-600 text-emerald-400 shadow-sm shadow-emerald-950"
      : status === "WARNING"
        ? "bg-amber-950 border-amber-600 text-amber-300 shadow-sm shadow-amber-950"
        : status === "FAIL"
          ? "bg-rose-950 border-rose-600 text-rose-400 shadow-sm shadow-rose-950"
          : "bg-slate-800 border-slate-600 text-slate-300";
  const icon =
    status === "PASS" ? <CheckCircle2 className="size-3" /> : status === "WARNING" ? <TriangleAlert className="size-3" /> : <HardHat className="size-3" />;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium ${cls}`}>
      {icon}
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  unit,
  sub,
  tone = "cyan",
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  tone?: "cyan" | "white" | "emerald" | "amber" | "rose";
}) {
  const color = { 
    cyan: "text-cyan-300", 
    white: "text-white", 
    emerald: "text-emerald-400", 
    amber: "text-amber-400", 
    rose: "text-rose-400" 
  }[tone];
  return (
    <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4 shadow-md backdrop-blur-sm transition-all hover:border-cyan-400/50">
      <p className="text-xs font-mono text-slate-400">{label}</p>
      <p className={`text-2xl font-mono font-bold mt-1 tracking-tight ${color}`}>
        {value} {unit && <span className="text-xs text-cyan-400 font-normal">{unit}</span>}
      </p>
      {sub && <p className="text-[11px] font-mono text-slate-500 mt-1 leading-tight">{sub}</p>}
    </div>
  );
}

// =========================================================================
// CUSTOM ENGINEERING SLIDER (Replaces raw native range input with styled CAD bar)
// =========================================================================
export function EngineeringSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  sub,
  quickSteps = [],
  tone = "cyan"
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  sub?: string;
  quickSteps?: number[];
  tone?: "cyan" | "emerald" | "amber" | "purple";
}) {
  const safeVal = Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  const percent = ((safeVal - min) / (max - min)) * 100;

  const gradientClass = {
    cyan: "from-cyan-600 via-cyan-500 to-sky-400",
    emerald: "from-emerald-600 via-emerald-500 to-teal-400",
    amber: "from-amber-600 via-amber-500 to-yellow-400",
    purple: "from-purple-600 via-purple-500 to-indigo-400",
  }[tone];

  const borderClass = {
    cyan: "border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400",
    emerald: "border-emerald-500/40 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400",
    amber: "border-amber-500/40 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400",
    purple: "border-purple-500/40 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400",
  }[tone];

  const handleStep = (delta: number) => {
    const next = Math.max(min, Math.min(max, safeVal + delta));
    onChange(next);
  };

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-[#040a14] border border-slate-800 transition-all hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-mono font-medium text-slate-300">
            {label}
          </span>
          {sub && <span className="text-[10px] font-mono text-slate-500">{sub}</span>}
        </div>

        {/* Live Numeric Input Box with Steppers */}
        <div className={`flex items-center bg-[#02060e] border rounded-lg overflow-hidden ${borderClass}`}>
          <button
            type="button"
            onClick={() => handleStep(-step)}
            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
            title={`-${step}`}
          >
            <Minus className="size-3" />
          </button>
          <div className="relative flex items-center">
            <input
              type="number"
              value={safeVal}
              min={min}
              max={max}
              step={step}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-16 bg-transparent text-center font-mono text-xs font-bold text-cyan-300 focus:outline-none py-1"
            />
            {unit && (
              <span className="text-[10px] font-mono text-slate-500 pr-2 pointer-events-none">
                {unit}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleStep(step)}
            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
            title={`+${step}`}
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>

      {/* Custom Styled Slider Track & Interactive Range Thumb */}
      <div className="relative flex items-center py-2">
        {/* Track background */}
        <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          {/* Active filled gradient track */}
          <div
            className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-75`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Range input overlay for smooth drag & touch accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Visual Custom Glowing Thumb Knob */}
        <div
          className="absolute h-5 w-5 -ml-2.5 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-md shadow-cyan-500/50 pointer-events-none transition-all flex items-center justify-center"
          style={{ left: `${percent}%` }}
        >
          <div className="size-1.5 rounded-full bg-cyan-300" />
        </div>
      </div>

      {/* Min / Max & Quick Step Pills */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{min}{unit}</span>
        {quickSteps.length > 0 && (
          <div className="flex items-center gap-1">
            {quickSteps.map((qs) => (
              <button
                key={qs}
                type="button"
                onClick={() => onChange(qs)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  safeVal === qs
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {qs}{unit}
              </button>
            ))}
          </div>
        )}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// =========================================================================
// CUSTOM DROPDOWN / SELECT COMPONENT (Replaces ugly browser-native <select>)
// =========================================================================
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  sub?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export function SelectDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select option...",
  hint
}: {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#040a14] border text-left font-mono text-xs transition duration-150 shadow-sm ${
          isOpen
            ? "border-cyan-400 ring-2 ring-cyan-500/20 shadow-cyan-950"
            : "border-slate-700/80 hover:border-cyan-500/60 hover:bg-[#061224]"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && <span className="text-cyan-400 shrink-0">{selectedOption.icon}</span>}
          <span className="truncate text-white font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 text-[9px] rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`size-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto rounded-xl bg-[#050e1c] border border-cyan-500/40 p-1.5 shadow-2xl backdrop-blur-xl divide-y divide-slate-800/60">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left font-mono text-xs transition ${
                  isSelected
                    ? "bg-cyan-950/90 text-cyan-300 font-bold border border-cyan-500/50"
                    : "text-slate-300 hover:bg-[#08182f] hover:text-white"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    {opt.icon && <span className="text-cyan-400 shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 text-cyan-400 border border-slate-700 shrink-0 font-normal">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sub && (
                    <span className="text-[10px] text-slate-500 truncate mt-0.5 font-normal">
                      {opt.sub}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="size-3.5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {hint && <p className="text-[10px] font-mono text-slate-500">{hint}</p>}
    </div>
  );
}

// =========================================================================
// CUSTOM SEGMENTED BUTTON GROUP (For discrete diameter, spacing, grade)
// =========================================================================
export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (val: T) => void;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#030813] border border-slate-800">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                isSelected
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-950"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function NumField({
  label,
  value,
  unit,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
        {label}
        {unit && <span className="text-cyan-400 font-normal"> ({unit})</span>}
      </span>
      <div className="relative">
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-700/80 bg-[#040910] px-3 py-2 text-white font-mono text-xs focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition shadow-sm"
        />
        {unit && (
          <span className="absolute right-3 top-2 text-xs font-mono text-slate-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

export function CheckField({
  label,
  checked,
  onChange,
  sub
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  sub?: string;
}) {
  return (
    <label className="flex items-start gap-3 p-2.5 rounded-xl bg-[#040a14] border border-slate-800 hover:border-slate-700 cursor-pointer transition select-none">
      {/* Custom Switch Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-cyan-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-xs text-slate-200 font-mono font-medium">{label}</span>
        {sub && <span className="text-[10px] text-slate-500 font-mono">{sub}</span>}
      </div>
    </label>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block space-y-1">
      <span className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">{label}</span>
      {children}
    </div>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold text-white tracking-wide">{title}</h2>
          {hint && <p className="text-xs font-mono text-slate-400 mt-1 leading-relaxed">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function ChecksTable({ checks }: { checks: Results["checks"] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left font-mono text-xs">
        <thead>
          <tr className="border-b border-slate-700 text-cyan-400 bg-[#030914]">
            <th className="p-3">Check</th>
            <th className="p-3">Stage</th>
            <th className="p-3 text-right">Demand</th>
            <th className="p-3 text-right">Resistance</th>
            <th className="p-3 text-right">UR</th>
            <th className="p-3">Status</th>
            <th className="p-3">Clause</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-[#040a14]">
          {checks.map((c) => (
            <tr key={c.id} className="hover:bg-slate-900/70 transition">
              <td className="p-3">
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] text-cyan-300 font-bold border border-cyan-900">{c.id}</span> {c.name}
              </td>
              <td className="p-3 text-slate-400">{c.stage}</td>
              <td className="p-3 text-right text-slate-200">
                {c.demand.toFixed(2)} <span className="text-slate-500">{c.demandUnit}</span>
              </td>
              <td className="p-3 text-right text-slate-200">
                {c.resistance.toFixed(2)} <span className="text-slate-500">{c.resistanceUnit}</span>
              </td>
              <td className={`p-3 text-right font-bold ${c.utilization > 1 ? "text-rose-400" : c.utilization > 0.9 ? "text-amber-400" : "text-emerald-400"}`}>
                {c.utilization.toFixed(2)}
              </td>
              <td className="p-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="p-3 text-slate-500">{c.clause}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Eq({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#03070e] border border-cyan-900/60 p-3.5 font-mono text-xs text-cyan-100 overflow-x-auto shadow-inner">
      {children}
    </div>
  );
}
