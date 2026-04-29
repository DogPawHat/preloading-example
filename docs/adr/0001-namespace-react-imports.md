# Use `import * as React from "react"` over named imports

React imports use the namespace pattern (`import * as React from "react"`) instead of destructured named imports (`import { useState, useEffect } from "react"`). All hooks, types, and components are accessed via the `React.` prefix (e.g., `React.useState`, `React.ReactNode`, `React.Suspense`).

## Why

- **Unambiguous provenance.** `React.useEffect` is self-evidently from React — no need to trace imports or guess whether `useEffect` is a hook, a local utility, or from another library.
- **No import drift.** Adding a new hook or type doesn't require touching the import statement. The namespace import stays stable as the file evolves.
- **Consistency with type-only usage.** `React.ReactNode` reads more naturally than a bare `ReactNode` type import, and keeps all React surface area under one namespace.
