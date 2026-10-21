# @tala-tools/tsconfig

## 0.1.1

### Patch Changes

- efff265: Align the shared packages with the validated toolchain.

    - ESLint: update `eslint-plugin-storybook` to 10.6.3.
    - Oxlint: require `oxlint-tsgolint` `^7.0.2003`, the floor required by Oxlint 1.89.0.
    - Prettier: declare `prettier-plugin-organize-imports` as an optional peer dependency, since the shared config enables it, and document the install step.
    - tsconfig: drop the `./next.json` export, which pointed to a file that does not exist. The Next.js preset is exposed as `./nextjs.json`.

## 0.1.0

### Minor Changes

- Replace `bun.json` with isolated `bun-*.json` suite. `bun-base.json` is the new Bun base (equivalent of `base.json` for Bun, `types: ["bun"]` via `@types/bun`, `lib: ["ESNext"]`, `module: Preserve`), with `bun-next.json` and `bun-react-library.json` extending it. Removes `bun.json` (`types: ["bun-types"]` caused `TS2688` on clean installs with `@types/bun`). Consumers must `pnpm add -D @types/bun` and migrate `extends: "@tala-tools/tsconfig/bun.json"` → `"@tala-tools/tsconfig/bun-base.json"`.

## 0.0.2

### Patch Changes

- 1b07a94: up deps
