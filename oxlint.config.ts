import { base, tailwind } from '@tala-tools/oxlint'
import { defineConfig } from 'oxlint'

export default defineConfig({
    extends: [base, tailwind],
    ignorePatterns: ['dist', 'node_modules'],
})
