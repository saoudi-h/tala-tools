import { execFileSync } from 'node:child_process'

/**
 * Run a git command, inheriting stdio (visible to the user).
 */
export function runGit(cwd: string, args: string[]): void {
    execFileSync('git', args, { cwd, stdio: 'inherit' })
}

/**
 * Run a git command and return the trimmed stdout.
 */
export function gitOutput(cwd: string, args: string[]): string {
    return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

/**
 * Get the repository root from the current working directory.
 */
export function getRepoRoot(cwd: string = process.cwd()): string {
    return gitOutput(cwd, ['rev-parse', '--show-toplevel'])
}

/**
 * List all git worktrees as parsed objects.
 */
export function listWorktrees(repoRoot: string): WorktreeInfo[] {
    const raw = gitOutput(repoRoot, ['worktree', 'list', '--porcelain'])
    if (!raw) return []

    const entries = raw.split('\n\n').filter(Boolean)
    return entries.map(entry => {
        const lines = entry.split('\n')
        const info: Partial<WorktreeInfo> = {}

        for (const line of lines) {
            if (line.startsWith('worktree ')) {
                info.path = line.slice('worktree '.length)
            } else if (line.startsWith('HEAD ')) {
                info.head = line.slice('HEAD '.length)
            } else if (line.startsWith('branch ')) {
                info.branch = line.slice('branch '.length).replace('refs/heads/', '')
            } else if (line === 'bare') {
                info.bare = true
            } else if (line === 'detached') {
                info.detached = true
            } else if (line === 'prunable') {
                info.prunable = true
            }
        }

        return {
            path: info.path ?? '',
            head: info.head ?? '',
            branch: info.branch,
            bare: info.bare ?? false,
            detached: info.detached ?? false,
            prunable: info.prunable ?? false,
        }
    })
}

export interface WorktreeInfo {
    path: string
    head: string
    branch?: string
    bare: boolean
    detached: boolean
    prunable: boolean
}
