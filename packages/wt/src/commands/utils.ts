import pc from 'picocolors'

import type { ApplyResult } from '../core/links.js'

const ACTION_ICONS: Record<ApplyResult['action'], string> = {
    linked: pc.green('✓'),
    copied: pc.green('✓'),
    skipped: pc.dim('○'),
    ok: pc.green('✓'),
    'created-source': pc.blue('+'),
}

const ACTION_LABELS: Record<ApplyResult['action'], string> = {
    linked: 'linked',
    copied: 'copied',
    skipped: 'skipped',
    ok: 'ok',
    'created-source': 'created source',
}

export function printResults(results: ApplyResult[]): void {
    for (const result of results) {
        const icon = ACTION_ICONS[result.action]
        const label = ACTION_LABELS[result.action]
        const detail = result.detail ? pc.dim(` ${result.detail}`) : ''
        console.log(`  ${icon} ${pc.bold(result.path)} ${pc.dim(label)}${detail}`)
    }
}
