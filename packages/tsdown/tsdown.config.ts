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
        entry: ['./src/index.ts', './src/configs/index.ts'],
    }
})

export default config
