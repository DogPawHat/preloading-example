import { NavItem } from "./nav-item";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
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
