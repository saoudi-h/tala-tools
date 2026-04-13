import type { Config } from '@eslint/config-helpers'
import * as js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import * as regexpPlugin from 'eslint-plugin-regexp'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export const base: Config[] = defineConfig([
    {
        ignores: ['.next', 'dist', 'storybook-static', 'node_modules'],
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
                },
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
    },

    // Base JS/TS configs
    js.configs.recommended,
    ...tseslint.configs.recommended,
    regexpPlugin.configs['flat/recommended'],

    // Prettier config to disable conflicting rules
    prettierConfig,

    {
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs',
        },
    },

    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: { attributes: false } },
            ],
            '@typescript-eslint/no-unnecessary-condition': [
                'warn',
                {
                    allowConstantLoopConditions: true,
                },
            ],
        },
    },
])
