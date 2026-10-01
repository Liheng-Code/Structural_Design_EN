import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Project } from "./engine/types";
import { defaultProject } from "./engine/defaults";

export type NavId =
  | "project"
  | "design"
  | "geometry"
  | "soil"
  | "water"
  | "flood"
  | "traffic"
  | "sheet"
  | "ties"
  | "capping"
  | "materials"
  | "loads"
  | "approach"
  | "limits"
  | "results"
  | "report"
  | "parametric"
  | "sensitivity"
  | "stages";

export type PlatformModule = "modules" | "sheet-pile" | "cbp" | "cbp-detail" | "bored-pile" | "pile-cap" | "retaining-wall" | "basement-wall" | "wind-load";

export type ThemeMode = "light" | "dark";

export function applyThemeToDOM(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("app_theme", theme);
  } catch {
    // Ignore storage write failures (e.g. private mode or quota exceeded)
    void 0;
  }
}

interface Store {
  project: Project;
  nav: NavId;
  loadCaseId: string;
  highlight: string | null;
  isAuthenticated: boolean;
  userEmail: string;
  activeModule: PlatformModule;
  theme: ThemeMode;
  setNav: (n: NavId) => void;
  setLoadCase: (id: string) => void;
  setHighlight: (s: string | null) => void;
  setProject: (p: Project) => void;
  setActiveModule: (m: PlatformModule) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  patch: (fn: (p: Project) => void) => void;
  reset: () => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export const NAV_ITEMS: { id: NavId; n: string; label: string }[] = [
  { id: "project", n: "1", label: "Project" },
  { id: "design", n: "2", label: "Design type" },
  { id: "geometry", n: "3", label: "Geometry & Load" },
  { id: "soil", n: "4", label: "Soil" },
  { id: "water", n: "5", label: "Groundwater" },
  { id: "flood", n: "6", label: "Flood" },
  { id: "traffic", n: "7", label: "Traffic" },
  { id: "sheet", n: "8", label: "Sheet pile" },
  { id: "ties", n: "9", label: "Tie rods" },
  { id: "capping", n: "10", label: "Capping beam" },
  { id: "materials", n: "11", label: "Materials" },
  { id: "loads", n: "12", label: "Load cases" },
  { id: "approach", n: "13", label: "Design approach" },
  { id: "limits", n: "14", label: "Limits" },
  { id: "stages", n: "15", label: "Construction stages" },
  { id: "results", n: "16", label: "Results" },
  { id: "parametric", n: "17", label: "Parametric study" },
  { id: "sensitivity", n: "18", label: "Sensitivity" },
  { id: "report", n: "19", label: "Report" },
];

export const useProject = create<Store>()(
  persist(
    (set) => ({
      project: defaultProject(),
      nav: "results",
      loadCaseId: "LC-05",
      highlight: null,
      isAuthenticated: false,
      userEmail: "str.design.test",
      activeModule: "modules",
      theme: "light",
      setNav: (nav) => set({ nav }),
      setLoadCase: (loadCaseId) => set({ loadCaseId }),
      setHighlight: (highlight) => set({ highlight }),
      setProject: (project) => set({ project }),
      setTheme: (theme) => {
        applyThemeToDOM(theme);
        set({ theme });
      },
      toggleTheme: () => {
        set((s) => {
          const nextTheme = s.theme === "dark" ? "light" : "dark";
          applyThemeToDOM(nextTheme);
          return { theme: nextTheme };
        });
      },
      setActiveModule: (activeModule) =>
        set((s) => ({
          activeModule,
          project:
            activeModule === "cbp"
              ? { ...s.project, wallSystem: "cbp", cbp: s.project.cbp ?? defaultProject().cbp }
              : activeModule === "sheet-pile"
                ? { ...s.project, wallSystem: "sheet-pile" }
                : s.project,
        })),
      patch: (fn) =>
        set((s) => {
          const project = structuredClone(s.project);
          fn(project);
          return { project };
        }),
      reset: () => set({ project: defaultProject(), loadCaseId: "LC-05" }),
      login: (email, pass) => {
        if (pass === "123!test") {
          set({ isAuthenticated: true, userEmail: email || "str.design.test", activeModule: "modules" });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, activeModule: "modules" }),
    }),
    {
      name: "eurocode-u-sheet-pile-v2",
      storage: createJSONStorage(() => (typeof window === "undefined" ? {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } : localStorage)),
      partialize: (s) => ({
        project: s.project,
        loadCaseId: s.loadCaseId,
        isAuthenticated: s.isAuthenticated,
        userEmail: s.userEmail,
        activeModule: s.activeModule,
        theme: s.theme,
      }),
      skipHydration: true,
    },
  ),
);

