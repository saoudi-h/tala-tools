# AGENT: packages/eslint

- Purpose: publish reusable ESLint flat-config arrays from `src/index.ts`.
- Public configs: `base`, `react`, `next`, `tailwind`, and `storybook`.
- Build with tsdown; preserve the ESM export shape and generated type exports.
- `eslint` is a required peer dependency and `tailwindcss` is optional.
