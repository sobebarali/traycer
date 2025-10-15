# 🎯 Coding Style Guidelines - Traycer VS Code Extension

This document defines coding style and best practices for VS Code extension development with TypeScript.

---

## Key Principles

* **Type Safety First**: Enable strict TypeScript checks. Avoid `any` and unsafe casts.
* **Consistency**: Code should look uniform across the project.
* **Readability**: Write for humans first, machines second.
* **Error Prevention**: Use linters and static analysis.
* **Performance**: Async operations, avoid blocking main thread.

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

* **Files**: `camelCase.ts` for regular files (e.g., `planGenerator.ts`).
* **Directories**: `camelCase` (e.g., `core/`, `utils/`).
* **Variables/Functions**: `camelCase` (e.g., `generatePlan`, `analyzeWorkspace`).
* **Classes**: `PascalCase` (e.g., `PlanGenerator`, `CodeAnalyzer`).
* **Interfaces**: `PascalCase` (e.g., `Plan`, `FileChange`).
* **Types**: `PascalCase` (e.g., `TaskIntent`).
* **Constants**: `UPPER_CASE` (e.g., `MAX_FILE_SIZE`).
* **Tests**: mirror source file names with `.test.ts` suffix (e.g., `planGenerator.test.ts`).
* **React Components**: `PascalCase` for both component and file (e.g., `PlanViewer.tsx`).

---

## Function & Parameter Patterns

* Use **object destructuring** for parameters (self-documenting).
* Keep functions pure unless side effects are necessary.
* Prefer **async/await** over `.then()` chains.
* Use **named exports** for utilities, **default exports** for classes.
* Use **TypeScript interfaces** for function parameters.

✅ Example:

```typescript
// src/core/planGenerator.ts
import * as vscode from 'vscode';
import { Plan, TaskDescription } from '../types';

export class PlanGenerator {
  async generatePlan(taskDescription: string): Promise<Plan> {
    try {
      // Implementation
      return {
        id: '',
        title: '',
        description: '',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft'
      };
    } catch (error) {
      throw new Error(`Failed to generate plan: ${error.message}`);
    }
  }
}
```

❌ **Avoid**:

```typescript
// Don't use any
function generatePlan(input: any): any { ... }

// Don't use synchronous operations
function readFileSync(path: string) { ... }

// Don't ignore errors
async function doSomething() {
  await operation(); // No try/catch
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

### WebView Best Practices

```typescript
// src/ui/planView.ts
import * as vscode from 'vscode';

export class PlanViewProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    // Enable scripts with security
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    // Handle messages
    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'action':
            this.handleAction(message.data);
            break;
        }
      },
      undefined,
      this.disposables
    );

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);
  }

  private getHtmlContent(webview: vscode.Webview): string {
    // Use nonce for security
    const nonce = getNonce();

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
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

### ✅ Do

* Use arrow functions consistently.
* Use `for…of` instead of `Array.forEach` for better performance.
* Use optional chaining (`?.`) for safe property access.
* Use `Date.now()` for timestamps.
* Use object spread instead of `Object.assign()`.
* Use async/await for asynchronous operations.
* Dispose resources properly (add to `context.subscriptions`).
* Handle cancellation tokens in long-running operations.

### ❌ Don't

* Don't use `var` (always `const` or `let`).
* Don't ignore linter errors.
* Don't commit commented-out code.
* Don't use synchronous operations on main thread.
* Don't reassign function parameters.
* Don't catch errors without handling or rethrowing.
* Don't use magic numbers or hardcoded strings → use constants.
* Don't hardcode paths → use `vscode.Uri` and workspace APIs.
* Don't block the extension host with heavy operations.

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

**Example Test:**

```typescript
// test/core/planGenerator.test.ts
import { PlanGenerator } from '../../src/core/planGenerator';

describe('PlanGenerator', () => {
  let generator: PlanGenerator;

  beforeEach(() => {
    generator = new PlanGenerator();
  });

  it('should generate plan from task description', async () => {
    const taskDescription = 'Add user authentication';
    const plan = await generator.generatePlan(taskDescription);

    expect(plan).toBeDefined();
    expect(plan.title).toBe('Add user authentication');
    expect(plan.steps.length).toBeGreaterThan(0);
  });

  it('should handle invalid input', async () => {
    await expect(generator.generatePlan('')).rejects.toThrow();
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

**Key Points:**
- Type safety with strict TypeScript
- Async/await for all VS Code API calls
- Proper resource disposal
- User-friendly error messages
- Test-driven development
- Clear documentation
- Performance-conscious code

This ensures maintainable, reliable VS Code extension development.
