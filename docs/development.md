# Development Guide

This guide covers everything you need to know to develop and contribute to Traycer.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Building](#building)
- [Publishing](#publishing)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **VS Code** (latest stable version)
- **Git**

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript and JavaScript Language Features** (built-in)
- **Jest** - Test runner integration

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/traycer.git
cd traycer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile TypeScript

```bash
npm run compile
```

### 4. Open in VS Code

```bash
code .
```

### 5. Launch Extension Development Host

Press `F5` or go to **Run → Start Debugging**

This will:
- Compile the extension
- Open a new VS Code window with the extension loaded
- Enable debugging with breakpoints

## Project Structure

```
traycer/
├── src/                       # Source code
│   ├── extension.ts          # Extension entry point
│   ├── core/                 # Core business logic
│   ├── ui/                   # UI components
│   ├── utils/                # Utilities
│   └── types/                # Type definitions
├── test/                     # Tests
│   ├── core/                 # Core logic tests
│   ├── utils/                # Utility tests
│   ├── fixtures/             # Test fixtures
│   └── helpers/              # Test helpers
├── media/                    # Static assets
├── docs/                     # Documentation
├── .vscode/                  # VS Code configuration
│   ├── launch.json          # Debug configuration
│   ├── tasks.json           # Build tasks
│   └── extensions.json      # Recommended extensions
├── .ruler/                   # AI workflow rules
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript config
└── README.md                 # Project README
```

For detailed structure, see [.ruler/02_folder_structure.md](../.ruler/02_folder_structure.md).

## Development Workflow

### Daily Workflow

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Write tests first (TDD approach)
   - Implement feature
   - Run tests and checks

4. **Run checks**
   ```bash
   npm run typecheck    # TypeScript type checking
   npm run lint         # ESLint
   npm run format       # Prettier
   npm test             # Run tests
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

**Examples**:
```
feat: add plan verification feature
fix: resolve file path validation issue
docs: update API documentation
test: add tests for code analyzer
```

## Testing

### Running Tests

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

### Writing Tests

Follow the TDD (Test-Driven Development) approach:

1. **Write test first**
   ```typescript
   // test/core/planGenerator.test.ts
   describe('PlanGenerator', () => {
     it('should generate plan from task description', async () => {
       const generator = new PlanGenerator();
       const plan = await generator.generatePlan('Add user authentication');

       expect(plan).toBeDefined();
       expect(plan.steps.length).toBeGreaterThan(0);
     });
   });
   ```

2. **Watch test fail**
   ```bash
   npm run test:watch
   ```

3. **Implement feature**
   ```typescript
   // src/core/planGenerator.ts
   export class PlanGenerator {
     async generatePlan(taskDescription: string): Promise<Plan> {
       // Implementation
     }
   }
   ```

4. **Watch test pass**

5. **Refactor if needed**

### Test Structure

```
test/
├── core/
│   ├── planGenerator.test.ts
│   ├── codeAnalyzer.test.ts
│   └── taskParser.test.ts
├── utils/
│   ├── fileSystem.test.ts
│   └── ast.test.ts
└── helpers/
    ├── mockVscode.ts
    └── testData.ts
```

See [.ruler/07_testing_guidelines.md](../.ruler/07_testing_guidelines.md) for detailed testing guidelines.

## Debugging

### Debug Extension

1. **Set breakpoints** in your code
2. **Press F5** to launch Extension Development Host
3. **Trigger the code** you want to debug
4. **Inspect variables** in Debug Console

### Debug Configuration

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"],
      "preLaunchTask": "npm: watch"
    },
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/test/**/*.js"],
      "preLaunchTask": "npm: watch"
    }
  ]
}
```

### Debug WebView

WebView debugging is separate from extension debugging:

1. **Open Command Palette** (`Cmd+Shift+P`)
2. **Run**: "Developer: Open Webview Developer Tools"
3. **Inspect** webview HTML/CSS/JS
4. **Set breakpoints** in webview code

### Logging

Use console methods for debugging:

```typescript
console.log('Debug info:', variable);
console.warn('Warning:', warning);
console.error('Error:', error);
```

**Note**: Logs appear in:
- **Extension Host**: Debug Console
- **WebView**: Webview Developer Tools Console

## Building

### Compile TypeScript

```bash
# One-time compilation
npm run compile

# Watch mode (auto-recompile on changes)
npm run watch
```

### Check for Errors

```bash
# TypeScript type checking
npm run typecheck

# ESLint
npm run lint

# Prettier formatting check
npm run format:check

# Fix formatting issues
npm run format
```

### Pre-publish Preparation

```bash
# Run all checks
npm run typecheck && npm run lint && npm run format && npm test

# Build for production
npm run vscode:prepublish
```

## Publishing

### Package Extension

Create a VSIX file for distribution:

```bash
npm install -g @vscode/vsce
vsce package
```

This creates `traycer-0.1.0.vsix`.

### Install VSIX Locally

```bash
code --install-extension traycer-0.1.0.vsix
```

### Publish to Marketplace

1. **Create Publisher Account**
   - Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
   - Create publisher account

2. **Get Personal Access Token**
   - Go to [Azure DevOps](https://dev.azure.com/)
   - Create PAT with Marketplace publish scope

3. **Login to vsce**
   ```bash
   vsce login your-publisher-name
   ```

4. **Publish**
   ```bash
   vsce publish
   ```

### Version Bumping

Use semantic versioning (major.minor.patch):

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major
```

## Code Style

Follow the coding style guidelines in [.ruler/04_coding_style.md](../.ruler/04_coding_style.md).

**Key Points**:
- Use TypeScript strict mode
- Use async/await for async operations
- Validate all user inputs
- Handle errors gracefully
- Add JSDoc comments for public APIs
- Use meaningful variable names
- Keep functions small and focused

**Example**:
```typescript
/**
 * Generates a development plan from a task description.
 *
 * @param taskDescription - Natural language description of the task
 * @returns A structured development plan with steps and file changes
 * @throws Error if task description is empty or invalid
 */
async generatePlan(taskDescription: string): Promise<Plan> {
  // Validate input
  if (!taskDescription?.trim()) {
    throw new Error('Task description cannot be empty');
  }

  // Implementation
  // ...
}
```

## Performance Tips

### 1. Lazy Loading

Load modules only when needed:

```typescript
// Bad: Load immediately
import { HeavyModule } from './heavy';

// Good: Load on demand
async function useHeavyModule() {
  const { HeavyModule } = await import('./heavy');
  return new HeavyModule();
}
```

### 2. Caching

Cache expensive operations:

```typescript
private cache = new Map<string, WorkspaceAnalysis>();

async analyzeWorkspace(): Promise<WorkspaceAnalysis> {
  const cacheKey = this.workspaceRoot;

  if (this.cache.has(cacheKey)) {
    return this.cache.get(cacheKey)!;
  }

  const analysis = await this.performAnalysis();
  this.cache.set(cacheKey, analysis);
  return analysis;
}
```

### 3. Progress Indicators

Show progress for long operations:

```typescript
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: 'Analyzing workspace...',
  cancellable: true
}, async (progress, token) => {
  // Check cancellation
  if (token.isCancellationRequested) {
    return;
  }

  progress.report({ increment: 0, message: 'Scanning files...' });
  // Do work

  progress.report({ increment: 50, message: 'Parsing code...' });
  // More work

  progress.report({ increment: 100, message: 'Complete!' });
});
```

## Troubleshooting

### Extension Not Loading

1. Check console for errors (Help → Toggle Developer Tools)
2. Verify `package.json` activation events
3. Ensure TypeScript compiled successfully
4. Restart Extension Development Host

### Tests Failing

1. Run `npm run compile` before tests
2. Check mock setup in test helpers
3. Clear Jest cache: `npm test -- --clearCache`
4. Run single test to isolate issue

### Type Errors

1. Run `npm run typecheck` to see all errors
2. Check `tsconfig.json` configuration
3. Ensure all dependencies have types
4. Add `@types/*` packages if needed

### Debugging Not Working

1. Check `.vscode/launch.json` configuration
2. Ensure `outFiles` paths are correct
3. Verify source maps are generated
4. Check `sourceMap: true` in `tsconfig.json`

## Getting Help

- **Documentation**: [docs/](../docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/traycer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/traycer/discussions)

## Next Steps

- Read [Architecture](architecture.md) to understand the system
- Check [API Documentation](api/core.md) for module details
- Review [Contributing Guidelines](guides/contributing.md)
- Join the community discussions

Happy coding! 🚀
