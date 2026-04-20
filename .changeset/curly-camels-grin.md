---
'@tala-tools/eslint': patch
'@tala-tools/tsdown': patch
'@tala-tools/prettier': patch
---

Enable IDE "Go to Definition" support by:

- Adding declaration maps (`.d.mts.map`) to link type definitions back to source files
- Including `src/` directory in published packages for source navigation
- Using tsdown's `customExports` feature to auto-generate `exports` field with `types` conditions
- Creating `index.d.ts` for prettier config package

This allows IDEs to navigate directly to source code when clicking on imported symbols.
