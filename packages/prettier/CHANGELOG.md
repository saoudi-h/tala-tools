# @tala-tools/prettier

## 0.0.5

### Patch Changes

- 1d67cd7: Declare the Node.js runtime range in the remaining published manifests, so every package of the `@tala-tools` scope exposes the same `engines.node` field.

## 0.0.4

### Patch Changes

- efff265: Align the shared packages with the validated toolchain.

    - ESLint: update `eslint-plugin-storybook` to 10.6.3.
    - Oxlint: require `oxlint-tsgolint` `^7.0.2003`, the floor required by Oxlint 1.89.0.
    - Prettier: declare `prettier-plugin-organize-imports` as an optional peer dependency, since the shared config enables it, and document the install step.
    - tsconfig: drop the `./next.json` export, which pointed to a file that does not exist. The Next.js preset is exposed as `./nextjs.json`.

## 0.0.3

### Patch Changes

- d5034e0: Enable IDE "Go to Definition" support by:
    - Adding declaration maps (`.d.mts.map`) to link type definitions back to source files
    - Including `src/` directory in published packages for source navigation
    - Using tsdown's `customExports` feature to auto-generate `exports` field with `types` conditions
    - Creating `index.d.ts` for prettier config package

    This allows IDEs to navigate directly to source code when clicking on imported symbols.

## 0.0.2

### Patch Changes

- 3306187: fix(prettier): convert to ESM export default and fix repository metadata.
  fix(tsdown): add repository metadata to package.json.
