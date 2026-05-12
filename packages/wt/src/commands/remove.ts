import { existsSync, rmSync } from 'node:fs'
import pc from 'picocolors'

import { loadConfig } from '../core/config.js'
import { getRepoRoot, runGit } from '../core/git.js'
import { resolvePaths } from '../core/resolve.js'
import type { SharedOptions } from '../types.js'

interface RemoveOptions extends Pick<SharedOptions, 'config' | 'worktree'> {
    deleteBranch?: boolean
}

export async function remove(name: string, options: RemoveOptions): Promise<void> {
    const repoRoot = getRepoRoot()
    const config = await loadConfig(repoRoot, options.config)
    const { worktreePath, resolved } = await resolvePaths(repoRoot, config, name, options)

    if (!existsSync(worktreePath)) {
        console.log(pc.yellow('⚠') + ` Worktree not found at ${pc.dim(worktreePath)}`)
        return
    }

    // Remove the worktree
    console.log(pc.blue('🗑') + ` Removing worktree ${pc.cyan(name)}...`)

    try {
        runGit(repoRoot, ['worktree', 'remove', worktreePath, '--force'])
        console.log(pc.green('✓') + ` Removed worktree at ${pc.dim(worktreePath)}`)
    } catch {
        // If git worktree remove fails (e.g. dirty), try manual removal
        console.log(pc.yellow('⚠') + ' git worktree remove failed, attempting manual cleanup...')
        rmSync(worktreePath, { recursive: true, force: true })
        runGit(repoRoot, ['worktree', 'prune'])
        console.log(pc.green('✓') + ` Cleaned up ${pc.dim(worktreePath)}`)
    }

    // Optionally delete the branch
    if (options.deleteBranch) {
        try {
            runGit(repoRoot, ['branch', '-D', resolved.branch])
            console.log(pc.green('✓') + ` Deleted branch ${pc.dim(resolved.branch)}`)
        } catch {
            console.log(pc.yellow('⚠') + ` Could not delete branch ${resolved.branch}`)
        }
    }

    console.log()
    console.log(pc.green('✨') + ' Done!')
}
