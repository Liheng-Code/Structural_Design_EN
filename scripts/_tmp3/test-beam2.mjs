import { beamFem } from "./math.ts";

function selfConsistency(label, fem, z) {
  const n = z.length;
  let maxErr = 0;
  for (let i = 1; i < n - 1; i++) {
    const dx = Math.abs(z[i + 1] - z[i - 1]);
    const dMdx = (fem.M[i + 1] - fem.M[i - 1]) / dx;
    const err = Math.abs(dMdx - fem.V[i]);
    maxErr = Math.max(maxErr, err);
  }
  console.log(label, "max |dM/dx - V| over interior nodes:", maxErr.toFixed(6));
  console.log(label, "V[end] (should be ~0, free end):", fem.V[n - 1].toFixed(6));
  console.log(label, "M[end] (should be ~0, free end):", fem.M[n - 1].toFixed(6));
  console.log(label, "Mmax/Mmin/Vmax:", Math.max(...fem.M).toFixed(3), Math.min(...fem.M).toFixed(3), Math.max(...fem.V.map(Math.abs)).toFixed(3));
}

// Case 1: uniform load, uniform Winkler support, no springs.
{
  const n = 25, L = 12;
  const z = Array.from({ length: n }, (_, i) => L - (i / (n - 1)) * L);
  const p = z.map(() => 10);
  const kSoil = z.map(() => 5000);
  const fem = beamFem({ z, p, kSoil, springs: [], EI: 60000 });
  selfConsistency("Case1 (uniform load+spring, no ties)", fem, z);
}

// Case 2: partial Winkler support (only lower half), with two point ties near the top.
{
  const n = 49, L = 12;
  const z = Array.from({ length: n }, (_, i) => 6 - (i / (n - 1)) * L); // top=6, toe=-6
  const p = z.map((zz) => (zz > 0 ? 15 : 15 - 3 * (0 - zz)));
  const kSoil = z.map((zz) => (zz > 0 ? 0 : 8000 * Math.max(-zz, 0.1)));
  const springs = [{ z: 5.1, k: 30000 }, { z: 3.2, k: 30000 }];
  const fem = beamFem({ z, p, kSoil, springs, EI: 60000 });
  selfConsistency("Case2 (embedded wall with ties)", fem, z);
}

// Case 3: point load only (no distributed load), to compare against Hetenyi's
// closed-form semi-infinite beam-on-elastic-foundation solution.
{
  const n = 401, L = 80; // long beam, fine mesh, point load at the middle
  const z = Array.from({ length: n }, (_, i) => L / 2 - (i / (n - 1)) * L);
  const EI = 60000;
  const k = 5000; // kN/m per m run
  const P = 100; // kN point load
  const beta = (k / (4 * EI)) ** 0.25;
  // Apply P as a point spring? No -- apply as a concentrated force via p as a very
  // narrow spike approximating a point load (width = one element).
  const dz = z[0] - z[1];
  const p = z.map(() => 0);
  const midIdx = Math.floor((n - 1) / 2);
  p[midIdx] = P / dz; // distribute over one element width so its integral = P
  const kSoil = z.map(() => k);
  const fem = beamFem({ z, p, kSoil, springs: [], EI });
  selfConsistency("Case3 (point load, long beam)", fem, z);

  // Hetenyi closed form for infinite beam, point load at x=0:
  // y(x) = (P*beta)/(2k) * exp(-beta*|x|) * (cos(beta*x)+sin(beta*|x|))
  // M(x) = (P/(4*beta)) * exp(-beta*|x|) * (cos(beta*x)-sin(beta*|x|))
  // V(x) = -(P/2) * exp(-beta*|x|) * cos(beta*x)   [for x>0; antisymmetric for x<0]
  console.log("beta:", beta.toFixed(5), "characteristic length 1/beta:", (1 / beta).toFixed(3), "m (beam half-length", L / 2, "m)");
  for (const xTest of [0, 0.5, 1, 2, 4]) {
    const idx = midIdx + Math.round(xTest / dz); // local x increases with index (z decreases with index)
    const M_fem = fem.M[idx];
    const V_fem = fem.V[idx];
    const y_fem = fem.y[idx];
    const M_exact = (P / (4 * beta)) * Math.exp(-beta * xTest) * (Math.cos(beta * xTest) - Math.sin(beta * xTest));
    const V_exact = -(P / 2) * Math.exp(-beta * xTest) * Math.cos(beta * xTest);
    const y_exact = ((P * beta) / (2 * k)) * Math.exp(-beta * xTest) * (Math.cos(beta * xTest) + Math.sin(beta * xTest));
    console.log(
      `x=${xTest}: M_fem=${M_fem.toFixed(3)} M_exact=${M_exact.toFixed(3)} | V_fem=${V_fem.toFixed(3)} V_exact=${V_exact.toFixed(3)} | y_fem=${y_fem.toFixed(5)} y_exact=${y_exact.toFixed(5)}`,
    );
  }
}
