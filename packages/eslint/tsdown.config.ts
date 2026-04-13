import { defineConfig } from 'tsdown/config'
import type { UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
    entry: ['src/index.ts'],
    shims: true,
})

export default config
