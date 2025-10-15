# Phase 2: Type System & Data Models

**Status**: ✅ COMPLETED
**Priority**: HIGH
**Dependencies**: Phase 1
**Progress**: 100%

---

## Overview

Define all TypeScript interfaces and types for the extension. This phase establishes the data structures that will be used throughout the application.

---

## Goals

- [x] Define core types (Plan, Step, FileChange)
- [x] Create analysis types (TaskDescription, WorkspaceAnalysis)
- [x] Add verification types (VerificationReport, Diff)
- [x] Implement utility types and type guards
- [x] Achieve 100% type safety

---

## Tasks

### 2.1 Create Core Types
**Priority**: HIGH | **Dependencies**: None

**Files to Create**:
- `src/types/index.ts`
- `test/types/index.test.ts`

**Checklist**:
- [ ] Define `Plan` interface
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

- [ ] Define `Step` interface
  ```typescript
  interface Step {
    id: string;
    description: string;
    reasoning: string;
    dependencies: string[];
    completed: boolean;
  }
  ```

- [ ] Define `FileChange` interface
  ```typescript
  interface FileChange {
    path: string;
    type: FileChangeType;
    description: string;
    reasoning: string;
  }
  ```

- [ ] Define `PlanStatus` type
  ```typescript
  type PlanStatus = 'draft' | 'in-progress' | 'completed';
  ```

- [ ] Define `FileChangeType` type
  ```typescript
  type FileChangeType = 'create' | 'modify' | 'delete';
  ```

**Tests to Write**:
- [ ] Test type validation
- [ ] Test type guards for core types
- [ ] Test invalid type assignments (compile-time)

---

### 2.2 Create Analysis Types
**Priority**: HIGH | **Dependencies**: 2.1

**Files to Update**:
- `src/types/index.ts`
- `test/types/analysis.test.ts`

**Checklist**:
- [ ] Define `TaskDescription` interface
  ```typescript
  interface TaskDescription {
    title: string;
    description: string;
    intent: TaskIntent;
    scope: string[];
  }
  ```

- [ ] Define `TaskIntent` type
  ```typescript
  type TaskIntent =
    | 'feature'
    | 'bugfix'
    | 'refactor'
    | 'documentation'
    | 'test';
  ```

- [ ] Define `WorkspaceAnalysis` interface
  ```typescript
  interface WorkspaceAnalysis {
    rootPath: string;
    files: FileInfo[];
    dependencies: Record<string, string[]>;
    patterns: CodePattern[];
  }
  ```

- [ ] Define `FileInfo` interface
  ```typescript
  interface FileInfo {
    path: string;
    type: FileType;
    size: number;
    exports: string[];
    imports: string[];
  }
  ```

- [ ] Define `FileType` type
  ```typescript
  type FileType =
    | 'typescript'
    | 'javascript'
    | 'json'
    | 'markdown'
    | 'other';
  ```

- [ ] Define `CodePattern` interface
  ```typescript
  interface CodePattern {
    type: PatternType;
    name: string;
    location: string;
  }
  ```

- [ ] Define `PatternType` type
  ```typescript
  type PatternType =
    | 'component'
    | 'function'
    | 'class'
    | 'module';
  ```

**Tests to Write**:
- [ ] Test TaskDescription validation
- [ ] Test WorkspaceAnalysis structure
- [ ] Test FileInfo validation
- [ ] Test type guards

---

### 2.3 Create Verification Types
**Priority**: HIGH | **Dependencies**: 2.1, 2.2

**Files to Update**:
- `src/types/index.ts`
- `test/types/verification.test.ts`

**Checklist**:
- [ ] Define `VerificationReport` interface
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

- [ ] Define `Diff` interface
  ```typescript
  interface Diff {
    file: string;
    expected: FileChangeType;
    actual: FileChangeType | null;
    matches: boolean;
  }
  ```

**Tests to Write**:
- [ ] Test VerificationReport structure
- [ ] Test Diff validation
- [ ] Test type guards

---

### 2.4 Create Utility Types
**Priority**: MEDIUM | **Dependencies**: 2.1, 2.2, 2.3

**Files to Update**:
- `src/types/index.ts`
- `test/types/utilities.test.ts`

**Checklist**:
- [ ] Define `Result<T, E>` type
  ```typescript
  type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };
  ```

- [ ] Define `Optional<T>` type
  ```typescript
  type Optional<T> = {
    [P in keyof T]?: T[P];
  };
  ```

- [ ] Define `DeepReadonly<T>` type
  ```typescript
  type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P];
  };
  ```

- [ ] Create `isPlan()` type guard
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

- [ ] Create `isFileChange()` type guard
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

- [ ] Create `isTaskDescription()` type guard
- [ ] Create `isWorkspaceAnalysis()` type guard

**Tests to Write**:
- [ ] Test Result type usage
- [ ] Test Optional type usage
- [ ] Test DeepReadonly type usage
- [ ] Test all type guards with valid data
- [ ] Test all type guards with invalid data

---

## TDD Workflow

For each subtask:

1. **Write Tests First**
   ```bash
   # Create test file
   touch test/types/[module].test.ts

   # Write test cases
   # - Valid type assignments
   # - Invalid type assignments (should fail compilation)
   # - Type guard tests
   ```

2. **Implement Types**
   ```bash
   # Add types to src/types/index.ts
   # Export all types
   ```

3. **Run Tests**
   ```bash
   npm run typecheck  # Should pass
   npm test           # Type guard tests should pass
   ```

4. **Validate**
   ```bash
   npm run lint       # Should pass
   npm run format     # Should pass
   ```

---

## Validation Criteria

Phase 2 is complete when:

- [ ] All types compile without errors
- [ ] All type guards work correctly
- [ ] Test coverage for type guards ≥ 90%
- [ ] JSDoc comments for all exported types
- [ ] Type definitions match API documentation
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run format` passes
- [ ] `npm test` passes

---

## Files Structure

After Phase 2, the following files will exist:

```
src/types/
└── index.ts              # All type definitions

test/types/
├── index.test.ts         # Core types tests
├── analysis.test.ts      # Analysis types tests
├── verification.test.ts  # Verification types tests
└── utilities.test.ts     # Utility types tests
```

---

## Example: Complete Type Definition

```typescript
// src/types/index.ts

/**
 * Status of a development plan
 */
export type PlanStatus = 'draft' | 'in-progress' | 'completed';

/**
 * Type of file change
 */
export type FileChangeType = 'create' | 'modify' | 'delete';

/**
 * A structured development plan
 */
export interface Plan {
  /** Unique plan identifier (UUID) */
  id: string;

  /** Plan title (max 100 characters) */
  title: string;

  /** Detailed plan description */
  description: string;

  /** Implementation steps */
  steps: Step[];

  /** Files to create/modify/delete */
  files: FileChange[];

  /** Plan creation timestamp */
  createdAt: Date;

  /** Current plan status */
  status: PlanStatus;
}

/**
 * Type guard to check if a value is a Plan
 */
export function isPlan(value: unknown): value is Plan {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as any).id === 'string' &&
    'title' in value &&
    typeof (value as any).title === 'string' &&
    'steps' in value &&
    Array.isArray((value as any).steps) &&
    'files' in value &&
    Array.isArray((value as any).files) &&
    'status' in value
  );
}

// ... more types
```

---

## Common Pitfalls to Avoid

1. **Don't use `any`**
   - Use `unknown` and type guards instead

2. **Don't use enums**
   - Use union types for better type safety

3. **Don't forget JSDoc comments**
   - Document all public types and interfaces

4. **Don't skip type guards**
   - Essential for runtime type checking

5. **Don't make types too complex**
   - Keep interfaces simple and focused

---

## Next Steps

After completing Phase 2:

→ Proceed to [Phase 3: Utility Layer](./phase-03-utilities.md)

The utility layer will use these types to build foundational functions for file operations, logging, and AST parsing.

---

**Started**: 2025-10-15
**Completed**: 2025-10-15
**Status**: All tasks completed successfully
**Next Phase**: [Phase 3: Utilities](./phase-03-utilities.md)
