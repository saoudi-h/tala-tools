/**
 * @tala-tools/wt
 *
 * Git worktree resource synchronization.
 *
 * @example
 * ```ts
 * // wt.config.ts
 * import { defineConfig } from '@tala-tools/wt'
 *
 * export default defineConfig({
 *   links: [
 *     { path: '.env', strategy: 'copy', optional: true },
 *     { path: 'out', strategy: 'symlink', createIfMissing: true },
 *   ],
 * })
 * ```
 *
 * @packageDocumentation
 */

export { defineConfig } from './core/config.js'

export type {
    CreateOptions,
    Hook,
    HookContext,
    Link,
    LinkCheckResult,
    LinkStrategy,
    Preset,
    ResolvedWorktree,
    SharedOptions,
    WtConfig,
} from './types.js'
