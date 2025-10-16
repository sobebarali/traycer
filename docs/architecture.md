# Architecture

This document describes the architecture and design decisions for the Traycer VS Code extension.

## Overview

Traycer is built as a VS Code extension that provides an intelligent planning layer for development tasks. It analyzes codebases, generates structured plans, and helps developers maintain focus throughout implementation.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension Host                │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Commands   │  │   WebView    │  │  State Mgmt   │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│  ┌─────────────────────────┴──────────────────────────┐ │
│  │              Core Business Logic                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │ │
│  │  │     Plan     │  │     Code     │  │   Task   │ │ │
│  │  │  Generator   │  │   Analyzer   │  │  Parser  │ │ │
│  │  │   (AI/LLM)   │  │              │  │          │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                            │                             │
│  ┌─────────────────────────┴──────────────────────────┐ │
│  │              Utility Layer                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │ │
│  │  │   File       │  │     AST      │  │  Logger  │ │ │
│  │  │   System     │  │   Parser     │  │          │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │ │
│  │  ┌──────────────┐                                  │ │
│  │  │  AI/LLM      │                                  │ │
│  │  │  Client      │                                  │ │
│  │  └──────────────┘                                  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
       ┌─────────────────┐     ┌─────────────────┐
       │   Workspace     │     │   AI/LLM API    │
       │   File System   │     │   (Anthropic)   │
       └─────────────────┘     └─────────────────┘
```

## Component Architecture

### Extension Layer

**Responsibility**: VS Code integration and lifecycle management

- **extension.ts** - Entry point, command registration, activation/deactivation
- Registers commands with VS Code API
- Manages extension context and subscriptions
- Initializes core services

### Core Business Logic

#### 1. Plan Generator (AI-Powered)

**Purpose**: Generate structured development plans from task descriptions using AI/LLM

**Key Methods**:
- `generatePlan(taskDescription: string): Promise<Plan>`
- `analyzeDependencies(plan: Plan): Promise<void>`
- `formatPlan(plan: Plan): string`

**Responsibilities**:
- Parse task descriptions
- Build context from codebase analysis
- Use AI/LLM to generate intelligent plans
- Generate step-by-step instructions with reasoning
- Identify files to create/modify
- Provide detailed reasoning for decisions
- Ensure plans are actionable and specific

**AI Integration**:
- Uses Anthropic's Claude API for plan generation
- Provides codebase context to AI for intelligent decisions
- Structures AI output into Plan objects
- Validates AI-generated plans for completeness

#### 2. Code Analyzer

**Purpose**: Understand existing codebase structure and patterns

**Key Methods**:
- `analyzeWorkspace(): Promise<WorkspaceAnalysis>`
- `findRelevantFiles(task: TaskDescription): Promise<FileInfo[]>`
- `parseTypeScript(filePath: string): Promise<AST>`
- `extractPatterns(): Promise<CodePattern[]>`

**Responsibilities**:
- Scan workspace for files
- Parse TypeScript/JavaScript files
- Extract imports, exports, and dependencies
- Identify code patterns and conventions
- Build dependency graph

#### 3. Task Parser

**Purpose**: Parse and understand user task descriptions

**Key Methods**:
- `parseTaskDescription(description: string): Promise<TaskDescription>`
- `extractIntent(description: string): TaskIntent`
- `identifyScope(description: string): string[]`

**Responsibilities**:
- Extract task intent (feature, bugfix, refactor, etc.)
- Identify affected areas of codebase
- Validate task description
- Normalize input

#### 4. Plan Verifier

**Purpose**: Verify implementation matches the plan

**Key Methods**:
- `verifyPlan(plan: Plan): Promise<VerificationReport>`
- `compareFiles(expected: FileChange[], actual: FileChange[]): Promise<Diff[]>`
- `generateReport(diff: Diff[]): VerificationReport`

**Responsibilities**:
- Check if expected files were modified
- Compare changes against plan
- Identify deviations
- Generate verification report

### UI Layer

#### WebView Provider

**Purpose**: Display plans in interactive UI

**Components**:
- **PlanViewer** - Display plan with steps and files
- **StepList** - Interactive checklist
- **FileTree** - Visual file hierarchy
- **Progress** - Progress indicator

**Communication**:
- Extension → WebView: Send plan data via `postMessage`
- WebView → Extension: User actions (step completed, plan updated)

### Utility Layer

#### File System Utilities

**Purpose**: File operations abstraction

**Key Methods**:
- `readFile(path: string): Promise<string>`
- `writeFile(path: string, content: string): Promise<void>`
- `listFiles(directory: string): Promise<string[]>`
- `findFiles(pattern: string): Promise<string[]>`

#### AST Parser

**Purpose**: Parse and analyze TypeScript/JavaScript code

**Key Methods**:
- `parseSourceFile(content: string): Promise<SourceFile>`
- `findFunctions(ast: SourceFile): FunctionDeclaration[]`
- `findImports(ast: SourceFile): ImportDeclaration[]`
- `analyzeStructure(ast: SourceFile): CodeStructure`

#### Logger

**Purpose**: Centralized logging

**Key Methods**:
- `log(message: string, context?: object): void`
- `warn(message: string, context?: object): void`
- `error(message: string, error?: Error): void`

#### AI/LLM Client

**Purpose**: Interface with AI/LLM APIs for intelligent plan generation

**Key Methods**:
- `generatePlan(prompt: string, context: CodeContext): Promise<string>`
- `validateApiKey(): Promise<boolean>`
- `checkRateLimit(): Promise<boolean>`

**Responsibilities**:
- Manage API authentication and configuration
- Build prompts with codebase context
- Handle API calls to Anthropic Claude
- Parse and validate AI responses
- Handle rate limiting and errors
- Implement retry logic
- Cache responses when appropriate

## Data Flow

### Plan Generation Flow (AI-Powered)

```
User Input
    │
    ▼
Task Parser ──────────> Task Description
    │
    ▼
Code Analyzer ────────> Workspace Analysis
    │                   (files, patterns, dependencies)
    ▼
Context Builder ──────> Codebase Context
    │                   (relevant files, structure)
    ▼
AI/LLM Client ────────> AI Prompt with Context
    │
    ▼
Anthropic Claude API ─> AI-Generated Plan
    │
    ▼
Plan Generator ───────> Structured Plan Object
    │                   (parse & validate AI output)
    ▼
WebView ──────────────> User Review & Edit
    │
    ▼
Implementation
    │
    ▼
Plan Verifier ────────> Verification Report
```

### Command Execution Flow

```
1. User triggers command (Cmd+Shift+P → "Traycer: Generate Plan")
2. Extension calls command handler
3. Show input box for task description
4. Validate API key is configured
5. Pass to Task Parser (validates & normalizes input)
6. Code Analyzer scans workspace
7. Context Builder prepares codebase context for AI
8. AI/LLM Client sends prompt to Anthropic Claude API
9. Plan Generator parses and structures AI response
10. Validate generated plan for completeness
11. Store plan in workspace state (.traycer/plans/)
12. Show plan in WebView
13. User reviews and edits plan
14. User implements according to plan
15. Plan Verifier checks implementation
```

## Design Decisions

### 1. Layered Architecture

**Decision**: Separate concerns into distinct layers (extension, core, utilities)

**Rationale**:
- Clear separation of concerns
- Easier testing (mock VS Code API for core logic)
- Better maintainability
- Reusable components

### 2. TypeScript Throughout

**Decision**: Use TypeScript for all code, including tests

**Rationale**:
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Compile-time error detection

### 3. React for WebView

**Decision**: Use React for webview UI components

**Rationale**:
- Component-based architecture
- Rich ecosystem
- Familiar to many developers
- Good performance with virtual DOM

### 4. AST-Based Analysis

**Decision**: Use TypeScript Compiler API for code analysis

**Rationale**:
- Accurate parsing
- Access to type information
- Official TypeScript tool
- Battle-tested

### 5. Message-Based WebView Communication

**Decision**: Use VS Code's message passing API for webview communication

**Rationale**:
- Secure (no direct DOM access)
- Follows VS Code best practices
- Type-safe message contracts
- Event-driven architecture

### 6. AI/LLM Integration

**Decision**: Use Anthropic's Claude API for intelligent plan generation

**Rationale**:
- Natural language understanding for task descriptions
- Contextual awareness of codebase structure
- Reasoning capability for plan decisions
- High-quality, structured output
- Aligns with original Traycer.ai vision
- Reduces development drift through intelligent planning

**Implementation Approach**:
- User provides Anthropic API key via configuration
- Extension builds rich context from codebase analysis
- AI generates plans with reasoning and dependencies
- Plans are validated and structured before presentation
- Fallback to rule-based generation if API unavailable

## Folder Structure

See [.ruler/02_folder_structure.md](../.ruler/02_folder_structure.md) for detailed folder structure documentation.

```
traycer/
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── core/                  # Core business logic
│   │   ├── planGenerator.ts   # AI-powered plan generation
│   │   ├── codeAnalyzer.ts
│   │   ├── taskParser.ts
│   │   └── planVerifier.ts
│   ├── ai/                    # AI/LLM integration
│   │   ├── aiClient.ts        # Anthropic API client
│   │   ├── promptBuilder.ts   # Build prompts with context
│   │   └── responseParser.ts  # Parse AI responses
│   ├── ui/                    # UI components
│   │   ├── planView.ts
│   │   └── webview/
│   ├── utils/                 # Utilities
│   │   ├── fileSystem.ts
│   │   ├── ast.ts
│   │   └── logger.ts
│   └── types/                 # Type definitions
│       └── index.ts
├── test/                      # Tests
├── media/                     # Static assets
└── docs/                      # Documentation
```

## State Management

### Workspace State

Stores data specific to the current workspace:
- Current plan ID
- Plan history
- User preferences per workspace

**Access**:
```typescript
context.workspaceState.get<string>('currentPlanId');
context.workspaceState.update('currentPlanId', planId);
```

### Global State

Stores data across all workspaces:
- Extension version
- Global settings
- Usage telemetry (with consent)

**Access**:
```typescript
context.globalState.get<string>('extensionVersion');
context.globalState.update('extensionVersion', version);
```

### Plan Storage

Plans are stored as JSON files in workspace:
- `.traycer/plans/{planId}.json`
- Git-ignored by default
- Can be committed if desired

## Security Considerations

See [.ruler/08_security_guidelines.md](../.ruler/08_security_guidelines.md) for detailed security documentation.

**Key Points**:
- Validate all user inputs
- Restrict file access to workspace
- Use CSP for webviews
- Never log sensitive data
- HTTPS only for external calls
- Secure API key storage (VS Code SecretStorage)
- Never log or expose API keys
- Sanitize code context before sending to AI
- Respect user privacy - no telemetry without consent

## Performance Considerations

### File Scanning

- Use glob patterns to filter files
- Skip node_modules and large directories
- Cache analysis results
- Incremental analysis when possible

### AST Parsing

- Parse on-demand, not upfront
- Cache parsed ASTs
- Use worker threads for large files
- Timeout for very large files

### WebView

- Lazy load components
- Virtual scrolling for large lists
- Debounce user inputs
- Optimize re-renders

## Extension Points

### Future Extensibility

The architecture supports future extensions:

1. **Custom Plan Templates** - User-defined plan templates
2. **Multiple AI Providers** - Support OpenAI, Google, etc.
3. **Team Collaboration** - Share plans across team
4. **Git Integration** - Link plans to branches/PRs
5. **Analytics** - Track plan effectiveness
6. **Fine-tuned Models** - Custom-trained models for specific domains
7. **Offline Mode** - Fallback to rule-based generation

## Testing Strategy

See [.ruler/07_testing_guidelines.md](../.ruler/07_testing_guidelines.md) for detailed testing documentation.

**Layers**:
1. **Unit Tests** - Test core logic independently
2. **Integration Tests** - Test component interaction
3. **E2E Tests** - Test full workflows
4. **Manual Tests** - UI/UX testing

## Deployment

### Development

- F5 to launch Extension Development Host
- Hot reload on file changes
- Debug with breakpoints

### Production

- Package as VSIX: `npm run package`
- Publish to VS Code Marketplace
- Version with semantic versioning
- Changelog for each release

## Monitoring & Telemetry

**With User Consent**:
- Extension activation
- Command usage frequency
- Error rates
- Performance metrics

**Never Collected**:
- User code or file contents
- Project names or paths
- Personally identifiable information

## Conclusion

This architecture balances:
- **Simplicity** - Easy to understand and maintain
- **Extensibility** - Room for future features
- **Performance** - Efficient for large codebases
- **Security** - Follows VS Code best practices
- **Testability** - Comprehensive test coverage

For implementation details, see [Development Guide](development.md).
