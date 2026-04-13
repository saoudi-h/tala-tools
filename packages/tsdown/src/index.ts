import { defineConfig as tsdownDefine } from 'tsdown/config'
import { base } from './configs/base.js'
import type { UserConfig, UserConfigFn } from 'tsdown/config'

export type { UserConfig, UserConfigFn } from 'tsdown/config'

type Arrayable<T> = T | T[]

/**
 * Type for tsdown configuration export (object, function, promise, or array)
 */
export type TalaUserConfig = Arrayable<UserConfig> | UserConfigFn | Promise<Arrayable<UserConfig>>

/**
 * Deep merge utility for config objects
 */
function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
    const result = { ...base }

    for (const key in override) {
        if (Object.prototype.hasOwnProperty.call(override, key)) {
            const baseValue = result[key]
            const overrideValue = override[key]

            if (
                typeof baseValue === 'object' &&
                typeof overrideValue === 'object' &&
                baseValue !== null &&
                overrideValue !== null &&
                !Array.isArray(baseValue) &&
                !Array.isArray(overrideValue)
            ) {
                result[key] = deepMerge(
                    baseValue as Record<string, unknown>,
                    overrideValue as Record<string, unknown>
                )
            } else {
                result[key] = overrideValue
            }
        }
    }

    return result
}

/**
 * Helper to define tsdown configuration with Tala Tools defaults
 */
export const defineConfig = (options: TalaUserConfig): UserConfigFn => {
    return tsdownDefine(async (inlineConfig, context) => {
        const baseConfigRaw = await (typeof base === 'function' ? base(inlineConfig, context) : base)
        const baseConfig = Array.isArray(baseConfigRaw) ? baseConfigRaw[0] : baseConfigRaw

        const userConfigRaw = await (typeof options === 'function'
            ? options(inlineConfig, context)
            : options)
        const userConfig = Array.isArray(userConfigRaw) ? userConfigRaw[0] : userConfigRaw

        return deepMerge(baseConfig as Record<string, unknown>, userConfig as Record<string, unknown>) as UserConfig
    })
}

export * from './configs/index.js'
