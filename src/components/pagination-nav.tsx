import { type FileRoutesByPath, Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

interface PaginationNavProps {
  prefetch?: "intent" | "viewport" | "render" | false;
  prevOffset: number | undefined;
  nextOffset: number | undefined;
  to: keyof FileRoutesByPath;
  currentOffset?: number;
}

export function PaginationNav(props: PaginationNavProps) {
  const { prefetch, prevOffset, nextOffset, to, currentOffset = 0 } = props;

  // Calculate page numbers for display
  const currentPage = Math.floor(currentOffset / 20) + 1;
  const prevPage = prevOffset !== undefined ? Math.floor(prevOffset / 20) + 1 : null;
  const nextPage = nextOffset !== undefined ? Math.floor(nextOffset / 20) + 1 : null;

  return (
    <nav className="flex items-center justify-center gap-1 mt-8 font-mono">
      {/* Previous button */}
      <Link
        preload={prefetch}
        to={to}
        search={{ offset: prevOffset }}
        disabled={prevOffset == null}
        className={cn(
          "code-button",
          prevOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>&lt;</span>
        <span>prev</span>
      </Link>

      {/* Separator */}
      <span className="px-2 text-charcoal-muted">|</span>

      {/* Page number indicators */}
      {prevPage && (
        <>
          <Link
            preload={prefetch}
            to={to}
            search={{ offset: prevOffset }}
            className="page-number text-charcoal-muted hover:text-charcoal"
          >
            {prevPage}
          </Link>
          <span className="px-1 text-charcoal-muted">|</span>
        </>
      )}

      {/* Current page */}
      <span className="page-number page-number--active">{currentPage}</span>

      {nextPage && (
        <>
          <span className="px-1 text-charcoal-muted">|</span>
          <Link
            preload={prefetch}
            to={to}
            search={{ offset: nextOffset }}
            className="page-number text-charcoal-muted hover:text-charcoal"
          >
            {nextPage}
          </Link>
        </>
      )}

      {/* Separator */}
      <span className="px-2 text-charcoal-muted">|</span>

      {/* Next button */}
      <Link
        preload={prefetch}
        to={to}
        search={{ offset: nextOffset }}
        disabled={nextOffset == null}
        className={cn(
          "code-button",
          nextOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>next</span>
        <span>&gt;</span>
      </Link>
    </nav>
  );
}
