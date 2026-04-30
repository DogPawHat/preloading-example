## Debounced filter prefetch

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

Ideal for search-as-you-type interfaces against reasonably sized or indexed datasets. Pair with server-side indexing for larger collections.
