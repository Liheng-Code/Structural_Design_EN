import React, { useState } from "react";
import { Printer, X, ZoomIn, ZoomOut, FileText, CheckCircle2 } from "lucide-react";
import type { BoredPileProject, BoredPileAnalysisResult } from "@/lib/bored-pile/types";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BoredPileProject;
  results: BoredPileAnalysisResult;
  children: React.ReactNode;
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  project,
  results,
  children,
}: PrintPreviewModalProps) {
  const [zoom, setZoom] = useState<number>(85);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Top Action Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white font-sans shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30 text-cyan-400">
            <FileText className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Print Preview — Engineering Calculation Report</h3>
            <p className="text-xs text-slate-400">
              {project.projectName} (Rev: {project.revision || "00"}) · Date: {project.calculationDate || new Date().toISOString().split("T")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="px-3 font-mono font-medium text-cyan-300">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 15))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700" />

          {/* Print button */}
          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
          >
            <Printer className="size-4" />
            <span>Print / Save PDF</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 rounded-lg text-slate-400 transition"
            title="Close Preview"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Preview Scrollable Area */}
      <div className="flex-1 overflow-auto bg-slate-900/90 p-8 flex flex-col items-center justify-start">
        <div
          className="transition-transform duration-200 origin-top shadow-2xl rounded-xl bg-[#f4f0e6] max-w-[900px] w-full"
          style={{ transform: `scale(${zoom / 100})`, marginBottom: `${(zoom - 100) * 4}px` }}
        >
          {/* A4 Page Break Guide indicator banner */}
          <div className="bg-slate-800 text-slate-400 px-6 py-2 text-[11px] font-mono border-b border-slate-700 flex items-center justify-between rounded-t-xl">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Verified A4 Layout, Headers, & Page Break Boundaries
            </span>
            <span className="text-cyan-400">Design Status: {results.overallStatus}</span>
          </div>

          <div className="p-8 space-y-8 text-slate-900 font-sans text-xs leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
