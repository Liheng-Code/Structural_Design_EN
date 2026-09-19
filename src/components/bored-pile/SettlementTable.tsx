import React from "react";
import { Layers, ShieldCheck, AlertTriangle } from "lucide-react";
import type { LayerSettlementResult } from "@/lib/bored-pile/types";

interface SettlementTableProps {
  layerSettlements: LayerSettlementResult[];
  allowableSettlement?: number;
}

export function SettlementTable({ layerSettlements, allowableSettlement = 25 }: SettlementTableProps) {
  if (!layerSettlements || layerSettlements.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-[#040910] border border-slate-800 rounded-xl text-slate-400 font-mono text-xs">
        No soil layer settlement data available. Please define soil strata.
      </div>
    );
  }

  const totalSoilSettlement = layerSettlements.reduce((acc, l) => acc + l.totalLayerSettlement, 0);
  const isPass = totalSoilSettlement <= allowableSettlement;

  return (
    <div className="border border-slate-800 rounded-xl bg-[#040910] overflow-hidden font-mono shadow-xl">
      <div className="bg-cyan-950/40 px-5 py-4 border-b border-cyan-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="size-4 text-cyan-400" />
            <span>Layer-by-Layer Settlement Breakdown Schedule (SLS)</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Individual soil layer contributions: Immediate elastic ($S_i$) & Primary consolidation ($S_c$) per EN 1997-1.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#081222] px-3 py-1.5 rounded-lg border border-cyan-800/60">
          {isPass ? (
            <ShieldCheck className="size-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="size-4 text-amber-400" />
          )}
          <span className="text-xs text-slate-300">
            Total: <strong className={isPass ? "text-cyan-300" : "text-amber-400"}>{totalSoilSettlement.toFixed(1)} mm</strong> / {allowableSettlement} mm
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
              <th className="p-3.5">Layer ID & Name</th>
              <th className="p-3.5">Soil Type</th>
              <th className="p-3.5">Depth Range (m)</th>
              <th className="p-3.5 text-right">Thickness (m)</th>
              <th className="p-3.5 text-right">Stiffness Modulus E (kPa)</th>
              <th className="p-3.5 text-right text-cyan-400">Immediate S_i (mm)</th>
              <th className="p-3.5 text-right text-amber-400">Consolidation S_c (mm)</th>
              <th className="p-3.5 text-right text-emerald-400">Total Layer S (mm)</th>
              <th className="p-3.5 text-right">Contribution (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {layerSettlements.map((l) => {
              const share = totalSoilSettlement > 0 ? (l.totalLayerSettlement / totalSoilSettlement) * 100 : 0;
              return (
                <tr key={l.layerId} className="hover:bg-slate-900/40 transition">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <span className="size-2 rounded-full bg-cyan-400" />
                    <span>{l.layerId}: {l.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-300 capitalize">{l.soilType}</td>
                  <td className="p-3.5 text-slate-300">{l.depthTop}m – {l.depthBottom}m</td>
                  <td className="p-3.5 text-right text-cyan-300">{l.thickness} m</td>
                  <td className="p-3.5 text-right text-slate-300">{l.modulus.toLocaleString()} kPa</td>
                  <td className="p-3.5 text-right text-cyan-300 font-medium">{l.immediateSettlement} mm</td>
                  <td className="p-3.5 text-right text-amber-300 font-medium">{l.consolidationSettlement} mm</td>
                  <td className="p-3.5 text-right font-bold text-emerald-400">{l.totalLayerSettlement} mm</td>
                  <td className="p-3.5 text-right text-slate-400">{share.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-cyan-950/30 border-t border-cyan-900/60 font-bold text-white">
              <td colSpan={7} className="p-3.5 text-right text-slate-300">Sum of Soil Layer Settlements:</td>
              <td className="p-3.5 text-right text-cyan-300 text-sm">{totalSoilSettlement.toFixed(1)} mm</td>
              <td className="p-3.5 text-right text-emerald-400">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
