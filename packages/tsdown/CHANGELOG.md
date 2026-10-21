# @tala-tools/tsdown

## 0.1.8

### Patch Changes

- 795c734: Refresh dependencies across the shared toolchain: ESLint 10.13.0, typescript-eslint 8.72.0, the Next.js ESLint plugin 16.4.2, publint 0.3.25, Zod 4.6.7, Vitest 5.0.5, Oxlint 1.89.0, and Oxfmt 0.74.0.

    The Oxfmt peer range is aligned with the validated Oxfmt release, and the Oxlint preset README is reordered to match Oxfmt's import sorting.

## 0.1.7

### Patch Changes

- 7fdf625: Refresh dependencies, isolate the TypeScript 6 toolchain for legacy ESLint support, and keep wt compatible with Zod 4.

## 0.1.6

### Patch Changes

- ac4b34b: up deps

## 0.1.5

### Patch Changes

- 1b07a94: up deps

## 0.1.4

### Patch Changes

- 16bdb82: up deps

## 0.1.3

### Patch Changes

- c6fd11e: up deps

## 0.1.2

### Patch Changes

- d5034e0: Enable IDE "Go to Definition" support by:
    - Adding declaration maps (`.d.mts.map`) to link type definitions back to source files
    - Including `src/` directory in published packages for source navigation
    - Using tsdown's `customExports` feature to auto-generate `exports` field with `types` conditions
    - Creating `index.d.ts` for prettier config package

    This allows IDEs to navigate directly to source code when clicking on imported symbols.

## 0.1.1

### Patch Changes

- 3306187: fix(prettier): convert to ESM export default and fix repository metadata.
  fix(tsdown): add repository metadata to package.json.
