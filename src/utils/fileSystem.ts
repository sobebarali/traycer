/**
 * File system utilities for safe workspace operations
 */

import * as path from 'path';
import * as vscode from 'vscode';

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

/**
 * Writes content to a file in the workspace
 * @param filePath - Absolute path to the file
 * @param content - Content to write
 * @throws Error if file cannot be written or path is invalid
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
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

/**
 * Finds files matching a glob pattern
 * @param pattern - Glob pattern (e.g., "**\/*.ts")
 * @param exclude - Optional exclude pattern
 * @returns Array of absolute file paths
 */
export async function findFiles(pattern: string, exclude?: string): Promise<string[]> {
  try {
    const uris = await vscode.workspace.findFiles(pattern, exclude || null);
    return uris.map((uri) => uri.fsPath);
  } catch (error) {
    throw new Error(
      `Failed to find files: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

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
