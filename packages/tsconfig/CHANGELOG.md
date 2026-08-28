# @tala-tools/tsconfig

## 0.1.0

### Minor Changes

- Replace `bun.json` with isolated `bun-*.json` suite. `bun-base.json` is the new Bun base (equivalent of `base.json` for Bun, `types: ["bun"]` via `@types/bun`, `lib: ["ESNext"]`, `module: Preserve`), with `bun-next.json` and `bun-react-library.json` extending it. Removes `bun.json` (`types: ["bun-types"]` caused `TS2688` on clean installs with `@types/bun`). Consumers must `pnpm add -D @types/bun` and migrate `extends: "@tala-tools/tsconfig/bun.json"` → `"@tala-tools/tsconfig/bun-base.json"`.

## 0.0.2

### Patch Changes

- 1b07a94: up deps
