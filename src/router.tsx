import { createRouter as createTanstackRouter } from "@tanstack/react-router";

import { QueryClient } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

export function createRouter() {
	const queryClient = new QueryClient();

	const router = routerWithQueryClient(
		createTanstackRouter({
			routeTree,
			scrollRestoration: true,
			defaultPreload: false,
			defaultStructuralSharing: true,
			defaultPreloadStaleTime: 0,
			defaultPendingMs: 0,
			defaultErrorComponent: () => <div>Error</div>,
			defaultPendingComponent: () => <div>Loading...</div>,
			defaultNotFoundComponent: () => <div>Not Found</div>,
			context: {
				queryClient,
			},
		}),
		queryClient,
	);

	return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
