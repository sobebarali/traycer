/**
 * Extension activation function
 */

import * as vscode from 'vscode';
import { registerCommands } from './registerCommands';

/**
 * Extension activation function
 * Called when the extension is activated
 * @param context - Extension context
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Traycer extension is now active');

  // Register all commands
  registerCommands(context);
}
