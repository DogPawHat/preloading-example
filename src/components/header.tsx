import { Link, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StatusDot } from "~/components/console/status-dot";

interface NavItemProps {
  to: string;
  label: string;
  preload?: "intent" | false;
  search?: Record<string, unknown>;
}

function NavItem({ to, label, preload, search }: NavItemProps) {
  const state = useRouterState();
  const queryClient = useQueryClient();
  const currentPath = state.location.pathname;
  const isActive = currentPath === to;

  const hasCachedData = queryClient.getQueryCache().getAll().length > 0;
  const isFetching = state.isLoading;

  const showStatus = to !== "/";
  let status: "cached" | "fetching" | "idle" = "idle";
  if (isFetching) {
    status = "fetching";
  } else if (hasCachedData && isActive) {
    status = "cached";
  }

  return (
    <Link
      to={to}
      search={search}
      preload={preload}
      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
    >
      {showStatus && <StatusDot status={status} />}
      <span>{label}</span>
    </Link>
  );
}

function ThemeToggle() {
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

export default function Header() {
  return (
    <header className="bg-(--bg-secondary) border-b border-(--border-default)">
      <nav className="flex flex-row items-center">
        <NavItem to="/" label="~/home" />
        <NavItem to="/basic" label="01_basic" />
        <NavItem to="/preloading" label="02_preloading" />
        <NavItem to="/intent-preloading" label="03_intent-preloading" preload="intent" />
        <NavItem to="/pagination" label="04_pagination" />
        <NavItem to="/filters" label="05_filters" />
        <NavItem to="/debounced-preload-filters" label="06_debounced-filters" />
        <ThemeToggle />
      </nav>
    </header>
  );
}
