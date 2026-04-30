## Submitted filter prefetch

Filter-based prefetching improves search experiences by preloading results when a filter form is submitted. Instead of waiting for the filter to be applied after submission, data is already being fetched as the form processes.

### How it works

1. The user enters filter criteria in the form fields
2. The form is submitted, updating search parameters in the URL
3. React Query prefetches results for the new parameter set
4. Results render with minimal loading time

### Key considerations

- **URL-driven state**: Filters are stored in search params, making them shareable and bookmarkable
- **Cache management**: Each filter combination creates a unique cache entry with its own `staleTime`
- **Type safety**: Valibot validates search params at the route boundary, ensuring the filter state is always valid
