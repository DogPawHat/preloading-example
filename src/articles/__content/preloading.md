## Route-level prefetch

Route-level prefetching improves perceived performance by initiating data fetches before the user reaches the page. When a link enters the viewport or receives focus, TanStack Router fires the route's `loader` function to pre-warm the query cache.

### How it works

1. TanStack Router detects that a link is about to be visited
2. The route's `loader` calls `prefetchQuery` on the query client
3. Data is fetched and cached in React Query's cache
4. When the user clicks, the page renders instantly from cache

### Trade-offs

- **Bandwidth**: May fetch data the user never actually views
- **Freshness**: Cached data needs an appropriate `staleTime`
- **Complexity**: Requires defining loaders and query options per route

### Best practices

Set an appropriate `staleTime` to balance data freshness with cache hits. Use `prefetchQuery` for speculative fetches — it won't throw if the query fails, making it safe for preloading.
