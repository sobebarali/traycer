/**
 * Parses source code into a TypeScript AST
 */

import * as ts from 'typescript';

/**
 * Parses source code into a TypeScript AST
 * @param params - Parameters object
 * @param params.content - Source code content
 * @param params.fileName - File name (for proper parsing of .tsx files)
 * @returns TypeScript SourceFile AST
 */
export function parseSourceFile({
  content,
  fileName,
}: {
  content: string;
  fileName: string;
}): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}
