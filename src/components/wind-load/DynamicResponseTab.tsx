import type { Body } from "./ui";
import { Section, StatCard, Eq, ChecksTable } from "./ui";

export function DynamicResponseTab({ body }: { body: Body }) {
  const { res } = body;
  const slsChecks = res.checks.filter((c) => c.category === "SLS");

  return (
    <div className="space-y-6">
      <Section title="Along-Wind Tip Deflection" hint="Cantilever equilibrium integration of Fw,dist(z) using an EI derived from n1 and the assumed uniform mass per unit height">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="EI (effective)" value={`${res.eiEff.toLocaleString()}`} unit="kN.m²" sub="from n1 + uniform mass/height" />
          <StatCard label="Tip deflection" value={`${res.tipDeflectionM}`} unit="m" sub={`≈ H/${res.driftRatioDenominator}`} />
          <StatCard label="Drift limit" value={`${res.driftLimitM}`} unit="m" sub="engineering-judgement placeholder" />
        </div>
        <div className="mt-4">
          <Eq>
            <div>EI_eff = m·h⁴·(2π·n1/1.875²)² = {res.eiEff.toLocaleString()} kN.m²</div>
            <div className="mt-1">κ(z) = M(z)/EI_eff, integrated twice (trapezoidal quadrature) from the fixed base → δ_tip = {res.tipDeflectionM} m</div>
          </Eq>
        </div>
      </Section>

      <Section title="Occupant Comfort — Along-Wind Acceleration" hint="EN 1991-1-4 Annex B.4 (closed-form) — benchmarked against ISO 10137, not a codified Eurocode limit">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="RMS acceleration σa" value={`${res.sigmaAccel}`} unit="m/s²" />
          <StatCard label="Peak acceleration â = kp·σa" value={`${res.peakAccel}`} unit="m/s²" tone={res.peakAccel > 0 ? "amber" : "emerald"} />
        </div>
        <div className="mt-4">
          <Eq>
            <div>
              σa(H) = cf·ρ·b·Iv(zs)·vm(zs)²·(R/m1e)·Kx = {res.sigmaAccel} m/s²
            </div>
            <div className="mt-1">â(H) = kp·σa = {res.kp}×{res.sigmaAccel} = {res.peakAccel} m/s²</div>
            <div className="mt-2 text-amber-300">
              Caveat: a real comfort assessment uses a reduced-return-period (typically 1-year) wind speed, not the 50-year ULS vb reused
              here. This is flagged INPUT REQUIRED and the check below is labelled informative accordingly.
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="SLS Checks" hint="Along-wind drift and comfort — both engineering-judgement / informative benchmarks, not codified ULS/SLS Eurocode limits">
        <ChecksTable checks={slsChecks} />
      </Section>
    </div>
  );
}
