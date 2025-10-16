/**
 * Checks if a node has an async modifier
 */

import * as ts from 'typescript';

/**
 * Checks if a node has an async modifier
 * @param node - TypeScript AST node
 * @returns True if node has async modifier
 */
export function hasAsyncModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);
  if (!modifiers) {
    return false;
  }

  return modifiers.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
}
