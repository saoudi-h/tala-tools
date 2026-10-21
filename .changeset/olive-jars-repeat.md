---
'@tala-tools/eslint': patch
'@tala-tools/oxlint': patch
'@tala-tools/prettier': patch
'@tala-tools/tsconfig': patch
---

Align the shared packages with the validated toolchain.

- ESLint: update `eslint-plugin-storybook` to 10.6.3.
- Oxlint: require `oxlint-tsgolint` `^7.0.2003`, the floor required by Oxlint 1.89.0.
- Prettier: declare `prettier-plugin-organize-imports` as an optional peer dependency, since the shared config enables it, and document the install step.
- tsconfig: drop the `./next.json` export, which pointed to a file that does not exist. The Next.js preset is exposed as `./nextjs.json`.
