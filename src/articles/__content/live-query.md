## Electric SQL synced collection

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

Live queries require the Electric SQL sync infrastructure. They introduce additional complexity compared to simple REST fetching but are the right choice for collaborative or real-time applications where data freshness matters.
