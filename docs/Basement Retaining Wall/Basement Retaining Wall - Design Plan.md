# Plan — Design of a Top-Propped Basement Retaining Wall (Eurocode)

Status: PRELIMINARY — NOT VERIFIED until exposure / NA / geotechnical / waterproofing inputs confirmed.
National Annex: UK NA (provisional). Model: propped-cantilever force method (construction + permanent stages).

## 1. Objective

Add a new `BasementWallView` module — distinct from the existing free-standing `CantileverRetainingWallView` —
providing a fully traceable UK-NA Eurocode design for a basement wall propped at the top by the ground-floor
slab, base fixed into the base slab/raft, covering both the temporary construction (cantilever) stage and the
permanent (propped) stage, matching the depth and UX of the existing retaining-wall / pile-cap modules.

## 2. Engineering methodology

### Design basis
- Codes: EN 1990, EN 1992-1-1 (EC2), EN 1997-1 (EC7 — earth pressure and base reaction only; global
  raft bearing/settlement is delegated to the building's overall foundation design, out of scope here).
- Design life 50y, Consequence Class CC2 (ASSUMED, INPUT REQUIRED).
- UK NA governs; recommended EC2/EC7 values used only where NA silent, labelled.

### Structural system — two governing design situations
1. **Construction stage (transient).** Wall is a true vertical cantilever: fixed at the base only, free at
   top (slab prop not yet cast). Loading: active pressure Ka (Rankine default, Coulomb optional), full
   retained height, construction surcharge, no permanent water table by default (ASSUMED, INPUT REQUIRED).
   Mechanics: identical cantilever logic to the existing `retaining-wall` module's stem design.
2. **Permanent stage (persistent).** Wall propped: base **fixed** (monolithic with base slab — stated
   ASSUMPTION), top **pinned** at the underside of the ground-floor slab (translation-restrained,
   rotation-free; slab flexural stiffness conservatively ignored — stated ASSUMPTION). Loading: full
   backfill height, service surcharge (ψ2 = 0.3), full design water table. Earth pressure: **at-rest K0
   by default** (Jaky, `k0Jak`) because a propped wall is not expected to deflect enough to mobilise active
   pressure, with active (Ka) exposed as a user-selectable ASSUMED alternative.

Do not skip the construction stage: per project methodology, temporary construction conditions can govern
and must be checked alongside the permanent condition, not instead of it.

### Analysis model — closed-form force (unit-load) method
With a rigid base fixity and a rigid top pin, the wall is once statically indeterminate; the redundant is
the horizontal prop reaction P.
1. Release the prop -> cantilever `M0(z)`, `V0(z)` under the real trapezoidal earth+water+surcharge
   pressure, by cumulative load -> shear -> moment integration from the free (top) end.
2. `δ0` = top deflection of the released cantilever under the real load, by quadrature of `M0(z)·z / EI`
   using the existing `trap()` helper.
3. `δ11 = H³ / (3·EI)` = top deflection under a unit tip load.
4. `P = δ0 / δ11`.
5. Final `M(z) = M0(z) − P·z`, `V(z) = V0(z) − P`.

For a prismatic wall (constant thickness, the default), EI is constant along the height and **cancels out
of P = δ0/δ11** — the force distribution is independent of concrete grade/cracked-section modulus. This is
stated explicitly in the report for traceability. `beamFem` (Winkler beam FEM already in
`src/lib/engine/math.ts`) is noted as a documented future option only if a flexible prop or an embedded
toe/Winkler base is later required — not used for this version, to keep every step substitution-visible.

### Moment sign reversal -> two-face reinforcement
Construction-stage cantilever hogs throughout (back-face tension, max at base). The permanent propped
stage reverses sign partway up (hogging at base -> sagging near mid-height where V(z)=0, front-face
tension). This requires two-face reinforcement design: inner/back-face bars sized for base hogging (both
stages), outer/front-face bars sized for permanent-stage span sagging.

### Base / geotechnical model
Default `baseSupportType = "raft"`: only the local base moment/shear connection demand into the base
slab is checked; global sliding/bearing of the wall base is NOT VERIFIED / delegated to the building's raft
design (same delegation pattern the Pile Cap module uses for settlement, deferred to Bored Pile). A
`baseSupportType = "strip footing"` alternative (sliding/bearing logic analogous to the cantilever wall
module) is exposed for future extension, off by default.

### Load path outputs (new check category vs the sibling module)
Top prop reaction P (kN/m) and base reaction (M, V) are reported as explicit informational outputs,
status NOT VERIFIED (demand only) — these become inputs to the ground-floor slab/diaphragm design and the
base-slab design, both out of scope here.

### Default inputs (all ASSUMED, adjustable in the tool)
| Item                    | Default                                                    |
|-------------------------|-------------------------------------------------------------|
| Geometry                | Stem height 3500 mm; prismatic wall thickness 300 mm; base thickness 400 mm |
| Materials               | C30/37 wall, B500C rebar                                   |
| Exposure / cover        | XC2 buried face, XC3 water face; c_nom 40 / 50 mm; w_max 0.3 mm |
| Backfill                | γ = 18 kN/m³, φ = 32°, c = 0 (granular)                     |
| Earth pressure          | K0 (Jaky) default for permanent stage; Ka (Rankine/Coulomb toggle) for construction stage and as permanent-stage alternative |
| Surcharge               | Construction 10 kPa; service 10 kPa (ψ2 = 0.3)              |
| Groundwater             | Permanent stage: at ground surface / top of wall, i.e. fully saturated backfill (worst case, depth = 0 mm); construction stage: none (ASSUMED, INPUT REQUIRED) |
| Base support            | `"raft"` (monolithic with base slab); `"strip footing"` optional |

### ULS checks (each E_d, R_d, UR, PASS/FAIL, clause, tagged by stage)
1. Construction-stage base flexure — back face (§6.1). Typically governs the base, since propping relieves
   base moment in the permanent stage even though K0 > Ka.
2. Construction-stage base shear — back face (§6.2.2).
3. Permanent-stage base flexure — back face (§6.1).
4. Permanent-stage base shear — back face (§6.2.2).
5. Permanent-stage span (mid-height) flexure — front face (§6.1). Only exists in the permanent stage.
6. Permanent-stage span shear — front face (§6.2.2).
7. Minimum reinforcement, each face (§9.2.1.1).
8. Anchorage of base dowels/starter bars; curtailment of hogging steel past the point of contraflexure
   (§8.4).
9. Top prop reaction -> slab design input (Load Path, informational, NOT VERIFIED).
10. Base reaction (M, V) -> base slab/footing design input (Load Path, informational, NOT VERIFIED).

### SLS
- Crack width w_k, back face at base and front face at span, quasi-permanent combination (§7.3.4).
- Global bearing/sliding of raft: NOT VERIFIED, delegated.
- Water resistance / waterproofing grade (e.g. BS 8102 or equivalent): NOT VERIFIED, INPUT REQUIRED —
  structural water pressure is included in loading; waterproofing detailing is a specialist item.

### Output
PASS/FAIL matrix (stage-tagged), DESIGN SUMMARY, two-face rebar schedule, max utilization, governing
checks, Load Path outputs, PROFESSIONAL REVIEW WARNING, INPUT REQUIRED list.

## 3. App implementation
- `src/lib/basement-wall/types.ts` — `BasementWallCheck` (category union incl. `"Load Path"`, plus
  `stage: "Construction" | "Permanent"` field), `BasementWallProject`, `ConstructionStageSummary`,
  `PermanentStageSummary`, `BasementWallAnalysisResult`, `defaultBasementWallProject()`.
- `src/lib/basement-wall/calculations.ts` — `analyzeBasementWall(project)` pure function. Reuses
  `kaRankine`, `kaCoulomb`, `k0Jak`, `trap`, `trapMoment`, `toRad`, `ecmFromFck`, `fctm` from
  `../engine/math`. Local (module-own) helpers: trapezoidal pressure integrator, cumulative
  load->V0->M0 integrator, δ0/δ11 force-method solver for P, two-face flexural design / shear resistance /
  crack-width, and `push`/`passFail`/`safeRatio` matching `retaining-wall/calculations.ts` naming.
- `src/components/BasementWallView.tsx` — tabbed suite:
  1. Overview & HUD (UR cards + live elevation SVG)
  2. Geometry & Materials
  3. Soil / Groundwater / Earth Pressure (K0 vs Ka toggle)
  4. Construction Stage
  5. Permanent Stage (incl. Load Path outputs)
  6. Detailing & Rebar (two-face)
  7. Calculation Report (traceable, print-to-PDF)
- `src/components/diagrams/BasementWallDiagram.tsx` — code-drawn SVG: base-fixity and top-prop/slab
  symbols, construction-stage (triangular) vs permanent-stage (trapezoidal, incl. water) pressure diagrams
  side by side, and a moment diagram showing the sign reversal.
- Wiring: `src/lib/store.ts` (`PlatformModule` union += `"basement-wall"`), `src/components/
  ModuleDashboard.tsx` (new card, `onClick={() => setActiveModule("basement-wall")}`), `src/routes/
  index.tsx` (new `if (activeModule === "basement-wall") return <BasementWallView />;` block, mirroring
  the existing `retaining-wall` block).
- Scope: single-level basement, one top prop; multi-level/multi-prop basements noted for future only.

## 4. Verification gates
- `npm run build` + `npm run typecheck` (background, both must pass).
- `node scripts/browser-smoke.mjs` (desktop AND mobile) — visible content, clean console.
- Interactive check: change stem height / toggle K0<->Ka / toggle base support type -> confirm
  construction-stage vs permanent-stage results and the governing check both update live.
- `npm run preview:restart` + smoke on built output.
- No auth/db changes (standalone module, like the other modules).

## 5. Worked calculation deliverable
Report tab produces the full traceable chain (inputs -> equations -> substitution -> result ->
verification) for both stages. Implementation summary restates worked numbers for the default set:
governing base moment (stage), governing span moment, top prop reaction P, As required vs provided each
face, shear URs, UR_max, overall PASS/FAIL.

## 6. Outstanding inputs (INPUT REQUIRED)
- Consequence class confirmation; true exposure class / cover; confirmed National Annex.
- Confirmed permanent design water table and construction-stage water assumption.
- Waterproofing grade / detailing (BS 8102 or equivalent) — out of structural scope.
- Base slab / raft design confirmation (sliding, bearing, settlement) — delegated, not verified here.
- Ground-floor slab / diaphragm design confirmation of capacity to take the reported prop reaction P.

## 7. Execution order
1. types + `analyzeBasementWall` (construction stage first, then permanent-stage force method, then
   two-face checks, then Load Path checks) -> 2. diagram -> 3. view + report tab -> 4. wire store /
   dashboard / route -> 5. build/typecheck -> 6. browser smoke (dev + built) -> 7. summary with worked
   numbers + INPUT REQUIRED list.
