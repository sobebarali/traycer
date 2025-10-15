# Contributing to Traycer

Thank you for your interest in contributing to Traycer! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes**:
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Report violations to [conduct@traycer.ai](mailto:conduct@traycer.ai). All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **VS Code** latest stable version
- **Git** installed and configured
- GitHub account

### First-Time Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/traycer.git
   cd traycer
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/traycer.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Build the project**
   ```bash
   npm run compile
   ```

6. **Run tests**
   ```bash
   npm test
   ```

7. **Launch in VS Code**
   ```bash
   code .
   # Press F5 to start Extension Development Host
   ```

## Development Setup

See [Development Guide](../development.md) for detailed setup instructions.

### Quick Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode (auto-compile)
npm run watch

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

## How to Contribute

### Ways to Contribute

1. **Report Bugs** - Found a bug? Create an issue
2. **Suggest Features** - Have an idea? Open a discussion
3. **Fix Issues** - Browse open issues and submit PRs
4. **Improve Docs** - Documentation can always be better
5. **Write Tests** - More test coverage is always good
6. **Review PRs** - Help review others' contributions

### Finding Issues

Good issues for first-time contributors are labeled:
- `good first issue` - Easy issues for newcomers
- `help wanted` - Issues that need attention
- `documentation` - Documentation improvements

Browse issues: [GitHub Issues](https://github.com/yourusername/traycer/issues)

### Reporting Bugs

**Before reporting**:
1. Check existing issues
2. Try latest version
3. Can you reproduce it?

**Creating bug report**:

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 14.0]
- VS Code Version: [e.g. 1.85.0]
- Traycer Version: [e.g. 0.1.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

**Before suggesting**:
1. Check existing feature requests
2. Ensure it aligns with project goals
3. Consider implementation complexity

**Creating feature request**:

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

## Pull Request Process

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Refactoring
- `chore/` - Maintenance

### 2. Make Changes

Follow the [TDD workflow](../../.ruler/03_ai_workflow.md):

1. **Write tests first**
   ```typescript
   // test/core/planGenerator.test.ts
   it('should generate plan with steps', async () => {
     const plan = await generator.generatePlan('Add feature');
     expect(plan.steps.length).toBeGreaterThan(0);
   });
   ```

2. **Watch test fail**
   ```bash
   npm run test:watch
   ```

3. **Implement feature**
   ```typescript
   // src/core/planGenerator.ts
   async generatePlan(description: string): Promise<Plan> {
     // Implementation
   }
   ```

4. **Watch test pass**

5. **Refactor if needed**

### 3. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat: add plan export functionality"
git commit -m "fix: resolve file path validation issue"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for code analyzer"
git commit -m "refactor: simplify plan generation logic"
```

**Commit types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### 4. Run Checks

Before pushing, ensure all checks pass:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Formatting
npm run format

# Tests
npm test

# All checks
npm run typecheck && npm run lint && npm run format && npm test
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out PR template
5. Link related issues
6. Submit PR

**PR Template**:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Test addition

## Testing
How has this been tested?

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Commit messages follow convention

## Related Issues
Fixes #123
```

### 7. Code Review

**What to expect**:
- Maintainers will review your PR
- Feedback may be provided
- Changes may be requested
- CI checks must pass

**Responding to feedback**:
1. Address each comment
2. Make requested changes
3. Push additional commits
4. Request re-review

**Example response**:
```markdown
> Can you add tests for the error case?

Good point! Added tests in 3f2a1b4.
```

### 8. Merge

Once approved:
- Maintainer will merge your PR
- Your contribution is live!
- Thank you! 🎉

## Coding Standards

Follow the coding standards in [.ruler/04_coding_style.md](../../.ruler/04_coding_style.md).

### Key Points

**TypeScript**:
- Use strict mode
- Avoid `any` type
- Add JSDoc comments for public APIs
- Use meaningful variable names

**Code Style**:
- Use async/await over promises
- Prefer const over let
- Use destructuring
- Keep functions small (<50 lines)

**Error Handling**:
- Always handle errors
- Provide useful error messages
- Log errors appropriately
- Don't expose internal details to users

**Example**:
```typescript
/**
 * Generates a development plan from a task description.
 *
 * @param taskDescription - Natural language description of the task
 * @returns A structured development plan
 * @throws Error if task description is invalid
 */
async generatePlan(taskDescription: string): Promise<Plan> {
  // Validate input
  if (!taskDescription?.trim()) {
    throw new Error('Task description cannot be empty');
  }

  try {
    // Implementation
    return plan;
  } catch (error) {
    throw new Error(`Failed to generate plan: ${error.message}`);
  }
}
```

## Testing Guidelines

See [.ruler/07_testing_guidelines.md](../../.ruler/07_testing_guidelines.md) for detailed guidelines.

### Test Requirements

**All PRs must include**:
- Unit tests for new functionality
- Tests for bug fixes
- Updated tests for refactoring
- Maintained or improved coverage

### Test Structure

```
test/
├── core/
│   └── planGenerator.test.ts
├── utils/
│   └── fileSystem.test.ts
└── helpers/
    └── mockVscode.ts
```

### Test Example

```typescript
describe('PlanGenerator', () => {
  let generator: PlanGenerator;

  beforeEach(() => {
    generator = new PlanGenerator();
  });

  describe('generatePlan', () => {
    it('should generate plan from description', async () => {
      const plan = await generator.generatePlan('Add feature');

      expect(plan).toBeDefined();
      expect(plan.steps.length).toBeGreaterThan(0);
    });

    it('should throw for empty description', async () => {
      await expect(generator.generatePlan('')).rejects.toThrow();
    });
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm test -- planGenerator.test.ts
```

## Documentation

### Documentation Requirements

**Update documentation when**:
- Adding new features
- Changing APIs
- Fixing bugs that affect usage
- Adding configuration options

**Documentation to update**:
- `README.md` - For user-facing changes
- `docs/api/` - For API changes
- `docs/guides/` - For usage changes
- Code comments - For internal changes

### Writing Documentation

**Good documentation**:
- Clear and concise
- Includes examples
- Explains "why" not just "what"
- Up-to-date with code

**Example**:
```markdown
## generatePlan()

Generates a structured development plan from a task description.

### Parameters
- `taskDescription` (string) - Natural language task description

### Returns
`Promise<Plan>` - Structured plan with steps and files

### Example
\`\`\`typescript
const plan = await generator.generatePlan('Add authentication');
console.log(plan.steps.length); // 5
\`\`\`

### Throws
- `Error` - If task description is empty or invalid
```

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and conversations
- **Pull Requests** - Code contributions

### Getting Help

**Stuck on something?**
1. Check documentation
2. Search existing issues/discussions
3. Ask in GitHub Discussions
4. Reach out to maintainers

### Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README

## Questions?

Have questions about contributing?

- 📖 Read the [Development Guide](../development.md)
- 💬 Ask in [GitHub Discussions](https://github.com/yourusername/traycer/discussions)
- 📧 Email [dev@traycer.ai](mailto:dev@traycer.ai)

---

**Thank you for contributing to Traycer! 🚀**

Every contribution, no matter how small, makes a difference.
