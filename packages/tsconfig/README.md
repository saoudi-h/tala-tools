# @tala-tools/tsconfig

Shared TypeScript configurations for Tala projects.

## Installation

```bash
pnpm add -D @tala-tools/tsconfig
```

## Usage

In your `tsconfig.json`:

```json
{
    "extends": "@tala-tools/tsconfig/base.json",
    "compilerOptions": {
        "baseUrl": "."
    }
}
```

## Available Configs

### Node / Browser

- `@tala-tools/tsconfig/base.json`: Base configuration for modern JS/TS (includes `DOM`).
- `@tala-tools/tsconfig/nextjs.json`: Optimized for Next.js (extends `base.json`).
- `@tala-tools/tsconfig/react-library.json`: Optimized for React libraries (extends `base.json`).
- `@tala-tools/tsconfig/remotion.json`: Optimized for Remotion projects (niche, extends `base.json`).

### Bun (requires `pnpm add -D @types/bun`)

Bun presets are isolated from the Node/Browser family and use `types: ["bun"]` (not `bun-types`). Do not mix `bun` and `node` types in the same `types` array.

- `@tala-tools/tsconfig/bun-base.json`: Base Bun runtime (equivalent of `base.json`, `lib: ["ESNext"]`, `module: Preserve`).
- `@tala-tools/tsconfig/bun-next.json`: Bun + Next.js (extends `bun-base.json`).
- `@tala-tools/tsconfig/bun-react-library.json`: Bun + React library (extends `bun-base.json`).

## License

MIT
