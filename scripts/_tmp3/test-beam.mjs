import { beamFem } from "./math.ts";

// Simple case: uniform Winkler-supported beam, uniform load, no ties.
const n = 25;
const L = 12; // total length, m
const z = Array.from({ length: n }, (_, i) => L - (i / (n - 1)) * L); // top to bottom
const p = z.map(() => 10); // uniform 10 kN/m outward pressure
const kSoil = z.map(() => 5000); // uniform Winkler modulus kN/m/m
const EI = 60000; // kN.m^2

const fem = beamFem({ z, p, kSoil, springs: [], EI });

// Self-consistency check using LOCAL element coordinate x (increasing with index,
// i.e. opposite direction to z which decreases with index): does dM/dx match V?
console.log("i, z, M, V(reported), dM/dx(finite-diff), ratio(dMdx/V)");
for (let i = 1; i < n - 1; i++) {
  const dx = Math.abs(z[i + 1] - z[i - 1]); // local x always increases with index
  const dM = fem.M[i + 1] - fem.M[i - 1];
  const dMdx = dM / dx;
  const ratio = fem.V[i] !== 0 ? dMdx / fem.V[i] : NaN;
  if (i % 4 === 0) {
    console.log(i, z[i].toFixed(2), fem.M[i].toFixed(3), fem.V[i].toFixed(3), dMdx.toFixed(3), ratio.toFixed(3));
  }
}

console.log("Mmax:", Math.max(...fem.M).toFixed(2), "Mmin:", Math.min(...fem.M).toFixed(2));
console.log("Vmax abs:", Math.max(...fem.V.map(Math.abs)).toFixed(2));
