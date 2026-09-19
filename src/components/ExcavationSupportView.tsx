import { useMemo, useState } from "react";
import { ArrowLeft, AlertTriangle, ChevronRight, Layers3, ShieldCheck, Waves, Columns3, Sparkles, GripVertical } from "lucide-react";
import { Button, Card, Field, NumInput, Select, StatusPill, TextInput } from "@/components/ui";
import { useProject } from "@/lib/store";
import { screenPhases } from "@/lib/excavation/staged-analysis";
import { uid } from "@/lib/utils";
import { SoilProfileVisualizer, SOIL_ARCHETYPES } from "@/components/SoilProfileVisualizer";
import { SoilTextureIcon } from "@/components/SoilTextureIcon";

type Method = "bottom-up" | "top-down" | "semi-top-down";

const STRATA = ["#d7bd8a", "#c99f67", "#9ba87b", "#a5816b", "#879a9e"];

const methodStages: Record<Method, { title: string; detail: string }[]> = {
  "bottom-up": [
    { title: "Install retaining wall", detail: "Install sheet piles or CBP wall, guide wall/capping beam and verified toe level." },
    { title: "Dewater and excavate in lifts", detail: "Excavate to the first support level while controlling water and crest loading." },
    { title: "Install temporary supports", detail: "Install/preload struts or anchors before each lower excavation stage." },
    { title: "Reach formation level", detail: "Inspect formation, assess basal heave/uplift and complete the blinding/base preparation." },
    { title: "Construct basement from base up", detail: "Cast base slab, walls and floors; remove temporary supports only after load transfer is verified." },
  ],
  "top-down": [
    { title: "Install wall and foundation elements", detail: "Construct retaining wall plus plunge columns/barrettes/piles and capping system." },
    { title: "Cast ground-level slab", detail: "Cast permanent ground floor/transfer slab to act as the first lateral prop." },
    { title: "Excavate beneath slab in stages", detail: "Excavate through controlled openings; each completed basement slab becomes a permanent prop." },
    { title: "Complete lower slabs and base", detail: "Form each basement level, verify slab-to-wall connection and construct the base slab at formation." },
    { title: "Complete superstructure and closure", detail: "Close openings and transfer final loads in the designed sequence." },
  ],
  "semi-top-down": [
    { title: "Install wall and primary supports", detail: "Construct the retaining wall, foundation elements and the selected first permanent/temporary support level." },
    { title: "Excavate to intermediate level", detail: "Use an open excavation or partial slab zone while monitoring wall and groundwater response." },
    { title: "Cast intermediate slab / prop", detail: "Complete the designated slab or waler/strut level before excavating below it." },
    { title: "Excavate to formation", detail: "Continue in supported lifts, with water control and basal-stability checks at every stage." },
    { title: "Construct base and remaining basement", detail: "Build upward from the base while maintaining the approved support-removal sequence." },
  ],
};

export function ExcavationSupportView() {
  const project = useProject((s) => s.project);
  const patch = useProject((s) => s.patch);
  const setActiveModule = useProject((s) => s.setActiveModule);
  const [method, setMethod] = useState<Method>("bottom-up");
  const [stage, setStage] = useState(0);
  const [excavationDepth, setExcavationDepth] = useState(8);
  const [wallToe, setWallToe] = useState(15);
  const [waterLevel, setWaterLevel] = useState(2.5);
  const [basementLevels, setBasementLevels] = useState(3);
  const isCbp = project.wallSystem === "cbp";
  const cbp = project.cbp ?? { diameter: 0.8, spacing: 0.95, clearGap: 0.15, waterCutoff: "none" };
  const stages = methodStages[method];
  const plaxisPhases = useMemo(() => screenPhases({ layers: project.nativeLayers, depth: excavationDepth, waterLevel, surcharge: 5, gammaW: project.water.gammaW, method }), [project.nativeLayers, project.water.gammaW, excavationDepth, waterLevel, method]);
  const levelDepths = useMemo(
    () => Array.from({ length: Math.max(1, basementLevels) }, (_, i) => ((i + 1) * excavationDepth) / basementLevels),
    [basementLevels, excavationDepth],
  );

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="title-block sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
          <Button variant="ghost" className="text-paper hover:bg-navy-mid" onClick={() => setActiveModule("modules")}><ArrowLeft className="size-4" /> Modules</Button>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-paper/65">Basement excavation support · EN 1997 / EN 1992 / EN 1993 workflow</p>
            <h1 className="truncate font-display text-lg font-semibold">{isCbp ? "CBP Wall" : "Sheet Pile"} · Basement Excavation Design</h1>
          </div>
          <StatusPill status="INPUT REQUIRED" />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[330px_minmax(0,1fr)_310px]">
        <section className="space-y-4">
          <Card title="Excavation concept">
            <div className="space-y-3">
              <Field label="Retaining wall"><Select value={isCbp ? "cbp" : "sheet-pile"} onChange={(e) => patch((q) => { q.wallSystem = e.target.value as "sheet-pile" | "cbp"; })}><option value="sheet-pile">Sheet pile wall</option><option value="cbp">Contiguous bored pile wall</option></Select></Field>
              <Field label="Construction method"><Select value={method} onChange={(e) => { setMethod(e.target.value as Method); setStage(0); }}><option value="bottom-up">Bottom-up</option><option value="top-down">Top-down</option><option value="semi-top-down">Semi-top-down</option></Select></Field>
              <Field label="Excavation depth below GL" unit="m"><NumInput value={excavationDepth} step={0.25} onChange={setExcavationDepth} /></Field>
              <Field label="Wall toe below GL" unit="m"><NumInput value={wallToe} step={0.25} onChange={setWallToe} /></Field>
              <Field label="Basement levels"><NumInput value={basementLevels} step={1} onChange={(n) => setBasementLevels(Math.max(1, Math.round(n)))} /></Field>
              <Field label="Design groundwater below GL" unit="m"><NumInput value={waterLevel} step={0.25} onChange={setWaterLevel} /></Field>
            </div>
          </Card>

          <Card title={isCbp ? "CBP wall input" : "Sheet-pile wall input"}>
            {isCbp ? (
              <div className="space-y-2 text-sm">
                <p>
                  D = <b>{cbp.diameter.toFixed(2)} m</b> · spacing = <b>{cbp.spacing.toFixed(2)} m</b>
                </p>
                <p>Clear gap = <b>{cbp.clearGap.toFixed(2)} m</b></p>
                <p>Water cut-off: <b>{cbp.waterCutoff}</b></p>
                <p className="text-xs text-muted">This workspace controls the basement support concept and sequence. Pile diameter/spacing, reinforcement and the N-M structural check live in the detailed CBP design workspace.</p>
                <Button variant="outline" className="w-full" onClick={() => setActiveModule("cbp-detail")}>
                  Open detailed CBP structural design <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p>Section: <b>{project.sheetPile.sectionName}</b></p>
                <p>Wall thickness: <b>{(project.geometry.wallThickness * 1000).toFixed(0)} mm</b></p>
                <p className="text-xs text-muted">Manufacturer section properties, installation method and corrosion allowance are still required before structural verification.</p>
              </div>
            )}
          </Card>
        </section>

        <section className="min-w-0 space-y-4">
          <Card title="Basement excavation section" action={<span className="font-mono text-xs text-muted">Stage {stage + 1} / {stages.length}</span>}>
            <BasementSection layers={project.nativeLayers} excavationDepth={excavationDepth} wallToe={wallToe} waterLevel={waterLevel} levelDepths={levelDepths} wallType={isCbp ? "cbp" : "sheet"} method={method} activeStage={stage} />
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted"><span className="inline-flex items-center gap-1"><span className="size-3 rounded-sm bg-[#d7bd8a]" /> Soil layer</span><span className="inline-flex items-center gap-1"><span className="size-3 rounded-sm bg-[#596775]" /> Retaining wall</span><span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 bg-[#9b2f28]" /> Temporary prop / permanent slab</span><span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 bg-water" /> Design water level</span></div>
          </Card>

          <Card title="PLAXIS-style staged construction">
            <div className="grid gap-2 md:grid-cols-5">
              {stages.map((item, index) => <button key={item.title} onClick={() => setStage(index)} className={`rounded border p-3 text-left transition ${stage === index ? "border-accent bg-info-bg" : "border-rule bg-panel hover:border-rule-strong"}`}><p className="font-mono text-[10px] text-muted">STAGE {index + 1}</p><p className="mt-1 text-sm font-semibold text-navy">{item.title}</p></button>)}
            </div>
            <div className="mt-3 rounded border-l-4 border-accent bg-paper-2 p-3"><p className="font-display text-sm font-semibold text-navy">{stages[stage]!.title}</p><p className="mt-1 text-sm">{stages[stage]!.detail}</p></div>
          </Card>

          <Card title="Phase calculation register" action={<span className="font-mono text-xs text-muted">Screening only · not a FEM output</span>}>
            <p className="mb-3 text-sm text-muted">The sequence follows Lesson 02: initial K₀ state → wall/interfaces/surcharge → excavation cut → prop activation → subsequent cuts. Water remains active in the excavation to represent a submerged construction phase.</p>
            <div className="overflow-x-auto"><table className="eng-table"><thead><tr><th>Phase</th><th>Activation / action</th><th className="num">Excav.</th><th className="num">Pₐ</th><th className="num">ΔPᵥ</th><th className="num">Pq</th><th className="num">M proxy</th><th>Status</th></tr></thead><tbody>{plaxisPhases.map((phase, index) => <tr key={phase.id} className={index === stage ? "bg-info-bg" : ""}><td className="font-mono">{phase.id}</td><td><button type="button" onClick={() => setStage(Math.min(index, stages.length - 1))} className="text-left text-accent hover:underline">{phase.title}</button><p className="mt-0.5 text-xs text-muted">{phase.wallActive ? "Wall" : "Soil only"} · {phase.interfacesActive ? "interfaces" : "no interfaces"} · {phase.supportsActive ? `${phase.supportsActive} prop` : "no prop"}</p></td><td className="num">{phase.excavationDepth.toFixed(2)} m</td><td className="num">{phase.soilResultant.toFixed(1)} kN/m</td><td className="num">{phase.waterDifferential.toFixed(1)} kN/m</td><td className="num">{phase.surchargeResultant.toFixed(1)} kN/m</td><td className="num">{phase.momentProxy.toFixed(1)} kNm/m</td><td><StatusPill status={phase.status} /></td></tr>)}</tbody></table></div>
            <p className="mt-3 text-xs text-muted">Pₐ uses a transparent Rankine screening coefficient for the layer at the active cut. M proxy is not wall bending resistance or PLAXIS output. It is included only to make stage effects traceable until a validated beam-on-springs or FEM solver is connected.</p>
          </Card>

          <SoilStrataBuilder />
        </section>

        <aside className="space-y-4">
          <Card title="Required design checks"><Checklist /></Card>
          <Card title="Critical input gaps"><div className="space-y-3 text-sm"><Warning icon={<Layers3 className="size-4" />} text="Confirm ground model and borehole/CPT coverage beyond the excavation." /><Warning icon={<Waves className="size-4" />} text="Confirm seasonal piezometric levels and dewatering discharge route." /><Warning icon={<ShieldCheck className="size-4" />} text="Set movement limits and survey nearby foundations, roads and utilities." /></div></Card>
          <Card title="Design status"><p className="text-sm font-semibold text-warn">NOT VERIFIED</p><p className="mt-2 text-xs text-muted">This is the correct basement-excavation concept workspace. It will not issue PASS until construction stages, soil/water actions, wall/support resistance, basal heave, seepage and global stability are verified.</p></Card>
        </aside>
      </main>
    </div>
  );
}

function SoilStrataBuilder() {
  const layers = useProject((s) => s.project.nativeLayers);
  const patch = useProject((s) => s.patch);
  const p = useProject((s) => s.project);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(true);

  const waterLevel = p.water?.gwlNative ?? p.water?.dryDown ?? 0;
  const embedment = p.geometry?.embedment ?? 6;
  const riverbed = p.geometry?.riverbed ?? 0;
  const toeLevel = riverbed - embedment;

  const gaps = layers.slice(0, -1).filter((layer, index) => Math.abs(layer.zBot - layers[index + 1]!.zTop) > 0.01);

  // Drag and drop reordering handler
  const handleReorderStratum = (from: number, to: number, autoRestack: boolean = true) => {
    if (to < 0 || to >= layers.length || from === to) return;
    patch((proj) => {
      const list = [...proj.nativeLayers];
      const [item] = list.splice(from, 1);
      if (!item) return;
      list.splice(to, 0, item);
      if (autoRestack) {
        const topElevation = proj.nativeLayers[0]?.zTop ?? 0;
        let currentZ = topElevation;
        for (const layer of list) {
          const thickness = Math.max(0.1, layer.zTop - layer.zBot);
          layer.zTop = Number(currentZ.toFixed(2));
          currentZ -= thickness;
          layer.zBot = Number(currentZ.toFixed(2));
        }
      }
      proj.nativeLayers = list;
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
    if (finalTarget >= 0 && finalTarget < layers.length && finalTarget !== tableDragIdx) {
      handleReorderStratum(tableDragIdx, finalTarget, true);
    }
    setTableDragIdx(null);
    setTableDragOverIdx(null);
    setTableDropPos(null);
  };

  const handleAutoAlign = () => {
    patch((proj) => {
      for (let i = 0; i < proj.nativeLayers.length - 1; i++) {
        proj.nativeLayers[i + 1]!.zTop = proj.nativeLayers[i]!.zBot;
      }
    });
  };

  const handleAddStratum = () => {
    patch((proj) => {
      const last = proj.nativeLayers.at(-1);
      const top = last?.zBot ?? 0;
      proj.nativeLayers.push({
        id: uid("stratum"),
        name: `Layer ${proj.nativeLayers.length + 1}`,
        description: "User-defined stratum",
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
        soilType: "soil",
      });
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    const arch = SOIL_ARCHETYPES.find((a) => a.key === presetKey);
    if (!arch) return;
    patch((proj) => {
      const last = proj.nativeLayers.at(-1);
      const top = last?.zBot ?? 0;
      proj.nativeLayers.push({
        id: uid("stratum"),
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
    <Card
      title="Step 1 · Soil strata / ground-model builder"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowProfile(!showProfile)}
            className="text-xs"
          >
            <Columns3 className="size-3.5 mr-1" />
            <span>{showProfile ? "Hide Profile Column" : "Show Visual Profile"}</span>
          </Button>
          {gaps.length > 0 && (
            <Button
              variant="outline"
              onClick={handleAutoAlign}
              className="text-xs bg-warn-bg text-warn border-warn/40 hover:bg-warn-bg/80"
            >
              <Sparkles className="size-3.5 mr-1" />
              <span>Auto-Align ({gaps.length})</span>
            </Button>
          )}
          <Button variant="outline" onClick={handleAddStratum} className="text-xs">
            Add stratum
          </Button>
        </div>
      }
    >
      <p className="mb-3 text-sm text-muted">
        Define strata from ground level downward. The interactive visual column and section above are generated directly from these elevations and properties.
      </p>

      <div className={`grid gap-6 items-start ${showProfile ? "grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)]" : "grid-cols-1"}`}>
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="eng-table min-w-[900px] w-full">
              <thead>
                <tr>
                  <th className="w-8 text-center" title="Drag & drop to reorder stratigraphy sequence">
                    <GripVertical className="size-3.5 mx-auto text-muted" />
                  </th>
                  <th>Stratum</th>
                  <th>Material / description</th>
                  <th className="num">Top z</th>
                  <th className="num">Bottom z</th>
                  <th className="num">Δz</th>
                  <th className="num">γ</th>
                  <th className="num">γsat</th>
                  <th className="num">φ′</th>
                  <th className="num">c′</th>
                  <th className="num">cu</th>
                  <th className="num">E</th>
                  <th className="num">SPT N</th>
                  <th>Drainage</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {layers.map((layer, index) => {
                  const isSelected = selectedId === layer.id;
                  const isHovered = hoveredId === layer.id;
                  const thickness = layer.zTop - layer.zBot;
                  return (
                    <tr
                      key={layer.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index.toString());
                        e.dataTransfer.effectAllowed = "move";
                        setTableDragIdx(index);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        if (tableDragIdx === null || tableDragIdx === index) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
                        if (tableDragOverIdx !== index || tableDropPos !== pos) {
                          setTableDragOverIdx(index);
                          setTableDropPos(pos);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleTableDrop(index);
                      }}
                      onDragEnd={() => {
                        setTableDragIdx(null);
                        setTableDragOverIdx(null);
                        setTableDropPos(null);
                      }}
                      onClick={() => setSelectedId(layer.id)}
                      onMouseEnter={() => setHoveredId(layer.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`cursor-pointer transition-colors relative ${
                        tableDragIdx === index
                          ? "opacity-35 bg-paper-2"
                          : isSelected
                            ? "bg-paper-2 font-medium"
                            : isHovered
                              ? "bg-panel"
                              : ""
                      }`}
                    >
                      <td className="text-center cursor-grab active:cursor-grabbing text-muted hover:text-navy" title="Click and drag to change stratigraphy order">
                        <GripVertical className="size-3.5 mx-auto" />
                      </td>
                      <td>
                        <SoilTextureIcon layerOrType={layer} size="xs" className="mr-1.5 align-middle inline-flex" />
                        <TextInput
                          className="inline-flex w-28 text-xs font-semibold"
                          value={layer.name}
                          onChange={(e) =>
                            patch((p2) => (p2.nativeLayers[index]!.name = e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <TextInput
                          className="w-28 text-xs"
                          value={layer.soilType}
                          onChange={(e) =>
                            patch((p2) => (p2.nativeLayers[index]!.soilType = e.target.value))
                          }
                        />
                      </td>
                      {(["zTop", "zBot"] as const).map((field) => (
                        <td key={field} className="num">
                          <NumInput
                            value={layer[field]}
                            step={0.1}
                            onChange={(n) =>
                              patch((p2) => (p2.nativeLayers[index]![field] = n))
                            }
                            className="text-xs"
                          />
                        </td>
                      ))}
                      <td className="num font-mono text-xs font-semibold text-navy">
                        {thickness.toFixed(2)}
                      </td>
                      {(["gamma", "gammaSat", "phi", "c", "cu", "E", "sptN"] as const).map((field) => (
                        <td key={field} className="num">
                          <NumInput
                            value={layer[field]}
                            step={field === "E" ? 1000 : 0.1}
                            onChange={(n) =>
                              patch((p2) => (p2.nativeLayers[index]![field] = n))
                            }
                            className="text-xs"
                          />
                        </td>
                      ))}
                      <td>
                        <Select
                          value={layer.drainage}
                          onChange={(e) =>
                            patch((p2) => (p2.nativeLayers[index]!.drainage = e.target.value as "drained" | "undrained"))
                          }
                          className="text-xs"
                        >
                          <option value="drained">Drained</option>
                          <option value="undrained">Undrained</option>
                        </Select>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          className="text-fail text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            patch((p2) => p2.nativeLayers.splice(index, 1));
                          }}
                          disabled={layers.length === 1}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <p className={`rounded p-2 text-xs ${gaps.length ? "bg-warn-bg text-warn" : "bg-pass-bg text-pass"}`}>
              {gaps.length
                ? `${gaps.length} layer boundary gap or overlap detected. Align each layer bottom with the next layer top.`
                : "Layer boundaries are continuous without gaps."}
            </p>
            <p className="rounded bg-info-bg p-2 text-xs text-info">
              Enter approved design parameters. The stacked visual profile reflects edits instantaneously.
            </p>
          </div>
        </div>

        {/* Visual Soil Profile Column */}
        {showProfile && (
          <div className="sticky top-4">
            <SoilProfileVisualizer
              layers={layers}
              waterLevel={waterLevel}
              toeLevel={toeLevel}
              riverbedLevel={riverbed}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              hoveredId={hoveredId}
              onHoverId={setHoveredId}
              onUpdateLayer={(idx, patchData) => {
                patch((proj) => {
                  const target = proj.nativeLayers[idx];
                  if (target) Object.assign(target, patchData);
                });
              }}
              onAddLayer={handleAddStratum}
              onRemoveLayer={(idx) => {
                if (layers.length <= 1) return;
                patch((proj) => proj.nativeLayers.splice(idx, 1));
              }}
              onReorderLayer={handleReorderStratum}
              onAutoAlign={handleAutoAlign}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function BasementSection({ layers, excavationDepth, wallToe, waterLevel, levelDepths, wallType, method, activeStage }: { layers: { id: string; name: string; zTop: number; zBot: number }[]; excavationDepth: number; wallToe: number; waterLevel: number; levelDepths: number[]; wallType: "sheet" | "cbp"; method: Method; activeStage: number }) {
  const W = 760; const H = 520; const maxDepth = Math.max(wallToe + 1, excavationDepth + 2); const scaleY = (d: number) => 54 + (d / maxDepth) * 430; const xL = 190; const xR = 570; const wallWidth = 18;
  const strata = layers.map((layer, index) => ({ ...layer, index, top: Math.max(0, -layer.zTop), bottom: Math.min(maxDepth, -layer.zBot) })).filter((layer) => layer.bottom > layer.top);
  const propDepths = method === "top-down" ? levelDepths : method === "semi-top-down" ? levelDepths.slice(0, Math.max(1, levelDepths.length - 1)) : levelDepths.slice(0, Math.max(0, activeStage - 1));
  return <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-panel" role="img" aria-label="Basement excavation support section">
    <defs><pattern id="cbpPattern" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="6.5" fill="#596775" stroke="#2c3036" strokeWidth="1.2" /></pattern><pattern id="soilHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#6e573d" opacity=".25" /></pattern></defs>
    <rect width={W} height={H} fill="#f7f4ec" /><line x1="55" y1="54" x2="705" y2="54" stroke="#4b5563" strokeWidth="2" /><text x="62" y="43" fontSize="11" fill="#374151" fontFamily="monospace">EXISTING GROUND LEVEL ±0.00</text>
    {strata.map((layer) => <g key={layer.id}><rect x="55" y={scaleY(layer.top)} width="650" height={scaleY(layer.bottom) - scaleY(layer.top)} fill={STRATA[layer.index % STRATA.length]} opacity=".72" /><rect x="55" y={scaleY(layer.top)} width="650" height={scaleY(layer.bottom) - scaleY(layer.top)} fill="url(#soilHatch)" /><text x="65" y={scaleY(layer.top) + 15} fontSize="10" fill="#382e21">{layer.name}</text></g>)}
    <rect x={xL - wallWidth / 2} y="54" width={wallWidth} height={scaleY(wallToe) - 54} fill={wallType === "cbp" ? "url(#cbpPattern)" : "#596775"} stroke="#2c3036" /><rect x={xR - wallWidth / 2} y="54" width={wallWidth} height={scaleY(wallToe) - 54} fill={wallType === "cbp" ? "url(#cbpPattern)" : "#596775"} stroke="#2c3036" />
    <rect x={xL} y="54" width={xR - xL} height={scaleY(excavationDepth) - 54} fill="#f7f4ec" /><line x1={xL} y1={scaleY(excavationDepth)} x2={xR} y2={scaleY(excavationDepth)} stroke="#9b2f28" strokeWidth="4" /><text x={(xL + xR) / 2} y={scaleY(excavationDepth) + 18} textAnchor="middle" fontSize="11" fill="#7f1d1d">FORMATION / BASE SLAB LEVEL</text>
    <line x1="55" y1={scaleY(waterLevel)} x2={xL - 10} y2={scaleY(waterLevel)} stroke="#4d7a9c" strokeWidth="2" strokeDasharray="6 3" /><line x1={xR + 10} y1={scaleY(waterLevel)} x2="705" y2={scaleY(waterLevel)} stroke="#4d7a9c" strokeWidth="2" strokeDasharray="6 3" /><text x="585" y={scaleY(waterLevel) - 5} fontSize="10" fill="#285a7c">DESIGN GWL</text>
    {propDepths.map((depth, index) => <g key={depth}><line x1={xL + 9} y1={scaleY(depth)} x2={xR - 9} y2={scaleY(depth)} stroke="#9b2f28" strokeWidth="5" /><text x={(xL + xR) / 2} y={scaleY(depth) - 7} textAnchor="middle" fontSize="10" fill="#7f1d1d">{method === "top-down" || method === "semi-top-down" ? `B${index + 1} SLAB / PERMANENT PROP` : `STRUT LEVEL ${index + 1}`}</text></g>)}
    <line x1="120" y1="54" x2="120" y2={scaleY(excavationDepth)} stroke="#1c1917" /><text x="113" y={(54 + scaleY(excavationDepth)) / 2} textAnchor="end" fontSize="11" fill="#1c1917">H = {excavationDepth.toFixed(2)} m</text><line x1="635" y1="54" x2="635" y2={scaleY(wallToe)} stroke="#1c1917" /><text x="642" y={(54 + scaleY(wallToe)) / 2} fontSize="11" fill="#1c1917">Toe {wallToe.toFixed(2)} m</text>
  </svg>;
}

function Checklist() { const items = ["Earth, water and surcharge actions by stage", "Wall embedment and passive resistance", "Anchor/strut/slab prop and connection design", "Wall bending, shear and N-M resistance", "Wall movement and adjacent-asset settlement", "Basal heave, uplift, piping and seepage", "Global / deep-seated stability", "Execution, monitoring and trigger-action plan"]; return <ul className="space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm"><ChevronRight className="mt-0.5 size-4 shrink-0 text-accent" />{item}</li>)}</ul>; }
function Warning({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />{icon}<p className="text-xs">{text}</p></div>; }
