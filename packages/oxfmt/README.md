# @tala-tools/oxfmt

Shared Oxfmt defaults for Tala projects.

## Installation

```bash
pnpm add -D @tala-tools/oxfmt oxfmt
```

## Usage

Create `oxfmt.config.ts` in the consuming project:

```typescript
import config from '@tala-tools/oxfmt'

export default config
```

The preset preserves Tala's existing formatting conventions and enables native
import sorting. Tailwind class ordering is intentionally disabled: use the
`tailwind` preset from `@tala-tools/oxlint`, which also validates classes with
the project Tailwind context.
