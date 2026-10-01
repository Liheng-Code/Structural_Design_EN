import React, { useEffect } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { useProject, applyThemeToDOM } from "@/lib/store";
import appCss from "../styles.css?url";

const APP_NAME = "U-Sheet Flood Embankment Calculator";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem("app_theme");
    if (!stored) {
      var raw = localStorage.getItem("eurocode-u-sheet-pile-v2");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.state && parsed.state.theme) {
          stored = parsed.state.theme;
        }
      }
    }
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) {}
})();
`;

function ThemeSync() {
  const theme = useProject((s) => s.theme) ?? "light";
  const setTheme = useProject((s) => s.setTheme);

  useEffect(() => {
    // Check initial localStorage on client mount if store was not hydrated yet
    try {
      const stored = localStorage.getItem("app_theme");
      if ((stored === "dark" || stored === "light") && stored !== theme) {
        setTheme(stored);
      } else {
        applyThemeToDOM(theme);
      }
    } catch {
      applyThemeToDOM(theme);
    }
  }, [theme, setTheme]);

  return null;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0b2545" },
      {
        name: "description",
        content:
          "Eurocode preliminary design calculator for precast RC U-shape sheet pile flood embankments, tie rods and capping beams.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body className="font-sans bg-paper text-ink transition-colors duration-150">
        <PreviewHostBridge />
        <ThemeSync />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
