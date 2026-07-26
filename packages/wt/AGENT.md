# AGENT: packages/wt

- Purpose: a `wt` CLI and library for syncing declared local resources into Git worktrees.
- Public library API is re-exported from `src/index.ts`; CLI commands are registered in `src/cli.ts`.
- Core behavior lives in `src/core/`; command orchestration lives in `src/commands/`.
- Tests are Vitest files in `tests/`; retain the safety guarantee of not replacing real files or directories.
