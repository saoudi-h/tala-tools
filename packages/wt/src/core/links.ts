import {
    copyFileSync,
    cpSync,
    existsSync,
    lstatSync,
    mkdirSync,
    readlinkSync,
    symlinkSync,
    unlinkSync,
} from 'node:fs'
import path from 'node:path'

import type { Link, LinkCheckResult } from '../types.js'
import { symlinkType } from './platform.js'

// ---------------------------------------------------------------------------
// Ensure source exists
// ---------------------------------------------------------------------------

function ensureSource(link: Link, sourcePath: string): boolean {
    if (existsSync(sourcePath)) return true

    if (link.createIfMissing && link.strategy === 'symlink') {
        mkdirSync(sourcePath, { recursive: true })
        return true
    }

    return !link.optional
        ? (() => {
              throw new Error(`Missing source for ${link.path}: ${sourcePath}`)
          })()
        : false
}

// ---------------------------------------------------------------------------
// Resolve symlink target to absolute path
// ---------------------------------------------------------------------------

function resolveSymlinkTarget(linkPath: string, rawTarget: string): string {
    return path.resolve(path.dirname(linkPath), rawTarget)
}

// ---------------------------------------------------------------------------
// Detect whether a path is a file or directory
// ---------------------------------------------------------------------------

function isDirectory(sourcePath: string): boolean {
    try {
        return lstatSync(sourcePath).isDirectory()
    } catch {
        return false
    }
}

// ---------------------------------------------------------------------------
// Apply a single link
// ---------------------------------------------------------------------------

export interface ApplyResult {
    path: string
    action: 'linked' | 'copied' | 'skipped' | 'ok' | 'created-source'
    detail?: string
}

export function applyLink(
    link: Link,
    sourceRoot: string,
    targetRoot: string,
    force = false
): ApplyResult | null {
    const sourcePath = path.resolve(sourceRoot, link.source)
    const targetPath = path.resolve(targetRoot, link.path)

    // Skip strategy — do nothing, just document
    if (link.strategy === 'skip') {
        return { path: link.path, action: 'skipped', detail: 'strategy: skip' }
    }

    // Ensure source
    const sourceExists = ensureSource(link, sourcePath)
    if (!sourceExists) {
        return { path: link.path, action: 'skipped', detail: 'optional source missing' }
    }

    // Ensure parent directory exists
    mkdirSync(path.dirname(targetPath), { recursive: true })

    // Handle existing target
    let targetExists = false
    try {
        lstatSync(targetPath)
        targetExists = true
    } catch {
        // Target doesn't exist — that's fine, we'll create it
    }

    if (targetExists) {
        const stat = lstatSync(targetPath)

        if (stat.isSymbolicLink()) {
            if (link.strategy === 'symlink') {
                const currentTarget = resolveSymlinkTarget(targetPath, readlinkSync(targetPath))
                if (currentTarget === sourcePath) {
                    return { path: link.path, action: 'ok' }
                }
                if (!force) {
                    throw new Error(
                        `Refusing to replace symlink ${targetPath} → ${currentTarget} (use --force)`
                    )
                }
                unlinkSync(targetPath)
            } else {
                // copy strategy, target is a symlink — remove it first
                if (!force) {
                    throw new Error(
                        `Refusing to replace existing symlink at ${targetPath} (use --force)`
                    )
                }
                unlinkSync(targetPath)
            }
        } else {
            // Target is a real file/directory
            throw new Error(
                `Refusing to replace real path ${targetPath}. Remove it manually first.`
            )
        }
    }

    // Apply
    if (link.strategy === 'symlink') {
        const type = symlinkType(isDirectory(sourcePath))
        symlinkSync(sourcePath, targetPath, type)
        return { path: link.path, action: 'linked', detail: `→ ${sourcePath}` }
    }

    // Copy strategy
    if (isDirectory(sourcePath)) {
        cpSync(sourcePath, targetPath, { recursive: true })
    } else {
        copyFileSync(sourcePath, targetPath)
    }
    return { path: link.path, action: 'copied', detail: `from ${sourcePath}` }
}

// ---------------------------------------------------------------------------
// Check a single link
// ---------------------------------------------------------------------------

export function checkLink(link: Link, sourceRoot: string, targetRoot: string): LinkCheckResult {
    const sourcePath = path.resolve(sourceRoot, link.source)
    const targetPath = path.resolve(targetRoot, link.path)

    // Skip strategy — always OK
    if (link.strategy === 'skip') {
        return { ok: true, path: link.path, message: 'skip (not managed)' }
    }

    // Copy strategy — just check target exists
    if (link.strategy === 'copy') {
        if (!existsSync(targetPath)) {
            return { ok: false, path: link.path, message: 'target missing (copy)' }
        }
        return { ok: true, path: link.path, message: 'copy exists' }
    }

    // Symlink strategy
    if (!existsSync(sourcePath)) {
        return link.optional
            ? { ok: true, path: link.path, message: 'optional source missing' }
            : { ok: false, path: link.path, message: `source missing: ${link.source}` }
    }

    if (!existsSync(targetPath)) {
        return { ok: false, path: link.path, message: 'target missing' }
    }

    let stat
    try {
        stat = lstatSync(targetPath)
    } catch {
        return { ok: false, path: link.path, message: 'cannot stat target' }
    }

    if (!stat.isSymbolicLink()) {
        return { ok: false, path: link.path, message: 'target is not a symlink' }
    }

    const currentTarget = resolveSymlinkTarget(targetPath, readlinkSync(targetPath))
    if (currentTarget !== sourcePath) {
        return {
            ok: false,
            path: link.path,
            message: `wrong target: ${currentTarget} (expected ${sourcePath})`,
        }
    }

    return { ok: true, path: link.path, message: 'ok' }
}

// ---------------------------------------------------------------------------
// Batch operations
// ---------------------------------------------------------------------------

export function applyLinks(
    links: Link[],
    sourceRoot: string,
    targetRoot: string,
    force = false
): ApplyResult[] {
    const results: ApplyResult[] = []
    for (const link of links) {
        const result = applyLink(link, sourceRoot, targetRoot, force)
        if (result) results.push(result)
    }
    return results
}

export function checkLinks(
    links: Link[],
    sourceRoot: string,
    targetRoot: string
): LinkCheckResult[] {
    return links.map(link => checkLink(link, sourceRoot, targetRoot))
}
