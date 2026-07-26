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
- ESLint flat configs and Prettier 3 for static analysis and formatting.
- Vitest tests in `packages/wt`.
- Runtime support: Bun and Node.js `>=20.19.0`.

## Key Directories

- `packages/eslint/`: shared ESLint flat configurations.
- `packages/prettier/`: shared Prettier configuration.
- `packages/tsconfig/`: shared TypeScript JSON configurations.
- `packages/tsdown/`: shared tsdown configuration helpers.
- `packages/wt/`: Git worktree synchronization library and CLI.
- `.autonomos/`: protocol metadata, task list, and session worklogs.

## Constraints

- Keep every package ESM-only.
- In `@tala-tools/tsdown`, pin `tsdown`, `publint`, and `unplugin-unused` to
  exact versions.
- Preserve Bun and Node.js `>=20.19.0` compatibility across packages.
