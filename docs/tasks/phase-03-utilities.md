# Phase 3: Utility Layer

**Status**: ✅ COMPLETED
**Priority**: HIGH
**Dependencies**: Phase 2
**Progress**: 100%

---

## Overview

Implement utility functions for file system operations, logging, and AST parsing. These foundational utilities will be used throughout the extension.

---

## Goals

- [x] Implement file system utilities (read, write, list, find)
- [x] Create logger utility with output channel
- [x] Build AST parser utility for TypeScript/JavaScript files
- [x] Achieve ≥80% test coverage for utilities

---

## Tasks

### 3.1 File System Utilities
**Priority**: HIGH | **Dependencies**: Phase 2

**Files to Create**:
- `src/utils/fileSystem.ts`
- `test/utils/fileSystem.test.ts`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases**:
- [x] Test `readFile()` - success case
- [x] Test `readFile()` - file not found
- [x] Test `writeFile()` - success case
- [x] Test `writeFile()` - permission error
- [x] Test `listFiles()` - directory listing
- [x] Test `findFiles()` - glob pattern matching
- [x] Test file path validation
- [x] Test directory traversal prevention
- [x] Test workspace boundary checks

**Functions to Implement**:
```typescript
export async function readFile(path: string): Promise<string>
export async function writeFile(path: string, content: string): Promise<void>
export async function listFiles(directory: string): Promise<string[]>
export async function findFiles(pattern: string): Promise<string[]>
export function validateFilePath(path: string): boolean
export function isWithinWorkspace(path: string): boolean
```

**Security Requirements**:
- Validate all file paths
- Prevent directory traversal (../)
- Restrict access to workspace only
- Handle permission errors gracefully

---

### 3.2 Logger Utility
**Priority**: MEDIUM | **Dependencies**: None

**Files to Create**:
- `src/utils/logger.ts`
- `test/utils/logger.test.ts`

**Test Cases**:
- [x] Test `log()` - basic logging
- [x] Test `warn()` - warning messages
- [x] Test `error()` - error logging
- [x] Test log levels
- [x] Test context object logging
- [x] Test sensitive data filtering

**Functions to Implement**:
```typescript
export function log(message: string, context?: object): void
export function warn(message: string, context?: object): void
export function error(message: string, error?: Error): void
```

**Features**:
- Create VS Code output channel
- Support different log levels
- Filter sensitive data (paths, credentials)
- Format log messages consistently
- Add timestamps

---

### 3.3 AST Parser Utility
**Priority**: HIGH | **Dependencies**: 3.1 (file system)

**Files to Create**:
- `src/utils/ast.ts`
- `test/utils/ast.test.ts`
- `test/fixtures/sample-code/simple.ts`
- `test/fixtures/sample-code/complex.ts`
- `test/fixtures/sample-code/react-component.tsx`

**Test Cases**:
- [x] Test `parseSourceFile()` - valid TypeScript
- [x] Test `parseSourceFile()` - invalid syntax
- [x] Test `findFunctions()` - function declarations
- [x] Test `findImports()` - import statements
- [x] Test `findExports()` - export statements
- [x] Test `analyzeStructure()` - overall structure
- [x] Test React component parsing
- [x] Test class parsing

**Functions to Implement**:
```typescript
import * as ts from 'typescript';

export async function parseSourceFile(content: string): Promise<ts.SourceFile>
export function findFunctions(ast: ts.SourceFile): ts.FunctionDeclaration[]
export function findImports(ast: ts.SourceFile): ts.ImportDeclaration[]
export function findExports(ast: ts.SourceFile): ts.ExportDeclaration[]
export function analyzeStructure(ast: ts.SourceFile): CodeStructure
```

**Dependencies**:
- TypeScript Compiler API (`typescript` package)

---

## Validation Criteria

Phase 3 is complete when:

- [x] All utility tests pass
- [x] Test coverage ≥ 80% for each utility
- [x] File system utilities handle errors gracefully
- [x] Logger filters sensitive data
- [x] AST parser handles various code structures
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run format` passes
- [x] `npm test` passes (user will run manually)

---

## Files Structure

```
src/utils/
├── fileSystem.ts
├── logger.ts
└── ast.ts

test/utils/
├── fileSystem.test.ts
├── logger.test.ts
└── ast.test.ts

test/fixtures/
└── sample-code/
    ├── simple.ts
    ├── complex.ts
    └── react-component.tsx
```

---

## Next Steps

→ Proceed to [Phase 4: Core Business Logic - Analysis & Parsing](./phase-04-analysis.md)

---

**Target Completion**: TBD
**Next Phase**: [Phase 4: Analysis](./phase-04-analysis.md)
