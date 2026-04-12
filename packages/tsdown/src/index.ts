import { defineConfig as tsdownDefine } from 'tsdown/config'
import { base } from './configs/base.js'

/**
 * Options for tsdown configuration
 */
export type Options = import('tsdown/config').Options

/**
 * Function type for tsdown configuration
 */
export type UserConfigFn = import('tsdown/config').UserConfigFn

/**
 * Helper to define tsdown configuration with Tala Tools defaults
 */
export const defineConfig = (options: Options | UserConfigFn): UserConfigFn => {
    return tsdownDefine(async (context) => {
        const baseConfig = await (typeof base === 'function' ? base(context) : base)
        const userConfig = await (typeof options === 'function' ? options(context) : options)

        return {
            ...baseConfig,
            ...userConfig,
        }
    })
}

export * from './configs/index.js'
