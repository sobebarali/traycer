# AI Workflow Rules - Traycer VS Code Extension

## 🚨 MANDATORY: Post-Task Commands

After **ANY** code change, run these in order (all must pass):
```bash
npm run typecheck    # Fix TypeScript errors
npm run lint         # Check code quality
npm run format       # Format code
```

**Note:** Tests are run manually by the user, not automatically after code changes.

---

## 🔄 Optimal Task Workflow (Follow This Order)

### Phase 1: Understanding Context (READ FIRST)

**Purpose:** Understand project structure and existing patterns

1. **Read `/README.md`**
   - Project overview and goals
   - Core features and architecture
   - Current implementation status

2. **Read `.ruler/` files**
   - 01_project_architecture.md - Project structure
   - 02_folder_structure.md - Folder organization
   - 04_coding_style.md - Coding conventions

3. **Review existing code** (if applicable)
   - Similar features already implemented
   - Code patterns and conventions used
   - Type definitions in `src/types/`

---

### Phase 2: Learn from Existing Code (READ PATTERNS)

**Purpose:** Understand implementation patterns before writing new code

4. **Read similar existing modules** (if any)
   - Example: If adding plan storage, read existing file operations in `utils/fileSystem.ts`
   - Understand the pattern and structure

5. **Read existing types** (REFERENCE ONLY)
   - `src/types/index.ts`
   - Understand data structures used
   - Reference existing types, don't duplicate

6. **Read VS Code API usage**
   - How commands are registered
   - How webviews are created
   - How workspace is accessed

---

### Phase 3: Design & Plan

**Purpose:** Plan implementation before writing code

7. **Define interfaces and types**
   - Add new types to `src/types/index.ts`
   - Follow existing naming conventions
   - Use TypeScript strict mode

8. **Plan module structure**
   - Which files need to be created/modified
   - Dependencies between modules
   - Public API surface

---

### Phase 4: Write Tests First (TDD)

**Purpose:** Define expected behavior before implementation

9. **Create test files** in `test/{module}/`
   ```
   test/{module}/
   ├── {feature}.test.ts    # Main functionality tests
   ├── edge-cases.test.ts   # Edge case handling
   └── integration.test.ts  # Integration tests
   ```

10. **Write test cases**
    - Success cases
    - Error handling
    - Edge cases
    - Integration scenarios

---

### Phase 5: Implementation (MAKE TESTS PASS)

**Purpose:** Implement code to satisfy the tests (TDD approach)

**Order matters - implement to make tests pass:**

11. **Implement core logic** → `src/core/{module}.ts`
12. **Implement utilities** → `src/utils/{module}.ts` (if needed)
13. **Implement UI** → `src/ui/{module}.ts` (if needed)
14. **Register commands** → `src/extension.ts`
15. **User runs tests manually** → `npm test`

---

### Phase 6: Documentation (UPDATE DOCS)

**Purpose:** Keep documentation in sync with code

16. **Update `/README.md`** (if major feature)
    - Add to core features if significant
    - Update architecture section if needed
    - Keep user-facing and concise

17. **Add JSDoc comments**
    - Document public APIs
    - Include parameter descriptions
    - Add usage examples for complex functions

18. **Update type definitions**
    - Ensure all public types are exported
    - Add JSDoc comments to interfaces

---

## 📝 VS Code Extension Development Standards

### Extension Activation

**Activation Events:**
- Use `onStartupFinished` for general activation
- Use `onCommand:{command}` for command-specific activation
- Avoid eager activation unless necessary

**Example:**
```json
"activationEvents": [
  "onStartupFinished",
  "onView:traycer.planView"
]
```

### Command Registration

**Pattern:**
```typescript
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
  const generatePlanCommand = vscode.commands.registerCommand(
    'traycer.generatePlan',
    async () => {
      // Command implementation
    }
  );

  context.subscriptions.push(generatePlanCommand);
}
```

### WebView Best Practices

1. **Security:**
   - Enable script nonce for inline scripts
   - Restrict resource loading with CSP
   - Sanitize user input

2. **Communication:**
   - Use message passing for extension ↔ webview communication
   - Define clear message types
   - Handle errors gracefully

3. **State Management:**
   - Use `getState()` and `setState()` for webview state
   - Persist important state in workspace storage

---

## Self-Check Questions

Before completing a task:

1. ✅ Did I read existing patterns first?
2. ✅ Did I write tests BEFORE implementation? (TDD)
3. ✅ Did I add/modify commands? → Update `package.json` contributions
4. ✅ Did I add new types? → Export from `src/types/index.ts`
5. ✅ Did I add webview UI? → Implement proper message handling
6. ✅ Did post-task commands (typecheck, lint, format) pass?
7. ✅ Did I add JSDoc comments for public APIs?
8. ✅ Did I update README for major features?
9. ✅ Did I follow VS Code extension best practices?

---

## Common Mistakes

### ❌ Don't Do This:

1. **Writing code before reading context**
   ```
   ❌ Immediately write implementation
   ❌ Skip reading existing patterns
   ❌ Invent new patterns instead of following existing
   ```

2. **Wrong implementation order (Not following TDD)**
   ```
   ❌ Write implementation before tests
   ❌ Skip writing tests first
   ❌ Test after everything is done
   ```

3. **Skipping documentation**
   ```
   ❌ No JSDoc comments on public APIs
   ❌ Skip updating README for major features
   ❌ No type documentation
   ```

4. **Poor VS Code API usage**
   ```
   ❌ Eager activation without reason
   ❌ Not disposing resources
   ❌ Ignoring cancellation tokens
   ❌ Synchronous operations on main thread
   ```

### ✅ Do This Instead:

1. **Always read context first**
   ```
   ✅ Read README.md and .ruler/ files
   ✅ Study similar existing code
   ✅ Follow established patterns
   ```

2. **Follow TDD workflow**
   ```
   ✅ Tests → Implementation → Documentation
   ✅ Write tests first to define behavior
   ✅ Implement to make tests pass
   ```

3. **Document thoroughly**
   ```
   ✅ JSDoc for all public APIs
   ✅ Update README for major features
   ✅ Export and document types
   ```

4. **Follow VS Code best practices**
   ```
   ✅ Use appropriate activation events
   ✅ Dispose resources properly
   ✅ Handle cancellation tokens
   ✅ Use async operations appropriately
   ```

---

## Quick Reference

**Workflow**: Read → Plan → Tests → Implement → Document → Verify
**Key Rule**: Write tests BEFORE implementation (TDD)
**Post-Task**: typecheck → lint → format (user runs tests manually)

---

## Summary

**The optimal TDD workflow is:**

1. 📖 **Read** → Understand project and existing patterns
2. 🎯 **Plan** → Design types and module structure
3. 🧪 **Test First** → Write tests before implementation (TDD)
4. ✍️ **Implement** → Write code to make tests pass
5. 📝 **Document** → Add JSDoc and update README
6. ✅ **Verify** → Run typecheck, lint, format (user runs tests)

**Key principles:**
- Read before write
- Test-driven development (write tests first)
- Implement to make tests pass
- Document public APIs
- Follow VS Code extension best practices
- User runs tests manually
