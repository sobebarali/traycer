/**
 * Traycer VS Code Extension
 * Entry point for the extension
 */

import * as vscode from 'vscode';

/**
 * Extension activation function
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Traycer extension is now active');

  // Register command: Generate Development Plan
  const generatePlanCommand = vscode.commands.registerCommand('traycer.generatePlan', async () => {
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
  });

  // Register command: Show Current Plan
  const showPlanCommand = vscode.commands.registerCommand('traycer.showPlan', async () => {
    try {
      // TODO: Implement plan viewer in Phase 7
      vscode.window.showInformationMessage('Plan viewer will be implemented in Phase 7');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      vscode.window.showErrorMessage(`Failed to show plan: ${message}`);
    }
  });

  // Add commands to subscriptions for proper cleanup
  context.subscriptions.push(generatePlanCommand);
  context.subscriptions.push(showPlanCommand);
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  console.log('Traycer extension is now deactivated');
}
