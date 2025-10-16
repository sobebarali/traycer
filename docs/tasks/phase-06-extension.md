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
- [ ] Register `traycer.setApiKey` command (for API key management)
- [ ] Initialize core services (Config, AIClient, PlanGenerator, etc.)
- [ ] Check for API key on activation
- [ ] Add subscriptions for cleanup
- [ ] Update `package.json` with commands and activation events

### 6.2 Command Handlers
**Tasks**:
- [ ] Implement "Generate Plan" command
  - Check if API key is configured (prompt if missing)
  - Show input box for task description
  - Validate input
  - Show progress indicator with cancellation support
  - Call PlanGenerator with AI integration
  - Handle AI API errors gracefully
  - Store generated plan
  - Show success message
  - Open plan in webview
- [ ] Implement "Show Plan" command
  - Retrieve current plan from storage
  - Display in webview
  - Handle "no plan" case
- [ ] Implement "Set API Key" command
  - Prompt for Anthropic API key
  - Validate key format (starts with `sk-ant-`)
  - Store securely in SecretStorage
  - Show success confirmation

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
- [ ] API key check on activation works
- [ ] Commands work from command palette:
  - `Traycer: Generate Plan`
  - `Traycer: Show Plan`
  - `Traycer: Set API Key`
- [ ] API key prompts appear when not configured
- [ ] Plans are generated using AI
- [ ] Plans are stored and retrieved correctly
- [ ] Error handling for AI API failures works
- [ ] Progress indicators show during plan generation
- [ ] F5 launches Extension Development Host successfully
- [ ] All tests pass
- [ ] API keys are stored securely (SecretStorage, not settings.json)

---

**Next Phase**: [Phase 7: WebView UI](./phase-07-webview.md)
