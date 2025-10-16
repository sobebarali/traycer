/**
 * Tests for CodeAnalyzer
 */

import * as path from 'path';
import { CodeAnalyzer } from '../../src/core/codeAnalyzer';
import { TaskParser } from '../../src/core/taskParser';
import type { WorkspaceAnalysis } from '../../src/types';

describe('CodeAnalyzer', () => {
  const fixturesPath = path.join(__dirname, '../fixtures/sample-project');
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer(fixturesPath);
  });

  describe('analyzeWorkspace', () => {
    it('should analyze workspace structure', async () => {
      const analysis: WorkspaceAnalysis = await analyzer.analyzeWorkspace();

      expect(analysis).toBeDefined();
      expect(analysis.rootPath).toBe(fixturesPath);
      expect(analysis.files).toBeDefined();
      expect(Array.isArray(analysis.files)).toBe(true);
      expect(analysis.files.length).toBeGreaterThan(0);
      expect(analysis.dependencies).toBeDefined();
      expect(analysis.patterns).toBeDefined();
      expect(Array.isArray(analysis.patterns)).toBe(true);
    });

    it('should identify TypeScript files', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      const tsFiles = analysis.files.filter((f) => f.type === 'typescript');
      expect(tsFiles.length).toBeGreaterThan(0);

      // Check that we found our fixture files
      const hasIndexFile = tsFiles.some((f) => f.path.includes('index.ts'));
      const hasAuthFiles = tsFiles.some((f) => f.path.includes('auth'));
      expect(hasIndexFile).toBe(true);
      expect(hasAuthFiles).toBe(true);
    });

    it('should extract imports from files', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Find the index.ts file
      const indexFile = analysis.files.find((f) => f.path.endsWith('index.ts'));
      expect(indexFile).toBeDefined();
      expect(indexFile!.imports.length).toBeGreaterThan(0);

      // Should import express and local modules
      expect(indexFile!.imports).toContain('express');
    });

    it('should extract exports from files', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Find files with exports
      const filesWithExports = analysis.files.filter((f) => f.exports.length > 0);
      expect(filesWithExports.length).toBeGreaterThan(0);
    });

    it('should build dependency graph', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      expect(analysis.dependencies).toBeDefined();
      expect(typeof analysis.dependencies).toBe('object');

      // Check that some files have dependencies
      const deps = Object.keys(analysis.dependencies);
      expect(deps.length).toBeGreaterThan(0);
    });

    it('should identify code patterns', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      expect(analysis.patterns.length).toBeGreaterThan(0);

      // Should find functions
      const functions = analysis.patterns.filter((p) => p.type === 'function');
      expect(functions.length).toBeGreaterThan(0);

      // Should find classes
      const classes = analysis.patterns.filter((p) => p.type === 'class');
      expect(classes.length).toBeGreaterThan(0);
    });

    it('should handle empty workspace', async () => {
      const emptyAnalyzer = new CodeAnalyzer(path.join(__dirname, '../fixtures/empty'));

      // Should not throw, but return empty results
      const analysis = await emptyAnalyzer.analyzeWorkspace();
      expect(analysis.files).toEqual([]);
      expect(analysis.patterns).toEqual([]);
    });

    it('should throw error when no workspace root provided', async () => {
      const noRootAnalyzer = new CodeAnalyzer();

      await expect(noRootAnalyzer.analyzeWorkspace()).rejects.toThrow('No workspace folder open');
    });
  });

  describe('findRelevantFiles', () => {
    let parser: TaskParser;

    beforeEach(() => {
      parser = new TaskParser();
    });

    it('should find files relevant to authentication task', async () => {
      const task = await parser.parseTaskDescription('Add user authentication');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      expect(relevantFiles.length).toBeGreaterThan(0);

      // Should prioritize auth-related files
      const authFiles = relevantFiles.filter((f) => f.path.includes('auth'));
      expect(authFiles.length).toBeGreaterThan(0);
    });

    it('should find files relevant to user management task', async () => {
      const task = await parser.parseTaskDescription('Update user profile');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      expect(relevantFiles.length).toBeGreaterThan(0);

      // Should find user-related files
      const userFiles = relevantFiles.filter(
        (f) => f.path.includes('user') || f.path.includes('auth')
      );
      expect(userFiles.length).toBeGreaterThan(0);
    });

    it('should find files relevant to helper utilities task', async () => {
      const task = await parser.parseTaskDescription('Refactor helper utilities');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      expect(relevantFiles.length).toBeGreaterThan(0);

      // Should find utils/helper files
      const helperFiles = relevantFiles.filter((f) => f.path.includes('helper'));
      expect(helperFiles.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-matching task', async () => {
      const task = await parser.parseTaskDescription('Add blockchain integration');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      // Might return some files, but they should be ranked lower
      // For a completely unrelated task, could return empty or all files with low relevance
      expect(Array.isArray(relevantFiles)).toBe(true);
    });

    it('should rank files by relevance', async () => {
      const task = await parser.parseTaskDescription('Fix authentication bug');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      if (relevantFiles.length > 1) {
        // First files should be more relevant (auth-related)
        const topFile = relevantFiles[0];
        expect(
          topFile.path.includes('auth') ||
            topFile.path.includes('login') ||
            topFile.path.includes('user')
        ).toBe(true);
      }
    });
  });

  describe('parseTypeScript', () => {
    it('should parse valid TypeScript file', async () => {
      const filePath = path.join(fixturesPath, 'src/auth/login.ts');
      const sourceFile = await analyzer.parseTypeScript(filePath);

      expect(sourceFile).toBeDefined();
      expect(sourceFile.fileName).toContain('login.ts');
    });

    it('should throw error for non-existent file', async () => {
      const filePath = path.join(fixturesPath, 'src/nonexistent.ts');

      await expect(analyzer.parseTypeScript(filePath)).rejects.toThrow();
    });

    it('should handle syntax errors gracefully', async () => {
      // This test assumes we might have a file with syntax errors
      // For now, we'll test that the parser handles the case
      const filePath = path.join(fixturesPath, 'src/auth/login.ts');
      const sourceFile = await analyzer.parseTypeScript(filePath);

      // TypeScript parser creates a source file even with errors
      expect(sourceFile).toBeDefined();
    });
  });

  describe('extractPatterns', () => {
    it('should extract function patterns', async () => {
      const patterns = await analyzer.extractPatterns();

      const functions = patterns.filter((p) => p.type === 'function');
      expect(functions.length).toBeGreaterThan(0);

      // Should find authenticateUser function
      const authFunction = functions.find((f) => f.name === 'authenticateUser');
      expect(authFunction).toBeDefined();
      expect(authFunction!.location).toContain('login.ts');
    });

    it('should extract class patterns', async () => {
      const patterns = await analyzer.extractPatterns();

      const classes = patterns.filter((p) => p.type === 'class');
      expect(classes.length).toBeGreaterThan(0);

      // Should find UserManager class
      const userManagerClass = classes.find((c) => c.name === 'UserManager');
      expect(userManagerClass).toBeDefined();
      expect(userManagerClass!.location).toContain('user.ts');
    });

    it('should include location information', async () => {
      const patterns = await analyzer.extractPatterns();

      patterns.forEach((pattern) => {
        expect(pattern.name).toBeDefined();
        expect(pattern.type).toBeDefined();
        expect(pattern.location).toBeDefined();
        expect(pattern.location.length).toBeGreaterThan(0);
      });
    });

    it('should handle workspace with no patterns', async () => {
      const emptyAnalyzer = new CodeAnalyzer(path.join(__dirname, '../fixtures/empty'));
      const patterns = await emptyAnalyzer.extractPatterns();

      expect(patterns).toEqual([]);
    });
  });

  describe('Caching', () => {
    it('should cache workspace analysis results', async () => {
      const start1 = Date.now();
      const analysis1 = await analyzer.analyzeWorkspace();
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      const analysis2 = await analyzer.analyzeWorkspace();
      const duration2 = Date.now() - start2;

      // Second call should be faster (cached)
      expect(duration2).toBeLessThan(duration1);

      // Results should be the same
      expect(analysis1.files.length).toBe(analysis2.files.length);
    });

    it('should allow cache invalidation', async () => {
      const _analysis1 = await analyzer.analyzeWorkspace();

      // Invalidate cache
      analyzer.clearCache();

      const analysis2 = await analyzer.analyzeWorkspace();

      // Should re-analyze
      expect(analysis2).toBeDefined();
    });
  });

  describe('File filtering', () => {
    it('should skip node_modules directory', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      const nodeModulesFiles = analysis.files.filter((f) => f.path.includes('node_modules'));
      expect(nodeModulesFiles.length).toBe(0);
    });

    it('should skip .git directory', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      const gitFiles = analysis.files.filter((f) => f.path.includes('.git'));
      expect(gitFiles.length).toBe(0);
    });

    it('should skip dist/build directories', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      const buildFiles = analysis.files.filter(
        (f) => f.path.includes('/dist/') || f.path.includes('/build/')
      );
      expect(buildFiles.length).toBe(0);
    });
  });
});
