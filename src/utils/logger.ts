/**
 * Logger utility for extension
 */

import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | null = null;

/**
 * Initializes the logger with a VS Code output channel
 */
export function initLogger(): void {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Traycer');
  }
}

/**
 * Gets the current timestamp in ISO format
 * @returns Formatted timestamp string
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Filters sensitive data from context object
 * @param context - Context object that may contain sensitive data
 * @returns Sanitized context object
 */
function filterSensitiveData(context: object): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'apiKey',
    'api_key',
    'token',
    'secret',
    'credentials',
    'authorization',
    'auth',
  ];

  const pathKeys = ['filePath', 'path', 'file', 'directory', 'dir'];

  function recursiveFilter(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(recursiveFilter);
    }

    const filtered: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();

      // Filter sensitive keys
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive.toLowerCase()))) {
        filtered[key] = '[REDACTED]';
        continue;
      }

      // Filter file paths
      if (pathKeys.some((pathKey) => lowerKey.includes(pathKey.toLowerCase()))) {
        filtered[key] = '[REDACTED]';
        continue;
      }

      // Recursively filter nested objects
      if (typeof value === 'object' && value !== null) {
        filtered[key] = recursiveFilter(value);
      } else {
        filtered[key] = value;
      }
    }

    return filtered;
  }

  return recursiveFilter(context) as Record<string, unknown>;
}

/**
 * Logs an informational message
 * @param message - Message to log
 * @param context - Optional context object
 */
export function log(message: string, context?: object): void {
  if (!outputChannel) {
    initLogger();
  }

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [INFO] ${message}`;

  outputChannel?.appendLine(logMessage);

  if (context) {
    const filtered = filterSensitiveData(context);
    outputChannel?.appendLine(`Context: ${JSON.stringify(filtered, null, 2)}`);
  }
}

/**
 * Logs a warning message
 * @param message - Warning message to log
 * @param context - Optional context object
 */
export function warn(message: string, context?: object): void {
  if (!outputChannel) {
    initLogger();
  }

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [WARN] ${message}`;

  outputChannel?.appendLine(logMessage);

  if (context) {
    const filtered = filterSensitiveData(context);
    outputChannel?.appendLine(`Context: ${JSON.stringify(filtered, null, 2)}`);
  }
}

/**
 * Logs an error message
 * @param message - Error message to log
 * @param err - Optional Error object
 */
export function error(message: string, err?: Error): void {
  if (!outputChannel) {
    initLogger();
  }

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [ERROR] ${message}`;

  outputChannel?.appendLine(logMessage);

  if (err) {
    outputChannel?.appendLine(`Error: ${err.message}`);

    // Only log stack trace in development
    if (process.env.NODE_ENV === 'development' && err.stack) {
      outputChannel?.appendLine(`Stack trace:\n${err.stack}`);
    }
  }
}
