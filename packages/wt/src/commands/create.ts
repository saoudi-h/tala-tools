import { existsSync } from 'node:fs'
import pc from 'picocolors'

import { loadConfig } from '../core/config.js'
import { syncExclude } from '../core/exclude.js'
import { getRepoRoot, runGit } from '../core/git.js'
import { applyLinks } from '../core/links.js'
import { resolvePaths } from '../core/resolve.js'
import type { CreateOptions } from '../types.js'
import { printResults } from './utils.js'

export async function create(name: string, options: CreateOptions): Promise<void> {
    const repoRoot = getRepoRoot()
    const config = await loadConfig(repoRoot, options.config)
    const { sourceRoot, worktreePath, resolved } = await resolvePaths(
        repoRoot,
        config,
        name,
        options
    )

    // Create worktree if it doesn't exist
    if (!existsSync(worktreePath)) {
        runGit(repoRoot, [
            'worktree',
            'add',
            '-b',
            resolved.branch,
            worktreePath,
            options.from ?? 'HEAD',
        ])
        console.log(pc.green('✓') + ` Created worktree at ${pc.cyan(worktreePath)}`)
        console.log(pc.dim(`  branch: ${resolved.branch}`))
    } else {
        console.log(pc.yellow('⚠') + ` Worktree already exists at ${pc.cyan(worktreePath)}`)
    }

    // Sync links
    const results = applyLinks(resolved.links, sourceRoot, worktreePath, options.force)
    printResults(results)

    // Sync git exclude
    const excludePath = syncExclude(worktreePath, resolved.links)
    console.log(pc.dim(`  updated git exclude: ${excludePath}`))

    // Run afterSync hook
    if (config.afterSync) {
        console.log(pc.dim('  running afterSync hook...'))
        await config.afterSync({ name, worktreePath, mainPath: sourceRoot })
    }

    // Run afterCreate hook
    if (config.afterCreate) {
        console.log(pc.dim('  running afterCreate hook...'))
        await config.afterCreate({ name, worktreePath, mainPath: sourceRoot })
    }

    console.log()
    console.log(pc.green('✨') + ` Done! Run: ${pc.cyan(`cd ${worktreePath}`)}`)
}
