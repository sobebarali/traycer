/**
 * Analyzes the workspace structure and code
 */

import type { WorkspaceAnalysis } from '../../types';
import { getWorkspaceRoot } from './getWorkspaceRoot';
import { findWorkspaceFiles } from './findWorkspaceFiles';
import { analyzeFile } from './analyzeFile';
import { extractPatterns } from './extractPatterns';

/**
 * Analyzes the workspace structure and code
 * @param workspaceRoot - Optional workspace root path (uses VS Code workspace if not provided)
 * @returns Complete workspace analysis
 * @throws Error if no workspace is open
 */
export async function analyzeWorkspace(workspaceRoot?: string): Promise<WorkspaceAnalysis> {
  // Get workspace root
  const rootPath = getWorkspaceRoot(workspaceRoot);

  // Find all files in the workspace
  const allFiles = await findWorkspaceFiles();

  // Analyze each file
  const files = [];
  const dependencies: Record<string, string[]> = {};

  for (const filePath of allFiles) {
    try {
      const fileInfo = await analyzeFile({ filePath });
      files.push(fileInfo);

      // Build dependency graph
      if (fileInfo.imports.length > 0) {
        dependencies[filePath] = fileInfo.imports;
      }
    } catch (error) {
      // Skip files that can't be analyzed
      console.error(`Failed to analyze file ${filePath}:`, error);
    }
  }

  // Extract code patterns
  const patterns = await extractPatterns({ files, workspaceRoot: rootPath });

  return {
    rootPath,
    files,
    dependencies,
    patterns,
  };
}
