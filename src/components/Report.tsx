import type { ReactNode } from "react";
import { Equation } from "@/components/Equation";
import { StatusPill } from "@/components/ui";
import type { CalcBundle, CheckResult, LoadCaseResult, Project } from "@/lib/engine/types";
import { fmt } from "@/lib/utils";

export function Report({ project, bundle, lc }: { project: Project; bundle: CalcBundle; lc: LoadCaseResult | undefined }) {
  let eq = 1;
  const next = () => eq++;
  const d = bundle.derived;
  return (
    <article className="calc-sheet rounded-md p-5 space-y-6 print:border-0 print:shadow-none">
      <header className="border-b-2 border-navy pb-4">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted">Calculation report · {project.meta.status}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-navy">{project.meta.projectName}</h2>
        <p className="text-sm text-muted">{project.meta.option}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Revision</dt>
            <dd>{project.meta.revision}</dd>
          </div>
          <div>
            <dt className="text-muted">Date</dt>
            <dd>{project.meta.date}</dd>
          </div>
          <div>
            <dt className="text-muted">Prepared</dt>
            <dd>{project.meta.preparedBy || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Checked</dt>
            <dd>{project.meta.checkedBy || "INPUT REQUIRED"}</dd>
          </div>
        </dl>
      </header>

      <Callout>
        PRELIMINARY ENGINEERING DESIGN TOOL. This calculation depends on the accuracy of the input soil parameters, groundwater
        conditions, hydraulic assumptions, structural properties, load models, construction sequence and adopted design standards.
        The results shall be reviewed by a suitably qualified structural/geotechnical engineer before construction. A PASS on one
        check does not imply the flood protection structure is verified as a system.
      </Callout>

      <Section title="1. Design objective">
        <p>
          Verify the Option 3 U-shaped precast RC sheet-pile flood embankment with granular core, dual tie rods and RC capping
          beams for persistent, flood, construction, rapid-drawdown and accidental (tie failure) situations, separating structural,
          geotechnical and hydraulic limit states.
        </p>
      </Section>

      <Section title="2. Design basis">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>EN 1990 — Basis of structural design</li>
          <li>EN 1991-1-1 — Densities, self-weight and imposed loads</li>
          <li>EN 1991-2 — Traffic loads on bridges (only if the user calibrates a traffic model)</li>
          <li>EN 1992-1-1 — Design of concrete structures</li>
          <li>EN 1997-1 — Geotechnical design · Design Approach {project.codes.designApproach}</li>
          {project.codes.seismic ? <li>EN 1998 — Seismic (selected)</li> : <li>EN 1998 not applied</li>}
        </ul>
        <p className="mt-2 text-sm">
          <strong>National Annex:</strong> {project.codes.nationalAnnex}
        </p>
        <p className="text-sm">
          <strong>Edition:</strong> {project.codes.edition}
        </p>
        <p className="text-sm">
          Design life {project.codes.designLife} years · {project.codes.consequenceClass} · {project.codes.reliabilityClass} ·{" "}
          {project.codes.executionClass}
        </p>
      </Section>

      <Section title="3. Geometry and materials">
        <table className="eng-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Description</th>
              <th className="num">Value</th>
              <th>Unit</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {bundle.variables.map((v) => (
              <tr key={v.symbol}>
                <td>
                  <Equation latex={v.symbol} display={false} />
                </td>
                <td>{v.description}</td>
                <td className="num">{v.value}</td>
                <td>{v.unit}</td>
                <td className="text-xs">{v.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="4. Earth pressure">
        <p className="text-sm">Rankine (or selected) coefficients on the design friction angle φ'_d = arctan(tan φ'_k / γ_φ).</p>
        <Equation latex={`K_a = \\tan^2\\left(45^\\circ - \\frac{\\varphi'_d}{2}\\right) = ${fmt(d.KaFill, 3)}`} tag={next()} />
        <Equation latex={`K_p = \\tan^2\\left(45^\\circ + \\frac{\\varphi'_d}{2}\\right)\\,\\eta_p = ${fmt(d.KpNative, 2)}`} tag={next()} />
        <Equation latex={`K_0 = 1-\\sin\\varphi'_d = ${fmt(d.K0Fill, 3)}`} tag={next()} />
        <p className="text-sm">
          Vertical effective stress and horizontal soil pressure are computed layer-wise. Water pressure is stored separately and
          not mixed into φ'-based coefficients.
        </p>
        <Equation latex={`\\sigma'_h = K_a \\sigma'_v - 2c'_d\\sqrt{K_a}`} tag={next()} />
        <Equation latex={`p_w(z) = \\gamma_w h_w(z)`} tag={next()} />
        <Equation latex={`p_{net}(z) = p_{soil,in} + p_{sur} + u_{core} - (p_{soil,out} + u_{out})`} tag={next()} />
        {lc ? (
          <p className="text-sm">
            For <em>{lc.name}</em>: fill resultant P_a = {fmt(lc.forces.PaL, 1)} kN/m, upstream water P_w = {fmt(lc.forces.PwL, 1)}{" "}
            kN/m, surcharge P_q = {fmt(lc.forces.PsL, 1)} kN/m, passive (embedment) P_p = {fmt(lc.forces.Pp, 1)} kN/m.
          </p>
        ) : null}
      </Section>

      <Section title="5. Structural analysis">
        <p className="text-sm">
          Each sheet-pile line is a metre-strip beam with flexural rigidity E_cm I_eff, Winkler springs below riverbed (n_h z) and
          elastic tie springs. The granular core is not a rigid diaphragm. Reference clause to be confirmed against the
          project-adopted National Annex / Eurocode edition.
        </p>
        <Equation latex={`EI = E_{cm} I_{eff} = ${fmt(d.Ecm, 0)}\\,\\text{MPa}\\times ${fmt(d.Ig * d.Ecm ? project.sheetPile.IeffFactor : 1, 2)} I_g`} tag={next()} />
        {lc ? (
          <>
            <p className="text-sm">
              Upstream wall: M_Ed,max = {fmt(Math.max(Math.abs(lc.left.Mmax), Math.abs(lc.left.Mmin)), 1)} kNm/m at z ={" "}
              {fmt(lc.left.zMmax, 2)} m; V_Ed,max = {fmt(Math.abs(lc.left.Vmax), 1)} kN/m; δ_max = {fmt(lc.left.dmax, 1)} mm.
            </p>
            <p className="text-sm">
              Downstream wall: M_Ed,max = {fmt(Math.max(Math.abs(lc.right.Mmax), Math.abs(lc.right.Mmin)), 1)} kNm/m; V_Ed,max ={" "}
              {fmt(Math.abs(lc.right.Vmax), 1)} kN/m; δ_max = {fmt(lc.right.dmax, 1)} mm.
            </p>
          </>
        ) : null}
      </Section>

      <Section title="6. RC section (EN 1992-1-1)">
        <Equation latex={`f_{cd} = \\alpha_{cc} f_{ck}/\\gamma_C = ${fmt(d.fcd, 2)}\\,\\text{MPa},\\quad f_{yd}=f_{yk}/\\gamma_S=${fmt(d.fyd, 0)}\\,\\text{MPa}`} tag={next()} />
        <Equation latex={`d = t - c_{nom} - \\phi/2 = ${fmt(d.dEff, 0)}\\,\\text{mm}`} tag={next()} />
        <Equation latex={`x = \\frac{A_s f_{yd}}{0.8 f_{cd} b},\\quad z = d - 0.4x,\\quad M_{Rd}=A_s f_{yd} z`} tag={next()} />
        <Equation latex={`V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}]bd \\ge v_{min}bd`} tag={next()} />
      </Section>

      <Section title="7. Verification of the selected load case">
        {lc ? <CheckTable checks={lc.checks} /> : <p>Select a load case.</p>}
      </Section>

      <Section title="8. Utilization summary (governing across enabled cases)">
        <CheckTable checks={bundle.summary} />
        {bundle.governing ? (
          <p className="mt-3 text-sm">
            Highest reported utilization: <strong>{bundle.governing.name}</strong> η = {fmt(bundle.governing.eta, 2)} (
            {bundle.governing.loadCase}). This is the largest ratio among completed checks; it is not automatically the unique
            governing mechanism of the structure.
          </p>
        ) : null}
      </Section>

      <Section title="9. Calculation QC">
        <table className="eng-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Check</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {bundle.qc.map((q) => (
              <tr key={q.id}>
                <td className="font-mono">{q.id}</td>
                <td>{q.name}</td>
                <td>
                  <StatusPill status={q.status} />
                </td>
                <td>{q.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="10. Warnings and limitations">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {bundle.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </Section>

      <Section title="11. Engineering conclusion">
        <p>
          Based on the stated geometry, material properties, design actions, assumptions, applicable Eurocode provisions and
          National Annex parameters, the proposed U-shaped sheet-pile embankment has been verified for the checks identified in
          this calculation. Overall status: <StatusPill status={bundle.overall} />
        </p>
        <p className="mt-2">
          Critical reported utilization η_max = {fmt(bundle.governing?.eta ?? 0, 2)} ({bundle.governing?.name ?? "—"}). Outstanding
          items: independent geotechnical investigation, National Annex confirmation, specialist seepage analysis, installation
          contractor verification, and a qualified engineer’s review before construction.
        </p>
        {bundle.overall !== "PASS" ? (
          <p className="mt-2 font-medium">
            The design cannot be considered fully verified until every FAIL / WARNING / INPUT REQUIRED item has been closed.
          </p>
        ) : (
          <p className="mt-2">
            Completed checks return PASS against the selected criteria. This is not a statutory approval.
          </p>
        )}
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-navy border-b border-rule pb-1">
        {title}
      </h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return <div className="border border-warn bg-warn-bg px-3 py-2 text-sm text-ink">{children}</div>;
}

function CheckTable({ checks }: { checks: CheckResult[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="eng-table">
        <thead>
          <tr>
            <th>Check</th>
            <th className="num">Demand</th>
            <th className="num">Resistance</th>
            <th>Unit</th>
            <th className="num">η</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {checks
            .filter((c) => c.applicable)
            .map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="num">{fmt(c.demand, 2)}</td>
                <td className="num">{fmt(c.resistance, 2)}</td>
                <td>{c.unit}</td>
                <td className="num">{fmt(c.utilization, 2)}</td>
                <td>
                  <StatusPill status={c.status} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export function CheckDetail({ c }: { c: CheckResult }) {
  return (
    <div className="calc-sheet rounded-md p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display font-semibold text-navy">{c.name}</h4>
        <StatusPill status={c.status} />
      </div>
      <p className="text-sm">{c.explanation}</p>
      <p className="text-xs uppercase tracking-wide text-muted">What loads act · what resists · demand vs resistance</p>
      <Equation latex={c.formula} />
      <p className="font-mono text-xs text-muted">{c.substitution}</p>
      <p className="text-sm">
        Demand {fmt(c.demand, 2)} {c.unit} · Resistance {fmt(c.resistance, 2)} {c.unit} · η = {fmt(c.utilization, 2)}
      </p>
      {c.assumptions.length ? (
        <ul className="list-disc pl-5 text-xs text-muted">
          {c.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
