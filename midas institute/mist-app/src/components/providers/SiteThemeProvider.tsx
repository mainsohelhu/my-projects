"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type SiteTheme = "default" | "purple-dark" | "red-white" | "custom";

export interface CustomThemeConfig {
  primary: string;
  bg: string;
  surface: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  shadow: string;
}

interface SiteThemeContextType {
  theme: SiteTheme;
  customConfig: CustomThemeConfig | null;
  setTheme: (theme: SiteTheme, config?: CustomThemeConfig) => Promise<void>;
  isLoading: boolean;
}

const SiteThemeContext = createContext<SiteThemeContextType>({
  theme: "default",
  customConfig: null,
  setTheme: async () => {},
  isLoading: false,
});

export function useSiteTheme() {
  return useContext(SiteThemeContext);
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;)\\s*" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function applyThemeClass(theme: SiteTheme, config?: CustomThemeConfig | null) {
  const html = document.documentElement;
  // Remove all theme classes
  html.classList.remove("theme-purple-dark", "theme-red-white", "theme-custom");
  
  if (theme === "purple-dark") {
    html.classList.add("theme-purple-dark");
  } else if (theme === "red-white") {
    html.classList.add("theme-red-white");
  } else if (theme === "custom") {
    html.classList.add("theme-custom");
    if (config) {
      applyCustomThemeVariables(config);
    }
  } else {
    // Reset custom variables if not custom theme
    clearCustomThemeVariables();
  }
}

function applyCustomThemeVariables(config: CustomThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.primary);
  root.style.setProperty('--background', config.bg);
  root.style.setProperty('--bg-deep', config.surface);
  root.style.setProperty('--foreground', config.text);
  root.style.setProperty('--text-dim', config.subtext);
  root.style.setProperty('--glass-border', config.border);
  // Also common variables
  root.style.setProperty('--pd-card', config.card); // used for card-like elements
  root.style.setProperty('--rw-card', config.card);
}

function clearCustomThemeVariables() {
  const root = document.documentElement;
  root.style.removeProperty('--color-primary');
  root.style.removeProperty('--background');
  root.style.removeProperty('--bg-deep');
  root.style.removeProperty('--foreground');
  root.style.removeProperty('--text-dim');
  root.style.removeProperty('--glass-border');
  root.style.removeProperty('--pd-card');
  root.style.removeProperty('--rw-card');
}

interface Props {
  children: ReactNode;
  initialTheme?: SiteTheme;
  initialCustomConfig?: CustomThemeConfig | null;
}

export function SiteThemeProvider({ 
  children, 
  initialTheme = "default",
  initialCustomConfig = null
}: Props) {
  const [theme, setThemeState] = useState<SiteTheme>(initialTheme);
  const [customConfig, setCustomConfigState] = useState<CustomThemeConfig | null>(initialCustomConfig);
  const [isLoading, setIsLoading] = useState(false);

  // Apply on mount — ensure DOM matches state
  useEffect(() => {
    applyThemeClass(theme, customConfig);
  }, []);

  // Apply whenever theme changes explicitly
  useEffect(() => {
    applyThemeClass(theme, customConfig);
  }, [theme, customConfig]);

  const setTheme = useCallback(async (newTheme: SiteTheme, config?: CustomThemeConfig) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/site-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          theme: newTheme,
          customConfig: config || null
        }),
      });
      if (res.ok) {
        setThemeState(newTheme);
        if (config) setCustomConfigState(config);
        applyThemeClass(newTheme, config || customConfig);
      }
    } catch (err) {
      console.error("Failed to save theme:", err);
    } finally {
      setIsLoading(false);
    }
  }, [customConfig]);

  return (
    <SiteThemeContext.Provider value={{ theme, customConfig, setTheme, isLoading }}>
      {children}
    </SiteThemeContext.Provider>
  );
}
