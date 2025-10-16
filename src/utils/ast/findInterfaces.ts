/**
 * Finds all interface declarations in the AST
 */

import * as ts from 'typescript';
import type { InterfaceInfo } from '../../types';
import { hasExportModifier } from './hasExportModifier';

/**
 * Finds all interface declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of interface information
 */
export function findInterfaces(sourceFile: ts.SourceFile): InterfaceInfo[] {
  const interfaces: InterfaceInfo[] = [];

  function visit(node: ts.Node): void {
    if (ts.isInterfaceDeclaration(node)) {
      const properties: string[] = [];

      node.members.forEach((member) => {
        if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
          properties.push(member.name.text);
        }
      });

      interfaces.push({
        name: node.name.text,
        properties,
        isExported: hasExportModifier(node),
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return interfaces;
}
