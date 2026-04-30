## Reactive filtered live search

Combining live queries with client-side filtering creates a real-time search experience. The full dataset stays in sync with the server while the client filters and displays results reactively as the user types.

### How it works

1. A live query fetches the full dataset and keeps it in sync
2. Client-side filtering narrows results based on user input
3. Results update immediately with every keystroke
4. Underlying database changes are reflected in real time

### Architecture

Electric SQL handles the server-to-client sync layer, while TanStack DB collections manage live query subscriptions. Client-side filtering provides instant feedback without additional network requests, and URL search params keep the filter state shareable.

### Best for

Dashboards, monitoring interfaces, multi-user collaboration tools, and any application where data freshness takes priority over raw query throughput.
