# AGENT: packages/prettier

- Purpose: publish the shared Prettier configuration directly from `index.js`.
- Keep the package ESM and retain the matching `index.d.ts` declaration.
- Prettier is a required peer dependency; avoid introducing a build step unless approved.
