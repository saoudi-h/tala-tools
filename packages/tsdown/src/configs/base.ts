import type { UserConfigFn } from 'tsdown/config'
import { defineConfig } from 'tsdown/config'

export const base: UserConfigFn = defineConfig((_inlineConfig, _context) => ({
    entry: ['./src/**/*.ts'],
    platform: 'node',
    dts: {
        sourcemap: true,
    },
    unused: {
        level: 'error',
        ignore: ['typescript'],
    },
    format: ['esm'],
    publint: true,
    exports: true,
    fixedExtension: true,
    minify: true,
    unbundle: false,
    onSuccess() {
        console.info('🙏 Build succeeded!')
    },
    clean: true,
}))
