# 📂 Traycer VS Code Extension Folder Structure

This defines the folder structure for the Traycer VS Code extension project (TypeScript + VS Code API + React).

---

## Core Principles

* **VS Code Extension Architecture**: Extension host integration with activation events
* **Feature-Based Organization**: Group related functionality together
* **Type-First Development**: TypeScript throughout the codebase
* **Separation of Concerns**: Core logic, UI, and utilities separated
* **Testable Code**: Unit tests mirror source structure
* **Functional Programming**: Pure functions over classes, immutable data structures
* **One Function Per File**: Each file exports a single named function for clarity and testability

---

## Project Root Structure

```
traycer/
├── src/
│   ├── extension.ts           # Extension entry point and activation
│   ├── core/                  # Core business logic
│   │   ├── planGenerator.ts   # Generate development plans
│   │   ├── codeAnalyzer.ts    # Analyze workspace code
│   │   ├── taskParser.ts      # Parse task descriptions
│   │   └── planVerifier.ts    # Verify implementation
│   ├── ui/                    # UI and WebView components
│   │   ├── planView.ts        # WebView controller
│   │   └── webview/           # React components for webview
│   │       ├── App.tsx        # Main webview app
│   │       ├── PlanViewer.tsx # Plan display component
│   │       └── index.tsx      # Webview entry point
│   ├── utils/                 # Utility functions
│   │   ├── fileSystem.ts      # File operations
│   │   ├── ast.ts             # AST parsing utilities
│   │   └── logger.ts          # Logging utilities
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # Shared types and interfaces
├── test/                      # Test files (mirrors src/)
│   ├── core/
│   │   ├── planGenerator.test.ts
│   │   ├── codeAnalyzer.test.ts
│   │   └── taskParser.test.ts
│   └── utils/
│       ├── fileSystem.test.ts
│       └── ast.test.ts
├── media/                     # Static assets for extension
│   ├── icon.png              # Extension icon
│   └── styles.css            # Webview styles
├── .vscode/                   # VS Code workspace settings
│   ├── launch.json           # Debug configurations
│   ├── tasks.json            # Build tasks
│   └── extensions.json       # Recommended extensions
├── .ruler/                    # AI workflow rules
├── package.json               # Extension manifest and dependencies
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── README.md                  # Project documentation
```

---

## Core Module Structure (`src/core/`)

### Plan Generation System (Functional Architecture)

**MANDATORY: One Function Per File**

Each module is organized as a folder containing single-purpose functions:

```
src/core/
├── planGenerator/
│   ├── generatePlan.ts           # Main: Generate plan from task
│   ├── analyzeDependencies.ts    # Helper: Identify file dependencies
│   ├── formatPlan.ts             # Helper: Format plan for display
│   └── createPlanSteps.ts        # Helper: Generate plan steps
├── codeAnalyzer/
│   ├── analyzeWorkspace.ts       # Main: Parse project structure
│   ├── findRelevantFiles.ts      # Helper: Find files related to task
│   ├── parseTypeScript.ts        # Helper: Parse TS/JS files
│   └── extractPatterns.ts        # Helper: Identify code patterns
├── taskParser/
│   ├── parseTaskDescription.ts   # Main: Parse user input
│   ├── extractIntent.ts          # Helper: Understand user intent
│   └── identifyScope.ts          # Helper: Determine task scope
└── planVerifier/
    ├── verifyPlan.ts             # Main: Check if plan matches implementation
    ├── compareFiles.ts           # Helper: Compare expected vs actual changes
    └── generateReport.ts         # Helper: Create verification report
```

### Example Functional Structure

**❌ DON'T: Use classes**

```typescript
// ❌ WRONG - Don't use classes
export class PlanGenerator {
  constructor(private analyzer: CodeAnalyzer) {}
  async generatePlan(taskDescription: string): Promise<Plan> { ... }
}
```

**✅ DO: Use pure functions with one function per file**

```typescript
// src/core/planGenerator/generatePlan.ts
import type { Plan, TaskDescription, WorkspaceAnalysis } from '../../types';
import { parseTaskDescription } from '../taskParser/parseTaskDescription';
import { analyzeWorkspace } from '../codeAnalyzer/analyzeWorkspace';
import { createPlanSteps } from './createPlanSteps';
import { formatPlan } from './formatPlan';

/**
 * Generates a development plan from a task description.
 *
 * This is a pure function that composes smaller functions to create a plan.
 * All dependencies are explicitly passed as parameters.
 *
 * @param taskDescription - Natural language description of the task
 * @param workspacePath - Path to the workspace to analyze
 * @returns A structured development plan with steps and file changes
 */
export async function generatePlan(
  taskDescription: string,
  workspacePath: string
): Promise<Plan> {
  // Parse task (pure function)
  const task: TaskDescription = await parseTaskDescription(taskDescription);

  // Analyze workspace (I/O, but functional)
  const workspace: WorkspaceAnalysis = await analyzeWorkspace(workspacePath);

  // Generate steps (pure function)
  const steps = createPlanSteps(task, workspace);

  // Format plan (pure function)
  return formatPlan({
    task,
    steps,
    workspace,
  });
}
```

```typescript
// src/core/planGenerator/createPlanSteps.ts
import type { Step, TaskDescription, WorkspaceAnalysis } from '../../types';

/**
 * Creates plan steps based on task and workspace analysis.
 * Pure function - no side effects.
 *
 * @param task - Parsed task description
 * @param workspace - Workspace analysis results
 * @returns Array of steps to complete the task
 */
export function createPlanSteps(
  task: TaskDescription,
  workspace: WorkspaceAnalysis
): Step[] {
  // Pure logic to generate steps
  return [
    {
      id: '1',
      description: `Implement ${task.title}`,
      reasoning: 'Based on task requirements',
      dependencies: [],
      completed: false,
    },
    // ... more steps
  ];
}
```

```typescript
// src/core/planGenerator/formatPlan.ts
import type { Plan, TaskDescription, Step, WorkspaceAnalysis } from '../../types';

interface FormatPlanInput {
  task: TaskDescription;
  steps: Step[];
  workspace: WorkspaceAnalysis;
}

/**
 * Formats plan data into the final Plan structure.
 * Pure function - deterministic output from given input.
 *
 * @param input - Plan components to format
 * @returns Formatted plan ready for display
 */
export function formatPlan(input: FormatPlanInput): Plan {
  const { task, steps, workspace } = input;

  return {
    id: generateId(),
    title: task.title,
    description: task.description,
    steps,
    files: [], // Derived from steps
    createdAt: new Date(),
    status: 'draft',
  };
}

function generateId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## UI Structure (`src/ui/`)

### WebView Organization (Functional)

**Note**: VS Code requires implementing the `WebviewViewProvider` interface, which necessitates a class.
However, keep the class minimal and delegate to pure functions.

```
src/ui/
├── planView/
│   ├── createPlanViewProvider.ts    # Factory function (creates provider)
│   ├── resolveWebviewView.ts        # Main view resolution logic
│   ├── getHtmlContent.ts            # Generate HTML content
│   ├── handleMessage.ts             # Message handler (router)
│   └── updatePlanView.ts            # Update view with new data
└── webview/                         # React components (browser side)
    ├── App.tsx                      # Main React app
    ├── components/
    │   ├── PlanViewer.tsx           # Display plan with steps
    │   ├── FileTree.tsx             # Show affected files
    │   ├── StepList.tsx             # Checklist of steps
    │   └── Progress.tsx             # Progress indicator
    ├── hooks/
    │   └── usePlan.ts               # Custom React hooks
    ├── styles/
    │   └── app.css                  # Component styles
    └── index.tsx                    # Entry point
```

### Example Functional WebView Pattern

**✅ DO: Minimal class with functional delegation**

```typescript
// src/ui/planView/createPlanViewProvider.ts
import * as vscode from 'vscode';
import type { Plan } from '../../types';
import { resolveWebviewView } from './resolveWebviewView';

/**
 * Creates a WebView provider with functional implementation.
 * The class is minimal and delegates to pure functions.
 *
 * @param extensionUri - Extension URI for resource loading
 * @returns WebView provider instance
 */
export function createPlanViewProvider(
  extensionUri: vscode.Uri
): vscode.WebviewViewProvider {
  // Minimal class implementation required by VS Code API
  class PlanViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'traycer.planView';
    private webviewView?: vscode.WebviewView;

    resolveWebviewView(
      webviewView: vscode.WebviewView,
      context: vscode.WebviewViewResolveContext,
      token: vscode.CancellationToken
    ): void {
      this.webviewView = webviewView;
      // Delegate to functional implementation
      resolveWebviewView(webviewView, extensionUri);
    }

    updatePlan(plan: Plan): void {
      if (this.webviewView) {
        this.webviewView.webview.postMessage({
          type: 'updatePlan',
          plan,
        });
      }
    }
  }

  return new PlanViewProvider();
}
```

```typescript
// src/ui/planView/resolveWebviewView.ts
import * as vscode from 'vscode';
import { getHtmlContent } from './getHtmlContent';
import { handleMessage } from './handleMessage';

/**
 * Resolves webview view configuration and setup.
 * Pure function that configures the webview.
 *
 * @param webviewView - VS Code webview view to configure
 * @param extensionUri - Extension URI for resource loading
 */
export function resolveWebviewView(
  webviewView: vscode.WebviewView,
  extensionUri: vscode.Uri
): void {
  // Configure webview options
  webviewView.webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };

  // Set HTML content
  webviewView.webview.html = getHtmlContent(webviewView.webview, extensionUri);

  // Handle messages functionally
  webviewView.webview.onDidReceiveMessage((message) => {
    handleMessage(message, webviewView.webview);
  });
}
```

```typescript
// src/ui/planView/handleMessage.ts
import * as vscode from 'vscode';

interface WebviewMessage {
  type: string;
  data?: any;
}

/**
 * Routes webview messages to appropriate handlers.
 * Pure function that maps message types to actions.
 *
 * @param message - Message from webview
 * @param webview - Webview to send responses to
 */
export function handleMessage(
  message: WebviewMessage,
  webview: vscode.Webview
): void {
  switch (message.type) {
    case 'stepCompleted':
      handleStepCompleted(message.data, webview);
      break;
    case 'requestData':
      handleDataRequest(webview);
      break;
    default:
      console.warn(`Unknown message type: ${message.type}`);
  }
}

function handleStepCompleted(stepId: string, webview: vscode.Webview): void {
  // Handle step completion
  console.log(`Step ${stepId} completed`);
}

function handleDataRequest(webview: vscode.Webview): void {
  // Send data to webview
  webview.postMessage({
    type: 'data',
    data: { /* ... */ },
  });
}
```

---

## Utilities Structure (`src/utils/`)

**MANDATORY: One Function Per File**

Each utility function in its own file:

```
src/utils/
├── fileSystem/
│   ├── readFile.ts          # Read file content
│   ├── writeFile.ts         # Write file content
│   ├── listFiles.ts         # List files in directory
│   └── findFiles.ts         # Find files by pattern
├── ast/
│   ├── parseSourceFile.ts   # Parse TypeScript/JavaScript file
│   ├── findFunctions.ts     # Extract function declarations
│   ├── findImports.ts       # Extract import statements
│   └── analyzeStructure.ts  # Analyze code structure
└── logger/
    ├── log.ts               # Info logging
    ├── warn.ts              # Warning logging
    └── error.ts             # Error logging
```

### Example Utility Functions

```typescript
// src/utils/fileSystem/readFile.ts
import * as vscode from 'vscode';

/**
 * Reads a file from the file system.
 * Pure async function with explicit error handling.
 *
 * @param path - Absolute path to the file
 * @returns File contents as string
 * @throws Error if file cannot be read
 */
export async function readFile(path: string): Promise<string> {
  const uri = vscode.Uri.file(path);
  const fileContent = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(fileContent).toString('utf8');
}
```

```typescript
// src/utils/fileSystem/writeFile.ts
import * as vscode from 'vscode';

/**
 * Writes content to a file.
 * Async function with side effects (I/O).
 *
 * @param path - Absolute path to the file
 * @param content - Content to write
 * @throws Error if file cannot be written
 */
export async function writeFile(path: string, content: string): Promise<void> {
  const uri = vscode.Uri.file(path);
  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
}
```

```typescript
// src/utils/ast/parseSourceFile.ts
import * as ts from 'typescript';

/**
 * Parses a TypeScript source file into an AST.
 * Pure function that transforms source code to AST.
 *
 * @param sourceCode - TypeScript/JavaScript source code
 * @param fileName - File name for error reporting
 * @returns TypeScript SourceFile AST node
 */
export function parseSourceFile(
  sourceCode: string,
  fileName: string = 'temp.ts'
): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );
}
```

---

## Type Definitions (`src/types/`)

```typescript
// src/types/index.ts

export interface Plan {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  files: FileChange[];
  createdAt: Date;
  status: 'draft' | 'in-progress' | 'completed';
}

export interface Step {
  id: string;
  description: string;
  reasoning: string;
  dependencies: string[];
  completed: boolean;
}

export interface FileChange {
  path: string;
  type: 'create' | 'modify' | 'delete';
  description: string;
  reasoning: string;
}

export interface TaskDescription {
  title: string;
  description: string;
  intent: TaskIntent;
  scope: string[];
}

export type TaskIntent =
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'documentation'
  | 'test';

export interface WorkspaceAnalysis {
  rootPath: string;
  files: FileInfo[];
  dependencies: Record<string, string[]>;
  patterns: CodePattern[];
}

export interface FileInfo {
  path: string;
  type: 'typescript' | 'javascript' | 'json' | 'other';
  size: number;
  exports: string[];
  imports: string[];
}

export interface CodePattern {
  type: 'component' | 'function' | 'class' | 'module';
  name: string;
  location: string;
}
```

---

## Test Structure (`test/`)

```
test/
├── core/
│   ├── planGenerator.test.ts
│   ├── codeAnalyzer.test.ts
│   ├── taskParser.test.ts
│   └── planVerifier.test.ts
├── utils/
│   ├── fileSystem.test.ts
│   └── ast.test.ts
├── fixtures/                 # Test fixtures
│   ├── sample-project/
│   └── sample-plans.json
└── helpers/                  # Test helpers
    └── mockVscode.ts
```

---

## Package.json Structure

```json
{
  "name": "traycer",
  "displayName": "Traycer - Planning Layer",
  "description": "Intelligent planning layer for development tasks",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "traycer.generatePlan",
        "title": "Traycer: Generate Development Plan"
      },
      {
        "command": "traycer.showPlan",
        "title": "Traycer: Show Current Plan"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "traycer",
          "title": "Traycer",
          "icon": "media/icon.svg"
        }
      ]
    },
    "views": {
      "traycer": [
        {
          "type": "webview",
          "id": "traycer.planView",
          "name": "Development Plan"
        }
      ]
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile",
    "test": "jest",
    "lint": "eslint src --ext ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

---

## Configuration Files

### Essential Config Files

- **`package.json`** - Extension manifest and activation
- **`tsconfig.json`** - TypeScript configuration
- **`.eslintrc.json`** - Linting rules
- **`.prettierrc`** - Code formatting
- **`.vscode/launch.json`** - Debug configurations
- **`.vscode/tasks.json`** - Build tasks

---

## Functional Programming Best Practices

### MANDATORY Rules

**✅ DO:**
- **One function per file**: Each file exports exactly one named function
- **Pure functions preferred**: Minimize side effects, return new values
- **Immutable data**: Use `const`, object spread, array methods like `map`/`filter`
- **Explicit dependencies**: All dependencies passed as parameters
- **Function composition**: Compose small functions into larger ones
- **Named exports**: Always use `export function functionName()`
- **Type safety**: Define interfaces for all function parameters and return types
- **JSDoc documentation**: Document purpose, parameters, return values

**❌ DON'T:**
- **No classes** (except minimal VS Code API requirements, delegate to functions)
- **No default exports**: Use named exports for consistency
- **No mutation**: Avoid `Array.push()`, `Object.assign()` on existing objects
- **No side effects in pure functions**: Keep I/O separate from logic
- **No stateful modules**: Don't store state at module level

### Architecture Patterns

**Function Organization:**
```
module/
├── mainFunction.ts      # Main exported function
├── helperA.ts          # Helper function A
├── helperB.ts          # Helper function B
└── types.ts            # Module-specific types (if needed)
```

**Composition over Inheritance:**
```typescript
// ✅ Compose functions
export async function processTask(task: string): Promise<Result> {
  const parsed = await parseTask(task);
  const analyzed = analyzeTask(parsed);
  const validated = validateTask(analyzed);
  return formatResult(validated);
}
```

**Immutability:**
```typescript
// ✅ Return new objects
export function addStep(plan: Plan, step: Step): Plan {
  return {
    ...plan,
    steps: [...plan.steps, step],
  };
}

// ❌ Don't mutate
export function addStep(plan: Plan, step: Step): void {
  plan.steps.push(step); // WRONG: mutation
}
```

**Explicit Dependencies:**
```typescript
// ✅ Pass dependencies as parameters
export async function generatePlan(
  taskDescription: string,
  workspacePath: string,
  fileReader: (path: string) => Promise<string>
): Promise<Plan> {
  // Use fileReader function
}

// ❌ Don't use module-level state
let cachedWorkspace: Workspace; // WRONG: module state
export function generatePlan(task: string): Plan {
  // Uses cached state
}
```

This functional architecture provides excellent testability, maintainability, and predictability for VS Code extension development.
