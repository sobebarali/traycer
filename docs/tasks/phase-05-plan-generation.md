# Phase 5: Core Business Logic - AI-Powered Plan Generation

**Status**: ⏳ NOT STARTED
**Priority**: CRITICAL
**Dependencies**: Phase 2, Phase 3, Phase 4
**Progress**: 0%

---

## Overview

Implement the core AI-powered plan generation logic that transforms task descriptions into structured, actionable development plans using Anthropic's Claude API.

---

## Goals

- [ ] Implement AI/LLM client for Anthropic API
- [ ] Build prompt construction with codebase context
- [ ] Implement PlanGenerator with AI integration
- [ ] Parse and validate AI-generated plans
- [ ] Implement API key management (SecretStorage)
- [ ] Add error handling and retry logic
- [ ] Format plans as markdown
- [ ] Achieve ≥85% test coverage

---

## Tasks

### 5.1 AI Client Implementation
**Priority**: CRITICAL | **Dependencies**: Phase 2, Phase 3

**Files to Create**:
- `src/ai/aiClient.ts`
- `src/ai/promptBuilder.ts`
- `src/ai/responseParser.ts`
- `test/ai/aiClient.test.ts`
- `test/ai/promptBuilder.test.ts`
- `test/ai/responseParser.test.ts`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases (AI Client)**:
- [ ] Test `validateApiKey()` - valid key
- [ ] Test `validateApiKey()` - invalid key
- [ ] Test `validateApiKey()` - missing key (should throw)
- [ ] Test `generatePlan()` - successful API call
- [ ] Test `generatePlan()` - API error handling
- [ ] Test `generatePlan()` - rate limit handling
- [ ] Test `generatePlan()` - timeout handling
- [ ] Test retry logic (exponential backoff)
- [ ] Test response validation
- [ ] Mock Anthropic API for tests

**Test Cases (Prompt Builder)**:
- [ ] Test `buildPrompt()` - feature task with context
- [ ] Test `buildPrompt()` - bugfix task with context
- [ ] Test `buildPrompt()` - refactor task with context
- [ ] Test context truncation for large codebases
- [ ] Test relevant file selection
- [ ] Test system prompt construction

**Test Cases (Response Parser)**:
- [ ] Test `parsePlanResponse()` - valid JSON plan
- [ ] Test `parsePlanResponse()` - invalid JSON (should throw)
- [ ] Test `parsePlanResponse()` - missing required fields
- [ ] Test plan validation logic
- [ ] Test step parsing
- [ ] Test file change parsing

**Classes to Implement**:
```typescript
// src/ai/aiClient.ts
export class AIClient {
  constructor(private apiKey: string)

  async validateApiKey(): Promise<boolean>
  async generatePlan(prompt: string): Promise<string>
  async checkRateLimit(): Promise<boolean>
  private async retryWithBackoff<T>(fn: () => Promise<T>): Promise<T>
}

// src/ai/promptBuilder.ts
export class PromptBuilder {
  buildPrompt(
    taskDescription: TaskDescription,
    workspaceAnalysis: WorkspaceAnalysis
  ): string

  private buildSystemPrompt(): string
  private buildContextSection(analysis: WorkspaceAnalysis): string
  private selectRelevantFiles(files: FileInfo[], task: TaskDescription): FileInfo[]
}

// src/ai/responseParser.ts
export class ResponseParser {
  parsePlanResponse(response: string): Plan
  validatePlan(plan: Plan): boolean
  private parseSteps(stepsJson: any[]): Step[]
  private parseFileChanges(filesJson: any[]): FileChange[]
}
```

---

### 5.2 API Key Management
**Priority**: CRITICAL | **Dependencies**: None

**Files to Create**:
- `src/utils/config.ts`
- `test/utils/config.test.ts`

**Test Cases**:
- [ ] Test `getApiKey()` - key exists in SecretStorage
- [ ] Test `getApiKey()` - no key configured (should prompt user)
- [ ] Test `setApiKey()` - store key securely
- [ ] Test `clearApiKey()` - remove key
- [ ] Test key validation on retrieval

**Implementation**:
```typescript
// src/utils/config.ts
import * as vscode from 'vscode';

export class Config {
  constructor(private context: vscode.ExtensionContext)

  async getApiKey(): Promise<string>
  async setApiKey(key: string): Promise<void>
  async clearApiKey(): Promise<void>
  async promptForApiKey(): Promise<string>
}
```

**User Flow**:
1. Extension checks for API key on first use
2. If missing, show input box: "Enter your Anthropic API key"
3. Validate key format (starts with `sk-ant-`)
4. Store in VS Code SecretStorage
5. Use for all subsequent API calls

---

### 5.3 Plan Generator with AI Integration
**Priority**: CRITICAL | **Dependencies**: 5.1, 5.2

**Files to Create**:
- `src/core/planGenerator.ts`
- `test/core/planGenerator.test.ts`
- `test/core/planGenerator/integration.test.ts`
- `test/fixtures/sample-ai-responses.json`

**TDD Workflow**: Write tests → Implement → Validate

**Test Cases**:
- [ ] Test `generatePlan()` - full workflow with mocked AI
- [ ] Test `generatePlan()` - simple feature task
- [ ] Test `generatePlan()` - complex feature with multiple files
- [ ] Test `generatePlan()` - bugfix task
- [ ] Test `generatePlan()` - refactor task
- [ ] Test `generatePlan()` - empty description (should throw)
- [ ] Test `generatePlan()` - AI API error handling
- [ ] Test `generatePlan()` - fallback to rule-based (optional)
- [ ] Test `analyzeDependencies()` - step dependencies
- [ ] Test `formatPlan()` - markdown output format
- [ ] Test integration with TaskParser, CodeAnalyzer, AIClient
- [ ] Test plan ID generation (UUID)

**Class to Implement**:
```typescript
export class PlanGenerator {
  constructor(
    private analyzer: CodeAnalyzer,
    private parser: TaskParser,
    private aiClient: AIClient,
    private promptBuilder: PromptBuilder,
    private responseParser: ResponseParser
  )

  async generatePlan(taskDescription: string): Promise<Plan>
  async analyzeDependencies(plan: Plan): Promise<void>
  formatPlan(plan: Plan): string
  private async generateWithAI(task: TaskDescription, context: WorkspaceAnalysis): Promise<Plan>
}
```

**AI-Powered Algorithm**:
1. Parse task description → TaskDescription (TaskParser)
2. Analyze workspace → WorkspaceAnalysis (CodeAnalyzer)
3. Build AI prompt with context → Prompt (PromptBuilder)
4. Send to Anthropic Claude API → AI Response (AIClient)
5. Parse AI response → Plan object (ResponseParser)
6. Validate plan completeness
7. Analyze dependencies between steps
8. Generate UUID for plan
9. Return structured plan

**Prompt Template**:
```
You are a development planning assistant. Generate a detailed, actionable development plan.

TASK:
{taskDescription}

CODEBASE CONTEXT:
- Project Type: {projectType}
- Files: {relevantFiles}
- Dependencies: {dependencies}
- Patterns: {codePatterns}

INSTRUCTIONS:
1. Generate 3-7 specific implementation steps
2. For each step, provide clear reasoning
3. Identify files to create/modify with reasoning
4. Specify dependencies between steps
5. Output as JSON matching the Plan interface

OUTPUT FORMAT:
{
  "title": "string",
  "description": "string",
  "steps": [...],
  "files": [...]
}
```

---

## Implementation Notes

### AI Client Setup

**Anthropic API**:
- Use `@anthropic-ai/sdk` npm package
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: ~100k for context
- Temperature: 0.7 (balance creativity and consistency)

**Error Handling**:
- Rate limits: Exponential backoff (1s, 2s, 4s, 8s)
- Network errors: Retry up to 3 times
- Invalid responses: Parse errors gracefully
- API key errors: Prompt user to reconfigure

**Security**:
- Store API keys in `context.secrets` (VS Code SecretStorage)
- Never log API keys or responses containing user code
- Validate key format before storing: `sk-ant-api03-...`
- Sanitize file paths before sending to AI

### Prompt Engineering Best Practices

1. **System Prompt**: Clear instructions on output format
2. **Context Limit**: Select top 10-20 most relevant files
3. **File Excerpts**: Show first 100 lines of large files
4. **Pattern Examples**: Include existing code patterns
5. **Structured Output**: Enforce JSON format in prompt

### Response Parsing

- Extract JSON from markdown code blocks if needed
- Validate all required fields present
- Generate UUIDs for plan and step IDs
- Sanitize file paths (no `..` or absolute paths outside workspace)
- Validate step dependencies reference existing steps

---

## Validation Criteria

Phase 5 is complete when:

- [ ] AIClient tests pass (≥85% coverage)
- [ ] PromptBuilder tests pass (≥85% coverage)
- [ ] ResponseParser tests pass (≥85% coverage)
- [ ] PlanGenerator tests pass (≥85% coverage)
- [ ] Config/API key management tests pass
- [ ] Can generate plans for various task types using AI
- [ ] Plans include reasoning and dependencies
- [ ] Plans identify correct files to modify
- [ ] Steps are ordered correctly
- [ ] API error handling works correctly
- [ ] Retry logic functions properly
- [ ] API key management is secure (SecretStorage)
- [ ] Integration tests pass (with mocked AI)
- [ ] Generated markdown is well-formatted
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes

**Security Checklist**:
- [ ] API keys stored in VS Code SecretStorage (not settings.json)
- [ ] API keys never logged or exposed in error messages
- [ ] Code context sanitized before sending to AI
- [ ] HTTPS used for all API calls
- [ ] User consent for AI usage obtained

---

## Example AI-Generated Plan Output

**User Input**: "Add user authentication with JWT"

**AI Generates**:
```typescript
const plan: Plan = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Add JWT-based User Authentication',
  description: 'Implement secure user authentication using JSON Web Tokens with login, logout, and token refresh capabilities',
  steps: [
    {
      id: 'step-1',
      description: 'Install authentication dependencies (jsonwebtoken, bcrypt)',
      reasoning: 'Required packages for JWT generation/verification and password hashing',
      dependencies: [],
      completed: false
    },
    {
      id: 'step-2',
      description: 'Create User model and interface',
      reasoning: 'Define user data structure with fields for authentication (email, password hash)',
      dependencies: [],
      completed: false
    },
    {
      id: 'step-3',
      description: 'Implement AuthService with JWT methods',
      reasoning: 'Centralized service for generating tokens, verifying credentials, and managing sessions',
      dependencies: ['step-1', 'step-2'],
      completed: false
    },
    {
      id: 'step-4',
      description: 'Create authentication middleware',
      reasoning: 'Protect routes by validating JWT tokens on incoming requests',
      dependencies: ['step-3'],
      completed: false
    },
    {
      id: 'step-5',
      description: 'Add login and logout endpoints',
      reasoning: 'API routes for users to authenticate and terminate sessions',
      dependencies: ['step-3'],
      completed: false
    },
    {
      id: 'step-6',
      description: 'Add unit tests for AuthService and middleware',
      reasoning: 'Ensure authentication logic is secure and handles edge cases correctly',
      dependencies: ['step-3', 'step-4'],
      completed: false
    }
  ],
  files: [
    {
      path: 'package.json',
      type: 'modify',
      description: 'Add authentication dependencies',
      reasoning: 'Need jsonwebtoken and bcrypt packages'
    },
    {
      path: 'src/models/User.ts',
      type: 'create',
      description: 'User interface and model',
      reasoning: 'Define user structure for authentication'
    },
    {
      path: 'src/services/AuthService.ts',
      type: 'create',
      description: 'Authentication service with JWT logic',
      reasoning: 'Centralized authentication operations'
    },
    {
      path: 'src/middleware/authMiddleware.ts',
      type: 'create',
      description: 'JWT validation middleware',
      reasoning: 'Protect routes with token verification'
    },
    {
      path: 'src/routes/auth.ts',
      type: 'create',
      description: 'Authentication routes (login, logout)',
      reasoning: 'Expose authentication endpoints'
    },
    {
      path: 'test/services/AuthService.test.ts',
      type: 'create',
      description: 'Unit tests for authentication service',
      reasoning: 'Test authentication logic thoroughly'
    }
  ],
  createdAt: new Date(),
  status: 'draft'
};
```

**Note**: This plan is generated by AI based on:
- Understanding the task intent
- Analyzing the existing codebase structure
- Identifying relevant patterns and conventions
- Following best practices for the detected project type

---

## Next Steps

→ Proceed to [Phase 6: Extension Integration](./phase-06-extension.md)

---

**Target Completion**: TBD
**Next Phase**: [Phase 6: Extension](./phase-06-extension.md)
