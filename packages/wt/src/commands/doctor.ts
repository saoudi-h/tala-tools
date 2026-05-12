import pc from 'picocolors'

import { loadConfig } from '../core/config.js'
import { getRepoRoot } from '../core/git.js'
import { checkLinks } from '../core/links.js'
import { resolvePaths } from '../core/resolve.js'
import type { SharedOptions } from '../types.js'

export async function doctor(name: string, options: SharedOptions): Promise<void> {
    const repoRoot = getRepoRoot()
    const config = await loadConfig(repoRoot, options.config)
    const { sourceRoot, worktreePath, resolved } = await resolvePaths(
        repoRoot,
        config,
        name,
        options
    )

    console.log(pc.blue('🩺') + ` Checking ${pc.cyan(name)} at ${pc.dim(worktreePath)}`)
    console.log()

    const results = checkLinks(resolved.links, sourceRoot, worktreePath)
    let failures = 0

    for (const result of results) {
        if (result.ok) {
            console.log(`  ${pc.green('OK')}   ${result.path} ${pc.dim(`— ${result.message}`)}`)
        } else {
            console.log(`  ${pc.red('FAIL')} ${result.path} ${pc.dim(`— ${result.message}`)}`)
            failures++
        }
    }

    console.log()

    if (failures > 0) {
        console.log(pc.red(`✗ ${failures} link(s) need attention. Run: wt sync ${name}`))
        process.exit(1)
    } else {
        console.log(pc.green('✓ All links OK'))
    }
}
