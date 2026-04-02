import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

interface ExampleItemProps {
  number: string;
  title: string;
  path: string;
  description: string;
  codeSnippet: string;
}

function ExampleItem({ number, title, path, description, codeSnippet }: ExampleItemProps) {
  return (
    <Link to={path} className="block no-underline">
      <div className="example-card">
        <div className="example-card__number">Example {number}</div>
        <h3 className="example-card__title">{title}</h3>
        <p className="example-card__description">{description}</p>
        <div className="mt-4 p-3 bg-warm border border-hairline font-mono text-xs text-charcoal-muted overflow-x-auto">
          <code>{codeSnippet}</code>
        </div>
      </div>
    </Link>
  );
}

function LandingPage() {
  const examples: ExampleItemProps[] = [
    {
      number: "01",
      title: "Basic",
      path: "/basic",
      description:
        "Baseline implementation with no prefetching. Data loads only when the route renders, demonstrating the default behavior without optimizations.",
      codeSnippet: "useSuspenseQuery({ queryKey, queryFn })",
    },
    {
      number: "02",
      title: "Preloading",
      path: "/preloading",
      description:
        "Route-level prefetch using loader and queryOptions. Data begins loading as soon as navigation starts, reducing perceived latency.",
      codeSnippet: "loader: ({ context }) => {\n  void context.queryClient.prefetchQuery(...)\n}",
    },
    {
      number: "03",
      title: "Intent Preloading",
      path: "/intent-preloading",
      description:
        "Hover-based prefetch using preload='intent' on Links. Data starts loading when the user hovers over a link, anticipating their next action.",
      codeSnippet: "<Link preload='intent' to='/route'>...</Link>",
    },
    {
      number: "04",
      title: "Pagination",
      path: "/pagination",
      description:
        "Preloading next and previous pages in paginated lists. Adjacent pages are prefetched so navigation feels instant.",
      codeSnippet: "preload={props.prefetch}\nto={props.to}\nsearch={{ offset: props.nextOffset }}",
    },
    {
      number: "05",
      title: "Filters",
      path: "/filters",
      description:
        "Search with URL-driven state and prefetching. Filter changes update the URL and trigger data refetching with intelligent caching.",
      codeSnippet: "validateSearch: searchParamsSchema",
    },
    {
      number: "06",
      title: "Debounced Preload Filters",
      path: "/debounced-preload-filters",
      description:
        "Advanced filter prefetch with debouncing. Prevents excessive prefetch requests while typing by waiting for a pause in input.",
      codeSnippet: "useDebounce(value, delay)\n// Preload only after pause",
    },
  ];

  return (
    <main className="min-h-screen bg-warm">
      {/* Hero Section */}
      <section className="border-b border-hairline bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="status-dot status-dot--cached" />
            <span className="text-charcoal-muted text-sm font-mono uppercase tracking-wider">
              TanStack Router Demo
            </span>
          </div>
          <h1 className="text-4xl font-mono font-semibold text-charcoal mb-4">
            Prefetching Patterns
          </h1>
          <p className="text-lg text-charcoal-light max-w-2xl leading-relaxed">
            A developer console for exploring data prefetching techniques in modern React
            applications. Learn how different patterns affect perceived performance and user
            experience.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-charcoal-muted">
            <span className="flex items-center gap-2">
              <span className="status-dot status-dot--cached" />
              Cached
            </span>
            <span className="flex items-center gap-2">
              <span className="status-dot status-dot--fetching" />
              Fetching
            </span>
            <span className="flex items-center gap-2">
              <span className="status-dot status-dot--idle" />
              Idle
            </span>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="section-header">
          <span className="section-header__title">Examples</span>
          <span className="text-charcoal-muted text-sm">// Select one to explore</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example) => (
            <ExampleItem key={example.number} {...example} />
          ))}
        </div>
      </section>

      {/* Concepts Section */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="section-header">
          <span className="section-header__title">Key Concepts</span>
        </div>

        <div className="console-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-mono font-semibold text-charcoal mb-2">Route Loaders</h4>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Loaders run before the route component renders, making them ideal for initiating
                data fetches early in the navigation lifecycle.
              </p>
            </div>
            <div>
              <h4 className="font-mono font-semibold text-charcoal mb-2">Intent Preloading</h4>
              <p className="text-sm text-charcoal-light leading-relaxed">
                By observing user intent (hover, focus), we can predict navigation and preload data
                before the click event fires.
              </p>
            </div>
            <div>
              <h4 className="font-mono font-semibold text-charcoal mb-2">Query Caching</h4>
              <p className="text-sm text-charcoal-light leading-relaxed">
                TanStack Query maintains a cache of fetched data. Subsequent requests for the same
                data return instantly from cache.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-charcoal-muted">
          <p>
            Built with <span className="text-amber">TanStack Router</span> +{" "}
            <span className="text-amber">TanStack Query</span> +{" "}
            <span className="text-amber">TanStack Start</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
