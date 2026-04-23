"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { StatusDot } from "~/components/console/status-dot";

interface NavItemProps {
  to: string;
  label: string;
  preload?: "intent" | false;
  search?: Record<string, unknown>;
}

export function NavItem({ to, label, preload, search }: NavItemProps) {
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
