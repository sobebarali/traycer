/**
 * Finds all export declarations in the AST
 */

import * as ts from 'typescript';
import type { ExportInfo } from '../../types';
import { hasExportModifier } from './hasExportModifier';
import { hasDefaultModifier } from './hasDefaultModifier';

/**
 * Finds all export declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of export information
 */
export function findExports(sourceFile: ts.SourceFile): ExportInfo[] {
  const exports: ExportInfo[] = [];

  function visit(node: ts.Node): void {
    // Export declarations with 'export' keyword
    if (hasExportModifier(node)) {
      const isDefault = hasDefaultModifier(node);

      if (ts.isFunctionDeclaration(node) && node.name) {
        exports.push({
          name: node.name.text,
          type: isDefault ? 'default' : 'named',
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      } else if (ts.isClassDeclaration(node)) {
        exports.push({
          name: node.name ? node.name.text : '<anonymous>',
          type: isDefault ? 'default' : 'named',
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      } else if (ts.isInterfaceDeclaration(node)) {
        exports.push({
          name: node.name.text,
          type: isDefault ? 'default' : 'named',
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      } else if (ts.isTypeAliasDeclaration(node)) {
        exports.push({
          name: node.name.text,
          type: isDefault ? 'default' : 'named',
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      } else if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((decl) => {
          if (ts.isIdentifier(decl.name)) {
            exports.push({
              name: decl.name.text,
              type: isDefault ? 'default' : 'named',
              line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            });
          }
        });
      }
    }

    // Default exports
    if (ts.isExportAssignment(node)) {
      const name =
        node.expression && ts.isIdentifier(node.expression) ? node.expression.text : '<anonymous>';

      exports.push({
        name,
        type: 'default',
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    // Export declarations (export { ... })
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          exports.push({
            name: element.name.text,
            type: 'named',
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
          });
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}
