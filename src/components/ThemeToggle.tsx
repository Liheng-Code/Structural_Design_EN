import React from "react";
import { Sun, Moon } from "lucide-react";
import { useProject } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "compact" | "pill" | "badge";
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = "compact",
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const theme = useProject((s) => s.theme) ?? "light";
  const toggleTheme = useProject((s) => s.toggleTheme);
  const isDark = theme === "dark";

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full p-0.5 border border-rule bg-panel text-ink shadow-xs transition-colors",
          className,
        )}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => {
            if (isDark) toggleTheme();
          }}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all",
            !isDark
              ? "bg-navy text-paper shadow-xs font-semibold"
              : "text-muted hover:text-ink hover:bg-paper-2",
          )}
          aria-pressed={!isDark}
          title="Switch to Paper (Light) theme"
        >
          <Sun className="size-3.5" />
          <span>Paper</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isDark) toggleTheme();
          }}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all",
            isDark
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-xs font-semibold"
              : "text-muted hover:text-ink hover:bg-paper-2",
          )}
          aria-pressed={isDark}
          title="Switch to Dark (Blueprint) theme"
        >
          <Moon className="size-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-rule bg-panel text-ink hover:border-rule-strong hover:bg-paper-2 text-xs font-mono transition-all",
          className,
        )}
        title={isDark ? "Switch to Paper (Light) mode" : "Switch to Dark mode"}
        aria-label={isDark ? "Switch to Paper (Light) mode" : "Switch to Dark mode"}
      >
        {isDark ? (
          <>
            <Moon className="size-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="size-3.5 text-amber-600" />
            <span className="text-navy font-semibold">Paper Mode</span>
          </>
        )}
      </button>
    );
  }

  // Compact variant: icon button with optional label
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-rule bg-panel text-ink hover:border-rule-strong hover:bg-paper-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent",
        className,
      )}
      title={isDark ? "Switch to Paper (Light) theme" : "Switch to Dark theme"}
      aria-label={isDark ? "Switch to Paper (Light) theme" : "Switch to Dark theme"}
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="size-4 text-navy transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel ? (
        <span className="text-xs font-mono font-medium">
          {isDark ? "Paper" : "Dark"}
        </span>
      ) : null}
    </button>
  );
}
