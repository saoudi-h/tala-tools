# PROJECT ISSUES

## [ISSUE-001] Bun TypeScript preset does not resolve declared consumer types cleanly

- Type: problem
- Status: open
- Evidence: `packages/tsconfig/bun.json` requests the `bun-types` type library.
  Herald declares `@types/bun@1.4.0`, as used by its Bun packages, and extends this
  preset. A clean GitHub Actions installation fails the API typecheck with `TS2688:
Cannot find type definition file for 'bun-types'`. A stale local
  `apps/api/node_modules/bun-types` link initially masked the failure. Overriding the
  consumer config with `compilerOptions.types: ["bun"]` makes the same clean
  configuration resolve through the declared `@types/bun` package.
- Impact: Bun consumers can pass locally while failing on a clean installation, and
  must add undocumented per-project overrides despite using the shared preset. The
  current package also lacks a clearly documented distinction between Node-oriented,
  Bun-oriented, and mixed-runtime presets as these runtimes and their type packages
  evolve.
- Desired outcome: Current Bun consumers can extend an explicitly supported preset
  and typecheck reproducibly after a clean install, with the required type package
  and runtime assumptions documented. Existing Node-oriented consumers remain
  unaffected, and representative clean consumer checks prevent the presets from
  drifting again.
- Tasks: none
