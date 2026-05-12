import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { WtConfig } from '../types.js'
import type { WtConfigInput } from './schema.js'
import { wtConfigSchema } from './schema.js'

// ---------------------------------------------------------------------------
// defineConfig — the public helper users import in wt.config.ts
// ---------------------------------------------------------------------------

/**
 * Type-safe helper for authoring `wt.config.ts`.
 *
 * @example
 * ```ts
 * import { defineConfig } from '@tala-tools/wt'
 *
 * export default defineConfig({
 *   links: [
 *     { path: '.env', strategy: 'copy', optional: true },
 *     { path: 'out', strategy: 'symlink', createIfMissing: true },
 *   ],
 * })
 * ```
 */
export function defineConfig(config: WtConfigInput): WtConfigInput {
    return config
}

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

const CONFIG_FILES = [
    'wt.config.ts',
    'wt.config.mts',
    'wt.config.js',
    'wt.config.mjs',
    'wt.config.json',
] as const

/**
 * Load and validate config from the repo root.
 *
 * Resolution order:
 * 1. Explicit `--config` path
 * 2. `wt.config.ts` / `.mts` / `.js` / `.mjs` (dynamic import)
 * 3. `wt.config.json` (JSON.parse)
 *
 * Falls back to legacy `factory-lanes.config.json` for migration.
 */
export async function loadConfig(repoRoot: string, configPath?: string): Promise<WtConfig> {
    // Explicit path
    if (configPath) {
        const resolved = path.resolve(repoRoot, configPath)
        return loadFromPath(resolved)
    }

    // Search for config files
    for (const name of CONFIG_FILES) {
        const candidate = path.resolve(repoRoot, name)
        if (existsSync(candidate)) {
            return loadFromPath(candidate)
        }
    }

    throw new Error(`No wt config found in ${repoRoot}. Create a wt.config.ts or run: wt init`)
}

async function loadFromPath(filePath: string): Promise<WtConfig> {
    const ext = path.extname(filePath)

    let raw: unknown

    if (ext === '.json') {
        raw = JSON.parse(readFileSync(filePath, 'utf8'))
    } else {
        // Dynamic import for .ts / .mts / .js / .mjs
        // For .ts files, this requires the user's runtime to support TS imports
        // (Node 23+ with --experimental-strip-types, tsx, bun, etc.)
        const mod = (await import(filePath)) as { default?: unknown }
        raw = mod.default ?? mod
    }

    const result = wtConfigSchema.safeParse(raw)

    if (!result.success) {
        const issues = result.error.issues
            .map(i => `  - ${i.path.join('.')}: ${i.message}`)
            .join('\n')
        throw new Error(`Invalid wt config at ${filePath}:\n${issues}`)
    }

    return result.data
}
