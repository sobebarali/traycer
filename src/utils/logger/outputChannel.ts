/**
 * Output channel state management
 */

import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | null = null;

/**
 * Gets the current output channel
 * @returns Output channel or null if not initialized
 */
export function getOutputChannel(): vscode.OutputChannel | null {
  return outputChannel;
}

/**
 * Sets the output channel
 * @param channel - Output channel to set
 */
export function setOutputChannel(channel: vscode.OutputChannel): void {
  outputChannel = channel;
}
