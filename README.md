# Traycer - Simplified Planning Layer for Development

A VS Code extension that acts as an intelligent planning layer between developers and code implementation, inspired by [Traycer AI](https://traycer.ai).

## What is Traycer?

Traycer AI solves a critical problem in AI-assisted development: **agents drift**. AI coding agents can hallucinate APIs, misread intent, and break existing code because they lack structured planning. Traycer acts as a spec-driven development platform that transforms vague ideas into precise, executable plans before any code is written.

## Our Goal

Build a simplified version of Traycer as a **VS Code extension** that captures the core "planning layer" concept:

- Transform task descriptions into structured, actionable development plans
- Analyze existing codebase to understand project structure
- Generate file-level specifications with clear reasoning
- Track implementation progress
- Reduce development drift by maintaining focus on the original plan

## Core Features

### 1. Plan Generation
- User provides a task description (e.g., "Add user authentication")
- Extension analyzes the workspace and existing code
- Generates a detailed plan with:
  - Files to create/modify
  - Step-by-step implementation tasks
  - Reasoning for each decision
  - Dependencies and order of operations

### 2. Interactive Plan Viewer
- Display plans in a custom VS Code webview panel
- Review and edit plans before implementation
- Visual file tree showing affected files
- Markdown-formatted plan with code snippets

### 3. Implementation Tracking
- Checklist interface for tracking progress
- Mark steps as complete
- Verify files were modified as planned
- Highlight deviations from the plan

### 4. Codebase Intelligence
- Parse project structure and dependencies
- Identify relevant files and patterns
- Understand existing architecture
- Suggest consistent implementation approaches

## Technical Stack

- **Language**: TypeScript
- **Platform**: VS Code Extension API
- **Runtime**: Node.js
- **UI**: React (for webview panels)
- **Code Analysis**: TypeScript Compiler API, AST parsing
- **Testing**: Jest, VS Code Extension Test Runner

## Architecture

```
traycer-vscode/
├── src/
│   ├── extension.ts              # Entry point, command registration
│   ├── core/
│   │   ├── planGenerator.ts      # Core planning logic
│   │   ├── codeAnalyzer.ts       # Workspace analysis
│   │   ├── taskParser.ts         # Parse user task descriptions
│   │   └── planVerifier.ts       # Verify implementation matches plan
│   ├── ui/
│   │   ├── planView.ts           # WebView controller
│   │   └── components/           # React components for UI
│   ├── utils/
│   │   ├── fileSystem.ts         # File operations
│   │   └── ast.ts                # AST parsing utilities
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── package.json                  # Extension manifest
├── tsconfig.json
└── README.md
```

## Development Approach

### Phase 1: Foundation
- Set up VS Code extension boilerplate
- Implement basic command to trigger plan generation
- Create simple plan data structure

### Phase 2: Code Analysis
- Build workspace analyzer
- Parse TypeScript/JavaScript files
- Identify project patterns and structure

### Phase 3: Plan Generation
- Implement task parsing logic
- Generate structured plans based on codebase analysis
- Add reasoning and dependencies

### Phase 4: UI & Visualization
- Create webview panel for plan display
- Build interactive checklist interface
- Add plan editing capabilities

### Phase 5: Verification & Polish
- Implement basic plan verification
- Add progress tracking
- Refine UX and error handling

## How It Demonstrates Traycer's Vision

This implementation captures Traycer's core philosophy:

1. **Structured Planning**: Converts unstructured ideas into actionable specs
2. **Context Awareness**: Analyzes existing code to make informed decisions
3. **Drift Prevention**: Maintains focus on the original plan throughout implementation
4. **Agent Agnostic**: Plan can be executed by any developer or AI agent
5. **Verification**: Ensures implementation matches intent

---

## Original Assignment

**Backend Developer - Traycer AI | Weekday**

At Traycer AI (https://traycer.ai), we care about whether candidates understand our vision and can think like builders.

**Your task:**
1. First, take time to understand what Traycer does. (Traycer acts as a planning layer on top of other coding agents.) using their docs (https://docs.traycer.ai)
2. Reverse engineer the concept and build a simplified version of Traycer that captures the same core idea.

**How you can build it:**
1. It can be a VS Code extension, a JetBrains plugin, a command-line tool (CLI), or a web app.
2. Choose the form you're most comfortable with.

**Tech requirements:**
1. Your project must be written in TypeScript.
2. You may use Node.js, React, or any other libraries/frameworks.
3. Write clean, structured, and readable code.

**We'll check for:**
- Does it work and show the "planning layer" idea?
- Is the code clean and well-organized?
- How creative is your solution?
- How easy is it to use?

This is not a feature request for our product. We don't expect you to build Traycer itself. Instead, we want to see how you would recreate and simplify the idea behind it, to show us you understand our vision.