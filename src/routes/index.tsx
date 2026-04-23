import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { StatusDot, StatusDotWithLabel } from "~/components/console/status-dot";

export const Route = createFileRoute("/")({
  loader: async () => {
    const landingPage = await getLandingPage();
    return { landingPage };
  },
  component: LandingPageComponent,
});

const getLandingPage = createServerFn({ method: "GET" }).handler(async () => {
  return renderServerComponent(<LandingPageDocument />);
});

function LandingPageComponent() {
  const { landingPage } = Route.useLoaderData();
  return <>{landingPage}</>;
}

const fundamentalExamples = [
  {
    to: "/basic",
    number: "01",
    title: "basic",
    description: "Baseline with no prefetching. Data loads only when the route renders.",
    recommended: true,
  },
  {
    to: "/preloading",
    number: "02",
    title: "preloading",
    description: "Route-level prefetch. Data is fetched in the route loader before rendering.",
  },
  {
    to: "/intent-preloading",
    number: "03",
    title: "intent-preloading",
    description: "Hover-based prefetch. Data loads when the user hovers over a navigation link.",
  },
];

const advancedExamples = [
  {
    to: "/pagination",
    number: "04",
    title: "pagination",
    description:
      "Preloading adjacent pages. Next and previous page data is prefetched automatically.",
  },
  {
    to: "/filters",
    number: "05",
    title: "filters",
    description: "Search with prefetch. Filtered results are prefetched alongside pagination.",
  },
  {
    to: "/debounced-preload-filters",
    number: "06",
    title: "debounced-filters",
    description: "Advanced filter prefetch. Results preload while typing with debounced requests.",
  },
];

function LandingPageDocument() {
  return (
    <main className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Hero */}
      <section className="border-y border-(--border-default) bg-(--bg-secondary)">
        <div className="max-w-4xl mx-auto px-6 py-[clamp(3rem,6vw,6rem)]">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot status="cached" />
            <span className="text-sm font-mono uppercase tracking-wider text-(--text-muted)">
              TanStack Router Demo
            </span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold text-(--text-primary) mb-6 leading-[1.1]">
            Prefetching Patterns
          </h1>
          <p className="text-base text-(--text-secondary) max-w-2xl leading-relaxed">
            A developer console for exploring data prefetching techniques in modern React
            applications. Learn how different patterns affect perceived performance and user
            experience.
          </p>
          <p className="mt-4 text-sm text-(--text-muted) leading-relaxed">
            New here? Each example below builds on the last. Start with the first card to see how
            data fetching behavior changes as you add prefetching.
          </p>
          <div className="mt-8 flex items-center gap-6 text-sm font-mono text-(--text-muted)">
            <StatusDotWithLabel status="cached" label="Cached" />
            <StatusDotWithLabel status="fetching" label="Fetching" />
            <StatusDotWithLabel status="idle" label="Idle" />
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="max-w-4xl mx-auto w-full px-6 py-12">
        <h2 className="text-xl font-semibold uppercase tracking-wider text-(--text-primary) mb-8 pb-4 border-b border-(--border-default)">
          Examples
        </h2>

        {/* Fundamental */}
        <div className="mb-12">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-(--text-muted) mb-4">
            Fundamental
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundamentalExamples.map((example) => (
              <Link
                key={example.to}
                to={example.to}
                className={`example-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-primary) ${example.recommended ? "example-card--recommended" : ""}`}
              >
                {example.recommended && <span className="example-card__badge">Start here</span>}
                <div className="example-card__number">{example.number}</div>
                <div className="example-card__title group-hover:text-(--accent-default) transition-colors duration-fast">
                  {example.title}
                </div>
                <div className="example-card__description">{example.description}</div>
                <div className="mt-4 text-sm font-mono text-(--text-muted) group-hover:text-(--accent-default) transition-colors duration-fast">
                  <span aria-hidden="true">&gt;</span> open
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Advanced */}
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-(--text-muted) mb-4">
            Advanced
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedExamples.map((example) => (
              <Link
                key={example.to}
                to={example.to}
                className="example-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-primary)"
              >
                <div className="example-card__number">{example.number}</div>
                <div className="example-card__title group-hover:text-(--accent-default) transition-colors duration-fast">
                  {example.title}
                </div>
                <div className="example-card__description">{example.description}</div>
                <div className="mt-4 text-sm font-mono text-(--text-muted) group-hover:text-(--accent-default) transition-colors duration-fast">
                  <span aria-hidden="true">&gt;</span> open
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--border-default) bg-(--bg-card) mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 text-sm font-mono text-(--text-muted)">
          <p>
            Built with{" "}
            <a
              href="https://tanstack.com/router/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Router
            </a>
            {" · "}
            <a
              href="https://tanstack.com/query/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Query
            </a>
            {" · "}
            <a
              href="https://tanstack.com/start/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--accent-default) hover:text-(--accent-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-card) transition-colors duration-fast"
            >
              TanStack Start
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
