import { type UserConfigFn, defineConfig } from '@tala-tools/tsdown'

const config: UserConfigFn = defineConfig({
    entry: ['src/index.ts'],
})

export default config

