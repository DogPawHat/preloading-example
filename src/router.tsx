import { createRouter as createTanstackRouter } from "@tanstack/react-router";

import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

function DefaultErrorComponent() {
  return (
    <div className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-(--bg-card) border border-(--status-error) p-6">
          <h1 className="text-lg font-mono font-semibold text-(--status-error) mb-2">Error</h1>
          <p className="text-sm font-mono text-(--text-secondary)">
            Something went wrong. Try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}

function DefaultPendingComponent() {
  return (
    <div className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-(--bg-card) border border-(--border-default) p-6">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-(--status-fetching) animate-pulse-dot" />
            <span className="text-sm font-mono text-(--text-muted)">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultNotFoundComponent() {
  return (
    <div className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-(--bg-card) border border-(--border-default) p-6">
          <h1 className="text-lg font-mono font-semibold text-(--text-primary) mb-2">
            404 — Not Found
          </h1>
          <p className="text-sm font-mono text-(--text-secondary)">
            The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
}

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: false,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 0,
    defaultErrorComponent: DefaultErrorComponent,
    defaultPendingComponent: DefaultPendingComponent,
    defaultNotFoundComponent: DefaultNotFoundComponent,
    context: {
      queryClient,
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface StaticDataRouteOption {
    routeTitle?: string;
    routeSubtitle?: string;
  }
}
