export const strategyContent: Record<string, string> = {
  basic: `## No prefetching (baseline)

This is the baseline approach — no prefetching whatsoever. Every page navigation triggers a fresh network request, and the user sees loading skeletons while data is fetched on demand.

### How it works

1. The user navigates to the page
2. React Query fires the fetch request from the component
3. A loading skeleton renders while the query resolves
4. Data arrives and the table renders with results

### Trade-offs

- **Latency**: Every navigation incurs a full server round-trip
- **UX**: Loading skeletons are visible on every page visit
- **Simplicity**: The implementation is the easiest to understand and maintain

### When to use

This pattern works for low-traffic pages, internal tools, or anywhere the performance overhead of a round-trip is acceptable. It is the simplest possible starting point before adding any prefetching strategy.`,

  preloading: `## Route-level prefetch

Route-level prefetching improves perceived performance by initiating data fetches before the user reaches the page. When a link enters the viewport or receives focus, TanStack Router fires the route's \`loader\` function to pre-warm the query cache.

### How it works

1. TanStack Router detects that a link is about to be visited
2. The route's \`loader\` calls \`prefetchQuery\` on the query client
3. Data is fetched and cached in React Query's cache
4. When the user clicks, the page renders instantly from cache

### Trade-offs

- **Bandwidth**: May fetch data the user never actually views
- **Freshness**: Cached data needs an appropriate \`staleTime\`
- **Complexity**: Requires defining loaders and query options per route

### Best practices

Set an appropriate \`staleTime\` to balance data freshness with cache hits. Use \`prefetchQuery\` for speculative fetches — it won't throw if the query fails, making it safe for preloading.`,

  "intent-preloading": `## Intent-based preloading

Intent preloading takes route-level prefetching further by triggering data fetches on hover and focus events. This creates a near-instant experience — data begins loading the moment the user shows intent to navigate.

### How it works

1. The user hovers over or focuses a navigation link
2. The \`prefetch="intent"\` directive triggers the route's loader
3. Data is fetched and cached before the click completes
4. On click, the page renders immediately with zero loading time

### Why intent matters

Unlike viewport-based preloading which can trigger fetches for links the user may never click, intent preloading only fires when the user explicitly shows interest in a link. This balances performance gains with bandwidth efficiency.

### Configuration

Set \`prefetch="intent"\` on \`Link\` components or configure it as the default for specific routes in your router configuration.`,

  pagination: `## Viewport pagination preload

Pagination preloading uses the viewport to determine which pages to prefetch. When "next" or "previous" pagination links enter the viewport, the corresponding page's data is preloaded before the user clicks.

### How it works

1. Pagination links render with \`prefetch="viewport"\`
2. When a link enters the viewport, the router triggers a prefetch
3. Data is cached before the user clicks the navigation button
4. Pagination navigation feels instant

### Why viewport preloading for pagination?

Pagination is a natural fit for viewport-based prefetching. The next and previous buttons are always visible at the bottom of the page, so prefetching them is almost guaranteed to be useful. It strikes an ideal balance between eager and lazy loading.

### Optimization

Combine with \`staleTime\` to avoid redundant refetches as the user pages back and forth through the data set.`,

  filters: `## Submitted filter prefetch

Filter-based prefetching improves search experiences by preloading results when a filter form is submitted. Instead of waiting for the filter to be applied after submission, data is already being fetched as the form processes.

### How it works

1. The user enters filter criteria in the form fields
2. The form is submitted, updating search parameters in the URL
3. React Query prefetches results for the new parameter set
4. Results render with minimal loading time

### Key considerations

- **URL-driven state**: Filters are stored in search params, making them shareable and bookmarkable
- **Cache management**: Each filter combination creates a unique cache entry with its own \`staleTime\`
- **Type safety**: Valibot validates search params at the route boundary, ensuring the filter state is always valid`,

  "debounced-preload-filters": `## Debounced filter prefetch

Debounced preloading extends filter-based prefetching by initiating fetches on every keystroke — not just on form submission. A debounce window ensures the server is not overwhelmed by rapid-fire requests.

### How it works

1. The user types in the filter input
2. Each keystroke updates the search params after a short debounce delay
3. React Query fires a prefetch for the new parameter values
4. Results update incrementally as the user types
5. The user sees live-filtered results without needing to press submit

### Debounce strategy

The debounce delay balances responsiveness with server load. A 300–400ms window prevents unnecessary intermediate requests while still feeling snappy to the user. TanStack Pacer provides the debouncing primitive.

### When to use

Ideal for search-as-you-type interfaces against reasonably sized or indexed datasets. Pair with server-side indexing for larger collections.`,

  "live-query": `## Electric SQL synced collection

Live queries use Electric SQL to keep client-side data in sync with the server database in real time. Instead of polling or manual refetching, database changes are pushed to connected clients automatically.

### How it works

1. The client establishes a sync connection to the Electric SQL server
2. A live query is defined using the TanStack DB collection API
3. When database records change, updates stream to connected clients
4. The UI re-renders automatically with fresh data

### Benefits

- **Real-time updates**: Changes appear immediately without manual refresh
- **Offline support**: Local data remains available during connectivity interruptions
- **Multi-user**: All connected clients see each other's changes in real time

### Trade-offs

Live queries require the Electric SQL sync infrastructure. They introduce additional complexity compared to simple REST fetching but are the right choice for collaborative or real-time applications where data freshness matters.`,

  "live-query-filters": `## Reactive filtered live search

Combining live queries with client-side filtering creates a real-time search experience. The full dataset stays in sync with the server while the client filters and displays results reactively as the user types.

### How it works

1. A live query fetches the full dataset and keeps it in sync
2. Client-side filtering narrows results based on user input
3. Results update immediately with every keystroke
4. Underlying database changes are reflected in real time

### Architecture

Electric SQL handles the server-to-client sync layer, while TanStack DB collections manage live query subscriptions. Client-side filtering provides instant feedback without additional network requests, and URL search params keep the filter state shareable.

### Best for

Dashboards, monitoring interfaces, multi-user collaboration tools, and any application where data freshness takes priority over raw query throughput.`,
};
