import { describe, expect, it } from 'vitest'

import { linkSchema, wtConfigSchema } from '../src/core/schema.js'

describe('linkSchema', () => {
    it('should accept minimal link with just path', () => {
        const result = linkSchema.safeParse({ path: '.env' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data).toEqual({
                path: '.env',
                source: '.env',
                strategy: 'symlink',
                optional: false,
                createIfMissing: false,
            })
        }
    })

    it('should default source to path when not provided', () => {
        const result = linkSchema.safeParse({ path: 'apps/myapp/out' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.source).toBe('apps/myapp/out')
        }
    })

    it('should use explicit source when provided', () => {
        const result = linkSchema.safeParse({
            path: 'out',
            source: 'apps/myapp/out',
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.source).toBe('apps/myapp/out')
        }
    })

    it('should accept all strategies', () => {
        for (const strategy of ['symlink', 'copy', 'skip'] as const) {
            const result = linkSchema.safeParse({ path: '.env', strategy })
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.strategy).toBe(strategy)
            }
        }
    })

    it('should reject invalid strategy', () => {
        const result = linkSchema.safeParse({ path: '.env', strategy: 'hardlink' })
        expect(result.success).toBe(false)
    })

    it('should reject empty path', () => {
        const result = linkSchema.safeParse({ path: '' })
        expect(result.success).toBe(false)
    })

    it('should accept optional and createIfMissing flags', () => {
        const result = linkSchema.safeParse({
            path: 'out',
            optional: true,
            createIfMissing: true,
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.optional).toBe(true)
            expect(result.data.createIfMissing).toBe(true)
        }
    })
})

describe('wtConfigSchema', () => {
    it('should accept minimal config with just links', () => {
        const result = wtConfigSchema.safeParse({
            links: [{ path: '.env' }],
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.worktreeDir).toBe('.worktrees')
            expect(result.data.branchTemplate).toBe('wt/{name}')
            expect(result.data.links).toHaveLength(1)
        }
    })

    it('should apply defaults for worktreeDir and branchTemplate', () => {
        const result = wtConfigSchema.safeParse({ links: [] })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.worktreeDir).toBe('.worktrees')
            expect(result.data.branchTemplate).toBe('wt/{name}')
        }
    })

    it('should accept custom worktreeDir and branchTemplate', () => {
        const result = wtConfigSchema.safeParse({
            links: [],
            worktreeDir: '.wt',
            branchTemplate: 'lane/{name}',
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.worktreeDir).toBe('.wt')
            expect(result.data.branchTemplate).toBe('lane/{name}')
        }
    })

    it('should accept presets', () => {
        const result = wtConfigSchema.safeParse({
            links: [],
            presets: {
                frontend: {
                    description: 'Frontend dev',
                    branch: 'wt/frontend-dev',
                    extraLinks: [{ path: '.env', strategy: 'copy' }],
                },
            },
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.presets?.['frontend']?.description).toBe('Frontend dev')
            expect(result.data.presets?.['frontend']?.extraLinks).toHaveLength(1)
        }
    })

    it('should accept afterCreate and afterSync hooks', () => {
        const result = wtConfigSchema.safeParse({
            links: [],
            afterCreate: async () => {},
            afterSync: () => {},
        })
        expect(result.success).toBe(true)
    })

    it('should reject missing links array', () => {
        const result = wtConfigSchema.safeParse({})
        expect(result.success).toBe(false)
    })
})
