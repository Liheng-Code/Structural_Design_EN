import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
} from "lucide-react";
import { SOIL_PRESETS, createLayerFromPreset, type SoilPreset } from "@/lib/bored-pile/presets";
import type { SoilLayerInput } from "@/lib/bored-pile/types";
import { SoilTextureIcon } from "../SoilTextureIcon";

interface AddLayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLayer: (layer: SoilLayerInput) => void;
  existingLayers: SoilLayerInput[];
  pileLength: number;
}

export function AddLayerDialog({
  isOpen,
  onClose,
  onAddLayer,
  existingLayers,
  pileLength,
}: AddLayerDialogProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("stiff-clay");
  const [topDepth, setTopDepth] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(5.0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Form states based on selected preset
  const [layerData, setLayerData] = useState<SoilLayerInput>(() => {
    const preset = SOIL_PRESETS.find((p) => p.id === "stiff-clay") || SOIL_PRESETS[0];
    return createLayerFromPreset(preset, existingLayers.length + 1, 0, 5.0);
  });

  // Calculate default top depth based on last layer
  useEffect(() => {
    if (isOpen) {
      const lastLayer = existingLayers[existingLayers.length - 1];
      const nextTop = lastLayer ? Math.round(lastLayer.bottomDepth * 100) / 100 : 0;
      setTopDepth(nextTop);
      const preset = SOIL_PRESETS.find((p) => p.id === selectedPresetId) || SOIL_PRESETS[0];
      const nextThickness = preset.defaultThickness;
      setThickness(nextThickness);
      setLayerData(createLayerFromPreset(preset, existingLayers.length + 1, nextTop, nextThickness));
    }
  }, [isOpen, existingLayers, selectedPresetId]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: SoilPreset) => {
    setSelectedPresetId(preset.id);
    const newThickness = preset.defaultThickness;
    setThickness(newThickness);
    const updated = createLayerFromPreset(
      preset,
      existingLayers.length + 1,
      topDepth,
      newThickness
    );
    setLayerData(updated);
  };

  const handleTopDepthChange = (newTop: number) => {
    setTopDepth(newTop);
    setLayerData((prev) => ({
      ...prev,
      topDepth: newTop,
      bottomDepth: Math.round((newTop + thickness) * 100) / 100,
    }));
  };

  const handleThicknessChange = (newThickness: number) => {
    const safeThickness = Math.max(0.1, newThickness);
    setThickness(safeThickness);
    setLayerData((prev) => ({
      ...prev,
      bottomDepth: Math.round((topDepth + safeThickness) * 100) / 100,
    }));
  };

  const handleBottomDepthChange = (newBottom: number) => {
    const newThickness = Math.max(0.1, Math.round((newBottom - topDepth) * 100) / 100);
    setThickness(newThickness);
    setLayerData((prev) => ({
      ...prev,
      bottomDepth: newBottom,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLayer({
      ...layerData,
      id: `L${existingLayers.length + 1}`,
      topDepth,
      bottomDepth: Math.round((topDepth + thickness) * 100) / 100,
    });
    onClose();
  };

  const isCohesive = layerData.behaviorType === "cohesive";
  const isRock = layerData.behaviorType === "rock";
  const bottomDepth = Math.round((topDepth + thickness) * 100) / 100;
  const intersectsToe = topDepth <= pileLength && bottomDepth >= pileLength;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#081325] border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/60 bg-[#060e18]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-600/40 text-cyan-300">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Add New Soil Stratum
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                Layer L{existingLayers.length + 1} • Eurocode 7 Soil Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Step 1: Soil Archetype Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-cyan-400" />
                1. Select Soil Archetype / Preset
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Auto-populates standard geotechnical parameters
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SOIL_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl text-left border transition relative flex flex-col justify-between min-h-[82px] ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                        : "border-slate-800 bg-[#040a14]/90 hover:border-slate-700 hover:bg-[#06101f]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <SoilTextureIcon
                            layerOrType={{ name: preset.name, type: preset.category, behaviorType: preset.data.behaviorType }}
                            size="xs"
                          />
                          <span className="font-mono text-[10px] text-slate-400">{preset.uscs}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="size-3 text-cyan-400" />}
                      </div>
                      <p className="font-medium text-slate-100 text-xs mt-0.5 line-clamp-1">
                        {preset.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                      {preset.primaryMetric.split("·")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Stratum Boundaries */}
          <div className="bg-[#050c18] border border-cyan-900/50 rounded-xl p-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 font-semibold block mb-3">
              2. Stratum Depth Boundaries & Elevation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">
                  Top Depth (m bgl)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={topDepth}
                  onChange={(e) => handleTopDepthChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 font-mono text-sm font-semibold text-cyan-200 outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Ground surface = 0.0 m
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">
                  Thickness (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={thickness}
                  onChange={(e) => handleThicknessChange(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 font-mono text-sm font-semibold text-cyan-200 outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Stratum vertical height
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">
                  Bottom Depth (m bgl)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={topDepth + 0.1}
                  value={bottomDepth}
                  onChange={(e) => handleBottomDepthChange(parseFloat(e.target.value) || topDepth + 0.1)}
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 font-mono text-sm font-semibold text-cyan-200 outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Calculated boundary
                </span>
              </div>
            </div>

            {/* Depth Relation Badge */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Elevation span:{" "}
                <strong className="text-cyan-300">
                  {topDepth.toFixed(2)} m → {bottomDepth.toFixed(2)} m
                </strong>{" "}
                ({thickness.toFixed(2)} m thick)
              </span>
              {intersectsToe && (
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300">
                  ⚡ Pile Toe ({pileLength.toFixed(1)} m) sits in this layer (End Bearing Stratum)
                </span>
              )}
              {isRock && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
                  🪨 Competent Rock Stratum (Rock Socket)
                </span>
              )}
            </div>
          </div>

          {/* Step 3: Primary Soil Properties */}
          <div className="bg-[#050c18] border border-cyan-900/50 rounded-xl p-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 font-semibold block mb-3">
              3. Primary Geotechnical Parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 font-mono">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Stratum Description / Name
                </label>
                <input
                  type="text"
                  value={layerData.name}
                  onChange={(e) => setLayerData({ ...layerData, name: e.target.value })}
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Behavior Type
                </label>
                <select
                  value={layerData.behaviorType || "cohesive"}
                  onChange={(e) => {
                    const val = e.target.value as SoilLayerInput["behaviorType"];
                    setLayerData({
                      ...layerData,
                      behaviorType: val,
                      drainage: val === "cohesive" ? "undrained" : "drained",
                      method: val === "cohesive" ? "alpha" : "beta",
                    });
                  }}
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                >
                  <option value="cohesive">Cohesive (Clay / Silt)</option>
                  <option value="granular">Granular (Sand / Gravel)</option>
                  <option value="rock">Rock / Bedrock</option>
                  <option value="custom">Custom Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Design Method
                </label>
                <select
                  value={layerData.method}
                  onChange={(e) =>
                    setLayerData({ ...layerData, method: e.target.value as SoilLayerInput["method"] })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                >
                  <option value="alpha">α-method (Undrained Cohesion)</option>
                  <option value="beta">β-method (Effective Stress)</option>
                  <option value="empirical">Empirical / Direct</option>
                </select>
              </div>

              {/* Unit Weights */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  γ Bulk (kN/m³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={layerData.gamma}
                  onChange={(e) =>
                    setLayerData({ ...layerData, gamma: parseFloat(e.target.value) || 18 })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  γ Saturated (kN/m³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={layerData.gammaSat ?? layerData.gamma + 1}
                  onChange={(e) =>
                    setLayerData({
                      ...layerData,
                      gammaSat: parseFloat(e.target.value) || layerData.gamma + 1,
                      gammaEffective: (parseFloat(e.target.value) || layerData.gamma + 1) - 9.81,
                    })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              {/* Strength values */}
              {isCohesive ? (
                <div>
                  <label className="block text-[10px] uppercase text-cyan-300 mb-1 font-bold">
                    cu Undrained Strength (kPa)
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={layerData.cu}
                    onChange={(e) =>
                      setLayerData({ ...layerData, cu: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-[#030710] border border-cyan-600 focus:border-cyan-400 rounded-lg px-3 py-2 text-cyan-200 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] uppercase text-amber-300 mb-1 font-bold">
                    φ' Friction Angle (deg)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={layerData.phi}
                    onChange={(e) =>
                      setLayerData({ ...layerData, phi: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-[#030710] border border-amber-600 focus:border-amber-400 rounded-lg px-3 py-2 text-amber-200 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  SPT N-Value
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={layerData.sptN ?? 0}
                  onChange={(e) =>
                    setLayerData({ ...layerData, sptN: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              {/* End bearing / shaft friction direct input */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Char. qs,k Friction (kPa)
                </label>
                <input
                  type="number"
                  step="5"
                  value={layerData.characteristicShaftFriction ?? 0}
                  onChange={(e) =>
                    setLayerData({
                      ...layerData,
                      characteristicShaftFriction: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Char. qb,k Base (kPa)
                </label>
                <input
                  type="number"
                  step="50"
                  value={layerData.characteristicBaseResistance ?? 0}
                  onChange={(e) =>
                    setLayerData({
                      ...layerData,
                      characteristicBaseResistance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Secant Modulus E50 (MPa)
                </label>
                <input
                  type="number"
                  step="1"
                  value={layerData.e50 ? layerData.e50 / 1000 : 20}
                  onChange={(e) =>
                    setLayerData({
                      ...layerData,
                      e50: (parseFloat(e.target.value) || 20) * 1000,
                    })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Interface Factor Rinter
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.3"
                  max="1.0"
                  value={layerData.rInter ?? 0.7}
                  onChange={(e) =>
                    setLayerData({
                      ...layerData,
                      rInter: parseFloat(e.target.value) || 0.7,
                    })
                  }
                  className="w-full bg-[#030710] border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Collapsible Advanced Parameters */}
          <div className="border border-slate-800 rounded-xl bg-[#040a14] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-slate-300 hover:bg-slate-900/60 font-mono text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Info className="size-4 text-cyan-400" />
                <span className="font-semibold text-slate-200">
                  Advanced Geotechnical & Stiffness Parameters (PLAXIS / Settlement)
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800/60">
                  Pre-filled with recommended defaults
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Eoed (MPa)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={layerData.eoed ? layerData.eoed / 1000 : ""}
                    onChange={(e) =>
                      setLayerData({
                        ...layerData,
                        eoed: (parseFloat(e.target.value) || 0) * 1000,
                      })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Eur (MPa)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={layerData.eur ? layerData.eur / 1000 : ""}
                    onChange={(e) =>
                      setLayerData({
                        ...layerData,
                        eur: (parseFloat(e.target.value) || 0) * 1000,
                      })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Poisson's ν
                  </label>
                  <input
                    type="number"
                    step="0.02"
                    value={layerData.nu ?? 0.3}
                    onChange={(e) =>
                      setLayerData({ ...layerData, nu: parseFloat(e.target.value) || 0.3 })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Permeability k (m/s)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={layerData.permeability ?? 1e-6}
                    onChange={(e) =>
                      setLayerData({
                        ...layerData,
                        permeability: parseFloat(e.target.value) || 1e-6,
                      })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">OCR</label>
                  <input
                    type="number"
                    step="0.2"
                    value={layerData.ocr ?? 1}
                    onChange={(e) =>
                      setLayerData({ ...layerData, ocr: parseFloat(e.target.value) || 1 })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">K0</label>
                  <input
                    type="number"
                    step="0.05"
                    value={layerData.k0 ?? 0.5}
                    onChange={(e) =>
                      setLayerData({ ...layerData, k0: parseFloat(e.target.value) || 0.5 })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Void Ratio e0
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={layerData.initialVoidRatio ?? 0.7}
                    onChange={(e) =>
                      setLayerData({
                        ...layerData,
                        initialVoidRatio: parseFloat(e.target.value) || 0.7,
                      })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Cc</label>
                  <input
                    type="number"
                    step="0.02"
                    value={layerData.compressionIndex ?? 0.2}
                    onChange={(e) =>
                      setLayerData({
                        ...layerData,
                        compressionIndex: parseFloat(e.target.value) || 0.2,
                      })
                    }
                    className="w-full bg-[#030710] border border-slate-700 rounded px-2 py-1.5 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyan-900/60 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="size-4" />
              <span>Add Stratum to Ground Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
