# AGENT: packages/tsdown

- Purpose: publish `defineConfig` and shared tsdown defaults for TypeScript libraries.
- The base configuration emits ESM, declarations, fixed extensions, and runs publint/unused checks.
- Preserve the deep-merge behavior of `defineConfig` and the `.` / `./configs` export conditions.
- Keep `tsdown`, `publint`, and `unplugin-unused` on exact versions as required by the root context.
