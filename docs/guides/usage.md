# Usage Guide

Comprehensive guide to using Traycer effectively.

## Table of Contents

- [Commands](#commands)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Features](#features)
- [Best Practices](#best-practices)
- [Workflows](#workflows)
- [Tips & Tricks](#tips--tricks)
- [Troubleshooting](#troubleshooting)

## Commands

Access all commands via Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux).

### Generate Development Plan

**Command**: `Traycer: Generate Development Plan`
**Shortcut**: `Cmd+Shift+T` (Mac) / `Ctrl+Shift+T` (Windows/Linux)

Generates a structured plan from your task description.

**Usage**:
1. Trigger command
2. Enter task description
3. Wait for generation
4. Review plan in Traycer panel

### Show Plan View

**Command**: `Traycer: Show Plan View`

Opens the Traycer panel to view current plan.

### Verify Implementation

**Command**: `Traycer: Verify Implementation`

Checks if your implementation matches the plan.

### Export Plan

**Command**: `Traycer: Export Plan`

Exports current plan as markdown file.

## Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Generate Plan | `Cmd+Shift+T` | `Ctrl+Shift+T` |
| Show Plan View | `Cmd+K Cmd+P` | `Ctrl+K Ctrl+P` |
| Toggle Step | `Space` | `Space` |
| Next Step | `↓` | `↓` |
| Previous Step | `↑` | `↑` |

### Customizing Shortcuts

1. Open Keyboard Shortcuts (`Cmd+K Cmd+S`)
2. Search for "Traycer"
3. Click pencil icon to edit
4. Press new key combination
5. Press Enter to save

## Features

### 1. Plan Generation

Transform task descriptions into structured plans.

**Input Types**:
- Feature requests: "Add user authentication"
- Bug fixes: "Fix search not updating after filter change"
- Refactoring: "Refactor database layer to use Prisma"
- Documentation: "Add API documentation for auth endpoints"
- Tests: "Add unit tests for user service"

**Plan Components**:
- **Title**: Concise task summary
- **Description**: Detailed explanation
- **Steps**: Ordered implementation steps with reasoning
- **Files**: Files to create/modify/delete with explanations

**Example Plan**:
```markdown
# Add User Authentication

## Description
Implement JWT-based authentication for user login/logout

## Steps

### 1. Create authentication service
**Reasoning**: Centralized service for handling auth operations

**Files Affected**:
- CREATE: src/auth/authService.ts

### 2. Add login endpoint
**Reasoning**: API endpoint for user authentication

**Files Affected**:
- CREATE: src/api/auth/login.ts
- MODIFY: src/api/index.ts

### 3. Implement JWT token generation
**Reasoning**: Secure token-based authentication

**Files Affected**:
- MODIFY: src/auth/authService.ts

### 4. Add authentication middleware
**Reasoning**: Protect routes requiring authentication

**Files Affected**:
- CREATE: src/middleware/auth.ts

### 5. Update frontend to use auth
**Reasoning**: Integrate backend auth with UI

**Files Affected**:
- MODIFY: src/components/Login.tsx
- MODIFY: src/utils/api.ts

## Files Summary

**To Create (3)**:
- src/auth/authService.ts
- src/api/auth/login.ts
- src/middleware/auth.ts

**To Modify (3)**:
- src/api/index.ts
- src/components/Login.tsx
- src/utils/api.ts
```

### 2. Code Analysis

Traycer analyzes your codebase to generate context-aware plans.

**Analyzed**:
- File structure
- Import/export relationships
- Existing patterns (components, services, utilities)
- Technology stack (React, Express, etc.)
- Naming conventions

**Benefits**:
- Plans follow your project's conventions
- Identifies correct locations for new code
- Suggests consistent patterns
- Avoids duplicating existing functionality

### 3. Progress Tracking

Track implementation progress with interactive checklists.

**Features**:
- Check off completed steps
- Visual progress indicator
- Estimated remaining work
- Time tracking (optional)

**Usage**:
1. Click checkbox next to step to mark complete
2. View progress in header (e.g., "3 of 5 steps completed")
3. Expand/collapse step details
4. Add notes to steps (optional)

### 4. Plan Editing

Modify plans before or during implementation.

**Edit Actions**:
- Add new steps
- Remove unnecessary steps
- Reorder steps
- Update step descriptions
- Change file operations

**How to Edit**:
1. Click "Edit Plan" button
2. Make changes in editor
3. Click "Save Changes"
4. Or click "Discard" to revert

**Example Edit**:
```markdown
<!-- Original -->
1. Create authentication service
2. Add login endpoint

<!-- Edited - added step -->
1. Create authentication service
2. Add authentication types
3. Add login endpoint
```

### 5. Implementation Verification

Verify your work matches the plan.

**Checks**:
- Files created as planned
- Files modified as planned
- Files deleted as planned
- No unexpected changes
- All steps completed

**Report**:
```
✅ Verification Passed

Created Files (3):
✓ src/auth/authService.ts
✓ src/api/auth/login.ts
✓ src/middleware/auth.ts

Modified Files (3):
✓ src/api/index.ts
✓ src/components/Login.tsx
✓ src/utils/api.ts

Summary:
All planned changes implemented successfully!
```

**Failed Verification**:
```
❌ Verification Failed

Missing Files (1):
✗ src/middleware/auth.ts

Unexpected Changes (1):
! src/utils/logger.ts (not in plan)

Summary:
1 file not created, 1 unexpected change
```

## Best Practices

### 1. Write Clear Task Descriptions

**Good**:
- "Add JWT authentication with refresh tokens for user login"
- "Fix bug where clicking logout doesn't clear session cookie"
- "Refactor user service to separate data access from business logic"

**Poor**:
- "Add auth" (too vague)
- "Fix bug" (no details)
- "Make it better" (unclear goal)

**Template**:
```
[Action] [Component] [Details]

Examples:
- Add user authentication with JWT tokens
- Fix search component not updating after filter change
- Refactor database connection to use connection pooling
```

### 2. Review Plans Before Implementing

Always review generated plans:
- **Check completeness**: Are all necessary steps included?
- **Verify file locations**: Are files in the right places?
- **Validate order**: Do steps follow logical sequence?
- **Edit if needed**: Plans are starting points, not gospel

### 3. Keep Plans Focused

One plan per feature/fix:
- ✅ "Add user authentication"
- ❌ "Add authentication, update UI, refactor database, add tests"

Break large tasks into multiple plans:
```
Plan 1: Add basic authentication
Plan 2: Add refresh token support
Plan 3: Add multi-factor authentication
```

### 4. Track Progress Consistently

Check off steps as you complete them:
- Helps maintain focus
- Shows what's left
- Enables pausing/resuming
- Documents what was done

### 5. Verify After Implementation

Always verify:
- Confirms completeness
- Catches forgotten files
- Documents changes
- Provides confidence

## Workflows

### Workflow 1: Solo Development

**Use Case**: Individual developer working on feature

**Steps**:
1. Generate plan for feature
2. Review and edit plan
3. Implement step-by-step
4. Check off steps as you go
5. Verify when complete
6. Export plan for documentation

### Workflow 2: Pair Programming

**Use Case**: Two developers working together

**Steps**:
1. Navigator generates plan
2. Both review and discuss plan
3. Driver implements while navigator tracks progress
4. Switch roles between steps
5. Verify together when complete

### Workflow 3: AI-Assisted Development

**Use Case**: Using AI coding assistant (Copilot, Cursor, etc.)

**Steps**:
1. Generate plan in Traycer
2. Share plan with AI assistant
3. Ask AI to implement each step
4. Review AI's implementation
5. Check off completed steps
6. Verify to catch AI drift

**Example Prompt for AI**:
```
I have a development plan to implement. Please follow it step-by-step.

Step 1: Create authentication service
- File: src/auth/authService.ts
- Purpose: Centralized service for handling auth operations

Please implement Step 1 now.
```

### Workflow 4: Code Review

**Use Case**: Reviewing pull requests

**Steps**:
1. Reviewer generates plan for PR description
2. Compare PR changes to plan
3. Check if all planned files changed
4. Verify no unexpected changes
5. Comment on deviations

## Tips & Tricks

### Tip 1: Use Natural Language

Write task descriptions as you would explain to a colleague:
```
✅ "Add a dark mode toggle button to the app header that persists user preference in localStorage"

❌ "Implement class ThemeToggleButton extends React.Component"
```

### Tip 2: Leverage Code Analysis

Traycer analyzes your codebase - use specific terms:
```
✅ "Add authentication to UserService"
(Traycer finds existing UserService)

❌ "Add authentication somewhere"
(Traycer can't determine location)
```

### Tip 3: Iterate Plans

Don't expect perfect plans:
1. Generate initial plan
2. Review and identify issues
3. Edit plan
4. Implement
5. Learn for next plan

### Tip 4: Export for Documentation

Export plans as documentation:
```bash
# Plan becomes implementation documentation
docs/features/user-authentication.md
```

### Tip 5: Use Plans as PR Descriptions

Export plan and use as PR description:
- Clear implementation path
- Rationale for changes
- Complete file list
- Easy to review

## Troubleshooting

### Plan Generation is Slow

**Cause**: Large codebase analysis

**Solutions**:
- Add files to `.traycerignore`
- Exclude `node_modules`, `dist`, etc.
- Close unrelated workspace folders

### Plans Missing Context

**Cause**: Insufficient workspace analysis

**Solutions**:
- Ensure project is properly opened in VS Code
- Check that relevant files are included
- Verify file extensions are supported
- Provide more specific task description

### Verification Always Fails

**Cause**: Git status not clean before implementation

**Solutions**:
- Commit or stash changes before generating plan
- Note which files are modified before starting
- Use git diff to check actual changes

### Extension Not Responding

**Solutions**:
1. Check Developer Tools for errors (Help → Toggle Developer Tools)
2. Reload VS Code window (`Cmd+Shift+P` → "Reload Window")
3. Restart VS Code
4. Reinstall extension

### Plans Are Too Generic

**Cause**: Vague task description or small codebase

**Solutions**:
- Provide more specific task description
- Include relevant context in description
- Manually edit plan to add specifics
- Build up more codebase for analysis

## Settings

Access settings: `Cmd+,` → Search "Traycer"

### Available Settings

```json
{
  "traycer.maxFileSize": 1048576,  // Max file size to analyze (bytes)
  "traycer.excludePatterns": [     // Files to exclude from analysis
    "**/node_modules/**",
    "**/dist/**",
    "**/.git/**"
  ],
  "traycer.autoVerify": false,     // Auto-verify after implementation
  "traycer.saveHistory": true,     // Save plan history
  "traycer.maxHistorySize": 50     // Max plans in history
}
```

## See Also

- [Getting Started](getting-started.md) - Initial setup
- [API Documentation](../api/core.md) - Developer API
- [Contributing](contributing.md) - Contribute to Traycer
