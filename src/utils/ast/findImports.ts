/**
 * Finds all import declarations in the AST
 */

import * as ts from 'typescript';
import type { ImportInfo } from '../../types';

/**
 * Finds all import declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of import information
 */
export function findImports(sourceFile: ts.SourceFile): ImportInfo[] {
  const imports: ImportInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (!ts.isStringLiteral(moduleSpecifier)) {
        return;
      }

      const from = moduleSpecifier.text;
      const named: string[] = [];
      let defaultImport: string | undefined;
      let namespace: string | undefined;

      if (node.importClause) {
        // Default import
        if (node.importClause.name) {
          defaultImport = node.importClause.name.text;
        }

        // Named bindings
        if (node.importClause.namedBindings) {
          if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            // import * as name from 'module'
            namespace = node.importClause.namedBindings.name.text;
          } else if (ts.isNamedImports(node.importClause.namedBindings)) {
            // import { name1, name2 } from 'module'
            node.importClause.namedBindings.elements.forEach((element) => {
              named.push(element.name.text);
            });
          }
        }
      }

      imports.push({
        from,
        named,
        default: defaultImport,
        namespace,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}
