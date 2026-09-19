import { useState, useMemo } from "react";
import { Button, Card, Field, NumInput, Select, TextInput } from "@/components/ui";
import { defaultProject, DESIGN_TYPE_LABEL, SECTION_LIBRARY, TIE_DIAMETERS } from "@/lib/engine/defaults";
import { cbpSolidRatio } from "@/lib/engine/cbp-section";
import type { DesignApproach, DesignType, EarthMethod, RetainingWallSystem, StructuralModel, TrafficModel, PorePressureMode } from "@/lib/engine/types";
import { computeLayerPorePressure } from "@/lib/engine/calculate";
import { useProject } from "@/lib/store";
import { uid } from "@/lib/utils";
import {
  SoilProfileVisualizer,
  getSoilMaterialStyle,
  SOIL_ARCHETYPES,
} from "@/components/SoilProfileVisualizer";
import { GeometryLoadsPanel } from "@/components/retaining-wall/GeometryLoadsPanel";
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Table as TableIcon,
  Columns3,
  Info,
  GripVertical,
  Droplets,
  Waves,
  Minimize2,
  Search,
  X,
  Filter,
} from "lucide-react";

export function ProjectPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Document information">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Retaining wall system" hint="CBP is a conceptual configuration until its separate EC2/EC7 checks are implemented.">
          <Select value={p.wallSystem ?? "sheet-pile"} onChange={(e) => patch((q) => { q.wallSystem = e.target.value as RetainingWallSystem; q.cbp ??= defaultProject().cbp; })}>
            <option value="sheet-pile">Sheet pile wall</option>
            <option value="cbp">Contiguous bored pile (CBP) wall</option>
          </Select>
        </Field>
        <Field label="Project name">
          <TextInput value={p.meta.projectName} onChange={(e) => patch((q) => (q.meta.projectName = e.target.value))} />
        </Field>
        <Field label="Option">
          <TextInput value={p.meta.option} onChange={(e) => patch((q) => (q.meta.option = e.target.value))} />
        </Field>
        <Field label="Prepared by">
          <TextInput value={p.meta.preparedBy} onChange={(e) => patch((q) => (q.meta.preparedBy = e.target.value))} />
        </Field>
        <Field label="Checked by">
          <TextInput value={p.meta.checkedBy} onChange={(e) => patch((q) => (q.meta.checkedBy = e.target.value))} />
        </Field>
        <Field label="Revision">
          <TextInput value={p.meta.revision} onChange={(e) => patch((q) => (q.meta.revision = e.target.value))} />
        </Field>
        <Field label="Date">
          <TextInput type="date" value={p.meta.date} onChange={(e) => patch((q) => (q.meta.date = e.target.value))} />
        </Field>
        <Field label="Issue status">
          <TextInput value={p.meta.status} onChange={(e) => patch((q) => (q.meta.status = e.target.value))} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          className="mt-2 w-full min-h-24 rounded-sm border border-rule bg-panel px-2.5 py-2 text-sm"
          value={p.meta.notes}
          onChange={(e) => patch((q) => (q.meta.notes = e.target.value))}
        />
      </Field>
    </Card>
  );
}

export function DesignPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Design type and structural model">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="System" hint="Changing type shows/hides relevant checks. Formulas are not forced to be identical.">
          <Select value={p.designType} onChange={(e) => patch((q) => (q.designType = e.target.value as DesignType))}>
            {Object.entries(DESIGN_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Structural model">
          <Select value={p.structuralModel} onChange={(e) => patch((q) => (q.structuralModel = e.target.value as StructuralModel))}>
            <option value="cantilever">Simplified equivalent cantilever</option>
            <option value="anchored-beam">Anchored beam</option>
            <option value="multi-anchor">Multi-anchor beam</option>
            <option value="winkler">Beam on elastic foundation (default)</option>
            <option value="user-mv">User-defined M/V (not active)</option>
          </Select>
        </Field>
        <Field label="Earth pressure method">
          <Select value={p.earth.method} onChange={(e) => patch((q) => (q.earth.method = e.target.value as EarthMethod))}>
            <option value="rankine">Rankine (preliminary default)</option>
            <option value="coulomb">Coulomb</option>
            <option value="user-ka">User-defined Ka / Kp</option>
            <option value="at-rest">At-rest K0</option>
          </Select>
        </Field>
        <Field label="Restrained wall uses K0" hint="Stiff ties may prevent Ka mobilisation.">
          <Select
            value={p.earth.useK0IfRestrained ? "yes" : "no"}
            onChange={(e) => patch((q) => (q.earth.useK0IfRestrained = e.target.value === "yes"))}
          >
            <option value="no">No — use Ka</option>
            <option value="yes">Yes — use K0 on core</option>
          </Select>
        </Field>
      </div>
    </Card>
  );
}

export function GeometryPanel() {
  return <GeometryLoadsPanel />;
}

export function SoilPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<"split" | "profile" | "table">("split");
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>("all");

  const isFilterActive = Boolean(searchQuery.trim() || (selectedMaterialFilter && selectedMaterialFilter !== "all"));

  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = { all: p.nativeLayers.length };
    const categories = ["clay", "sand", "gravel", "silt", "rock", "fill"];
    categories.forEach((cat) => {
      counts[cat] = p.nativeLayers.filter((l) => {
        const s = `${l.soilType || ""} ${l.name || ""} ${l.description || ""}`.toLowerCase();
        return s.includes(cat);
      }).length;
    });
    return counts;
  }, [p.nativeLayers]);

  const filteredLayersWithIndex = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return p.nativeLayers
      .map((layer, origIndex) => ({ layer, origIndex }))
      .filter(({ layer }) => {
        // Material category chip
        if (selectedMaterialFilter && selectedMaterialFilter !== "all") {
          const mat = (layer.soilType || "").toLowerCase();
          const name = (layer.name || "").toLowerCase();
          const desc = (layer.description || "").toLowerCase();
          const target = selectedMaterialFilter.toLowerCase();
          if (!mat.includes(target) && !name.includes(target) && !desc.includes(target)) {
            return false;
          }
        }

        // Search text query
        if (!query) return true;
        const nameMatch = layer.name.toLowerCase().includes(query);
        const matMatch = (layer.soilType || "").toLowerCase().includes(query);
        const descMatch = (layer.description || "").toLowerCase().includes(query);
        const drainageMatch = (layer.drainage || "").toLowerCase().includes(query);
        return nameMatch || matMatch || descMatch || drainageMatch;
      });
  }, [p.nativeLayers, searchQuery, selectedMaterialFilter]);

  const waterLevel = p.water?.gwlNative ?? p.water?.dryDown ?? 0;
  const embedment = p.geometry?.embedment ?? 6;
  const riverbed = p.geometry?.riverbed ?? 0;
  const toeLevel = riverbed - embedment;

  const handleAutoAlign = () => {
    patch((q) => {
      for (let i = 0; i < q.nativeLayers.length - 1; i++) {
        q.nativeLayers[i + 1]!.zTop = q.nativeLayers[i]!.zBot;
      }
    });
  };

  const handleAddLayer = () => {
    patch((q) => {
      const last = q.nativeLayers.at(-1);
      const top = last?.zBot ?? 0;
      q.nativeLayers.push({
        id: uid("nat"),
        name: `Layer ${q.nativeLayers.length + 1}`,
        description: "New stratum",
        zTop: top,
        zBot: top - 3,
        gamma: 18,
        gammaSat: 20,
        phi: 30,
        c: 0,
        cu: 0,
        E: 20000,
        nu: 0.3,
        kPerm: 1e-5,
        OCR: 1,
        sptN: 10,
        drainage: "drained",
        soilType: "alluvium",
      });
    });
  };

  const handleRemoveLayer = (index: number) => {
    if (p.nativeLayers.length <= 1) return;
    patch((q) => {
      q.nativeLayers.splice(index, 1);
    });
  };

  const handleReorderLayer = (from: number, to: number, autoRestack: boolean = true) => {
    if (to < 0 || to >= p.nativeLayers.length || from === to) return;
    patch((q) => {
      const list = [...q.nativeLayers];
      const [item] = list.splice(from, 1);
      if (!item) return;
      list.splice(to, 0, item);
      if (autoRestack) {
        const topElevation = q.nativeLayers[0]?.zTop ?? 0;
        let currentZ = topElevation;
        for (const layer of list) {
          const thickness = Math.max(0.1, layer.zTop - layer.zBot);
          layer.zTop = Number(currentZ.toFixed(2));
          currentZ -= thickness;
          layer.zBot = Number(currentZ.toFixed(2));
        }
      }
      q.nativeLayers = list;
    });
  };

  const [tableDragIdx, setTableDragIdx] = useState<number | null>(null);
  const [tableDragOverIdx, setTableDragOverIdx] = useState<number | null>(null);
  const [tableDropPos, setTableDropPos] = useState<"before" | "after" | null>(null);

  const handleTableDrop = (targetIdx: number) => {
    if (tableDragIdx === null || tableDragIdx === targetIdx) return;
    let finalTarget = tableDropPos === "before" ? targetIdx : targetIdx + 1;
    if (tableDragIdx < finalTarget) {
      finalTarget -= 1;
    }
    if (finalTarget >= 0 && finalTarget < p.nativeLayers.length && finalTarget !== tableDragIdx) {
      handleReorderLayer(tableDragIdx, finalTarget, true);
    }
    setTableDragIdx(null);
    setTableDragOverIdx(null);
    setTableDropPos(null);
  };

  const handleDuplicateLayer = (index: number) => {
    patch((q) => {
      const src = q.nativeLayers[index];
      if (!src) return;
      const thickness = Math.max(0.5, src.zTop - src.zBot);
      const last = q.nativeLayers.at(-1);
      const newTop = last ? last.zBot : src.zBot;
      q.nativeLayers.push({
        ...structuredClone(src),
        id: uid("nat"),
        name: `${src.name} (Copy)`,
        zTop: newTop,
        zBot: newTop - thickness,
      });
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    const arch = SOIL_ARCHETYPES.find((a) => a.key === presetKey);
    if (!arch) return;
    patch((q) => {
      const last = q.nativeLayers.at(-1);
      const top = last?.zBot ?? 0;
      q.nativeLayers.push({
        id: uid("nat"),
        name: arch.soilType,
        description: arch.description,
        zTop: top,
        zBot: top - 3,
        gamma: arch.gamma,
        gammaSat: arch.gammaSat,
        phi: arch.phi,
        c: arch.c,
        cu: arch.cu,
        E: arch.E,
        nu: 0.3,
        kPerm: 1e-5,
        OCR: 1,
        sptN: arch.sptN,
        drainage: arch.drainage,
        soilType: arch.type,
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Core granular fill card */}
      <Card title="Core granular fill (inside U)">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Description">
            <TextInput value={p.coreFill.name} onChange={(e) => patch((q) => (q.coreFill.name = e.target.value))} />
          </Field>
          <Field label="γ bulk" unit="kN/m³">
            <NumInput value={p.coreFill.gamma} onChange={(n) => patch((q) => (q.coreFill.gamma = n))} />
          </Field>
          <Field label="γ sat" unit="kN/m³">
            <NumInput value={p.coreFill.gammaSat} onChange={(n) => patch((q) => (q.coreFill.gammaSat = n))} />
          </Field>
          <Field label="φ'" unit="°">
            <NumInput value={p.coreFill.phi} onChange={(n) => patch((q) => (q.coreFill.phi = n))} />
          </Field>
          <Field label="c'" unit="kPa">
            <NumInput value={p.coreFill.c} onChange={(n) => patch((q) => (q.coreFill.c = n))} />
          </Field>
          <Field label="Compaction" unit="% MDD">
            <NumInput value={p.coreFill.compaction} onChange={(n) => patch((q) => (q.coreFill.compaction = n))} />
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted">
          Core self-weight is used as a stabilising action on the U-block. It is not treated as a rigid diaphragm.
        </p>
      </Card>

      {/* Main Native Soil Layers Section with Visual Profile */}
      <div className="space-y-4">
        {/* Search & Filter Toolbar for Stratigraphy Layers */}
        <div className="bg-paper p-3.5 rounded-md border border-rule shadow-xs space-y-2.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input Bar */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
              <input
                type="text"
                id="soil-strata-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search soil layers by name, description, material type (e.g. clay, sand, gravel, silt, rock)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-sm border border-rule bg-panel text-ink placeholder:text-muted focus:outline-hidden focus:border-navy focus:ring-1 focus:ring-navy transition font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="clear-soil-search-btn"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted hover:text-ink transition cursor-pointer"
                  title="Clear search query"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter Status Badge and Reset Action */}
            <div className="flex items-center gap-2.5 text-xs shrink-0 justify-between md:justify-end">
              <span className="text-muted font-mono text-[11px]">
                {isFilterActive ? (
                  <span className="inline-flex items-center gap-1.5 text-navy font-semibold">
                    <Filter className="size-3.5 text-accent" />
                    <span>
                      Showing {filteredLayersWithIndex.length} of {p.nativeLayers.length} strata
                    </span>
                  </span>
                ) : (
                  <span>{p.nativeLayers.length} total strata</span>
                )}
              </span>

              {isFilterActive && (
                <button
                  type="button"
                  id="reset-soil-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMaterialFilter("all");
                  }}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-accent hover:bg-paper-2 border border-rule transition cursor-pointer"
                  title="Reset search and material filters"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Quick Material Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-rule/60 text-xs">
            <span className="text-[11px] font-medium text-muted mr-1 flex items-center gap-1">
              <Filter className="size-3" />
              <span>Material Filter:</span>
            </span>
            {[
              { key: "all", label: "All Materials" },
              { key: "clay", label: "Clay" },
              { key: "sand", label: "Sand" },
              { key: "gravel", label: "Gravel" },
              { key: "silt", label: "Silt" },
              { key: "rock", label: "Rock" },
              { key: "fill", label: "Fill" },
            ].map((mat) => {
              const count = materialCounts[mat.key] ?? 0;
              const isActive = selectedMaterialFilter === mat.key;
              return (
                <button
                  key={mat.key}
                  type="button"
                  id={`soil-filter-chip-${mat.key}`}
                  onClick={() => {
                    setSelectedMaterialFilter(isActive && mat.key !== "all" ? "all" : mat.key);
                  }}
                  className={`px-2.5 py-0.5 rounded-sm text-[11px] font-medium transition cursor-pointer border ${
                    isActive
                      ? "bg-navy text-paper border-navy shadow-xs"
                      : count > 0
                        ? "bg-panel text-ink border-rule hover:bg-paper-2 hover:border-muted"
                        : "bg-panel/50 text-muted border-rule/50 hover:bg-paper-2"
                  }`}
                  title={`Filter strata containing '${mat.label}'`}
                >
                  <span>{mat.label}</span>
                  {mat.key !== "all" && count > 0 && (
                    <span
                      className={`ml-1.5 px-1 py-0.2 rounded-full text-[9px] font-mono ${
                        isActive ? "bg-paper/20 text-paper" : "bg-paper-2 text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Mode & Fast Actions Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-2 p-3 rounded-md border border-rule">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-navy" />
            <span className="text-sm font-semibold text-navy uppercase tracking-wider font-display">
              Native Ground Stratigraphy Model
            </span>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-panel border border-rule text-muted font-mono">
              {p.nativeLayers.length} Strata
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-sm border border-rule bg-panel p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLayoutMode("split")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition ${
                  layoutMode === "split" ? "bg-navy text-paper" : "text-muted hover:text-ink"
                }`}
              >
                <Columns3 className="size-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("profile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition ${
                  layoutMode === "profile" ? "bg-navy text-paper" : "text-muted hover:text-ink"
                }`}
              >
                <Layers className="size-3.5" />
                <span>Visual Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("table")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition ${
                  layoutMode === "table" ? "bg-navy text-paper" : "text-muted hover:text-ink"
                }`}
              >
                <TableIcon className="size-3.5" />
                <span>Data Table</span>
              </button>
            </div>

            {/* Compact Toggle Button */}
            <Button
              variant={isCompact ? "primary" : "outline"}
              onClick={() => setIsCompact(!isCompact)}
              className="text-xs"
              title={
                isCompact
                  ? "Compact view active: optional pore pressure and groundwater settings are hidden for a cleaner stratigraphy overview. Click to expand."
                  : "Toggle compact view to hide optional pore pressure and groundwater settings for a cleaner stratigraphy overview."
              }
            >
              <Minimize2 className="size-3.5 mr-1" />
              <span>Compact</span>
            </Button>

            {/* Auto-Align Button */}
            <Button
              variant="outline"
              onClick={handleAutoAlign}
              className="text-xs"
              title="Ensure layer boundaries connect without gaps or overlaps"
            >
              <Sparkles className="size-3.5 text-accent mr-1" />
              <span>Auto-Align Boundaries</span>
            </Button>

            {/* Add Layer Button */}
            <Button variant="primary" onClick={handleAddLayer} className="text-xs">
              <Plus className="size-3.5 mr-1" />
              <span>Add Layer</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Layout: Split, Profile, or Table */}
        <div
          className={`grid gap-6 items-start ${
            layoutMode === "split"
              ? "grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,1fr)]"
              : "grid-cols-1"
          }`}
        >
          {/* Table / Input Section */}
          {(layoutMode === "split" || layoutMode === "table") && (
            <Card
              title="Soil Strata Parameter Table"
              action={
                <div className="flex items-center gap-2 text-xs font-mono">
                  {isFilterActive && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[11px] font-semibold">
                      Filtered ({filteredLayersWithIndex.length}/{p.nativeLayers.length})
                    </span>
                  )}
                  <span className="text-muted">
                    {isCompact ? "Compact mode active · " : ""}Elevations in meters relative to datum
                  </span>
                </div>
              }
              className="overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="eng-table w-full">
                  <thead>
                    <tr>
                      <th className="w-8 text-center" title="Drag & drop to reorder stratigraphy sequence">
                        <GripVertical className="size-3.5 mx-auto text-muted" />
                      </th>
                      <th className="w-10 text-center">Color</th>
                      <th>Stratum Name</th>
                      <th className="num">z top (m)</th>
                      <th className="num">z bot (m)</th>
                      <th className="num">Δz (m)</th>
                      <th className="num">γ (kN/m³)</th>
                      <th className="num">γsat</th>
                      <th className="num">φ' (°)</th>
                      <th className="num">c' (kPa)</th>
                      <th className="num">E (kPa)</th>
                      {!isCompact && (
                        <>
                          <th className="text-center whitespace-nowrap" title="Stratum-specific phreatic water table (perched/aquifer)">
                            <div className="flex items-center justify-center gap-1">
                              <Droplets className="size-3 text-sky-600" />
                              <span>GWL (m)</span>
                            </div>
                          </th>
                          <th className="whitespace-nowrap" title="Pore water pressure distribution mode and parameters">
                            <div className="flex items-center gap-1">
                              <Waves className="size-3 text-indigo-600" />
                              <span>Pore Water Pressure (u)</span>
                            </div>
                          </th>
                        </>
                      )}
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLayersWithIndex.length === 0 ? (
                      <tr>
                        <td colSpan={isCompact ? 11 : 13} className="py-8 text-center bg-paper-2">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="size-6 text-muted" />
                            <p className="text-sm font-semibold text-ink">
                              No strata match "{searchQuery || selectedMaterialFilter}"
                            </p>
                            <p className="text-xs text-muted max-w-sm">
                              No soil strata in the stratigraphy model match your search query or material type filter.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedMaterialFilter("all");
                              }}
                              className="text-xs mt-1"
                            >
                              Clear Search Filter
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredLayersWithIndex.map(({ layer: L, origIndex: i }) => {
                        const isSelected = selectedLayerId === L.id;
                        const isHovered = hoveredLayerId === L.id;
                        const thickness = L.zTop - L.zBot;
                        const style = getSoilMaterialStyle(L, i);

                        return (
                          <tr
                            key={L.id}
                            draggable={!isFilterActive}
                            onDragStart={(e) => {
                              if (isFilterActive) return;
                              e.dataTransfer.setData("text/plain", i.toString());
                              e.dataTransfer.effectAllowed = "move";
                              setTableDragIdx(i);
                            }}
                            onDragOver={(e) => {
                              if (isFilterActive) return;
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              if (tableDragIdx === null || tableDragIdx === i) return;
                              const rect = e.currentTarget.getBoundingClientRect();
                              const pos = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
                              if (tableDragOverIdx !== i || tableDropPos !== pos) {
                                setTableDragOverIdx(i);
                                setTableDropPos(pos);
                              }
                            }}
                            onDrop={(e) => {
                              if (isFilterActive) return;
                              e.preventDefault();
                              handleTableDrop(i);
                            }}
                            onDragEnd={() => {
                              setTableDragIdx(null);
                              setTableDragOverIdx(null);
                              setTableDropPos(null);
                            }}
                            onClick={() => setSelectedLayerId(L.id)}
                            onMouseEnter={() => setHoveredLayerId(L.id)}
                            onMouseLeave={() => setHoveredLayerId(null)}
                            className={`cursor-pointer transition-colors relative ${
                              tableDragIdx === i
                                ? "opacity-35 bg-paper-2"
                                : isSelected
                                  ? "bg-paper-2 font-medium"
                                  : isHovered
                                    ? "bg-panel"
                                    : ""
                            }`}
                          >
                            {/* Drag handle column */}
                            <td
                              className={`text-center ${
                                isFilterActive
                                  ? "opacity-30 cursor-not-allowed"
                                  : "cursor-grab active:cursor-grabbing text-muted hover:text-navy"
                              }`}
                              title={
                                isFilterActive
                                  ? "Clear search filter to reorder stratigraphy sequence"
                                  : "Click and drag to change stratigraphy order"
                              }
                            >
                              <GripVertical className="size-3.5 mx-auto" />
                            </td>

                          {/* Color block swatch matching the visual profile */}
                          <td className="text-center">
                            <div
                              className="size-5 mx-auto rounded-xs border shadow-xs"
                              style={{ backgroundColor: style.fill, borderColor: style.stroke }}
                              title={`Stratum #${i + 1} material swatch`}
                            />
                          </td>

                          {/* Stratum Name Input */}
                          <td>
                            <TextInput
                              value={L.name}
                              onChange={(e) =>
                                patch((q) => (q.nativeLayers[i]!.name = e.target.value))
                              }
                              className="w-full text-xs font-semibold"
                            />
                          </td>

                          {/* zTop */}
                          <td className="num">
                            <NumInput
                              step={0.1}
                              value={L.zTop}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.zTop = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* zBot */}
                          <td className="num">
                            <NumInput
                              step={0.1}
                              value={L.zBot}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.zBot = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* Thickness computed */}
                          <td className="num font-mono text-xs font-semibold text-navy">
                            {thickness.toFixed(2)}
                          </td>

                          {/* gamma */}
                          <td className="num">
                            <NumInput
                              step={0.1}
                              value={L.gamma}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.gamma = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* gammaSat */}
                          <td className="num">
                            <NumInput
                              step={0.1}
                              value={L.gammaSat}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.gammaSat = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* phi */}
                          <td className="num">
                            <NumInput
                              step={0.5}
                              value={L.phi}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.phi = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* c */}
                          <td className="num">
                            <NumInput
                              step={1}
                              value={L.c}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.c = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {/* E */}
                          <td className="num">
                            <NumInput
                              step={1000}
                              value={L.E}
                              onChange={(n) =>
                                patch((q) => {
                                  q.nativeLayers[i]!.E = n;
                                })
                              }
                              className="text-xs"
                            />
                          </td>

                          {!isCompact && (
                            <>
                              {/* Stratum-specific Groundwater Table (GWL) */}
                              <td className="text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <input
                                    type="checkbox"
                                    checked={!!L.hasWaterTable}
                                    title={
                                      L.hasWaterTable
                                        ? "Stratum-specific water table active (uncheck to revert to global water level)"
                                        : "Check to define a localized/perched groundwater table for this stratum"
                                    }
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      patch((q) => {
                                        const lyr = q.nativeLayers[i]!;
                                        lyr.hasWaterTable = checked;
                                        if (checked && lyr.waterTable === undefined) {
                                          lyr.waterTable = Number(((lyr.zTop + lyr.zBot) / 2).toFixed(2));
                                        }
                                      });
                                    }}
                                    className="size-3.5 rounded border-rule text-navy cursor-pointer"
                                  />
                                  {L.hasWaterTable ? (
                                    <NumInput
                                      step={0.1}
                                      value={L.waterTable ?? L.zTop}
                                      onChange={(n) =>
                                        patch((q) => {
                                          q.nativeLayers[i]!.waterTable = n;
                                        })
                                      }
                                      className="w-16 text-xs font-mono"
                                    />
                                  ) : (
                                    <span
                                      className="text-[10px] text-muted font-mono"
                                      title="Using global groundwater level"
                                    >
                                      {p.waterLevel !== undefined ? `${p.waterLevel.toFixed(1)}m` : "Dry"}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Pore Water Pressure (u) Mode & Controls */}
                              <td className="whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <select
                                    value={L.porePressureMode ?? "hydrostatic"}
                                    onChange={(e) => {
                                      const mode = e.target.value as PorePressureMode;
                                      patch((q) => {
                                        const lyr = q.nativeLayers[i]!;
                                        lyr.porePressureMode = mode;
                                        if (mode === "user-defined" && lyr.porePressure === undefined) lyr.porePressure = 30;
                                        if (mode === "ru" && lyr.ru === undefined) lyr.ru = 0.25;
                                        if (mode === "piezometric" && lyr.piezometricHead === undefined) lyr.piezometricHead = lyr.zTop + 1;
                                      });
                                    }}
                                    className="text-[11px] px-1.5 py-0.5 rounded border border-rule bg-paper text-navy font-medium"
                                  >
                                    <option value="hydrostatic">Hydrostatic</option>
                                    <option value="piezometric">Piezometric (hp)</option>
                                    <option value="user-defined">User u</option>
                                    <option value="ru">ru ratio</option>
                                    <option value="zero">Zero / Dry</option>
                                  </select>

                                  {/* Dynamic Parameter Field */}
                                  {L.porePressureMode === "user-defined" && (
                                    <NumInput
                                      step={5}
                                      min={0}
                                      value={L.porePressure ?? 30}
                                      onChange={(n) =>
                                        patch((q) => {
                                          q.nativeLayers[i]!.porePressure = n;
                                        })
                                      }
                                      className="w-14 text-xs font-mono"
                                      title="Target pore pressure at stratum base (kPa)"
                                    />
                                  )}
                                  {L.porePressureMode === "ru" && (
                                    <NumInput
                                      step={0.05}
                                      min={0}
                                      max={0.8}
                                      value={L.ru ?? 0.25}
                                      onChange={(n) =>
                                        patch((q) => {
                                          q.nativeLayers[i]!.ru = n;
                                        })
                                      }
                                      className="w-14 text-xs font-mono"
                                      title="Pore pressure ratio ru = u / σv"
                                    />
                                  )}
                                  {L.porePressureMode === "piezometric" && (
                                    <NumInput
                                      step={0.2}
                                      value={L.piezometricHead ?? L.zTop + 1}
                                      onChange={(n) =>
                                        patch((q) => {
                                          q.nativeLayers[i]!.piezometricHead = n;
                                        })
                                      }
                                      className="w-14 text-xs font-mono"
                                      title="Piezometric head elevation hp (m)"
                                    />
                                  )}

                                  {/* Computed base pore pressure indicator badge */}
                                  <span
                                    className="text-[10px] font-mono px-1 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200"
                                    title="Computed pore water pressure u at stratum base"
                                  >
                                    {computeLayerPorePressure(p.nativeLayers, L.zBot, p.waterLevel ?? 0, 9.81).toFixed(0)}k
                                  </span>
                                </div>
                              </td>
                            </>
                          )}

                          {/* Row Actions: Reorder, Copy, Delete */}
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                title={isFilterActive ? "Clear search filter to reorder" : "Move stratum up"}
                                disabled={isFilterActive || i === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorderLayer(i, i - 1);
                                }}
                                className="p-1 rounded text-muted hover:text-navy disabled:opacity-30"
                              >
                                <ArrowUp className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                title={isFilterActive ? "Clear search filter to reorder" : "Move stratum down"}
                                disabled={isFilterActive || i === p.nativeLayers.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorderLayer(i, i + 1);
                                }}
                                className="p-1 rounded text-muted hover:text-navy disabled:opacity-30"
                              >
                                <ArrowDown className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Duplicate stratum"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateLayer(i);
                                }}
                                className="p-1 rounded text-muted hover:text-accent"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Remove stratum"
                                disabled={p.nativeLayers.length <= 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLayer(i);
                                }}
                                className="p-1 rounded text-fail hover:opacity-80 disabled:opacity-30"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>

              {/* Archetype Presets Shortcuts */}
              <div className="mt-4 pt-3 border-t border-rule flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted">
                  <Info className="size-3.5" />
                  <span>Insert typical geotechnical stratum preset:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SOIL_ARCHETYPES.map((arch) => (
                    <button
                      key={arch.key}
                      type="button"
                      onClick={() => handleApplyPreset(arch.key)}
                      className="px-2 py-1 rounded-sm border border-rule bg-panel text-[11px] font-medium text-navy hover:bg-paper-2 transition"
                    >
                      + {arch.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-xs text-muted">
                Layer colours in the section are tied to this ordered ground model. Check that layer boundaries are continuous and cover the wall toe before relying on any pressure result.
              </p>
            </Card>
          )}

          {/* Visual Profile Column (Stacked Colored Blocks) */}
          {(layoutMode === "split" || layoutMode === "profile") && (
            <div className="sticky top-6">
              <SoilProfileVisualizer
                layers={p.nativeLayers}
                waterLevel={waterLevel}
                toeLevel={toeLevel}
                riverbedLevel={riverbed}
                selectedId={selectedLayerId}
                onSelectId={setSelectedLayerId}
                hoveredId={hoveredLayerId}
                onHoverId={setHoveredLayerId}
                searchQuery={searchQuery}
                selectedMaterialFilter={selectedMaterialFilter}
                onUpdateLayer={(index, patchData) => {
                  patch((q) => {
                    const target = q.nativeLayers[index];
                    if (target) {
                      Object.assign(target, patchData);
                    }
                  });
                }}
                onAddLayer={handleAddLayer}
                onRemoveLayer={handleRemoveLayer}
                onReorderLayer={handleReorderLayer}
                onAutoAlign={handleAutoAlign}
                onApplyPreset={handleApplyPreset}
                compact={isCompact}
                onToggleCompact={setIsCompact}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WaterPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Groundwater and unit weights">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="γw" unit="kN/m³" source="CODE">
          <NumInput step={0.01} value={p.water.gammaW} onChange={(n) => patch((q) => (q.water.gammaW = n))} />
        </Field>
        <Field label="Native GWL" unit="m">
          <NumInput value={p.water.gwlNative} onChange={(n) => patch((q) => (q.water.gwlNative = n))} />
        </Field>
        <Field label="Core water (dry)" unit="m" hint="Well-drained granular core default 0.00 — ASSUMPTION">
          <NumInput value={p.water.coreDry} onChange={(n) => patch((q) => (q.water.coreDry = n))} />
        </Field>
        <Field label="Core water (flood)" unit="m">
          <NumInput value={p.water.coreFlood} onChange={(n) => patch((q) => (q.water.coreFlood = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function FloodPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const dh = p.water.floodUp - p.water.floodDown;
  return (
    <Card title="Flood and dry-season water levels">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Dry upstream" unit="m">
          <NumInput value={p.water.dryUp} onChange={(n) => patch((q) => (q.water.dryUp = n))} />
        </Field>
        <Field label="Dry downstream" unit="m">
          <NumInput value={p.water.dryDown} onChange={(n) => patch((q) => (q.water.dryDown = n))} />
        </Field>
        <Field label="Flood upstream HWL" unit="m" source="USER INPUT">
          <NumInput value={p.water.floodUp} onChange={(n) => patch((q) => (q.water.floodUp = n))} />
        </Field>
        <Field label="Flood downstream HWL" unit="m">
          <NumInput value={p.water.floodDown} onChange={(n) => patch((q) => (q.water.floodDown = n))} />
        </Field>
        <Field label="Δh flood" unit="m" source="DERIVED">
          <NumInput value={Number(dh.toFixed(2))} onChange={() => {}} disabled />
        </Field>
      </div>
      <p className="mt-3 text-sm text-muted">
        Hydrostatic pressure is calculated independently on each side. Net water pressure Δp_w(z) = p_up(z) − p_down(z). Do not apply the full upstream head to both faces.
      </p>
    </Card>
  );
}

export function TrafficPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Roadway and traffic">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Load model" hint="Uniform q is an ASSUMPTION unless calibrated to a vehicle model.">
          <Select value={p.traffic.model} onChange={(e) => patch((q) => (q.traffic.model = e.target.value as TrafficModel))}>
            <option value="uniform">Uniform surcharge</option>
            <option value="vehicle">Vehicle / axle</option>
            <option value="strip">Equivalent strip</option>
            <option value="user">User-defined</option>
            <option value="combined">Combined</option>
          </Select>
        </Field>
        <Field label="Uniform q" unit="kPa" source="ASSUMPTION">
          <NumInput value={p.traffic.q} onChange={(n) => patch((q) => (q.traffic.q = n))} />
        </Field>
        <Field label="Axle load" unit="kN">
          <NumInput value={p.traffic.axleLoad} onChange={(n) => patch((q) => (q.traffic.axleLoad = n))} />
        </Field>
        <Field label="No. of axles">
          <NumInput step={1} value={p.traffic.nAxles} onChange={(n) => patch((q) => (q.traffic.nAxles = n))} />
        </Field>
        <Field label="Axle spacing" unit="m">
          <NumInput value={p.traffic.axleSpacing} onChange={(n) => patch((q) => (q.traffic.axleSpacing = n))} />
        </Field>
        <Field label="DAF">
          <NumInput step={0.05} value={p.traffic.DAF} onChange={(n) => patch((q) => (q.traffic.DAF = n))} />
        </Field>
        <Field label="Distribution width" unit="m">
          <NumInput value={p.traffic.distWidth} onChange={(n) => patch((q) => (q.traffic.distWidth = n))} />
        </Field>
        <Field label="Plant load" unit="kPa">
          <NumInput value={p.traffic.plantLoad} onChange={(n) => patch((q) => (q.traffic.plantLoad = n))} />
        </Field>
        <Field label="Asphalt thickness" unit="m">
          <NumInput step={0.05} value={p.pavement.asphalt} onChange={(n) => patch((q) => (q.pavement.asphalt = n))} />
        </Field>
        <Field label="Subbase thickness" unit="m">
          <NumInput step={0.05} value={p.pavement.subbase} onChange={(n) => patch((q) => (q.pavement.subbase = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function SheetPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Precast RC sheet pile">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Section library">
          <Select
            value={p.sheetPile.sectionName}
            onChange={(e) => {
              const sec = SECTION_LIBRARY.find((s) => s.name === e.target.value);
              patch((q) => {
                q.sheetPile.sectionName = e.target.value;
                if (sec && e.target.value !== "Custom") q.geometry.wallThickness = sec.t;
              });
            }}
          >
            {SECTION_LIBRARY.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="fcu" unit="MPa">
          <NumInput
            value={p.sheetPile.fcu}
            onChange={(n) =>
              patch((q) => {
                q.sheetPile.fcu = n;
                q.sheetPile.fck = Math.round(0.8 * n);
              })
            }
          />
        </Field>
        <Field label="fck" unit="MPa" source="DERIVED">
          <NumInput value={p.sheetPile.fck} onChange={(n) => patch((q) => (q.sheetPile.fck = n))} />
        </Field>
        <Field label="fyk" unit="MPa">
          <NumInput value={p.sheetPile.fyk} onChange={(n) => patch((q) => (q.sheetPile.fyk = n))} />
        </Field>
        <Field label="c_min" unit="mm">
          <NumInput step={5} value={p.sheetPile.cover} onChange={(n) => patch((q) => (q.sheetPile.cover = n))} />
        </Field>
        <Field label="Δc_dev" unit="mm">
          <NumInput step={5} value={p.sheetPile.deltaCdev} onChange={(n) => patch((q) => (q.sheetPile.deltaCdev = n))} />
        </Field>
        <Field label="Bar diameter" unit="mm">
          <NumInput step={1} value={p.sheetPile.barDia} onChange={(n) => patch((q) => (q.sheetPile.barDia = n))} />
        </Field>
        <Field label="Bar spacing" unit="mm">
          <NumInput
            step={10}
            value={p.sheetPile.barSpacing}
            onChange={(n) =>
              patch((q) => {
                q.sheetPile.barSpacing = n;
                const a = Math.PI * 0.25 * q.sheetPile.barDia ** 2;
                q.sheetPile.asMainEachFace = (1000 / Math.max(n, 1)) * a;
              })
            }
          />
        </Field>
        <Field label="As each face" unit="mm²/m" source="DERIVED">
          <NumInput step={10} value={p.sheetPile.asMainEachFace} onChange={(n) => patch((q) => (q.sheetPile.asMainEachFace = n))} />
        </Field>
        <Field label="I_eff / I_g" source="ASSUMPTION">
          <NumInput step={0.05} value={p.sheetPile.IeffFactor} onChange={(n) => patch((q) => (q.sheetPile.IeffFactor = n))} />
        </Field>
        <Field label="n_h subgrade" unit="kN/m³" source="ASSUMPTION">
          <NumInput step={500} value={p.sheetPile.nh} onChange={(n) => patch((q) => (q.sheetPile.nh = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function CbpPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const c = p.cbp ?? defaultProject().cbp;
  const solidRatio = cbpSolidRatio(c.diameter, c.spacing);
  return (
    <Card title="Contiguous bored pile (CBP) wall">
      <p className="mb-3 text-sm text-muted">Spaced piles are not assumed to be a continuous diaphragm or a water cut-off. Select the lateral-interaction model and water-control measure explicitly.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Pile diameter D" unit="m"><NumInput step={0.05} value={c.diameter} onChange={(n) => patch((q) => (q.cbp.diameter = n))} /></Field>
        <Field label="Centre spacing s" unit="m"><NumInput step={0.05} value={c.spacing} onChange={(n) => patch((q) => { q.cbp.spacing = n; q.cbp.clearGap = n - q.cbp.diameter; })} /></Field>
        <Field label="Pile length" unit="m"><NumInput step={0.25} value={c.pileLength} onChange={(n) => patch((q) => (q.cbp.pileLength = n))} /></Field>
        <Field label="Clear gap" unit="m" source="DERIVED"><NumInput value={c.clearGap} onChange={() => {}} disabled /></Field>
        <Field label="Projected solid ratio" source="DERIVED"><NumInput value={solidRatio} onChange={() => {}} disabled /></Field>
        <Field label="Lateral interaction model"><Select value={c.lateralModel} onChange={(e) => patch((q) => (q.cbp.lateralModel = e.target.value as typeof q.cbp.lateralModel))}><option value="individual-pile">Individual pile behaviour</option><option value="equivalent-wall">Equivalent wall (justify)</option></Select></Field>
        <Field label="Concrete fck" unit="MPa"><NumInput value={c.fck} onChange={(n) => patch((q) => (q.cbp.fck = n))} /></Field>
        <Field label="Steel fyk" unit="MPa"><NumInput value={c.fyk} onChange={(n) => patch((q) => (q.cbp.fyk = n))} /></Field>
        <Field label="Nominal cover" unit="mm"><NumInput step={5} value={c.cover} onChange={(n) => patch((q) => (q.cbp.cover = n))} /></Field>
        <Field label="Longitudinal bars" unit="number"><NumInput step={1} value={c.barCount} onChange={(n) => patch((q) => (q.cbp.barCount = n))} /></Field>
        <Field label="Bar diameter" unit="mm"><NumInput step={1} value={c.barDiameter} onChange={(n) => patch((q) => (q.cbp.barDiameter = n))} /></Field>
        <Field label="Stirrup diameter" unit="mm"><NumInput step={1} value={c.stirrupDiameter} onChange={(n) => patch((q) => (q.cbp.stirrupDiameter = n))} /></Field>
        <Field label="Water-control measure"><Select value={c.waterCutoff} onChange={(e) => patch((q) => (q.cbp.waterCutoff = e.target.value as typeof q.cbp.waterCutoff))}><option value="none">None — seepage assessment required</option><option value="grout">Inter-pile grouting</option><option value="cutoff-wall">Separate cut-off wall</option></Select></Field>
        <Field label="n_h subgrade" unit="kN/m³" source="ASSUMPTION">
          <NumInput step={500} value={c.nh} onChange={(n) => patch((q) => (q.cbp.nh = n))} />
        </Field>
        <Field label="k_h override" unit="kN/m³" hint="Leave 0 to use n_h·z">
          <NumInput step={500} value={c.khUser ?? 0} onChange={(n) => patch((q) => (q.cbp.khUser = n > 0 ? n : null))} />
        </Field>
      </div>
    </Card>
  );
}

export function TiesPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card
      title="Tie rods"
      action={
        <Button
          variant="outline"
          onClick={() =>
            patch((q) =>
              q.ties.push({
                id: uid("tie"),
                name: `Tie ${q.ties.length + 1}`,
                elevation: 2,
                diameter: 40,
                spacing: 1.5,
                fy: 500,
                fu: 560,
                corrosion: 1,
                threadEff: 0.9,
                connectionEff: 0.9,
                inclination: 0,
                enabled: true,
              }),
            )
          }
        >
          Add tie level
        </Button>
      }
    >
      {p.ties.map((tr, i) => (
        <div key={tr.id} className="mb-4 grid gap-3 border-b border-rule pb-4 sm:grid-cols-4">
          <Field label="Name">
            <TextInput value={tr.name} onChange={(e) => patch((q) => (q.ties[i]!.name = e.target.value))} />
          </Field>
          <Field label="Elevation y" unit="m">
            <NumInput value={tr.elevation} onChange={(n) => patch((q) => (q.ties[i]!.elevation = n))} />
          </Field>
          <Field label="Diameter" unit="mm">
            <Select value={String(tr.diameter)} onChange={(e) => patch((q) => (q.ties[i]!.diameter = parseFloat(e.target.value)))}>
              {TIE_DIAMETERS.map((d) => (
                <option key={d} value={d}>
                  Ø{d}
                </option>
              ))}
              <option value={tr.diameter}>Custom {tr.diameter}</option>
            </Select>
          </Field>
          <Field label="Spacing s" unit="m">
            <NumInput value={tr.spacing} onChange={(n) => patch((q) => (q.ties[i]!.spacing = n))} />
          </Field>
          <Field label="fy" unit="MPa">
            <NumInput value={tr.fy} onChange={(n) => patch((q) => (q.ties[i]!.fy = n))} />
          </Field>
          <Field label="Corrosion" unit="mm" hint="Radial allowance">
            <NumInput step={0.5} value={tr.corrosion} onChange={(n) => patch((q) => (q.ties[i]!.corrosion = n))} />
          </Field>
          <Field label="Thread efficiency" source="ASSUMPTION">
            <NumInput step={0.05} value={tr.threadEff} onChange={(n) => patch((q) => (q.ties[i]!.threadEff = n))} />
          </Field>
          <div className="flex items-end gap-2">
            <label className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tr.enabled}
                onChange={(e) => patch((q) => (q.ties[i]!.enabled = e.target.checked))}
              />
              Enabled
            </label>
            <Button variant="ghost" onClick={() => patch((q) => q.ties.splice(i, 1))}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function CappingPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="RC capping beam">
      <label className="mb-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={p.capping.enabled} onChange={(e) => patch((q) => (q.capping.enabled = e.target.checked))} />
        Include capping beam
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Width b" unit="m">
          <NumInput step={0.05} value={p.capping.b} onChange={(n) => patch((q) => (q.capping.b = n))} />
        </Field>
        <Field label="Depth h" unit="m">
          <NumInput step={0.05} value={p.capping.h} onChange={(n) => patch((q) => (q.capping.h = n))} />
        </Field>
        <Field label="Cover" unit="mm">
          <NumInput step={5} value={p.capping.cover} onChange={(n) => patch((q) => (q.capping.cover = n))} />
        </Field>
        <Field label="fck" unit="MPa">
          <NumInput value={p.capping.fck} onChange={(n) => patch((q) => (q.capping.fck = n))} />
        </Field>
        <Field label="As bottom" unit="mm²">
          <NumInput step={50} value={p.capping.asBot} onChange={(n) => patch((q) => (q.capping.asBot = n))} />
        </Field>
        <Field label="As top" unit="mm²">
          <NumInput step={50} value={p.capping.asTop} onChange={(n) => patch((q) => (q.capping.asTop = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function MaterialsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Partial factors and materials">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Factor source">
          <Select value={p.factors.source} onChange={(e) => patch((q) => (q.factors.source = e.target.value as typeof q.factors.source))}>
            <option value="recommended">Recommended Eurocode</option>
            <option value="national-annex">National Annex</option>
            <option value="user">User-defined</option>
          </Select>
        </Field>
        {(["gammaG", "gammaQ", "gammaGinf", "gammaPhi", "gammaC", "gammaW", "gammaCconc", "gammaS", "alphaCc"] as const).map((k) => (
          <Field key={k} label={k} source={p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"}>
            <NumInput step={0.05} value={p.factors[k]} onChange={(n) => patch((q) => (q.factors[k] = n))} />
          </Field>
        ))}
        <Field label="Passive reduction" source="USER-DEFINED / PROJECT-SPECIFIC">
          <NumInput step={0.05} value={p.earth.passiveReduction} onChange={(n) => patch((q) => (q.earth.passiveReduction = n))} />
        </Field>
        <Field label="Wall friction δ" unit="°">
          <NumInput value={p.earth.wallFriction} onChange={(n) => patch((q) => (q.earth.wallFriction = n))} />
        </Field>
        <Field label="User Ka">
          <NumInput step={0.01} value={p.earth.userKa} onChange={(n) => patch((q) => (q.earth.userKa = n))} />
        </Field>
        <Field label="User Kp">
          <NumInput step={0.1} value={p.earth.userKp} onChange={(n) => patch((q) => (q.earth.userKp = n))} />
        </Field>
      </div>
    </Card>
  );
}

export function LoadsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const setLc = useProject((s) => s.setLoadCase);
  return (
    <Card title="Design load cases">
      <p className="mb-3 text-sm text-muted">
        Load cases are physically consistent situations — maxima are not stacked into an impossible combination.
      </p>
      <div className="overflow-x-auto">
        <table className="eng-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Situation</th>
              <th>Water</th>
              <th>Traffic</th>
              <th>On</th>
            </tr>
          </thead>
          <tbody>
            {p.loadCases.map((lc, i) => (
              <tr key={lc.id} className="cursor-pointer" onClick={() => setLc(lc.id)}>
                <td className="font-mono">{lc.id}</td>
                <td>{lc.name}</td>
                <td>{lc.situation}</td>
                <td>{lc.waterMode}</td>
                <td>{lc.trafficOn ? "yes" : "no"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={lc.enabled}
                    onChange={(e) => patch((q) => (q.loadCases[i]!.enabled = e.target.checked))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ApproachPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Codes, National Annex, design approach">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="National Annex">
          <TextInput value={p.codes.nationalAnnex} onChange={(e) => patch((q) => (q.codes.nationalAnnex = e.target.value))} />
        </Field>
        <Field label="Edition">
          <TextInput value={p.codes.edition} onChange={(e) => patch((q) => (q.codes.edition = e.target.value))} />
        </Field>
        <Field label="EN 1997 Design Approach">
          <Select value={p.codes.designApproach} onChange={(e) => patch((q) => (q.codes.designApproach = e.target.value as DesignApproach))}>
            <option value="DA1">DA1 (Combinations 1 and 2 — screening uses DA1-2 soil factors)</option>
            <option value="DA2">DA2 (recommended default)</option>
            <option value="DA3">DA3</option>
          </Select>
        </Field>
        <Field label="Design working life" unit="years">
          <NumInput step={5} value={p.codes.designLife} onChange={(n) => patch((q) => (q.codes.designLife = n))} />
        </Field>
        <Field label="Consequence class">
          <Select value={p.codes.consequenceClass} onChange={(e) => patch((q) => (q.codes.consequenceClass = e.target.value))}>
            <option>CC1</option>
            <option>CC2</option>
            <option>CC3</option>
          </Select>
        </Field>
        <Field label="Execution class">
          <Select value={p.codes.executionClass} onChange={(e) => patch((q) => (q.codes.executionClass = e.target.value))}>
            <option>EXC1</option>
            <option>EXC2</option>
            <option>EXC3</option>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.codes.seismic} onChange={(e) => patch((q) => (q.codes.seismic = e.target.checked))} />
          Include seismic (EN 1998) — not calculated unless enabled
        </label>
      </div>
      <p className="mt-3 text-xs text-muted">
        First-generation Eurocodes are used. Do not mix second-generation factors without changing the edition field. Clause numbers are not invented; confirm against the adopted NA.
      </p>
    </Card>
  );
}

export function LimitsPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Acceptance limits and durability">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="η PASS limit">
          <NumInput step={0.05} value={p.limits.etaPass} onChange={(n) => patch((q) => (q.limits.etaPass = n))} />
        </Field>
        <Field label="η WARNING">
          <NumInput step={0.05} value={p.limits.etaWarn} onChange={(n) => patch((q) => (q.limits.etaWarn = n))} />
        </Field>
        <Field label="δ absolute" unit="mm">
          <NumInput value={p.limits.deflAbs} onChange={(n) => patch((q) => (q.limits.deflAbs = n))} />
        </Field>
        <Field label="δ span ratio H/n" unit="n">
          <NumInput value={p.limits.deflSpanRatio} onChange={(n) => patch((q) => (q.limits.deflSpanRatio = n))} />
        </Field>
        <Field label="wk limit" unit="mm">
          <NumInput step={0.05} value={p.limits.wkLimit} onChange={(n) => patch((q) => (q.limits.wkLimit = n))} />
        </Field>
        <Field label="Allowable i">
          <NumInput step={0.05} value={p.limits.iAllow} onChange={(n) => patch((q) => (q.limits.iAllow = n))} />
        </Field>
        <Field label="Exposure">
          <TextInput value={p.limits.exposure} onChange={(e) => patch((q) => (q.limits.exposure = e.target.value))} />
        </Field>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {(
          [
            ["horizontalBackfill", "Horizontal backfill"],
            ["drainedGranularFill", "Drained granular fill"],
            ["noCohesion", "No cohesion assumed"],
            ["hydrostaticWater", "Hydrostatic water pressure"],
            ["noSeismic", "No seismic loading"],
            ["uniformTraffic", "Uniform traffic surcharge"],
            ["passiveMobilised", "Passive resistance mobilised"],
            ["noScour", "No scour considered"],
            ["coreNotRigidDiaphragm", "Core is not a rigid diaphragm"],
          ] as const
        ).map(([k, lab]) => (
          <label key={k} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!p.assumptions[k]}
              onChange={(e) => patch((q) => (q.assumptions[k] = e.target.checked))}
            />
            {lab}
          </label>
        ))}
      </div>
    </Card>
  );
}

export function StagesPanel() {
  const p = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  return (
    <Card title="Construction stages">
      <p className="mb-3 text-sm text-muted">Each stage is analysed with its own support and water condition. The critical stage may not be the completed structure.</p>
      <table className="eng-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Ties</th>
            <th>Fill</th>
            <th>Road</th>
            <th>On</th>
          </tr>
        </thead>
        <tbody>
          {p.stages.map((s, i) => (
            <tr key={s.id}>
              <td>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted">{s.description}</div>
              </td>
              <td className="num">{s.tiesInstalled}</td>
              <td>{s.fillPlaced ? "yes" : "no"}</td>
              <td>{s.roadPlaced ? "yes" : "no"}</td>
              <td>
                <input type="checkbox" checked={s.enabled} onChange={(e) => patch((q) => (q.stages[i]!.enabled = e.target.checked))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
