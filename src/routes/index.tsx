import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

const gears = [
  {
    gear: 0,
    name: "NO PREFETCH",
    desc: "Data fetched after mount. Maximum latency.",
    to: "/basic",
  },
  {
    gear: 1,
    name: "LOADER PREFETCH",
    desc: "Loader fires during navigation. Parallel with render.",
    to: "/preloading",
  },
  {
    gear: 2,
    name: "HOVER PREFETCH",
    desc: "Prefetch on hover intent. Sub-100ms head start.",
    to: "/intent-preloading",
  },
  {
    gear: 3,
    name: "ADJACENT PREFETCH",
    desc: "Next + prev pages prefetched. Zero-latency pagination.",
    to: "/pagination",
  },
  {
    gear: 4,
    name: "FILTERED + PREFETCH",
    desc: "Filtered queries with adjacent page prefetch.",
    to: "/filters",
  },
  {
    gear: 5,
    name: "PREDICTIVE PREFETCH",
    desc: "Debounced predictive prefetch as you type.",
    to: "/debounced-preload-filters",
  },
] as const;

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-12">
        <h1
          className="leading-none font-bold uppercase"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(5rem, 20vw, 16rem)",
            color: "#0a0a0a",
            letterSpacing: "-0.02em",
            lineHeight: 0.85,
          }}
        >
          PREFETCH
        </h1>
        <div className="h-1 bg-[#ff2d2d] w-32 mx-auto my-4" />
        <p
          className="text-2xl uppercase tracking-[0.5em] font-bold"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#888" }}
        >
          Velocity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-5xl w-full border-3 border-[#0a0a0a]">
        {gears.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="group block border-3 border-[#0a0a0a] p-6 hover:bg-[#0a0a0a] hover:text-white transition-colors duration-150"
          >
            <div
              className="text-6xl font-bold mb-2 group-hover:text-[#ff2d2d] transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1 }}
            >
              G{g.gear}
            </div>
            <div
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {g.name}
            </div>
            <p
              className="text-xs leading-relaxed opacity-60"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {g.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
