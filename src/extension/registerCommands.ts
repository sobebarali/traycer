/**
 * Registers all extension commands
 */

import * as vscode from 'vscode';
import { handleGeneratePlan } from './handleGeneratePlan';
import { handleShowPlan } from './handleShowPlan';

/**
 * Registers all extension commands
 * @param context - Extension context
 */
export function registerCommands(context: vscode.ExtensionContext): void {
  // Register command: Generate Development Plan
  const generatePlanCommand = vscode.commands.registerCommand(
    'traycer.generatePlan',
    handleGeneratePlan
  );

  // Register command: Show Current Plan
  const showPlanCommand = vscode.commands.registerCommand('traycer.showPlan', handleShowPlan);

  // Add commands to subscriptions for proper cleanup
  context.subscriptions.push(generatePlanCommand);
  context.subscriptions.push(showPlanCommand);
}
