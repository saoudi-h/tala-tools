type SymlinkType = 'dir' | 'file' | 'junction'

/**
 * Determine the appropriate symlink type for the current platform.
 *
 * - On Windows, directories need 'junction' (works without admin privileges).
 * - On Linux/macOS, 'dir' and 'file' work natively.
 */
export function symlinkType(isDir: boolean): SymlinkType {
    if (process.platform === 'win32') {
        // Junctions work without elevated privileges on Windows
        return isDir ? 'junction' : 'file'
    }
    return isDir ? 'dir' : 'file'
}

/**
 * Whether the current platform natively supports symlinks without special setup.
 */
export function supportsSymlinks(): boolean {
    return process.platform !== 'win32'
}
