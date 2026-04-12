# @tala-tools/eslint

Shared ESLint configurations for Tala projects, using the Flat Config format.

## Installation

```bash
pnpm add -D @tala-tools/eslint
```

## Usage

In your `eslint.config.js`:

```javascript
import { base, react, next, tailwind } from '@tala-tools/eslint'

export default [
    ...base,
    ...react,
    ...next,
    ...tailwind,
    // your custom overrides
]
```

## Available Configs

- `base`: Recommended TS/JS rules, including Prettier integration.
- `react`: React-specific rules (hooks, jsx-a11y).
- `next`: Next.js specific rules.
- `tailwind`: Tailwind CSS class sorting and optimization.
- `storybook`: Storybook specific rules.

## License

MIT
