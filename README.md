# Tala Tools

A collection of shared configurations and tools for Tala projects.

## Packages

- [`@tala-tools/eslint`](./packages/eslint): ESLint Flat Configs (TypeScript, React, Next.js, Storybook, Tailwind).
- [`@tala-tools/prettier`](./packages/prettier): Prettier configuration.
- [`@tala-tools/tsconfig`](./packages/tsconfig): Shared TypeScript configurations.
- [`@tala-tools/tsdown`](./packages/tsdown): Shared build configuration using Rolldown.

## Development

This monorepo uses [PNPM](https://pnpm.io/) and [Turbo](https://turbo.build/).

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Versioning & Publishing

Versioning is managed by [Changesets](https://github.com/changesets/changesets).

1. Create a changeset:
   ```bash
   pnpm changeset
   ```
2. Version the packages:
   ```bash
   pnpm changeset version
   ```
3. Publish to NPM:
   ```bash
   pnpm changeset publish
   ```

## License

MIT
