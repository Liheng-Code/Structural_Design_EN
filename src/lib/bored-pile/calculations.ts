import type { BoredPileProject, BoredPileAnalysisResult, LayerResistanceResult } from "./types";

export function defaultBoredPileProject(): BoredPileProject {
  return {
    projectName: "Demonstration Building Foundation",
    projectNumber: "BP-2026-EC7",
    client: "Structural & Geotechnical Consultants Ltd",
    designer: "Lead Geotechnical Engineer",
    groundLevel: 0.0,
    waterLevel: 2.0,
    diameter: 800, // mm
    length: 25.0, // m
    concreteGrade: "C30/37",
    steelGrade: "B500B",
    fck: 30, // MPa
    fyk: 500, // MPa
    cover: 75, // mm
    nEd: 2000, // kN
    mEd: 120, // kNm
    numBars: 12,
    barDiameter: 25, // mm
    layers: [
      {
        id: "L1",
        name: "Made ground / fill",
        type: "fill",
        topDepth: 0.0,
        bottomDepth: 2.0,
        gamma: 18,
        phi: 28,
        c: 0,
        cu: 0,
        sptN: 8,
        method: "beta",
      },
      {
        id: "L2",
        name: "Soft clay",
        type: "clay",
        topDepth: 2.0,
        bottomDepth: 6.0,
        gamma: 17,
        phi: 0,
        c: 0,
        cu: 25,
        sptN: 4,
        method: "alpha",
      },
      {
        id: "L3",
        name: "Medium-dense sand",
        type: "sand",
        topDepth: 6.0,
        bottomDepth: 12.0,
        gamma: 19,
        phi: 32,
        c: 0,
        cu: 0,
        sptN: 22,
        method: "beta",
      },
      {
        id: "L4",
        name: "Stiff clay",
        type: "stiff-clay",
        topDepth: 12.0,
        bottomDepth: 18.0,
        gamma: 19,
        phi: 0,
        c: 0,
        cu: 100,
        sptN: 28,
        method: "alpha",
      },
      {
        id: "L5",
        name: "Dense sand (Toe founding)",
        type: "dense-sand",
        topDepth: 18.0,
        bottomDepth: 25.0,
        gamma: 20,
        phi: 36,
        c: 0,
        cu: 0,
        sptN: 42,
        method: "beta",
      },
    ],
  };
}

export function analyzeBoredPile(proj: BoredPileProject): BoredPileAnalysisResult {
  const D = proj.diameter / 1000; // m
  const r = D / 2;
  const pileArea = Math.PI * r * r; // m2
  const pilePerimeter = Math.PI * D; // m

  const resultsLayers: LayerResistanceResult[] = [];
  let totalShaft = 0;

  // Calculate shaft resistance per layer intersected by pile (up to pile length)
  const pileLength = proj.length;

  for (const layer of proj.layers) {
    if (layer.topDepth >= pileLength) continue;
    const effectiveBottom = Math.min(layer.bottomDepth, pileLength);
    const effectiveLength = Math.max(0, effectiveBottom - layer.topDepth);
    if (effectiveLength <= 0) continue;

    const midDepth = layer.topDepth + effectiveLength / 2;
    // Effective overburden stress at mid depth (approximate unit weight * depth adjusted for water table at 2.0m)
    const zWater = proj.waterLevel;
    let sigmaV0 = 0;
    if (midDepth <= zWater) {
      sigmaV0 = layer.gamma * midDepth;
    } else {
      const dryPart = layer.gamma * zWater;
      const subDepth = midDepth - zWater;
      const subGamma = Math.max(1, layer.gamma - 9.81);
      sigmaV0 = dryPart + subGamma * subDepth;
    }
    sigmaV0 = Math.max(10, sigmaV0); // minimum effective stress

    let unitResistance = 0;
    let methodUsed = "";

    if (layer.method === "alpha" && layer.cu > 0) {
      // Alpha method for clays: q_s = alpha * cu. For bored piles in stiff clay, alpha ~ 0.45 - 0.55
      const alpha = layer.cu <= 40 ? 0.55 : 0.45;
      unitResistance = alpha * layer.cu * 1000; // kPa -> N/m2 -> let's keep units in kPa (kN/m2)
      unitResistance = alpha * layer.cu;
      methodUsed = `Alpha method (α = ${alpha}, cu = ${layer.cu} kPa)`;
    } else {
      // Beta method for granular soils: q_s = beta * sigma_v0' where beta = K * tan(delta)
      const phiRad = (layer.phi * Math.PI) / 180;
      const K = 0.8; // typical for bored piles
      const tanDelta = Math.tan(phiRad * 0.75);
      const beta = K * tanDelta;
      unitResistance = beta * sigmaV0;
      methodUsed = `Beta method (β = ${beta.toFixed(2)}, σ'v0 = ${sigmaV0.toFixed(1)} kPa)`;
    }

    const shaftResLayer = unitResistance * pilePerimeter * effectiveLength; // kN
    totalShaft += shaftResLayer;

    resultsLayers.push({
      layerId: layer.id,
      name: layer.name,
      thickness: layer.bottomDepth - layer.topDepth,
      effectiveLength,
      unitResistance,
      shaftResistance: Math.round(shaftResLayer * 10) / 10,
      methodUsed,
    });
  }

  // Base resistance at pile toe (in Layer 5 or whichever layer toe is in)
  const toeLayer = proj.layers.find((l) => proj.length >= l.topDepth && proj.length <= l.bottomDepth) || proj.layers[proj.layers.length - 1];
  
  let baseUnitResistance = 0;
  if (toeLayer.phi > 0) {
    // For sand: q_b = sigma_v_toe' * N_q (approx N_q ~ 30-50 for phi 36)
    const phiRad = (toeLayer.phi * Math.PI) / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const zToe = proj.length;
    const sigmaToe = (toeLayer.gamma * Math.min(proj.waterLevel, zToe)) + (Math.max(0, zToe - proj.waterLevel) * (toeLayer.gamma - 9.81));
    baseUnitResistance = Math.min(5000, sigmaToe * Math.min(Nq, 40)); // capping for bored piles
  } else {
    // For clay: q_b = 9 * cu
    baseUnitResistance = 9 * (toeLayer.cu > 0 ? toeLayer.cu : 100);
  }

  const baseResistance = baseUnitResistance * pileArea; // kN
  const totalCharacteristicResistance = Math.round((totalShaft + baseResistance) * 10) / 10;

  // Design resistance with partial factor gamma_t = 1.35
  const gammaT = 1.35;
  const designResistance = Math.round((totalCharacteristicResistance / gammaT) * 10) / 10;

  const utilizationGeotechnical = Math.round((proj.nEd / designResistance) * 1000) / 1000;

  // Settlement estimates (Elastic compression + soil deformation)
  // Pile elastic compression: delta_L = N * L / (A_c * E_c)
  const Ec = 30000; // MPa -> 30,000,000 kN/m2 for C30/37
  const grossAreaM2 = pileArea;
  const pileElasticSettlement = ((proj.nEd * proj.length) / (grossAreaM2 * Ec * 1000)) * 1000; // mm
  const soilSettlement = (proj.nEd / (totalCharacteristicResistance * 0.7)) * 4.5; // empirical approximation in mm
  const settlementTotal = Math.round((pileElasticSettlement + soilSettlement) * 10) / 10;
  const allowableSettlement = 25.0; // mm

  // Structural capacity of RC pile (EN 1992-1-1 approximate N_Rd)
  const Ac = grossAreaM2 * 1e6; // mm2
  const barArea = Math.PI * Math.pow(proj.barDiameter / 2, 2);
  const rebarArea = proj.numBars * barArea; // mm2
  const reinforcementRatio = (rebarArea / Ac) * 100; // %

  // N_Rd = Ac * fcd + As * fyd (simplified axial capacity)
  const fcd = (proj.fck / 1.5); // MPa
  const fyd = (proj.fyk / 1.15); // MPa
  const structuralAxialResistance = Math.round(((Ac * fcd + rebarArea * fyd) / 1000) * 10) / 10; // kN
  const utilizationStructural = Math.round((proj.nEd / structuralAxialResistance) * 1000) / 1000;

  let overallStatus: "PASS" | "FAIL" | "WARNING" = "PASS";
  if (utilizationGeotechnical > 1.0 || utilizationStructural > 1.0 || settlementTotal > allowableSettlement) {
    overallStatus = "FAIL";
  } else if (utilizationGeotechnical > 0.85 || utilizationStructural > 0.85) {
    overallStatus = "WARNING";
  }

  return {
    pileArea,
    pilePerimeter,
    layers: resultsLayers,
    totalShaftResistance: Math.round(totalShaft * 10) / 10,
    baseUnitResistance: Math.round(baseUnitResistance * 10) / 10,
    baseResistance: Math.round(baseResistance * 10) / 10,
    totalCharacteristicResistance,
    designResistance,
    utilizationGeotechnical,
    settlementElastic: Math.round(pileElasticSettlement * 10) / 10,
    settlementSoil: Math.round(soilSettlement * 10) / 10,
    settlementTotal,
    allowableSettlement,
    grossArea: Math.round(Ac),
    rebarArea: Math.round(rebarArea),
    reinforcementRatio: Math.round(reinforcementRatio * 100) / 100,
    structuralAxialResistance,
    utilizationStructural,
    overallStatus,
  };
}
