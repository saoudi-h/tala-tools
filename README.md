# Tala Tools

A collection of shared configurations and tools for Tala projects.

## Packages

- [`@tala-tools/eslint`](./packages/eslint): ESLint Flat Configs (TypeScript, React, Next.js, Storybook, Tailwind).
- [`@tala-tools/oxlint`](./packages/oxlint): Native-first Oxlint configurations (TypeScript, React, Next.js, Tailwind).
- [`@tala-tools/prettier`](./packages/prettier): Prettier configuration.
- [`@tala-tools/oxfmt`](./packages/oxfmt): Oxfmt configuration with import sorting.
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
2. Commit it and push to `main`. The `Release` workflow opens a `Version Packages`
   pull request with the bumped versions and changelogs.
3. Merge that pull request. The workflow publishes the unreleased packages to
   NPM.

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC), so no npm token is stored in the repository. Each package in the
`@tala-tools` scope trusts the `saoudi-h/tala-tools` repository and the
`release.yml` workflow.

## License

MIT
