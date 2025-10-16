/**
 * Validates a file path for security issues
 */

/**
 * Validates a file path for security issues
 * @param filePath - Path to validate
 * @returns True if path is valid, false otherwise
 */
export function validateFilePath(filePath: string): boolean {
  // Reject paths with directory traversal
  if (filePath.includes('..')) {
    return false;
  }

  // Reject paths with home directory reference
  if (filePath.includes('~')) {
    return false;
  }

  // Reject paths with null bytes (path traversal attack)
  if (filePath.includes('\x00')) {
    return false;
  }

  return true;
}
