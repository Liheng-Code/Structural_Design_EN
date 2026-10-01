# Retaining Wall in Building — NotebookLM Guide

Pack for a **top-propped basement retaining wall**. The wall is fixed into the base slab and, once
the ground-floor slab is cast, propped by that slab at the top. It is checked for two stages: the
construction stage (cantilever) and the permanent stage (propped).

## 1. Upload
Create a notebook named "Retaining Wall in Building Design_EN". Add these sources in this order
(NotebookLM → Add sources → Upload):

1. `00-design-rules.md`: the calculation rules from AGENTS.project.md
2. `01-glossary.md`: symbols, units, clauses
3. `02-basement-retaining-wall-design-plan.md`: method and assumptions
4. `03-worked-results-default-inputs.md`: numbers from running the tool, including the FAIL and
   the crack-width defect
5. `04-images-described-other-retaining-types.md`: optional; describes other wall types for
   comparison only

Don't upload the original `.jfif` images. They show other structures, and NotebookLM may blend
their dimensions into answers about this wall.

## 2. Custom chat instructions
Paste this into NotebookLM → *Configure chat* → *Custom*:

```
You are a checking structural engineer reviewing a Eurocode calculation package for a
top-propped basement retaining wall (fixed at the base slab, pinned at the ground-floor slab).
Answer only from the uploaded sources. For every value give the source file and the Eurocode
clause. Always say whether an input is GIVEN, DERIVED, ASSUMED or INPUT REQUIRED, exactly as the
sources label it; all default inputs are ASSUMED. Always say which stage a result belongs to:
Construction (cantilever, Ka, no water) or Permanent (propped, K0, full water). Report checks as
Demand, Resistance, Utilisation, PASS/FAIL/NOT VERIFIED. Treat the SLS crack-width results as NOT
VERIFIED because of the documented unit error. Never use dimensions from the image descriptions
(other structure types) for this wall. If the sources do not contain the answer, say "Not in
sources" rather than supplying typical values. National Annex: UK NA (provisional). Units: kN,
kNm, MPa, mm, per metre run of wall.
```

## 3. Audio Overview
Paste this into the *Customise* box:

```
Audience: a structural engineer reviewing this basement wall before it goes to a checker.
Explain why the wall is checked twice: as an unpropped cantilever during construction (Ka, no
water) and as a propped wall in service (K0, full water table). Explain why the construction
stage governs the base moment (81.6 vs 63.4 kNm/m) even though K0 and water make the permanent
loads bigger. Walk through the force method for the prop reaction (P = δ0/δ11 = 31.9 kN/m) and
why the moment changes sign, so both faces need reinforcement. Then cover what is wrong or open:
the dowel anchorage FAIL (572 mm needed, 320 mm available), the crack-width unit error, and the
INPUT REQUIRED list (water table, exposure, National Annex, waterproofing, raft and slab
capacity). Do not present the default inputs as a real design. About 12 minutes.
```

## 4. Study guide / FAQ / quiz prompts
- **Study guide:** "Build a study guide for the top-propped basement wall organised by stage
  (Construction, Permanent), then by check (base flexure, base shear, span flexure, minimum steel,
  anchorage, crack width, load path), with the EN 1992-1-1 / EN 1997-1 clause for each."
- **FAQ:** "Write an FAQ a checking engineer would ask about this wall: K0 versus Ka, why the
  water table is at the surface in the permanent stage, why slab stiffness is ignored at the
  prop, and what is delegated to the raft and slab designs."
- **Quiz:** "Write 10 questions on the force method (δ0, δ11, P), the moment sign reversal,
  two-face reinforcement and the governing checks, with answers that cite the source and clause."

## 5. Review questions to ask the notebook
1. Which inputs are ASSUMED or INPUT REQUIRED, and which checks depend on each?
2. What is the governing check and its utilisation? What could fix it, and what would need
   re-checking afterwards?
3. Why does the construction stage govern the base moment but the permanent stage govern the
   base shear?
4. How is the prop reaction P derived, and why does EI cancel out for a prismatic wall?
5. Where does the moment change sign in the permanent stage? Which face needs reinforcement
   where?
6. What groundwater assumption does each stage use, and what happens if the water table is
   lower than assumed?
7. Which partial factors (DA1-C1, DA1-C2) apply, and which come from the UK NA?
8. Why are the crack-width results NOT VERIFIED, and what steel stress do the sources estimate
   instead?
9. What does this wall pass to the ground-floor slab and to the raft, and who verifies those
   designs?
10. What is NOT VERIFIED in this package, and why?
11. Where do the sources contradict each other or leave a gap?
12. How does this propped wall differ from the free-standing cantilever wall in image 2?

## 6. Bringing answers back
If you paste a NotebookLM answer back into Claude, it's saved under `imported/` marked
UNVERIFIED, and each value is checked against these sources before anything is used.
