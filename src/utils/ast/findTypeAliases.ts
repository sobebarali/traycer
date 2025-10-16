/**
 * Finds all type alias declarations in the AST
 */

import * as ts from 'typescript';
import type { TypeAliasInfo } from '../../types';
import { hasExportModifier } from './hasExportModifier';

/**
 * Finds all type alias declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of type alias information
 */
export function findTypeAliases(sourceFile: ts.SourceFile): TypeAliasInfo[] {
  const types: TypeAliasInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isTypeAliasDeclaration(node)) {
      types.push({
        name: node.name.text,
        isExported: hasExportModifier(node),
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return types;
}
