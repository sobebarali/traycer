---
Source: .ruler/01_project_architecture.md
---
## Project Structure

This is a VS Code Extension project with the following structure:

- **VS Code Extension** with TypeScript
- **WebView UI** with React for interactive plan viewer
- **Node.js** runtime for code analysis and plan generation
- **TypeScript Compiler API** for AST parsing and code understanding
- **Jest** for testing

## Available Scripts

### Development
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Run Prettier for code formatting

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Extension Development
- `F5` in VS Code - Launch extension in debug mode
- `npm run vscode:prepublish` - Prepare for publishing
- `npm run package` - Package extension as VSIX

## Post-Task Commands

**MANDATORY**: After completing any task, run:
1. `npm run typecheck` - Verify TypeScript compilation
2. `npm run lint` - Check code quality
3. `npm run format` - Format code consistently

**Note:** User runs tests manually

## Key Architecture

- **Extension Entry**: VS Code extension activation and command registration
- **Core Logic**: Plan generation, code analysis, and task parsing
- **UI Layer**: WebView panels for interactive plan viewing
- **Utils**: File system operations, AST parsing, and helpers
- **Type Safety**: End-to-end TypeScript with strict mode

## Core Technologies

- **TypeScript 5** - Type-safe extension development
- **VS Code Extension API** - Extension host integration
- **Node.js** - Runtime for file operations and code analysis
- **React 18** - UI framework for webview panels
- **TypeScript Compiler API** - AST parsing and code analysis
- **Jest** - Testing framework
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting

## Extension Architecture

**Activation**: Extension activates on workspace open or command trigger
**Commands**: User-triggered commands for plan generation
**WebView**: Interactive UI for plan display and editing
**File Analysis**: Parse and understand project structure
**Plan Storage**: Store plans in workspace state or files

## Development Workflow

**Local Development**: Use F5 to launch Extension Development Host
**Testing**: Run Jest tests for core logic
**Debugging**: Use VS Code debugger with breakpoints
**Packaging**: Create VSIX for distribution

---
Source: .ruler/02_folder_structure.md
---
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

---
Source: .ruler/03_ai_workflow.md
---
# AI Workflow Rules - Traycer VS Code Extension

## 🚨 MANDATORY: Post-Task Commands

After **ANY** code change, run these in order (all must pass):
```bash
npm run typecheck    # Fix TypeScript errors
npm run lint         # Check code quality
npm run format       # Format code
```

**Note:** Tests are run manually by the user, not automatically after code changes.

---

## 🔄 Optimal Task Workflow (Follow This Order)

### Phase 1: Understanding Context (READ FIRST)

**Purpose:** Understand project structure and existing patterns

1. **Read `/README.md`**
   - Project overview and goals
   - Core features and architecture
   - Current implementation status

2. **Read `.ruler/` files**
   - 01_project_architecture.md - Project structure
   - 02_folder_structure.md - Folder organization
   - 04_coding_style.md - Coding conventions

3. **Review existing code** (if applicable)
   - Similar features already implemented
   - Code patterns and conventions used
   - Type definitions in `src/types/`

---

### Phase 2: Learn from Existing Code (READ PATTERNS)

**Purpose:** Understand implementation patterns before writing new code

4. **Read similar existing modules** (if any)
   - Example: If adding plan storage, read existing file operations in `utils/fileSystem.ts`
   - Understand the pattern and structure

5. **Read existing types** (REFERENCE ONLY)
   - `src/types/index.ts`
   - Understand data structures used
   - Reference existing types, don't duplicate

6. **Read VS Code API usage**
   - How commands are registered
   - How webviews are created
   - How workspace is accessed

---

### Phase 3: Design & Plan

**Purpose:** Plan implementation before writing code

7. **Define interfaces and types**
   - Add new types to `src/types/index.ts`
   - Follow existing naming conventions
   - Use TypeScript strict mode

8. **Plan module structure**
   - Which files need to be created/modified
   - Dependencies between modules
   - Public API surface

---

### Phase 4: Write Tests First (TDD)

**Purpose:** Define expected behavior before implementation

9. **Create test files** in `test/{module}/`
   ```
   test/{module}/
   ├── {feature}.test.ts    # Main functionality tests
   ├── edge-cases.test.ts   # Edge case handling
   └── integration.test.ts  # Integration tests
   ```

10. **Write test cases**
    - Success cases
    - Error handling
    - Edge cases
    - Integration scenarios

---

### Phase 5: Implementation (MAKE TESTS PASS)

**Purpose:** Implement code to satisfy the tests (TDD approach)

**Order matters - implement to make tests pass:**

11. **Implement core logic** → `src/core/{module}.ts`
12. **Implement utilities** → `src/utils/{module}.ts` (if needed)
13. **Implement UI** → `src/ui/{module}.ts` (if needed)
14. **Register commands** → `src/extension.ts`
15. **User runs tests manually** → `npm test`

---

### Phase 6: Documentation (UPDATE DOCS)

**Purpose:** Keep documentation in sync with code

16. **Update `/README.md`** (if major feature)
    - Add to core features if significant
    - Update architecture section if needed
    - Keep user-facing and concise

17. **Add JSDoc comments**
    - Document public APIs
    - Include parameter descriptions
    - Add usage examples for complex functions

18. **Update type definitions**
    - Ensure all public types are exported
    - Add JSDoc comments to interfaces

---

## 📝 VS Code Extension Development Standards

### Extension Activation

**Activation Events:**
- Use `onStartupFinished` for general activation
- Use `onCommand:{command}` for command-specific activation
- Avoid eager activation unless necessary

**Example:**
```json
"activationEvents": [
  "onStartupFinished",
  "onView:traycer.planView"
]
```

### Command Registration

**Pattern:**
```typescript
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
  const generatePlanCommand = vscode.commands.registerCommand(
    'traycer.generatePlan',
    async () => {
      // Command implementation
    }
  );

  context.subscriptions.push(generatePlanCommand);
}
```

### WebView Best Practices

1. **Security:**
   - Enable script nonce for inline scripts
   - Restrict resource loading with CSP
   - Sanitize user input

2. **Communication:**
   - Use message passing for extension ↔ webview communication
   - Define clear message types
   - Handle errors gracefully

3. **State Management:**
   - Use `getState()` and `setState()` for webview state
   - Persist important state in workspace storage

---

## Self-Check Questions

Before completing a task:

1. ✅ Did I read existing patterns first?
2. ✅ Did I write tests BEFORE implementation? (TDD)
3. ✅ Did I follow functional programming rules?
   - One function per file?
   - No classes (except minimal VS Code API)?
   - Pure functions with immutable data?
   - Named exports only?
4. ✅ Did I add/modify commands? → Update `package.json` contributions
5. ✅ Did I add new types? → Export from `src/types/index.ts`
6. ✅ Did I add webview UI? → Implement proper message handling
7. ✅ Did post-task commands (typecheck, lint, format) pass?
8. ✅ Did I add JSDoc comments for public APIs?
9. ✅ Did I update README for major features?
10. ✅ Did I follow VS Code extension best practices?

---

## Common Mistakes

### ❌ Don't Do This:

1. **Writing code before reading context**
   ```
   ❌ Immediately write implementation
   ❌ Skip reading existing patterns
   ❌ Invent new patterns instead of following existing
   ```

2. **Wrong implementation order (Not following TDD)**
   ```
   ❌ Write implementation before tests
   ❌ Skip writing tests first
   ❌ Test after everything is done
   ```

3. **Skipping documentation**
   ```
   ❌ No JSDoc comments on public APIs
   ❌ Skip updating README for major features
   ❌ No type documentation
   ```

4. **Poor VS Code API usage**
   ```
   ❌ Eager activation without reason
   ❌ Not disposing resources
   ❌ Ignoring cancellation tokens
   ❌ Synchronous operations on main thread
   ```

### ✅ Do This Instead:

1. **Always read context first**
   ```
   ✅ Read README.md and .ruler/ files
   ✅ Study similar existing code
   ✅ Follow established patterns
   ```

2. **Follow TDD workflow**
   ```
   ✅ Tests → Implementation → Documentation
   ✅ Write tests first to define behavior
   ✅ Implement to make tests pass
   ```

3. **Follow functional programming rules**
   ```
   ✅ One function per file (file name = function name)
   ✅ No classes (except minimal VS Code API requirements)
   ✅ Pure functions with immutable data
   ✅ Named exports only
   ✅ Explicit dependencies as parameters
   ```

4. **Document thoroughly**
   ```
   ✅ JSDoc for all public APIs
   ✅ Update README for major features
   ✅ Export and document types
   ```

5. **Follow VS Code best practices**
   ```
   ✅ Use appropriate activation events
   ✅ Dispose resources properly
   ✅ Handle cancellation tokens
   ✅ Use async operations appropriately
   ```

---

## Quick Reference

**Workflow**: Read → Plan → Tests → Implement → Document → Verify
**Key Rule**: Write tests BEFORE implementation (TDD)
**Post-Task**: typecheck → lint → format (user runs tests manually)

---

## Summary

**The optimal TDD workflow is:**

1. 📖 **Read** → Understand project and existing patterns
2. 🎯 **Plan** → Design types and module structure
3. 🧪 **Test First** → Write tests before implementation (TDD)
4. ✍️ **Implement** → Write code to make tests pass (functional programming)
5. 📝 **Document** → Add JSDoc and update README
6. ✅ **Verify** → Run typecheck, lint, format (user runs tests)

**Key principles:**
- Read before write
- Test-driven development (write tests first)
- **Functional programming** (one function per file, no classes, immutable data)
- Implement to make tests pass
- Document public APIs
- Follow VS Code extension best practices
- User runs tests manually

**Functional Programming Rules (MANDATORY):**
- One function per file (file name = function name)
- No classes (except minimal VS Code API requirements)
- Pure functions with immutable data structures
- Named exports only (`export function name()`)
- Explicit dependencies (pass as parameters)
- Function composition over inheritance

---
Source: .ruler/04_coding_style.md
---
# 🎯 Coding Style Guidelines - Traycer VS Code Extension

This document defines coding style and best practices for VS Code extension development with TypeScript.

---

## Key Principles

* **Functional Programming First**: Pure functions, immutable data, no classes
* **One Function Per File**: Each file exports exactly one named function
* **Type Safety First**: Enable strict TypeScript checks. Avoid `any` and unsafe casts.
* **Consistency**: Code should look uniform across the project.
* **Readability**: Write for humans first, machines second.
* **Error Prevention**: Use linters and static analysis.
* **Performance**: Async operations, avoid blocking main thread.
* **Composition**: Build complex behavior from simple functions.

---

## Development Tools

* **TypeScript** – strict typing (`strict: true`)
* **ESLint** – code quality and best practices
* **Prettier** – consistent code formatting
* **Jest** – testing framework
* **VS Code Extension API** – extension development

---

## Before Writing Code

1. Review existing patterns before introducing new ones.
2. Consider edge cases and error scenarios.
3. Validate all inputs and outputs.
4. Maintain **single responsibility** per function/module.
5. Use async/await for all VS Code API calls.

---

## Naming Conventions

* **Files**: `camelCase.ts` matching the function name (e.g., `generatePlan.ts` exports `generatePlan()`).
* **Directories**: `camelCase` matching the module name (e.g., `planGenerator/`, `utils/`).
* **Functions**: `camelCase` (e.g., `generatePlan`, `analyzeWorkspace`).
* **Variables**: `camelCase` (e.g., `taskDescription`, `workspacePath`).
* **Interfaces**: `PascalCase` (e.g., `Plan`, `FileChange`).
* **Types**: `PascalCase` (e.g., `TaskIntent`, `PlanStatus`).
* **Constants**: `UPPER_CASE` (e.g., `MAX_FILE_SIZE`, `DEFAULT_TIMEOUT`).
* **Tests**: mirror source file names with `.test.ts` suffix (e.g., `generatePlan.test.ts`).
* **React Components**: `PascalCase` for both component and file (e.g., `PlanViewer.tsx`).

**IMPORTANT**: No classes allowed (except minimal VS Code API requirements). Function names must match file names.

---

## Functional Programming Patterns (MANDATORY)

### One Function Per File Rule

**MANDATORY**: Each file exports exactly one named function. The file name must match the function name.

### Core Patterns

* **Pure functions preferred**: Functions should return new values, not mutate inputs
* **Immutable data structures**: Use `const`, object spread `{...obj}`, array spread `[...arr]`
* **Explicit dependencies**: All dependencies passed as function parameters
* **Function composition**: Build complex functions from simple ones
* **Named exports only**: Always use `export function functionName()`
* **TypeScript interfaces**: Define types for all parameters and return values
* **Object destructuring for parameters**: Use object destructuring with inline types for multiple parameters (2+ params)

### ✅ DO: Functional Patterns with Object Destructuring

```typescript
// src/core/planGenerator/generatePlan.ts

import type { Plan, TaskDescription, WorkspaceAnalysis } from '../../types';
import { parseTaskDescription } from '../taskParser/parseTaskDescription';
import { analyzeWorkspace } from '../codeAnalyzer/analyzeWorkspace';
import { createPlanSteps } from './createPlanSteps';
import { formatPlan } from './formatPlan';

/**
 * Generates a development plan from a task description.
 * Pure function that composes smaller functions.
 *
 * @param params - Function parameters
 * @param params.taskDescription - Natural language description of the task
 * @param params.workspacePath - Path to the workspace to analyze
 * @returns A structured development plan with steps and file changes
 */
export async function generatePlan({
  taskDescription,
  workspacePath,
}: {
  taskDescription: string;
  workspacePath: string;
}): Promise<Plan> {
  // Compose pure functions
  const task = await parseTaskDescription({ description: taskDescription });
  const workspace = await analyzeWorkspace({ workspacePath });
  const steps = createPlanSteps({ task, workspace });

  return formatPlan({ task, steps, workspace });
}
```

```typescript
// src/core/planGenerator/createPlanSteps.ts

import type { Step, TaskDescription, WorkspaceAnalysis } from '../../types';

/**
 * Creates plan steps from task and workspace analysis.
 * Pure function - no side effects, deterministic output.
 *
 * @param params - Function parameters
 * @param params.task - Parsed task description
 * @param params.workspace - Workspace analysis results
 * @returns Array of steps to complete the task
 */
export function createPlanSteps({
  task,
  workspace,
}: {
  task: TaskDescription;
  workspace: WorkspaceAnalysis;
}): Step[] {
  // Pure logic - returns new array
  return [
    {
      id: generateStepId({ index: 1 }),
      description: `Implement ${task.title}`,
      reasoning: 'Based on task requirements and workspace structure',
      dependencies: [],
      completed: false,
    },
  ];
}

function generateStepId({ index }: { index: number }): string {
  return `step-${index}`;
}
```

```typescript
// src/utils/array/addItem.ts

/**
 * Adds an item to an array immutably.
 * Pure function - returns new array, doesn't mutate input.
 *
 * @param params - Function parameters
 * @param params.arr - Original array
 * @param params.item - Item to add
 * @returns New array with item added
 */
export function addItem<T>({
  arr,
  item,
}: {
  arr: readonly T[];
  item: T;
}): T[] {
  return [...arr, item];
}
```

```typescript
// Example: Single parameter (no destructuring needed)
// src/utils/string/capitalize.ts

/**
 * Capitalizes the first letter of a string.
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

### ❌ DON'T: Anti-Patterns

```typescript
// ❌ WRONG: Multiple parameters without destructuring
export function generatePlan(
  taskDescription: string,
  workspacePath: string,
  options: Options
): Promise<Plan> { ... }

// ❌ WRONG: Multiple functions in one file
export function generatePlan() { ... }
export function createSteps() { ... }
export function formatPlan() { ... }

// ❌ WRONG: Using classes
export class PlanGenerator {
  generatePlan() { ... }
}

// ❌ WRONG: Mutating data
export function addStep(plan: Plan, step: Step): void {
  plan.steps.push(step); // Mutation!
}

// ❌ WRONG: Module-level state
let cachedData: any;
export function getData() {
  return cachedData; // Stateful module!
}

// ❌ WRONG: Default exports
export default function generatePlan() { ... }

// ❌ WRONG: Using any
function process(input: any): any { ... }

// ❌ WRONG: No error handling
async function doSomething() {
  await operation(); // No try/catch
}

// ❌ WRONG: File name doesn't match function name
// File: planGenerator.ts
export function generatePlan() { ... } // Should be in generatePlan.ts

// ❌ WRONG: Separate type definition for parameters
interface GeneratePlanParams {
  taskDescription: string;
  workspacePath: string;
}
export function generatePlan(params: GeneratePlanParams): Promise<Plan> { ... }
// Should use inline types with destructuring
```

---

## Object Destructuring for Parameters (MANDATORY)

### Rule: 2+ Parameters Must Use Destructuring

**When you have 2 or more parameters, you MUST use object destructuring with inline types.**

### ✅ CORRECT: Destructuring with Inline Types

```typescript
// Two parameters - use destructuring
export function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}): User {
  return { id: generateId(), name, email };
}

// Three parameters - use destructuring
export function updateFile({
  path,
  content,
  encoding,
}: {
  path: string;
  content: string;
  encoding: BufferEncoding;
}): Promise<void> {
  return writeFile({ path, content, encoding });
}

// Many parameters - use destructuring
export function analyzeCode({
  sourceCode,
  fileName,
  options,
  context,
}: {
  sourceCode: string;
  fileName: string;
  options: AnalyzeOptions;
  context: AnalysisContext;
}): Analysis {
  // Implementation
}
```

### ✅ CORRECT: Single Parameter (No Destructuring Needed)

```typescript
// Single primitive parameter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Single object parameter (can destructure or not)
export function processUser(user: User): ProcessedUser {
  return { ...user, processed: true };
}

// Or with destructuring if you need specific properties
export function getUserName({ firstName, lastName }: User): string {
  return `${firstName} ${lastName}`;
}
```

### ❌ WRONG: Multiple Parameters Without Destructuring

```typescript
// ❌ DON'T: Multiple parameters as separate arguments
export function createUser(name: string, email: string): User {
  return { id: generateId(), name, email };
}

// ❌ DON'T: Using separate interface definition
interface CreateUserParams {
  name: string;
  email: string;
}
export function createUser(params: CreateUserParams): User {
  const { name, email } = params; // Extra destructuring step
  return { id: generateId(), name, email };
}
```

### Benefits of This Pattern

1. **Self-Documenting**: Parameter names are clear at call site
   ```typescript
   // Clear what each argument means
   createUser({ name: 'John', email: 'john@example.com' })

   // vs unclear positional arguments
   createUser('John', 'john@example.com') // What's what?
   ```

2. **Order-Independent**: Parameters can be passed in any order
   ```typescript
   updateFile({
     encoding: 'utf-8',
     path: '/file.txt',
     content: 'hello'
   }); // Works fine!
   ```

3. **Easy to Extend**: Adding optional parameters doesn't break calls
   ```typescript
   export function updateFile({
     path,
     content,
     encoding = 'utf-8', // Optional with default
     backup = false,     // New optional parameter
   }: {
     path: string;
     content: string;
     encoding?: BufferEncoding;
     backup?: boolean;
   }): Promise<void>
   ```

4. **Type Safety**: Inline types provide immediate type checking
5. **Refactoring-Friendly**: Easy to add/remove parameters

---

### Higher-Order Functions

```typescript
// src/utils/function/withErrorHandling.ts

/**
 * Wraps an async function with error handling.
 * Higher-order function that enhances behavior.
 *
 * @param fn - Function to wrap
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Operation failed: ${message}`);
    }
  };
}
```

### Function Composition

```typescript
// src/utils/function/compose.ts

/**
 * Composes functions from right to left.
 * Pure function that combines multiple functions.
 *
 * @param fns - Functions to compose
 * @returns Composed function
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}
```

### Immutable Updates

```typescript
// src/utils/object/updateProperty.ts

/**
 * Updates a property in an object immutably.
 * Pure function - returns new object.
 *
 * @param obj - Original object
 * @param key - Property key to update
 * @param value - New value
 * @returns New object with updated property
 */
export function updateProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  return {
    ...obj,
    [key]: value,
  };
}
```

---

## VS Code API Best Practices

### Command Registration

```typescript
// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register command
  const disposable = vscode.commands.registerCommand(
    'traycer.generatePlan',
    async () => {
      try {
        // Command implementation
        vscode.window.showInformationMessage('Plan generated!');
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  // Add to subscriptions for proper cleanup
  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Cleanup if needed
}
```

### Working with Workspace

```typescript
// Always check if workspace exists
const workspaceFolders = vscode.workspace.workspaceFolders;
if (!workspaceFolders) {
  vscode.window.showErrorMessage('No workspace folder open');
  return;
}

const rootPath = workspaceFolders[0].uri.fsPath;
```

### File Operations

```typescript
// Use VS Code API for file operations
import * as vscode from 'vscode';

async function readFile(path: string): Promise<string> {
  const uri = vscode.Uri.file(path);
  const fileContent = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(fileContent).toString('utf8');
}

async function writeFile(path: string, content: string): Promise<void> {
  const uri = vscode.Uri.file(path);
  await vscode.workspace.fs.writeFile(
    uri,
    Buffer.from(content, 'utf8')
  );
}
```

### Managing Side Effects

**Separate pure logic from side effects:**

```typescript
// src/core/planGenerator/generatePlan.ts (with I/O)

/**
 * Generates a development plan (with I/O side effects).
 * Orchestrates pure functions and I/O operations.
 */
export async function generatePlan(
  taskDescription: string,
  workspacePath: string
): Promise<Plan> {
  // I/O operations at the edges
  const task = await parseTaskDescription(taskDescription);
  const workspace = await analyzeWorkspace(workspacePath);

  // Pure logic in the middle
  const steps = createPlanSteps(task, workspace);
  const plan = formatPlan({ task, steps, workspace });

  // More I/O if needed
  await savePlan(plan);

  return plan;
}
```

```typescript
// src/core/planGenerator/createPlanSteps.ts (pure)

/**
 * Pure function - no I/O, deterministic.
 * Easily testable without mocks.
 */
export function createPlanSteps(
  task: TaskDescription,
  workspace: WorkspaceAnalysis
): Step[] {
  // Pure logic only
  return task.requirements.map((req, index) => ({
    id: `step-${index}`,
    description: req,
    reasoning: deriveReasoning(req, workspace),
    dependencies: [],
    completed: false,
  }));
}
```

### WebView Best Practices (Functional)

```typescript
// src/ui/planView/createPlanViewProvider.ts

import * as vscode from 'vscode';
import { resolveWebviewView } from './resolveWebviewView';

/**
 * Factory function that creates a minimal WebView provider.
 * Class is required by VS Code API but delegates to functions.
 */
export function createPlanViewProvider(
  extensionUri: vscode.Uri
): vscode.WebviewViewProvider {
  class PlanViewProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(
      webviewView: vscode.WebviewView,
      context: vscode.WebviewViewResolveContext,
      token: vscode.CancellationToken
    ): void {
      // Delegate to functional implementation
      resolveWebviewView(webviewView, extensionUri);
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
 * Configures the webview (functional implementation).
 */
export function resolveWebviewView(
  webviewView: vscode.WebviewView,
  extensionUri: vscode.Uri
): void {
  webviewView.webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };

  webviewView.webview.html = getHtmlContent(webviewView.webview, extensionUri);

  webviewView.webview.onDidReceiveMessage((message) => {
    handleMessage(message, webviewView.webview);
  });
}
```

```typescript
// src/ui/planView/getHtmlContent.ts

import * as vscode from 'vscode';
import { generateNonce } from './generateNonce';

/**
 * Generates HTML content for webview.
 * Pure function - deterministic output.
 */
export function getHtmlContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const nonce = generateNonce();
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'out', 'webview.js')
  );

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'none'; script-src 'nonce-${nonce}';">
  </head>
  <body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
}
```

```typescript
// src/ui/planView/generateNonce.ts

/**
 * Generates a cryptographic nonce for CSP.
 * Pure function (with randomness, but deterministic per call).
 */
export function generateNonce(): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
```

---

## Error Handling

* Use `try/catch` with meaningful messages.
* Show user-friendly error messages with `vscode.window.showErrorMessage()`.
* Log errors for debugging.
* Never let errors crash the extension.

✅ Example:

```typescript
import * as vscode from 'vscode';

async function performOperation() {
  try {
    // Operation
    const result = await someAsyncOperation();
    vscode.window.showInformationMessage('Operation successful!');
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Operation failed: ${message}`);
    console.error('Error details:', error);
    throw error; // Re-throw if caller needs to handle it
  }
}
```

---

## TypeScript Best Practices

* Enable `strict` mode in `tsconfig.json`.
* Use `import type` for type-only imports.
* Never use `any`. If unavoidable, add explanation comment.
* Avoid non-null assertions (`!`) unless absolutely safe.
* Define interfaces for all data structures.
* Export types that are part of public API.

✅ Example:

```typescript
// src/types/index.ts
export interface Plan {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  files: FileChange[];
  createdAt: Date;
  status: PlanStatus;
}

export type PlanStatus = 'draft' | 'in-progress' | 'completed';

export interface Step {
  id: string;
  description: string;
  reasoning: string;
  dependencies: string[];
  completed: boolean;
}
```

---

## Code Quality Rules (Do's & Don'ts)

### ✅ DO: Functional Programming

* **One function per file** - File name matches function name
* **Pure functions** - No side effects unless necessary
* **Immutable data** - Use spread operators, `map`, `filter`, `reduce`
* **Named exports** - Always `export function functionName()`
* **Explicit dependencies** - Pass all dependencies as parameters
* **Function composition** - Build complex from simple functions
* **Arrow functions** - For callbacks and inline functions
* **Optional chaining** - Use `?.` for safe property access
* **Type safety** - Define interfaces for all parameters
* **const by default** - Use `const`, only `let` when necessary
* **Async/await** - For all asynchronous operations
* **Error handling** - Try/catch with proper error messages
* **JSDoc comments** - Document all exported functions

### ❌ DON'T: Anti-Patterns

* **No classes** (except minimal VS Code API requirements)
* **No default exports** - Use named exports only
* **No mutation** - Don't use `.push()`, `.splice()`, direct property assignment
* **No module state** - Don't store state at module level
* **No `var`** - Always use `const` or `let`
* **No `any`** - Always specify types
* **No multiple functions per file** - One function per file only
* **No reassigning parameters** - Treat parameters as immutable
* **No synchronous operations** - Use async operations
* **No magic numbers** - Use named constants
* **No commented-out code** - Remove it
* **No ignored errors** - Always handle or rethrow

---

## Testing Best Practices

* Mirror source structure under `test/` directory.
* Use Jest for unit tests.
* Mock VS Code API for testing.
* Test both success and error cases.
* Use descriptive test names.
* Keep tests fast and isolated.

**Test Structure:**
```
test/{module}/
├── {feature}.test.ts    # Main tests
├── edge-cases.test.ts   # Edge cases
└── integration.test.ts  # Integration tests
```

**Example Test (Functional):**

```typescript
// test/core/planGenerator/generatePlan.test.ts
import { generatePlan } from '../../../src/core/planGenerator/generatePlan';

describe('generatePlan', () => {
  it('should generate plan from task description', async () => {
    const taskDescription = 'Add user authentication';
    const workspacePath = '/test/workspace';

    const plan = await generatePlan(taskDescription, workspacePath);

    expect(plan).toBeDefined();
    expect(plan.title).toBe('Add user authentication');
    expect(plan.steps.length).toBeGreaterThan(0);
  });

  it('should handle invalid input', async () => {
    await expect(generatePlan('', '/test/workspace')).rejects.toThrow();
  });

  it('should handle invalid workspace path', async () => {
    await expect(generatePlan('Add feature', '')).rejects.toThrow();
  });
});
```

```typescript
// test/core/planGenerator/createPlanSteps.test.ts
import { createPlanSteps } from '../../../src/core/planGenerator/createPlanSteps';
import type { TaskDescription, WorkspaceAnalysis } from '../../../src/types';

describe('createPlanSteps', () => {
  it('should create steps from task and workspace', () => {
    const task: TaskDescription = {
      title: 'Add authentication',
      description: 'Add user authentication',
      intent: 'feature',
      scope: ['src/auth'],
    };

    const workspace: WorkspaceAnalysis = {
      rootPath: '/test',
      files: [],
      dependencies: {},
      patterns: [],
    };

    const steps = createPlanSteps(task, workspace);

    expect(steps).toBeDefined();
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].description).toContain('authentication');
  });

  it('should be pure function - same input produces same output', () => {
    const task: TaskDescription = { /* ... */ };
    const workspace: WorkspaceAnalysis = { /* ... */ };

    const steps1 = createPlanSteps(task, workspace);
    const steps2 = createPlanSteps(task, workspace);

    expect(steps1).toEqual(steps2);
  });
});
```

---

## Style & Consistency

* Use braces `{}` for all control statements.
* Use template literals over string concatenation.
* Keep functions short (ideally <50 lines).
* Prefer early returns over deeply nested `if` statements.
* Group related functions and types together.
* Consistent import ordering:
  1. External libraries (vscode, node)
  2. Internal modules (core, utils)
  3. Types
  4. Styles (if applicable)

**Example:**

```typescript
// External libraries
import * as vscode from 'vscode';
import * as path from 'path';

// Internal modules
import { PlanGenerator } from '../core/planGenerator';
import { CodeAnalyzer } from '../core/codeAnalyzer';
import { readFile } from '../utils/fileSystem';

// Types
import type { Plan, TaskDescription } from '../types';
```

---

## Performance Considerations

* Use async/await for I/O operations.
* Avoid blocking the extension host thread.
* Cache expensive computations.
* Use progress indicators for long operations:

```typescript
await vscode.window.withProgress(
  {
    location: vscode.ProgressLocation.Notification,
    title: 'Generating plan...',
    cancellable: true
  },
  async (progress, token) => {
    token.onCancellationRequested(() => {
      console.log('User cancelled operation');
    });

    progress.report({ increment: 0, message: 'Analyzing workspace...' });
    // Do work
    progress.report({ increment: 50, message: 'Generating steps...' });
    // More work
    progress.report({ increment: 100, message: 'Complete!' });
  }
);
```

---

## Documentation

* Add JSDoc comments for public APIs.
* Include parameter descriptions and return types.
* Add usage examples for complex functions.

```typescript
/**
 * Generates a development plan from a task description.
 *
 * @param taskDescription - Natural language description of the task
 * @returns A structured development plan with steps and file changes
 * @throws Error if task description is empty or invalid
 *
 * @example
 * ```typescript
 * const plan = await generator.generatePlan('Add user authentication');
 * console.log(plan.steps);
 * ```
 */
async generatePlan(taskDescription: string): Promise<Plan> {
  // Implementation
}
```

---

## Summary

**MANDATORY Functional Programming Rules:**

1. **One Function Per File** - Each file exports exactly one named function
2. **Object Destructuring** - Use object destructuring with inline types for 2+ parameters
3. **No Classes** - Use pure functions (except minimal VS Code API requirements)
4. **Immutable Data** - Never mutate, always return new values
5. **Pure Functions** - Separate pure logic from side effects (I/O)
6. **Explicit Dependencies** - Pass all dependencies as parameters
7. **Named Exports** - Always `export function functionName()`
8. **Type Safety** - Strict TypeScript, no `any`
9. **Function Composition** - Build complex from simple functions

**Key Benefits:**
- **Testability**: Pure functions are easy to test without mocks
- **Predictability**: Same input always produces same output
- **Maintainability**: Small, focused functions are easier to understand
- **Refactorability**: Pure functions can be moved, renamed, composed freely
- **Debugging**: No hidden state, easier to trace issues
- **Performance**: Functional code is easier to optimize and parallelize

**Example Architecture:**
```
src/core/planGenerator/
├── generatePlan.ts        # Main function (orchestrates)
├── createPlanSteps.ts     # Pure helper
├── formatPlan.ts          # Pure helper
└── analyzeDependencies.ts # Pure helper
```

This functional architecture ensures maintainable, testable, and reliable VS Code extension development.

---
Source: .ruler/07_testing_guidelines.md
---
# Testing Guidelines - Traycer VS Code Extension

This document outlines testing practices for VS Code extension development with Jest.

## Core Principles

- **Test-Driven Development**: Write tests before implementation
- **Unit Testing Focus**: Test core logic independently from VS Code API
- **Mock VS Code API**: Use mocks for VS Code dependencies
- **Fast Execution**: Keep tests fast and isolated
- **Type Safety**: Full TypeScript coverage in tests
- **Clear Descriptions**: Use descriptive test names

## Test Structure

### File Organization

```
test/
├── core/                      # Core logic tests
│   ├── planGenerator.test.ts
│   ├── codeAnalyzer.test.ts
│   ├── taskParser.test.ts
│   └── planVerifier.test.ts
├── utils/                     # Utility function tests
│   ├── fileSystem.test.ts
│   ├── ast.test.ts
│   └── logger.test.ts
├── fixtures/                  # Test data and fixtures
│   ├── sample-project/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   └── sample-plans.json
└── helpers/                   # Test helpers and mocks
    ├── mockVscode.ts
    ├── mockWorkspace.ts
    └── testData.ts
```

### Example Test Structure

```
test/core/planGenerator/
├── generatePlan.test.ts       # Main functionality
├── edge-cases.test.ts         # Edge cases
└── errors.test.ts             # Error handling
```

## Testing Patterns

### Unit Test Pattern

**Basic Structure:**

```typescript
// test/core/planGenerator.test.ts
import { PlanGenerator } from '../../src/core/planGenerator';
import { mockWorkspace } from '../helpers/mockWorkspace';

describe('PlanGenerator', () => {
  let generator: PlanGenerator;

  beforeEach(() => {
    generator = new PlanGenerator();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePlan', () => {
    it('should generate plan from task description', async () => {
      const taskDescription = 'Add user authentication';
      const plan = await generator.generatePlan(taskDescription);

      expect(plan).toBeDefined();
      expect(plan.title).toBe('Add user authentication');
      expect(plan.steps.length).toBeGreaterThan(0);
      expect(plan.files.length).toBeGreaterThan(0);
    });

    it('should throw error for empty task description', async () => {
      await expect(generator.generatePlan('')).rejects.toThrow(
        'Task description cannot be empty'
      );
    });

    it('should include reasoning for each step', async () => {
      const plan = await generator.generatePlan('Add login feature');

      plan.steps.forEach(step => {
        expect(step.reasoning).toBeDefined();
        expect(step.reasoning.length).toBeGreaterThan(0);
      });
    });
  });
});
```

### Mocking VS Code API

**Create Mock Helper:**

```typescript
// test/helpers/mockVscode.ts
export const mockVscode = {
  window: {
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showInputBox: jest.fn(),
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      show: jest.fn(),
    })),
    withProgress: jest.fn((options, task) => {
      const progress = {
        report: jest.fn(),
      };
      const token = {
        isCancellationRequested: false,
        onCancellationRequested: jest.fn(),
      };
      return task(progress, token);
    }),
  },
  workspace: {
    workspaceFolders: [
      {
        uri: { fsPath: '/test/workspace' },
        name: 'test-workspace',
        index: 0,
      },
    ],
    getConfiguration: jest.fn(() => ({
      get: jest.fn(),
      has: jest.fn(),
      inspect: jest.fn(),
      update: jest.fn(),
    })),
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      readDirectory: jest.fn(),
      stat: jest.fn(),
    },
  },
  Uri: {
    file: jest.fn((path) => ({ fsPath: path })),
    parse: jest.fn((path) => ({ fsPath: path })),
  },
  commands: {
    registerCommand: jest.fn(),
    executeCommand: jest.fn(),
  },
};

// Mock the vscode module
jest.mock('vscode', () => mockVscode, { virtual: true });
```

### Testing with Fixtures

**Use Test Fixtures:**

```typescript
// test/core/codeAnalyzer.test.ts
import * as path from 'path';
import { CodeAnalyzer } from '../../src/core/codeAnalyzer';

describe('CodeAnalyzer', () => {
  const fixturesPath = path.join(__dirname, '../fixtures/sample-project');
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer(fixturesPath);
  });

  it('should analyze workspace structure', async () => {
    const analysis = await analyzer.analyzeWorkspace();

    expect(analysis.rootPath).toBe(fixturesPath);
    expect(analysis.files.length).toBeGreaterThan(0);
    expect(analysis.dependencies).toBeDefined();
  });

  it('should identify TypeScript files', async () => {
    const files = await analyzer.findTypeScriptFiles();

    expect(files.length).toBeGreaterThan(0);
    files.forEach(file => {
      expect(file.path.endsWith('.ts') || file.path.endsWith('.tsx')).toBe(true);
    });
  });
});
```

### Testing Async Operations

**Async Test Pattern:**

```typescript
describe('Async Operations', () => {
  it('should handle async file operations', async () => {
    const result = await analyzer.readAndParseFile('/path/to/file.ts');
    expect(result).toBeDefined();
  });

  it('should handle errors in async operations', async () => {
    await expect(
      analyzer.readAndParseFile('/nonexistent/file.ts')
    ).rejects.toThrow('File not found');
  });

  it('should timeout long operations', async () => {
    jest.setTimeout(1000); // 1 second timeout

    await expect(
      analyzer.analyzeVeryLargeProject()
    ).rejects.toThrow('Timeout');
  });
});
```

## Test Categories

### 1. Success Cases

Test expected behavior with valid inputs:

```typescript
describe('Success Cases', () => {
  it('should generate plan with multiple steps', async () => {
    const plan = await generator.generatePlan('Build REST API');
    expect(plan.steps.length).toBeGreaterThanOrEqual(3);
  });

  it('should identify affected files correctly', async () => {
    const plan = await generator.generatePlan('Update user model');
    expect(plan.files.some(f => f.path.includes('user'))).toBe(true);
  });
});
```

### 2. Error Handling

Test error scenarios:

```typescript
describe('Error Handling', () => {
  it('should throw error for invalid workspace', async () => {
    const analyzer = new CodeAnalyzer('/invalid/path');
    await expect(analyzer.analyzeWorkspace()).rejects.toThrow();
  });

  it('should handle parse errors gracefully', async () => {
    await expect(parser.parseInvalidCode()).rejects.toThrow('Parse error');
  });
});
```

### 3. Edge Cases

Test boundary conditions:

```typescript
describe('Edge Cases', () => {
  it('should handle empty workspace', async () => {
    mockVscode.workspace.workspaceFolders = [];
    await expect(analyzer.analyzeWorkspace()).rejects.toThrow(
      'No workspace folder open'
    );
  });

  it('should handle very long task descriptions', async () => {
    const longDescription = 'A'.repeat(10000);
    const plan = await generator.generatePlan(longDescription);
    expect(plan).toBeDefined();
  });

  it('should handle special characters in file paths', async () => {
    const path = '/path/with spaces/and-special_chars.ts';
    const result = await analyzer.parseFile(path);
    expect(result).toBeDefined();
  });
});
```

## Test Data Management

### Using Test Fixtures

```typescript
// test/fixtures/sample-plans.json
{
  "simplePlan": {
    "title": "Add button component",
    "steps": [
      {
        "id": "1",
        "description": "Create Button.tsx",
        "reasoning": "Need new component file",
        "dependencies": [],
        "completed": false
      }
    ],
    "files": [
      {
        "path": "src/components/Button.tsx",
        "type": "create",
        "description": "Button component",
        "reasoning": "New feature requires new file"
      }
    ]
  }
}
```

### Test Data Helper

```typescript
// test/helpers/testData.ts
import { Plan, Step, FileChange } from '../../src/types';

export function createMockPlan(overrides?: Partial<Plan>): Plan {
  return {
    id: 'test-plan-1',
    title: 'Test Plan',
    description: 'Test plan description',
    steps: [],
    files: [],
    createdAt: new Date(),
    status: 'draft',
    ...overrides,
  };
}

export function createMockStep(overrides?: Partial<Step>): Step {
  return {
    id: 'test-step-1',
    description: 'Test step',
    reasoning: 'Test reasoning',
    dependencies: [],
    completed: false,
    ...overrides,
  };
}
```

## Best Practices

### ✅ Do

* Write tests before implementation (TDD)
* Use descriptive test names that explain behavior
* Test one thing per test case
* Use `beforeEach` and `afterEach` for setup/cleanup
* Mock external dependencies (VS Code API, file system)
* Test both success and error paths
* Use TypeScript for type safety in tests
* Keep tests fast and isolated
* Use fixtures for complex test data
* Clean up resources after tests

### ❌ Don't

* Don't test VS Code API implementation (it's already tested)
* Don't write tests that depend on other tests
* Don't use `setTimeout` for async tests (use `async/await`)
* Don't skip tests with `.skip` in committed code
* Don't use `.only` for focus in committed code
* Don't test implementation details, test behavior
* Don't write tests that touch real file system (use mocks)
* Don't ignore test failures

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- planGenerator.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="generatePlan"
```

### Test Configuration

**jest.config.js:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
```

## Coverage Goals

* **Lines**: Minimum 80%
* **Functions**: Minimum 80%
* **Branches**: Minimum 80%
* **Statements**: Minimum 80%

Focus on testing:
- Core business logic (plan generation, code analysis)
- Utility functions
- Error handling
- Edge cases

## Summary

**Key Points:**
- Write tests first (TDD)
- Mock VS Code API appropriately
- Use fixtures for test data
- Test success, error, and edge cases
- Keep tests fast and isolated
- Maintain high coverage on core logic
- Use TypeScript for type safety

This ensures reliable, maintainable extension code.

---
Source: .ruler/08_security_guidelines.md
---
# 🔐 Security Guidelines - Traycer VS Code Extension

This document outlines security best practices for VS Code extension development to ensure user safety and data protection.

---

## Core Security Principles

* **Least Privilege**: Request only necessary permissions
* **Input Validation**: Validate all user inputs and workspace data
* **Secure Communication**: Use HTTPS for external API calls
* **Data Protection**: Handle user code and data responsibly
* **Privacy by Design**: Respect user privacy and workspace confidentiality
* **Transparency**: Be clear about what data is accessed and how

---

## Extension Permissions

### Requested Permissions

**Be Minimal:**
- Only request permissions actually needed
- Avoid accessing file system outside workspace
- Don't request network access unless required
- Limit command contributions to necessary ones

**Example package.json:**
```json
{
  "contributes": {
    "commands": [
      {
        "command": "traycer.generatePlan",
        "title": "Traycer: Generate Development Plan"
      }
    ]
  },
  "activationEvents": [
    "onStartupFinished"
  ]
}
```

### Activation Events

* Use specific activation events, not `*` (eager activation)
* Prefer `onCommand`, `onView`, or `onStartupFinished`
* Document why each activation event is needed

---

## Input Validation & Sanitization

### User Input

**Always validate user input:**

```typescript
async function generatePlan(taskDescription: string): Promise<Plan> {
  // Validate input
  if (!taskDescription || typeof taskDescription !== 'string') {
    throw new Error('Invalid task description');
  }

  // Sanitize input
  const sanitized = taskDescription.trim();

  if (sanitized.length === 0) {
    throw new Error('Task description cannot be empty');
  }

  if (sanitized.length > 10000) {
    throw new Error('Task description too long (max 10000 characters)');
  }

  // Proceed with validated input
  return await this.processTask(sanitized);
}
```

### File Path Validation

**Validate all file paths:**

```typescript
import * as path from 'path';
import * as vscode from 'vscode';

function validateFilePath(filePath: string): boolean {
  // Ensure path is within workspace
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return false;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const absolutePath = path.resolve(filePath);

  // Check if path is within workspace
  if (!absolutePath.startsWith(workspaceRoot)) {
    throw new Error('File path outside workspace is not allowed');
  }

  // Prevent directory traversal attacks
  if (filePath.includes('..') || filePath.includes('~')) {
    throw new Error('Invalid file path');
  }

  return true;
}
```

---

## WebView Security

### Content Security Policy

**Always use strict CSP:**

```typescript
private getHtmlContent(webview: vscode.Webview): string {
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 style-src ${webview.cspSource} 'unsafe-inline';
                 script-src 'nonce-${nonce}';
                 img-src ${webview.cspSource} https:;
                 font-src ${webview.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Traycer Plan</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
```

### Message Validation

**Validate all messages from webview:**

```typescript
webviewView.webview.onDidReceiveMessage(
  message => {
    // Validate message structure
    if (!message || typeof message.type !== 'string') {
      console.error('Invalid message from webview');
      return;
    }

    // Validate message type
    const allowedTypes = ['stepCompleted', 'planUpdated', 'requestData'];
    if (!allowedTypes.includes(message.type)) {
      console.error('Unknown message type:', message.type);
      return;
    }

    // Validate message data
    if (message.data && typeof message.data !== 'object') {
      console.error('Invalid message data');
      return;
    }

    // Handle message
    switch (message.type) {
      case 'stepCompleted':
        this.handleStepCompleted(message.data);
        break;
      // ... other cases
    }
  },
  undefined,
  this.disposables
);
```

### Sanitize User Content

**Escape HTML in webview:**

```typescript
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayUserContent(content: string): string {
  return `<div>${escapeHtml(content)}</div>`;
}
```

---

## Data Handling

### Sensitive Data

**Never log sensitive information:**

```typescript
// ❌ DON'T DO THIS
console.log('User workspace:', workspacePath);
console.log('File content:', fileContent);
console.log('User credentials:', credentials);

// ✅ DO THIS
console.log('Workspace analysis complete');
console.log('File parsed successfully');
// Don't log credentials at all
```

### Workspace State

**Be careful with state storage:**

```typescript
// Use workspace state for non-sensitive data
context.workspaceState.update('currentPlan', planId);

// Use global state cautiously
context.globalState.update('extensionVersion', version);

// Never store sensitive data in state
// ❌ DON'T: context.globalState.update('apiKey', key);
```

### Temporary Files

**Clean up temporary files:**

```typescript
import * as fs from 'fs';
import * as path from 'path';

async function createTempFile(content: string): Promise<string> {
  const tempPath = path.join(os.tmpdir(), `traycer-${Date.now()}.tmp`);

  try {
    await fs.promises.writeFile(tempPath, content);
    return tempPath;
  } catch (error) {
    throw new Error(`Failed to create temp file: ${error.message}`);
  }
}

async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Failed to cleanup temp file:', error);
  }
}

// Use with try/finally
async function processWithTempFile() {
  const tempFile = await createTempFile('content');
  try {
    // Use temp file
  } finally {
    await cleanupTempFile(tempFile);
  }
}
```

---

## External Communications

### API Calls

**Use HTTPS only:**

```typescript
import * as https from 'https';

async function callExternalAPI(url: string, data: any): Promise<any> {
  // Ensure HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS URLs are allowed');
  }

  // Validate URL
  const parsedUrl = new URL(url);
  if (!isAllowedDomain(parsedUrl.hostname)) {
    throw new Error('Domain not allowed');
  }

  // Make request with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Traycer-VSCode-Extension/1.0.0',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function isAllowedDomain(hostname: string): boolean {
  const allowedDomains = [
    'api.traycer.ai',
    // Add other allowed domains
  ];
  return allowedDomains.includes(hostname);
}
```

---

## Error Handling

### User-Friendly Error Messages

**Don't expose internal details:**

```typescript
// ❌ DON'T: Expose internal errors
catch (error) {
  vscode.window.showErrorMessage(error.stack);
}

// ✅ DO: Show user-friendly messages
catch (error) {
  console.error('Internal error:', error); // Log for debugging
  vscode.window.showErrorMessage(
    'Failed to generate plan. Please try again.'
  );
}
```

### Error Logging

**Log errors securely:**

```typescript
function logError(error: Error, context: string): void {
  // Log error details for debugging
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    // Don't log sensitive data
  });

  // Optionally send telemetry (with user consent)
  if (hasUserConsent()) {
    sendErrorTelemetry({
      context,
      errorType: error.name,
      // Don't include stack traces or sensitive data
    });
  }
}
```

---

## Dependency Management

### Regular Updates

* Keep dependencies up to date
* Run `npm audit` regularly
* Review security advisories
* Use `npm audit fix` to auto-patch vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes (carefully)
npm audit fix --force
```

### Minimal Dependencies

* Only install necessary packages
* Review package before installing
* Check package reputation (downloads, maintainers, last updated)
* Avoid packages with known vulnerabilities

---

## Best Practices Checklist

### ✅ Do

* Validate all user inputs
* Use HTTPS for external calls
* Implement proper CSP for webviews
* Handle errors gracefully without exposing internals
* Clean up resources and temporary files
* Request minimal permissions
* Log errors securely (no sensitive data)
* Keep dependencies updated
* Use nonces for webview scripts
* Validate file paths stay within workspace
* Dispose resources properly
* Handle cancellation tokens

### ❌ Don't

* Don't trust user input without validation
* Don't log sensitive data (paths, content, credentials)
* Don't use eval() or Function() with user input
* Don't expose stack traces to users
* Don't store secrets in code or state
* Don't access files outside workspace without permission
* Don't use HTTP for external communications
* Don't ignore security warnings
* Don't ship with development/debug code enabled
* Don't use `*` activation event
* Don't ignore CSP in webviews

---

## Security Testing

### Manual Testing

* Test with malicious inputs
* Verify file path validation
* Check CSP enforcement
* Test error handling
* Verify no sensitive data in logs

### Automated Testing

```typescript
// test/security/inputValidation.test.ts
describe('Input Validation', () => {
  it('should reject empty task descriptions', async () => {
    await expect(generator.generatePlan('')).rejects.toThrow();
  });

  it('should reject overly long inputs', async () => {
    const longInput = 'A'.repeat(100000);
    await expect(generator.generatePlan(longInput)).rejects.toThrow();
  });

  it('should reject directory traversal attempts', async () => {
    await expect(analyzer.readFile('../../../etc/passwd')).rejects.toThrow();
  });

  it('should sanitize HTML content', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = escapeHtml(malicious);
    expect(sanitized).not.toContain('<script>');
  });
});
```

---

## Incident Response

### If Security Issue Found

1. **Don't panic** - assess the severity
2. **Document the issue** - what, when, how, impact
3. **Fix immediately** - patch the vulnerability
4. **Test thoroughly** - ensure fix works and doesn't break anything
5. **Release update** - publish new version ASAP
6. **Notify users** - if data compromised, notify affected users
7. **Learn** - document lessons learned

---

## Summary

**Key Points:**
- Validate all inputs and file paths
- Use strict CSP for webviews
- Never log sensitive data
- Handle errors securely
- Keep dependencies updated
- Request minimal permissions
- Use HTTPS for external calls
- Clean up resources properly

Security is everyone's responsibility. When in doubt, err on the side of caution.
