/**
 * Tests for AST parser utility
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import {
  parseSourceFile,
  findFunctions,
  findClasses,
  findImports,
  findExports,
  analyzeStructure,
} from '../../src/utils/ast';

const fixturesPath = path.join(__dirname, '../fixtures/sample-code');

describe('AST parser utility', () => {
  describe('parseSourceFile', () => {
    it('should parse valid TypeScript code', () => {
      const code = `
        function test() {
          return 'hello';
        }
      `;

      const sourceFile = parseSourceFile(code, 'test.ts');

      expect(sourceFile).toBeDefined();
      expect(sourceFile.kind).toBe(ts.SyntaxKind.SourceFile);
    });

    it('should parse TypeScript with JSX', () => {
      const code = `
        const Component = () => <div>Hello</div>;
      `;

      const sourceFile = parseSourceFile(code, 'test.tsx');

      expect(sourceFile).toBeDefined();
      expect(sourceFile.kind).toBe(ts.SyntaxKind.SourceFile);
    });

    it('should handle syntax errors gracefully', () => {
      const code = `
        function test( {
          // Missing closing brace
      `;

      const sourceFile = parseSourceFile(code, 'test.ts');

      // TypeScript parser is lenient and will still return a source file
      expect(sourceFile).toBeDefined();
    });
  });

  describe('findFunctions', () => {
    it('should find function declarations in simple.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const functions = findFunctions(sourceFile);

      expect(functions.length).toBeGreaterThanOrEqual(2);

      const greetFunc = functions.find((f) => f.name === 'greet');
      expect(greetFunc).toBeDefined();
      expect(greetFunc?.isExported).toBe(true);
      expect(greetFunc?.isAsync).toBe(false);
      expect(greetFunc?.parameters).toEqual(['name']);

      const fetchFunc = functions.find((f) => f.name === 'fetchData');
      expect(fetchFunc).toBeDefined();
      expect(fetchFunc?.isExported).toBe(true);
      expect(fetchFunc?.isAsync).toBe(true);
    });

    it('should identify private functions', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const functions = findFunctions(sourceFile);

      const privateFunc = functions.find((f) => f.name === 'privateFunction');
      expect(privateFunc).toBeDefined();
      expect(privateFunc?.isExported).toBe(false);
    });

    it('should handle arrow functions', () => {
      const code = `
        export const arrowFunc = (x: number): number => x * 2;
      `;
      const sourceFile = parseSourceFile(code, 'test.ts');

      const functions = findFunctions(sourceFile);

      expect(functions.length).toBeGreaterThanOrEqual(1);
      const arrowFunc = functions.find((f) => f.name === 'arrowFunc');
      expect(arrowFunc).toBeDefined();
    });
  });

  describe('findClasses', () => {
    it('should find class declarations in simple.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const classes = findClasses(sourceFile);

      expect(classes.length).toBeGreaterThanOrEqual(1);

      const calcClass = classes.find((c) => c.name === 'Calculator');
      expect(calcClass).toBeDefined();
      expect(calcClass?.isExported).toBe(true);
      expect(calcClass?.methods).toContain('add');
      expect(calcClass?.methods).toContain('subtract');
    });

    it('should find class with properties in complex.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'complex.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'complex.ts');

      const classes = findClasses(sourceFile);

      const userService = classes.find((c) => c.name === 'UserService');
      expect(userService).toBeDefined();
      expect(userService?.isExported).toBe(true);
      expect(userService?.properties).toContain('users');
      expect(userService?.methods).toContain('getUser');
      expect(userService?.methods).toContain('createUser');
    });
  });

  describe('findImports', () => {
    it('should find all import types in simple.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const imports = findImports(sourceFile);

      expect(imports.length).toBeGreaterThanOrEqual(2);

      const utilImport = imports.find((i) => i.from === './utils');
      expect(utilImport).toBeDefined();
      expect(utilImport?.named).toContain('someUtil');

      const pathImport = imports.find((i) => i.from === 'path');
      expect(pathImport).toBeDefined();
      expect(pathImport?.namespace).toBe('path');
    });

    it('should find type imports in complex.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'complex.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'complex.ts');

      const imports = findImports(sourceFile);

      const expressImport = imports.find((i) => i.from === 'express');
      expect(expressImport).toBeDefined();
      expect(expressImport?.named.length).toBeGreaterThan(0);
    });

    it('should find default imports', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'complex.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'complex.ts');

      const imports = findImports(sourceFile);

      const defaultImport = imports.find((i) => i.from === 'some-module');
      expect(defaultImport).toBeDefined();
      expect(defaultImport?.default).toBe('defaultExport');
    });
  });

  describe('findExports', () => {
    it('should find named exports', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const exports = findExports(sourceFile);

      expect(exports.length).toBeGreaterThan(0);

      const versionExport = exports.find((e) => e.name === 'VERSION');
      expect(versionExport).toBeDefined();
      expect(versionExport?.type).toBe('named');
    });

    it('should find default export', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const exports = findExports(sourceFile);

      const defaultExport = exports.find((e) => e.type === 'default');
      expect(defaultExport).toBeDefined();
    });

    it('should find re-exports', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'complex.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'complex.ts');

      const exports = findExports(sourceFile);

      expect(exports.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeStructure', () => {
    it('should analyze complete structure of simple.ts', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const structure = analyzeStructure(sourceFile);

      expect(structure.functions.length).toBeGreaterThan(0);
      expect(structure.classes.length).toBeGreaterThan(0);
      expect(structure.imports.length).toBeGreaterThan(0);
      expect(structure.exports.length).toBeGreaterThan(0);
      expect(structure.interfaces.length).toBeGreaterThan(0);
      expect(structure.types.length).toBeGreaterThan(0);
    });

    it('should analyze React component structure', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'react-component.tsx'), 'utf8');
      const sourceFile = parseSourceFile(code, 'react-component.tsx');

      const structure = analyzeStructure(sourceFile);

      expect(structure.functions.length).toBeGreaterThan(0);
      expect(structure.imports.length).toBeGreaterThan(0);

      const counterFunc = structure.functions.find((f) => f.name === 'Counter');
      expect(counterFunc).toBeDefined();

      const buttonInterface = structure.interfaces.find((i) => i.name === 'ButtonProps');
      expect(buttonInterface).toBeDefined();
    });

    it('should provide line numbers for all elements', () => {
      const code = fs.readFileSync(path.join(fixturesPath, 'simple.ts'), 'utf8');
      const sourceFile = parseSourceFile(code, 'simple.ts');

      const structure = analyzeStructure(sourceFile);

      structure.functions.forEach((func) => {
        expect(func.line).toBeGreaterThan(0);
      });

      structure.classes.forEach((cls) => {
        expect(cls.line).toBeGreaterThan(0);
      });

      structure.imports.forEach((imp) => {
        expect(imp.line).toBeGreaterThan(0);
      });

      structure.interfaces.forEach((iface) => {
        expect(iface.line).toBeGreaterThan(0);
      });
    });
  });
});
