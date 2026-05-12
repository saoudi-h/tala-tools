import path from 'node:path'

import type { Link, ResolvedWorktree, WtConfig } from '../types.js'

/**
 * Resolve a worktree name into its full configuration by merging
 * global links with any preset-specific extra links.
 */
export function resolveWorktree(config: WtConfig, name: string): ResolvedWorktree {
    const preset = config.presets?.[name]
    const branchTemplate = preset?.branch ?? config.branchTemplate
    const branch = branchTemplate.replace('{name}', name)
    const extraLinks: Link[] = preset?.extraLinks ?? []

    return {
        links: [...config.links, ...extraLinks],
        branch,
        preset,
    }
}

/**
 * Get the default worktree path for a given name.
 */
export function getWorktreePath(repoRoot: string, config: WtConfig, name: string): string {
    return path.resolve(repoRoot, config.worktreeDir, name)
}

/**
 * Resolve all paths needed for a worktree operation.
 */
export interface ResolvedPaths {
    repoRoot: string
    sourceRoot: string
    worktreePath: string
    resolved: ResolvedWorktree
    config: WtConfig
}

export async function resolvePaths(
    repoRoot: string,
    config: WtConfig,
    name: string,
    options: { sourceRoot?: string; worktree?: string }
): Promise<ResolvedPaths> {
    const resolved = resolveWorktree(config, name)
    const worktreePath = options.worktree
        ? path.resolve(repoRoot, options.worktree)
        : getWorktreePath(repoRoot, config, name)
    const sourceRoot = options.sourceRoot ? path.resolve(repoRoot, options.sourceRoot) : repoRoot

    return { repoRoot, sourceRoot, worktreePath, resolved, config }
}
