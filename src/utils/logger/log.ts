/**
 * Logs an informational message
 */

import { getOutputChannel } from './outputChannel';
import { initLogger } from './initLogger';
import { getTimestamp } from './getTimestamp';
import { filterSensitiveData } from './filterSensitiveData';

/**
 * Logs an informational message
 * @param params - Parameters object
 * @param params.message - Message to log
 * @param params.context - Optional context object
 */
export function log({ message, context }: { message: string; context?: object }): void {
  let outputChannel = getOutputChannel();
  if (!outputChannel) {
    initLogger();
    outputChannel = getOutputChannel();
  }

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [INFO] ${message}`;

  outputChannel?.appendLine(logMessage);

  if (context) {
    const filtered = filterSensitiveData(context);
    outputChannel?.appendLine(`Context: ${JSON.stringify(filtered, null, 2)}`);
  }
}
