/**
 * Logs a warning message
 */

import { getOutputChannel } from './outputChannel';
import { initLogger } from './initLogger';
import { getTimestamp } from './getTimestamp';
import { filterSensitiveData } from './filterSensitiveData';

/**
 * Logs a warning message
 * @param params - Parameters object
 * @param params.message - Warning message to log
 * @param params.context - Optional context object
 */
export function warn({ message, context }: { message: string; context?: object }): void {
  let outputChannel = getOutputChannel();
  if (!outputChannel) {
    initLogger();
    outputChannel = getOutputChannel();
  }

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [WARN] ${message}`;

  outputChannel?.appendLine(logMessage);

  if (context) {
    const filtered = filterSensitiveData(context);
    outputChannel?.appendLine(`Context: ${JSON.stringify(filtered, null, 2)}`);
  }
}
