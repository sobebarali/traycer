/**
 * Gets the workspace root path
 */

import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Gets the workspace root path
 * @param workspaceRoot - Optional workspace root path
 * @returns Workspace root path
 * @throws Error if no workspace is open
 */
export function getWorkspaceRoot(workspaceRoot?: string): string {
  if (workspaceRoot) {
    return path.resolve(workspaceRoot);
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('No workspace folder open');
  }

  return workspaceFolders[0].uri.fsPath;
}
