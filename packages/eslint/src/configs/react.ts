import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import type { Config } from '@eslint/config-helpers'
import { defineConfig } from 'eslint/config'
import { base } from './base.js'

export const react: Config[] = defineConfig([
    ...base,
    reactHooksPlugin.configs.flat.recommended,
    {
        plugins: {
            'jsx-a11y': jsxA11yPlugin,
        },
    },
])
