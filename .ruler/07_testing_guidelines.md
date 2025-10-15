# Testing Guidelines - Traycer VS Code Extension

This document outlines testing practices for VS Code extension development with Jest.

## Core Principles

- **Test-Driven Development**: Write tests before implementation
- **Unit Testing Focus**: Test core logic independently from VS Code API
- **Mock VS Code API**: Use mocks for VS Code dependencies
- **Fast Execution**: Keep tests fast and isolated
- **Type Safety**: Full TypeScript coverage in tests
- **Clear Descriptions**: Use descriptive test names

## Test Structure

### File Organization

```
test/
├── core/                      # Core logic tests
│   ├── planGenerator.test.ts
│   ├── codeAnalyzer.test.ts
│   ├── taskParser.test.ts
│   └── planVerifier.test.ts
├── utils/                     # Utility function tests
│   ├── fileSystem.test.ts
│   ├── ast.test.ts
│   └── logger.test.ts
├── fixtures/                  # Test data and fixtures
│   ├── sample-project/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   └── sample-plans.json
└── helpers/                   # Test helpers and mocks
    ├── mockVscode.ts
    ├── mockWorkspace.ts
    └── testData.ts
```

### Example Test Structure

```
test/core/planGenerator/
├── generatePlan.test.ts       # Main functionality
├── edge-cases.test.ts         # Edge cases
└── errors.test.ts             # Error handling
```

## Testing Patterns

### Unit Test Pattern

**Basic Structure:**

```typescript
// test/core/planGenerator.test.ts
import { PlanGenerator } from '../../src/core/planGenerator';
import { mockWorkspace } from '../helpers/mockWorkspace';

describe('PlanGenerator', () => {
  let generator: PlanGenerator;

  beforeEach(() => {
    generator = new PlanGenerator();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePlan', () => {
    it('should generate plan from task description', async () => {
      const taskDescription = 'Add user authentication';
      const plan = await generator.generatePlan(taskDescription);

      expect(plan).toBeDefined();
      expect(plan.title).toBe('Add user authentication');
      expect(plan.steps.length).toBeGreaterThan(0);
      expect(plan.files.length).toBeGreaterThan(0);
    });

    it('should throw error for empty task description', async () => {
      await expect(generator.generatePlan('')).rejects.toThrow(
        'Task description cannot be empty'
      );
    });

    it('should include reasoning for each step', async () => {
      const plan = await generator.generatePlan('Add login feature');

      plan.steps.forEach(step => {
        expect(step.reasoning).toBeDefined();
        expect(step.reasoning.length).toBeGreaterThan(0);
      });
    });
  });
});
```

### Mocking VS Code API

**Create Mock Helper:**

```typescript
// test/helpers/mockVscode.ts
export const mockVscode = {
  window: {
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showInputBox: jest.fn(),
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      show: jest.fn(),
    })),
    withProgress: jest.fn((options, task) => {
      const progress = {
        report: jest.fn(),
      };
      const token = {
        isCancellationRequested: false,
        onCancellationRequested: jest.fn(),
      };
      return task(progress, token);
    }),
  },
  workspace: {
    workspaceFolders: [
      {
        uri: { fsPath: '/test/workspace' },
        name: 'test-workspace',
        index: 0,
      },
    ],
    getConfiguration: jest.fn(() => ({
      get: jest.fn(),
      has: jest.fn(),
      inspect: jest.fn(),
      update: jest.fn(),
    })),
    fs: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      readDirectory: jest.fn(),
      stat: jest.fn(),
    },
  },
  Uri: {
    file: jest.fn((path) => ({ fsPath: path })),
    parse: jest.fn((path) => ({ fsPath: path })),
  },
  commands: {
    registerCommand: jest.fn(),
    executeCommand: jest.fn(),
  },
};

// Mock the vscode module
jest.mock('vscode', () => mockVscode, { virtual: true });
```

### Testing with Fixtures

**Use Test Fixtures:**

```typescript
// test/core/codeAnalyzer.test.ts
import * as path from 'path';
import { CodeAnalyzer } from '../../src/core/codeAnalyzer';

describe('CodeAnalyzer', () => {
  const fixturesPath = path.join(__dirname, '../fixtures/sample-project');
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer(fixturesPath);
  });

  it('should analyze workspace structure', async () => {
    const analysis = await analyzer.analyzeWorkspace();

    expect(analysis.rootPath).toBe(fixturesPath);
    expect(analysis.files.length).toBeGreaterThan(0);
    expect(analysis.dependencies).toBeDefined();
  });

  it('should identify TypeScript files', async () => {
    const files = await analyzer.findTypeScriptFiles();

    expect(files.length).toBeGreaterThan(0);
    files.forEach(file => {
      expect(file.path.endsWith('.ts') || file.path.endsWith('.tsx')).toBe(true);
    });
  });
});
```

### Testing Async Operations

**Async Test Pattern:**

```typescript
describe('Async Operations', () => {
  it('should handle async file operations', async () => {
    const result = await analyzer.readAndParseFile('/path/to/file.ts');
    expect(result).toBeDefined();
  });

  it('should handle errors in async operations', async () => {
    await expect(
      analyzer.readAndParseFile('/nonexistent/file.ts')
    ).rejects.toThrow('File not found');
  });

  it('should timeout long operations', async () => {
    jest.setTimeout(1000); // 1 second timeout

    await expect(
      analyzer.analyzeVeryLargeProject()
    ).rejects.toThrow('Timeout');
  });
});
```

## Test Categories

### 1. Success Cases

Test expected behavior with valid inputs:

```typescript
describe('Success Cases', () => {
  it('should generate plan with multiple steps', async () => {
    const plan = await generator.generatePlan('Build REST API');
    expect(plan.steps.length).toBeGreaterThanOrEqual(3);
  });

  it('should identify affected files correctly', async () => {
    const plan = await generator.generatePlan('Update user model');
    expect(plan.files.some(f => f.path.includes('user'))).toBe(true);
  });
});
```

### 2. Error Handling

Test error scenarios:

```typescript
describe('Error Handling', () => {
  it('should throw error for invalid workspace', async () => {
    const analyzer = new CodeAnalyzer('/invalid/path');
    await expect(analyzer.analyzeWorkspace()).rejects.toThrow();
  });

  it('should handle parse errors gracefully', async () => {
    await expect(parser.parseInvalidCode()).rejects.toThrow('Parse error');
  });
});
```

### 3. Edge Cases

Test boundary conditions:

```typescript
describe('Edge Cases', () => {
  it('should handle empty workspace', async () => {
    mockVscode.workspace.workspaceFolders = [];
    await expect(analyzer.analyzeWorkspace()).rejects.toThrow(
      'No workspace folder open'
    );
  });

  it('should handle very long task descriptions', async () => {
    const longDescription = 'A'.repeat(10000);
    const plan = await generator.generatePlan(longDescription);
    expect(plan).toBeDefined();
  });

  it('should handle special characters in file paths', async () => {
    const path = '/path/with spaces/and-special_chars.ts';
    const result = await analyzer.parseFile(path);
    expect(result).toBeDefined();
  });
});
```

## Test Data Management

### Using Test Fixtures

```typescript
// test/fixtures/sample-plans.json
{
  "simplePlan": {
    "title": "Add button component",
    "steps": [
      {
        "id": "1",
        "description": "Create Button.tsx",
        "reasoning": "Need new component file",
        "dependencies": [],
        "completed": false
      }
    ],
    "files": [
      {
        "path": "src/components/Button.tsx",
        "type": "create",
        "description": "Button component",
        "reasoning": "New feature requires new file"
      }
    ]
  }
}
```

### Test Data Helper

```typescript
// test/helpers/testData.ts
import { Plan, Step, FileChange } from '../../src/types';

export function createMockPlan(overrides?: Partial<Plan>): Plan {
  return {
    id: 'test-plan-1',
    title: 'Test Plan',
    description: 'Test plan description',
    steps: [],
    files: [],
    createdAt: new Date(),
    status: 'draft',
    ...overrides,
  };
}

export function createMockStep(overrides?: Partial<Step>): Step {
  return {
    id: 'test-step-1',
    description: 'Test step',
    reasoning: 'Test reasoning',
    dependencies: [],
    completed: false,
    ...overrides,
  };
}
```

## Best Practices

### ✅ Do

* Write tests before implementation (TDD)
* Use descriptive test names that explain behavior
* Test one thing per test case
* Use `beforeEach` and `afterEach` for setup/cleanup
* Mock external dependencies (VS Code API, file system)
* Test both success and error paths
* Use TypeScript for type safety in tests
* Keep tests fast and isolated
* Use fixtures for complex test data
* Clean up resources after tests

### ❌ Don't

* Don't test VS Code API implementation (it's already tested)
* Don't write tests that depend on other tests
* Don't use `setTimeout` for async tests (use `async/await`)
* Don't skip tests with `.skip` in committed code
* Don't use `.only` for focus in committed code
* Don't test implementation details, test behavior
* Don't write tests that touch real file system (use mocks)
* Don't ignore test failures

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- planGenerator.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="generatePlan"
```

### Test Configuration

**jest.config.js:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
```

## Coverage Goals

* **Lines**: Minimum 80%
* **Functions**: Minimum 80%
* **Branches**: Minimum 80%
* **Statements**: Minimum 80%

Focus on testing:
- Core business logic (plan generation, code analysis)
- Utility functions
- Error handling
- Edge cases

## Summary

**Key Points:**
- Write tests first (TDD)
- Mock VS Code API appropriately
- Use fixtures for test data
- Test success, error, and edge cases
- Keep tests fast and isolated
- Maintain high coverage on core logic
- Use TypeScript for type safety

This ensures reliable, maintainable extension code.
