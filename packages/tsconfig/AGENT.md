# AGENT: packages/tsconfig

- Purpose: publish JSON TypeScript presets without a build step.
- `base.json` is the default export; named presets are exposed through `package.json` exports.
- When adding or renaming a preset, update both its JSON file and the export map.
