# Glossary of Symbols — Retaining Wall in Building (Top-Propped Basement Wall)

> **Project:** Retaining Wall in Building (Top-Propped Basement Wall, Eurocode)
> **Source file:** compiled from docs/Basement Retaining Wall plan, AGENTS.project.md and src/lib/basement-wall
> **Status:** Reference — definitions only
> **Codes:** EN 1990, EN 1992-1-1, EN 1997-1
> **National Annex:** UK NA (provisional)
> **Design situation:** transient (construction) and persistent (permanent)
> **Note:** Engineering calculation material for review. Values marked ASSUMED or
> INPUT REQUIRED are not verified project data.

| Symbol | Meaning | Unit | Clause / source |
|---|---|---|---|
| H | Stem height, top of base slab to underside of ground-floor slab (prop level) | mm | Plan §2 default inputs |
| h, t_w | Wall thickness (prismatic, constant) | mm | Plan §2 |
| d_inner, d_outer | Effective depth to back-face / front-face reinforcement | mm | EN 1992-1-1 §6.1 |
| c_min | Minimum cover for bond and durability | mm | EN 1992-1-1 §4.4.1.2 |
| Δc_dev | Allowance for deviation in cover | mm | EN 1992-1-1 §4.4.1.3 |
| c_nom | Nominal cover = c_min + Δc_dev | mm | EN 1992-1-1 §4.4.1.1 |
| fck | Characteristic cylinder strength of concrete | MPa | EN 1992-1-1 Table 3.1 |
| fcd | Design compressive strength = αcc·fck/γc | MPa | EN 1992-1-1 §3.1.6 |
| αcc | Long-term coefficient on compressive strength (0.85 UK NA) | – | EN 1992-1-1 §3.1.6, UK NA |
| fctm, fctk,0.05 | Mean and 5 % characteristic tensile strength of concrete | MPa | EN 1992-1-1 Table 3.1 |
| Ecm | Secant modulus of elasticity of concrete | MPa | EN 1992-1-1 Table 3.1 |
| fyk, fyd | Characteristic and design yield strength of reinforcement (fyd = fyk/γs) | MPa | EN 1992-1-1 §3.2 |
| γc, γs | Partial factors for concrete (1.5) and steel (1.15) | – | EN 1992-1-1 §2.4.2.4 |
| γG, γQ | Partial factors on permanent and variable actions (DA1-C1: 1.35 / 1.5; DA1-C2: 1.0 / 1.3) | – | EN 1990 Annex A1; EN 1997-1 Annex A |
| γφ' | Partial factor on tan φ' (DA1-C2: 1.25) | – | EN 1997-1 Annex A |
| ψ2 | Quasi-permanent combination factor (0.3 on service surcharge) | – | EN 1990 Table A1.1 |
| γ | Unit weight of backfill | kN/m³ | Plan default 18 |
| γ_w | Unit weight of water (9.81) | kN/m³ | calculations.ts |
| φ' | Effective angle of shearing resistance of backfill | ° | Plan default 32 |
| c' | Effective cohesion of backfill (0 for granular fill) | kPa | Plan default |
| δ | Wall friction angle (0 = Rankine) | ° | EN 1997-1 §9.5.1 |
| K_a | Active earth pressure coefficient (Rankine or Coulomb) | – | EN 1997-1 §9.5, Annex C |
| K0 | At-rest earth pressure coefficient, Jaky: K0 = 1 − sin φ' | – | EN 1997-1 §9.5.2 |
| σ_h | Horizontal earth pressure = K·σ'_v (+ water + surcharge) | kPa | EN 1997-1 §9.5 |
| P_a | Resultant active thrust per metre | kN/m | EN 1997-1 §9.5 |
| P | Horizontal prop reaction at the top (ground-floor slab) | kN/m | Plan §2 force method |
| M0(z), V0(z) | Moment and shear in the released cantilever (prop removed) | kNm/m, kN/m | Plan §2 force method |
| δ0 | Top deflection of the released cantilever under the real load | mm | Plan §2 |
| δ11 | Top deflection under a unit tip load = H³/(3·EI) | mm/kN | Plan §2 |
| M_Ed, V_Ed | Design bending moment and shear force | kNm/m, kN/m | EN 1990 §6.4 |
| As,req, As,prov, As,min | Reinforcement area required, provided, minimum | mm²/m | EN 1992-1-1 §6.1, §9.2.1.1 |
| V_Rd,c | Shear resistance without shear reinforcement | kN/m | EN 1992-1-1 §6.2.2 |
| l_bd | Design anchorage length of a bar | mm | EN 1992-1-1 §8.4.4 |
| σs (σ_s,qp) | Steel stress under quasi-permanent loads | MPa | EN 1992-1-1 §7.3.4 |
| w_k | Calculated crack width | mm | EN 1992-1-1 §7.3.4 |
| w_max | Crack-width limit (0.3 mm default) | mm | EN 1992-1-1 Table 7.1N, UK NA |
| E_d, R_d | Design effect of actions and design resistance | various | EN 1990 §6.4.2 |
| UR | Utilisation ratio = E_d / R_d (≤ 1.0 passes) | – | AGENTS.project.md §20 Step 8 |
| UR_max | Highest UR over all checks; names the governing check | – | AGENTS.project.md §20 |
| E_sliding, R_sliding | Sliding action and resistance (strip-footing option only; raft case delegated) | kN/m | EN 1997-1 §6.5.3 |
| DA1-C1, DA1-C2 | Design Approach 1, combinations 1 and 2 | – | EN 1997-1 §2.4.7.3.4 |
| XC2, XC3 | Exposure classes (wet rarely dry, buried; moderate humidity) | – | EN 1992-1-1 Table 4.1 |
