## Project Structure

This is a VS Code Extension project with the following structure:

- **VS Code Extension** with TypeScript
- **WebView UI** with React for interactive plan viewer
- **Node.js** runtime for code analysis and plan generation
- **TypeScript Compiler API** for AST parsing and code understanding
- **Jest** for testing

## Available Scripts

### Build & Verify
- `npm run build` - **Complete build process** (typecheck + lint + format + compile)
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Run Prettier for code formatting

### Development
- `npm run watch` - Watch mode for development
- `F5` in VS Code - Launch extension in debug mode

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Extension Development
- `npm run vscode:prepublish` - Prepare for publishing
- `npm run package` - Package extension as VSIX

## Post-Task Commands

**MANDATORY**: After completing any task, run ONE of these:

**Option 1: Quick Validation (Recommended)**
```bash
npm run build
```
This runs all checks: typecheck → lint → format → compile

**Option 2: Individual Commands**
```bash
npm run typecheck  # Verify TypeScript compilation
npm run lint       # Check code quality
npm run format     # Format code consistently
```

**Note:** User runs tests manually

## Key Architecture

- **Extension Entry**: VS Code extension activation and command registration
- **Core Logic**: Plan generation, code analysis, and task parsing
- **UI Layer**: WebView panels for interactive plan viewing
- **Utils**: File system operations, AST parsing, and helpers
- **Type Safety**: End-to-end TypeScript with strict mode

## Core Technologies

- **TypeScript 5** - Type-safe extension development
- **VS Code Extension API** - Extension host integration
- **Node.js** - Runtime for file operations and code analysis
- **React 18** - UI framework for webview panels
- **TypeScript Compiler API** - AST parsing and code analysis
- **Jest** - Testing framework
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting

## Extension Architecture

**Activation**: Extension activates on workspace open or command trigger
**Commands**: User-triggered commands for plan generation
**WebView**: Interactive UI for plan display and editing
**File Analysis**: Parse and understand project structure
**Plan Storage**: Store plans in workspace state or files

## Development Workflow

**Local Development**: Use F5 to launch Extension Development Host
**Testing**: Run Jest tests for core logic
**Debugging**: Use VS Code debugger with breakpoints
**Packaging**: Create VSIX for distribution
