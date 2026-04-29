import { Link } from "@tanstack/react-router";
import { ChapterSelect } from "./chapter-navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-(--bg-secondary) border-b border-(--border-default)">
      <div className="mx-auto flex min-h-12 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-baseline gap-3 py-3 text-(--text-primary) hover:text-(--accent-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >
          <span className="font-display text-base font-semibold leading-none sm:hidden">
            Prefetching
          </span>
          <span className="hidden font-display text-lg font-semibold leading-none sm:inline">
            Prefetching Patterns
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2" aria-label="Reader navigation">
          <ChapterSelect />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
