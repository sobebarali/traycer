/**
 * Core type definitions for Traycer VS Code Extension
 */

/**
 * Development plan structure
 */
export interface Plan {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  files: FileChange[];
  createdAt: Date;
  status: PlanStatus;
}

/**
 * Status of a development plan
 */
export type PlanStatus = 'draft' | 'in-progress' | 'completed';

/**
 * Individual step in a development plan
 */
export interface Step {
  id: string;
  description: string;
  reasoning: string;
  dependencies: string[];
  completed: boolean;
}

/**
 * File change in a development plan
 */
export interface FileChange {
  path: string;
  type: FileChangeType;
  description: string;
  reasoning: string;
}

/**
 * Type of file change
 */
export type FileChangeType = 'create' | 'modify' | 'delete';

/**
 * Task description parsed from user input
 */
export interface TaskDescription {
  title: string;
  description: string;
  intent: TaskIntent;
  scope: string[];
}

/**
 * Intent of a development task
 */
export type TaskIntent = 'feature' | 'bugfix' | 'refactor' | 'documentation' | 'test';

/**
 * Workspace analysis results
 */
export interface WorkspaceAnalysis {
  rootPath: string;
  files: FileInfo[];
  dependencies: Record<string, string[]>;
  patterns: CodePattern[];
}

/**
 * Information about a file in the workspace
 */
export interface FileInfo {
  path: string;
  type: FileType;
  size: number;
  exports: string[];
  imports: string[];
}

/**
 * Type of file
 */
export type FileType = 'typescript' | 'javascript' | 'json' | 'other';

/**
 * Code pattern identified in the workspace
 */
export interface CodePattern {
  type: PatternType;
  name: string;
  location: string;
}

/**
 * Type of code pattern
 */
export type PatternType = 'component' | 'function' | 'class' | 'module';
