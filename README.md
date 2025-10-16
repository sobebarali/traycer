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

### 1. AI-Powered Plan Generation
- User provides a task description (e.g., "Add user authentication")
- Extension analyzes the workspace and existing code
- Uses **Anthropic's Claude AI** to generate intelligent, context-aware plans
- Generates a detailed plan with:
  - Files to create/modify with clear reasoning
  - Step-by-step implementation tasks
  - Detailed reasoning for each decision
  - Dependencies and order of operations
  - Adaptation to existing codebase patterns

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

### 4. Codebase Intelligence (AI-Enhanced)
- Parse project structure and dependencies using AST analysis
- Identify relevant files and patterns
- Understand existing architecture
- **AI analyzes codebase context** to generate plans that:
  - Follow existing patterns and conventions
  - Respect project structure
  - Consider dependencies and side effects
  - Provide reasoning for architectural decisions

## Technical Stack

- **Language**: TypeScript
- **Platform**: VS Code Extension API
- **Runtime**: Node.js
- **AI/LLM**: Anthropic Claude API (for intelligent plan generation)
- **UI**: React (for webview panels)
- **Code Analysis**: TypeScript Compiler API, AST parsing
- **Testing**: Jest, VS Code Extension Test Runner

## Architecture

```
traycer-vscode/
├── src/
│   ├── extension.ts              # Entry point, command registration
│   ├── core/
│   │   ├── planGenerator.ts      # AI-powered plan generation
│   │   ├── codeAnalyzer.ts       # Workspace analysis
│   │   ├── taskParser.ts         # Parse user task descriptions
│   │   └── planVerifier.ts       # Verify implementation matches plan
│   ├── ai/
│   │   ├── aiClient.ts           # Anthropic API integration
│   │   ├── promptBuilder.ts      # Build AI prompts with context
│   │   └── responseParser.ts     # Parse AI responses
│   ├── ui/
│   │   ├── planView.ts           # WebView controller
│   │   └── components/           # React components for UI
│   ├── utils/
│   │   ├── fileSystem.ts         # File operations
│   │   ├── ast.ts                # AST parsing utilities
│   │   └── config.ts             # API key management
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── package.json                  # Extension manifest
├── tsconfig.json
└── README.md
```

## Development Approach

### Phase 1: Foundation & Setup ✅
- Set up VS Code extension boilerplate
- Configure TypeScript, ESLint, Prettier, Jest
- Create project structure

### Phase 2: Type System & Data Models ✅
- Define core types (Plan, Step, FileChange, etc.)
- Create type-safe interfaces

### Phase 3: Utility Layer ✅
- File system operations
- AST parsing utilities
- Logger implementation

### Phase 4: Analysis & Parsing ✅
- Task parsing with intent detection
- Workspace analysis with code patterns
- Dependency graph building

### Phase 5: AI-Powered Plan Generation (NEXT - CRITICAL)
- Anthropic Claude API integration
- Prompt building with codebase context
- AI response parsing and validation
- Secure API key management

### Phase 6: Extension Integration
- Command registration
- VS Code extension activation
- State management

### Phase 7: WebView UI
- React-based plan viewer
- Interactive checklist
- Plan editing capabilities

### Phase 8-12: Polish, Testing, Documentation, Release
- Plan verification
- Comprehensive testing
- Documentation
- VS Code Marketplace packaging

## How It Demonstrates Traycer's Vision

This implementation captures Traycer's core philosophy:

1. **AI-Powered Planning**: Uses Claude AI to convert unstructured ideas into detailed, actionable specs
2. **Context Awareness**: Analyzes existing code and provides it to AI for intelligent, context-aware decisions
3. **Drift Prevention**: Maintains focus on the original plan throughout implementation with reasoning for each step
4. **Agent Agnostic**: Generated plans can be executed by any developer or AI coding agent
5. **Verification**: Ensures implementation matches the planned intent
6. **Reasoning-First**: Every decision includes clear reasoning, preventing hallucinations and misunderstandings

## Prerequisites

To use this extension, you'll need:

1. **VS Code** version 1.85.0 or higher
2. **Anthropic API Key** - Get one from [Anthropic Console](https://console.anthropic.com/)
   - Sign up for Anthropic account
   - Generate API key
   - Configure in extension settings on first use

## Setup

1. Install the extension (via VSIX or Marketplace)
2. On first use, you'll be prompted to enter your Anthropic API key
3. API key is securely stored in VS Code's SecretStorage
4. Start generating plans!

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
No newline at end of file
