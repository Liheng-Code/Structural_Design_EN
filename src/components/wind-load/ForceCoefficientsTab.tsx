import type { Body } from "./ui";
import { Section, StatCard, Eq } from "./ui";

export function ForceCoefficientsTab({ body }: { body: Body }) {
  const { res } = body;

  return (
    <div className="space-y-6">
      <Section title="Force Coefficient cf" hint="EN 1991-1-4 §7.6, Fig 7.23 (digitized), Table 7.16 / Fig 7.36 for end effects">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="d/b" value={`${res.dOverB}`} />
          <StatCard label="cf,0" value={`${res.cf0}`} sub="digitized from Fig 7.23" />
          <StatCard label="ψλ" value={`${res.psiLambda}`} sub={`λ = ${res.lambda} (l/b = ${res.lOverB})`} />
          <StatCard label="cf" value={`${res.cf}`} sub="cf = cf,0·ψr·ψλ" />
        </div>
        <div className="mt-4">
          <Eq>
            <div>ψr = {res.psiR} (sharp corners assumed — scope-bounding simplification)</div>
            <div className="mt-1">cf = {res.cf0} × {res.psiR} × {res.psiLambda} = {res.cf}</div>
          </Eq>
        </div>
      </Section>

      <Section title="Structural Factor cscd — Annex B Closed-Form" hint="Background factor B² (B.2) + resonant factor R² (B.3), no iteration required">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="zs" value={`${res.zs}`} unit="m" sub="max(0.6H, zmin)" />
          <StatCard label="L(zs)" value={`${res.Lzs}`} unit="m" sub={`α = ${res.alphaTL}`} />
          <StatCard label="B²" value={`${res.B2}`} sub="background factor" />
          <StatCard label="R²" value={`${res.R2}`} sub="resonant factor" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Eq>
            <div>n1 = {res.n1} Hz · fL = n1·L(zs)/vm(zs) = {res.fL}</div>
            <div className="mt-1">SL = 6.8·fL/(1+10.2·fL)^(5/3) = {res.SL}</div>
            <div className="mt-1">ηh = {res.etaH} → Rh = {res.Rh} · ηb = {res.etaB} → Rb = {res.Rb}</div>
          </Eq>
          <Eq>
            <div>R² = (π²/2δs)·SL·Rh·Rb = {res.R2}</div>
            <div className="mt-1">ν = max(n1·√(R²/(B²+R²)), 0.08) = {res.nu} Hz</div>
            <div className="mt-1">kp = max(√(2ln(νT))+0.6/√(2ln(νT)), 3.0) = {res.kp}</div>
          </Eq>
        </div>
        <div className="mt-4">
          <Eq>
            <div>
              cscd = (1+2kp·Iv(zs)·√(B²+R²)) / (1+7·Iv(zs)) = {res.cscd}
            </div>
          </Eq>
        </div>
      </Section>
    </div>
  );
}
