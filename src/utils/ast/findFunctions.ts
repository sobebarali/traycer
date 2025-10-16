/**
 * Finds all function declarations in the AST
 */

import * as ts from 'typescript';
import type { FunctionInfo } from '../../types';
import { hasExportModifier } from './hasExportModifier';
import { hasAsyncModifier } from './hasAsyncModifier';

/**
 * Finds all function declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of function information
 */
export function findFunctions(sourceFile: ts.SourceFile): FunctionInfo[] {
  const functions: FunctionInfo[] = [];

  function visit(node: ts.Node): void {
    // Function declarations
    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.push({
        name: node.name.text,
        parameters: node.parameters.map((p) => {
          if (ts.isIdentifier(p.name)) {
            return p.name.text;
          }
          return '<destructured>';
        }),
        returnType: node.type?.getText(sourceFile),
        isExported: hasExportModifier(node),
        isAsync: hasAsyncModifier(node),
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    // Arrow functions and function expressions assigned to variables
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((decl) => {
        if (
          ts.isIdentifier(decl.name) &&
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))
        ) {
          functions.push({
            name: decl.name.text,
            parameters: decl.initializer.parameters.map((p) => {
              if (ts.isIdentifier(p.name)) {
                return p.name.text;
              }
              return '<destructured>';
            }),
            returnType: decl.initializer.type?.getText(sourceFile),
            isExported: hasExportModifier(node),
            isAsync: hasAsyncModifier(decl.initializer),
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
          });
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions;
}
