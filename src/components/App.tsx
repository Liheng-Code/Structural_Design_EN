import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  FolderOpen,
  LogOut,
  Menu,
  Printer,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { CrossSection } from "@/components/diagrams/CrossSection";
import { FreeBody } from "@/components/diagrams/FreeBody";
import { MVDiagram } from "@/components/diagrams/MVDiagram";
import { PressureDiagram } from "@/components/diagrams/PressureDiagram";
import {
  ApproachPanel,
  CappingPanel,
  DesignPanel,
  FloodPanel,
  GeometryPanel,
  LimitsPanel,
  LoadsPanel,
  MaterialsPanel,
  ProjectPanel,
  SheetPanel,
  SoilPanel,
  StagesPanel,
  TiesPanel,
  TrafficPanel,
  WaterPanel,
} from "@/components/Panels";
import { CheckDetail, Report } from "@/components/Report";
import { Button, Card, Field, NumInput, Select, StatusPill, UtilBar } from "@/components/ui";
import { waterForCase, runCalculation, runParametric, runSensitivity } from "@/lib/engine/calculate";
import type { LoadCaseResult, Project } from "@/lib/engine/types";
import { defaultProject } from "@/lib/engine/defaults";
import type { ParametricRow } from "@/lib/engine/types";
import { NAV_ITEMS, useProject } from "@/lib/store";
import { downloadText, fmt } from "@/lib/utils";

export function CalculatorApp() {
  const project = useProject((s) => s.project);
  const nav = useProject((s) => s.nav);
  const setNav = useProject((s) => s.setNav);
  const loadCaseId = useProject((s) => s.loadCaseId);
  const setLoadCase = useProject((s) => s.setLoadCase);
  const setProject = useProject((s) => s.setProject);
  const reset = useProject((s) => s.reset);
  const logout = useProject((s) => s.logout);
  const setActiveModule = useProject((s) => s.setActiveModule);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    void useProject.persist.rehydrate();
  }, []);

  const bundle = useMemo(() => runCalculation(project), [project]);
  const lc = bundle.loadCases.find((c) => c.id === loadCaseId) ?? bundle.loadCases[0];
  const water = useMemo(() => {
    const def = project.loadCases.find((c) => c.id === (lc?.id ?? loadCaseId));
    return def ? waterForCase(project, def) : { up: project.water.floodUp, down: project.water.floodDown, core: 0 };
  }, [project, lc, loadCaseId]);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="title-block no-print sticky top-0 z-30">
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
          <button
            type="button"
            onClick={() => setActiveModule("modules")}
            className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono bg-navy-mid/80 hover:bg-navy-mid border border-cyan-500/40 text-paper transition"
            title="Return to Modules Dashboard"
          >
            <ArrowLeft className="size-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Modules</span>
          </button>
          <button className="lg:hidden min-h-10 min-w-10" onClick={() => setMenu(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[10px] uppercase tracking-[0.22em] text-paper/70">Eurocode · EN 1990 / 1991 / 1992 / 1997</p>
            <h1 className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
              U-Shape Precast RC Sheet Pile · Flood Embankment Calculator
            </h1>
          </div>
          <StatusPill status={bundle.overall} />
          <div className="hidden items-center gap-1 sm:flex">
            <Button variant="ghost" className="text-paper hover:bg-navy-mid" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
            <Button
              variant="ghost"
              className="text-paper hover:bg-navy-mid"
              onClick={() => downloadText(`u-sheet-${project.meta.revision}.json`, JSON.stringify(project, null, 2))}
            >
              <Download className="size-4" /> JSON
            </Button>
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm px-3 text-sm text-paper hover:bg-navy-mid">
              <FolderOpen className="size-4" />
              Load
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const txt = await f.text();
                  setProject({ ...defaultProject(), ...JSON.parse(txt) });
                }}
              />
            </label>
            <Button variant="ghost" className="text-paper hover:bg-navy-mid" onClick={() => reset()}>
              <RotateCcw className="size-4" /> Reset
            </Button>
            <Button variant="ghost" className="text-rose-300 hover:bg-rose-950/50 hover:text-rose-200" onClick={() => logout()}>
              <LogOut className="size-4" /> Logout
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-1.5 text-[11px] text-paper/80 sm:px-4">
          <span className="truncate">{project.meta.option}</span>
          <span className="font-mono tabular-nums">
            H={fmt(project.geometry.retainedHeight, 2)} m · D={fmt(project.geometry.embedment, 2)} m · t=
            {(project.geometry.wallThickness * 1000).toFixed(0)} mm
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside
          className={`no-print z-40 w-64 shrink-0 overflow-y-auto bg-navy-deep lg:sticky lg:top-0 lg:max-h-dvh lg:block ${
            menu ? "fixed inset-y-0 left-0 block pt-12" : "hidden lg:block"
          }`}
        >
          <button className="absolute right-2 top-2 text-paper lg:hidden" onClick={() => setMenu(false)} aria-label="Close">
            <X className="size-5" />
          </button>
          <nav className="flex flex-col py-2">
            {NAV_ITEMS.map((it) => (
              <button
                key={it.id}
                onClick={() => {
                  setNav(it.id);
                  setMenu(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 text-left text-sm min-h-11 ${
                  nav === it.id ? "bg-navy-mid text-paper" : "text-paper/80 hover:bg-navy hover:text-paper"
                }`}
              >
                <span className="w-6 font-mono text-[11px] text-paper/50">{it.n}</span>
                {it.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-4 p-3 sm:p-4 order-1 lg:order-2">
          <p className="no-print text-xs text-muted">
            Preliminary design tool — not a substitute for site investigation or statutory approval. Change any input and all
            diagrams, forces, utilizations and the report update immediately.
          </p>

          <Card title="Interactive cross-section">
            <div className="overflow-x-auto">
              <CrossSection project={project} water={water} traffic={!!lc?.checks && (project.loadCases.find((c) => c.id === lc.id)?.trafficOn ?? false)} />
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <span className="text-xs font-display uppercase tracking-wider text-muted">Load case</span>
            <Select value={lc?.id ?? loadCaseId} onChange={(e) => setLoadCase(e.target.value)} className="max-w-md">
              {bundle.loadCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.name}
                </option>
              ))}
            </Select>
          </div>

          {nav === "project" && <ProjectPanel />}
          {nav === "design" && <DesignPanel />}
          {nav === "geometry" && <GeometryPanel />}
          {nav === "soil" && <SoilPanel />}
          {nav === "water" && <WaterPanel />}
          {nav === "flood" && <FloodPanel />}
          {nav === "traffic" && <TrafficPanel />}
          {nav === "sheet" && <SheetPanel />}
          {nav === "ties" && <TiesPanel />}
          {nav === "capping" && <CappingPanel />}
          {nav === "materials" && <MaterialsPanel />}
          {nav === "loads" && <LoadsPanel />}
          {nav === "approach" && <ApproachPanel />}
          {nav === "limits" && <LimitsPanel />}
          {nav === "stages" && <StagesPanel />}
          {(nav === "results" || nav === "report" || nav === "parametric" || nav === "sensitivity") && null}

          {nav === "results" && lc ? <ResultsBody bundleLc={lc} /> : null}
          {nav === "parametric" ? <ParametricBody /> : null}
          {nav === "sensitivity" ? <SensitivityBody /> : null}
          {nav === "report" ? <Report project={project} bundle={bundle} lc={lc} /> : null}

          {nav !== "report" && lc ? (
            <div className="grid gap-3 lg:grid-cols-2">
              <Card title={`Pressure · ${lc.name}`}>
                <PressureDiagram stations={lc.stations} side="L" />
              </Card>
              <Card title="Free body · upstream wall">
                <FreeBody project={project} lc={lc} />
              </Card>
            </div>
          ) : null}

          {lc && nav === "results" ? (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-navy">Traceable checks</h3>
              {lc.checks
                .filter((c) => c.applicable)
                .slice(0, 12)
                .map((c) => (
                  <CheckDetail key={c.id} c={c} />
                ))}
            </div>
          ) : null}
        </main>

        <aside className="no-print order-2 w-full shrink-0 space-y-3 border-t border-rule p-3 lg:order-3 lg:w-72 lg:border-l lg:border-t-0 lg:p-4">
          <Card title="Overall status">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-navy">{bundle.overall}</span>
              <StatusPill status={bundle.overall} />
            </div>
            {bundle.governing ? (
              <p className="mt-2 text-sm">
                Highest η = <span className="font-mono">{fmt(bundle.governing.eta, 2)}</span>
                <br />
                {bundle.governing.name}
                <br />
                <span className="text-xs text-muted">{bundle.governing.loadCase}</span>
              </p>
            ) : null}
          </Card>
          <Card title="Utilization">
            <div className="space-y-3">
              {bundle.summary.slice(0, 10).map((c) => (
                <UtilBar key={c.id} eta={c.utilization} label={c.name.replace(/ \((upstream|downstream)\)/, "")} />
              ))}
            </div>
          </Card>
          <Card title="QC">
            <ul className="space-y-1 text-xs">
              {bundle.qc.map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-2">
                  <span>{q.name}</span>
                  <StatusPill status={q.status} />
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Local save">
            <p className="text-xs text-muted mb-2">Project is stored in this browser. Export JSON for archive.</p>
            <Button
              className="w-full"
              onClick={() => downloadText(`u-sheet-${project.meta.revision}.json`, JSON.stringify(project, null, 2))}
            >
              <Save className="size-4" /> Save JSON
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ResultsBody({ bundleLc }: { bundleLc: LoadCaseResult; project?: Project }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card title="Moment">
        <MVDiagram analysis={bundleLc.left} mode="M" />
        <p className="mt-1 font-mono text-xs">M_max = {fmt(Math.max(Math.abs(bundleLc.left.Mmax), Math.abs(bundleLc.left.Mmin)), 1)} kNm/m</p>
      </Card>
      <Card title="Shear">
        <MVDiagram analysis={bundleLc.left} mode="V" />
        <p className="mt-1 font-mono text-xs">V_max = {fmt(Math.abs(bundleLc.left.Vmax), 1)} kN/m</p>
      </Card>
      <Card title="Deflection">
        <MVDiagram analysis={bundleLc.left} mode="d" />
        <p className="mt-1 font-mono text-xs">δ_max = {fmt(bundleLc.left.dmax, 1)} mm</p>
      </Card>
      {bundleLc.notes.length ? (
        <Card title="Load-case notes" className="sm:col-span-3">
          <ul className="list-disc pl-5 text-sm space-y-1">
            {bundleLc.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function ParametricBody() {
  const project = useProject((s) => s.project);
  const [key, setKey] = useState<"embedment" | "thickness" | "tieDia" | "spacing">("embedment");
  const [min, setMin] = useState(3);
  const [max, setMax] = useState(10);
  const [step, setStep] = useState(0.5);
  const [rows, setRows] = useState<ParametricRow[] | null>(null);
  return (
    <Card
      title="Parametric study"
      action={
        <Button onClick={() => setRows(runParametric(project, key, min, max, step))}>Run study</Button>
      }
    >
      <p className="mb-3 text-sm text-muted">
        Feasible combinations are listed. The tool does not pick a “best” engineering solution.
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Variable">
          <Select
            value={key}
            onChange={(e) => {
              const k = e.target.value as typeof key;
              setKey(k);
              if (k === "embedment") {
                setMin(3);
                setMax(10);
                setStep(0.5);
              }
              if (k === "thickness") {
                setMin(250);
                setMax(500);
                setStep(50);
              }
              if (k === "tieDia") {
                setMin(25);
                setMax(50);
                setStep(5);
              }
              if (k === "spacing") {
                setMin(6);
                setMax(10);
                setStep(0.5);
              }
            }}
          >
            <option value="embedment">Embedment D (m)</option>
            <option value="thickness">Wall thickness (mm)</option>
            <option value="tieDia">Tie diameter (mm)</option>
            <option value="spacing">Inner wall spacing (m)</option>
          </Select>
        </Field>
        <Field label="Min">
          <NumInput value={min} onChange={setMin} />
        </Field>
        <Field label="Max">
          <NumInput value={max} onChange={setMax} />
        </Field>
        <Field label="Step">
          <NumInput value={step} onChange={setStep} />
        </Field>
      </div>
      {rows ? (
        <div className="mt-4 overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th className="num">Value</th>
                <th className="num">MEd</th>
                <th className="num">VEd</th>
                <th className="num">Tmax</th>
                <th className="num">δmax</th>
                <th className="num">η max</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.value}>
                  <td className="num">{fmt(r.value, 2)}</td>
                  <td className="num">{fmt(r.MEd, 1)}</td>
                  <td className="num">{fmt(r.VEd, 1)}</td>
                  <td className="num">{fmt(r.Tmax, 1)}</td>
                  <td className="num">{fmt(r.dmax, 1)}</td>
                  <td className="num">{fmt(r.etaMax, 2)}</td>
                  <td>
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted">
            Solutions satisfying η ≤ 1.00: {rows.filter((r) => r.status === "PASS" || r.status === "WARNING").length} of {rows.length}.
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function SensitivityBody() {
  const project = useProject((s) => s.project);
  const [rows, setRows] = useState<ReturnType<typeof runSensitivity> | null>(null);
  return (
    <Card title="Sensitivity" action={<Button onClick={() => setRows(runSensitivity(project))}>Run sensitivity</Button>}>
      <p className="mb-3 text-sm text-muted">
        Each row is a single-parameter perturbation from the current design. Large |Δη| identifies sensitive inputs.
      </p>
      {rows ? (
        <table className="eng-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Perturbation</th>
              <th className="num">ΔMEd %</th>
              <th className="num">ΔT %</th>
              <th className="num">Δη %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.delta}</td>
                <td className="num">{fmt(r.dM, 1)}</td>
                <td className="num">{fmt(r.dT, 1)}</td>
                <td className="num">{fmt(r.dEta, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Card>
  );
}
