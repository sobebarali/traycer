# Core Modules API

This document describes the API for core business logic modules in Traycer.

## Table of Contents

- [PlanGenerator](#plangenerator)
- [CodeAnalyzer](#codeanalyzer)
- [TaskParser](#taskparser)
- [PlanVerifier](#planverifier)

---

## PlanGenerator

**Module**: `src/core/planGenerator.ts`

The PlanGenerator is responsible for creating structured development plans from task descriptions.

### Class: PlanGenerator

#### Constructor

```typescript
constructor(
  analyzer: CodeAnalyzer,
  parser: TaskParser
)
```

**Parameters**:
- `analyzer` - CodeAnalyzer instance for workspace analysis
- `parser` - TaskParser instance for parsing task descriptions

**Example**:
```typescript
const analyzer = new CodeAnalyzer();
const parser = new TaskParser();
const generator = new PlanGenerator(analyzer, parser);
```

#### Methods

##### generatePlan()

Generates a structured development plan from a task description.

```typescript
async generatePlan(taskDescription: string): Promise<Plan>
```

**Parameters**:
- `taskDescription` - Natural language description of the task (1-10,000 characters)

**Returns**: `Promise<Plan>` - A structured plan with steps, files, and reasoning

**Throws**:
- `Error` - If task description is empty or invalid
- `Error` - If workspace cannot be analyzed

**Example**:
```typescript
const plan = await generator.generatePlan('Add user authentication');

console.log(plan.title);  // "Add user authentication"
console.log(plan.steps.length);  // 5
console.log(plan.files.length);  // 3
```

##### analyzeDependencies()

Analyzes and updates file dependencies in a plan.

```typescript
async analyzeDependencies(plan: Plan): Promise<void>
```

**Parameters**:
- `plan` - The plan to analyze

**Returns**: `Promise<void>` - Updates the plan in-place

**Example**:
```typescript
const plan = await generator.generatePlan('Refactor user service');
await generator.analyzeDependencies(plan);

// Plan steps now include dependency information
plan.steps.forEach(step => {
  console.log(step.dependencies);
});
```

##### formatPlan()

Formats a plan as a markdown string for display.

```typescript
formatPlan(plan: Plan): string
```

**Parameters**:
- `plan` - The plan to format

**Returns**: `string` - Markdown-formatted plan

**Example**:
```typescript
const plan = await generator.generatePlan('Add logging');
const markdown = generator.formatPlan(plan);

console.log(markdown);
// # Add logging
//
// ## Steps
// 1. Create logger utility
// ...
```

---

## CodeAnalyzer

**Module**: `src/core/codeAnalyzer.ts`

The CodeAnalyzer examines workspace structure and extracts code patterns and dependencies.

### Class: CodeAnalyzer

#### Constructor

```typescript
constructor(workspaceRoot?: string)
```

**Parameters**:
- `workspaceRoot` (optional) - Path to workspace root. Defaults to current VS Code workspace.

**Example**:
```typescript
// Use current workspace
const analyzer = new CodeAnalyzer();

// Use specific path
const analyzer = new CodeAnalyzer('/path/to/project');
```

#### Methods

##### analyzeWorkspace()

Analyzes the entire workspace structure.

```typescript
async analyzeWorkspace(): Promise<WorkspaceAnalysis>
```

**Returns**: `Promise<WorkspaceAnalysis>` - Complete workspace analysis

**Throws**:
- `Error` - If no workspace is open
- `Error` - If workspace cannot be read

**Example**:
```typescript
const analysis = await analyzer.analyzeWorkspace();

console.log(analysis.rootPath);           // "/path/to/project"
console.log(analysis.files.length);       // 150
console.log(analysis.dependencies);       // { "src/index.ts": ["./utils", ...] }
console.log(analysis.patterns.length);    // 25
```

##### findRelevantFiles()

Finds files relevant to a specific task.

```typescript
async findRelevantFiles(task: TaskDescription): Promise<FileInfo[]>
```

**Parameters**:
- `task` - Parsed task description

**Returns**: `Promise<FileInfo[]>` - Array of relevant files

**Example**:
```typescript
const task = await parser.parseTaskDescription('Fix user login bug');
const files = await analyzer.findRelevantFiles(task);

files.forEach(file => {
  console.log(file.path);     // "src/auth/login.ts"
  console.log(file.type);     // "typescript"
  console.log(file.exports);  // ["login", "logout"]
});
```

##### parseTypeScript()

Parses a TypeScript/JavaScript file into an AST.

```typescript
async parseTypeScript(filePath: string): Promise<SourceFile>
```

**Parameters**:
- `filePath` - Absolute path to TypeScript/JavaScript file

**Returns**: `Promise<SourceFile>` - TypeScript AST

**Throws**:
- `Error` - If file cannot be read
- `Error` - If file cannot be parsed

**Example**:
```typescript
const ast = await analyzer.parseTypeScript('/path/to/file.ts');

// Access AST nodes
ast.statements.forEach(statement => {
  console.log(statement.kind);
});
```

##### extractPatterns()

Extracts common code patterns from the workspace.

```typescript
async extractPatterns(): Promise<CodePattern[]>
```

**Returns**: `Promise<CodePattern[]>` - Array of identified patterns

**Example**:
```typescript
const patterns = await analyzer.extractPatterns();

patterns.forEach(pattern => {
  console.log(pattern.type);      // "component"
  console.log(pattern.name);      // "Button"
  console.log(pattern.location);  // "src/components/Button.tsx"
});
```

---

## TaskParser

**Module**: `src/core/taskParser.ts`

The TaskParser understands and normalizes user task descriptions.

### Class: TaskParser

#### Constructor

```typescript
constructor()
```

**Example**:
```typescript
const parser = new TaskParser();
```

#### Methods

##### parseTaskDescription()

Parses a natural language task description.

```typescript
async parseTaskDescription(description: string): Promise<TaskDescription>
```

**Parameters**:
- `description` - Natural language task description

**Returns**: `Promise<TaskDescription>` - Parsed and normalized task

**Throws**:
- `Error` - If description is empty or too long

**Example**:
```typescript
const task = await parser.parseTaskDescription('Add user authentication');

console.log(task.title);        // "Add user authentication"
console.log(task.description);  // "Add user authentication"
console.log(task.intent);       // "feature"
console.log(task.scope);        // ["auth", "user"]
```

##### extractIntent()

Extracts the intent from a task description.

```typescript
extractIntent(description: string): TaskIntent
```

**Parameters**:
- `description` - Task description

**Returns**: `TaskIntent` - One of: 'feature', 'bugfix', 'refactor', 'documentation', 'test'

**Example**:
```typescript
const intent1 = parser.extractIntent('Add user login');
console.log(intent1);  // "feature"

const intent2 = parser.extractIntent('Fix broken button');
console.log(intent2);  // "bugfix"

const intent3 = parser.extractIntent('Refactor user service');
console.log(intent3);  // "refactor"
```

##### identifyScope()

Identifies the scope/affected areas of a task.

```typescript
identifyScope(description: string): string[]
```

**Parameters**:
- `description` - Task description

**Returns**: `string[]` - Array of scope keywords

**Example**:
```typescript
const scope = parser.identifyScope('Update user profile page');
console.log(scope);  // ["user", "profile", "page"]
```

---

## PlanVerifier

**Module**: `src/core/planVerifier.ts`

The PlanVerifier checks if implementation matches the original plan.

### Class: PlanVerifier

#### Constructor

```typescript
constructor(analyzer: CodeAnalyzer)
```

**Parameters**:
- `analyzer` - CodeAnalyzer instance for file analysis

**Example**:
```typescript
const analyzer = new CodeAnalyzer();
const verifier = new PlanVerifier(analyzer);
```

#### Methods

##### verifyPlan()

Verifies that implementation matches the plan.

```typescript
async verifyPlan(plan: Plan): Promise<VerificationReport>
```

**Parameters**:
- `plan` - The plan to verify against

**Returns**: `Promise<VerificationReport>` - Verification results

**Example**:
```typescript
const report = await verifier.verifyPlan(plan);

console.log(report.passed);              // true
console.log(report.filesCreated);        // ["src/auth/login.ts"]
console.log(report.filesModified);       // ["src/index.ts"]
console.log(report.missingFiles);        // []
console.log(report.unexpectedChanges);   // []
```

##### compareFiles()

Compares expected file changes with actual changes.

```typescript
async compareFiles(
  expected: FileChange[],
  actual: FileChange[]
): Promise<Diff[]>
```

**Parameters**:
- `expected` - Expected file changes from plan
- `actual` - Actual file changes made

**Returns**: `Promise<Diff[]>` - Array of differences

**Example**:
```typescript
const expected = plan.files;
const actual = await getActualChanges();
const diffs = await verifier.compareFiles(expected, actual);

diffs.forEach(diff => {
  console.log(diff.file);        // "src/auth/login.ts"
  console.log(diff.expected);    // "create"
  console.log(diff.actual);      // "created"
  console.log(diff.matches);     // true
});
```

##### generateReport()

Generates a human-readable verification report.

```typescript
generateReport(diffs: Diff[]): VerificationReport
```

**Parameters**:
- `diffs` - Array of file differences

**Returns**: `VerificationReport` - Formatted report

**Example**:
```typescript
const diffs = await verifier.compareFiles(expected, actual);
const report = verifier.generateReport(diffs);

console.log(report.summary);
// "✓ 3 files created as planned
//  ✓ 2 files modified as planned
//  ✗ 1 file not found: src/utils/helper.ts"
```

---

## Error Handling

All methods follow consistent error handling:

### Common Errors

**ValidationError**:
```typescript
try {
  await generator.generatePlan('');
} catch (error) {
  console.error(error.message);  // "Task description cannot be empty"
}
```

**FileSystemError**:
```typescript
try {
  await analyzer.parseTypeScript('/nonexistent/file.ts');
} catch (error) {
  console.error(error.message);  // "File not found: /nonexistent/file.ts"
}
```

**ParseError**:
```typescript
try {
  await analyzer.parseTypeScript('/path/to/invalid.ts');
} catch (error) {
  console.error(error.message);  // "Failed to parse file: /path/to/invalid.ts"
}
```

### Best Practices

1. **Always handle errors**:
   ```typescript
   try {
     const plan = await generator.generatePlan(description);
   } catch (error) {
     vscode.window.showErrorMessage(`Failed to generate plan: ${error.message}`);
   }
   ```

2. **Validate inputs**:
   ```typescript
   if (!taskDescription?.trim()) {
     throw new Error('Task description is required');
   }
   ```

3. **Provide context**:
   ```typescript
   throw new Error(`Failed to analyze file ${filePath}: ${error.message}`);
   ```

---

## Usage Examples

### Complete Workflow

```typescript
import { PlanGenerator } from './core/planGenerator';
import { CodeAnalyzer } from './core/codeAnalyzer';
import { TaskParser } from './core/taskParser';
import { PlanVerifier } from './core/planVerifier';

// Initialize
const analyzer = new CodeAnalyzer();
const parser = new TaskParser();
const generator = new PlanGenerator(analyzer, parser);
const verifier = new PlanVerifier(analyzer);

// Generate plan
const plan = await generator.generatePlan('Add user authentication');

// Analyze dependencies
await generator.analyzeDependencies(plan);

// Display plan
const markdown = generator.formatPlan(plan);
console.log(markdown);

// User implements...

// Verify implementation
const report = await verifier.verifyPlan(plan);
if (report.passed) {
  console.log('✓ Implementation matches plan!');
} else {
  console.log('✗ Deviations found:');
  console.log(report.summary);
}
```

### Quick Plan Generation

```typescript
// Minimal example
const generator = new PlanGenerator(
  new CodeAnalyzer(),
  new TaskParser()
);

const plan = await generator.generatePlan('Fix login bug');
console.log(`Created plan with ${plan.steps.length} steps`);
```

---

## Type Definitions

For complete type definitions, see [types.md](types.md).

## See Also

- [Types & Interfaces](types.md) - Complete type definitions
- [Architecture](../architecture.md) - System architecture
- [Development Guide](../development.md) - Development setup
