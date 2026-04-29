# Rules For This Project

## Script Instructions

This project uses Vite+ and the `vp` CLI.

- Do not use `pnpm`, `npm`, or Yarn directly for installs, updates, or package execution.
- Do not use raw tool CLIs like `vite`, `vitest`, `oxlint`, or `oxfmt`; use the matching `vp` command instead.
- Use `vp run <script>` when you need a package script that shares a name with a built-in Vite+ command.
- Use `vpx` instead of `npx` for one-off package binaries.
- Import JavaScript modules from `vite-plus` rather than `vite` or `vitest`.
- Never start up a dev server e.g `vp dev` or `vp run dev`. Always use an existing sever e.g. localhost:3000

## CI Notes

For GitHub Actions, prefer `voidzero-dev/setup-vp` and run:

```yaml
- run: vp check
- run: vp test
```

## Review Checklist For Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.

<!-- intent-skills:start -->

## Skill Loading

This project uses both skills installed in `.agent/skills` as standard and the TanStack Intent CLI to load skills directly from packages.

Before substantial work:

- Skill check: run `vpx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `vpx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `DogPawHat/preloading-example`. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default Matt Pocock skills triage label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain docs layout. See `docs/agents/domain.md`.
