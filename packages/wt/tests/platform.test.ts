import { describe, expect, it } from 'vitest'

import { supportsSymlinks, symlinkType } from '../src/core/platform.js'

describe('symlinkType', () => {
    it('should return "dir" for directories on non-Windows', () => {
        // This test runs on Linux/macOS
        if (process.platform !== 'win32') {
            expect(symlinkType(true)).toBe('dir')
        }
    })

    it('should return "file" for files on non-Windows', () => {
        if (process.platform !== 'win32') {
            expect(symlinkType(false)).toBe('file')
        }
    })
})

describe('supportsSymlinks', () => {
    it('should return true on Linux/macOS', () => {
        if (process.platform !== 'win32') {
            expect(supportsSymlinks()).toBe(true)
        }
    })
})
