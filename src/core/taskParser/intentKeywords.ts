/**
 * Intent keyword mappings for task classification
 */

import type { TaskIntent } from '../../types';

/**
 * Gets intent keywords for classification
 * @returns Mapping of task intents to their keywords
 */
export function getIntentKeywords(): Record<TaskIntent, string[]> {
  return {
    feature: ['add', 'create', 'implement', 'build', 'new', 'feature', 'features'],
    bugfix: ['fix', 'bug', 'bugs', 'broken', 'error', 'errors', 'issue', 'issues', 'crash'],
    refactor: ['refactor', 'improve', 'optimize', 'clean', 'restructure', 'reorganize'],
    documentation: ['document', 'docs', 'readme', 'guide', 'comment', 'comments'],
    test: ['test', 'tests', 'spec', 'specs', 'testing', 'coverage', 'unit', 'integration'],
  };
}
