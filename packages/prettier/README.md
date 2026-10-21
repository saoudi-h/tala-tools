# @tala-tools/prettier

Shared Prettier configuration for Tala projects.

## Installation

```bash
pnpm add -D @tala-tools/prettier
```

The shared config enables `prettier-plugin-organize-imports`. Install it to keep
the import sorting, and drop it from the config if you do not want it:

```bash
pnpm add -D prettier-plugin-organize-imports
```

## Usage

In your `prettier.config.js`:

```javascript
import config from '@tala-tools/prettier'

export default config
```

Or in your `package.json`:

```json
{
    "prettier": "@tala-tools/prettier"
}
```

## Config Details

- `tabWidth: 4`
- `semi: false`
- `singleQuote: true`
- `plugins`: Includes `prettier-plugin-organize-imports`.

## License

MIT
