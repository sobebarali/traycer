# Phase 4: Core Business Logic - Analysis & Parsing

**Status**: ⏳ NOT STARTED
**Priority**: HIGH
**Dependencies**: Phase 2, Phase 3
**Progress**: 0%

---

## Overview

Implement task parsing and code analysis capabilities. These modules understand user intent and analyze workspace structure.

---

## Goals

- [ ] Implement TaskParser to parse user task descriptions
- [ ] Build CodeAnalyzer to analyze workspace structure
- [ ] Extract patterns and dependencies from codebase
- [ ] Achieve ≥80% test coverage

---

## Tasks

### 4.1 Task Parser
**Priority**: HIGH | **Dependencies**: Phase 2, Phase 3

**Files to Create**:
- `src/core/taskParser.ts`
- `test/core/taskParser.test.ts`
- `test/core/taskParser/edge-cases.test.ts`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases**:
- [ ] Test `parseTaskDescription()` - feature intent
- [ ] Test `parseTaskDescription()` - bugfix intent
- [ ] Test `parseTaskDescription()` - refactor intent
- [ ] Test `parseTaskDescription()` - empty input (should throw)
- [ ] Test `parseTaskDescription()` - very long input (should throw)
- [ ] Test `extractIntent()` - "add", "create" → feature
- [ ] Test `extractIntent()` - "fix", "bug" → bugfix
- [ ] Test `extractIntent()` - "refactor", "improve" → refactor
- [ ] Test `identifyScope()` - keyword extraction
- [ ] Test input validation and sanitization

**Class to Implement**:
```typescript
export class TaskParser {
  constructor()

  async parseTaskDescription(description: string): Promise<TaskDescription>
  extractIntent(description: string): TaskIntent
  identifyScope(description: string): string[]
}
```

**Intent Detection Logic**:
- Feature keywords: "add", "create", "implement", "build"
- Bugfix keywords: "fix", "bug", "broken", "error"
- Refactor keywords: "refactor", "improve", "optimize", "clean"
- Documentation keywords: "document", "docs", "readme"
- Test keywords: "test", "spec", "testing"

---

### 4.2 Code Analyzer
**Priority**: HIGH | **Dependencies**: Phase 2, Phase 3

**Files to Create**:
- `src/core/codeAnalyzer.ts`
- `test/core/codeAnalyzer.test.ts`
- `test/core/codeAnalyzer/edge-cases.test.ts`
- `test/fixtures/sample-project/` (complete test workspace)

**Test Fixtures Required**:
```
test/fixtures/sample-project/
├── src/
│   ├── index.ts
│   ├── auth/
│   │   ├── login.ts
│   │   └── user.ts
│   └── utils/
│       └── helper.ts
├── package.json
└── tsconfig.json
```

**Test Cases**:
- [ ] Test `analyzeWorkspace()` - basic project
- [ ] Test `analyzeWorkspace()` - no workspace open (should throw)
- [ ] Test `analyzeWorkspace()` - empty workspace
- [ ] Test `findRelevantFiles()` - task matching
- [ ] Test `parseTypeScript()` - valid file
- [ ] Test `parseTypeScript()` - invalid file (should throw)
- [ ] Test `extractPatterns()` - pattern detection
- [ ] Test dependency graph building
- [ ] Test caching mechanism
- [ ] Test skipping node_modules

**Class to Implement**:
```typescript
export class CodeAnalyzer {
  constructor(workspaceRoot?: string)

  async analyzeWorkspace(): Promise<WorkspaceAnalysis>
  async findRelevantFiles(task: TaskDescription): Promise<FileInfo[]>
  async parseTypeScript(filePath: string): Promise<ts.SourceFile>
  async extractPatterns(): Promise<CodePattern[]>
}
```

**Features**:
- Scan workspace for files
- Parse TypeScript/JavaScript files using AST utility
- Extract imports, exports, and dependencies
- Identify code patterns (components, functions, classes)
- Build dependency graph
- Implement caching for performance
- Skip node_modules and large directories

---

## Validation Criteria

Phase 4 is complete when:

- [ ] TaskParser tests pass (100% coverage on core logic)
- [ ] CodeAnalyzer tests pass (≥80% coverage)
- [ ] Can correctly parse task descriptions
- [ ] Can analyze sample workspace
- [ ] Intent detection works accurately
- [ ] Scope identification extracts keywords
- [ ] File relevance detection works
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes

---

## Files Structure

```
src/core/
├── taskParser.ts
└── codeAnalyzer.ts

test/core/
├── taskParser.test.ts
├── taskParser/
│   └── edge-cases.test.ts
├── codeAnalyzer.test.ts
└── codeAnalyzer/
    └── edge-cases.test.ts

test/fixtures/
└── sample-project/
    ├── src/
    ├── package.json
    └── tsconfig.json
```

---

## Next Steps

→ Proceed to [Phase 5: Core Business Logic - Plan Generation](./phase-05-plan-generation.md)

---

**Target Completion**: TBD
**Next Phase**: [Phase 5: Plan Generation](./phase-05-plan-generation.md)
