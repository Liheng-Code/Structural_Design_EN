# PROJECT: PRECAST RC U-SHAPE SHEET PILE & FLOOD EMBANKMENT DESIGN CALCULATOR

## 1. ROLE

You are a senior structural and geotechnical engineering software developer.

Build a professional engineering calculation application in a SINGLE STANDALONE HTML FILE.

The application shall perform preliminary and detailed engineering calculations for:

- Precast reinforced-concrete sheet piles
- Double sheet-pile U-shaped retaining systems
- Flood protection embankments
- Temporary construction access roads
- Heavy traffic loading behind retaining walls
- Tie-rod supported sheet-pile systems
- RC capping beams
- Granular fill cores
- Water-retaining / flood-protection conditions
- Temporary and permanent construction stages

The calculation philosophy shall follow Eurocode principles where applicable:

- EN 1990 — Basis of Structural Design
- EN 1991 — Actions on Structures
- EN 1992 — Design of Concrete Structures
- EN 1997 — Geotechnical Design
- EN 1991-2 where bridge/road traffic models are specifically applicable
- EN 1998 only when seismic design is selected

IMPORTANT:

Do NOT invent Eurocode clause numbers.

If an exact clause is not confidently known, write:

"Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."

The application is a DESIGN CALCULATION TOOL, not a substitute for geotechnical investigation or final engineering approval.

Every assumed parameter must be clearly identified as:

- USER INPUT
- ASSUMPTION
- DERIVED VALUE
- CODE PARAMETER
- CALCULATED RESULT

Never silently assume missing engineering information.

If critical information is missing, show:

"INPUT REQUIRED"

rather than inventing a value.


# 2. PRIMARY DESIGN CONCEPT

The default system shall represent the following concept:

             HEAVY TRAFFIC ROAD
        ┌───────────────────────────┐
        │       8.00 m ROAD         │
        └───────────────────────────┘
              RC CAPPING BEAM
        ╔═══════════════════════════╗
        ║                           ║
        ║   PRECAST RC SHEET PILE   ║
        ║                           ║
        ║     GRANULAR FILL         ║
        ║                           ║
        ║   ─── TIE ROD ───         ║
        ║                           ║
        ║   ─── TIE ROD ───         ║
        ║                           ║
        ║                           ║
        ║   PRECAST RC SHEET PILE   ║
        ╚═══════════════════════════╝
               EMBEDMENT
          BELOW RIVERBED / GROUND


The system shall allow either:

A. Single sheet-pile wall
B. Single anchored sheet-pile wall
C. Double sheet-pile wall
D. Double sheet-pile + granular fill core
E. U-shaped sheet-pile system
F. U-shaped sheet-pile + RC capping beam
G. U-shaped sheet-pile + one tie level
H. U-shaped sheet-pile + two tie levels
I. Custom configuration


# 3. DEFAULT PROJECT PARAMETERS

Preload the application with the current concept shown in the supplied design sketches.

These values are DEFAULTS ONLY and must remain editable.

## Geometry

Project:

"Option 3 — Direct Precast RC Sheet Pile & Capping Beam Embankment Dam"

Retaining / flood protection height:

H = 6.00 m

Sheet pile embedment:

D = 6.00 m

Total nominal sheet pile length:

L = H + D = 12.00 m

Roadway width:

B_road = 8.00 m

Total structural out-to-out width:

B_total = 8.70 m

Precast RC sheet pile thickness:

t = 350 mm

RC capping beam:

600 mm × 600 mm

Sheet pile concrete:

fcu = 40 MPa

Tie rod:

Ø40 mm

Upper tie level:

y = +5.10 m

Lower tie level:

y = +3.20 m to +3.50 m

Allow user to select:

- 1 tie level
- 2 tie levels
- 3 tie levels
- custom number of tie levels

Allow all tie elevations to be edited.


# 4. WATER LEVEL INPUT

The application shall support independent water levels on both sides.

## Dry season

Upstream water:

HWL = +0.00 m

Downstream water:

+0.00 m

## Rain / flood season

Upstream water:

HWL_up = +5.20 m

Downstream water:

HWL_down = +4.20 m

Therefore:

Δh = HWL_up - HWL_down

Calculate hydrostatic pressure independently on each side.

Do NOT simply apply the full upstream water pressure to the wall.

Calculate:

p_w(z) = γ_w h_w(z)

and net water pressure:

Δp_w(z) = p_w,up(z) - p_w,down(z)

Show the pressure diagram graphically.


# 5. ROADWAY PARAMETERS

Default:

Road width = 8.00 m

Asphalt concrete thickness:

t_asphalt = 0.50 m

Heavy construction traffic:

YES

Allow user to define:

- Uniform surcharge q
- Vehicle axle load
- Wheel load
- Number of axles
- Axle spacing
- Wheel spacing
- Vehicle footprint
- Dynamic amplification factor
- Traffic load distribution width
- Distance from wall
- Construction plant load
- Crane load
- Stockpile load

The user shall be able to choose:

1. Uniform surcharge
2. Vehicle surcharge
3. Equivalent strip load
4. User-defined load
5. Combined loading


# 6. SOIL INPUT MODULE

Create a complete soil-layer input table.

Each soil layer shall include:

- Layer name
- Top elevation
- Bottom elevation
- Soil description
- γ
- γ_sat
- γ_sub
- φ'
- c'
- cu
- E
- ν
- k
- OCR
- SPT N
- Groundwater elevation
- Drainage condition
- Soil type

Example:

| Layer | Description | γ | γsat | φ' | c' |
|------|-------------|---|------|----|----|
| 1 | Compacted granular fill | 19 | 21 | 34° | 0 |
| 2 | Native alluvial soil | 18 | 20 | 30° | 0 |
| 3 | Soft clay | 17 | 19 | 24° | 10 kPa |

All values editable.

Allow unlimited soil layers.

Allow user to add/remove/reorder layers.


# 7. BACKFILL / CORE FILL

The central U-shaped core shall be treated separately from native soil.

Default:

Compacted granular fill

Relative compaction:

97% MDD

Allow user input:

- γ
- γsat
- φ'
- c'
- permeability
- compaction
- layer thickness
- drainage condition

The system shall check whether the granular core contributes stabilizing weight.

Clearly distinguish:

ACTIVE PRESSURE

PASSIVE PRESSURE

AT-REST PRESSURE

and

SELF-WEIGHT / STABILIZING WEIGHT.


# 8. EARTH PRESSURE CALCULATION

Provide selectable earth pressure methods:

A. Rankine
B. Coulomb
C. User-defined Ka
D. User-defined Kp
E. At-rest K0

Default method:

Rankine for preliminary calculation.

For horizontal backfill:

Ka = tan²(45° - φ'/2)

Kp = tan²(45° + φ'/2)

K0 = 1 - sin φ'

For each soil layer calculate:

σ'h = Ka σ'v

or selected method.

Show:

- Vertical effective stress
- Total vertical stress
- Pore water pressure
- Effective vertical stress
- Active earth pressure
- Passive earth pressure

Do not combine total and effective stress incorrectly.

Water pressure shall be calculated separately.


# 9. EARTH PRESSURE DIAGRAM

Create a graphical pressure diagram showing:

- Active soil pressure
- Passive soil pressure
- Water pressure
- Surcharge pressure
- Net pressure
- Resultant force
- Resultant location

The diagram shall update automatically when the user changes:

- Soil
- Water
- Wall depth
- Road surcharge
- Tie level
- Wall geometry


# 10. LOAD CASES

Automatically generate design load cases.

Minimum:

LC-01:
Dry season / no water

LC-02:
Rain season / upstream flood

LC-03:
Rain season / downstream flood

LC-04:
Maximum differential water level

LC-05:
Heavy traffic + flood

LC-06:
Heavy traffic + dry season

LC-07:
Construction stage

LC-08:
One-sided excavation / temporary stage

LC-09:
Rapid drawdown

LC-10:
Tie-rod failure / accidental robustness case

Allow user to add custom load cases.


# 11. DESIGN SITUATIONS

Allow selection:

- Permanent
- Temporary
- Construction
- Flood
- Extreme
- Accidental
- Seismic

Each design situation shall have:

- Permanent actions
- Variable actions
- Water actions
- Soil actions
- Construction actions
- Accidental actions


# 12. U-SHAPE SYSTEM STRUCTURAL MODEL

For the double-wall system, calculate each sheet pile line independently.

LEFT WALL:

External soil/water pressure
+
Internal core pressure

RIGHT WALL:

External soil/water pressure
+
Internal core pressure

The application shall calculate:

Net lateral pressure

p_net(z)

for each wall.

The central granular fill shall NOT automatically be assumed to act as a rigid structural diaphragm.

Unless the user explicitly selects otherwise, treat each wall as an independent embedded wall connected through:

- Tie rods
- Capping beam
- Granular fill interaction

The capping beam connection shall be separately checked.


# 13. FREE BODY DIAGRAM

Create an interactive free-body diagram.

The FBD shall show:

- Active earth pressure
- Passive earth pressure
- Water pressure
- Traffic surcharge
- Self-weight
- Tie rod forces
- Reaction forces
- Embedded soil resistance
- Resultant force
- Resultant moment
- Ground reaction

Use arrows with labels.

Example:

       WATER PRESSURE
       ←←←←←←←←←

       SOIL PRESSURE
       ←←←←←←←←←

       ┌──────────┐
       │ SHEET    │
       │ PILE     │
       │          │
       │ → TIE    │
       │          │
       │ → TIE    │
       │          │
       │          │
       └──────────┘
          ↑↑↑
      PASSIVE RESISTANCE

The FBD must update dynamically according to the selected design.


# 14. SHEET PILE STRUCTURAL MODEL

Allow the user to select:

A. Simplified equivalent cantilever model
B. Anchored beam model
C. Multi-anchor beam model
D. Beam-on-elastic-foundation model
E. User-defined bending moment/shear diagram

For preliminary design:

Use the selected earth-pressure distribution to calculate:

V(z)

M(z)

deflection:

δ(z)

Show:

Maximum shear:

VEd,max

Maximum moment:

MEd,max

Maximum deflection:

δmax


# 15. EMBEDMENT DEPTH DESIGN

The user shall be able to choose:

### OPTION A — USER SELECTS EMBEDMENT

D = user input

The application calculates all checks.

### OPTION B — AUTO SIZE EMBEDMENT

User provides:

Minimum D
Maximum D
Increment

Example:

Dmin = 3.0 m
Dmax = 10.0 m
Increment = 0.25 m

The program iterates:

D = 3.00
3.25
3.50
...
10.00 m

For each depth calculate:

- Passive resistance
- Sliding
- Overturning
- Bending
- Deflection
- Tie force
- Bearing
- Overall stability

Then generate a table:

| D | MEd | VEd | Tie | FS / η | Deflection | Status |
|---|---:|---:|---:|---:|---:|---|
| 4.0 | ... | ... | ... | ... | ... | FAIL |
| 5.0 | ... | ... | ... | ... | ... | FAIL |
| 6.0 | ... | ... | ... | ... | ... | PASS |
| 7.0 | ... | ... | ... | ... | ... | PASS |

DO NOT select a "best" engineering solution automatically.

Instead show:

"Solutions satisfying the selected criteria."


# 16. SHEET PILE SECTION INPUT

Allow custom section input.

User can define:

Width:
b

Thickness:
t

Overall depth:
h

Moment of inertia:
I

Section modulus:
W

Area:
A

Concrete cover:
c_nom

Effective depth:
d

Reinforcement:

As_top

As_bottom

As_vertical

As_distribution

Allow either:

### METHOD 1

User enters section properties.

### METHOD 2

Application calculates section properties.

### METHOD 3

Select from section library.

Example library:

- 300 × 150 mm
- 350 × 200 mm
- 350 × 250 mm
- 350 × 300 mm
- Custom


# 17. PRECAST RC SHEET PILE DESIGN

Check:

1. Flexure
2. Shear
3. Axial force
4. Combined N-M
5. Crack width
6. Deflection
7. Reinforcement
8. Concrete stress
9. Durability
10. Handling / lifting condition

For bending:

MEd ≤ MRd

Utilization:

η_M = MEd / MRd

For shear:

VEd ≤ VRd,c

Utilization:

η_V = VEd / VRd,c

Combined:

η_total = maximum relevant utilization ratio.

Use Eurocode 2 design methodology.

Do not use a simplified beam formula when a more appropriate structural model has been selected.


# 18. TIE ROD DESIGN

Default:

Ø40 mm

Allow:

Ø20
Ø25
Ø32
Ø36
Ø40
Ø45
Ø50
Custom

Inputs:

- Steel grade
- Nominal diameter
- Thread diameter
- Net tensile area
- Yield strength
- Ultimate strength
- Corrosion allowance
- Thread efficiency
- Connection efficiency

Calculate:

Tie force:

T_Ed

Resistance:

T_Rd

Utilization:

η_T = T_Ed / T_Rd

Also check:

- Plate washer
- Connection plate
- Local concrete bearing
- Anchorage zone
- Tie rod spacing
- Tie rod inclination
- Corrosion allowance


# 19. TIE ROD SPACING

Allow:

Tie spacing = user input

Example:

s = 1.50 m

Calculate force per tie based on tributary wall length.

If:

p(z) = lateral pressure

then determine:

T_Ed

from the tributary pressure associated with the tie level.

Show the calculation graphically.

Example:

Lateral pressure
        ↓
████████████████
        ↓
───────────────  Tie level
       ← T_Ed →

The application must clearly explain where the tie force comes from.


# 20. RC CAPPING BEAM

Default:

600 × 600 mm

Allow user to change:

b
h
cover
concrete grade
reinforcement

Check:

- Flexure
- Shear
- Axial force
- Local bearing
- Tie connection
- Sheet pile connection
- Crack width
- Reinforcement ratio

Show:

MEd
MRd

VEd
VRd

Utilization.


# 21. GLOBAL STABILITY

Check:

1. Sliding
2. Overturning
3. Bearing
4. Overall stability
5. Deep-seated failure
6. Uplift
7. Hydraulic instability
8. Piping
9. Heave
10. Scour where applicable

For each check show:

Demand
Resistance
Utilization
Status

Do NOT use arbitrary factors of safety if the selected Eurocode Design Approach requires partial-factor verification.

Allow the user to select:

Design Approach 1
Design Approach 2
Design Approach 3

where appropriate to the adopted National Annex.

Clearly identify the selected approach.


# 22. HYDRAULIC CHECKS

Because this structure is a flood protection system, include:

### Hydrostatic pressure

p = γw h

### Differential water pressure

Δp = γw Δh

### Uplift

U = γw h A

### Hydraulic gradient

i = Δh / L

### Critical gradient

icr = (Gs - 1)/(1 + e)

### Piping / boiling

Check:

i < allowable hydraulic gradient

The application shall clearly identify whether the hydraulic check is:

- simplified screening
- detailed geotechnical check
- requires specialist seepage analysis


# 23. RAPID DRAWDOWN

Include a selectable rapid-drawdown condition.

Example:

Flood water:

+5.20 m

Internal water:

+0.00 m

Calculate:

- external water pressure
- internal soil pressure
- transient imbalance
- effective stress condition

Clearly explain why rapid drawdown can produce a critical loading condition.


# 24. FLOOD LOAD CASE

For the current concept:

Upstream:

+5.20 m

Downstream:

+4.20 m

Ground / riverbed:

+0.00 m

Therefore:

H_up = 5.20 m

H_down = 4.20 m

Calculate:

p_up,max

p_down,max

Δp_max

Resultant:

F_w

Location:

z_F


# 25. TRAFFIC SURCHARGE

Allow user to choose:

Uniform surcharge:

q = user input

or

Vehicle load.

For preliminary screening:

q_eq = user-defined equivalent surcharge.

Do NOT claim that a generic q value represents an actual heavy vehicle unless the user provides the vehicle model or the applicable traffic load model.

Show:

Road load
↓
Vertical stress increase
↓
Lateral earth pressure increase
↓
Wall bending
↓
Tie force


# 26. LOAD COMBINATION ENGINE

Create an automatic load combination engine.

Each combination shall contain:

G
Q
Water
Earth
Traffic
Construction
Accidental

Display:

Characteristic value
Partial factor
Design value

Example:

E_d = Σ γ_G G_k + Σ γ_Q Q_k

Do not hard-code one universal set of γ values.

Allow the user to select the adopted National Annex / design approach.

If factors are user-defined, display:

"USER-DEFINED PARTIAL FACTORS"


# 27. UTILIZATION CALCULATION

Every engineering check must produce:

Demand

Resistance

Utilization

η = Demand / Resistance

Interpretation:

η ≤ 1.00 → PASS

η > 1.00 → FAIL

Use:

0–0.50
0.50–0.75
0.75–0.90
0.90–1.00
>1.00

but DO NOT describe a utilization as "safe" merely because it is low.

Use:

PASS
WARNING
FAIL
INPUT REQUIRED

The status thresholds shall be configurable.


# 28. UTILIZATION SUMMARY TABLE

Create:

| Check | Demand | Resistance | Utilization | Status |
|---|---:|---:|---:|---|
| Sheet pile bending | MEd | MRd | 0.78 | PASS |
| Sheet pile shear | VEd | VRd | 0.42 | PASS |
| Tie rod | TEd | TRd | 0.64 | PASS |
| Sliding | Ed | Rd | 0.82 | PASS |
| Overturning | MEd | MRd | 0.71 | PASS |
| Bearing | σEd | σRd | 0.68 | PASS |
| Deflection | δEd | δlim | 0.84 | PASS |
| Piping | iEd | icr | 0.74 | PASS |

Values must be generated dynamically.


# 29. UTILIZATION VISUALIZATION

Create horizontal utilization bars.

Example:

SHEET PILE FLEXURE

Demand / Capacity

██████████████░░░░░░ 72%

Tie Rod

████████████████░░░░ 81%

Deflection

██████████████████░░ 90%

Use a vertical marker at:

100%

Do not use color as the only indicator.

Always show numerical utilization and PASS/FAIL text.


# 30. ENGINEERING EXPLANATION

Every result must have an explanation.

Example:

### Sheet pile bending

"The lateral earth pressure and differential water pressure generate a distributed load on the sheet pile. The resulting bending moment is compared with the design bending resistance of the reinforced-concrete section."

Then show the equation.

Then show substitution.

Then show result.

Then show utilization.


# 31. MATHCAD-STYLE EQUATION FORMAT

Use KaTeX.

DO NOT render engineering equations as plain text.

Use:

$$
K_a =
\tan^2
\left(
45^\circ -
\frac{\varphi'}{2}
\right)
$$

Then:

$$
\sigma'_{v}(z)
=
\sum_i
\gamma'_i h_i
$$

Then:

$$
\sigma'_{h,a}
=
K_a\sigma'_v
$$

Then:

$$
p_w
=
\gamma_w h_w
$$

Then:

$$
p_{net}
=
p_{soil}
+
p_{water}
+
p_{surcharge}
$$

Then:

$$
M_{Ed}
=
\int_0^L
p(z)
\cdot
z
\,dz
$$

For each equation provide:

Equation number
Variable definitions
Units
Substitution
Result


# 32. MATHCAD-STYLE CALCULATION BLOCK

Each calculation should visually resemble a professional Mathcad calculation sheet.

Example:

────────────────────────────────────────────

EARTH PRESSURE

Given:

φ' = 34.0°

γ = 19.0 kN/m³

H = 6.00 m

Calculate:

Ka = tan²(45° − φ'/2)

Ka = 0.283

Maximum active pressure:

p_a,max = Ka γ H

p_a,max = 0.283 × 19.0 × 6.00

p_a,max = 32.26 kPa

Resultant:

P_a = ½ Ka γ H²

P_a = 96.8 kN/m

Location:

z = H/3

z = 2.00 m

────────────────────────────────────────────

This style must be used throughout the report.


# 33. VARIABLE TABLE

Create a professional variable table.

| Symbol | Description | Value | Unit | Source |
|---|---|---:|---|---|
| H | Retaining height | 6.00 | m | User |
| D | Embedment | 6.00 | m | User |
| γ | Soil unit weight | 19.0 | kN/m³ | User |
| φ' | Effective friction angle | 34 | ° | User |
| γw | Water unit weight | 9.81 | kN/m³ | Code/Assumption |
| q | Traffic surcharge | — | kPa | User |

Allow clicking a variable to highlight every calculation where it is used.


# 34. DESIGN INPUT INTERFACE

Create a left-side navigation panel.

Sections:

1. Project
2. Design Type
3. Geometry
4. Soil
5. Groundwater
6. Flood
7. Traffic
8. Sheet Pile
9. Tie Rod
10. Capping Beam
11. Materials
12. Load Cases
13. Design Approach
14. Limits
15. Results
16. Report

Each input must have:

- Label
- Value
- Unit
- Tooltip
- Default value
- Validation
- Source


# 35. DESIGN TYPE SELECTOR

At the beginning:

DESIGN TYPE

Dropdown:

[ Single Cantilever Sheet Pile ]

[ Single Anchored Sheet Pile ]

[ Double Sheet Pile ]

[ U-Shape Sheet Pile + Granular Core ]

[ U-Shape Sheet Pile + Tie Rods ]

[ U-Shape Flood Embankment ]

[ Custom ]

When the user changes design type:

- show relevant inputs
- hide irrelevant inputs
- change calculation model
- change FBD
- change report sections

Do not force every design type to use the same formulas.


# 36. GEOMETRY EDITOR

Create an interactive cross-section.

User can modify:

- Wall height
- Embedment
- Wall spacing
- Road width
- Road elevation
- Capping beam
- Tie elevations
- Tie spacing
- Flood level
- Riverbed elevation

The SVG cross-section must update in real time.


# 37. INTERACTIVE SVG DRAWING

Use SVG for engineering diagrams.

Show:

- Ground
- River
- Water
- Sheet piles
- Fill
- Road
- Asphalt
- Vehicles
- Capping beam
- Tie rods
- Dimension lines
- Pressure arrows
- Water level
- Embedment depth

Do NOT use a static image as the primary engineering diagram.

Generate the diagram from calculation variables.


# 38. PRESSURE DIAGRAM

Generate an SVG pressure diagram.

Example:

Pressure →
0        20        40        60 kPa

│\
│ \
│  \
│   \
│    \
│     \
│      \
│       \
└────────────

Show separately:

Active soil
Passive soil
Water
Surcharge
Net pressure


# 39. FREE BODY DIAGRAM EXPLANATION

For every major design check provide:

### WHAT LOADS ACT?

### WHERE DO THEY ACT?

### WHAT RESISTS THEM?

### WHAT IS THE RESULTING DEMAND?

### WHAT IS THE RESISTANCE?

### WHAT IS THE UTILIZATION?

Example:

Flood water produces:

F_water

acting at:

H/2

The resultant moment is:

M_water = F_water × H/2

This combines with:

- soil pressure
- surcharge
- traffic loading

and is resisted by:

- passive soil resistance
- tie rods
- embedded sheet pile
- structural capacity

Display this visually.


# 40. CONSTRUCTION STAGES

This is extremely important.

Allow the user to define:

Stage 1:
Existing ground

Stage 2:
Sheet pile installation

Stage 3:
Excavation / river preparation

Stage 4:
Granular fill placement

Stage 5:
Tie installation

Stage 6:
Capping beam

Stage 7:
Road construction

Stage 8:
Construction traffic

Stage 9:
Flood season

Stage 10:
Permanent operation

Each stage shall have its own load condition.

The program must check the critical stage rather than only the final condition.


# 41. SHEET PILE INSTALLATION CHECK

Include a preliminary installation check.

Allow user input:

- Driving method
- Vibratory
- Hydraulic press-in
- Crane lifting
- Temporary support

Check:

- lifting stress
- handling stress
- installation stress
- temporary unsupported length

Clearly identify if installation requires specialist contractor verification.


# 42. PRECAST SHEET PILE HANDLING

Include optional checks for:

- Lifting points
- Transport
- Storage
- Temporary support
- Lifting orientation

The application shall NOT assume that the final installed reinforcement is automatically adequate for lifting.


# 43. DURABILITY

Allow:

Exposure class
Concrete strength
Nominal cover
Crack width limit
Service life
Environmental exposure

Show:

Concrete cover

c_nom

Effective cover

d

Crack width

w_k

Clearly identify durability assumptions.


# 44. SERVICEABILITY

Check:

- wall deflection
- capping beam deflection
- crack width
- tie displacement
- settlement

Allow user-defined limits.

Example:

δ_limit = user input

Then:

η_δ = δ_Ed / δ_limit


# 45. SETTLEMENT

Allow optional settlement check.

Inputs:

- soil compressibility
- layer thickness
- E
- mv
- Cc
- Cr
- e0
- consolidation parameters

Output:

Immediate settlement

Consolidation settlement

Differential settlement

If insufficient information:

"Settlement analysis requires geotechnical parameters."


# 46. OVERALL STABILITY

The application must distinguish:

LOCAL STRUCTURAL CAPACITY

from

GEOTECHNICAL STABILITY

from

HYDRAULIC STABILITY

from

GLOBAL / OVERALL STABILITY

Do not allow a PASS in sheet-pile bending to imply that the entire flood protection structure is safe.


# 47. ENGINEERING WARNING SYSTEM

Automatically detect:

- missing soil data
- missing groundwater
- unknown traffic load
- excessive wall deflection
- insufficient embedment
- tie rod overstress
- insufficient concrete capacity
- excessive crack width
- hydraulic gradient issue
- rapid drawdown
- unsupported construction stage
- missing geotechnical investigation
- missing National Annex
- user-defined assumptions

Display:

⚠ INPUT REQUIRED

⚠ ENGINEERING ASSUMPTION

⚠ SPECIALIST CHECK REQUIRED

❌ FAIL


# 48. DESIGN OPTIMIZATION / PARAMETRIC STUDY

Allow the user to run a parametric study.

Example:

Variable:

Sheet pile embedment

Range:

4.00–10.00 m

Step:

0.25 m

or:

Sheet pile thickness

250–500 mm

or:

Tie rod diameter

25–50 mm

or:

Wall spacing

6.0–10.0 m

Produce a table of all combinations.

Do NOT automatically claim that one option is the "best".

Instead provide:

"Feasible combinations based on the selected criteria."


# 49. SENSITIVITY ANALYSIS

Provide sensitivity analysis for:

φ'
γ
γsat
water level
traffic surcharge
embedment
wall spacing
tie level
tie diameter

Example:

Flood level +0.50 m

→ MEd increases

→ Tie force increases

→ Required embedment changes

Show this relationship graphically.


# 50. REPORT STRUCTURE

Generate a professional engineering calculation report.

REPORT COVER:

PROJECT

PRECAST RC U-SHAPE SHEET PILE FLOOD PROTECTION & CONSTRUCTION ACCESS ROAD

Option 3

Calculation Report

Prepared by:
[User]

Date:
[Automatic]

Revision:
[User]

Status:
PRELIMINARY DESIGN


PAGE 2

DESIGN BASIS

- Project description
- Design objective
- Structural concept
- Design codes
- Design assumptions
- Limitations


PAGE 3

DESIGN INPUT

- Geometry
- Soil
- Water
- Traffic
- Materials
- Tie rods


PAGE 4

DESIGN CROSS SECTION

Large SVG engineering drawing.


PAGE 5

LOAD CASES

List all design situations.


PAGE 6+

GEOTECHNICAL CALCULATIONS

Earth pressure
Water pressure
Surcharge
Passive resistance


NEXT

STRUCTURAL CALCULATIONS

Sheet pile
Tie rods
Capping beam


NEXT

STABILITY

Sliding
Overturning
Bearing
Overall stability
Hydraulic stability


NEXT

SERVICEABILITY

Deflection
Crack width
Settlement


FINAL

UTILIZATION SUMMARY


FINAL PAGE

ENGINEERING CONCLUSION

The conclusion shall be automatically generated from the actual calculation results.

Do not write:

"Safe"

unless every required check is completed and passes.

Instead use:

"Based on the selected design assumptions and completed checks, the calculated utilization ratios are..."

Then identify:

PASS
WARNING
FAIL
INPUT REQUIRED


# 51. HTML TECHNOLOGY

Use:

HTML5
CSS3
JavaScript ES6+

Use:

KaTeX for equations.

Recommended:

https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css

https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js

Use SVG for engineering drawings.

Use Chart.js for charts if required.

The final application must work by opening the HTML file directly in a browser.

Do not require a backend.

Do not require Node.js.

Do not require a database.

Store the current project in browser localStorage.


# 52. IMPORT / EXPORT

Provide:

SAVE PROJECT

LOAD PROJECT

EXPORT JSON

IMPORT JSON

EXPORT HTML REPORT

PRINT REPORT

PRINT TO PDF

Export all inputs and results.


# 53. UNITS

Primary units:

Force:
kN

Moment:
kNm

Stress:
MPa / kPa

Length:
mm / m

Unit weight:
kN/m³

Pressure:
kPa

Reinforcement:
mm²

Tie diameter:
mm

Allow unit display to be changed.


# 54. INPUT VALIDATION

Example:

If:

D < 0

show:

"Embedment depth must be greater than zero."

If:

φ' < 0 or φ' > 50°

show warning.

If:

γ ≤ 0

show error.

If:

HWL > wall top

show:

"Water level exceeds wall top elevation."


# 55. CALCULATION TRACEABILITY

Every result must show its calculation chain.

Example:

MEd

↓ depends on

p_net

↓ depends on

p_soil + p_water + p_surcharge

↓ depends on

φ'
γ
H
HWL
q

Clicking MEd should highlight the relevant inputs.


# 56. EQUATION NUMBERING

Number equations:

(1)
(2)
(3)
...

Example:

$$
K_a =
\tan^2
\left(
45^\circ -
\frac{\varphi'}{2}
\right)
\tag{1}
$$

The report must automatically maintain equation numbering.


# 57. ENGINEERING DATA MODEL

Use a central JavaScript object:

project = {

  projectName,

  designType,

  geometry: {},

  soilLayers: [],

  water: {},

  traffic: {},

  sheetPile: {},

  tieRods: [],

  cappingBeam: {},

  materials: {},

  loadCases: [],

  designApproach: {},

  limits: {}

}

All calculations must read from this object.

Do not duplicate engineering inputs throughout the code.


# 58. CALCULATION ENGINE

Separate:

INPUTS

↓

LOAD GENERATION

↓

EARTH PRESSURE

↓

WATER PRESSURE

↓

LOAD COMBINATIONS

↓

STRUCTURAL ANALYSIS

↓

GEOTECHNICAL CHECK

↓

HYDRAULIC CHECK

↓

STRUCTURAL CHECK

↓

SERVICEABILITY

↓

UTILIZATION

↓

REPORT


Never mix UI code with calculation formulas.


# 59. CALCULATION RESULT OBJECT

Each check shall return:

{
    name: "...",
    demand: ...,
    resistance: ...,
    utilization: ...,
    unit: "...",
    status: "...",
    equation: "...",
    explanation: "...",
    assumptions: [...]
}


# 60. RESULT DASHBOARD

At the top of Results:

OVERALL DESIGN STATUS

Then cards:

SHEET PILE FLEXURE
η = 0.XX

SHEET PILE SHEAR
η = 0.XX

TIE ROD
η = 0.XX

CAPPING BEAM
η = 0.XX

SLIDING
η = 0.XX

OVERTURNING
η = 0.XX

BEARING
η = 0.XX

DEFLECTION
η = 0.XX

HYDRAULIC
η = 0.XX


# 61. CRITICAL CHECK

Automatically identify the highest utilization ratio.

Display:

CRITICAL CHECK

[Name]

Utilization:

η = XX

But do NOT call it:

"the governing design"

unless the underlying design methodology establishes that it governs.


# 62. DEFAULT PROJECT — CURRENT CONCEPT

Preload:

Design:

U-Shape Sheet Pile + Granular Fill + Two Tie Rods + RC Capping Beam

Wall height:

6.00 m

Embedment:

6.00 m

Total sheet pile:

12.00 m

Road width:

8.00 m

Total width:

8.70 m

Sheet pile:

350 mm thick

Concrete:

fcu = 40 MPa

Capping beam:

600 × 600 mm

Tie rods:

Ø40 mm

Upper tie:

+5.10 m

Lower tie:

+3.20 m

Flood upstream:

+5.20 m

Flood downstream:

+4.20 m

Dry season:

+0.00 m


# 63. IMPORTANT ENGINEERING LOGIC

The application must understand that the following are different:

1. Dry season
2. Flood season
3. Rapid drawdown
4. Construction stage
5. Heavy traffic stage
6. Temporary unsupported stage

Do not simply combine all maximum values into one physically impossible load case.

Create realistic simultaneous load combinations.


# 64. IMPORTANT WATER LOGIC

For each side:

Total lateral stress:

σ_total = σ'_soil + u

where:

u = γw h

For a two-sided water condition:

p_net = p_left - p_right

The water pressure shall be calculated based on actual elevations.

The system must allow:

water on one side only

water on both sides

different water levels

no water

rapid drawdown


# 65. IMPORTANT GEOTECHNICAL LOGIC

Never automatically count passive resistance without checking:

- sufficient embedment
- excavation disturbance
- scour
- construction sequence
- soil removal
- groundwater
- mobilization
- wall movement

Provide a user-controlled:

PASSIVE RESISTANCE REDUCTION FACTOR

but label it:

"USER-DEFINED / PROJECT-SPECIFIC"


# 66. DESIGN ASSUMPTIONS PANEL

Create a visible panel:

DESIGN ASSUMPTIONS

Example:

✓ Horizontal backfill
✓ Drained granular fill
✓ No cohesion assumed
✓ Hydrostatic water pressure
✓ No seismic loading
✓ Uniform traffic surcharge
✓ Passive resistance mobilized
✓ No scour considered

Each assumption must be editable.

If an assumption materially affects the calculation, show a warning.


# 67. CODE BASIS PANEL

Show:

DESIGN CODES

EN 1990
EN 1991
EN 1992
EN 1997
EN 1998 if applicable

Allow:

National Annex:

[Select]

Design Approach:

[Select]

Edition:

[User input]

The application must NOT silently mix different Eurocode generations.


# 68. VISUAL STYLE

The UI shall look like professional engineering software.

Style:

- White background
- Dark blue engineering headers
- Grey calculation panels
- Clear dimension drawings
- Technical typography
- Thin engineering lines
- Mathcad-style equations
- Professional tables
- No excessive gradients
- No gaming-style UI
- No unnecessary animations

Use:

Left navigation

Main calculation area

Right-side result panel where appropriate.


# 69. REPORT PRINT CSS

Create:

@media print

The printed document shall:

- hide UI controls
- hide navigation
- preserve equations
- preserve SVG diagrams
- preserve tables
- include page headers
- include page numbers
- avoid table splitting where possible
- avoid cutting equations
- use A4 paper
- have professional margins


# 70. FINAL ENGINEERING REPORT

The final report must contain:

1. Project information
2. Design objective
3. Structural concept
4. Design parameters
5. Soil parameters
6. Water conditions
7. Traffic conditions
8. Load cases
9. Earth pressure
10. Water pressure
11. Sheet pile analysis
12. Tie rod analysis
13. Capping beam
14. Embedment
15. Sliding
16. Overturning
17. Bearing
18. Hydraulic checks
19. Deflection
20. Crack width
21. Construction stages
22. Utilization summary
23. Sensitivity study
24. Design warnings
25. Engineering conclusion


# 71. QUALITY CONTROL

Before displaying results, run automatic checks:

QC-01:
Units consistent

QC-02:
All mandatory inputs present

QC-03:
No NaN

QC-04:
No divide-by-zero

QC-05:
Water levels valid

QC-06:
Soil layers continuous

QC-07:
Wall geometry valid

QC-08:
Tie levels within wall height

QC-09:
Embedment positive

QC-10:
Reinforcement area positive

QC-11:
Design approach selected

QC-12:
Critical checks completed

Display:

CALCULATION QC

PASS / WARNING / ERROR


# 72. NO FAKE PRECISION

Do not display excessive decimal places.

Recommended:

Length:
2 decimals

Force:
1 decimal

Moment:
1 decimal

Stress:
2 decimals

Utilization:
2 decimals

Reinforcement:
nearest practical mm²

Use engineering rounding consistently.


# 73. ENGINEERING LIMITATION

At the beginning and end of the report display:

"PRELIMINARY ENGINEERING DESIGN TOOL

This calculation is dependent on the accuracy of the input soil parameters, groundwater conditions, hydraulic assumptions, structural properties, load models, construction sequence and adopted design standards.

The results shall be reviewed by a suitably qualified structural/geotechnical engineer before construction."


# 74. MOST IMPORTANT FEATURE

The user must be able to change:

DESIGN TYPE

WALL HEIGHT

EMBEDMENT DEPTH

WALL THICKNESS

WALL SPACING

SOIL

φ'

γ

GROUNDWATER

UPSTREAM WATER LEVEL

DOWNSTREAM WATER LEVEL

TRAFFIC SURCHARGE

ROAD WIDTH

TIE LEVEL

TIE SPACING

TIE DIAMETER

CONCRETE GRADE

REINFORCEMENT

CAPPING BEAM

and immediately recalculate:

PRESSURE

FORCES

MOMENTS

TIE FORCES

EMBEDMENT

DEFLECTION

STRUCTURAL CAPACITY

GEOTECHNICAL CAPACITY

UTILIZATION

STATUS


# 75. FINAL REQUIREMENT

Build the application as one complete standalone HTML file.

Do not provide pseudo-code.

Do not provide incomplete functions.

Do not leave:

TODO

PLACEHOLDER

IMPLEMENT LATER

in the calculation engine.

Every button must work.

Every calculation must update dynamically.

Every diagram must update dynamically.

Every equation must render using KaTeX.

Every major result must have:

1. Formula
2. Substitution
3. Result
4. Unit
5. Explanation
6. Utilization
7. Status

The final result should feel like:

"Mathcad calculation sheet + engineering design software + interactive SVG drawing + professional calculation report"

rather than a normal web form.