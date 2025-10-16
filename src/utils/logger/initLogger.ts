/**
 * Initializes the logger with a VS Code output channel
 */

import * as vscode from 'vscode';
import { getOutputChannel, setOutputChannel } from './outputChannel';

/**
 * Initializes the logger with a VS Code output channel
 */
export function initLogger(): void {
  const outputChannel = getOutputChannel();
  if (!outputChannel) {
    setOutputChannel(vscode.window.createOutputChannel('Traycer'));
  }
}
