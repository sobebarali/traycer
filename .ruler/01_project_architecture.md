## Project Structure

This is a VS Code Extension project with the following structure:

- **VS Code Extension** with TypeScript
- **WebView UI** with React for interactive plan viewer
- **Node.js** runtime for code analysis and plan generation
- **TypeScript Compiler API** for AST parsing and code understanding
- **Jest** for testing

## Available Scripts

### Development
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Run Prettier for code formatting

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Extension Development
- `F5` in VS Code - Launch extension in debug mode
- `npm run vscode:prepublish` - Prepare for publishing
- `npm run package` - Package extension as VSIX

## Post-Task Commands

**MANDATORY**: After completing any task, run:
1. `npm run typecheck` - Verify TypeScript compilation
2. `npm run lint` - Check code quality
3. `npm run format` - Format code consistently

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
