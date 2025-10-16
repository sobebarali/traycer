/**
 * Lists all files and directories in a directory
 */

import * as path from 'path';
import * as vscode from 'vscode';
import { validateFilePath } from './validateFilePath';
import { isWithinWorkspace } from './isWithinWorkspace';

/**
 * Lists all files and directories in a directory
 * @param directory - Absolute path to directory
 * @returns Array of absolute file paths
 * @throws Error if directory cannot be read or path is invalid
 */
export async function listFiles(directory: string): Promise<string[]> {
  // Validate directory path
  if (!validateFilePath(directory)) {
    throw new Error('Invalid file path');
  }

  if (!isWithinWorkspace(directory)) {
    throw new Error('File path must be within workspace');
  }

  try {
    const uri = vscode.Uri.file(directory);
    const entries = await vscode.workspace.fs.readDirectory(uri);

    return entries.map(([name]) => path.join(directory, name));
  } catch (error) {
    throw new Error(
      `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
