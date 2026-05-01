## No prefetching (baseline)

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

This pattern works for low-traffic pages, internal tools, or anywhere the performance overhead of a round-trip is acceptable. It is the simplest possible starting point before adding any prefetching strategy.
