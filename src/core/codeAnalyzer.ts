/**
 * Code analyzer for understanding workspace structure and code patterns
 */

import * as path from 'path';
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { readFile, findFiles } from '../utils/fileSystem';
import { parseSourceFile, analyzeStructure } from '../utils/ast';
import type { WorkspaceAnalysis, FileInfo, FileType, CodePattern, TaskDescription } from '../types';

/**
 * CodeAnalyzer class for analyzing workspace structure and code
 */
export class CodeAnalyzer {
  private workspaceRoot?: string;
  private analysisCache?: WorkspaceAnalysis;

  /**
   * Creates a new CodeAnalyzer instance
   * @param workspaceRoot - Optional workspace root path (uses VS Code workspace if not provided)
   */
  constructor(workspaceRoot?: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Analyzes the workspace structure and code
   * @returns Complete workspace analysis
   * @throws Error if no workspace is open
   */
  async analyzeWorkspace(): Promise<WorkspaceAnalysis> {
    // Return cached result if available
    if (this.analysisCache) {
      return this.analysisCache;
    }

    // Get workspace root
    const rootPath = this.getWorkspaceRoot();

    // Find all files in the workspace
    const allFiles = await this.findWorkspaceFiles();

    // Analyze each file
    const files: FileInfo[] = [];
    const dependencies: Record<string, string[]> = {};

    for (const filePath of allFiles) {
      try {
        const fileInfo = await this.analyzeFile(filePath);
        files.push(fileInfo);

        // Build dependency graph
        if (fileInfo.imports.length > 0) {
          dependencies[filePath] = fileInfo.imports;
        }
      } catch (error) {
        // Skip files that can't be analyzed
        console.error(`Failed to analyze file ${filePath}:`, error);
      }
    }

    // Extract code patterns
    const patterns = await this.extractPatterns();

    const analysis: WorkspaceAnalysis = {
      rootPath,
      files,
      dependencies,
      patterns,
    };

    // Cache the result
    this.analysisCache = analysis;

    return analysis;
  }

  /**
   * Finds files relevant to a given task
   * @param task - Task description
   * @returns Array of relevant files, sorted by relevance
   */
  async findRelevantFiles(task: TaskDescription): Promise<FileInfo[]> {
    const analysis = await this.analyzeWorkspace();

    // If no scope keywords, return all files
    if (task.scope.length === 0) {
      return analysis.files;
    }

    // Score each file based on relevance
    const scoredFiles = analysis.files.map((file) => {
      const score = this.calculateRelevanceScore(file, task);
      return { file, score };
    });

    // Sort by score (descending) and filter out zero scores
    const relevantFiles = scoredFiles
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.file);

    // Return top results or all if nothing matched
    return relevantFiles.length > 0 ? relevantFiles : analysis.files;
  }

  /**
   * Parses a TypeScript file into an AST
   * @param filePath - Absolute path to the file
   * @returns TypeScript SourceFile AST
   * @throws Error if file cannot be read or parsed
   */
  async parseTypeScript(filePath: string): Promise<ts.SourceFile> {
    const content = await readFile(filePath);
    const fileName = path.basename(filePath);
    return parseSourceFile(content, fileName);
  }

  /**
   * Extracts code patterns from the workspace
   * @returns Array of code patterns found
   */
  async extractPatterns(): Promise<CodePattern[]> {
    const analysis = await this.analyzeWorkspace();
    const patterns: CodePattern[] = [];

    // Analyze TypeScript/JavaScript files for patterns
    const codeFiles = analysis.files.filter(
      (f) => f.type === 'typescript' || f.type === 'javascript'
    );

    for (const file of codeFiles) {
      try {
        const sourceFile = await this.parseTypeScript(file.path);
        const structure = analyzeStructure(sourceFile);

        // Extract function patterns
        structure.functions.forEach((func) => {
          patterns.push({
            type: 'function',
            name: func.name,
            location: this.getRelativePath(file.path),
          });
        });

        // Extract class patterns
        structure.classes.forEach((cls) => {
          patterns.push({
            type: 'class',
            name: cls.name,
            location: this.getRelativePath(file.path),
          });
        });
      } catch (error) {
        // Skip files that can't be parsed
        console.error(`Failed to extract patterns from ${file.path}:`, error);
      }
    }

    return patterns;
  }

  /**
   * Clears the analysis cache
   */
  clearCache(): void {
    this.analysisCache = undefined;
  }

  /**
   * Gets the workspace root path
   * @returns Workspace root path
   * @throws Error if no workspace is open
   */
  private getWorkspaceRoot(): string {
    if (this.workspaceRoot) {
      return path.resolve(this.workspaceRoot);
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace folder open');
    }

    return workspaceFolders[0].uri.fsPath;
  }

  /**
   * Finds all files in the workspace, excluding certain directories
   * @returns Array of absolute file paths
   */
  private async findWorkspaceFiles(): Promise<string[]> {
    try {
      // Find TypeScript and JavaScript files
      const pattern = '**/*.{ts,tsx,js,jsx,json,md}';

      // Exclude common directories
      const exclude = '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/out/**}';

      const files = await findFiles(pattern, exclude);

      return files;
    } catch (error) {
      // If findFiles fails, return empty array
      console.error('Failed to find workspace files:', error);
      return [];
    }
  }

  /**
   * Analyzes a single file
   * @param filePath - Absolute path to the file
   * @returns File information
   */
  private async analyzeFile(filePath: string): Promise<FileInfo> {
    const fileName = path.basename(filePath);
    const fileType = this.getFileType(fileName);

    let imports: string[] = [];
    let exports: string[] = [];
    let size = 0;

    try {
      // Get file size
      const content = await readFile(filePath);
      size = content.length;

      // Parse TypeScript/JavaScript files
      if (fileType === 'typescript' || fileType === 'javascript') {
        const sourceFile = parseSourceFile(content, fileName);
        const structure = analyzeStructure(sourceFile);

        // Extract imports
        imports = structure.imports.map((imp) => imp.from);

        // Extract exports
        exports = structure.exports.map((exp) => exp.name);
      }
    } catch (error) {
      // If file can't be read or parsed, return basic info
      console.error(`Failed to analyze file ${filePath}:`, error);
    }

    return {
      path: filePath,
      type: fileType,
      size,
      imports,
      exports,
    };
  }

  /**
   * Determines the file type based on file extension
   * @param fileName - File name
   * @returns File type
   */
  private getFileType(fileName: string): FileType {
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return 'typescript';
    }

    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return 'javascript';
    }

    if (fileName.endsWith('.json')) {
      return 'json';
    }

    if (fileName.endsWith('.md')) {
      return 'markdown';
    }

    return 'other';
  }

  /**
   * Calculates relevance score for a file based on task
   * @param file - File information
   * @param task - Task description
   * @returns Relevance score (higher is more relevant)
   */
  private calculateRelevanceScore(file: FileInfo, task: TaskDescription): number {
    let score = 0;

    const filePath = file.path.toLowerCase();
    const fileName = path.basename(filePath);

    // Check each scope keyword
    for (const keyword of task.scope) {
      const lowerKeyword = keyword.toLowerCase();

      // Exact match in file name (highest score)
      if (fileName.includes(lowerKeyword)) {
        score += 10;
      }

      // Match in file path
      if (filePath.includes(lowerKeyword)) {
        score += 5;
      }

      // Match in imports
      if (file.imports.some((imp) => imp.toLowerCase().includes(lowerKeyword))) {
        score += 3;
      }

      // Match in exports
      if (file.exports.some((exp) => exp.toLowerCase().includes(lowerKeyword))) {
        score += 3;
      }
    }

    return score;
  }

  /**
   * Gets relative path from workspace root
   * @param absolutePath - Absolute file path
   * @returns Relative path
   */
  private getRelativePath(absolutePath: string): string {
    const rootPath = this.getWorkspaceRoot();
    return path.relative(rootPath, absolutePath);
  }
}
