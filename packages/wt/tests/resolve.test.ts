import { describe, expect, it } from 'vitest'

import { getWorktreePath, resolveWorktree } from '../src/core/resolve.js'
import type { WtConfig } from '../src/types.js'

function makeConfig(overrides: Partial<WtConfig> = {}): WtConfig {
    return {
        worktreeDir: '.worktrees',
        branchTemplate: 'wt/{name}',
        links: [
            {
                path: '.env',
                source: '.env',
                strategy: 'copy',
                optional: true,
                createIfMissing: false,
            },
            {
                path: 'out',
                source: 'out',
                strategy: 'symlink',
                optional: false,
                createIfMissing: true,
            },
        ],
        ...overrides,
    }
}

describe('resolveWorktree', () => {
    it('should resolve with default branch template', () => {
        const config = makeConfig()
        const resolved = resolveWorktree(config, 'topquiz')

        expect(resolved.branch).toBe('wt/topquiz')
        expect(resolved.links).toHaveLength(2)
    })

    it('should use preset branch when available', () => {
        const config = makeConfig({
            presets: {
                topquiz: { branch: 'lane/topquiz' },
            },
        })
        const resolved = resolveWorktree(config, 'topquiz')
        expect(resolved.branch).toBe('lane/topquiz')
    })

    it('should merge global links with preset extraLinks', () => {
        const config = makeConfig({
            presets: {
                topquiz: {
                    extraLinks: [
                        {
                            path: '.venv',
                            source: '.venv',
                            strategy: 'symlink',
                            optional: true,
                            createIfMissing: false,
                        },
                    ],
                },
            },
        })
        const resolved = resolveWorktree(config, 'topquiz')
        expect(resolved.links).toHaveLength(3)
        expect(resolved.links[2]!.path).toBe('.venv')
    })

    it('should work when preset does not exist', () => {
        const config = makeConfig()
        const resolved = resolveWorktree(config, 'unknown-lane')
        expect(resolved.branch).toBe('wt/unknown-lane')
        expect(resolved.links).toHaveLength(2)
        expect(resolved.preset).toBeUndefined()
    })

    it('should replace {name} in custom branchTemplate', () => {
        const config = makeConfig({ branchTemplate: 'feature/{name}-wip' })
        const resolved = resolveWorktree(config, 'auth')
        expect(resolved.branch).toBe('feature/auth-wip')
    })
})

describe('getWorktreePath', () => {
    it('should build path from worktreeDir and name', () => {
        const config = makeConfig()
        const result = getWorktreePath('/repo', config, 'topquiz')
        expect(result).toBe('/repo/.worktrees/topquiz')
    })

    it('should work with custom worktreeDir', () => {
        const config = makeConfig({ worktreeDir: '../worktrees' })
        const result = getWorktreePath('/repo', config, 'test')
        expect(result).toBe('/worktrees/test')
    })
})
