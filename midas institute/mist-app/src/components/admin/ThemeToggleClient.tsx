"use client";

import { useSiteTheme } from "@/components/providers/SiteThemeProvider";
import { Palette, Sun, Moon, Check, Loader2, Flame, Globe, Sparkles } from "lucide-react";
import { useState } from "react";

type ThemeOption = {
  id: "default" | "purple-dark" | "red-white" | "custom";
  label: string;
  description: string;
  icon: React.ReactNode;
  preview: {
    bg: string;
    accent: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    glow: string;
  };
};

const themes: ThemeOption[] = [
  {
    id: "default",
    label: "Classic MIST",
    description: "Original clean white background with lime-green accents. Professional, bright, and easy to read.",
    icon: <Sun size={22} />,
    preview: {
      bg: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      accent: "#a3e635",
      card: "#ffffff",
      text: "#050505",
      subtext: "#6b7280",
      border: "rgba(0,0,0,0.08)",
      glow: "rgba(163,230,53,0.25)",
    },
  },
  {
    id: "purple-dark",
    label: "Purple Dark",
    description: "Midnight violet background with electric purple accents. Premium, modern, and mysterious.",
    icon: <Moon size={22} />,
    preview: {
      bg: "linear-gradient(135deg, #090510 0%, #12081c 100%)",
      accent: "#8b5cf6",
      card: "#1a0c28",
      text: "#f3f0ff",
      subtext: "#a78bfa",
      border: "rgba(139, 92, 246, 0.2)",
      glow: "rgba(139, 92, 246, 0.3)",
    },
  },
  {
    id: "red-white",
    label: "Red White",
    description: "Vibrant crimson accents on a clean white base. Energetic, bold, and highly readable.",
    icon: <Flame size={22} />,
    preview: {
      bg: "#ffffff",
      accent: "#e11d48",
      card: "#ffffff",
      text: "#0f172a",
      subtext: "#475569",
      border: "rgba(225, 29, 72, 0.1)",
      glow: "rgba(225, 29, 72, 0.2)",
    },
  },
  {
    id: "custom",
    label: "Custom Theme",
    description: "Create your own unique color palette. Fully control primary colors, backgrounds, and more.",
    icon: <Palette size={22} />,
    preview: {
      bg: "#f1f5f9",
      accent: "#6366f1",
      card: "#ffffff",
      text: "#1e293b",
      subtext: "#64748b",
      border: "rgba(99, 102, 241, 0.1)",
      glow: "rgba(99, 102, 241, 0.2)",
    },
  },
];

function ThemePreviewCard({ opt, isActive, onSelect, isLoading }: {
  opt: ThemeOption;
  isActive: boolean;
  onSelect: () => void;
  isLoading: boolean;
}) {
  const p = opt.preview;
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={`group relative w-full text-left rounded-3xl border-2 overflow-hidden transition-all duration-300 focus:outline-none ${
        isActive
          ? "border-transparent ring-2 ring-offset-2 scale-[1.02] shadow-2xl"
          : "border-slate-200 hover:border-slate-300 hover:scale-[1.01] hover:shadow-xl"
      }`}
      style={{
        boxShadow: isActive ? `0 20px 60px ${p.glow}` : undefined,
        borderColor: isActive ? p.accent : undefined,
      }}
    >
      {/* Active badge */}
      {isActive && (
        <div
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: p.accent }}
        >
          <Check size={14} className="text-white font-bold" strokeWidth={3} />
        </div>
      )}

      {/* Theme mini-preview */}
      <div
        className="h-48 w-full relative overflow-hidden"
        style={{ background: p.bg }}
      >
        {/* Simulated navbar */}
        <div
          className="absolute top-0 left-0 right-0 h-10 flex items-center px-4 gap-2"
          style={{ background: p.card, borderBottom: `1px solid ${p.border}` }}
        >
          <div className="w-5 h-5 rounded-md" style={{ background: p.accent, opacity: 0.9 }} />
          <div className="h-2 w-16 rounded-full" style={{ background: p.subtext, opacity: 0.4 }} />
          <div className="ml-auto flex gap-2">
            <div className="h-2 w-8 rounded-full" style={{ background: p.subtext, opacity: 0.3 }} />
            <div className="h-2 w-8 rounded-full" style={{ background: p.subtext, opacity: 0.3 }} />
            <div className="h-5 w-14 rounded-full" style={{ background: p.accent, opacity: 0.85 }} />
          </div>
        </div>

        {/* Simulated content */}
        <div className="absolute top-14 left-4 right-4 space-y-2">
          <div className="h-3 w-32 rounded-full" style={{ background: p.text, opacity: 0.8 }} />
          <div className="h-2 w-48 rounded-full" style={{ background: p.subtext, opacity: 0.5 }} />
          <div className="flex gap-2 mt-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-16 rounded-2xl"
                style={{
                  background: p.card,
                  border: `1px solid ${p.border}`,
                  boxShadow: `0 4px 20px ${p.glow}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Glow orb */}
        <div
          className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-40 blur-2xl"
          style={{ background: p.accent }}
        />
      </div>

      {/* Info section */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${p.accent}20`, color: p.accent }}
          >
            {opt.icon}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
            {isActive && (
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: p.accent }}>
                ● Currently Active
              </div>
            )}
          </div>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">{opt.description}</p>
      </div>
    </button>
  );
}

export default function ThemeToggleClient() {
  const { theme, customConfig, setTheme, isLoading } = useSiteTheme();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [localConfig, setLocalConfig] = useState(customConfig || {
    primary: "#e11d48",
    bg: "#ffffff",
    surface: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    subtext: "#64748b",
    border: "rgba(0,0,0,0.1)",
    shadow: "rgba(0,0,0,0.1)"
  });

  const handleSelect = async (themeId: "default" | "purple-dark" | "red-white" | "custom") => {
    if (themeId === theme && themeId !== "custom") return;
    await setTheme(themeId, themeId === "custom" ? localConfig : undefined);
    setSuccessMsg(`Theme switched to "${themes.find(t => t.id === themeId)?.label}"!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCustomUpdate = (field: string, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={20} />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-slate-900">Website Theme</h2>
          </div>
          <p className="text-slate-500 text-sm ml-[52px]">
            Choose the color scheme for the public-facing website. Changes apply instantly for all visitors.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <Globe size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Live Preview</span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-fade-in">
          <Check size={16} className="text-green-500" />
          {successMsg}
        </div>
      )}

      {/* Theme grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((opt) => (
          <ThemePreviewCard
            key={opt.id}
            opt={opt}
            isActive={theme === opt.id}
            onSelect={() => handleSelect(opt.id)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Custom Theme Builder Section */}
      {theme === "custom" && (
        <div className="p-8 rounded-[32px] bg-white border-2 border-primary/20 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Custom Theme Builder</h3>
                <p className="text-xs text-slate-400 font-medium">Design your unique institute aesthetic</p>
              </div>
            </div>
            <button
              onClick={() => handleSelect("custom")}
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save & Apply Colors"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Color controls */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Colors</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Primary Accent</span>
                  <input 
                    type="color" 
                    value={localConfig.primary} 
                    onChange={(e) => handleCustomUpdate("primary", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Background</span>
                  <input 
                    type="color" 
                    value={localConfig.bg} 
                    onChange={(e) => handleCustomUpdate("bg", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Surface & UI</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Surface Color</span>
                  <input 
                    type="color" 
                    value={localConfig.surface} 
                    onChange={(e) => handleCustomUpdate("surface", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Card Background</span>
                  <input 
                    type="color" 
                    value={localConfig.card} 
                    onChange={(e) => handleCustomUpdate("card", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Typography</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Main Text</span>
                  <input 
                    type="color" 
                    value={localConfig.text} 
                    onChange={(e) => handleCustomUpdate("text", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Subtext / Dim</span>
                  <input 
                    type="color" 
                    value={localConfig.subtext} 
                    onChange={(e) => handleCustomUpdate("subtext", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-4 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin text-primary" />
          Applying theme across the website...
        </div>
      )}

      {/* Info box */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
        <Sparkles size={18} className="text-primary mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-bold text-slate-700 mb-1">How it works</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The selected theme is saved to the database and applied site-wide via a secure cookie. 
            All new visitors will immediately see the updated theme. No caching or delays.
          </p>
        </div>
      </div>
    </div>
  );
}
