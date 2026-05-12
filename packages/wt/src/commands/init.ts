import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'

import { getRepoRoot } from '../core/git.js'

const TEMPLATE = `import { defineConfig } from '@tala-tools/wt'

export default defineConfig({
    // Directory where worktrees are created (relative to repo root)
    worktreeDir: '.worktrees',

    // Branch name template ({name} is replaced with worktree name)
    branchTemplate: 'wt/{name}',

    // Resources to synchronize into every worktree
    links: [
        // Secrets — copy into each worktree
        // { path: '.env', strategy: 'copy', optional: true },
        // { path: '.env.local', strategy: 'copy', optional: true },

        // Heavy/generated dirs — share via symlink
        // { path: 'out', strategy: 'symlink', createIfMissing: true },
        // { path: 'build', strategy: 'symlink', createIfMissing: true },

        // Dependencies — skip (run your package manager after create)
        // { path: 'node_modules', strategy: 'skip' },
    ],

    // Named presets for frequently used worktrees
    // presets: {
    //     'feature-a': { description: 'Feature A workspace' },
    // },

    // Run commands after creating a worktree
    // afterCreate: async ({ worktreePath }) => {
    //     const { execSync } = await import('node:child_process')
    //     execSync('pnpm install', { cwd: worktreePath, stdio: 'inherit' })
    // },
})
`

export function init(options: { force?: boolean }): void {
    const repoRoot = getRepoRoot()
    const configPath = path.resolve(repoRoot, 'wt.config.ts')

    if (existsSync(configPath) && !options.force) {
        console.log(
            pc.yellow('⚠') +
                ` Config already exists at ${pc.dim(configPath)}. Use --force to overwrite.`
        )
        return
    }

    writeFileSync(configPath, TEMPLATE)
    console.log(pc.green('✓') + ` Created ${pc.cyan('wt.config.ts')}`)
    console.log(pc.dim('  Edit the file to configure your worktree links.'))
}
