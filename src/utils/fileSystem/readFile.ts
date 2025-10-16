/**
 * Reads a file from the workspace
 */

import * as vscode from 'vscode';
import { validateFilePath } from './validateFilePath';
import { isWithinWorkspace } from './isWithinWorkspace';

/**
 * Reads a file from the workspace
 * @param filePath - Absolute path to the file
 * @returns File content as string
 * @throws Error if file cannot be read or path is invalid
 */
export async function readFile(filePath: string): Promise<string> {
  // Validate file path
  if (!validateFilePath(filePath)) {
    throw new Error('Invalid file path');
  }

  if (!isWithinWorkspace(filePath)) {
    throw new Error('File path must be within workspace');
  }

  try {
    const uri = vscode.Uri.file(filePath);
    const fileContent = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(fileContent).toString('utf8');
  } catch (error) {
    throw new Error(
      `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
