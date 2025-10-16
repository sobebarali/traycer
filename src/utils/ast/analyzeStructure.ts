/**
 * Analyzes the complete structure of a source file
 */

import * as ts from 'typescript';
import type { CodeStructure } from '../../types';
import { findFunctions } from './findFunctions';
import { findClasses } from './findClasses';
import { findImports } from './findImports';
import { findExports } from './findExports';
import { findInterfaces } from './findInterfaces';
import { findTypeAliases } from './findTypeAliases';

/**
 * Analyzes the complete structure of a source file
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Complete code structure
 */
export function analyzeStructure(sourceFile: ts.SourceFile): CodeStructure {
  return {
    functions: findFunctions(sourceFile),
    classes: findClasses(sourceFile),
    imports: findImports(sourceFile),
    exports: findExports(sourceFile),
    interfaces: findInterfaces(sourceFile),
    types: findTypeAliases(sourceFile),
  };
}
