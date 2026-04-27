import { NavItem } from "./nav-item";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { to: "/", label: "~/home" },
  { to: "/basic", label: "01_basic" },
  { to: "/preloading", label: "02_preloading" },
  { to: "/intent-preloading", label: "03_intent-preloading", preload: "intent" as const },
  { to: "/pagination", label: "04_pagination", preload: "intent" as const },
  { to: "/filters", label: "05_filters", preload: "intent" as const },
  { to: "/debounced-preload-filters", label: "06_debounced-filters", preload: "intent" as const },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-(--bg-secondary) border-b border-(--border-default)">
      <div className="flex items-center">
        <nav
          className="flex flex-1 flex-row items-center overflow-x-auto scrollbar-thin"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} preload={item.preload} />
          ))}
        </nav>
        <div className="relative flex-hteshrink-0">
          <div
            className="pointer-events-none absolute -left-6 top-0 bottom-0 w-6 bg-linear-to-l from-(--bg-secondary) to-transparent"
            aria-hidden="true"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
