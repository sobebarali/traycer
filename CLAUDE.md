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

### Plan Generation System

```
src/core/
├── planGenerator.ts          # Main plan generation logic
│   ├── generatePlan()       # Create plan from task description
│   ├── analyzeDependencies() # Identify file dependencies
│   └── formatPlan()         # Format plan for display
├── codeAnalyzer.ts          # Workspace analysis
│   ├── analyzeWorkspace()   # Parse project structure
│   ├── findRelevantFiles()  # Find files related to task
│   ├── parseTypeScript()    # Parse TS/JS files
│   └── extractPatterns()    # Identify code patterns
├── taskParser.ts            # Task description parsing
│   ├── parseTaskDescription() # Parse user input
│   ├── extractIntent()      # Understand user intent
│   └── identifyScope()      # Determine task scope
└── planVerifier.ts          # Implementation verification
    ├── verifyPlan()         # Check if plan matches implementation
    ├── compareFiles()       # Compare expected vs actual changes
    └── generateReport()     # Create verification report
```

### Example Plan Generator Structure

```typescript
// src/core/planGenerator.ts
import * as vscode from 'vscode';
import { CodeAnalyzer } from './codeAnalyzer';
import { TaskParser } from './taskParser';
import { Plan, TaskDescription } from '../types';

export class PlanGenerator {
  constructor(
    private analyzer: CodeAnalyzer,
    private parser: TaskParser
  ) {}

  async generatePlan(taskDescription: string): Promise<Plan> {
    // Parse task
    const task: TaskDescription = await this.parser.parseTaskDescription(taskDescription);

    // Analyze workspace
    const workspace = await this.analyzer.analyzeWorkspace();

    // Generate plan
    return {
      title: task.title,
      steps: [], // Generated steps
      files: [], // Files to modify/create
      reasoning: '', // Explanation
    };
  }
}
```

---

## UI Structure (`src/ui/`)

### WebView Organization

```
src/ui/
├── planView.ts              # WebView controller (VS Code side)
│   ├── PlanViewProvider     # WebView provider class
│   ├── createWebView()      # Create webview instance
│   ├── updateContent()      # Update webview content
│   └── handleMessages()     # Handle messages from webview
└── webview/                 # React components (browser side)
    ├── App.tsx              # Main React app
    ├── components/
    │   ├── PlanViewer.tsx   # Display plan with steps
    │   ├── FileTree.tsx     # Show affected files
    │   ├── StepList.tsx     # Checklist of steps
    │   └── Progress.tsx     # Progress indicator
    ├── hooks/
    │   └── usePlan.ts       # Custom React hooks
    ├── styles/
    │   └── app.css          # Component styles
    └── index.tsx            # Entry point
```

### Example WebView Provider

```typescript
// src/ui/planView.ts
import * as vscode from 'vscode';
import { Plan } from '../types';

export class PlanViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'traycer.planView';

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(message => {
      switch (message.type) {
        case 'stepCompleted':
          this.handleStepCompleted(message.data);
          break;
      }
    });
  }

  updatePlan(plan: Plan) {
    // Send plan to webview
  }
}
```

---

## Utilities Structure (`src/utils/`)

```
src/utils/
├── fileSystem.ts            # File operations
│   ├── readFile()
│   ├── writeFile()
│   ├── listFiles()
│   └── findFiles()
├── ast.ts                   # AST parsing
│   ├── parseSourceFile()
│   ├── findFunctions()
│   ├── findImports()
│   └── analyzeStructure()
└── logger.ts                # Logging
    ├── log()
    ├── warn()
    └── error()
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

## Best Practices

- **Feature-based grouping**: Group related files together
- **Consistent naming**: Use camelCase for files, PascalCase for classes
- **Export patterns**: Use named exports for utilities, default for classes
- **Type safety**: Define interfaces for all data structures
- **Async operations**: Use async/await for VS Code API calls
- **Error handling**: Proper try/catch with user-friendly messages
- **Testing**: Unit tests for core logic, integration tests for extension
- **Documentation**: JSDoc comments for public APIs

This structure provides excellent developer experience with full type safety for VS Code extension development.

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
3. ✅ Did I add/modify commands? → Update `package.json` contributions
4. ✅ Did I add new types? → Export from `src/types/index.ts`
5. ✅ Did I add webview UI? → Implement proper message handling
6. ✅ Did post-task commands (typecheck, lint, format) pass?
7. ✅ Did I add JSDoc comments for public APIs?
8. ✅ Did I update README for major features?
9. ✅ Did I follow VS Code extension best practices?

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

3. **Document thoroughly**
   ```
   ✅ JSDoc for all public APIs
   ✅ Update README for major features
   ✅ Export and document types
   ```

4. **Follow VS Code best practices**
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
4. ✍️ **Implement** → Write code to make tests pass
5. 📝 **Document** → Add JSDoc and update README
6. ✅ **Verify** → Run typecheck, lint, format (user runs tests)

**Key principles:**
- Read before write
- Test-driven development (write tests first)
- Implement to make tests pass
- Document public APIs
- Follow VS Code extension best practices
- User runs tests manually

---
Source: .ruler/04_coding_style.md
---
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
