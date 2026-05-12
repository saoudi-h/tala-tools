# @tala-tools/wt

Git worktree resource synchronization — symlink, copy, or skip local files when creating worktrees.

## The Problem

`git worktree add` creates a checkout of your tracked files, but a real project won't work without its **untracked local state**: `.env` files, `node_modules`, heavy asset directories, build caches, Python venvs, etc.

`wt` bridges this gap with a **declarative config** that describes how each resource should be synchronized into new worktrees.

## Install

```bash
# As a project dependency
pnpm add -D @tala-tools/wt

# Or run directly
npx @tala-tools/wt status
```

## Quick Start

```bash
# 1. Initialize config
wt init

# 2. Edit wt.config.ts to declare your resources

# 3. Create a worktree
wt create feature-auth

# 4. Check everything is synced
wt doctor feature-auth

# 5. See all worktrees
wt status
```

## Configuration

Create a `wt.config.ts` at your repo root:

```typescript
import { defineConfig } from '@tala-tools/wt'

export default defineConfig({
    worktreeDir: '.worktrees',
    branchTemplate: 'wt/{name}',

    links: [
        // Secrets — copy into each worktree (one-shot, not live)
        { path: '.env', strategy: 'copy', optional: true },

        // Heavy directories — share via symlink
        { path: 'apps/myapp/out', strategy: 'symlink', createIfMissing: true },
        { path: 'public/assets', strategy: 'symlink' },

        // Dependencies — document but don't sync (run pnpm install instead)
        { path: 'node_modules', strategy: 'skip' },
    ],

    // Named presets for commonly used worktrees
    presets: {
        frontend: { description: 'Frontend development' },
        backend: {
            description: 'Backend work',
            extraLinks: [{ path: '.venv', strategy: 'symlink', optional: true }],
        },
    },

    // Automate post-creation setup
    afterCreate: async ({ worktreePath }) => {
        const { execSync } = await import('node:child_process')
        execSync('pnpm install', { cwd: worktreePath, stdio: 'inherit' })
    },
})
```

## Link Strategies

| Strategy  | Behavior                                     | Use For                             |
| --------- | -------------------------------------------- | ----------------------------------- |
| `symlink` | Creates a symbolic link to the main worktree | Large assets, build outputs, caches |
| `copy`    | Copies the file/directory (one-shot)         | `.env`, tokens, small config files  |
| `skip`    | Does nothing (documentation only)            | `node_modules`, `.venv` (use hooks) |

## Commands

### `wt init`

Generate a starter `wt.config.ts` with commented examples.

### `wt create <name>`

Create a git worktree and sync all configured resources.

```bash
wt create feature-auth              # Uses default settings
wt create feature-auth --from main  # Branch from main
wt create feature-auth --force      # Replace existing symlinks
```

### `wt sync <name>`

Re-apply links to an existing worktree. Run after changing `wt.config.ts`.

### `wt doctor <name>`

Check that all links are correctly set up. Returns exit code 1 if issues found.

### `wt status`

Show all git worktrees with their sync status and any unmatched presets.

### `wt remove <name>`

Remove a worktree. Use `--delete-branch` to also delete the git branch.

```bash
wt remove feature-auth --delete-branch
```

## Link Options

```typescript
{
    // Required: path relative to worktree root
    path: 'apps/myapp/out',

    // Optional: source path (defaults to path)
    source: 'apps/myapp/out',

    // Strategy: 'symlink' (default) | 'copy' | 'skip'
    strategy: 'symlink',

    // Don't fail if source doesn't exist
    optional: true,

    // Create the source directory if missing (symlink only)
    createIfMissing: true,
}
```

## Safety

- **Never replaces real files or directories** — only symlinks (with `--force`)
- **Git exclude is automatic** — synced paths are excluded from `git status`
- **Declarative** — nothing happens that isn't in your config

## Platform Support

| Platform | Status                                           |
| -------- | ------------------------------------------------ |
| Linux    | ✅ Fully supported                               |
| macOS    | ✅ Fully supported                               |
| Windows  | 🟡 Experimental (uses junctions for directories) |

## License

MIT
