/**
 * Writes content to a file in the workspace
 */

import * as vscode from 'vscode';
import { validateFilePath } from './validateFilePath';
import { isWithinWorkspace } from './isWithinWorkspace';

/**
 * Writes content to a file in the workspace
 * @param params - Parameters object
 * @param params.filePath - Absolute path to the file
 * @param params.content - Content to write
 * @throws Error if file cannot be written or path is invalid
 */
export async function writeFile({
  filePath,
  content,
}: {
  filePath: string;
  content: string;
}): Promise<void> {
  // Validate file path
  if (!validateFilePath(filePath)) {
    throw new Error('Invalid file path');
  }

  if (!isWithinWorkspace(filePath)) {
    throw new Error('File path must be within workspace');
  }

  try {
    const uri = vscode.Uri.file(filePath);
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
  } catch (error) {
    throw new Error(
      `Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
