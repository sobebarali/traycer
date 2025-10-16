/**
 * Tests for CodeAnalyzer - analyzeWorkspace function
 */

import * as path from 'path';
import { analyzeWorkspace } from '../../src/core/codeAnalyzer/analyzeWorkspace';
import type { WorkspaceAnalysis } from '../../src/types';

describe('analyzeWorkspace', () => {
  const fixturesPath = path.join(__dirname, '../fixtures/sample-project');

  it('should analyze workspace structure', async () => {
    const analysis: WorkspaceAnalysis = await analyzeWorkspace(fixturesPath);

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
    const analysis = await analyzeWorkspace(fixturesPath);

    const tsFiles = analysis.files.filter((f) => f.type === 'typescript');
    expect(tsFiles.length).toBeGreaterThan(0);

    // Check that we found our fixture files
    const hasIndexFile = tsFiles.some((f) => f.path.includes('index.ts'));
    const hasAuthFiles = tsFiles.some((f) => f.path.includes('auth'));
    expect(hasIndexFile).toBe(true);
    expect(hasAuthFiles).toBe(true);
  });

  it('should extract imports from files', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    // Find the index.ts file
    const indexFile = analysis.files.find((f) => f.path.endsWith('index.ts'));
    expect(indexFile).toBeDefined();
    expect(indexFile!.imports.length).toBeGreaterThan(0);

    // Should import express and local modules
    expect(indexFile!.imports).toContain('express');
  });

  it('should extract exports from files', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    // Find files with exports
    const filesWithExports = analysis.files.filter((f) => f.exports.length > 0);
    expect(filesWithExports.length).toBeGreaterThan(0);
  });

  it('should build dependency graph', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    expect(analysis.dependencies).toBeDefined();
    expect(typeof analysis.dependencies).toBe('object');

    // Check that some files have dependencies
    const deps = Object.keys(analysis.dependencies);
    expect(deps.length).toBeGreaterThan(0);
  });

  it('should identify code patterns', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    expect(analysis.patterns.length).toBeGreaterThan(0);

    // Should find functions
    const functions = analysis.patterns.filter((p) => p.type === 'function');
    expect(functions.length).toBeGreaterThan(0);

    // Should find classes
    const classes = analysis.patterns.filter((p) => p.type === 'class');
    expect(classes.length).toBeGreaterThan(0);
  });

  it('should handle empty workspace', async () => {
    const emptyPath = path.join(__dirname, '../fixtures/empty');

    // Should not throw, but return empty results
    const analysis = await analyzeWorkspace(emptyPath);
    expect(analysis.files).toEqual([]);
    expect(analysis.patterns).toEqual([]);
  });

  it('should throw error when no workspace root provided', async () => {
    await expect(analyzeWorkspace('')).rejects.toThrow('No workspace folder open');
  });

  it('should skip node_modules directory', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    const nodeModulesFiles = analysis.files.filter((f) => f.path.includes('node_modules'));
    expect(nodeModulesFiles.length).toBe(0);
  });

  it('should skip .git directory', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    const gitFiles = analysis.files.filter((f) => f.path.includes('.git'));
    expect(gitFiles.length).toBe(0);
  });

  it('should skip dist/build directories', async () => {
    const analysis = await analyzeWorkspace(fixturesPath);

    const buildFiles = analysis.files.filter(
      (f) => f.path.includes('/dist/') || f.path.includes('/build/')
    );
    expect(buildFiles.length).toBe(0);
  });

  it('should cache results for same path', async () => {
    const start1 = Date.now();
    const analysis1 = await analyzeWorkspace(fixturesPath);
    const duration1 = Date.now() - start1;

    const start2 = Date.now();
    const analysis2 = await analyzeWorkspace(fixturesPath);
    const duration2 = Date.now() - start2;

    // Second call should be faster (cached)
    expect(duration2).toBeLessThanOrEqual(duration1);

    // Results should be the same
    expect(analysis1.files.length).toBe(analysis2.files.length);
  });
});
