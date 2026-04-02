import { Link, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

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

  // Determine cache status based on query keys
  // This is a simplified check - in reality you'd check specific query keys
  const hasCachedData = queryClient.getQueryCache().getAll().length > 0;
  const isFetching = state.isLoading;

  // Show status dot for certain routes
  const showStatus = to !== "/";
  let statusClass = "status-dot--idle";
  if (isFetching) {
    statusClass = "status-dot--fetching";
  } else if (hasCachedData && isActive) {
    statusClass = "status-dot--cached";
  }

  return (
    <Link
      to={to}
      search={search}
      preload={preload}
      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
    >
      {showStatus && <span className={`status-dot ${statusClass}`} />}
      <span>{label}</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="bg-warm border-b border-hairline">
      <nav className="flex flex-row items-center">
        <NavItem to="/" label="~/home" />
        <NavItem to="/basic" label="01_basic" />
        <NavItem to="/preloading" label="02_preloading" />
        <NavItem to="/intent-preloading" label="03_intent-preloading" preload="intent" />
        <NavItem to="/pagination" label="04_pagination" />
        <NavItem to="/filters" label="05_filters" />
        <NavItem to="/debounced-preload-filters" label="06_debounced" />
      </nav>
    </header>
  );
}
