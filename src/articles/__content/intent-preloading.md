## Intent-based preloading

Intent preloading takes route-level prefetching further by triggering data fetches on hover and focus events. This creates a near-instant experience — data begins loading the moment the user shows intent to navigate.

### How it works

1. The user hovers over or focuses a navigation link
2. The `prefetch="intent"` directive triggers the route's loader
3. Data is fetched and cached before the click completes
4. On click, the page renders immediately with zero loading time

### Why intent matters

Unlike viewport-based preloading which can trigger fetches for links the user may never click, intent preloading only fires when the user explicitly shows interest in a link. This balances performance gains with bandwidth efficiency.

### Configuration

Set `prefetch="intent"` on `Link` components or configure it as the default for specific routes in your router configuration.
