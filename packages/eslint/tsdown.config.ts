import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown/config'

const config: UserConfig = defineConfig({
    entry: ['src/index.ts'],
    shims: true,
    dts: {
        sourcemap: true,
    },
    exports: {
        customExports(pkg, _context) {
            // Enrich tsdown-generated exports with types condition
            const outputPath = pkg['.']
            if (outputPath && typeof outputPath === 'string') {
                const dtsPath = outputPath.replace('.mjs', '.d.mts')
                pkg['.'] = {
                    types: dtsPath,
                    default: outputPath,
                }
            }
            pkg['./package.json'] = './package.json'
            return pkg
        },
    },
})

export default config
