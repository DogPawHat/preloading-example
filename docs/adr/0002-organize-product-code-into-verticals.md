# Organize product code into verticals while keeping framework adapters conventional

Status: Superseded by [ADR-0003](0003-keep-verticals-directly-under-src.md).

We will organize product-owned implementation under `src/verticals/*`, with verticals such as Landing, Chapters, Articles, Demos, Data, and Design System. TanStack Start, TanStack Router, and Vite+ framework-mandated files stay in their conventional locations as framework adapters, because changing route/config conventions for a purer file tree would add maintenance cost without improving the product model. Verticals will use direct module imports instead of app-code barrel files so dependency shape stays visible.
