/**
 * Gets relative path from workspace root
 */

import * as path from 'path';

/**
 * Gets relative path from workspace root
 * @param params - Parameters object
 * @param params.absolutePath - Absolute file path
 * @param params.workspaceRoot - Workspace root path
 * @returns Relative path
 */
export function getRelativePath({
  absolutePath,
  workspaceRoot,
}: {
  absolutePath: string;
  workspaceRoot: string;
}): string {
  return path.relative(workspaceRoot, absolutePath);
}
