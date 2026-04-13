import { type FileRoutesByPath, Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

interface PaginationNavProps {
  prefetch?: "intent" | "viewport" | "render" | false;
  prevOffset: number | undefined;
  nextOffset: number | undefined;
  to: keyof FileRoutesByPath;
}

export function PaginationNav(props: PaginationNavProps) {
  const { prefetch, prevOffset, nextOffset, to } = props;

  return (
    <nav className="flex items-center justify-center gap-1 mt-8 font-mono">
      {/* Previous button */}
      <Link
        preload={prefetch}
        to={to}
        search={{ offset: prevOffset }}
        disabled={prevOffset == null}
        className={cn(
          "inline-flex items-center gap-2",
          "px-3 py-2",
          "border border-[var(--border-default)]",
          "bg-[var(--bg-secondary)]",
          "font-mono text-sm",
          "text-[var(--text-primary)]",
          "transition-all duration-fast ease-default",
          "hover:border-[var(--accent-default)] hover:bg-[var(--accent-subtle)]",
          prevOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>&lt;</span>
        <span>prev</span>
      </Link>

      {/* Separator */}
      <span className="px-2 text-[var(--text-muted)]">|</span>

      {/* Next button */}
      <Link
        preload={prefetch}
        to={to}
        search={{ offset: nextOffset }}
        disabled={nextOffset == null}
        className={cn(
          "inline-flex items-center gap-2",
          "px-3 py-2",
          "border border-[var(--border-default)]",
          "bg-[var(--bg-secondary)]",
          "font-mono text-sm",
          "text-[var(--text-primary)]",
          "transition-all duration-fast ease-default",
          "hover:border-[var(--accent-default)] hover:bg-[var(--accent-subtle)]",
          nextOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>next</span>
        <span>&gt;</span>
      </Link>
    </nav>
  );
}
