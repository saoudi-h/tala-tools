import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { syncExclude } from '../src/core/exclude.js'
import { gitOutput } from '../src/core/git.js'
import type { Link } from '../src/types.js'

let testDir: string
let repoPath: string

beforeEach(() => {
    testDir = path.join(
        tmpdir(),
        `wt-exclude-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    )
    repoPath = path.join(testDir, 'repo')
    mkdirSync(repoPath, { recursive: true })

    // Initialize a git repo for the test
    execFileSync('git', ['init', repoPath], { stdio: 'pipe' })
    execFileSync('git', ['config', 'user.email', 'test@test.com'], { cwd: repoPath, stdio: 'pipe' })
    execFileSync('git', ['config', 'user.name', 'Test'], { cwd: repoPath, stdio: 'pipe' })
    writeFileSync(path.join(repoPath, 'README.md'), '# Test')
    execFileSync('git', ['add', '.'], { cwd: repoPath, stdio: 'pipe' })
    execFileSync('git', ['commit', '-m', 'init'], { cwd: repoPath, stdio: 'pipe' })
})

afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
})

function makeLinks(paths: string[]): Link[] {
    return paths.map(p => ({
        path: p,
        source: p,
        strategy: 'symlink' as const,
        optional: false,
        createIfMissing: false,
    }))
}

describe('syncExclude', () => {
    it('should create exclude file with wt-sync markers', () => {
        const links = makeLinks(['.env', 'out'])
        const excludePath = syncExclude(repoPath, links)

        const content = readFileSync(excludePath, 'utf8')
        expect(content).toContain('# wt-sync start')
        expect(content).toContain('# wt-sync end')
        expect(content).toContain('.env')
        expect(content).toContain('out')
        expect(content).toContain('out/')
    })

    it('should replace existing wt-sync block on re-sync', () => {
        syncExclude(repoPath, makeLinks(['.env']))
        syncExclude(repoPath, makeLinks(['.env', 'out', 'build']))

        const excludePath = gitOutput(repoPath, ['rev-parse', '--git-path', 'info/exclude'])
        const content = readFileSync(excludePath, 'utf8')

        // Should have exactly one block
        const startCount = (content.match(/# wt-sync start/g) || []).length
        expect(startCount).toBe(1)

        // Should contain all three paths
        expect(content).toContain('.env')
        expect(content).toContain('out')
        expect(content).toContain('build')
    })

    it('should preserve existing exclude content outside the managed block', () => {
        const excludePath = gitOutput(repoPath, ['rev-parse', '--git-path', 'info/exclude'])
        mkdirSync(path.dirname(excludePath), { recursive: true })
        writeFileSync(excludePath, '# My custom excludes\n*.log\ntmp/\n')

        syncExclude(repoPath, makeLinks(['.env']))

        const content = readFileSync(excludePath, 'utf8')
        expect(content).toContain('# My custom excludes')
        expect(content).toContain('*.log')
        expect(content).toContain('# wt-sync start')
    })

    it('should not add patterns for skip strategy links', () => {
        const links: Link[] = [
            {
                path: '.env',
                source: '.env',
                strategy: 'symlink',
                optional: false,
                createIfMissing: false,
            },
            {
                path: 'node_modules',
                source: 'node_modules',
                strategy: 'skip',
                optional: false,
                createIfMissing: false,
            },
        ]

        const excludePath = syncExclude(repoPath, links)
        const content = readFileSync(excludePath, 'utf8')

        expect(content).toContain('.env')
        expect(content).not.toContain('node_modules')
    })
})
