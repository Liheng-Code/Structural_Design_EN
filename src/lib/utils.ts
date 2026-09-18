import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number, digits = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export function fmtForce(n: number): string {
  return fmt(n, 1);
}

export function fmtMoment(n: number): string {
  return fmt(n, 1);
}

export function fmtStress(n: number): string {
  return fmt(n, 2);
}

export function fmtLen(n: number): string {
  return fmt(n, 2);
}

export function fmtEta(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

export function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

export function deepClone<T>(v: T): T {
  return structuredClone(v);
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function downloadText(filename: string, text: string, mime = "application/json"): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
