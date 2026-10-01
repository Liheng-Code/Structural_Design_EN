# Worked Results — Default Inputs (Basement Retaining Wall)

> **Project:** Retaining Wall in Building (Top-Propped Basement Wall, Eurocode)
> **Source file:** output of src/lib/basement-wall/calculations.ts (analyzeBasementWall) run with defaultBasementWallProject(), 2026-10-01
> **Status:** PRELIMINARY — demonstration inputs only; overall result FAIL; SLS crack-width results NOT VERIFIED (see section 5)
> **Codes:** EN 1990, EN 1992-1-1, EN 1997-1 (DA1-C1 / DA1-C2)
> **National Annex:** UK NA (provisional)
> **Design situation:** transient (construction stage, unpropped cantilever) and persistent (permanent stage, top-propped)
> **Note:** Engineering calculation material for review. Values marked ASSUMED or
> INPUT REQUIRED are not verified project data.

Every input below is the tool's default and is **ASSUMED**. None is project data. Results show
what the method produces for these inputs. They are not a design for any real building.

## 1. Inputs (all ASSUMED)

| Item | Value |
|---|---|
| Concrete / steel | C30/37 (fck 30 MPa), B500C (fyk 500 MPa) |
| Partial factors | γc 1.5, γs 1.15, αcc 0.85 (UK NA) |
| Exposure / cover | Buried (back) face XC2, c_nom 40 mm; water (front) face XC3, c_nom 50 mm |
| Crack limit | w_max 0.3 mm |
| Design life | 50 years |
| Stem height (base slab top to prop) | 3500 mm |
| Wall thickness (prismatic) | 300 mm |
| Inner (back) face bars | H16 @ 150 mm (As,prov 1340 mm²/m) |
| Outer (front) face bars | H16 @ 150 mm (As,prov 1340 mm²/m) |
| Base slab thickness at wall | 400 mm |
| Base support | raft (wall monolithic with base slab) |
| Base dowels / starters | H16 @ 150 mm |
| Backfill | γ 18 kN/m³, φ' 32°, c' 0, level surface |
| Earth pressure method | Rankine (no wall friction); permanent stage uses K0 (Jaky) |
| Surcharge | Construction 10 kPa; service 10 kPa, ψ2 = 0.3 |
| Groundwater | Construction stage: none (water table depth 50 m). Permanent stage: at ground surface (depth 0), fully saturated backfill |

## 2. Material values derived

| Quantity | Value |
|---|---|
| fcd = αcc·fck/γc | 17.0 MPa |
| fyd = fyk/γs | 434.8 MPa |
| fctm | 2.9 MPa |
| fctk,0.05 | 2.03 MPa |
| Ecm | 32,837 MPa |
| Effective depth, inner face d_inner | 252 mm |
| Effective depth, outer face d_outer | 242 mm |

## 3. Stage forces (ULS, per metre run of wall)

| Quantity | Construction stage (cantilever) | Permanent stage (propped) |
|---|---|---|
| Earth pressure coefficient | Ka (Rankine) = 0.3073 | K0 (Jaky) = 1 − sin φ' = 0.4701 |
| Top prop reaction P | 0 (no prop yet) | 31.9 kN/m |
| Base moment M_Ed (back-face tension, hogging) | **81.6 kNm/m (governs base)** | 63.4 kNm/m |
| Base shear V_Ed | 61.9 kN/m | **105.7 kN/m (governs base shear)** |
| Max span moment (front-face tension, sagging) | none | 29.5 kNm/m at 1488 mm below the prop |

**Why the unpropped construction stage governs the base moment:** K0 (0.470) is higher than Ka
(0.307), and in the permanent stage there is full water pressure too. Even so, the top prop
takes part of the load and reduces the base moment. That is why the construction stage has to be
checked as well as the permanent stage (plan §2, "Do not skip the construction stage").

**Reviewer hand check (indicative, not part of the tool output):**
- Construction-stage base moment: 1.35 × (0.307 × 18 × 3.5³ / 6) + 1.5 × (0.307 × 10 × 3.5² / 2)
  ≈ 53.3 + 28.2 = 81.5 kNm/m. This agrees with 81.6.
- Permanent stage, modelled as a beam fixed at the base and pinned at the top:
  - Triangular load at the base: w0 = 1.35 × (0.470 × (18 − 9.81) × 3.5 + 9.81 × 3.5) ≈ 64.5 kPa.
  - Uniform surcharge load: q = 1.5 × 0.470 × 10 ≈ 7.05 kPa.
  - Base moment: w0·H²/15 + q·H²/8 ≈ 52.7 + 10.8 = 63.5 kNm/m. This agrees with 63.4.
  - Prop reaction: P = w0·H/10 + 3·q·H/8 ≈ 22.6 + 9.3 = 31.9 kN/m. This agrees with 31.9.

## 4. Verification matrix

| ID | Check | Stage | Demand | Resistance | UR | Status | Clause |
|---|---|---|---|---|---|---|---|
| DT-09 | Base dowel / starter-bar anchorage into base slab | Both | 572 mm required | 320 mm available | **1.79** | **FAIL** | EN 1992-1-1 §8.4 (simplified straight length) |
| UL-04 | Base shear, back face | Permanent | 105.7 kN/m | 144.0 kN/m | 0.73 | PASS | EN 1992-1-1 §6.2.2 |
| UL-01 | Base flexure, back face | Construction | As,req 784 mm²/m | As,prov 1340 mm²/m | 0.59 | PASS | EN 1992-1-1 §6.1 |
| UL-03 | Base flexure, back face | Permanent | As,req 609 mm²/m | As,prov 1340 mm²/m | 0.45 | PASS | EN 1992-1-1 §6.1 |
| UL-02 | Base shear, back face | Construction | 61.9 kN/m | 144.0 kN/m | 0.43 | PASS | EN 1992-1-1 §6.2.2 |
| UL-07 | Minimum reinforcement, inner face | Both | 380 mm²/m | 1340 mm²/m | 0.28 | PASS | EN 1992-1-1 §9.2.1.1 |
| UL-08 | Minimum reinforcement, outer face | Permanent | 364 mm²/m | 1340 mm²/m | 0.27 | PASS | EN 1992-1-1 §9.2.1.1 |
| UL-05 | Span flexure, front face | Permanent | As,req 295 mm²/m | As,prov 1340 mm²/m | 0.22 | PASS | EN 1992-1-1 §6.1 |
| UL-06 | Span shear, front face | Permanent | 1.0 kN/m | 141.5 kN/m | 0.01 | PASS | EN 1992-1-1 §6.2.2 |
| SL-13 | Crack width, inner face at base (quasi-permanent) | Permanent | see section 5 | 0.3 mm | — | **NOT VERIFIED** (tool says PASS) | EN 1992-1-1 §7.3.4 |
| SL-14 | Crack width, outer face at span (quasi-permanent) | Permanent | see section 5 | 0.3 mm | — | **NOT VERIFIED** (tool says PASS) | EN 1992-1-1 §7.3.4 |
| DT-10 | Curtailment of hogging steel past contraflexure | Permanent | — | — | — | NOT VERIFIED | EN 1992-1-1 §9.2.1.3 / §8.4 — out of scope |
| LP-11 | Top prop reaction → ground-floor slab / diaphragm | Permanent | 31.9 kN/m | — | — | NOT VERIFIED (demand only) | Load path |
| LP-12 | Base reaction → base slab / raft | Both | M 81.6 kNm/m, V 105.7 kN/m | — | — | NOT VERIFIED (demand only) | Load path |
| DR-15 | Global bearing / sliding of raft | Both | — | — | — | NOT VERIFIED | Delegated to the building's raft / foundation design |
| DR-16 | Waterproofing grade (e.g. BS 8102) | Both | — | — | — | NOT VERIFIED | Specialist item, out of structural scope |

**Overall status: FAIL.** The maximum UR is 1.79, on check DT-09.

**Governing check, DT-09.** H16 dowels need a straight anchorage length of about 572 mm. A 400 mm
base slab gives only 320 mm. Options a designer might consider: bent or hooked starter bars, a
thicker base or a local thickening, or smaller-diameter bars at closer spacing. None of these has
been checked. Each needs its own verification to EN 1992-1-1 §8.4 / §8.5.

## 5. Known defect — SLS crack-width results are not valid

In the tool, the steel stress under the quasi-permanent combination comes out at 0.1 MPa on both
faces, and the crack width at about 0 mm. Both are physically implausible.

The source code computes σs = M·10⁶ / (As · 0.9 · d), which is already in MPa, and then divides
the result by 1000 again (calculations.ts, line 117). So σs is 1000 times too small.

Reviewer estimate (indicative only):
- Quasi-permanent base moment, from the propped-beam formulas above with characteristic loads
  and ψ2·Q: about 41 kNm/m.
- σs ≈ 41 × 10⁶ / (1340 × 0.9 × 252) ≈ 136 MPa.

The crack-width checks SL-13 and SL-14 therefore stay **NOT VERIFIED** until the code is
corrected and re-run.

## 6. Outstanding inputs (INPUT REQUIRED)
- Consequence class; true exposure classes and covers; confirmed National Annex.
- Permanent design water table and the construction-stage water assumption.
- Waterproofing grade and detailing (BS 8102 or equivalent).
- Raft / base slab design: sliding, bearing and settlement.
- Ground-floor slab / diaphragm capacity to take the prop reaction P = 31.9 kN/m (ULS, default inputs).
