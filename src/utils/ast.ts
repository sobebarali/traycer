/**
 * AST parser utility for analyzing TypeScript/JavaScript code
 */

import * as ts from 'typescript';
import type {
  CodeStructure,
  FunctionInfo,
  ClassInfo,
  ImportInfo,
  ExportInfo,
  InterfaceInfo,
  TypeAliasInfo,
} from '../types';

/**
 * Parses source code into a TypeScript AST
 * @param content - Source code content
 * @param fileName - File name (for proper parsing of .tsx files)
 * @returns TypeScript SourceFile AST
 */
export function parseSourceFile(content: string, fileName: string): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}

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

/**
 * Finds all interface declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of interface information
 */
function findInterfaces(sourceFile: ts.SourceFile): InterfaceInfo[] {
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

/**
 * Finds all type alias declarations in the AST
 * @param sourceFile - TypeScript SourceFile AST
 * @returns Array of type alias information
 */
function findTypeAliases(sourceFile: ts.SourceFile): TypeAliasInfo[] {
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

/**
 * Checks if a node has an export modifier
 * @param node - TypeScript AST node
 * @returns True if node has export modifier
 */
function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);
  if (!modifiers) {
    return false;
  }

  return modifiers.some(
    (modifier: ts.Modifier) =>
      modifier.kind === ts.SyntaxKind.ExportKeyword ||
      modifier.kind === ts.SyntaxKind.DefaultKeyword
  );
}

/**
 * Checks if a node has an async modifier
 * @param node - TypeScript AST node
 * @returns True if node has async modifier
 */
function hasAsyncModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);
  if (!modifiers) {
    return false;
  }

  return modifiers.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
}

/**
 * Checks if a node has a default modifier
 * @param node - TypeScript AST node
 * @returns True if node has default modifier
 */
function hasDefaultModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);
  if (!modifiers) {
    return false;
  }

  return modifiers.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}
