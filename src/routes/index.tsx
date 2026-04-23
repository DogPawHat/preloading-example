import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { StatusDot } from "~/components/console/status-dot";

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

function LandingPageDocument() {
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
