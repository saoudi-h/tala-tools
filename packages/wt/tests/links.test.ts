import { existsSync, mkdirSync, readFileSync, readlinkSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { applyLink, checkLink } from '../src/core/links.js'
import type { Link } from '../src/types.js'

let testDir: string
let sourceRoot: string
let targetRoot: string

beforeEach(() => {
    testDir = path.join(tmpdir(), `wt-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    sourceRoot = path.join(testDir, 'source')
    targetRoot = path.join(testDir, 'target')
    mkdirSync(sourceRoot, { recursive: true })
    mkdirSync(targetRoot, { recursive: true })
})

afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
})

function makeLink(overrides: Partial<Link> & { path: string }): Link {
    return {
        source: overrides.path,
        strategy: 'symlink',
        optional: false,
        createIfMissing: false,
        ...overrides,
    }
}

describe('applyLink — symlink strategy', () => {
    it('should create a symlink for an existing source directory', () => {
        const srcDir = path.join(sourceRoot, 'out')
        mkdirSync(srcDir, { recursive: true })

        const link = makeLink({ path: 'out', strategy: 'symlink' })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result).not.toBeNull()
        expect(result!.action).toBe('linked')

        const targetPath = path.join(targetRoot, 'out')
        expect(existsSync(targetPath)).toBe(true)
        expect(readlinkSync(targetPath)).toBe(srcDir)
    })

    it('should create a symlink for an existing source file', () => {
        writeFileSync(path.join(sourceRoot, '.env'), 'SECRET=123')

        const link = makeLink({ path: '.env', strategy: 'symlink' })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('linked')
        const targetPath = path.join(targetRoot, '.env')
        expect(readFileSync(targetPath, 'utf8')).toBe('SECRET=123')
    })

    it('should return ok when symlink already points to correct target', () => {
        const srcDir = path.join(sourceRoot, 'out')
        mkdirSync(srcDir, { recursive: true })

        const link = makeLink({ path: 'out', strategy: 'symlink' })
        applyLink(link, sourceRoot, targetRoot)

        const result = applyLink(link, sourceRoot, targetRoot)
        expect(result!.action).toBe('ok')
    })

    it('should throw when symlink points elsewhere and force is false', () => {
        const srcDir = path.join(sourceRoot, 'out')
        mkdirSync(srcDir, { recursive: true })

        const link = makeLink({ path: 'out', strategy: 'symlink' })
        applyLink(link, sourceRoot, targetRoot)

        // Create a different source
        const otherSource = path.join(testDir, 'other-source')
        mkdirSync(path.join(otherSource, 'out'), { recursive: true })

        expect(() => {
            applyLink(link, otherSource, targetRoot)
        }).toThrow(/Refusing to replace symlink/)
    })

    it('should replace symlink when force is true', () => {
        const srcDir = path.join(sourceRoot, 'out')
        mkdirSync(srcDir, { recursive: true })

        const link = makeLink({ path: 'out', strategy: 'symlink' })
        applyLink(link, sourceRoot, targetRoot)

        const otherSource = path.join(testDir, 'other-source')
        mkdirSync(path.join(otherSource, 'out'), { recursive: true })

        const result = applyLink(link, otherSource, targetRoot, true)
        expect(result!.action).toBe('linked')
        expect(readlinkSync(path.join(targetRoot, 'out'))).toBe(path.join(otherSource, 'out'))
    })

    it('should throw when target is a real file/directory', () => {
        mkdirSync(path.join(sourceRoot, 'out'), { recursive: true })
        mkdirSync(path.join(targetRoot, 'out'), { recursive: true })

        const link = makeLink({ path: 'out', strategy: 'symlink' })
        expect(() => {
            applyLink(link, sourceRoot, targetRoot)
        }).toThrow(/Refusing to replace real path/)
    })

    it('should create source directory when createIfMissing is true', () => {
        const link = makeLink({ path: 'new-dir', strategy: 'symlink', createIfMissing: true })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('linked')
        expect(existsSync(path.join(sourceRoot, 'new-dir'))).toBe(true)
    })

    it('should create nested parent directories for the target', () => {
        mkdirSync(path.join(sourceRoot, 'deep'), { recursive: true })
        const link = makeLink({ path: 'a/b/c/deep', source: 'deep', strategy: 'symlink' })

        const result = applyLink(link, sourceRoot, targetRoot)
        expect(result!.action).toBe('linked')
        expect(existsSync(path.join(targetRoot, 'a/b/c/deep'))).toBe(true)
    })
})

describe('applyLink — copy strategy', () => {
    it('should copy a file', () => {
        writeFileSync(path.join(sourceRoot, '.env'), 'KEY=value')

        const link = makeLink({ path: '.env', strategy: 'copy' })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('copied')
        expect(readFileSync(path.join(targetRoot, '.env'), 'utf8')).toBe('KEY=value')
    })

    it('should copy a directory recursively', () => {
        const srcDir = path.join(sourceRoot, 'config')
        mkdirSync(srcDir, { recursive: true })
        writeFileSync(path.join(srcDir, 'a.json'), '{}')
        writeFileSync(path.join(srcDir, 'b.json'), '{}')

        const link = makeLink({ path: 'config', strategy: 'copy' })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('copied')
        expect(existsSync(path.join(targetRoot, 'config/a.json'))).toBe(true)
        expect(existsSync(path.join(targetRoot, 'config/b.json'))).toBe(true)
    })
})

describe('applyLink — skip strategy', () => {
    it('should do nothing and return skipped', () => {
        const link = makeLink({ path: 'node_modules', strategy: 'skip' })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('skipped')
        expect(result!.detail).toBe('strategy: skip')
        expect(existsSync(path.join(targetRoot, 'node_modules'))).toBe(false)
    })
})

describe('applyLink — optional sources', () => {
    it('should skip when optional source is missing', () => {
        const link = makeLink({ path: '.env', strategy: 'symlink', optional: true })
        const result = applyLink(link, sourceRoot, targetRoot)

        expect(result!.action).toBe('skipped')
        expect(result!.detail).toBe('optional source missing')
    })

    it('should throw when non-optional source is missing', () => {
        const link = makeLink({ path: '.env', strategy: 'symlink', optional: false })
        expect(() => {
            applyLink(link, sourceRoot, targetRoot)
        }).toThrow(/Missing source/)
    })
})

describe('checkLink', () => {
    it('should report ok for correct symlink', () => {
        mkdirSync(path.join(sourceRoot, 'out'), { recursive: true })
        const link = makeLink({ path: 'out', strategy: 'symlink' })
        applyLink(link, sourceRoot, targetRoot)

        const result = checkLink(link, sourceRoot, targetRoot)
        expect(result.ok).toBe(true)
        expect(result.message).toBe('ok')
    })

    it('should report fail for missing target', () => {
        mkdirSync(path.join(sourceRoot, 'out'), { recursive: true })
        const link = makeLink({ path: 'out', strategy: 'symlink' })

        const result = checkLink(link, sourceRoot, targetRoot)
        expect(result.ok).toBe(false)
        expect(result.message).toBe('target missing')
    })

    it('should report ok for skip strategy', () => {
        const link = makeLink({ path: 'node_modules', strategy: 'skip' })
        const result = checkLink(link, sourceRoot, targetRoot)
        expect(result.ok).toBe(true)
        expect(result.message).toContain('skip')
    })

    it('should report ok for existing copy', () => {
        writeFileSync(path.join(sourceRoot, '.env'), 'KEY=val')
        const link = makeLink({ path: '.env', strategy: 'copy' })
        applyLink(link, sourceRoot, targetRoot)

        const result = checkLink(link, sourceRoot, targetRoot)
        expect(result.ok).toBe(true)
        expect(result.message).toContain('copy')
    })

    it('should report ok for optional missing source', () => {
        const link = makeLink({ path: '.env', strategy: 'symlink', optional: true })
        const result = checkLink(link, sourceRoot, targetRoot)
        expect(result.ok).toBe(true)
    })

    it('should report fail for wrong symlink target', () => {
        mkdirSync(path.join(sourceRoot, 'out'), { recursive: true })
        const link = makeLink({ path: 'out', strategy: 'symlink' })
        applyLink(link, sourceRoot, targetRoot)

        // Check against a different source
        const otherSource = path.join(testDir, 'other')
        mkdirSync(path.join(otherSource, 'out'), { recursive: true })

        const result = checkLink(link, otherSource, targetRoot)
        expect(result.ok).toBe(false)
        expect(result.message).toContain('wrong target')
    })
})
