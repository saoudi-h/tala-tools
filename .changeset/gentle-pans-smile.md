---
'@tala-tools/eslint': minor
'@tala-tools/tsdown': patch
---

Stop shipping `eslint-plugin-react` in the shared ESLint preset, and keep `@tala-tools/tsdown` on a Node 20 compatible toolchain.

- ESLint: `eslint-plugin-react` still declares ESLint 9 as its maximum peer and crashes on ESLint 10, because `context.getSourceCode` was removed. The preset never enabled any of its rules, so the default lint output is unchanged. Use `@eslint-react/eslint-plugin` or the native Oxlint `react` plugin for React rules.
- tsdown: pin `unplugin-unused` to `0.5.7`, the last release supporting Node `>=20.19.0`. It also satisfies the `tsdown@0.21.7` peer range, so the package resolves without a peer conflict.
