# Keep verticals directly under src

Status: Accepted

Date: 2026-04-30

## Context

ADR-0002 initially placed product-owned implementation under `src/verticals/*`. That made vertical ownership explicit, but it also added an extra path segment to every product import.

The codebase has since moved the same verticals back directly under `src`.

## Decision

Product-owned verticals live directly under `src/*` as named top-level directories:

- `src/articles`
- `src/chapters`
- `src/data`
- `src/demos`
- `src/design-system`
- `src/landing`

Do not recreate `src/verticals`.

TanStack Start, TanStack Router, API route modules, generated route files, runtime environment files, and Vite+ framework files remain in their conventional locations as framework adapters.

## Consequences

The codebase keeps the vertical ownership model from ADR-0002 while removing the extra `verticals` nesting from import paths.

The directory name is no longer the only signal that a folder is a vertical, so agents should use `CONTEXT.md` as the source of truth for vertical ownership.

ADR-0002 remains useful for understanding why the code is organized around vertical ownership, but its target path is superseded by this ADR.
