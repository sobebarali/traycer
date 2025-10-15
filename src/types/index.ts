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
export type FileType = 'typescript' | 'javascript' | 'json' | 'markdown' | 'other';

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

/**
 * Verification report for plan implementation
 */
export interface VerificationReport {
  /** Whether the plan implementation passed verification */
  passed: boolean;

  /** Files that were created as expected */
  filesCreated: string[];

  /** Files that were modified as expected */
  filesModified: string[];

  /** Files that were deleted as expected */
  filesDeleted: string[];

  /** Files that should have been changed but weren't */
  missingFiles: string[];

  /** Files that were changed but weren't in the plan */
  unexpectedChanges: string[];

  /** Summary of verification results */
  summary: string;
}

/**
 * Difference between expected and actual file changes
 */
export interface Diff {
  /** File path */
  file: string;

  /** Expected change type */
  expected: FileChangeType;

  /** Actual change type (null if file wasn't changed) */
  actual: FileChangeType | null;

  /** Whether expected and actual match */
  matches: boolean;
}

/**
 * Result type for operations that can succeed or fail
 * @template T - Type of the success value
 * @template E - Type of the error value (defaults to Error)
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Make all properties of T optional
 * @template T - Type to make optional
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties of T readonly recursively
 * @template T - Type to make deeply readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Type guard to check if a value is a Plan
 * @param value - The value to check
 * @returns True if value is a Plan, false otherwise
 */
export function isPlan(value: unknown): value is Plan {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    'id' in value &&
    typeof obj.id === 'string' &&
    'title' in value &&
    typeof obj.title === 'string' &&
    'description' in value &&
    typeof obj.description === 'string' &&
    'steps' in value &&
    Array.isArray(obj.steps) &&
    'files' in value &&
    Array.isArray(obj.files) &&
    'createdAt' in value &&
    'status' in value &&
    typeof obj.status === 'string'
  );
}

/**
 * Type guard to check if a value is a Step
 * @param value - The value to check
 * @returns True if value is a Step, false otherwise
 */
export function isStep(value: unknown): value is Step {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    'id' in value &&
    typeof obj.id === 'string' &&
    'description' in value &&
    typeof obj.description === 'string' &&
    'reasoning' in value &&
    typeof obj.reasoning === 'string' &&
    'dependencies' in value &&
    Array.isArray(obj.dependencies) &&
    'completed' in value &&
    typeof obj.completed === 'boolean'
  );
}

/**
 * Type guard to check if a value is a FileChange
 * @param value - The value to check
 * @returns True if value is a FileChange, false otherwise
 */
export function isFileChange(value: unknown): value is FileChange {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validTypes: FileChangeType[] = ['create', 'modify', 'delete'];

  return (
    'path' in value &&
    typeof obj.path === 'string' &&
    'type' in value &&
    typeof obj.type === 'string' &&
    validTypes.includes(obj.type as FileChangeType) &&
    'description' in value &&
    typeof obj.description === 'string' &&
    'reasoning' in value &&
    typeof obj.reasoning === 'string'
  );
}

/**
 * Type guard to check if a value is a TaskDescription
 * @param value - The value to check
 * @returns True if value is a TaskDescription, false otherwise
 */
export function isTaskDescription(value: unknown): value is TaskDescription {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validIntents: TaskIntent[] = ['feature', 'bugfix', 'refactor', 'documentation', 'test'];

  return (
    'title' in value &&
    typeof obj.title === 'string' &&
    'description' in value &&
    typeof obj.description === 'string' &&
    'intent' in value &&
    typeof obj.intent === 'string' &&
    validIntents.includes(obj.intent as TaskIntent) &&
    'scope' in value &&
    Array.isArray(obj.scope)
  );
}

/**
 * Type guard to check if a value is a WorkspaceAnalysis
 * @param value - The value to check
 * @returns True if value is a WorkspaceAnalysis, false otherwise
 */
export function isWorkspaceAnalysis(value: unknown): value is WorkspaceAnalysis {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    'rootPath' in value &&
    typeof obj.rootPath === 'string' &&
    'files' in value &&
    Array.isArray(obj.files) &&
    'dependencies' in value &&
    typeof obj.dependencies === 'object' &&
    obj.dependencies !== null &&
    !Array.isArray(obj.dependencies) &&
    'patterns' in value &&
    Array.isArray(obj.patterns)
  );
}

/**
 * Type guard to check if a value is a FileInfo
 * @param value - The value to check
 * @returns True if value is a FileInfo, false otherwise
 */
export function isFileInfo(value: unknown): value is FileInfo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validTypes: FileType[] = ['typescript', 'javascript', 'json', 'markdown', 'other'];

  return (
    'path' in value &&
    typeof obj.path === 'string' &&
    'type' in value &&
    typeof obj.type === 'string' &&
    validTypes.includes(obj.type as FileType) &&
    'size' in value &&
    typeof obj.size === 'number' &&
    'exports' in value &&
    Array.isArray(obj.exports) &&
    'imports' in value &&
    Array.isArray(obj.imports)
  );
}

/**
 * Type guard to check if a value is a CodePattern
 * @param value - The value to check
 * @returns True if value is a CodePattern, false otherwise
 */
export function isCodePattern(value: unknown): value is CodePattern {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validTypes: PatternType[] = ['component', 'function', 'class', 'module'];

  return (
    'type' in value &&
    typeof obj.type === 'string' &&
    validTypes.includes(obj.type as PatternType) &&
    'name' in value &&
    typeof obj.name === 'string' &&
    'location' in value &&
    typeof obj.location === 'string'
  );
}

/**
 * Type guard to check if a value is a VerificationReport
 * @param value - The value to check
 * @returns True if value is a VerificationReport, false otherwise
 */
export function isVerificationReport(value: unknown): value is VerificationReport {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    'passed' in value &&
    typeof obj.passed === 'boolean' &&
    'filesCreated' in value &&
    Array.isArray(obj.filesCreated) &&
    'filesModified' in value &&
    Array.isArray(obj.filesModified) &&
    'filesDeleted' in value &&
    Array.isArray(obj.filesDeleted) &&
    'missingFiles' in value &&
    Array.isArray(obj.missingFiles) &&
    'unexpectedChanges' in value &&
    Array.isArray(obj.unexpectedChanges) &&
    'summary' in value &&
    typeof obj.summary === 'string'
  );
}

/**
 * Structure of code analyzed by AST parser
 */
export interface CodeStructure {
  /** List of function declarations */
  functions: FunctionInfo[];

  /** List of class declarations */
  classes: ClassInfo[];

  /** List of import statements */
  imports: ImportInfo[];

  /** List of export statements */
  exports: ExportInfo[];

  /** List of interface declarations */
  interfaces: InterfaceInfo[];

  /** List of type alias declarations */
  types: TypeAliasInfo[];
}

/**
 * Information about a function declaration
 */
export interface FunctionInfo {
  /** Function name */
  name: string;

  /** Parameters */
  parameters: string[];

  /** Return type if specified */
  returnType?: string;

  /** Whether function is exported */
  isExported: boolean;

  /** Whether function is async */
  isAsync: boolean;

  /** Line number where function starts */
  line: number;
}

/**
 * Information about a class declaration
 */
export interface ClassInfo {
  /** Class name */
  name: string;

  /** Methods in the class */
  methods: string[];

  /** Properties in the class */
  properties: string[];

  /** Whether class is exported */
  isExported: boolean;

  /** Line number where class starts */
  line: number;
}

/**
 * Information about an import statement
 */
export interface ImportInfo {
  /** Module being imported from */
  from: string;

  /** Named imports */
  named: string[];

  /** Default import if any */
  default?: string;

  /** Namespace import if any */
  namespace?: string;

  /** Line number where import is */
  line: number;
}

/**
 * Information about an export statement
 */
export interface ExportInfo {
  /** Name of exported item */
  name: string;

  /** Type of export */
  type: 'named' | 'default' | 'all';

  /** Line number where export is */
  line: number;
}

/**
 * Information about an interface declaration
 */
export interface InterfaceInfo {
  /** Interface name */
  name: string;

  /** Properties in the interface */
  properties: string[];

  /** Whether interface is exported */
  isExported: boolean;

  /** Line number where interface starts */
  line: number;
}

/**
 * Information about a type alias declaration
 */
export interface TypeAliasInfo {
  /** Type alias name */
  name: string;

  /** Whether type is exported */
  isExported: boolean;

  /** Line number where type starts */
  line: number;
}

/**
 * Type guard to check if a value is a Diff
 * @param value - The value to check
 * @returns True if value is a Diff, false otherwise
 */
export function isDiff(value: unknown): value is Diff {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validTypes: FileChangeType[] = ['create', 'modify', 'delete'];

  return (
    'file' in value &&
    typeof obj.file === 'string' &&
    'expected' in value &&
    typeof obj.expected === 'string' &&
    validTypes.includes(obj.expected as FileChangeType) &&
    'actual' in value &&
    (obj.actual === null ||
      (typeof obj.actual === 'string' && validTypes.includes(obj.actual as FileChangeType))) &&
    'matches' in value &&
    typeof obj.matches === 'boolean'
  );
}
