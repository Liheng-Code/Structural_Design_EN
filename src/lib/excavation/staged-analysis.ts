import type { SoilLayer } from "@/lib/engine/types";

export interface ExcavationPhase {
  id: string;
  title: string;
  action: string;
  excavationDepth: number;
  wallActive: boolean;
  interfacesActive: boolean;
  surchargeActive: boolean;
  supportsActive: number;
  waterInExcavation: boolean;
}

export interface PhaseScreeningResult extends ExcavationPhase {
  ka: number;
  soilResultant: number;
  waterDifferential: number;
  surchargeResultant: number;
  momentProxy: number;
  status: "INPUT REQUIRED" | "NOT VERIFIED";
}

export function plaxisLessonStages(depth: number, method: "bottom-up" | "top-down" | "semi-top-down"): ExcavationPhase[] {
  const cut = Math.max(0.25, depth / 3);
  const permanentProp = method === "top-down" ? "permanent slab prop" : method === "semi-top-down" ? "intermediate slab / prop" : "strut";
  return [
    { id: "P0", title: "Initial phase — K₀ stresses", action: "Generate initial effective stresses and pore pressures; soil is active and structural elements are inactive.", excavationDepth: 0, wallActive: false, interfacesActive: false, surchargeActive: false, supportsActive: 0, waterInExcavation: true },
    { id: "P1", title: "Install wall, interfaces and surcharge", action: "Activate retaining wall, soil–structure interfaces and crest surcharge without removing soil.", excavationDepth: 0, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 0, waterInExcavation: true },
    { id: "P2", title: "Excavation stage 1", action: "Deactivate the first excavation cluster; retain the modelled pore-pressure field.", excavationDepth: cut, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 0, waterInExcavation: true },
    { id: "P3", title: `Activate ${permanentProp}`, action: `Activate the ${permanentProp} at the designed level before the next excavation cut.`, excavationDepth: cut, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 1, waterInExcavation: true },
    { id: "P4", title: "Excavation stage 2", action: "Deactivate the second excavation cluster. Do not remove pore pressures unless a separately modelled dewatering phase applies.", excavationDepth: cut * 2, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 1, waterInExcavation: true },
    { id: "P5", title: "Final excavation stage", action: "Deactivate the final excavation cluster to formation level; assess wall actions, movements, base stability and seepage.", excavationDepth: depth, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 1, waterInExcavation: true },
    { id: "P6", title: "Base slab / load transfer", action: "Activate base slab and transfer the temporary restraint only after verifying the permanent load path.", excavationDepth: depth, wallActive: true, interfacesActive: true, surchargeActive: true, supportsActive: 1, waterInExcavation: true },
  ];
}

export function screenPhases(args: { layers: SoilLayer[]; depth: number; waterLevel: number; surcharge: number; gammaW: number; method: "bottom-up" | "top-down" | "semi-top-down" }): PhaseScreeningResult[] {
  return plaxisLessonStages(args.depth, args.method).map((phase) => {
    const H = phase.excavationDepth;
    const governing = args.layers.find((layer) => -layer.zTop <= H && -layer.zBot >= 0) ?? args.layers[0];
    const phi = governing?.phi ?? 0;
    const ka = Math.tan(((45 - phi / 2) * Math.PI) / 180) ** 2;
    const gamma = governing?.gamma ?? 0;
    const soilResultant = 0.5 * ka * gamma * H ** 2;
    const waterHead = phase.waterInExcavation ? 0 : Math.max(0, H - args.waterLevel);
    const waterDifferential = 0.5 * args.gammaW * waterHead ** 2;
    const surchargeResultant = phase.surchargeActive ? ka * args.surcharge * H : 0;
    const momentProxy = (soilResultant + waterDifferential + surchargeResultant) * H / 3;
    return { ...phase, ka, soilResultant, waterDifferential, surchargeResultant, momentProxy, status: phase.id === "P0" ? "INPUT REQUIRED" : "NOT VERIFIED" };
  });
}
