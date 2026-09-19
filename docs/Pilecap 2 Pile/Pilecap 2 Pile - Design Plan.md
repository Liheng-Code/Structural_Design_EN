# Plan — Design of a 2-Pile Pile Cap on Bored Piles (Eurocode STM)

Status: PRELIMINARY — NOT VERIFIED until exposure / NA / geotechnical inputs confirmed.
National Annex: UK NA (provisional). Model: Strut-and-Tie (EN 1992-1-1 §6.5).

## 1. Objective
Replace the placeholder PileCapView (hardcoded strut angle, no real checks) with a
fully traceable UK-NA Eurocode design suite for a 2-pile cap on bored piles, matching
the depth and UX of the existing BoredPileView module, backed by a worked calculation.

## 2. Engineering methodology
### Design basis
- Codes: EN 1990, EN 1992-1-1 (EC2), EN 1997-1 (EC7 — pile loads only; pile
  geotechnical capacity is verified in the Bored Pile module).
- Design life 50 y, Consequence class CC2, Exposure XC2 (ASSUMED, INPUT REQUIRED).
- UK NA governs; recommended EC2 values used only where NA silent, labelled.

### Default inputs (all ASSUMED, adjustable in the tool)
| Item            | Default                                   |
|-----------------|-------------------------------------------|
| Column          | 600 × 400 mm; N_Ed 2400 kN; M_Ed 250 kNm; H_Ed 80 kN |
| Piles           | 2 × Ø800 mm bored; c/c spacing s = 2400 mm (3·D) |
| Cap             | 3500 × 1100 mm; depth h = 1400 mm          |
| Materials       | C30/37 cap, B500C rebar                   |
| Cover           | c_nom = 40 mm (c_min,XC2 + Δc_dev)         |

### Load model
- Pile reactions: R_i = N_Ed/2 ± M_Ed/s (+ self-weight share). Max reaction governs
  strut design; "pile design loads" column feeds the Bored Pile geotech module.
- Combinations: ULS fundamental (γ_G 1.35, γ_Q 1.5); SLS quasi-permanent for cracking.

### STM model (EC2 §6.5), beam model as cross-check
- Column load -> two diagonal compressive struts -> pile tops; horizontal tension tie
  along the bottom between piles. θ = atan(d/(s/2)), θ >= 45° design target (flagged if less).
- Tie force T = (N/2)·cotθ = N·s/(4d); As >= T/fyd in the band between piles.

### ULS checks (each E_d, R_d, UR, PASS/FAIL, clause)
1. Pile reaction equilibrium (ΣV).
2. Strut verification — σ_Ed <= σ_Rd,max, ν1 = 0.6(1 − fck/250) (§6.5.2).
3. Node verification — CCC ν=1.0; CCT at piles (§6.5.4).
4. Tension tie: F_td <= A_s·fyd.
5. Wide-beam shear; enhancement when a_v <= 2.5d (§6.2 / §6.2.2(6)).
6. Punching shear at column & piles, §6.4.7 pile-cap perimeters (pile within 2d).
7. Minimum rebar §9.2.1.1 (0.26·fctm/fyk·b·d; 0.0013·b·d), spacing, tie band.
8. Anchorage of tie bars past pile faces (l_bd) + cage embedment into cap.

### SLS
- Crack width w_k = s_r,max·(ε_sm − ε_cm) <= w_max (§7.3.4) under quasi-permanent tie.
- Stress limitation; settlement delegated to Bored Pile module (NOT VERIFIED here).

### Output
PASS/FAIL matrix, DESIGN SUMMARY, rebar schedule, max utilization, governing
checks, PROFESSIONAL REVIEW WARNING, INPUT REQUIRED list.

## 3. App implementation
- src/lib/pile-cap/types.ts — PileCapProject + result/check types (mirrors bored-pile).
- src/lib/pile-cap/calculations.ts — analyzePileCap(project) pure function.
- src/components/PileCapView.tsx — tabbed suite:
  1. Overview & HUD (reaction/UR cards + live STM SVG)
  2. Loads & Geometry
  3. STM ULS
  4. Shear & Punching
  5. SLS & Durability
  6. Detailing & Rebar
  7. Calculation Report (Mathcad-style, print-to-PDF)
- src/components/diagrams/PileCapDiagram.tsx — code-drawn SVG elevation + plan.
- Wiring: already live (src/routes/index.tsx, activeModule === "pile-cap"); no route/store changes.
- Scope: 2-pile fixed; 3/4/5-pile expansion noted for future only.

## 4. Verification gates
- npm run build + npm run typecheck (background, both must pass).
- node scripts/browser-smoke.mjs (desktop AND mobile) — visible content, clean console.
- agent-browser interactive check (adjust inputs -> values/report update).
- npm run preview:restart + smoke on built output.
- No auth/db changes (standalone module, like BoredPile).

## 5. Worked calculation deliverable
Report tab produces the full traceable chain (inputs -> equations -> substitution ->
result -> verification). Implementation summary restates worked numbers for the default
set: governing tie force, strut/node URs, As required vs provided, shear/punch URs,
UR_max, overall PASS/FAIL.

## 6. Outstanding inputs (INPUT REQUIRED)
- Exposure class / true cover; design life; consequence class confirmation.
- Confirmed column load & moment envelopes.
- Pile geotechnical capacities (Bored Pile module results).
- UK NA confirmation of θ / STM guidance.

## 7. Execution order
1. types + analyzePileCap -> 2. diagram -> 3. view + report tab -> 4. build/typecheck
-> 5. browser smoke (dev + built) -> 6. summary with worked numbers + INPUT REQUIRED list.