import { useState } from "react";
import type { CalcBundle, LoadCaseResult } from "@/lib/engine/types";
import { OverlaidMVDiagram } from "@/components/diagrams/CompareMVDiagram";
import { Button, Card, Field, Select, StatusPill } from "@/components/ui";
import { fmt } from "@/lib/utils";
import { Scale, GitCompare, ArrowRight } from "lucide-react";

export function CompareResultsView({ bundle, currentLcId }: { bundle: CalcBundle; currentLcId: string }) {
  const loadCases = bundle.loadCases;
  const [idA, setIdA] = useState<string>(currentLcId || loadCases[0]?.id || "");
  const [idB, setIdB] = useState<string>(loadCases[1]?.id || loadCases[0]?.id || "");

  const lcA = loadCases.find((c) => c.id === idA) || loadCases[0];
  const lcB = loadCases.find((c) => c.id === idB) || loadCases[1] || loadCases[0];

  if (!lcA || !lcB) return <div className="p-4 text-sm text-muted">No load cases available for comparison.</div>;

  const MmaxA = Math.max(Math.abs(lcA.left.Mmax), Math.abs(lcA.left.Mmin));
  const MmaxB = Math.max(Math.abs(lcB.left.Mmax), Math.abs(lcB.left.Mmin));

  const VmaxA = Math.abs(lcA.left.Vmax);
  const VmaxB = Math.abs(lcB.left.Vmax);

  const dmaxA = lcA.left.dmax;
  const dmaxB = lcB.left.dmax;

  const statusA = lcA.checks.some((c) => c.applicable && c.status === "FAIL") ? "FAIL" : "PASS";
  const statusB = lcB.checks.some((c) => c.applicable && c.status === "FAIL") ? "FAIL" : "PASS";

  return (
    <div className="space-y-4">
      <Card title="Load Case Comparison Suite">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-panel-muted p-4 rounded-xl border border-rule">
          <div className="w-full md:w-1/2">
            <Field label="Load Case A (Solid Blue Line)">
              <Select value={idA} onChange={(e) => setIdA(e.target.value)}>
                {loadCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="hidden md:flex items-center justify-center p-2 text-muted">
            <GitCompare className="size-6 text-cyan-600 animate-pulse" />
          </div>
          <div className="w-full md:w-1/2">
            <Field label="Load Case B (Dashed Red Line)">
              <Select value={idB} onChange={(e) => setIdB(e.target.value)}>
                {loadCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        {/* Overlaid Diagrams */}
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="space-y-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-navy text-center">Bending Moment M</h4>
            <OverlaidMVDiagram lcA={lcA} lcB={lcB} mode="M" />
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-navy text-center">Shear Force V</h4>
            <OverlaidMVDiagram lcA={lcA} lcB={lcB} mode="V" />
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-navy text-center">Wall Deflection δ</h4>
            <OverlaidMVDiagram lcA={lcA} lcB={lcB} mode="d" />
          </div>
        </div>

        {/* Comparative Metrics Table */}
        <div className="mt-6 overflow-x-auto">
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-navy mb-3">Key Engineering Response Comparison</h4>
          <table className="eng-table w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 px-3">Metric / Response Parameter</th>
                <th className="text-left py-2 px-3 text-blue-700">Load Case A ({lcA.id})</th>
                <th className="text-left py-2 px-3 text-red-700">Load Case B ({lcB.id})</th>
                <th className="text-right py-2 px-3">Absolute / % Delta (B vs A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium py-2 px-3">Max Bending Moment (M_max)</td>
                <td className="font-mono py-2 px-3">{fmt(MmaxA, 1)} kNm/m</td>
                <td className="font-mono py-2 px-3">{fmt(MmaxB, 1)} kNm/m</td>
                <td className="font-mono py-2 px-3 text-right">
                  {fmt(MmaxB - MmaxA, 1)} kNm/m ({MmaxA > 0 ? (((MmaxB - MmaxA) / MmaxA) * 100).toFixed(1) : "0"}%)
                </td>
              </tr>
              <tr>
                <td className="font-medium py-2 px-3">Max Shear Force (V_max)</td>
                <td className="font-mono py-2 px-3">{fmt(VmaxA, 1)} kN/m</td>
                <td className="font-mono py-2 px-3">{fmt(VmaxB, 1)} kN/m</td>
                <td className="font-mono py-2 px-3 text-right">
                  {fmt(VmaxB - VmaxA, 1)} kN/m ({VmaxA > 0 ? (((VmaxB - VmaxA) / VmaxA) * 100).toFixed(1) : "0"}%)
                </td>
              </tr>
              <tr>
                <td className="font-medium py-2 px-3">Max Deflection (δ_max)</td>
                <td className="font-mono py-2 px-3">{fmt(dmaxA, 2)} mm</td>
                <td className="font-mono py-2 px-3">{fmt(dmaxB, 2)} mm</td>
                <td className="font-mono py-2 px-3 text-right">
                  {fmt(dmaxB - dmaxA, 2)} mm ({dmaxA > 0 ? (((dmaxB - dmaxA) / dmaxA) * 100).toFixed(1) : "0"}%)
                </td>
              </tr>
              <tr>
                <td className="font-medium py-2 px-3">Checks Status</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${statusA === "PASS" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {statusA}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${statusB === "PASS" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {statusB}
                  </span>
                </td>
                <td className="py-2 px-3 text-right text-muted">
                  {statusA === statusB ? "Identical status" : "Status diverges"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
