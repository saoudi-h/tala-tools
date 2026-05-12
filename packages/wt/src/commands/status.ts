import pc from 'picocolors'

import { loadConfig } from '../core/config.js'
import { getRepoRoot, listWorktrees } from '../core/git.js'
import { checkLinks } from '../core/links.js'
import { getWorktreePath, resolveWorktree } from '../core/resolve.js'
import type { SharedOptions } from '../types.js'

export async function status(options: Pick<SharedOptions, 'config'>): Promise<void> {
    const repoRoot = getRepoRoot()
    const config = await loadConfig(repoRoot, options.config)
    const worktrees = listWorktrees(repoRoot)

    console.log(pc.blue('📂') + ` Worktrees for ${pc.cyan(repoRoot)}`)
    console.log()

    if (worktrees.length === 0) {
        console.log(pc.dim('  No worktrees found.'))
        return
    }

    for (const wt of worktrees) {
        const isMain = wt.path === repoRoot
        const branch = wt.branch ?? (wt.detached ? 'detached' : 'unknown')

        // Try to match this worktree to a known preset
        let presetName: string | undefined
        let syncStatus = ''

        if (!isMain) {
            // Check if this worktree path matches any known name
            const presets = config.presets ?? {}
            for (const [name] of Object.entries(presets)) {
                const expectedPath = getWorktreePath(repoRoot, config, name)
                if (wt.path === expectedPath) {
                    presetName = name
                    break
                }
            }

            // Check sync status
            const resolved = resolveWorktree(config, presetName ?? '')
            const results = checkLinks(resolved.links, repoRoot, wt.path)
            const failures = results.filter(r => !r.ok).length

            if (failures === 0) {
                syncStatus = pc.green(' ✓')
            } else {
                syncStatus = pc.yellow(` ⚠ ${failures} issue(s)`)
            }
        }

        const label = isMain
            ? pc.bold(branch) + pc.dim(' (main worktree)')
            : pc.bold(presetName ?? branch)

        const pathDisplay = pc.dim(wt.path)
        const prunable = wt.prunable ? pc.red(' [prunable]') : ''

        console.log(`  ${syncStatus ? syncStatus : '  '} ${label}  ${pathDisplay}${prunable}`)
    }

    // Show presets that don't have a worktree yet
    const presets = config.presets ?? {}
    const missingPresets = Object.entries(presets).filter(([name]) => {
        const expectedPath = getWorktreePath(repoRoot, config, name)
        return !worktrees.some(wt => wt.path === expectedPath)
    })

    if (missingPresets.length > 0) {
        console.log()
        console.log(pc.dim('  Presets without worktree:'))
        for (const [name, preset] of missingPresets) {
            console.log(
                `    ${pc.dim('○')} ${name}${preset.description ? pc.dim(` — ${preset.description}`) : ''}`
            )
        }
    }
}
