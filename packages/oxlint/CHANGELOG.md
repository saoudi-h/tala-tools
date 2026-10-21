# @tala-tools/oxlint

## 0.0.3

### Patch Changes

- efff265: Align the shared packages with the validated toolchain.

    - ESLint: update `eslint-plugin-storybook` to 10.6.3.
    - Oxlint: require `oxlint-tsgolint` `^7.0.2003`, the floor required by Oxlint 1.89.0.
    - Prettier: declare `prettier-plugin-organize-imports` as an optional peer dependency, since the shared config enables it, and document the install step.
    - tsconfig: drop the `./next.json` export, which pointed to a file that does not exist. The Next.js preset is exposed as `./nextjs.json`.

## 0.0.2

### Patch Changes

- 795c734: Refresh dependencies across the shared toolchain: ESLint 10.13.0, typescript-eslint 8.72.0, the Next.js ESLint plugin 16.4.2, publint 0.3.25, Zod 4.6.7, Vitest 5.0.5, Oxlint 1.89.0, and Oxfmt 0.74.0.

    The Oxfmt peer range is aligned with the validated Oxfmt release, and the Oxlint preset README is reordered to match Oxfmt's import sorting.

## 0.0.1

### Patch Changes

- 2b26975: Add shared Oxfmt and native-first Oxlint configurations for Tala projects.
