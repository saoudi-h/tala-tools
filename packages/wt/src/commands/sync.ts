import pc from 'picocolors'

import { loadConfig } from '../core/config.js'
import { syncExclude } from '../core/exclude.js'
import { getRepoRoot } from '../core/git.js'
import { applyLinks } from '../core/links.js'
import { resolvePaths } from '../core/resolve.js'
import type { SharedOptions } from '../types.js'
import { printResults } from './utils.js'

export async function sync(name: string, options: SharedOptions): Promise<void> {
    const repoRoot = getRepoRoot()
    const config = await loadConfig(repoRoot, options.config)
    const { sourceRoot, worktreePath, resolved } = await resolvePaths(
        repoRoot,
        config,
        name,
        options
    )

    console.log(pc.blue('🔄') + ` Syncing ${pc.cyan(name)} at ${pc.dim(worktreePath)}`)
    console.log()

    // Apply links
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

    console.log()
    console.log(pc.green('✨') + ' Sync complete!')
}
