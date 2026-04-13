import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusDot } from "~/components/console/status-dot";
import { ConsoleCard } from "~/components/console/console-card";

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
        <div className="mt-4 p-3 bg-(--bg-secondary) border border-(--border-default) font-mono text-xs text-(--text-muted) overflow-x-auto">
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
    <main className="min-h-screen bg-(--bg-primary)">
      {/* Hero Section */}
      <section className="border-b border-(--border-default) bg-(--bg-card)">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <StatusDot status="cached" />
            <span className="text-(--text-muted) text-sm font-mono uppercase tracking-wider">
              TanStack Router Demo
            </span>
          </div>
          <h1 className="text-4xl font-mono font-semibold text-(--text-primary) mb-4">
            Prefetching Patterns
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl leading-relaxed">
            A developer console for exploring data prefetching techniques in modern React
            applications. Learn how different patterns affect perceived performance and user
            experience.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-(--text-muted)">
            <StatusDotWithLabel status="cached" label="Cached" />
            <StatusDotWithLabel status="fetching" label="Fetching" />
            <StatusDotWithLabel status="idle" label="Idle" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--border-default) bg-(--bg-card)">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-(--text-muted)">
          <p>
            Built with <span className="text-(--accent-default)">TanStack Router</span> +{" "}
            <span className="text-(--accent-default)">TanStack Query</span> +{" "}
            <span className="text-(--accent-default)">TanStack Start</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

// Helper component for the landing page
function StatusDotWithLabel({
  status,
  label,
}: {
  status: "cached" | "fetching" | "idle";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <StatusDot status={status} />
      <span>{label}</span>
    </span>
  );
}
