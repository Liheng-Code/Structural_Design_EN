import type { CbpInteractionResult } from "@/lib/engine/types";
import { fmt } from "@/lib/utils";

export function NMInteractionDiagram({ interaction, title }: { interaction: CbpInteractionResult; title: string }) {
  const { envelope, operating, utilization } = interaction;
  if (!envelope.length) return null;

  const maxM = Math.max(10, ...envelope.map((p) => p.M), Math.abs(operating.MEd));
  const Ns = envelope.map((p) => p.N);
  const maxN = Math.max(...Ns, operating.NEd, 0);
  const minN = Math.min(...Ns, operating.NEd, 0);

  const W = 420;
  const H = 420;
  const ml = 56;
  const mr = 16;
  const mt = 16;
  const mb = 32;
  const midX = ml + (W - ml - mr) / 2;
  const sx = (m: number) => midX + (m / maxM) * ((W - ml - mr) / 2);
  const sy = (n: number) => mt + ((maxN - n) / Math.max(maxN - minN, 1e-6)) * (H - mt - mb);

  const upper = envelope.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.M).toFixed(1)} ${sy(p.N).toFixed(1)}`).join(" ");
  const lower = [...envelope].reverse().map((p) => `L ${sx(-p.M).toFixed(1)} ${sy(p.N).toFixed(1)}`).join(" ");
  const path = `${upper} ${lower} Z`;

  const opX = sx(operating.MEd);
  const opY = sy(operating.NEd);
  const color = utilization > 1 ? "#9b2f28" : utilization >= 0.9 ? "#8a6414" : "#1f6b45";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-panel" role="img" aria-label={title}>
      <rect width={W} height={H} fill="var(--color-panel)" />
      <line x1={ml} y1={sy(0)} x2={W - mr} y2={sy(0)} stroke="var(--color-rule)" />
      <line x1={midX} y1={mt} x2={midX} y2={H - mb} stroke="var(--color-rule)" />
      <path d={path} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="1.8" />
      <line x1={midX} y1={sy(0)} x2={opX} y2={opY} stroke={color} strokeWidth="1.2" strokeDasharray="4 3" />
      <circle cx={opX} cy={opY} r="4.5" fill={color} stroke="var(--color-ink)" strokeWidth="0.75" />
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--color-muted)" fontFamily="IBM Plex Sans">
        {title} · η = {fmt(utilization, 2)}
      </text>
      <text x={6} y={mt + 8} fontSize="10" fill="var(--color-muted)" fontFamily="IBM Plex Mono">
        N={fmt(maxN, 0)}
      </text>
      <text x={6} y={H - mb} fontSize="10" fill="var(--color-muted)" fontFamily="IBM Plex Mono">
        N={fmt(minN, 0)}
      </text>
      <text x={midX} y={mt - 4 < 10 ? 10 : mt - 4} textAnchor="middle" fontSize="9" fill="var(--color-muted)" fontFamily="IBM Plex Mono">
        M (kNm)
      </text>
    </svg>
  );
}
