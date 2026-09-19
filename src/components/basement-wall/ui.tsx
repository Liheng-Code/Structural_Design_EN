import React from "react";
import { CheckCircle2, TriangleAlert, HardHat } from "lucide-react";
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
      ? "bg-emerald-950 border-emerald-600 text-emerald-400"
      : status === "WARNING"
        ? "bg-amber-950 border-amber-600 text-amber-300"
        : status === "FAIL"
          ? "bg-rose-950 border-rose-600 text-rose-400"
          : "bg-slate-800 border-slate-600 text-slate-300";
  const icon =
    status === "PASS" ? <CheckCircle2 className="size-3" /> : status === "WARNING" ? <TriangleAlert className="size-3" /> : <HardHat className="size-3" />;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${cls}`}>
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
  const color = { cyan: "text-cyan-300", white: "text-white", emerald: "text-emerald-400", amber: "text-amber-400", rose: "text-rose-400" }[tone];
  return (
    <div className="bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4">
      <p className="text-xs font-mono text-slate-400">{label}</p>
      <p className={`text-2xl font-mono font-bold mt-1 ${color}`}>
        {value} {unit && <span className="text-xs text-cyan-400">{unit}</span>}
      </p>
      {sub && <p className="text-[11px] font-mono text-slate-500 mt-1">{sub}</p>}
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
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">
        {label}
        {unit && ` (${unit})`}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
      />
    </label>
  );
}

export function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-300 font-mono">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-cyan-500" />
      {label}
    </label>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold text-white">{title}</h2>
          {hint && <p className="text-xs font-mono text-slate-400 mt-1">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function ChecksTable({ checks }: { checks: Results["checks"] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-mono text-xs">
        <thead>
          <tr className="border-b border-slate-700 text-cyan-400 bg-cyan-950/30">
            <th className="p-3">Check</th>
            <th className="p-3">Stage</th>
            <th className="p-3 text-right">Demand</th>
            <th className="p-3 text-right">Resistance</th>
            <th className="p-3 text-right">UR</th>
            <th className="p-3">Status</th>
            <th className="p-3">Clause</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {checks.map((c) => (
            <tr key={c.id} className="hover:bg-slate-900/50">
              <td className="p-3">
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] text-cyan-300">{c.id}</span> {c.name}
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
  return <div className="rounded-lg bg-[#03070e] border border-cyan-900/60 p-3 font-mono text-xs text-cyan-100 overflow-x-auto">{children}</div>;
}
