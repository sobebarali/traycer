/**
 * Finds all files in the workspace, excluding certain directories
 */

import { findFiles } from '../../utils/fileSystem';

/**
 * Finds all files in the workspace, excluding certain directories
 * @returns Array of absolute file paths
 */
export async function findWorkspaceFiles(): Promise<string[]> {
  try {
    // Find TypeScript and JavaScript files
    const pattern = '**/*.{ts,tsx,js,jsx,json,md}';

    // Exclude common directories
    const exclude = '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**}';

    const files = await findFiles({ pattern, exclude });

    return files;
  } catch (error) {
    // If findFiles fails, return empty array
    console.error('Failed to find workspace files:', error);
    return [];
  }
}
