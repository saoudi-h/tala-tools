/** @type {import('oxlint').OxlintConfig} */
export const base = {
    plugins: ['typescript'],
    categories: {
        correctness: 'warn',
    },
    env: {
        builtin: true,
        browser: true,
        node: true,
    },
    rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'typescript/no-explicit-any': 'off',
        'typescript/consistent-type-imports': [
            'warn',
            { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
        ],
    },
}

/** @type {import('oxlint').OxlintConfig} */
export const react = {
    plugins: ['react'],
    rules: {
        'react/rules-of-hooks': 'error',
        'react/exhaustive-deps': 'warn',
    },
}

/** @type {import('oxlint').OxlintConfig} */
export const next = {
    plugins: ['nextjs'],
    rules: {
        'nextjs/no-img-element': 'warn',
        'nextjs/no-html-link-for-pages': 'error',
        'nextjs/no-sync-scripts': 'error',
        'nextjs/inline-script-id': 'error',
        'nextjs/no-document-import-in-page': 'error',
        'nextjs/no-duplicate-head': 'error',
        'nextjs/no-head-import-in-document': 'error',
        'nextjs/no-script-component-in-head': 'error',
    },
}

/** @type {import('oxlint').OxlintConfig} */
export const tailwind = {
    jsPlugins: ['eslint-plugin-better-tailwindcss'],
    settings: {
        'better-tailwindcss': {
            variables: ['className', 'classNames', 'classes'],
        },
    },
    rules: {
        'better-tailwindcss/enforce-consistent-class-order': 'warn',
        'better-tailwindcss/enforce-consistent-line-wrapping': 'warn',
        'better-tailwindcss/no-deprecated-classes': 'warn',
        'better-tailwindcss/no-duplicate-classes': 'warn',
        'better-tailwindcss/no-unnecessary-whitespace': 'warn',
        'better-tailwindcss/enforce-canonical-classes': 'warn',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-unknown-classes': 'error',
    },
}

/** @type {import('oxlint').OxlintConfig} */
export const typeAware = {
    rules: {
        'typescript/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
        'typescript/no-unnecessary-condition': 'warn',
    },
}
