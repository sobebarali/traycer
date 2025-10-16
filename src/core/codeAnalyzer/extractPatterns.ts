/**
 * Extracts code patterns from workspace files
 */

import type { FileInfo, CodePattern } from '../../types';
import { parseSourceFile, analyzeStructure } from '../../utils/ast';
import { readFile } from '../../utils/fileSystem';
import { getRelativePath } from './getRelativePath';

/**
 * Extracts code patterns from the workspace
 * @param params - Parameters object
 * @param params.files - Array of file information
 * @param params.workspaceRoot - Workspace root path
 * @returns Array of code patterns found
 */
export async function extractPatterns({
  files,
  workspaceRoot,
}: {
  files: FileInfo[];
  workspaceRoot: string;
}): Promise<CodePattern[]> {
  const patterns: CodePattern[] = [];

  // Analyze TypeScript/JavaScript files for patterns
  const codeFiles = files.filter((f) => f.type === 'typescript' || f.type === 'javascript');

  for (const file of codeFiles) {
    try {
      const content = await readFile(file.path);
      const sourceFile = parseSourceFile({ content, fileName: file.path });
      const structure = analyzeStructure(sourceFile);

      // Extract function patterns
      structure.functions.forEach((func) => {
        patterns.push({
          type: 'function',
          name: func.name,
          location: getRelativePath({ absolutePath: file.path, workspaceRoot }),
        });
      });

      // Extract class patterns
      structure.classes.forEach((cls) => {
        patterns.push({
          type: 'class',
          name: cls.name,
          location: getRelativePath({ absolutePath: file.path, workspaceRoot }),
        });
      });
    } catch (error) {
      // Skip files that can't be parsed
      console.error(`Failed to extract patterns from ${file.path}:`, error);
    }
  }

  return patterns;
}
