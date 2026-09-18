import katex from "katex";
import { useMemo } from "react";

export function Equation({ latex, display = true, tag }: { latex: string; display?: boolean; tag?: string | number }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: display, throwOnError: false, output: "html" });
    } catch {
      return latex;
    }
  }, [latex, display]);
  return (
    <div className="relative my-2 overflow-x-auto">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {tag !== undefined ? (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">({tag})</span>
      ) : null}
    </div>
  );
}

export function InlineMath({ latex }: { latex: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: false, throwOnError: false, output: "html" });
    } catch {
      return latex;
    }
  }, [latex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
