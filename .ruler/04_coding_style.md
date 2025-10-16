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
