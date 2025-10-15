# Getting Started with Traycer

Welcome to Traycer! This guide will help you get started with using the extension.

## Table of Contents

- [What is Traycer?](#what-is-traycer)
- [Installation](#installation)
- [First Steps](#first-steps)
- [Basic Usage](#basic-usage)
- [Example Walkthrough](#example-walkthrough)
- [Next Steps](#next-steps)

## What is Traycer?

Traycer is a VS Code extension that helps you plan your development work before you start coding. It:

- ✨ Generates structured development plans from your task descriptions
- 🔍 Analyzes your codebase to understand existing patterns
- 📋 Provides step-by-step implementation guidance
- ✅ Tracks your progress as you implement
- 🎯 Keeps you focused on the original goal

**Why use Traycer?**
- Reduces "AI drift" when using coding assistants
- Helps maintain focus on the original task
- Provides clear guidance on implementation order
- Documents your thinking for team members

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux) to open Extensions
3. Search for "Traycer"
4. Click **Install**

### From VSIX File

1. Download the `.vsix` file from releases
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Type "Install from VSIX"
5. Select the downloaded file

### Verify Installation

After installation, you should see:
- Traycer icon in the Activity Bar (left sidebar)
- "Traycer" commands in Command Palette (`Cmd+Shift+P`)

## First Steps

### 1. Open a Project

Traycer works best with an existing codebase:

```bash
# Clone or open a project
cd /path/to/your/project
code .
```

### 2. Open Traycer Panel

Click the Traycer icon in the Activity Bar (left sidebar), or:

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Traycer: Show Plan View"
3. Press Enter

### 3. Generate Your First Plan

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Traycer: Generate Development Plan"
3. Press Enter
4. Enter a task description (e.g., "Add user authentication")
5. Wait for the plan to generate
6. Review the plan in the Traycer panel

## Basic Usage

### Generating Plans

**Command**: `Traycer: Generate Development Plan`

**Keyboard Shortcut**: `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)

**Steps**:
1. Trigger the command
2. Enter task description in the input box
3. Wait for analysis and plan generation
4. Review generated plan

**Tips for Good Task Descriptions**:
- Be specific: "Add JWT authentication for users" vs "Add auth"
- Include context: "Fix login bug where users can't logout"
- Mention scope: "Refactor user service to use TypeScript"

**Examples**:
```
✅ Good:
- "Add user authentication with JWT tokens"
- "Fix bug where search results don't update after filter change"
- "Refactor database layer to use Prisma ORM"
- "Add unit tests for user service"

❌ Too Vague:
- "Fix it"
- "Add feature"
- "Update code"
```

### Viewing Plans

Plans appear in the Traycer panel with:
- **Title** - Task description
- **Steps** - Ordered list of implementation steps
- **Files** - Files to create or modify
- **Reasoning** - Why each step is necessary

### Tracking Progress

As you implement, check off completed steps:

1. Click the checkbox next to a step
2. Traycer marks it as complete
3. Progress indicator updates

### Editing Plans

You can edit plans before or during implementation:

1. Click "Edit Plan" button
2. Modify steps, add new ones, or remove unnecessary ones
3. Click "Save Changes"

### Verifying Implementation

After implementing, verify your work matches the plan:

1. Click "Verify Implementation"
2. Traycer checks which files were modified
3. Review the verification report
4. See any deviations from the plan

## Example Walkthrough

Let's walk through a complete example: adding a simple feature.

### Scenario

You want to add a "theme toggle" button to your React app.

### Step 1: Generate Plan

1. Open Command Palette (`Cmd+Shift+P`)
2. Run "Traycer: Generate Development Plan"
3. Enter: "Add dark mode toggle button to app header"
4. Press Enter

### Step 2: Review Generated Plan

Traycer analyzes your code and generates:

```
Plan: Add dark mode toggle button to app header

Steps:
1. Create theme context for managing dark mode state
   Reasoning: Centralized state management for theme across app

2. Add ThemeProvider to root App component
   Reasoning: Wrap app to provide theme context to all components

3. Create ThemeToggle button component
   Reasoning: Reusable component for toggling theme

4. Add ThemeToggle to Header component
   Reasoning: Place toggle in header for easy access

5. Update global styles to support dark mode
   Reasoning: Apply dark mode colors throughout app

Files to Create/Modify:
- CREATE: src/context/ThemeContext.tsx
- CREATE: src/components/ThemeToggle.tsx
- MODIFY: src/App.tsx
- MODIFY: src/components/Header.tsx
- MODIFY: src/styles/global.css
```

### Step 3: Implement

Follow the plan step-by-step:

**Step 1**: Create theme context
```typescript
// src/context/ThemeContext.tsx
// ... implement context
```
✅ Check off step 1

**Step 2**: Add provider to App
```typescript
// src/App.tsx
// ... wrap with ThemeProvider
```
✅ Check off step 2

**Step 3-5**: Continue implementing...

### Step 4: Verify

After implementation:

1. Click "Verify Implementation"
2. Review report:

```
✅ Verification Passed

Files Created:
- src/context/ThemeContext.tsx ✅
- src/components/ThemeToggle.tsx ✅

Files Modified:
- src/App.tsx ✅
- src/components/Header.tsx ✅
- src/styles/global.css ✅

All planned changes implemented successfully!
```

### Step 5: Done!

Your feature is complete, with:
- Clear implementation path followed
- All files updated as planned
- No drift from original goal

## Next Steps

### Learn More

- [Usage Guide](usage.md) - Detailed usage instructions
- [Keyboard Shortcuts](usage.md#keyboard-shortcuts) - Speed up your workflow
- [Best Practices](usage.md#best-practices) - Get the most out of Traycer

### Advanced Features

- **Custom Templates** - Create reusable plan templates
- **Team Collaboration** - Share plans with team members
- **Git Integration** - Link plans to branches/commits

### Get Help

- **Documentation**: [docs/](../../docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/traycer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/traycer/discussions)

### Contributing

Want to improve Traycer?

- Read the [Contributing Guide](contributing.md)
- Check [open issues](https://github.com/yourusername/traycer/issues)
- Submit pull requests

## Tips for Success

### 1. Start Small

Begin with small, well-defined tasks:
- ✅ "Add validation to login form"
- ❌ "Rebuild entire authentication system"

### 2. Review Plans Before Implementing

Take a moment to review the generated plan:
- Do the steps make sense?
- Is anything missing?
- Are files correctly identified?

Edit the plan if needed!

### 3. Check Off Steps as You Go

Maintain progress by checking off steps:
- Keeps you focused
- Shows what's left
- Helps if you need to pause

### 4. Verify When Done

Always run verification:
- Confirms completeness
- Catches forgotten files
- Documents what changed

### 5. Iterate and Improve

Use Traycer iteratively:
- Generate plan
- Implement
- Verify
- Generate next plan

## Common Questions

**Q: Does Traycer write code for me?**
A: No, Traycer generates *plans*, not code. You (or your AI assistant) implement according to the plan.

**Q: Can I edit generated plans?**
A: Yes! Plans are meant to be reviewed and edited before implementation.

**Q: Does it work with my programming language?**
A: Traycer currently works best with TypeScript/JavaScript projects, with support for other languages coming soon.

**Q: Can I use this with AI coding assistants?**
A: Absolutely! That's one of Traycer's main use cases - providing structure for AI assistants to prevent drift.

**Q: Is my code sent anywhere?**
A: No, all analysis happens locally. Your code never leaves your machine.

---

## Ready to Start?

1. ✅ Extension installed
2. ✅ Project open in VS Code
3. ✅ Understand basic usage

**Try it now:**
1. Press `Cmd+Shift+P` (or `Ctrl+Shift+P`)
2. Run "Traycer: Generate Development Plan"
3. Describe a small task you want to implement
4. Review the generated plan

Happy planning! 🚀

For more detailed usage instructions, see the [Usage Guide](usage.md).
