import { z } from 'zod'

// ---------------------------------------------------------------------------
// Link schema
// ---------------------------------------------------------------------------

export const linkStrategySchema = z.enum(['symlink', 'copy', 'skip'])

export const linkSchema = z
    .object({
        /** Path relative to the worktree root. */
        path: z.string().min(1),

        /**
         * Source path relative to the main worktree root.
         * Defaults to `path` when omitted.
         */
        source: z.string().min(1).optional(),

        /** Sync strategy. Default: `'symlink'`. */
        strategy: linkStrategySchema.default('symlink'),

        /** Don't fail if the source doesn't exist. Default: `false`. */
        optional: z.boolean().default(false),

        /**
         * Create the source directory if it doesn't exist.
         * Only applies when strategy is `'symlink'`. Default: `false`.
         */
        createIfMissing: z.boolean().default(false),
    })
    .transform(link => ({
        ...link,
        // If source is not provided, default to path
        source: link.source ?? link.path,
    }))

// ---------------------------------------------------------------------------
// Preset schema
// ---------------------------------------------------------------------------

export const presetSchema = z.object({
    description: z.string().optional(),
    branch: z.string().optional(),
    extraLinks: z.array(linkSchema).optional(),
})

// ---------------------------------------------------------------------------
// Config schema
// ---------------------------------------------------------------------------

export const wtConfigSchema = z.object({
    /** Directory for worktrees, relative to repo root. Default: `'.worktrees'`. */
    worktreeDir: z.string().default('.worktrees'),

    /**
     * Branch name template. `{name}` is replaced with the worktree name.
     * Default: `'wt/{name}'`.
     */
    branchTemplate: z.string().default('wt/{name}'),

    /** Global links applied to all worktrees. */
    links: z.array(linkSchema),

    /** Named worktree presets with optional extra links. */
    presets: z.record(z.string(), presetSchema).optional(),

    /** Hook called after worktree creation and initial sync. */
    afterCreate: z
        .function()
        .args(
            z.object({
                name: z.string(),
                worktreePath: z.string(),
                mainPath: z.string(),
            })
        )
        .returns(z.union([z.void(), z.promise(z.void())]))
        .optional(),

    /** Hook called after sync (including the sync that follows create). */
    afterSync: z
        .function()
        .args(
            z.object({
                name: z.string(),
                worktreePath: z.string(),
                mainPath: z.string(),
            })
        )
        .returns(z.union([z.void(), z.promise(z.void())]))
        .optional(),
})

// ---------------------------------------------------------------------------
// Input types (before Zod transforms)
// ---------------------------------------------------------------------------

/** The shape users write in `wt.config.ts` (before Zod defaults/transforms). */
export type WtConfigInput = z.input<typeof wtConfigSchema>
