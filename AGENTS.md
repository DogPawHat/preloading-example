<!--VITE PLUS START-->

# Vite+ Rules For This Repo

This project uses Vite+ and the `vp` CLI.

## Repo-Specific Rules

- Do not use `pnpm`, `npm`, or Yarn directly for installs, updates, or package execution.
- Do not use raw tool CLIs like `vite`, `vitest`, `oxlint`, or `oxfmt`; use the matching `vp` command instead.
- Use `vp run <script>` when you need a package script that shares a name with a built-in Vite+ command.
- Use `vp dlx` instead of `npx` for one-off package binaries.
- Import JavaScript modules from `vite-plus` rather than `vite` or `vitest`.

## CI Notes

For GitHub Actions, prefer `voidzero-dev/setup-vp` and run:

```yaml
- run: vp check
- run: vp test
```

## Review Checklist For Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->

<!-- intent-skills:start -->

# Skill mappings - when working in these areas, load the linked skill file into context.

skills:

- task: "TanStack Start app setup, router wiring, route tree generation, and SSR entry points"
  load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"
- task: "Vite+ commands, project scripts, and repo tooling workflow"
  load: "node_modules/vite-plus/skills/vite-plus/SKILL.md"
- task: "link preloading, intent prefetching, pagination navigation, and route-to-route transitions"
  # To load this skill, run: vp dlx @tanstack/intent@latest list | grep navigation
- task: "search params, validateSearch, URL-driven filters, and pagination state in routes"
  # To load this skill, run: vp dlx @tanstack/intent@latest list | grep search-params
- task: "route loaders, loaderDeps, query prefetching, and route-level data loading"
  # To load this skill, run: vp dlx @tanstack/intent@latest list | grep data-loading
- task: "useServerFn, createServerFn, and server-backed data fetching in TanStack Start" # To load this skill, run: vp dlx @tanstack/intent@latest list | grep server-functions
<!-- intent-skills:end -->
