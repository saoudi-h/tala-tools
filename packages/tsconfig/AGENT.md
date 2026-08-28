# AGENT: packages/tsconfig

- Purpose: publish JSON TypeScript presets without a build step.
- `base.json` is the default export; named presets are exposed through `package.json` exports.
- When adding or renaming a preset, update both its JSON file and the export map.
- Bun suite is isolated: `bun-base.json` (base), `bun-next.json`, `bun-react-library.json`. They do not extend `base.json` DOM via `bun.json`; `bun-base` overrides `lib` to `["ESNext"]` and sets `types: ["bun"]` (requires `@types/bun`). Do not create niche `bun-remotion.json` etc. without real consumer.
