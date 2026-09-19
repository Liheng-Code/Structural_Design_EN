import React from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { LayerSettlementResult } from "@/lib/bored-pile/types";

interface SettlementDiagramProps {
  layerSettlements: LayerSettlementResult[];
  allowableSettlement?: number;
}

export function SettlementDiagram({ layerSettlements, allowableSettlement = 25 }: SettlementDiagramProps) {
  if (!layerSettlements || layerSettlements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#040910] border border-slate-800 rounded-xl text-slate-400 font-mono text-xs">
        No soil settlement data available. Please define soil strata.
      </div>
    );
  }

  // Calculate cumulative settlement
  let cumSum = 0;
  const chartData = layerSettlements.map((l) => {
    cumSum += l.totalLayerSettlement;
    return {
      ...l,
      cumulativeSettlement: Math.round(cumSum * 10) / 10,
    };
  });

  return (
    <div className="bg-[#040910] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 font-mono">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase">
            Layer-wise Settlement & Cumulative Profile (Recharts)
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Immediate elastic (Si), Primary Consolidation (Sc), and Cumulative Total Settlement (Stotal)
          </p>
        </div>
        <span className="text-[10px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-2 py-1 rounded">
          Allowable: {allowableSettlement} mm
        </span>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="layerId"
              stroke="#64748b"
              fontSize={11}
              tick={{ fill: "#94a3b8" }}
              label={{ value: "Soil Layers", position: "insideBottom", offset: -15, fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#38bdf8"
              fontSize={11}
              label={{ value: "Layer Settlement (mm)", angle: -90, position: "insideLeft", fill: "#38bdf8", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b"
              fontSize={11}
              label={{ value: "Cumulative Total (mm)", angle: 90, position: "insideRight", fill: "#f59e0b", fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as LayerSettlementResult & { cumulativeSettlement: number };
                  return (
                    <div className="bg-[#0b1320] border border-cyan-500/50 p-3 rounded-xl shadow-xl font-mono text-xs space-y-1">
                      <p className="font-bold text-white border-b border-slate-800 pb-1">
                        {d.layerId}: {d.name} ({d.soilType})
                      </p>
                      <p className="text-slate-300">Depth Range: <strong className="text-white">{d.depthTop}m – {d.depthBottom}m</strong> (t = {d.thickness}m)</p>
                      <p className="text-cyan-300">Immediate Settlement (Si): <strong className="text-white">{d.immediateSettlement} mm</strong></p>
                      <p className="text-amber-300">Consolidation Settlement (Sc): <strong className="text-white">{d.consolidationSettlement} mm</strong></p>
                      <p className="text-emerald-400">Total Layer Settlement: <strong className="text-white">{d.totalLayerSettlement} mm</strong></p>
                      <p className="text-purple-300 pt-1 border-t border-slate-800 font-bold">
                        Cumulative Settlement: {d.cumulativeSettlement} mm
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="immediateSettlement" name="Immediate Settlement (mm)" fill="#22d3ee" stackId="a" />
            <Bar yAxisId="left" dataKey="consolidationSettlement" name="Consolidation Settlement (mm)" fill="#f59e0b" stackId="a" />
            <Line yAxisId="right" type="monotone" dataKey="cumulativeSettlement" name="Cumulative Total (mm)" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: "#ec4899" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Dynamic update enabled across soil strata modifications</span>
        <span className="text-cyan-300">Max Depth: {chartData[chartData.length - 1]?.depthBottom ?? 0}m</span>
      </div>
    </div>
  );
}
