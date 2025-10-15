# Phase 6: Extension Integration

**Status**: ⏳ NOT STARTED
**Priority**: CRITICAL
**Dependencies**: Phase 5
**Progress**: 0%

---

## Overview

Integrate core logic with VS Code Extension API. Create extension entry point, command handlers, and state management.

---

## Goals

- [ ] Create extension entry point with activation
- [ ] Implement command handlers
- [ ] Set up state management
- [ ] Store and retrieve plans
- [ ] Integrate with VS Code API

---

## Tasks

### 6.1 Extension Entry Point
**Files to Create**: `src/extension.ts`, `test/extension.test.ts`

**Checklist**:
- [ ] Implement `activate()` function
- [ ] Implement `deactivate()` function
- [ ] Register `traycer.generatePlan` command
- [ ] Register `traycer.showPlan` command
- [ ] Initialize core services
- [ ] Add subscriptions for cleanup
- [ ] Update `package.json` with commands

### 6.2 Command Handlers
**Tasks**:
- [ ] Implement "Generate Plan" command
  - Show input box for task description
  - Validate input
  - Show progress indicator
  - Generate plan
  - Store plan
  - Show success message
  - Open plan in webview
- [ ] Implement "Show Plan" command
  - Retrieve current plan
  - Display in webview
  - Handle "no plan" case

### 6.3 State Management
**Files to Create**: `src/storage/planStorage.ts`

**Tasks**:
- [ ] Create `.traycer/` directory
- [ ] Save plans as JSON
- [ ] Load plans from storage
- [ ] Store plan ID in workspace state
- [ ] Plan history management

---

## Validation Criteria

- [ ] Extension activates correctly
- [ ] Commands work from command palette
- [ ] Plans are stored and retrieved
- [ ] F5 launches successfully
- [ ] All tests pass

---

**Next Phase**: [Phase 7: WebView UI](./phase-07-webview.md)
