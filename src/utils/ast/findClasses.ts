/**
 * Finds all class declarations in the AST
 */

import * as ts from 'typescript';
import type { ClassInfo } from '../../types';
import { hasExportModifier } from './hasExportModifier';

/**
 * Finds all class declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of class information
 */
export function findClasses(sourceFile: ts.SourceFile): ClassInfo[] {
  const classes: ClassInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isClassDeclaration(node) && node.name) {
      const methods: string[] = [];
      const properties: string[] = [];

      node.members.forEach((member) => {
        if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name)) {
          methods.push(member.name.text);
        } else if (ts.isPropertyDeclaration(member) && ts.isIdentifier(member.name)) {
          properties.push(member.name.text);
        }
      });

      classes.push({
        name: node.name.text,
        methods,
        properties,
        isExported: hasExportModifier(node),
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return classes;
}
