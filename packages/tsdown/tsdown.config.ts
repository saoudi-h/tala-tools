import type { UserConfigFn } from 'tsdown/config'
import { defineConfig } from 'tsdown/config'
import { base } from './src/configs/base.js'

const config: UserConfigFn = defineConfig(async (inlineConfig, context) => {
    const baseConfigRaw = await base(inlineConfig, context)
    const baseConfig = Array.isArray(baseConfigRaw) ? baseConfigRaw[0] : baseConfigRaw
    return {
        ...baseConfig,
        unused: {
            ignore: ['publint', 'unplugin-unused'],
        },
        exports: {
            customExports(pkg, _context) {
                // Enrich tsdown-generated exports with types conditions
                const entries = ['.', './configs']
                for (const entry of entries) {
                    const outputPath = pkg[entry]
                    if (outputPath && typeof outputPath === 'string') {
                        const dtsPath = outputPath.replace('.mjs', '.d.mts')
                        pkg[entry] = {
                            types: dtsPath,
                            default: outputPath,
                        }
                    }
                }
                pkg['./package.json'] = './package.json'
                return pkg
            },
        },
        entry: ['./src/index.ts', './src/configs/index.ts'],
    }
})

export default config
