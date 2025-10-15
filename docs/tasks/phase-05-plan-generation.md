# Phase 5: Core Business Logic - Plan Generation

**Status**: ⏳ NOT STARTED
**Priority**: CRITICAL
**Dependencies**: Phase 2, Phase 3, Phase 4
**Progress**: 0%

---

## Overview

Implement the core plan generation logic that transforms task descriptions into structured, actionable development plans.

---

## Goals

- [ ] Implement PlanGenerator class
- [ ] Generate structured plans from task descriptions
- [ ] Analyze dependencies between steps
- [ ] Format plans as markdown
- [ ] Achieve ≥85% test coverage

---

## Tasks

### 5.1 Plan Generator Implementation
**Priority**: CRITICAL | **Dependencies**: Phase 2, Phase 3, Phase 4

**Files to Create**:
- `src/core/planGenerator.ts`
- `test/core/planGenerator.test.ts`
- `test/core/planGenerator/integration.test.ts`
- `test/fixtures/sample-plans.json`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases**:
- [ ] Test `generatePlan()` - simple feature task
- [ ] Test `generatePlan()` - complex feature with multiple files
- [ ] Test `generatePlan()` - bugfix task
- [ ] Test `generatePlan()` - refactor task
- [ ] Test `generatePlan()` - empty description (should throw)
- [ ] Test `generatePlan()` - invalid input (should throw)
- [ ] Test `analyzeDependencies()` - step dependencies
- [ ] Test `formatPlan()` - markdown output format
- [ ] Test integration with TaskParser
- [ ] Test integration with CodeAnalyzer
- [ ] Test plan ID generation (UUID)
- [ ] Test reasoning generation

**Class to Implement**:
```typescript
export class PlanGenerator {
  constructor(
    private analyzer: CodeAnalyzer,
    private parser: TaskParser
  )

  async generatePlan(taskDescription: string): Promise<Plan>
  async analyzeDependencies(plan: Plan): Promise<void>
  formatPlan(plan: Plan): string
}
```

**Core Algorithm**:
1. Parse task description → TaskDescription
2. Analyze workspace → WorkspaceAnalysis
3. Find relevant files
4. Determine task intent
5. Generate steps based on intent and scope
6. Identify affected files
7. Generate reasoning for each step
8. Analyze dependencies between steps
9. Create Plan object with UUID
10. Return structured plan

**Plan Generation Rules by Intent**:

**Feature**:
- Create new files if needed
- Modify existing files to integrate feature
- Update exports/imports
- Add tests
- Update documentation

**Bugfix**:
- Identify affected files
- Suggest fix approach
- Update tests
- Verify fix

**Refactor**:
- Identify code to refactor
- Create backup steps
- Refactor implementation
- Verify behavior unchanged
- Update tests

---

## Validation Criteria

Phase 5 is complete when:

- [ ] PlanGenerator tests pass (≥85% coverage)
- [ ] Can generate plans for various task types
- [ ] Plans include reasoning and dependencies
- [ ] Plans identify correct files to modify
- [ ] Steps are ordered correctly
- [ ] Integration tests pass
- [ ] Generated markdown is well-formatted
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes

---

## Example Plan Output

```typescript
const plan: Plan = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Add user authentication',
  description: 'Implement JWT-based authentication',
  steps: [
    {
      id: 'step-1',
      description: 'Create authentication service',
      reasoning: 'Need centralized service for auth operations',
      dependencies: [],
      completed: false
    },
    {
      id: 'step-2',
      description: 'Add login endpoint',
      reasoning: 'Users need way to authenticate',
      dependencies: ['step-1'],
      completed: false
    }
  ],
  files: [
    {
      path: 'src/auth/authService.ts',
      type: 'create',
      description: 'Authentication service with JWT support',
      reasoning: 'New service needed for auth'
    }
  ],
  createdAt: new Date(),
  status: 'draft'
};
```

---

## Next Steps

→ Proceed to [Phase 6: Extension Integration](./phase-06-extension.md)

---

**Target Completion**: TBD
**Next Phase**: [Phase 6: Extension](./phase-06-extension.md)
