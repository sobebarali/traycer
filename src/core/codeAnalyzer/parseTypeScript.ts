/**
 * Parses a TypeScript file into an AST
 */

import * as path from 'path';
import * as ts from 'typescript';
import { readFile } from '../../utils/fileSystem';
import { parseSourceFile } from '../../utils/ast';

/**
 * Parses a TypeScript file into an AST
 * @param filePath - Absolute path to the file
 * @returns TypeScript SourceFile AST
 * @throws Error if file cannot be read or parsed
 */
export async function parseTypeScript(filePath: string): Promise<ts.SourceFile> {
  const content = await readFile(filePath);
  const fileName = path.basename(filePath);
  return parseSourceFile({ content, fileName });
}
