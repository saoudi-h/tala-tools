import type { z } from 'zod'

import type { linkSchema, wtConfigSchema } from './core/schema.js'

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

/** How a resource is synchronized into a worktree. */
export type LinkStrategy = 'symlink' | 'copy' | 'skip'

/**
 * A single resource to synchronize.
 *
 * - `symlink` — creates a symbolic link from the worktree to the main tree.
 * - `copy`    — copies the file/directory into the worktree (one-shot, not live).
 * - `skip`    — documents the resource but does nothing (useful for node_modules).
 */
export type Link = z.infer<typeof linkSchema>

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Context passed to lifecycle hooks. */
export interface HookContext {
    /** The user-chosen worktree name (e.g. "topquiz"). */
    name: string
    /** Absolute path of the newly created/synced worktree. */
    worktreePath: string
    /** Absolute path of the main (source) worktree. */
    mainPath: string
}

/** A lifecycle hook — sync or async. */
export type Hook = (ctx: HookContext) => void | Promise<void>

// ---------------------------------------------------------------------------
// Preset
// ---------------------------------------------------------------------------

/** A named worktree preset with optional overrides. */
export interface Preset {
    /** Human-readable description. */
    description?: string
    /** Override the branch name (default: `wt/{name}`). */
    branch?: string
    /** Extra links merged after the global `links` array. */
    extraLinks?: Link[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Full configuration object for `@tala-tools/wt`.
 *
 * Authored in `wt.config.ts` via the `defineConfig` helper.
 */
export type WtConfig = z.infer<typeof wtConfigSchema>

// ---------------------------------------------------------------------------
// Resolved (internal but exposed for testing)
// ---------------------------------------------------------------------------

/** A preset resolved with global links merged in. */
export interface ResolvedWorktree {
    /** Merged links (global + preset extraLinks). */
    links: Link[]
    /** Resolved branch name. */
    branch: string
    /** Original preset metadata (if any). */
    preset?: Preset
}

// ---------------------------------------------------------------------------
// CLI option bags
// ---------------------------------------------------------------------------

export interface SharedOptions {
    config?: string
    force?: boolean
    sourceRoot?: string
    worktree?: string
}

export interface CreateOptions extends SharedOptions {
    branch?: string
    from?: string
}

// ---------------------------------------------------------------------------
// Doctor result
// ---------------------------------------------------------------------------

export interface LinkCheckResult {
    ok: boolean
    path: string
    message: string
}
