# Design rules — Retaining Wall in Building (Top-Propped Basement Wall, Eurocode)

> **Project:** Retaining Wall in Building (Top-Propped Basement Wall, Eurocode)
> **Source file:** AGENTS.project.md §8, §12, §14, §15, §16, §17, §18, §19, §20, §21
> **Status:** Design rules (calculation procedure) — not a calculation
> **Codes:** EN 1990, EN 1992-1-1, EN 1997-1 (as referenced by the rules)
> **National Annex:** Not fixed by the rules — set per project (rules §3 require it to be stated); this project: UK NA (provisional)
> **Design situation:** All situations defined by the rules; this wall uses transient (construction) and persistent (permanent)
> **Note:** Engineering calculation material for review. Values marked ASSUMED or
> INPUT REQUIRED are not verified project data.

## 8. DESIGN SITUATIONS

Identify applicable design situations:

### Persistent Situation

Normal long-term condition.

### Transient Situation

Temporary construction or temporary operational condition.

### Accidental Situation

Accidental loading or exceptional event.

### Seismic Situation

Where earthquake action applies.

### Construction Situation

Include temporary stages such as:

* excavation;
* lifting;
* transportation;
* erection;
* temporary support;
* partial completion;
* construction surcharge;
* temporary water level;
* temporary traffic;
* equipment loads.

Do not design only the final completed condition when construction stages can govern.

---


## 12. LOAD COMBINATIONS

Determine the applicable combinations from EN 1990 and the relevant National Annex.

Consider separately:

### ULS

* Fundamental combination
* Accidental combination where applicable
* Seismic combination where applicable

### SLS

* Characteristic combination
* Frequent combination
* Quasi-permanent combination

Clearly identify:


E_d = Design effect of actions


and:


R_d = Design resistance


The basic verification shall be expressed as:


E_d ≤ R_d


Do not use arbitrary load factors.

Do not mix ULS and SLS factors.

---


## 14. ULTIMATE LIMIT STATE

Perform all relevant ULS checks.

Typical checks include:

### RC

* flexure;
* shear;
* axial compression;
* axial tension;
* combined N-M;
* punching shear;
* torsion;
* anchorage;
* lap length;
* crack-control-related reinforcement where relevant;
* minimum reinforcement;
* maximum reinforcement;
* robustness;
* stability.

### Steel

* cross-section classification;
* yielding;
* buckling;
* lateral-torsional buckling;
* shear;
* interaction;
* local buckling;
* torsion;
* combined actions;
* connection resistance.

### Geotechnical

* bearing resistance;
* sliding;
* overturning;
* uplift;
* global stability;
* slope stability;
* pile resistance;
* settlement;
* structural-geotechnical interaction.

### Retaining / Flood Structures

Check where applicable:

* active pressure;
* passive resistance;
* water pressure;
* differential water pressure;
* surcharge;
* traffic load;
* construction load;
* sliding;
* overturning;
* bearing;
* global stability;
* structural bending;
* shear;
* anchorage;
* uplift;
* seepage;
* piping;
* scour;
* temporary construction condition.

---


## 15. SERVICEABILITY LIMIT STATE

Do not stop at ULS.

Perform applicable SLS checks including:

* deflection;
* crack width;
* stress limitation;
* vibration;
* settlement;
* rotation;
* drift;
* movement;
* durability-related crack control;
* appearance;
* functional requirements.

Clearly distinguish:


ULS = Safety / resistance


from:


SLS = Serviceability / performance


---


## 16. DURABILITY

For concrete structures, identify:

* exposure class;
* design working life;
* concrete strength;
* cement/binder requirements where applicable;
* nominal cover;
* minimum cover;
* durability requirements;
* crack control;
* execution tolerances.

Calculate:


c_nom=c_min+Δ c_dev


where applicable.

Do not assume concrete cover without identifying its basis.

---


## 17. GEOTECHNICAL DESIGN

Where soil or foundation behaviour is involved, separate:

### Structural Design

Resistance of the structural element.

### Geotechnical Design

Resistance and behaviour of the ground.

Use the appropriate EN 1997 design approach and National Annex.

Clearly identify:

* soil layers;
* groundwater;
* unit weight;
* cohesion;
* friction angle;
* undrained shear strength;
* stiffness;
* bearing parameters;
* interface friction;
* permeability;
* consolidation parameters;
* characteristic vs design values.

Do not invent soil parameters.

If soil data are missing, identify the required geotechnical investigation/input.

---


## 18. WATER / HYDROSTATIC PRESSURE

For structures exposed to water, explicitly establish:

* upstream water level;
* downstream water level;
* groundwater level;
* temporary water level;
* flood level;
* water density;
* differential head.

For hydrostatic pressure:


p=γ_w h


For a vertical wall with water depth \(h\):


P=(1)/(2)γ_w h^2


acting at:


z=(h)/(3)


above the base for a triangular pressure distribution.

Do not ignore differential water pressure when it can govern.

---


## 19. EARTH PRESSURE

Where retaining or buried structures are involved, identify the applicable earth-pressure condition:

* active;
* passive;
* at-rest.

State the basis for the selected coefficient.

For a simple Rankine active condition where applicable:


K_a=(1-sin φ)/(1+sin φ)


or equivalent:


K_a=tan ^2(45°-(φ)/(2))


Then:


σ_h=K_aσ_v


and for uniform soil without cohesion:


P_a=(1)/(2)K_aγ H^2


Do not use simplified Rankine equations when the geometry, groundwater, wall friction, layered soil, seismic condition, or surcharge requires a more appropriate method.

---


## 20. STRUCTURAL MEMBER DESIGN

For every structural member, follow this sequence:

### Step 1 — Geometry

Determine:

* span;
* width;
* depth;
* thickness;
* effective depth;
* support conditions.

### Step 2 — Materials

Determine:

* concrete;
* reinforcement;
* structural steel;
* timber;
* masonry;
* bolts;
* welds;
* soil.

### Step 3 — Actions

Determine all relevant loads.

### Step 4 — Analysis

Calculate:

* reactions;
* shear;
* moment;
* axial force;
* torsion;
* displacement.

### Step 5 — ULS

Calculate design resistance.

### Step 6 — SLS

Calculate serviceability performance.

### Step 7 — Detailing

Determine:

* reinforcement;
* spacing;
* anchorage;
* laps;
* stiffeners;
* connection details;
* cover;
* minimum requirements.

### Step 8 — Utilization

Calculate:


UR=(E_d)/(R_d)


Interpretation:


UR≤1.00 \Rightarrow PASS



UR>1.00 \Rightarrow FAIL


Do not round a failing result down to a passing result.

---


## 21. STABILITY

For stability-sensitive structures, explicitly check:

### Sliding


(E_sliding)/(R_sliding)≤1.0


### Overturning

Compare destabilizing and stabilizing effects according to the governing Eurocode verification format.

### Bearing

Verify:


V_d ≤ R_d


### Uplift

Verify available resistance against design uplift.

### Global Stability

Consider the overall soil-structure mechanism where applicable.

Never rely only on structural member strength when the entire structure can move or fail as a system.

---
