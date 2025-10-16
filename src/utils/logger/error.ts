/**
 * Logs an error message
 */

import { getOutputChannel } from './outputChannel';
import { initLogger } from './initLogger';
import { getTimestamp } from './getTimestamp';

/**
 * Logs an error message
 * @param params - Parameters object
 * @param params.message - Error message to log
 * @param params.err - Optional Error object
 */
export function error({ message, err }: { message: string; err?: Error }): void {
  let outputChannel = getOutputChannel();
  if (!outputChannel) {
    initLogger();
    outputChannel = getOutputChannel();
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
