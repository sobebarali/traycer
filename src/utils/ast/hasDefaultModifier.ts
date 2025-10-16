/**
 * Checks if a node has a default modifier
 */

import * as ts from 'typescript';

/**
 * Checks if a node has a default modifier
 * @param node - TypeScript AST node
 * @returns True if node has default modifier
 */
export function hasDefaultModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);
  if (!modifiers) {
    return false;
  }

  return modifiers.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}
