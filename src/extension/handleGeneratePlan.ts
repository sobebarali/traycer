/**
 * Handles the generate plan command
 */

import * as vscode from 'vscode';

/**
 * Handles the generate plan command
 */
export async function handleGeneratePlan(): Promise<void> {
  try {
    const taskDescription = await vscode.window.showInputBox({
      prompt: 'Enter task description',
      placeHolder: 'e.g., Add user authentication feature',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Task description cannot be empty';
        }
        return null;
      },
    });

    if (!taskDescription) {
      return;
    }

    vscode.window.showInformationMessage(`Generating plan for: ${taskDescription}...`);

    // TODO: Implement plan generation logic in Phase 5
    vscode.window.showInformationMessage('Plan generation will be implemented in Phase 5');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Failed to generate plan: ${message}`);
  }
}
