"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isClicked, setIsClicked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        // Trigger a re-render so any derived state updates
        setTheme("system");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    setTheme((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "system"));
  }, []);

  const icon = theme === "system" ? "◐" : theme === "light" ? "○" : "●";
  const resolved = getResolvedTheme(theme);

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-(--text-muted) shrink-0"
        disabled
        aria-hidden="true"
      >
        <span>◐</span>
        <span className="hidden sm:inline">system</span>
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-(--text-secondary) transition-colors duration-fast ease-default hover:text-(--accent-default) hover:bg-(--accent-subtle) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-secondary) flex-shrink-0"
      title={`Theme: ${resolved} (click to cycle)`}
      aria-label={`Current theme: ${resolved}. Click to cycle.`}
    >
      <span
        className={`text-(--accent-default) inline-block ${isClicked ? "motion-safe:scale-[1.3]" : ""} transition-transform duration-fast`}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{theme}</span>
    </button>
  );
}
