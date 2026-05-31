# @tala-tools/eslint

## 0.1.3

### Patch Changes

- c6fd11e: up deps

## 0.1.2

### Patch Changes

- ced5b06: fix ESM/CJS interop for @eslint/js and eslint-plugin-regexp imports

## 0.1.1

### Patch Changes

- d5034e0: Enable IDE "Go to Definition" support by:
    - Adding declaration maps (`.d.mts.map`) to link type definitions back to source files
    - Including `src/` directory in published packages for source navigation
    - Using tsdown's `customExports` feature to auto-generate `exports` field with `types` conditions
    - Creating `index.d.ts` for prettier config package

    This allows IDEs to navigate directly to source code when clicking on imported symbols.
