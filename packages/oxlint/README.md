# @tala-tools/oxlint

Shared native-first Oxlint configurations for Tala projects.

## Installation

```bash
pnpm add -D @tala-tools/oxlint oxlint
```

Tailwind projects also need the Oxlint-compatible validation plugin:

```bash
pnpm add -D eslint-plugin-better-tailwindcss tailwindcss
```

## Usage

Create `oxlint.config.ts` in the consuming project:

```typescript
import { defineConfig } from 'oxlint'
import { base, next, tailwind } from '@tala-tools/oxlint'

export default defineConfig({
    extends: [base, next, tailwind],
})
```

`tailwind` is the authority for Tailwind class ordering, wrapping, and
correctness rules such as `no-unknown-classes`. Oxfmt deliberately leaves
Tailwind sorting disabled to prevent conflicting auto-fixes. Project-specific
Tailwind settings, such as the stylesheet entrypoint, belong in the local
configuration.

## Type-aware rules

Type-aware rules are opt-in because they require a TypeScript 7 project and
the additional `oxlint-tsgolint` package:

```bash
pnpm add -D oxlint-tsgolint
```

Enable the type-aware engine only in the root config, then compose the preset:

```typescript
import { base, typeAware } from '@tala-tools/oxlint'
import { defineConfig } from 'oxlint'

export default defineConfig({
    extends: [base, typeAware],
    options: {
        typeAware: true,
    },
})
```
