# CBP Wall Design — close the gap with the master prompt

## Context

`docs/sheet pile&CBP/master prompt.md` is the governing spec for this app. It defines
"Type B — Contiguous Bored Pile Wall / CBP" as a fully supported wall system with its
own section model (§20), structural check set including an N‑M interaction diagram
(§28), a mandatory engineering-review warning for the equivalent-wall stiffness
idealisation (§61), and its own data model (§65/66).

Reviewing the current code against those sections found that CBP is **implemented as
data and input UI only** — it is not yet a real structural design. Specifically:

- `Project.cbp` (`src/lib/engine/types.ts:181`) and `CbpPanel` (`src/components/Panels.tsx`)
  exist and are reasonably complete on the input side.
- But `analyseWall()` and `wallChecks()` in `src/lib/engine/calculate.ts` (the demand
  and resistance calculations) **read only `p.sheetPile.*`, never `p.cbp`**, regardless
  of `p.wallSystem`. Selecting "CBP" in the UI currently just swaps the cross-section
  drawing and some labels — the actual beam stiffness, flexure, shear and N‑M numbers
  are silently computed as if the wall were a solid rectangular precast sheet-pile
  section.
- There is no wall-solid-ratio (`D/s`) calculation, no individual-pile vs
  equivalent-wall stiffness branching, no circular-section flexure/shear/N‑M capacity
  math anywhere in the repo, and no N‑M interaction diagram — all explicitly required
  by §20/§28.
- The §61-mandated warning ("CBP equivalent wall stiffness assumption requires
  engineering review") is never emitted.
- "CBP Wall Design" on the dashboard currently opens the same `ExcavationSupportView`
  as sheet-pile, which itself says "Open the legacy CBP input panel only for detailed
  pile/reinforcement parameters" — but that legacy panel (`CalculatorApp`) isn't wired
  into the CBP module route at all, so there's currently no path to detailed CBP
  results even once they exist.

This plan closes those gaps: real circular-section structural checks for CBP, correct
demand-side stiffness modelling per §20, an N‑M interaction diagram, the mandatory
warnings, and a navigation path to see it all — reusing the existing engine/report/UI
patterns (`wallChecks`/`mkCheck`/`CheckResult`, the `bored-pile` and `pile-cap` module
shapes) rather than inventing new ones.

## Architectural decisions

1. **Circular-section math is a new pure module**, `src/lib/engine/cbp-section.ts` —
   no store/UI dependency, mirrors the style of `src/lib/bored-pile/calculations.ts`
   but covers structural capacity (flexure/N‑M/shear/detailing), not geotechnical
   resistance.
2. **Reuse the existing beam-on-elastic-foundation solver** (`beamFem` in
   `src/lib/engine/math.ts`) for demand. Both `lateralModel` options just feed it a
   different `EI`/`kSoil`, computed from `p.cbp.*` instead of `p.sheetPile.*`. A true
   discrete multi-pile/p‑y model is out of scope — flagged as a future enhancement.
3. **`AnalysisResult` stays "per metre run of wall"** (unchanged contract — no changes
   needed in `MVDiagram.tsx`/`PressureDiagram.tsx`/`FreeBody.tsx`). Per-pile demand for
   the circular-section check is obtained by multiplying by pile spacing `s` at the
   point `cbpWallChecks` runs, with an explicit inline comment (this ×s conversion is
   the easiest bug to introduce/miss).
4. **N‑M interaction data lives on `LoadCaseResult.cbp`**, not crammed into a
   `CheckResult` — new `CbpInteractionResult` type carries the envelope + operating
   point for both faces so the UI can render a real diagram.
5. **UI: CBP structural detail reuses the existing `CalculatorApp`/`Report.tsx`
   workspace**, reached via a new `"cbp-detail"` module, not a fresh isolated view like
   `BoredPileView`/`PileCapView`. Reason: CBP already shares `Project`, the Zustand
   store, and `calculate.ts` with sheet-pile (unlike bored-pile/pile-cap, which are
   self-contained islands with their own local state/types) — and `ExcavationSupportView`
   already anticipated this hand-off, it's just never been wired up.

## Type changes — `src/lib/engine/types.ts`

```ts
export interface NMPoint { N: number; M: number; }

export interface CbpInteractionResult {
  envelope: NMPoint[];
  NRd0: number;
  MRd0: number;
  balanced: NMPoint;
  operating: { NEd: number; MEd: number };
  utilization: number;
}
```

- Extend `LoadCaseResult` (line 360) with `cbp?: { solidRatio: number; lateralModel: "individual-pile" | "equivalent-wall"; upstream: CbpInteractionResult; downstream: CbpInteractionResult }`.
- Extend `CheckResult["category"]` (line 331) with `"DET"` for EN1992 §9 detailing
  provisions (min/max longitudinal, transverse, anchorage, lap) — these are code
  compliance checks, not limit states, and should be their own bucket in the
  summary/report grouping.
- Add `nh: number` and `khUser: number | null` to `Project.cbp` (line 181) and to
  `src/lib/engine/defaults.ts` — CBP subgrade reaction must not silently reuse
  `p.sheetPile.nh`.

## New module — `src/lib/engine/cbp-section.ts`

Pure functions operating on a `CircularSectionInput` (diameter, cover, bar
diameter/count, stirrup diameter, fck, fyk, partial factors):

- `circularGeometry()` — gross area, steel area, `Ig = π/64·D⁴`, discrete bar
  positions by angle around the circumference.
- `nmInteractionEnvelope()` — EN1992-1-1 §3.1.7 parabola-rectangle stress block,
  fibre discretisation across the circle (~150 strips), strain compatibility at
  sweeping neutral-axis depths, per-bar strain/stress at its actual angle (not
  "each face" — a circular cage isn't symmetric about one axis the way a rectangular
  section is). Returns the envelope, pure-axial `NRd0`, pure-flexural `MRd0`, and the
  balanced point.
- `nmUtilization(envelope, NEd, MEd)` — radial-scaling utilization: ray from the
  origin through `(NEd, MEd)`, utilization = operating-point distance / envelope
  intersection distance along that ray (handles points outside the envelope, i.e. > 1).
- `vrdCircular()` — EN1992 §6.2.2 generalised shear with the axial-compression
  enhancement term; document the effective chord width/depth assumption (`bw≈0.9D`,
  `d≈0.8D`) as an explicit ASSUMPTION pending validated circular-section guidance.
- `cbpSolidRatio(diameter, spacing)` — single source of truth for `D/s`.
- `minMaxLongitudinalRatio()` (EN1992 §9.8.5 pile-specific tiers, cross-checked vs
  §9.5.2), `transverseCheck()`, `crackWidthCircular()` (adapted from the existing
  `crackWidth()` pattern in `calculate.ts`), `anchorageLength()` (§8.4), `lapLength()`
  (§8.7).

## `src/lib/engine/calculate.ts` changes

- **`analyseWall()`** (line 234): branch on `p.wallSystem === "cbp"`.
  - `individual-pile`: `Ig = π/64·D⁴`, `EI = Ecm·Ig·1000/s` (smeared per metre by
    dividing by spacing), soil spring stiffness scaled by `D/s` (soil only reacts over
    the pile width, not the full metre).
  - `equivalent-wall`: `Ig` from a solid rectangular section with `t=D`, full
    continuous soil reaction — this is the riskier idealisation that triggers the §61
    warning.
  - Both paths still call the existing `beamFem(...)` unchanged.
- **`analyseCase()`** (line 985): branch checks assembly — `cbpWallChecks(...)` in
  place of `wallChecks(...)` when `p.wallSystem === "cbp"`; populate
  `LoadCaseResult.cbp` from the returned interaction results and `cbpSolidRatio(...)`.
- **`runCalculationInner()`**: emit the mandatory warnings —
  `"CBP equivalent wall stiffness assumption requires engineering review."` (when
  `lateralModel === "equivalent-wall"`), a "do not treat spaced piles as a solid
  diaphragm wall" warning, and a seepage warning when `waterCutoff === "none"`. Branch
  `derived`/`variables()` (currently hard-coded to `p.sheetPile.*`) so `Report.tsx`'s
  geometry/materials table shows correct CBP numbers — add `variablesCbp()` in the new
  `cbp-checks.ts`. Skip the precast-lifting `handlingCheck` for CBP (cast-in-place,
  not lifted).
- **Fix `cappingChecks()`** (line 809): it uses `p.sheetPile.fyk` unconditionally for
  the capping-beam steel grade — wrong when `wallSystem === "cbp"`; fall back to
  `p.cbp.fyk` in that case.
- **Move `mkCheck()`** (line 421) from `calculate.ts` into `math.ts` (it only depends
  on `CheckResult`/`Status`/`Project["limits"]`) so the new `cbp-checks.ts` can import
  it without a circular dependency back into `calculate.ts`.

## New module — `src/lib/engine/cbp-checks.ts`

```ts
export function cbpWallChecks(
  p: Project, lc: LoadCaseDef, analysis: AnalysisResult, side: string
): { checks: CheckResult[]; interaction: CbpInteractionResult };

export function variablesCbp(p: Project, d: CalcBundle["derived"]): VariableRow[];
```

Per-pile demand: `MEd_pile = MEd_perMetre × p.cbp.spacing` (and same for `VEd`),
converted once with an explanatory comment. Emits, via the relocated `mkCheck()`:
axial (`NEd` vs `NRd0`), flexure (`MEd` vs capacity at `NEd` read off the envelope),
combined N‑M (`nmUtilization`), shear (`vrdCircular`), reinforcement/detailing checks
(category `"DET"`), crack width (SLS), and a CBP-specific cover/durability check using
`p.cbp.cover`.

## UI changes

- **`src/components/diagrams/NMInteractionDiagram.tsx`** (new) — same conventions as
  `MVDiagram.tsx` (inline SVG, existing font/color system): plots the envelope as a
  closed polyline, marks the operating point and the radial utilization line, colors
  the marker via the existing status-color logic. Props: `{ interaction: CbpInteractionResult; title: string }`.
- **`src/components/App.tsx`** (`CalculatorApp`): when `project.wallSystem === "cbp"`,
  render `NMInteractionDiagram` for upstream/downstream in the results body (the
  existing generic `checks` list already renders the new `DET`/circular checks with no
  changes needed); add a secondary "Excavation concept" back-button
  (`setActiveModule("cbp")`) next to the existing "Modules" button (line ~73), shown
  only for CBP projects.
- **`src/components/Report.tsx`**: add a "CBP structural check" section (mirroring
  §28) gated on `wallSystem === "cbp"`, with the CBP check table, a static rendering of
  `NMInteractionDiagram`, and explicit rendering of the CBP-specific warnings.
- **Navigation bridge**:
  - `src/lib/store.ts:27` — extend `PlatformModule` to
    `"modules" | "sheet-pile" | "cbp" | "cbp-detail" | "bored-pile" | "pile-cap"`.
  - `src/routes/index.tsx:20` — `activeModule === "cbp-detail"` renders `<CalculatorApp />`; `"sheet-pile" | "cbp"` keep rendering `ExcavationSupportView` as today.
  - `src/components/ExcavationSupportView.tsx:82` — replace the dead-end sentence
    "Open the legacy CBP input panel..." with a button that calls
    `setActiveModule("cbp-detail")`.
- **`src/components/Panels.tsx`** — `CbpPanel`'s inline solid-ratio calculation
  (~line 432) switches to `cbpSolidRatio()` from the new module (single source of truth).

## Milestone sequence

0. **Save this plan into the repo** as
   `docs/sheet pile&CBP/CBP Wall Design Implementation Plan.md` (alongside the master
   prompt and `Excavation Support Design Plan.md`), so it's tracked with the other
   design docs before implementation starts.
1. **Data model & warnings** — types, `Project.cbp.nh`/`khUser` + defaults, `"DET"`
   category, mandatory warning strings (no analysis change yet).
   Files: `types.ts`, `defaults.ts`, `calculate.ts` (warnings only).
2. **Circular section math** — build `cbp-section.ts`, sanity-check the N‑M envelope
   against a known circular-column interaction example by hand/spreadsheet before
   wiring it in.
   Files: `cbp-section.ts` (new).
3. **Demand-side stiffness branching** — split `analyseWall()`, wire in
   `cbpSolidRatio`, relocate `mkCheck()` to `math.ts`.
   Files: `calculate.ts`, `math.ts`.
4. **Resistance-side checks wiring** — `cbp-checks.ts`, branch `analyseCase`/
   `runCalculationInner`, fix the capping `fyk` bug, skip `handlingCheck` for CBP.
   Files: `cbp-checks.ts` (new), `calculate.ts`.
5. **UI: diagram + navigation bridge** — `NMInteractionDiagram`, `App.tsx` results
   body, `Report.tsx` CBP section, store/router/`ExcavationSupportView` wiring,
   `Panels.tsx` clean-up.
   Files: `NMInteractionDiagram.tsx` (new), `App.tsx`, `Report.tsx`, `store.ts`,
   `routes/index.tsx`, `ExcavationSupportView.tsx`, `Panels.tsx`.
6. **QA pass** — run `runCalculation()` against `defaultProject()`'s CBP defaults
   (D=0.8m, s=0.95m, fck=35, fyk=500, 12×25mm bars) for both `wallSystem` values and
   both `lateralModel` values; confirm `runParametric`/`runSensitivity` don't crash on
   CBP projects (they currently only sweep sheet-pile-oriented fields —
   `embedment`/`thickness`/`tieDia`/wall `spacing` still apply and work unchanged;
   sweeping pile diameter/pile spacing is a follow-up, not required here since the
   check names `cbpWallChecks` produces should still contain "flexure"/"shear"/
   "deflection" substrings that `runParametric`'s name-matching already relies on).

## Verification

- Run the app (`npm run dev` or equivalent) and exercise both wall systems from
  `ModuleDashboard`: confirm the sheet-pile path is byte-for-byte unaffected (no
  regressions — every branch added is `wallSystem === "cbp"` gated).
- On the CBP path: set `lateralModel` to each option and confirm the §61 warning
  appears only for `equivalent-wall`; confirm the N‑M diagram renders with a
  utilization consistent with the emitted `CheckResult`s; confirm `Report.tsx`
  produces the new CBP section with correct geometry/material numbers (not
  sheet-pile's).
- Spot-check `nmInteractionEnvelope()` and `vrdCircular()` against a hand/spreadsheet
  calculation for the default CBP section (D=0.8m, 12×25mm bars, fck=35, fyk=500)
  before trusting the UI output.
- Confirm `runParametric`/`runSensitivity` still execute without throwing when
  `project.wallSystem === "cbp"`.
