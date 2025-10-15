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
