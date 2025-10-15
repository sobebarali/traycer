# Types & Interfaces

This document describes all TypeScript types and interfaces used in Traycer.

## Table of Contents

- [Core Types](#core-types)
- [Analysis Types](#analysis-types)
- [Verification Types](#verification-types)
- [Utility Types](#utility-types)

---

## Core Types

### Plan

Represents a structured development plan.

```typescript
interface Plan {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  files: FileChange[];
  createdAt: Date;
  status: PlanStatus;
}
```

**Properties**:
- `id` - Unique identifier (UUID format)
- `title` - Short plan title (max 100 characters)
- `description` - Detailed plan description
- `steps` - Array of steps to implement
- `files` - Array of files to create/modify/delete
- `createdAt` - Plan creation timestamp
- `status` - Current plan status

**Example**:
```typescript
const plan: Plan = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Add user authentication',
  description: 'Implement JWT-based authentication for users',
  steps: [
    // ... steps
  ],
  files: [
    // ... file changes
  ],
  createdAt: new Date('2024-10-14T10:00:00Z'),
  status: 'in-progress'
};
```

---

### Step

Represents a single implementation step in a plan.

```typescript
interface Step {
  id: string;
  description: string;
  reasoning: string;
  dependencies: string[];
  completed: boolean;
}
```

**Properties**:
- `id` - Unique step identifier
- `description` - What needs to be done
- `reasoning` - Why this step is necessary
- `dependencies` - Array of step IDs that must be completed first
- `completed` - Whether step has been completed

**Example**:
```typescript
const step: Step = {
  id: 'step-1',
  description: 'Create authentication service',
  reasoning: 'Centralized service for handling all auth operations',
  dependencies: [],
  completed: false
};
```

---

### FileChange

Represents a change to a file.

```typescript
interface FileChange {
  path: string;
  type: FileChangeType;
  description: string;
  reasoning: string;
}
```

**Properties**:
- `path` - Relative file path from workspace root
- `type` - Type of change: 'create', 'modify', or 'delete'
- `description` - What changes to make
- `reasoning` - Why this change is needed

**Example**:
```typescript
const fileChange: FileChange = {
  path: 'src/auth/authService.ts',
  type: 'create',
  description: 'Authentication service with JWT support',
  reasoning: 'New service needed for centralized auth handling'
};
```

---

### PlanStatus

Status of a plan.

```typescript
type PlanStatus = 'draft' | 'in-progress' | 'completed';
```

**Values**:
- `draft` - Plan is being created/edited
- `in-progress` - Implementation has started
- `completed` - All steps are completed

**Example**:
```typescript
let status: PlanStatus = 'draft';
status = 'in-progress';  // Valid
status = 'invalid';      // TypeScript error
```

---

### FileChangeType

Type of file change.

```typescript
type FileChangeType = 'create' | 'modify' | 'delete';
```

**Values**:
- `create` - Create new file
- `modify` - Modify existing file
- `delete` - Delete file

---

## Analysis Types

### TaskDescription

Parsed representation of a user task.

```typescript
interface TaskDescription {
  title: string;
  description: string;
  intent: TaskIntent;
  scope: string[];
}
```

**Properties**:
- `title` - Short task title
- `description` - Full task description
- `intent` - Type of task (feature, bugfix, etc.)
- `scope` - Keywords identifying affected areas

**Example**:
```typescript
const task: TaskDescription = {
  title: 'Add user authentication',
  description: 'Add user authentication with JWT',
  intent: 'feature',
  scope: ['auth', 'user', 'jwt']
};
```

---

### TaskIntent

Type of task being performed.

```typescript
type TaskIntent =
  | 'feature'        // New functionality
  | 'bugfix'         // Fix existing bug
  | 'refactor'       // Code refactoring
  | 'documentation'  // Documentation update
  | 'test';          // Test addition/update
```

**Example**:
```typescript
const intent: TaskIntent = 'feature';

function getEmoji(intent: TaskIntent): string {
  switch (intent) {
    case 'feature': return '✨';
    case 'bugfix': return '🐛';
    case 'refactor': return '♻️';
    case 'documentation': return '📝';
    case 'test': return '🧪';
  }
}
```

---

### WorkspaceAnalysis

Complete analysis of a workspace.

```typescript
interface WorkspaceAnalysis {
  rootPath: string;
  files: FileInfo[];
  dependencies: Record<string, string[]>;
  patterns: CodePattern[];
}
```

**Properties**:
- `rootPath` - Absolute path to workspace root
- `files` - Array of all analyzed files
- `dependencies` - Import/dependency map
- `patterns` - Identified code patterns

**Example**:
```typescript
const analysis: WorkspaceAnalysis = {
  rootPath: '/Users/dev/myproject',
  files: [
    { path: 'src/index.ts', type: 'typescript', /* ... */ }
  ],
  dependencies: {
    'src/index.ts': ['./auth', './utils'],
    'src/auth/index.ts': ['jsonwebtoken', './user']
  },
  patterns: [
    { type: 'component', name: 'Button', location: 'src/components/Button.tsx' }
  ]
};
```

---

### FileInfo

Information about a single file.

```typescript
interface FileInfo {
  path: string;
  type: FileType;
  size: number;
  exports: string[];
  imports: string[];
}
```

**Properties**:
- `path` - Relative file path
- `type` - File type classification
- `size` - File size in bytes
- `exports` - Named exports from file
- `imports` - Import declarations in file

**Example**:
```typescript
const fileInfo: FileInfo = {
  path: 'src/auth/authService.ts',
  type: 'typescript',
  size: 1024,
  exports: ['AuthService', 'login', 'logout'],
  imports: ['jsonwebtoken', './user', './config']
};
```

---

### FileType

Classification of file types.

```typescript
type FileType =
  | 'typescript'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'other';
```

---

### CodePattern

Identified code pattern in the workspace.

```typescript
interface CodePattern {
  type: PatternType;
  name: string;
  location: string;
}
```

**Properties**:
- `type` - Type of pattern
- `name` - Pattern name/identifier
- `location` - File path where pattern is found

**Example**:
```typescript
const pattern: CodePattern = {
  type: 'component',
  name: 'UserProfile',
  location: 'src/components/UserProfile.tsx'
};
```

---

### PatternType

Types of code patterns that can be identified.

```typescript
type PatternType =
  | 'component'   // React/UI component
  | 'function'    // Utility function
  | 'class'       // Class definition
  | 'module';     // Module/namespace
```

---

## Verification Types

### VerificationReport

Report of plan verification results.

```typescript
interface VerificationReport {
  passed: boolean;
  filesCreated: string[];
  filesModified: string[];
  filesDeleted: string[];
  missingFiles: string[];
  unexpectedChanges: string[];
  summary: string;
}
```

**Properties**:
- `passed` - Whether verification passed
- `filesCreated` - Files that were created as planned
- `filesModified` - Files that were modified as planned
- `filesDeleted` - Files that were deleted as planned
- `missingFiles` - Files that should exist but don't
- `unexpectedChanges` - Files changed but not in plan
- `summary` - Human-readable summary

**Example**:
```typescript
const report: VerificationReport = {
  passed: true,
  filesCreated: ['src/auth/authService.ts', 'src/auth/types.ts'],
  filesModified: ['src/index.ts'],
  filesDeleted: [],
  missingFiles: [],
  unexpectedChanges: [],
  summary: '✓ All planned changes implemented correctly'
};
```

---

### Diff

Difference between expected and actual file changes.

```typescript
interface Diff {
  file: string;
  expected: FileChangeType;
  actual: FileChangeType | null;
  matches: boolean;
}
```

**Properties**:
- `file` - File path
- `expected` - Expected change type
- `actual` - Actual change type (null if file doesn't exist)
- `matches` - Whether expected matches actual

**Example**:
```typescript
const diff: Diff = {
  file: 'src/auth/authService.ts',
  expected: 'create',
  actual: 'create',
  matches: true
};
```

---

## Utility Types

### Result<T, E>

Generic result type for operations that can fail.

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

**Example**:
```typescript
function parseFile(path: string): Result<FileInfo> {
  try {
    const fileInfo = /* ... */;
    return { success: true, data: fileInfo };
  } catch (error) {
    return { success: false, error };
  }
}

// Usage
const result = parseFile('src/index.ts');
if (result.success) {
  console.log(result.data.exports);
} else {
  console.error(result.error.message);
}
```

---

### Optional<T>

Makes all properties of T optional.

```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

**Example**:
```typescript
function updatePlan(id: string, updates: Optional<Plan>): void {
  // Updates can include any subset of Plan properties
}

updatePlan('plan-1', { status: 'completed' });
updatePlan('plan-2', { title: 'New Title', description: 'New Description' });
```

---

### DeepReadonly<T>

Makes all properties of T recursively readonly.

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};
```

**Example**:
```typescript
const plan: DeepReadonly<Plan> = /* ... */;

plan.status = 'completed';           // Error: Cannot assign to readonly property
plan.steps[0].completed = true;      // Error: Cannot assign to readonly property
```

---

## Type Guards

### isPlan()

Type guard to check if a value is a Plan.

```typescript
function isPlan(value: unknown): value is Plan {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'steps' in value &&
    'files' in value &&
    'status' in value
  );
}
```

**Example**:
```typescript
const data = JSON.parse(jsonString);

if (isPlan(data)) {
  // TypeScript knows data is Plan
  console.log(data.steps.length);
}
```

---

### isFileChange()

Type guard to check if a value is a FileChange.

```typescript
function isFileChange(value: unknown): value is FileChange {
  return (
    typeof value === 'object' &&
    value !== null &&
    'path' in value &&
    'type' in value &&
    'description' in value
  );
}
```

---

## Enums vs Union Types

Traycer uses **union types** instead of enums for better type safety:

```typescript
// ✅ Preferred: Union types
type PlanStatus = 'draft' | 'in-progress' | 'completed';

// ❌ Avoid: Enums
enum PlanStatus {
  Draft = 'draft',
  InProgress = 'in-progress',
  Completed = 'completed'
}
```

**Advantages of union types**:
- More type-safe
- Better IDE autocomplete
- Smaller bundle size
- Simpler to use

---

## Common Patterns

### Creating New Plans

```typescript
import { v4 as uuidv4 } from 'uuid';

function createPlan(title: string, description: string): Plan {
  return {
    id: uuidv4(),
    title,
    description,
    steps: [],
    files: [],
    createdAt: new Date(),
    status: 'draft'
  };
}
```

---

### Updating Plans Immutably

```typescript
function completePlan(plan: Plan): Plan {
  return {
    ...plan,
    status: 'completed',
    steps: plan.steps.map(step => ({
      ...step,
      completed: true
    }))
  };
}
```

---

### Type-Safe Updates

```typescript
function updatePlanStatus(
  plan: Plan,
  status: PlanStatus
): Plan {
  return { ...plan, status };
}

// Type-safe
updatePlanStatus(plan, 'completed');

// TypeScript error
updatePlanStatus(plan, 'invalid');
```

---

## See Also

- [Core API](core.md) - Core module documentation
- [Architecture](../architecture.md) - System architecture
- [Development Guide](../development.md) - Development setup
