import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import type { Link } from '../types.js'
import { gitOutput } from './git.js'

// ---------------------------------------------------------------------------
// Git exclude file management
// ---------------------------------------------------------------------------

const MARKER_START = '# wt-sync start'
const MARKER_END = '# wt-sync end'

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Update the git exclude file for a worktree to ignore synced paths.
 *
 * Uses the worktree-specific `info/exclude` file (not `.gitignore`)
 * so that the exclusions don't pollute the repository.
 *
 * The managed block is delimited by markers and is fully replaced on each sync.
 */
export function syncExclude(worktreePath: string, links: Link[]): string {
    const excludePath = gitOutput(worktreePath, ['rev-parse', '--git-path', 'info/exclude'])

    const previous = existsSync(excludePath) ? readFileSync(excludePath, 'utf8') : ''

    // Remove any existing managed block
    const withoutBlock = previous
        .replace(
            new RegExp(
                `\\n?${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}\\n?`,
                'g'
            ),
            '\n'
        )
        .trimEnd()

    // Build new patterns from links (only symlink/copy, not skip)
    const managedLinks = links.filter(l => l.strategy !== 'skip')
    const patterns = [
        ...new Set(
            managedLinks.flatMap(link => {
                // Add both the path and path/ to cover files and directories
                return [link.path, `${link.path}/`]
            })
        ),
    ].sort()

    if (patterns.length === 0) return excludePath

    const block = [MARKER_START, ...patterns, MARKER_END].join('\n')
    const next = `${withoutBlock}${withoutBlock ? '\n\n' : ''}${block}\n`

    mkdirSync(path.dirname(excludePath), { recursive: true })
    writeFileSync(excludePath, next)

    return excludePath
}
