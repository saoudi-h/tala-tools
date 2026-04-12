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

- `@tala-tools/tsconfig/base.json`: Base configuration for modern JS/TS.
- `@tala-tools/tsconfig/nextjs.json`: Optimized for Next.js.
- `@tala-tools/tsconfig/react-library.json`: Optimized for React libraries.
- `@tala-tools/tsconfig/bun.json`: Optimized for Bun.
- `@tala-tools/tsconfig/remotion.json`: Optimized for Remotion projects.

## License

MIT
