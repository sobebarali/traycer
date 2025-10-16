/**
 * Checks if a path is within the workspace
 */

import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Checks if a path is within the workspace
 * @param filePath - Absolute path to check
 * @returns True if path is within workspace, false otherwise
 */
export function isWithinWorkspace(filePath: string): boolean {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return false;
  }

  // Get workspace root
  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  // Normalize paths for comparison
  const normalizedFilePath = path.resolve(filePath);
  const normalizedWorkspaceRoot = path.resolve(workspaceRoot);

  // Check if file path starts with workspace root
  return normalizedFilePath.startsWith(normalizedWorkspaceRoot);
}
