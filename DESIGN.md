## Design System

### Design Intent

The interface should feel like a compact developer console for studying data behavior. It is educational product UI, not a marketing site. The design should make route state, table data, cache behavior, search params, pagination, and live query updates easy to inspect.

Physical scene: a developer is working through examples on a laptop or external monitor during a focused learning session, switching between editor, browser, and docs. Both light and dark themes are valid because the app may be used in daytime workshops or late-night debugging.

### Visual Strategy

**Register**: product
**Color strategy**: restrained
**Surface model**: tinted warm neutrals with amber as the single instructional accent
**Shape language**: square, technical, grid-like
**Texture**: hairline borders, dense spacing, table rhythm, monospace labels

The design should not look like a Pokemon fan interface. Pokemon is just the dataset. The product is the prefetching behavior.

### Color Tokens

All color should come from `src/styles/tokens.css` unless a new token is intentionally added.

**Primitive families**

- `--color-amber-*`: primary instructional accent.
- `--color-warm-*`: tinted neutral ramp for light and dark surfaces.
- `--color-green-*`: cached or available state.
- `--color-red-*`: error state.

**Semantic roles**

- `--bg-primary`: app page background.
- `--bg-secondary`: header, secondary bands, hovered rows, form surfaces.
- `--bg-tertiary`: deeper nested surface when separation is needed.
- `--bg-card`: primary content panels.
- `--text-primary`: main reading text and active labels.
- `--text-secondary`: section labels and supporting labels.
- `--text-muted`: hints, subtitles, disabled states, metadata.
- `--accent-default`: active accent, selected state, instructional callouts.
- `--accent-subtle`: hover and quiet emphasis background.
- `--border-default`: normal hairline separation.
- `--border-strong`: table headers, stronger dividers, emphasis borders.
- `--status-cached`, `--status-fetching`, `--status-idle`, `--status-error`: data state indicators.

Do not use raw black or white. Keep new colors in OKLCH and add semantic aliases before using them repeatedly.

### Typography

**Primary UI font**: JetBrains Mono via `--font-mono`.
**Display font**: Barlow via `--font-display`.

Use monospace for route names, status labels, tables, filters, buttons, and console controls. Use display type sparingly for major headings, especially the landing page title and large article titles.

Current scale:

- `--text-xs`: dense labels, table headings, badges.
- `--text-sm`: default body and controls.
- `--text-base`: landing descriptions and prominent card titles.
- `--text-lg`: demo card headings.
- `--text-xl` and above: section headings and hero headings.

Uppercase labels should be short. Avoid long uppercase prose because it harms scan speed.

### Layout

The app uses a compact, document-like structure:

- Sticky horizontal navigation at the top.
- Landing page with a concise intro and grouped example links.
- Example pages with `max-w-7xl`, 24px page padding, a section header, then a strategy/content split.
- Demo cards for data tables, filters, skeletons, and controls.

The strategy route layout uses:

- Left column: explanation panel through `StrategyArticle`.
- Right column: interactive demo content through `DemoCard`.
- Desktop split: `minmax(0,0.9fr)` and `minmax(34rem,1.1fr)`.

Keep table areas dimensionally stable while loading. Existing examples reserve height with `min-h-125` and skeleton rows; preserve that pattern to prevent layout jump.

### Components

**Header**

- Sticky, top aligned, z-indexed above examples.
- Horizontal overflow is acceptable and intentional.
- Active nav item uses `>` as a terminal prompt.
- Theme toggle cycles system, light, dark.

**Example cards**

- Used on the landing page as route launchers.
- Zero radius, one-pixel border, visible hover border shift.
- The recommended starting example uses `--accent-surface` and an uppercase badge.
- Keep card copy short and behavior-specific.

**DemoCard**

- Primary framed work surface.
- White or dark card background via `--bg-card`.
- One-pixel border, zero radius, 24px padding.
- Use hover only when the whole card is interactive.

**SectionHeader**

- Route title and `//` subtitle.
- Border-bottom separates the console header from route content.
- Keep subtitles terse and implementation-focused.

**PokemonTable**

- Monospace table with uppercase headers.
- Row hover uses secondary background.
- IDs are muted, names are primary, types are compact badges.
- Preserve readability over decoration.

**StatusDot**

- `cached`: green with subtle ring.
- `fetching`: amber with reduced-motion-safe pulse.
- `idle`: neutral.
- `error`: red with subtle ring.

Status dots should always be paired with visible or accessible labels when the meaning is not obvious from surrounding copy.

**Forms and Pagination**

- Inputs inherit console styling: zero radius, secondary background, accent focus.
- Buttons and pagination links use bordered rectangular controls.
- Disabled pagination should be visible but inert.
- Search state should be reflected in URL search params and visible page text.

### Motion

Motion is functional. The fetching dot pulse is the canonical motion pattern. Keep transitions short (`--duration-fast` or `--duration-normal`) and limited to color, opacity, transform, or shadow. Respect `prefers-reduced-motion`.

Do not animate layout properties. Do not introduce ornamental motion.

### Accessibility

- Preserve visible focus rings on links, buttons, and inputs.
- Do not rely on color alone for status when the context is ambiguous.
- Keep contrast at WCAG 2.1 AA or better.
- Theme changes must remain keyboard accessible.
- Loading skeletons should reserve space and avoid flashing.
- Reduced motion must disable repeated attention-grabbing animation.

### Copy Rules

- Be concrete about behavior: prefetch, cache, loader, synced collection, search param, live query.
- Use route names consistently with the nav sequence.
- No em dashes in product copy.
- Avoid hype, jokes, or generic SaaS wording.
- Replace placeholder instructional content before treating a route as finished.

### Known Design Debt

- `StrategyArticle` still uses lorem ipsum and a decorative oversized rounded/shadowed panel. It does not yet match the sharper console system.
- The landing page lists six examples, while the header includes eight. The home page should include the live query examples or label them as a separate advanced group.
- `Header` contains `flex-hteshrink-0`, which appears to be a typo for a flex/shrink utility.
- `README.md` still contains starter TanStack instructions and direct `pnpm` commands, which conflict with repo Vite+ rules.
