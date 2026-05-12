import { describe, expect, it } from 'vitest'

import { defineConfig } from '../src/core/config.js'

describe('defineConfig', () => {
    it('should return the config as-is (passthrough)', () => {
        const config = defineConfig({
            links: [{ path: '.env', strategy: 'copy', optional: true }],
        })

        expect(config.links).toHaveLength(1)
        expect(config.links[0]!.path).toBe('.env')
    })

    it('should allow all config options', () => {
        const hook = async () => {}
        const config = defineConfig({
            worktreeDir: '.wt',
            branchTemplate: 'lane/{name}',
            links: [
                { path: '.env', strategy: 'copy' },
                { path: 'out', strategy: 'symlink', createIfMissing: true },
                { path: 'node_modules', strategy: 'skip' },
            ],
            presets: {
                main: { description: 'Main workspace' },
            },
            afterCreate: hook,
            afterSync: hook,
        })

        expect(config.worktreeDir).toBe('.wt')
        expect(config.branchTemplate).toBe('lane/{name}')
        expect(config.links).toHaveLength(3)
        expect(config.presets?.['main']?.description).toBe('Main workspace')
        expect(config.afterCreate).toBe(hook)
        expect(config.afterSync).toBe(hook)
    })
})
