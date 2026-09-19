import type { BoredPileProject, BoredPileAnalysisResult, LayerResistanceResult, LayerSettlementResult } from "./types";

export function defaultBoredPileProject(): BoredPileProject {
  return {
    projectName: "Demonstration Building Foundation",
    projectNumber: "BP-2026-EC7",
    client: "Structural & Geotechnical Consultants Ltd",
    designer: "Lead Geotechnical Engineer",
    revision: "Rev. 01",
    calculationDate: new Date().toISOString().split("T")[0],
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
    safetyFactor: 2.5,
    designApproach: "DA1-C2",
    numBars: 12,
    barDiameter: 25, // mm
    spiralBarDiameter: 12, // mm
    spiralSpacing: 200, // mm
    stiffenerBarDiameter: 16, // mm
    stiffenerSpacing: 1500, // mm
    exposureClass: "XC2",
    layers: [
      {
        id: "L1",
        name: "Made ground / fill",
        type: "fill",
        topDepth: 0.0,
        bottomDepth: 2.0,
        gamma: 18,
          gammaSat: 19,
        phi: 28,
        c: 0,
        cu: 0,
        sptN: 8,
        e50: 15000,
        eoed: 12000,
        eur: 45000,
        nu: 0.3,
        permeability: 1e-5,
        ocr: 1,
        k0: 0.53,
        rInter: 0.7,
        drainage: "drained",
        method: "beta",
      },
      {
        id: "L2",
        name: "Soft clay",
        type: "clay",
        topDepth: 2.0,
        bottomDepth: 6.0,
        gamma: 17,
        gammaSat: 18,
        phi: 0,
        c: 0,
        cu: 25,
        sptN: 4,
        e50: 5000,
        eoed: 4000,
        eur: 15000,
        nu: 0.45,
        permeability: 1e-9,
        ocr: 1,
        k0: 0.55,
        rInter: 0.6,
        drainage: "undrained",
        method: "alpha",
      },
      {
        id: "L3",
        name: "Medium-dense sand",
        type: "sand",
        topDepth: 6.0,
        bottomDepth: 12.0,
        gamma: 19,
        gammaSat: 20,
        phi: 32,
        c: 0,
        cu: 0,
        sptN: 22,
        e50: 30000,
        eoed: 24000,
        eur: 90000,
        nu: 0.28,
        permeability: 1e-5,
        ocr: 1,
        k0: 0.47,
        rInter: 0.75,
        drainage: "drained",
        method: "beta",
      },
      {
        id: "L4",
        name: "Stiff clay",
        type: "stiff-clay",
        topDepth: 12.0,
        bottomDepth: 18.0,
        gamma: 19,
        gammaSat: 20,
        phi: 0,
        c: 0,
        cu: 100,
        sptN: 28,
        e50: 20000,
        eoed: 16000,
        eur: 60000,
        nu: 0.42,
        permeability: 1e-9,
        ocr: 2,
        k0: 0.75,
        rInter: 0.65,
        drainage: "undrained",
        method: "alpha",
      },
      {
        id: "L5",
        name: "Dense sand (Toe founding)",
        type: "dense-sand",
        topDepth: 18.0,
        bottomDepth: 25.0,
        gamma: 20,
        gammaSat: 21,
        phi: 36,
        c: 0,
        cu: 0,
        sptN: 42,
        e50: 50000,
        eoed: 40000,
        eur: 150000,
        nu: 0.25,
        permeability: 1e-4,
        ocr: 1,
        k0: 0.41,
        rInter: 0.8,
        drainage: "drained",
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
      const subGamma = Math.max(1, (layer.gammaSat ?? layer.gamma) - 9.81);
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
  if (toeLayer && toeLayer.phi > 0) {
    // For sand: q_b = sigma_v_toe' * N_q (approx N_q ~ 30-50 for phi 36)
    const phiRad = (toeLayer.phi * Math.PI) / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const zToe = proj.length;
    const sigmaToe = (toeLayer.gamma * Math.min(proj.waterLevel, zToe)) + (Math.max(0, zToe - proj.waterLevel) * ((toeLayer.gammaSat ?? toeLayer.gamma) - 9.81));
    baseUnitResistance = Math.min(5000, sigmaToe * Math.min(Nq, 40)); // capping for bored piles
  } else if (toeLayer) {
    // For clay: q_b = 9 * cu
    baseUnitResistance = 9 * (toeLayer.cu > 0 ? toeLayer.cu : 100);
  }

  const baseResistance = baseUnitResistance * pileArea; // kN
  const totalCharacteristicResistance = Math.round((totalShaft + baseResistance) * 10) / 10;

  // User-selected preliminary resistance factor; confirm against the adopted EN 1997 National Annex.
  const gammaT = Math.min(5, Math.max(2, proj.safetyFactor || 2.5));
  const designResistance = Math.round((totalCharacteristicResistance / gammaT) * 10) / 10;

  const utilizationGeotechnical = designResistance > 0
    ? Math.round((proj.nEd / designResistance) * 1000) / 1000
    : Number.POSITIVE_INFINITY;

  // Settlement estimates (Elastic compression + layer-by-layer soil deformation)
  const serviceLoad = Math.round(proj.nEd * 0.7 * 10) / 10;
  const layerSettlements: LayerSettlementResult[] = [];
  let totalSoilSettlement = 0;

  for (const layer of proj.layers) {
    if (layer.topDepth >= pileLength + D * 2) continue;
    const top = Math.max(0, layer.topDepth);
    const bottom = Math.min(pileLength + D * 2, layer.bottomDepth);
    const thickness = Math.max(0, bottom - top);
    if (thickness <= 0) continue;

    const midDepth = (top + bottom) / 2;
    const stressInc = serviceLoad / (Math.PI * Math.pow(D / 2 + (midDepth / pileLength) * 0.4, 2));
    const e50 = layer.e50 || (layer.type === "sand" ? 30000 : layer.type === "dense-sand" ? 50000 : 15000);

    const immSettlement = (stressInc * thickness / e50) * 1000 * 0.35; // mm
    
    let conSettlement = 0;
    if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") {
      const Cc = layer.compressionIndex || 0.25;
      const e0 = layer.initialVoidRatio || 0.8;
      const zWater = proj.waterLevel;
      let sigmaV0 = midDepth <= zWater ? layer.gamma * midDepth : layer.gamma * zWater + Math.max(1, (layer.gammaSat ?? layer.gamma) - 9.81) * (midDepth - zWater);
      sigmaV0 = Math.max(10, sigmaV0);
      conSettlement = (Cc * thickness / (1 + e0)) * Math.log10((sigmaV0 + stressInc) / sigmaV0) * 1000;
    }

    const totalLayerSettlement = Math.round((immSettlement + conSettlement) * 10) / 10;
    totalSoilSettlement += totalLayerSettlement;

    layerSettlements.push({
      layerId: layer.id,
      name: layer.name,
      soilType: layer.type,
      thickness: Math.round(thickness * 10) / 10,
      depthTop: top,
      depthBottom: bottom,
      modulus: e50,
      immediateSettlement: Math.round(immSettlement * 10) / 10,
      consolidationSettlement: Math.round(conSettlement * 10) / 10,
      totalLayerSettlement,
    });
  }

  const Ec = 30000; // MPa -> 30,000,000 kN/m2 for C30/37
  const grossAreaM2 = pileArea;
  const pileElasticSettlement = ((serviceLoad * proj.length) / (grossAreaM2 * Ec * 1000)) * 1000; // mm
  const soilSettlement = Math.round(totalSoilSettlement * 10) / 10;
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

  const kgPerMetre = (diameter: number) => (diameter * diameter) / 162;
  const cageDiameter = Math.max(0.1, D - (2 * proj.cover) / 1000);
  const mainBarWeight = (proj.numBars * proj.length * kgPerMetre(proj.barDiameter));
  const spiralTurns = Math.max(1, (proj.length * 1000) / proj.spiralSpacing);
  const spiralLength = spiralTurns * Math.PI * cageDiameter;
  const spiralWeight = spiralLength * kgPerMetre(proj.spiralBarDiameter);
  const stiffenerCount = Math.max(1, Math.ceil((proj.length * 1000) / proj.stiffenerSpacing));
  const stiffenerLength = stiffenerCount * Math.PI * cageDiameter;
  const stiffenerWeight = stiffenerLength * kgPerMetre(proj.stiffenerBarDiameter);
  const totalRebarWeight = mainBarWeight + spiralWeight + stiffenerWeight;
  const steelRatioKgPerM3 = Math.round((totalRebarWeight / (pileArea * proj.length)) * 10) / 10;

  // EC2 Checks (EN 1992-1-1)
  const minReinforcementRatioPass = reinforcementRatio >= 0.2;
  const maxReinforcementRatioPass = reinforcementRatio <= 4.0;
  const minBarSizePass = proj.barDiameter >= 16;
  const maxAllowedSpiralSpacing = Math.min(250, 12 * proj.barDiameter);
  const spiralSpacingPass = proj.spiralSpacing <= maxAllowedSpiralSpacing;
  
  // Bending + Axial interaction (approximate check: N_Ed / N_Rd + M_Ed / M_Rd_approx <= 1.0)
  const mRdApprox = structuralAxialResistance * (D * 0.15); // kNm approx bending capacity
  const bendingInteractionRatio = Math.round(((proj.nEd / structuralAxialResistance) + (mRdApprox > 0 ? proj.mEd / mRdApprox : 0)) * 1000) / 1000;

  let overallStatus: "PASS" | "FAIL" | "WARNING" = "PASS";
  if (
    utilizationGeotechnical > 1.0 ||
    utilizationStructural > 1.0 ||
    settlementTotal > allowableSettlement ||
    !minReinforcementRatioPass ||
    !maxReinforcementRatioPass ||
    !minBarSizePass ||
    bendingInteractionRatio > 1.0
  ) {
    overallStatus = "FAIL";
  } else if (
    utilizationGeotechnical > 0.85 ||
    utilizationStructural > 0.85 ||
    bendingInteractionRatio > 0.85 ||
    !spiralSpacingPass
  ) {
    overallStatus = "WARNING";
  }

  return {
    pileArea,
    pilePerimeter,
    layers: resultsLayers,
    layerSettlements,
    serviceLoad,
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
    mainBarWeight: Math.round(mainBarWeight * 10) / 10,
    spiralWeight: Math.round(spiralWeight * 10) / 10,
    stiffenerWeight: Math.round(stiffenerWeight * 10) / 10,
    totalRebarWeight: Math.round(totalRebarWeight * 10) / 10,
    steelRatioKgPerM3,
    minReinforcementRatioPass,
    maxReinforcementRatioPass,
    minBarSizePass,
    spiralSpacingPass,
    bendingInteractionRatio,
    designAxialLoad: proj.nEd,
    utilization: utilizationGeotechnical,
    structuralInteraction: bendingInteractionRatio,
    totalBaseResistance: Math.round(baseResistance * 10) / 10,
    characteristicResistance: totalCharacteristicResistance,
    maxLateralDeflection: Math.round((proj.mEd / 100) * 10) / 10,
    reinforcementArea: Math.round(rebarArea),
    overallStatus,
  };
}
