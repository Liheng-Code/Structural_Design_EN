# Plan — Design of Wind Load on a Tall Building (Eurocode EN 1991-1-4)

Status: PRELIMINARY — NOT VERIFIED until site wind data / NA / geometry inputs confirmed.
National Annex: UK NA (provisional). Model: EN 1991-1-4 peak-velocity-pressure profile with Annex B closed-form structural factor (cscd) for along-wind resonant response and comfort.

## 1. Objective
Add a new, standalone `WindLoadView` module computing the EN 1991-1-4 along-wind
design action on a prismatic rectangular tall building: the height-varying peak
velocity pressure and force-coefficient-based pressure/force profile, the resultant
base shear and overturning moment at foundation level, and the Annex B along-wind
dynamic response (structural factor cscd, tip deflection, peak/RMS acceleration) for
an informative occupant-comfort check. This is a **loads module**, not a resistance
module: it produces E_d-side outputs that feed downstream structural/foundation
modules (pile-cap, bored-pile, retaining/basement wall), and explicitly flags where a
resistance-side verification would live but is out of scope.

## 2. Engineering methodology
### Design basis
- Codes: EN 1990 (basis), EN 1991-1-4 (wind actions), Annex B (structural factor cscd,
  detailed procedure), Annex F (fundamental frequency approximation, damping).
- UK NA governs; every Nationally Determined Parameter (NDP) is an explicit input with
  the standard disclaimer: "No project-specific National Annex has been
  provided/confirmed. Recommended Eurocode values are used provisionally and shall be
  confirmed against the governing national requirements."
- Occupant comfort is not codified in EN 1991-1-4; the comfort check benchmarks
  against ISO 10137 (informative) and is labelled accordingly.
- Scope: single rectangular prismatic tower, along-wind response only. Across-wind
  (vortex shedding), torsional response, and interference/topography effects are out
  of scope (see §6).

### Default inputs (all ASSUMED, adjustable in the tool)
| Item                          | Default                              | Classification |
|--------------------------------|---------------------------------------|-----------------|
| Building height H              | 100 m                                 | GIVEN |
| Crosswind breadth B             | 30 m                                  | GIVEN |
| Along-wind depth D               | 20 m                                  | GIVEN |
| Terrain category                | II (open country)                     | NATIONAL PARAMETER |
| Site altitude A                 | 10 m AMSL                             | GIVEN |
| Basic wind velocity vb,map       | 24 m/s                                | GIVEN / NATIONAL PARAMETER |
| cdir, cseason                    | 1.0, 1.0                              | NATIONAL PARAMETER |
| Air density ρ                    | 1.25 kg/m³                            | CODE-DEFINED |
| Turbulence factor kl             | 1.0                                   | NATIONAL PARAMETER |
| Orography co                     | 1.0                                   | ASSUMED |
| Natural frequency mode           | Estimate (Annex F, n1 = 46/h)         | ENGINEERING JUDGEMENT |
| Log. decrement of damping δs     | 0.10 (reinforced concrete)            | NATIONAL PARAMETER/ASSUMED |
| Mass per unit height m           | 230 t/m                               | ASSUMED (INPUT REQUIRED) |
| Mode-shape exponent ζ            | 1.0 (linear)                          | ASSUMED |
| Comfort acceleration limit       | 0.15 m/s² peak (ISO 10137-informed)   | ENGINEERING JUDGEMENT |
| Along-wind drift limit           | H/500                                 | ENGINEERING JUDGEMENT |
| National Annex                   | UK NA (provisional)                   | NATIONAL PARAMETER |

### Load model
Rectangular prismatic building, wind normal to the B-face. A fixed 41-node height
mesh (z = 0…H) carries `ze(z)`, `cr`, `Iv`, `vm`, `qp`, `cf`, `w(z)`, `Fw,dist(z)` at
each node, integrated with the shared `trap`/`trapMoment` helpers
(`src/lib/engine/math.ts`) for base shear and overturning moment — the same
profile-array + trapezoidal-integration pattern already used for earth pressure in
the retaining-wall module.

### Formula chain
1. **Basic wind velocity (§4.2):** vb = cdir·cseason·vb,0, vb,0 = calt·vb,map
   (calt = 1+0.001·A, simplified/PROVISIONAL altitude correction).
2. **Terrain roughness (Table 4.1):** category lookup → z0, zmin;
   kr = 0.19·(z0/z0,II)^0.07; cr(z) = kr·ln(z/z0), held at cr(zmin) below zmin.
3. **Orography (§4.3.3):** co(z) = 1.0 default, user-overridable multiplier.
4. **Mean wind velocity (§4.3.1):** vm(z) = cr(z)·co(z)·vb.
5. **Turbulence intensity (§4.4):** Iv(z) = kl/(co(z)·ln(z/z0)), held at Iv(zmin)
   below zmin.
6. **Peak velocity pressure (§4.5):** qp(z) = [1+7·Iv(z)]·0.5·ρ·vm(z)².
7. **Reference height ze(z), Fig 7.4** (h>b strip logic evaluated pointwise, no
   arbitrary discrete band count): h≤b → ze=h; b<h≤2b → ze=b below h−b else h;
   h>2b → ze=b below b, ze=h above h−b, ze=z in between.
8. **Force coefficient (§7.6, Fig 7.23):** cf,0(d/b) via a digitized lookup
   (breakpoints 0.1/0.5/1/2/4/10 → 2.35/2.15/2.05/1.55/1.25/1.2, flagged
   approximate); end-effect ψr = 1.0 (sharp corners); ψλ from effective slenderness
   λ(l/b) (Table 7.16) and ψλ(λ) at solidity 1 (Fig 7.36), digitized lookups;
   cf = cf,0·ψr·ψλ.
9. **Structural factor cscd, Annex B (closed-form, no iteration):**
   zs = max(0.6H, zmin); α = 0.67+0.05·ln(z0); L(zs) = 300·(zs/200)^α;
   B² = 1/(1+0.9·((b+h)/L(zs))^0.63); n1 default = Annex F estimate 46/h (override
   toggle for a given modal-analysis value); fL = n1·L(zs)/vm(zs);
   SL = 6.8·fL/(1+10.2·fL)^(5/3); ηh/ηb = 4.6·(h or b)·fL/L(zs);
   R(η) = 1/η − (1/2η²)(1−e^(−2η)) → Rh, Rb; δs input (default 0.10; aerodynamic
   damping δa not modelled); R² = (π²/2δs)·SL·Rh·Rb; ν = max(n1·√(R²/(B²+R²)),0.08);
   kp = max(√(2ln(νT))+0.6/√(2ln(νT)), 3.0), T = 600 s;
   cscd = (1+2kp·Iv(zs)·√(B²+R²)) / (1+7·Iv(zs)).
10. **Design force profile (§5.3):** w(z) = cf·qp(ze(z))·b; Fw,dist(z) = cscd·w(z).
11. **Base shear / overturning moment:** V_base = trap(Fw_dist, z);
    M0 = trapMoment(Fw_dist, z, 0).
12. **Tip deflection:** EI_eff derived from n1 and assumed uniform mass/height via
    EI_eff = m·h⁴·(2π·n1/1.875²)²; cumulative-integrate M(z) from Fw_dist, then twice
    trapezoidal-integrate κ = M/EI_eff for the deflected shape; δ_tip = y(h).
13. **Comfort acceleration, Annex B.4:** σ_a(h) = cf·ρ·b·Iv(zs)·vm(zs)²·(R/m1e)·Kx
    (Kx = 1.5 for linear mode shape); â(h) = kp·σ_a(h). Caveat: a real comfort check
    needs a reduced-return-period (~1-year) wind speed, not the 50-year vb reused
    here — flagged INPUT REQUIRED.

### ULS checks (each E_d, R_d, UR, PASS/FAIL, clause)
1. AP-01 — Height applicability H ≤ 200 m (§4.3.2), WARNING if exceeded.
2. AP-02 — d/b within digitized cf,0 range, NOT VERIFIED if extrapolated.
3. AP-03 — Effective slenderness λ within digitized table range, NOT VERIFIED if
   extrapolated.
4. AP-04 — cscd sanity band 0.70–1.30, WARNING if outside.
5. ULS-05 — Base shear vs. lateral-system/foundation capacity — Load Path, always
   NOT VERIFIED (delegated to other modules).
6. ULS-06 — Overturning moment vs. foundation/core overturning capacity — Load
   Path, NOT VERIFIED.
7. ULS-07 — Foundation bearing-pressure increment from overturning — Load Path,
   NOT VERIFIED, delegated to Pile Cap / Bored Pile modules.

### SLS
8. SLS-08 — Along-wind tip drift ratio δ_tip/H vs. ASSUMED H/500 limit (not
   codified in EN 1990/EN 1993 — ENGINEERING JUDGEMENT, INPUT REQUIRED).
9. SLS-09 — Occupant comfort peak acceleration vs. ISO-10137-informed benchmark,
   named "(Informative — ISO 10137, not a codified EN 1991-1-4 limit)".

### Output
Full qp(z)/cf/force profile (table + chart); base shear and overturning moment;
cscd derivation chain; tip deflection and drift ratio; peak/RMS along-wind
acceleration; WindLoadCheck[] table; utilizationMax, governingName, overallStatus
(NOT VERIFIED Load Path rows never silently promoted to PASS); PROFESSIONAL REVIEW
WARNING; INPUT REQUIRED list.

## 3. App implementation
- src/lib/wind-load/types.ts — WindLoadCheckStatus, WindLoadCheck, WindLoadProject,
  WindLoadAnalysisResult, defaultWindLoadProject().
- src/lib/wind-load/calculations.ts — analyzeWindLoad(project) pure function; reuses
  trap/trapMoment/interp/lerp/toRad from src/lib/engine/math.ts; local
  round/safeRatio/passFail/push helpers per house convention (not shared).
- src/components/WindLoadView.tsx — tabbed suite:
  1. Overview & HUD
  2. Site & Terrain
  3. Building Geometry & Dynamics
  4. Velocity Pressure Profile
  5. Force Coefficients & Structural Factor (cscd)
  6. Wind Force / Base Shear / Overturning
  7. Along-Wind Dynamic Response & Comfort
  8. Calculation Report (Mathcad-style, print-to-PDF)
- src/components/wind-load/ui.tsx — shared primitives (StatusBadge, StatCard,
  NumField/CheckField/Field, Section, ChecksTable, Eq), adapted from
  src/components/retaining-wall/ui.tsx.
- src/components/diagrams/WindLoadDiagram.tsx — code-drawn SVG elevation with wind
  arrows + pressure-profile envelope.
- Wiring: src/lib/store.ts (PlatformModule += "wind-load"),
  src/components/ModuleDashboard.tsx (new card), src/routes/index.tsx
  (activeModule === "wind-load").
- Scope: single rectangular prismatic tower; multi-setback/tapered towers and
  across-wind/torsional response noted for future only.

## 4. Verification gates
- npm run build + npm run typecheck (background, both must pass).
- node scripts/browser-smoke.mjs (desktop AND mobile) — visible content, clean console.
- Interactive check: changing terrain category / H / B / D / natural-frequency mode
  updates the pressure profile, cscd, base shear, overturning moment, tip deflection
  and peak acceleration live and consistently.
- npm run preview:restart + smoke on built output.
- No auth/db changes (standalone module, like BasementWall).

## 5. Worked calculation deliverable
Report tab produces the full traceable chain (inputs -> equations -> substitution ->
result -> verification). Implementation summary restates worked numbers for the
default set (H=100 m, B=30 m, D=20 m, terrain II, vb,map=24 m/s): vb≈24 m/s; at
z=H: cr(H)≈1.44, vm(H)≈34.7 m/s, Iv(H)≈0.132, qp(H)≈1.44 kPa; cf≈1.87; Annex B at
zs=60 m: L(zs)≈161 m, B²≈0.56, n1≈0.46 Hz, R²≈0.20, kp≈3.3, cscd≈0.92;
V_base of order 5,000 kN; M0 of order 300,000 kNm; tip deflection ~50 mm
(drift ≈ H/2000); peak acceleration ~0.10 m/s² (vs. 0.15 m/s² comfort benchmark).

## 6. Outstanding inputs (INPUT REQUIRED)
- Confirmed National Annex and its vb,0 map value / cdir / cseason / calt for the
  actual site.
- Confirmed terrain category (site inspection/aerial survey) and orography
  assessment if not flat.
- Actual structural damping ratio from the real lateral system.
- Actual mass distribution and fundamental natural frequency from a real
  structural/modal model, superseding the Annex F/uniform-mass estimates.
- Confirmed occupant-comfort criterion and return period (1-year wind speed, not
  the 50-year ULS vb used here).
- Confirmed along-wind drift limit (H/500 is a placeholder, not codified).
- Across-wind (vortex-shedding) response, torsional response, and
  interference/channelling effects — out of scope.
- Downstream foundation/lateral-system capacity to resist the reported base shear,
  overturning moment and bearing-pressure increment.

## 7. Execution order
1. types + analyzeWindLoad -> 2. diagram -> 3. view + tabs + report tab ->
4. wiring (store/dashboard/routes) -> 5. build/typecheck -> 6. browser smoke
(dev + built) -> 7. summary with worked numbers + INPUT REQUIRED list.
