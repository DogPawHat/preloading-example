# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root for project domain language and codebase concepts.
- **`docs/adr/`** for ADRs that touch the area you're about to work in.
- **`PRODUCT.md`** and **`DESIGN.md`** through the `impeccable` workflow when the task involves product, brand, UX, or UI design.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates domain docs lazily when terms or decisions actually get resolved. The `impeccable` skill owns product and design context.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── PRODUCT.md
├── DESIGN.md
├── docs/adr/
│   ├── 0001-example-decision.md
│   └── 0002-example-decision.md
└── src/
```

## Use each source for its job

Use `CONTEXT.md` for domain terms, architectural vocabulary, invariants, and codebase concepts. Do not duplicate product strategy or visual design guidance into it.

Use `PRODUCT.md` for product intent, users, brand, tone, anti-references, and strategic principles.

Use `DESIGN.md` for visual system details, UI conventions, styling decisions, components, typography, color, and interaction patterns.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because..._
