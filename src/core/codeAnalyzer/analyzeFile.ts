/**
 * Analyzes a single file
 */

import * as path from 'path';
import type { FileInfo } from '../../types';
import { readFile } from '../../utils/fileSystem';
import { parseSourceFile, analyzeStructure } from '../../utils/ast';
import { getFileType } from './getFileType';

/**
 * Analyzes a single file
 * @param params - Parameters object
 * @param params.filePath - Absolute path to the file
 * @returns File information
 */
export async function analyzeFile({ filePath }: { filePath: string }): Promise<FileInfo> {
  const fileName = path.basename(filePath);
  const fileType = getFileType(fileName);

  let imports: string[] = [];
  let exports: string[] = [];
  let size = 0;

  try {
    // Get file size
    const content = await readFile(filePath);
    size = content.length;

    // Parse TypeScript/JavaScript files
    if (fileType === 'typescript' || fileType === 'javascript') {
      const sourceFile = parseSourceFile({ content, fileName });
      const structure = analyzeStructure(sourceFile);

      // Extract imports
      imports = structure.imports.map((imp) => imp.from);

      // Extract exports
      exports = structure.exports.map((exp) => exp.name);
    }
  } catch (error) {
    // If file can't be read or parsed, return basic info
    console.error(`Failed to analyze file ${filePath}:`, error);
  }

  return {
    path: filePath,
    type: fileType,
    size,
    imports,
    exports,
  };
}
