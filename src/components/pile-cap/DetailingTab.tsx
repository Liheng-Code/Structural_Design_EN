import type { Body } from "./ui";
import { ChecksTable, Eq, NumField, StatCard, Section } from "./ui";

export function DetailingTab({ body }: { body: Body }) {
  const { project, res, pad } = body;
  const minCheck = res.checks.find((c) => c.id === "UL-10");

  const barsAcross = project.tieBarCount;
  const layers = Math.max(1, Math.ceil(barsAcross / 5));
  const barsPerLayer = Math.ceil(barsAcross / layers);
  const clearSpacingLayer =
    barsPerLayer > 1 ? (project.tieBandWidth - 2 * (project.cNom + 8) - barsPerLayer * project.tieBarDiameter) / (barsPerLayer - 1) : 8888;

  return (
    <div className="space-y-6">
      <Section title="Bottom Tie Rebar Schedule" hint="Concentrated band between the piles — placement, spacing and minimum steel">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumField label="Bar diameter" value={project.tieBarDiameter} unit="mm" onChange={(v) => pad({ tieBarDiameter: v })} />
          <NumField label="Number of bars" value={project.tieBarCount} onChange={(v) => pad({ tieBarCount: v })} />
          <NumField label="Band width" value={project.tieBandWidth} unit="mm" onChange={(v) => pad({ tieBandWidth: v })} />
          <NumField label="Nominal cover" value={project.cNom} unit="mm" onChange={(v) => pad({ cNom: v })} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard label="As provided" value={`${res.asProvided}`} unit="mm²" sub={`required ${res.asRequired}`} tone={res.asProvided >= res.asRequired ? "emerald" : "rose"} />
          <StatCard label="As,min (§9.2.1.1)" value={`${res.asMin}`} unit="mm²" sub={`max(0.26fctm/fyk·bd, 0.0013bd)`} tone={minCheck?.status === "PASS" ? "emerald" : "rose"} />
          <StatCard label="Layers / bars" value={`${layers} × ${barsPerLayer}`} sub="staggered within band" tone="white" />
          <StatCard label="Clear spacing" value={`${clearSpacingLayer > 80 ? clearSpacingLayer.toFixed(0) : clearSpacingLayer.toFixed(0)}`} unit="mm" sub="within a layer" tone={clearSpacingLayer >= 25 ? "emerald" : "amber"} />
        </div>
        <div className="mt-4">
          <Eq>
            <div>
              As,min = max(0.26×(fctm/fyk)×b×d, 0.0013×b×d) = max(0.26×{res.fctm}/{project.fyk}×{project.tieBandWidth}×{res.effectiveDepth}, 0.0013×{project.tieBandWidth}×{res.effectiveDepth}) = {res.asMin} mm²
            </div>
            <div className="text-slate-400 mt-1">
              Provided {project.tieBarCount} Ø{project.tieBarDiameter} = {res.asProvided} mm² in the {project.tieBandWidth} mm band between piles. Minimum 2 layers where bar count &gt; 5.
            </div>
          </Eq>
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Bar spacing shown assumes evenly distributed bars across the band; adjust count/diameter so clear spacing ≥ 25 mm (max aggregate) and
          ≤ 150–200 mm for crack control per §7.3.3.
        </p>
      </Section>

      <Section title="Anchorage & Detailing" hint="Tie bars must develop their force beyond the pile faces">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Anchorage l_bd (basic)" value={`${res.anchorageLength}`} unit="mm" sub={`(Ø/4)·(σs_lim/fbd), fbd = 2.25·fctk,0.05/γC`} />
          <StatCard
            label="Straight length past pile"
            value={`${res.lengthPastPile}`}
            unit="mm"
            sub="(s − Ø_pile)/2 − cover"
            tone={res.lengthPastPile >= 0.6 * res.anchorageLength ? "emerald" : (res.lengthPastPile >= res.anchorageLength ? "emerald" : "amber")}
          />
          <StatCard label="Anchorage ratio" value={`${res.lengthPastPile > 0 ? (res.lengthPastPile / Math.max(1, res.anchorageLength)).toFixed(2) : "—"}`} sub="available / required" tone={res.lengthPastPile >= res.anchorageLength ? "emerald" : "amber"} />
        </div>
        <p className="mt-3 rounded-lg bg-slate-950/60 border border-slate-800 p-3 font-mono text-[11px] text-slate-400 leading-relaxed">
          Extend tie bars into the anchorage zone beyond the pile centreline; provide standard hooks/anchorage heads where the straight
          length is insufficient. Bored-pile reinforcement cages must project into the cap to the fixity length and the cap bottom bearing
          casting is one operation. Top nominal mesh {project.topMesh} per §9.7 deep-member surface rule. Provide bursting/tee links at the
          column zone if node stress is critical.
        </p>
      </Section>

      <Section title="Check Detail" hint="Minimum reinforcement verification">
        <ChecksTable checks={res.checks.filter((c) => ["UL-10", "EQ-01", "GE-02"].includes(c.id))} />
      </Section>

      <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 font-mono text-xs text-amber-200 leading-relaxed">
        INPUT REQUIRED — confirm site exposure class (true cover), design working life, consequence class, verified column action envelope and
        pile geotechnical capacities (Bored Pile module) before issuing. This tool is a preliminary design aid; a qualified engineer shall
        check and approve the issuing design.
      </div>
    </div>
  );
}