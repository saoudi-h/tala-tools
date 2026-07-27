---
project: Tala Tools
language: English
---

# Tala Tools — Agent Context

## Context

Tala Tools is a pnpm/Turbo monorepo of publishable shared development tooling.
It provides ESLint, Prettier, TypeScript, and tsdown configuration packages,
plus `@tala-tools/wt`, a CLI for synchronizing untracked resources into Git
worktrees.

## Workflow

- Use `.autonomos/TASKS.md` as the task-state source of truth.
- Read this file and any local `AGENT.md` files before changing a package.
- Keep code, comments, and documentation in English.
- Use Conventional Commits; use a package name as scope, or no scope for
  monorepo-wide changes.
- Propose radical architectural changes and wait for approval before executing.

## Stack

- TypeScript, ESM-only, pnpm 11, Turborepo, and tsdown.
- ESLint flat configs and Prettier 3, plus Oxlint and Oxfmt for the Oxc migration.
- Vitest tests in `packages/wt`.
- Runtime support: Bun and Node.js `>=20.19.0`.

## Key Directories

- `packages/eslint/`: shared ESLint flat configurations.
- `packages/prettier/`: shared Prettier configuration.
- `packages/oxfmt/`: shared Oxfmt configuration.
- `packages/oxlint/`: shared Oxlint configurations.
- `packages/tsconfig/`: shared TypeScript JSON configurations.
- `packages/tsdown/`: shared tsdown configuration helpers.
- `packages/wt/`: Git worktree synchronization library and CLI.
- `.autonomos/`: protocol metadata, task list, and session worklogs.

## Constraints

- Keep every package ESM-only.
- In `@tala-tools/tsdown`, pin `tsdown`, `publint`, and `unplugin-unused` to
  exact versions.
- Preserve Bun and Node.js `>=20.19.0` compatibility across packages.
- For Oxc adoption, prefer native Oxlint rules and Oxfmt features; use ESLint
  compatibility plugins only for material coverage gaps.
- `@tala-tools/oxlint` and `@tala-tools/oxfmt` coexist with the existing ESLint
  and Prettier packages during consumer migration; do not replace the legacy
  packages without explicit approval.
- Oxfmt's native import sorting is not a drop-in replacement for
  `prettier-plugin-organize-imports`, but a one-time formatting diff is
  acceptable when the resulting order is stable and maintained by Oxfmt.
- A future shared Oxlint configuration must remain native-only: do not make
  arbitrary ESLint plugins transitive compatibility dependencies. Prefer Oxc
  native rules, but retain high-value Oxlint-compatible plugins when they add
  context-aware validation or formatting that Oxfmt cannot provide.
- `eslint-plugin-better-tailwindcss` is a required candidate for the Oxlint
  preset: its class validation catches invalid Tailwind classes and must be
  evaluated as a first-class integration rather than discarded as a legacy
  compatibility plugin.
- Consumers that enable the Tailwind Oxlint preset must install both
  `tailwindcss` and `eslint-plugin-better-tailwindcss` directly; pnpm does not
  expose transitive dependencies to the Oxlint JS plugin resolver.
- The commerce pilot confirms that `better-tailwindcss` correctness rules work
  under Oxlint after carrying project ignore patterns. Its stylistic ordering
  and wrapping rules conflict with Oxfmt sorting. `better-tailwindcss` is the
  Tailwind style authority; Oxfmt Tailwind sorting stays disabled by default.
- During Oxc migration, native Oxlint correctness rules and unused-variable
  findings start as warnings. Raise selected rules to errors only after
  comparison against the existing ESLint baseline.
- The root Oxc presets load successfully with TypeScript 7. Existing
  `typescript-eslint` and React ESLint plugin peer ranges remain incompatible
  with the root TypeScript 7 and ESLint 10 versions; this is expected until
  those legacy packages are removed from a consuming project.
- The commerce storefront already carries `oxlint` and `oxlint-tsgolint`, but
  had no shared Tala Oxc configuration. Its clean ESLint run is the baseline
  for promoting new Oxlint diagnostics beyond warnings.
- Root Oxc scripts validate only the new presets and their configs until the
  repository itself has completed its one-time Oxfmt migration; existing files
  currently have formatting differences and must not be rewritten incidentally.
