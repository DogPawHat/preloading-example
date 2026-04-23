"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "system" | "light" | "dark" | null;
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

  const cycleTheme = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    setTheme((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "system"));
  };

  const icon = theme === "system" ? "◐" : theme === "light" ? "○" : "●";

  return (
    <button
      onClick={cycleTheme}
      className={`nav-link ml-auto ${isClicked ? "theme-toggle-clicked" : ""}`}
      title={`Theme: ${theme} (click to cycle)`}
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <span className="text-(--accent-default) theme-toggle-icon">{icon}</span>
      <span className="hidden sm:inline">{theme}</span>
    </button>
  );
}
