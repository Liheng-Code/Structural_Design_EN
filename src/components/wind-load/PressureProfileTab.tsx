import type { Body } from "./ui";
import { Section, StatCard, Eq } from "./ui";
import { WindPressureProfileChart } from "@/components/diagrams/WindLoadDiagram";

export function PressureProfileTab({ body }: { body: Body }) {
  const { res } = body;
  const n = res.z.length;

  return (
    <div className="space-y-6">
      <Section title="Peak Velocity Pressure Profile qp(z)" hint="EN 1991-1-4 §4.5 — qp(z) = [1+7·Iv(z)]·0.5·ρ·vm(z)², evaluated at the reference height ze(z)">
        <WindPressureProfileChart result={res} />
      </Section>

      <Section title="Profile at Roof Level (z = H)" hint="Illustrative substitution at the top of the height mesh">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="ze(H)" value={`${res.ze[n - 1]}`} unit="m" />
          <StatCard label="cr(H)" value={`${res.cr[n - 1]}`} />
          <StatCard label="Iv(H)" value={`${res.Iv[n - 1]}`} />
          <StatCard label="vm(H)" value={`${res.vm[n - 1]}`} unit="m/s" />
        </div>
        <div className="mt-4">
          <Eq>
            <div>cr(H) = kr·ln(ze/z0) = {res.kr}·ln({res.ze[n - 1]}/{res.z0}) = {res.cr[n - 1]}</div>
            <div className="mt-1">
              vm(H) = cr(H)·co·vb = {res.cr[n - 1]}·co·{res.vb} = {res.vm[n - 1]} m/s
            </div>
            <div className="mt-1">
              Iv(H) = kl/(co·ln(ze/z0)) = {res.Iv[n - 1]}
            </div>
            <div className="mt-1">
              qp(H) = [1+7·{res.Iv[n - 1]}]·0.5·ρ·{res.vm[n - 1]}² = {res.qp[n - 1]} kPa
            </div>
          </Eq>
        </div>
      </Section>

      <Section title="Reference Height ze(z) — Fig 7.4 Strip Logic" hint="Evaluated pointwise on the height mesh, not as discrete bands">
        <ul className="list-disc list-inside space-y-1 font-mono text-xs text-slate-400">
          <li>H ≤ B: ze(z) = H for the full height (single part).</li>
          <li>B &lt; H ≤ 2B: ze(z) = B below H−B, ze(z) = H above (two parts).</li>
          <li>H &gt; 2B: ze(z) = B below B, ze(z) = H above H−B, ze(z) = z (actual local height) in between.</li>
        </ul>
      </Section>
    </div>
  );
}
