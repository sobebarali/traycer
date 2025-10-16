/**
 * Handles the show plan command
 */

import * as vscode from 'vscode';

/**
 * Handles the show plan command
 */
export async function handleShowPlan(): Promise<void> {
  try {
    // TODO: Implement plan viewer in Phase 7
    vscode.window.showInformationMessage('Plan viewer will be implemented in Phase 7');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Failed to show plan: ${message}`);
  }
}
