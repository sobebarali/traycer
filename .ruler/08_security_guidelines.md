# 🔐 Security Guidelines - Traycer VS Code Extension

This document outlines security best practices for VS Code extension development to ensure user safety and data protection.

---

## Core Security Principles

* **Least Privilege**: Request only necessary permissions
* **Input Validation**: Validate all user inputs and workspace data
* **Secure Communication**: Use HTTPS for external API calls
* **Data Protection**: Handle user code and data responsibly
* **Privacy by Design**: Respect user privacy and workspace confidentiality
* **Transparency**: Be clear about what data is accessed and how

---

## Extension Permissions

### Requested Permissions

**Be Minimal:**
- Only request permissions actually needed
- Avoid accessing file system outside workspace
- Don't request network access unless required
- Limit command contributions to necessary ones

**Example package.json:**
```json
{
  "contributes": {
    "commands": [
      {
        "command": "traycer.generatePlan",
        "title": "Traycer: Generate Development Plan"
      }
    ]
  },
  "activationEvents": [
    "onStartupFinished"
  ]
}
```

### Activation Events

* Use specific activation events, not `*` (eager activation)
* Prefer `onCommand`, `onView`, or `onStartupFinished`
* Document why each activation event is needed

---

## Input Validation & Sanitization

### User Input

**Always validate user input:**

```typescript
async function generatePlan(taskDescription: string): Promise<Plan> {
  // Validate input
  if (!taskDescription || typeof taskDescription !== 'string') {
    throw new Error('Invalid task description');
  }

  // Sanitize input
  const sanitized = taskDescription.trim();

  if (sanitized.length === 0) {
    throw new Error('Task description cannot be empty');
  }

  if (sanitized.length > 10000) {
    throw new Error('Task description too long (max 10000 characters)');
  }

  // Proceed with validated input
  return await this.processTask(sanitized);
}
```

### File Path Validation

**Validate all file paths:**

```typescript
import * as path from 'path';
import * as vscode from 'vscode';

function validateFilePath(filePath: string): boolean {
  // Ensure path is within workspace
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return false;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const absolutePath = path.resolve(filePath);

  // Check if path is within workspace
  if (!absolutePath.startsWith(workspaceRoot)) {
    throw new Error('File path outside workspace is not allowed');
  }

  // Prevent directory traversal attacks
  if (filePath.includes('..') || filePath.includes('~')) {
    throw new Error('Invalid file path');
  }

  return true;
}
```

---

## WebView Security

### Content Security Policy

**Always use strict CSP:**

```typescript
private getHtmlContent(webview: vscode.Webview): string {
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 style-src ${webview.cspSource} 'unsafe-inline';
                 script-src 'nonce-${nonce}';
                 img-src ${webview.cspSource} https:;
                 font-src ${webview.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Traycer Plan</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
```

### Message Validation

**Validate all messages from webview:**

```typescript
webviewView.webview.onDidReceiveMessage(
  message => {
    // Validate message structure
    if (!message || typeof message.type !== 'string') {
      console.error('Invalid message from webview');
      return;
    }

    // Validate message type
    const allowedTypes = ['stepCompleted', 'planUpdated', 'requestData'];
    if (!allowedTypes.includes(message.type)) {
      console.error('Unknown message type:', message.type);
      return;
    }

    // Validate message data
    if (message.data && typeof message.data !== 'object') {
      console.error('Invalid message data');
      return;
    }

    // Handle message
    switch (message.type) {
      case 'stepCompleted':
        this.handleStepCompleted(message.data);
        break;
      // ... other cases
    }
  },
  undefined,
  this.disposables
);
```

### Sanitize User Content

**Escape HTML in webview:**

```typescript
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayUserContent(content: string): string {
  return `<div>${escapeHtml(content)}</div>`;
}
```

---

## Data Handling

### Sensitive Data

**Never log sensitive information:**

```typescript
// ❌ DON'T DO THIS
console.log('User workspace:', workspacePath);
console.log('File content:', fileContent);
console.log('User credentials:', credentials);

// ✅ DO THIS
console.log('Workspace analysis complete');
console.log('File parsed successfully');
// Don't log credentials at all
```

### Workspace State

**Be careful with state storage:**

```typescript
// Use workspace state for non-sensitive data
context.workspaceState.update('currentPlan', planId);

// Use global state cautiously
context.globalState.update('extensionVersion', version);

// Never store sensitive data in state
// ❌ DON'T: context.globalState.update('apiKey', key);
```

### Temporary Files

**Clean up temporary files:**

```typescript
import * as fs from 'fs';
import * as path from 'path';

async function createTempFile(content: string): Promise<string> {
  const tempPath = path.join(os.tmpdir(), `traycer-${Date.now()}.tmp`);

  try {
    await fs.promises.writeFile(tempPath, content);
    return tempPath;
  } catch (error) {
    throw new Error(`Failed to create temp file: ${error.message}`);
  }
}

async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Failed to cleanup temp file:', error);
  }
}

// Use with try/finally
async function processWithTempFile() {
  const tempFile = await createTempFile('content');
  try {
    // Use temp file
  } finally {
    await cleanupTempFile(tempFile);
  }
}
```

---

## External Communications

### API Calls

**Use HTTPS only:**

```typescript
import * as https from 'https';

async function callExternalAPI(url: string, data: any): Promise<any> {
  // Ensure HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS URLs are allowed');
  }

  // Validate URL
  const parsedUrl = new URL(url);
  if (!isAllowedDomain(parsedUrl.hostname)) {
    throw new Error('Domain not allowed');
  }

  // Make request with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Traycer-VSCode-Extension/1.0.0',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function isAllowedDomain(hostname: string): boolean {
  const allowedDomains = [
    'api.traycer.ai',
    // Add other allowed domains
  ];
  return allowedDomains.includes(hostname);
}
```

---

## Error Handling

### User-Friendly Error Messages

**Don't expose internal details:**

```typescript
// ❌ DON'T: Expose internal errors
catch (error) {
  vscode.window.showErrorMessage(error.stack);
}

// ✅ DO: Show user-friendly messages
catch (error) {
  console.error('Internal error:', error); // Log for debugging
  vscode.window.showErrorMessage(
    'Failed to generate plan. Please try again.'
  );
}
```

### Error Logging

**Log errors securely:**

```typescript
function logError(error: Error, context: string): void {
  // Log error details for debugging
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    // Don't log sensitive data
  });

  // Optionally send telemetry (with user consent)
  if (hasUserConsent()) {
    sendErrorTelemetry({
      context,
      errorType: error.name,
      // Don't include stack traces or sensitive data
    });
  }
}
```

---

## Dependency Management

### Regular Updates

* Keep dependencies up to date
* Run `npm audit` regularly
* Review security advisories
* Use `npm audit fix` to auto-patch vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes (carefully)
npm audit fix --force
```

### Minimal Dependencies

* Only install necessary packages
* Review package before installing
* Check package reputation (downloads, maintainers, last updated)
* Avoid packages with known vulnerabilities

---

## Best Practices Checklist

### ✅ Do

* Validate all user inputs
* Use HTTPS for external calls
* Implement proper CSP for webviews
* Handle errors gracefully without exposing internals
* Clean up resources and temporary files
* Request minimal permissions
* Log errors securely (no sensitive data)
* Keep dependencies updated
* Use nonces for webview scripts
* Validate file paths stay within workspace
* Dispose resources properly
* Handle cancellation tokens

### ❌ Don't

* Don't trust user input without validation
* Don't log sensitive data (paths, content, credentials)
* Don't use eval() or Function() with user input
* Don't expose stack traces to users
* Don't store secrets in code or state
* Don't access files outside workspace without permission
* Don't use HTTP for external communications
* Don't ignore security warnings
* Don't ship with development/debug code enabled
* Don't use `*` activation event
* Don't ignore CSP in webviews

---

## Security Testing

### Manual Testing

* Test with malicious inputs
* Verify file path validation
* Check CSP enforcement
* Test error handling
* Verify no sensitive data in logs

### Automated Testing

```typescript
// test/security/inputValidation.test.ts
describe('Input Validation', () => {
  it('should reject empty task descriptions', async () => {
    await expect(generator.generatePlan('')).rejects.toThrow();
  });

  it('should reject overly long inputs', async () => {
    const longInput = 'A'.repeat(100000);
    await expect(generator.generatePlan(longInput)).rejects.toThrow();
  });

  it('should reject directory traversal attempts', async () => {
    await expect(analyzer.readFile('../../../etc/passwd')).rejects.toThrow();
  });

  it('should sanitize HTML content', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = escapeHtml(malicious);
    expect(sanitized).not.toContain('<script>');
  });
});
```

---

## Incident Response

### If Security Issue Found

1. **Don't panic** - assess the severity
2. **Document the issue** - what, when, how, impact
3. **Fix immediately** - patch the vulnerability
4. **Test thoroughly** - ensure fix works and doesn't break anything
5. **Release update** - publish new version ASAP
6. **Notify users** - if data compromised, notify affected users
7. **Learn** - document lessons learned

---

## Summary

**Key Points:**
- Validate all inputs and file paths
- Use strict CSP for webviews
- Never log sensitive data
- Handle errors securely
- Keep dependencies updated
- Request minimal permissions
- Use HTTPS for external calls
- Clean up resources properly

Security is everyone's responsibility. When in doubt, err on the side of caution.
