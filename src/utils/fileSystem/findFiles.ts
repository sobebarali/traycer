/**
 * Finds files matching a glob pattern
 */

import * as vscode from 'vscode';

/**
 * Finds files matching a glob pattern
 * @param params - Parameters object
 * @param params.pattern - Glob pattern (e.g., "**\/*.ts")
 * @param params.exclude - Optional exclude pattern
 * @returns Array of absolute file paths
 */
export async function findFiles({
  pattern,
  exclude,
}: {
  pattern: string;
  exclude?: string;
}): Promise<string[]> {
  try {
    const uris = await vscode.workspace.findFiles(pattern, exclude || null);
    return uris.map((uri) => uri.fsPath);
  } catch (error) {
    throw new Error(
      `Failed to find files: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
