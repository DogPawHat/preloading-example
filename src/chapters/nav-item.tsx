"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { StatusDot } from "~/chapters/status-dot";

interface NavItemProps {
  to: string;
  label: string;
  preload?: "intent" | false;
  search?: Record<string, unknown>;
}

export function NavItem({ to, label, preload, search }: NavItemProps) {
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const isActive = currentPath === to;
  const isLoading = state.isLoading && isActive;

  const showStatus = to !== "/";
  const status = isLoading ? "fetching" : isActive ? "cached" : "idle";

  return (
    <Link
      to={to}
      search={search}
      preload={preload}
      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {showStatus && <StatusDot status={status} />}
      <span>{label}</span>
      {showStatus && (
        <span className="sr-only">
          {status === "fetching" && "— loading"}
          {status === "cached" && "— cached"}
          {status === "idle" && "— idle"}
        </span>
      )}
    </Link>
  );
}
