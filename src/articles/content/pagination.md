## Viewport pagination preload

Pagination preloading uses the viewport to determine which pages to prefetch. When "next" or "previous" pagination links enter the viewport, the corresponding page's data is preloaded before the user clicks.

### How it works

1. Pagination links render with `prefetch="viewport"`
2. When a link enters the viewport, the router triggers a prefetch
3. Data is cached before the user clicks the navigation button
4. Pagination navigation feels instant

### Why viewport preloading for pagination?

Pagination is a natural fit for viewport-based prefetching. The next and previous buttons are always visible at the bottom of the page, so prefetching them is almost guaranteed to be useful. It strikes an ideal balance between eager and lazy loading.

### Optimization

Combine with `staleTime` to avoid redundant refetches as the user pages back and forth through the data set.
