## Product Context

### Product

**Name**: Prefetching Patterns
**Register**: product
**Category**: Interactive educational blog and developer learning lab
**Current stack**: TanStack Start, TanStack Router, TanStack Query, TanStack DB, Electric SQL, Tailwind CSS v4, React 19, Drizzle, Vite+

This is a chaptered, interactive educational blog for understanding how different data loading and prefetching strategies change the feel of a React application. Each article should pair a written explanation with a working console so readers can compare baseline loading, progressively richer preloading, and a local-first synced-data approach in the same product.

The app uses Pokemon data as a familiar, low-friction dataset so the user can focus on route loaders, cache state, pagination, search, live queries, and synced collections rather than domain modeling.

### Users

**Primary audience**: Developers learning TanStack Router, Query, DB, Start, and Electric SQL patterns.

**Secondary audience**: Teachers, workshop leads, and technical writers who need a concrete reference implementation.

**Context**: Focused learning sessions, tutorial follow-alongs, implementation reference, workshops, and chapter-by-chapter article exploration.

**Job to be done**: Compare no preloading against increasingly capable preloading strategies, understand when data is fetched or reused, then see how local-first synced collections change the model again.

### Current Experience

The home page introduces the learning sequence and routes users into numbered chapters. The global header is a sticky, horizontally scrollable terminal-style nav with numbered route names and a three-state theme toggle.

The implemented examples are:

1. **basic**: Baseline route with no prefetching.
2. **preloading**: Route-level data prefetching.
3. **intent-preloading**: Hover and focus preloading through navigation intent.
4. **pagination**: Adjacent page preloading for previous and next Pokemon pages.
5. **filters**: Submitted name filtering with search params and prefetch behavior.
6. **debounced-filters**: Typing-driven filter prefetch using debounced interaction.
7. **live-query**: Electric SQL synced collection rendered through TanStack DB live queries.
8. **live-query-filters**: Reactive filtered live query over synced Pokemon data.

Most example routes use a two-column learning layout: a strategy article panel on the left and an interactive Pokemon console on the right. This should feel closer to Effect Institute's chaptered interactive learning model than to a standalone dashboard. The strategy article currently contains placeholder prose, so the product is not finished as teaching material until those articles explain the strategy, cache behavior, expected user observations, and implementation tradeoffs.

### Brand Personality

**Voice**: Technical, minimal, direct.

**Tone**: Precise but approachable, like a well-made developer tool that respects the reader's intelligence.

**Emotional goals**: Confidence, clarity, and trust. Users should feel that they can observe the system, predict what will happen next, and translate the pattern into their own code.

### Product Principles

1. **Comparison is the core lesson**: The product should make each strategy feel different. The user should be able to compare no preloading, route preloading, intent preloading, pagination/search preloading, and local-first live data without reading source code first.

2. **State should be visible**: Cache status, loading, prefetching, empty results, disabled navigation, and synced data behavior are the product. Never hide important state behind decoration.

3. **Examples should build in order**: The numbered sequence should move from baseline fetching to preloading, then pagination/search, then live synced data. New routes should either continue the sequence or clearly belong outside it.

4. **The article and the console teach together**: Prose should explain the why and tradeoffs. The embedded console should let users verify the behavior immediately.

5. **The code is the curriculum**: UI labels, route names, and component structure should map closely to real implementation concepts. Avoid marketing language where a precise technical phrase would teach more.

6. **Density is useful**: This is not a marketing landing page. Users need to scan article context, data tables, route labels, filters, pagination, and state indicators with little wasted space.

7. **Motion has instructional value only**: Animation is reserved for active fetching or interaction feedback. It should never compete with table readability.

8. **Theme parity matters**: Light, dark, and system modes are first-class. Neither mode should feel like an afterthought.

9. **Accessibility is part of the lesson**: Keyboard navigation, focus states, reduced motion, semantic labels, and sufficient contrast are required for the demo to be credible.

### Content Notes

- Replace the lorem ipsum strategy article content with route-specific chapter copy.
- Treat each route as a short educational article with an embedded interactive example.
- Keep route titles and nav labels aligned. The home page currently lists six examples while the header exposes eight; the product story should reconcile that sequence.
- Use concrete teaching copy: "hover this link", "submit a filter", "move to the next page", "watch the table reuse cached data", "watch synced rows update locally".
- Avoid decorative or vague copy. Phrases should describe observable behavior.
- The local-first chapters should explain the shift from fetching a route to subscribing to synced collections.

### Anti-References

- Generic AI-generated dashboards.
- Gradient text, ornamental glows, glassmorphism, and decorative blobs.
- Marketing landing-page composition where the actual tool is below the fold.
- Template card grids that do not expose meaningful differences between examples.
- Overly playful Pokemon theming that distracts from the data-loading lesson.
- Passive blog pages where the reader cannot immediately test the concept being explained.

### Technical Notes

- This repo uses Vite+ and the `vp` CLI. Do not use package-manager scripts directly when a `vp` command exists.
- Import Vite+ modules from `vite-plus`, not `vite` or `vitest`.
- UI is built with Tailwind v4, CSS custom properties, OKLCH tokens, zero radius, hairline borders, and JetBrains Mono.
- `src/styles/tokens.css` is the source of current color, spacing, type, theme, status, and motion tokens.
- `src/components/console/*` contains the core console primitives: cards, section headers, status dots, table, type badges, and skeletons.
- `src/components/strategy-page-layout.tsx` and `src/components/strategy-article.tsx` define the teaching route frame.
