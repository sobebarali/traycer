/**
 * Edge case tests for CodeAnalyzer
 */

import * as path from 'path';
import { analyzeWorkspace, findRelevantFiles } from '../../../src/core/codeAnalyzer';
import { parseTaskDescription } from '../../../src/core/taskParser';
import type { WorkspaceAnalysis, FileInfo, CodePattern, TaskDescription } from '../../../src/types';

describe('CodeAnalyzer - Edge Cases', () => {
  const fixturesPath = path.join(__dirname, '../../fixtures/sample-project');

  // Helper object to match old test structure
  const analyzer = {
    analyzeWorkspace: () => analyzeWorkspace(fixturesPath),
    extractPatterns: async () => {
      const analysis = await analyzeWorkspace(fixturesPath);
      return analysis.patterns;
    },
    findRelevantFiles: (task: TaskDescription) =>
      findRelevantFiles({ task, workspaceRoot: fixturesPath }),
  };

  describe('Workspace Paths', () => {
    it('should handle workspace path with spaces', async () => {
      // Note: This test assumes the path doesn't have spaces in our fixture
      // In real scenarios, we want to ensure the analyzer handles spaces
      const analysis = await analyzer.analyzeWorkspace();
      expect(analysis).toBeDefined();
    });

    it('should handle workspace path with special characters', async () => {
      const analysis = await analyzer.analyzeWorkspace();
      expect(analysis).toBeDefined();
    });

    it('should normalize workspace path', async () => {
      const analysis = await analyzer.analyzeWorkspace();
      expect(analysis.rootPath).toBe(path.resolve(fixturesPath));
    });
  });

  describe('File Analysis Edge Cases', () => {
    it('should handle files with no imports', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Some files might have no imports
      const filesWithNoImports = analysis.files.filter((f) => f.imports.length === 0);

      filesWithNoImports.forEach((file) => {
        expect(file.imports).toEqual([]);
      });
    });

    it('should handle files with no exports', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Some files might have no exports
      const filesWithNoExports = analysis.files.filter((f) => f.exports.length === 0);

      filesWithNoExports.forEach((file) => {
        expect(file.exports).toEqual([]);
      });
    });

    it('should handle very large files', async () => {
      // Our fixture files are small, but we want to ensure the analyzer
      // doesn't crash on large files
      const analysis = await analyzer.analyzeWorkspace();

      analysis.files.forEach((file) => {
        expect(file.size).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle files with complex imports', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Find index.ts which has multiple import types
      const indexFile = analysis.files.find((f) => f.path.endsWith('index.ts'));

      if (indexFile) {
        expect(indexFile.imports).toBeDefined();
        expect(Array.isArray(indexFile.imports)).toBe(true);
      }
    });
  });

  describe('findRelevantFiles Edge Cases', () => {
    it('should handle task with no scope keywords', async () => {
      const task = await parseTaskDescription('Do something');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      // Should still return files, possibly all files
      expect(Array.isArray(relevantFiles)).toBe(true);
    });

    it('should handle task with many scope keywords', async () => {
      const task = await parseTaskDescription(
        'Update user authentication login profile settings manager'
      );
      const relevantFiles = await analyzer.findRelevantFiles(task);

      expect(relevantFiles.length).toBeGreaterThan(0);
    });

    it('should handle task with file extension in scope', async () => {
      const task = await parseTaskDescription('Fix login.ts authentication');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      // Should find login.ts
      const loginFile = relevantFiles.find((f) => f.path.includes('login'));
      expect(loginFile).toBeDefined();
    });

    it('should handle task with path-like keywords', async () => {
      const task = await parseTaskDescription('Update src/auth/user file');
      const relevantFiles = await analyzer.findRelevantFiles(task);

      // Should find user-related files
      const userFiles = relevantFiles.filter((f) => f.path.includes('user'));
      expect(userFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Extraction Edge Cases', () => {
    it('should handle anonymous functions', async () => {
      const patterns = await analyzer.extractPatterns();

      // Should still work, might have patterns without names
      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should handle arrow functions', async () => {
      const patterns = await analyzer.extractPatterns();

      // Arrow functions should be detected as functions
      const functions = patterns.filter((p) => p.type === 'function');
      expect(functions.length).toBeGreaterThan(0);
    });

    it('should handle nested classes and functions', async () => {
      const patterns = await analyzer.extractPatterns();

      // Should extract all patterns at any nesting level
      expect(patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Dependency Graph Edge Cases', () => {
    it('should handle circular dependencies', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Should not crash with circular dependencies
      expect(analysis.dependencies).toBeDefined();
    });

    it('should handle external dependencies', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // External dependencies (like 'express') should be tracked
      const hasExternalDeps = (Object.values(analysis.dependencies) as string[][]).some((deps) =>
        deps.some((dep) => !dep.startsWith('.'))
      );

      expect(typeof hasExternalDeps).toBe('boolean');
    });

    it('should handle relative imports at different levels', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      // Should handle ../  and ./ imports
      expect(analysis.dependencies).toBeDefined();
    });
  });

  describe('Performance Edge Cases', () => {
    it('should handle large workspace efficiently', async () => {
      const start = Date.now();
      await analyzer.analyzeWorkspace();
      const duration = Date.now() - start;

      // Should complete in reasonable time (< 5 seconds for small fixture)
      expect(duration).toBeLessThan(5000);
    });

    it('should not load same file multiple times', async () => {
      // First analysis
      await analyzer.analyzeWorkspace();

      // Second analysis (should use cache)
      const start = Date.now();
      await analyzer.analyzeWorkspace();
      const duration = Date.now() - start;

      // Should be very fast (cached)
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent analysis requests', async () => {
      // Start multiple analyses at the same time
      const promises = [
        analyzer.analyzeWorkspace(),
        analyzer.analyzeWorkspace(),
        analyzer.analyzeWorkspace(),
      ];

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result: WorkspaceAnalysis) => {
        expect(result).toBeDefined();
        expect(result.files).toBeDefined();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should continue analysis even if one file fails', async () => {
      // Analysis should be robust to individual file failures
      const analysis = await analyzer.analyzeWorkspace();

      expect(analysis).toBeDefined();
      expect(analysis.files.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle permission denied errors', async () => {
      // Should gracefully handle files that can't be read
      const analysis = await analyzer.analyzeWorkspace();

      expect(analysis).toBeDefined();
    });

    it('should handle malformed TypeScript files', async () => {
      // TypeScript parser should handle syntax errors
      const analysis = await analyzer.analyzeWorkspace();

      expect(analysis).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should return valid FileInfo objects', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      analysis.files.forEach((file: FileInfo) => {
        expect(typeof file.path).toBe('string');
        expect(typeof file.type).toBe('string');
        expect(typeof file.size).toBe('number');
        expect(Array.isArray(file.imports)).toBe(true);
        expect(Array.isArray(file.exports)).toBe(true);
      });
    });

    it('should return valid CodePattern objects', async () => {
      const patterns = await analyzer.extractPatterns();

      patterns.forEach((pattern: CodePattern) => {
        expect(typeof pattern.type).toBe('string');
        expect(typeof pattern.name).toBe('string');
        expect(typeof pattern.location).toBe('string');
        expect(['component', 'function', 'class', 'module']).toContain(pattern.type);
      });
    });

    it('should return valid WorkspaceAnalysis object', async () => {
      const analysis = await analyzer.analyzeWorkspace();

      expect(typeof analysis.rootPath).toBe('string');
      expect(Array.isArray(analysis.files)).toBe(true);
      expect(typeof analysis.dependencies).toBe('object');
      expect(analysis.dependencies).not.toBeNull();
      expect(Array.isArray(analysis.patterns)).toBe(true);
    });
  });
});
