"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun className={`absolute inset-0 transform transition-transform duration-500 ${theme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`} />
        <Moon className={`absolute inset-0 transform transition-transform duration-500 ${theme === 'dark' ? 'translate-y-0' : '-translate-y-10'}`} />
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
    </button>
  );
}
