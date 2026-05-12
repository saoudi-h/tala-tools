#!/usr/bin/env node
import { Command } from 'commander'

import type { CreateOptions, SharedOptions } from './types.js'

const program = new Command()

program.name('wt').description('Git worktree resource synchronization').version('0.1.0')

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

program
    .command('init')
    .description('Create a starter wt.config.ts in the repo root')
    .option('--force', 'Overwrite existing config', false)
    .action(async (options: { force: boolean }) => {
        const { init } = await import('./commands/init.js')
        init(options)
    })

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

program
    .command('create <name>')
    .description('Create a git worktree and sync resources')
    .option('--branch <name>', 'Branch name (overrides branchTemplate)')
    .option('--config <path>', 'Config file path')
    .option('--force', 'Replace existing symlinks', false)
    .option('--from <ref>', 'Git ref to branch from', 'HEAD')
    .option('--source-root <path>', 'Main worktree path for shared files')
    .option('--worktree <path>', 'Custom worktree target path')
    .action(async (name: string, options: CreateOptions) => {
        const { create } = await import('./commands/create.js')
        await create(name, options)
    })

// ---------------------------------------------------------------------------
// sync
// ---------------------------------------------------------------------------

program
    .command('sync <name>')
    .description('Re-apply links to an existing worktree')
    .option('--config <path>', 'Config file path')
    .option('--force', 'Replace existing symlinks', false)
    .option('--source-root <path>', 'Main worktree path for shared files')
    .option('--worktree <path>', 'Custom worktree target path')
    .action(async (name: string, options: SharedOptions) => {
        const { sync } = await import('./commands/sync.js')
        await sync(name, options)
    })

// ---------------------------------------------------------------------------
// doctor
// ---------------------------------------------------------------------------

program
    .command('doctor <name>')
    .description('Check link integrity for a worktree')
    .option('--config <path>', 'Config file path')
    .option('--source-root <path>', 'Main worktree path for shared files')
    .option('--worktree <path>', 'Custom worktree target path')
    .action(async (name: string, options: SharedOptions) => {
        const { doctor } = await import('./commands/doctor.js')
        await doctor(name, options)
    })

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

program
    .command('status')
    .description('Show all worktrees and their sync status')
    .option('--config <path>', 'Config file path')
    .action(async (options: Pick<SharedOptions, 'config'>) => {
        const { status } = await import('./commands/status.js')
        await status(options)
    })

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------

program
    .command('remove <name>')
    .description('Remove a worktree and optionally delete its branch')
    .option('--config <path>', 'Config file path')
    .option('--worktree <path>', 'Custom worktree target path')
    .option('--delete-branch', 'Also delete the associated git branch', false)
    .action(async (name: string, options: SharedOptions & { deleteBranch?: boolean }) => {
        const { remove } = await import('./commands/remove.js')
        await remove(name, options)
    })

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

program.parse()
