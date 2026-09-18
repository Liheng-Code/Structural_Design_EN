import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/engine/types";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "outline" }) {
  const v = {
    primary: "bg-navy text-paper hover:bg-navy-mid",
    ghost: "bg-transparent text-navy hover:bg-paper-2",
    outline: "bg-panel text-ink border border-rule hover:border-rule-strong",
    danger: "bg-fail text-paper hover:opacity-90",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 min-h-10",
        v,
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  unit,
  hint,
  source,
  children,
}: {
  label: string;
  unit?: string;
  hint?: string;
  source?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 min-w-0">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-navy">{label}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {unit ? <span className="font-mono text-xs text-muted">{unit}</span> : null}
          {source ? <span className="text-[10px] uppercase tracking-wide text-muted">{source}</span> : null}
        </span>
      </span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function NumInput({
  value,
  onChange,
  step = 0.1,
  min,
  max,
  className,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      step={step}
      min={min}
      max={max}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={cn(
        "w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 font-mono text-sm tabular-nums text-ink",
        "focus:border-accent",
        className,
      )}
      {...rest}
    />
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 text-sm text-ink focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 text-sm text-ink focus:border-accent",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function StatusPill({ status }: { status: Status }) {
  const cls =
    status === "PASS"
      ? "status-pass"
      : status === "FAIL"
        ? "status-fail"
        : status === "WARNING" || status === "INPUT REQUIRED"
          ? "status-warning"
          : "status-info";
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide", cls)}>
      {status}
    </span>
  );
}

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("calc-sheet rounded-md p-4", className)}>
      {title ? (
        <header className="mb-3 flex items-center justify-between gap-2 border-b border-rule pb-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-navy">{title}</h3>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function UtilBar({ eta, label }: { eta: number; label: string }) {
  const pct = Math.max(0, Math.min(eta, 1.6)) * 100 / 1.6;
  const mark = (1 / 1.6) * 100;
  const tone = eta > 1 ? "bg-fail" : eta >= 0.9 ? "bg-warn" : "bg-pass";
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-xs">
        <span className="text-navy font-medium">{label}</span>
        <span className="font-mono tabular-nums">{Number.isFinite(eta) ? eta.toFixed(2) : "—"}</span>
      </div>
      <div className="relative h-3 rounded-sm bg-paper-2">
        <div className={cn("absolute inset-y-0 left-0 rounded-sm", tone)} style={{ width: `${pct.toFixed(2)}%` }} />
        <div className="absolute inset-y-0 w-px bg-ink" style={{ left: `${mark}%` }} title="100%" />
      </div>
    </div>
  );
}
