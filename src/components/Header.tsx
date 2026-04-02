import { Link } from "@tanstack/react-router";

const gears = [
  { to: "/", label: "HOME", gear: null },
  { to: "/basic", label: "BASIC", gear: "G0" },
  { to: "/preloading", label: "LOADER", gear: "G1" },
  { to: "/intent-preloading", label: "INTENT", gear: "G2", preload: "intent" as const },
  { to: "/pagination", label: "ADJACENT", gear: "G3" },
  { to: "/filters", label: "FILTERS", gear: "G4" },
  { to: "/debounced-preload-filters", label: "PREDICT", gear: "G5" },
] as const;

export default function Header() {
  return (
    <header className="bg-[#0a0a0a] border-b-4 border-[#ff2d2d]">
      <nav className="flex flex-row items-stretch overflow-x-auto">
        {gears.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            preload={(item as { preload?: "intent" }).preload}
            activeProps={{ className: "!bg-[#ff2d2d] !text-white" }}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold tracking-wider text-[#888] uppercase hover:text-white hover:bg-[#1a1a1a] transition-colors border-r border-[#222]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {item.gear && <span className="text-[#ff2d2d] font-bold">{item.gear}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
