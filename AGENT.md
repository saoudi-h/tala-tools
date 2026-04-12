# Agent Operational Rules

## Communication & Collaboration
- **Language**: English for all code, comments, and documentation. French for chat.
- **Proposals**: Always propose radical architectural changes and wait for approval before executing.
- **Conciseness**: Keep explanations brief and focused on technical decisions.

## Commit Message Convention
We strictly follow **Conventional Commits**.
- **Scope**: Must be the name of a package or an application.
  - *Example*: `feat(tsdown): ...`, `fix(eslint): ...`.
- **Global**: No scope for monorepo-wide changes (CI, README, root configs).
  - *Example*: `ci: update workflow`, `chore: update root devDeps`.

## Technical Constraints
- **Architecture**: Strictly ESM-only (`type: module`). No CommonJS.
- **Dependency Management**: `tsdown`, `publint`, and `unplugin-unused` must be **pinned to exact versions** in the exporter package.
- **Compatibility**: Ensure all packages remain compatible with **Bun.js** and Node.js `>=20.19.0`.
