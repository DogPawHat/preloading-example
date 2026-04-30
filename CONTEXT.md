# Preloading Example

This context describes the product language and architectural vocabulary for a chaptered learning lab about TanStack preloading, pagination, filtering, and synced local data patterns.

## Language

**Vertical**:
A product slice organized by what the code does for the user, not by technical category.
_Avoid_: Code grouping, feature folder, technical layer

**Shared vertical**:
A vertical for cross-cutting code with a coherent responsibility that is used by more than one product slice.
_Avoid_: Shared dumping ground, miscellaneous utilities

**Chapter**:
A learning unit in the reading sequence that pairs exactly one article with exactly one demo.
_Avoid_: Page, route, layout

**Article**:
An explanatory content piece paired with a demo inside a chapter.
_Avoid_: Blog component, copy block

**Demo**:
An interactive Pokemon listing example paired with an article inside a chapter.
_Avoid_: Table, widget, example component

**Chapter route**:
A route module that composes a chapter by wiring its article, demo, route data, and search state.
_Avoid_: Implementation dumping ground, generated registry entry

**Data**:
The persistence model and direct database access for Pokemon records.
_Avoid_: Data layer, server functions, query options, sync routes

**Landing**:
The home screen that introduces the learning lab and presents entry points into the chapter sequence.
_Avoid_: Table of contents owner, chapter registry

**Design System**:
The shared visual foundation for app-wide primitive UI, styling tokens, global CSS, and theme controls.
_Avoid_: Shared, common components, miscellaneous UI

**Framework adapter**:
A file kept in a framework-mandated location to register routes, app wiring, or configuration while delegating implementation to verticals where practical.
_Avoid_: Vertical owner, product slice

## Relationships

- A **Vertical** owns code that changes together for a product concern.
- A **Shared vertical** may be used by multiple **Verticals** through a small public interface.
- A **Chapter** contains exactly one **Article** and exactly one **Demo**.
- The **Article** vertical owns markdown content, markdown rendering, article presentation, and server functions that produce renderable articles.
- A **Chapter route** is the composition boundary for one **Chapter**.
- A **Chapter route** may own route-specific integration between TanStack Router loaders, route context, search state, and TanStack Query options.
- A **Chapter route** should compose **Verticals**, not contain substantial **Article** rendering internals or **Demo** implementation internals.
- The **Demo** vertical owns the interactive Pokemon listing system, including shared demo UI, server functions, TanStack Query helpers, Electric shape routes, TanStack DB collections, and loading strategy helpers.
- The **Data** vertical owns schema, relations, seed data, and direct database wrapper queries.
- The **Demo** vertical consumes the **Data** vertical through direct query interfaces exposed by **Data**.
- The **Chapters** vertical owns the canonical reading sequence, chapter metadata, table-of-contents data, and chapter navigation.
- The **Chapters** vertical owns navigation chrome for the chaptered reading experience, including the header, chapter selector, chapter pager, and route navigation helpers.
- The **Chapters** vertical owns chapter framing and status language, including section headers and status indicators.
- The **Landing** vertical owns home-page presentation and consumes the **Chapters** vertical for the table of contents.
- The **Design System** vertical owns primitive UI components, CSS files, styling tokens, utility class merging, and the theme toggle.
- The **Demo** vertical owns console cards and panel frames used by the interactive demo surface.
- Small implementation helpers used only by one vertical belong to that vertical; for example, the lazy component helper belongs to **Demo** while only the demo table uses it.
- **Framework adapters** may remain in TanStack Start, TanStack Router, or Vite+ default locations even when they register behavior for a vertical.
- API shape route files are **Framework adapters**; **Demo** owns the Electric collections that depend on those route URLs.
- Root route, router creation, generated route tree, TanStack Start declarations, and Vite+ configuration are **Framework adapters** unless enough cohesive app-shell implementation emerges to justify a separate vertical.
- `src/env.ts` remains app-wide runtime configuration and is not owned by **Data** or **Demo**.
- Product-owned verticals live directly under `src/*` as named top-level directories such as `src/articles`, `src/chapters`, `src/data`, `src/demos`, `src/design-system`, and `src/landing`; framework-mandated files remain in their default locations as **Framework adapters**.
- Do not introduce a `src/verticals` grouping directory. The earlier `src/verticals/*` plan was reversed because the extra nesting added path noise without improving the domain model.
- Verticals should not expose app-code barrel files; imports should target the concrete module that owns the thing being imported, while files inside a vertical may use relative imports.
- Technical categories such as components, server functions, content, utilities, and libraries are not primary ownership boundaries.

## Example dialogue

> **Dev:** "Should this table component stay under components because it renders UI?"
> **Domain expert:** "No. If it exists to explain a preloading strategy in a demo, it belongs with that **Vertical** unless another **Vertical** consumes it through a public interface."

> **Dev:** "Is the `/basic` route the **Chapter**, or just the layout for one?"
> **Domain expert:** "It is the **Chapter**: the route is the reading unit that composes one article and one demo."

> **Dev:** "Should markdown rendering utilities live in a generic utils folder?"
> **Domain expert:** "No. Markdown rendering exists to produce **Article** content, so it belongs to **Article**."

> **Dev:** "Should the route file be empty glue that delegates all chapter composition elsewhere?"
> **Domain expert:** "No. The **Chapter route** is allowed to compose the **Article** and **Demo**, especially where route data and preloading behavior are part of the lesson."

> **Dev:** "Do Electric shape routes belong to **Data** because they expose tables?"
> **Domain expert:** "No. They belong to **Demo** because they deliver synced Pokemon listing data to the interactive examples; **Data** owns the persistence model and direct database queries."

> **Dev:** "Should the home page own the chapter list because it renders the table of contents?"
> **Domain expert:** "No. **Landing** renders the home-page view, but **Chapters** owns the canonical reading sequence."

> **Dev:** "Should the header live in an app-shell vertical?"
> **Domain expert:** "No. The header is chapter navigation chrome, so it belongs to **Chapters**."

> **Dev:** "Should status dots be part of the demo console?"
> **Domain expert:** "No. Status indicators are used by **Landing** and chapter navigation, so they belong to **Chapters**."

> **Dev:** "Should `src/components/ui` live in a generic shared folder?"
> **Domain expert:** "No. Primitive UI, tokens, global styles, and theme controls belong to **Design System**."

> **Dev:** "Should API shape route files move into **Demo** because Electric collections use them?"
> **Domain expert:** "No. The route files stay in the framework route tree as **Framework adapters**; **Demo** owns the Electric collections that depend on those URLs."

> **Dev:** "Should we create an App Shell vertical for root route and router files?"
> **Domain expert:** "Not yet. Keep framework-mandated files as **Framework adapters** and extract an app-shell vertical only if cohesive app-shell implementation grows."

> **Dev:** "Should each vertical expose an `index.ts` barrel as its public API?"
> **Domain expert:** "No. App-code barrels hide dependency shape and can create circular imports; import concrete modules directly."

> **Dev:** "Should verticals live under `src/verticals` so the ownership model is explicit?"
> **Domain expert:** "No. The ownership model is explicit in the named top-level directories under `src`; `src/verticals` was removed to keep import paths shorter while preserving the same vertical boundaries."

## Flagged ambiguities

- "Shared" can mean either reusable product infrastructure or a dumping ground for unrelated code. Resolved: only use **Shared vertical** for cross-cutting code with a coherent responsibility.
