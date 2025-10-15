# Phase 3: Utility Layer

**Status**: ⏳ NOT STARTED
**Priority**: HIGH
**Dependencies**: Phase 2
**Progress**: 0%

---

## Overview

Implement utility functions for file system operations, logging, and AST parsing. These foundational utilities will be used throughout the extension.

---

## Goals

- [ ] Implement file system utilities (read, write, list, find)
- [ ] Create logger utility with output channel
- [ ] Build AST parser utility for TypeScript/JavaScript files
- [ ] Achieve ≥80% test coverage for utilities

---

## Tasks

### 3.1 File System Utilities
**Priority**: HIGH | **Dependencies**: Phase 2

**Files to Create**:
- `src/utils/fileSystem.ts`
- `test/utils/fileSystem.test.ts`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases**:
- [ ] Test `readFile()` - success case
- [ ] Test `readFile()` - file not found
- [ ] Test `writeFile()` - success case
- [ ] Test `writeFile()` - permission error
- [ ] Test `listFiles()` - directory listing
- [ ] Test `findFiles()` - glob pattern matching
- [ ] Test file path validation
- [ ] Test directory traversal prevention
- [ ] Test workspace boundary checks

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
- [ ] Test `log()` - basic logging
- [ ] Test `warn()` - warning messages
- [ ] Test `error()` - error logging
- [ ] Test log levels
- [ ] Test context object logging
- [ ] Test sensitive data filtering

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
- [ ] Test `parseSourceFile()` - valid TypeScript
- [ ] Test `parseSourceFile()` - invalid syntax
- [ ] Test `findFunctions()` - function declarations
- [ ] Test `findImports()` - import statements
- [ ] Test `findExports()` - export statements
- [ ] Test `analyzeStructure()` - overall structure
- [ ] Test React component parsing
- [ ] Test class parsing

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

- [ ] All utility tests pass
- [ ] Test coverage ≥ 80% for each utility
- [ ] File system utilities handle errors gracefully
- [ ] Logger filters sensitive data
- [ ] AST parser handles various code structures
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run format` passes
- [ ] `npm test` passes

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
