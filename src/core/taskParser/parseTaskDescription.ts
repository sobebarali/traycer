/**
 * Parses a task description into structured task data
 */

import type { TaskDescription } from '../../types';
import { extractIntent } from './extractIntent';
import { identifyScope } from './identifyScope';

/**
 * Parses a task description into structured task data
 * @param description - Natural language task description
 * @returns Structured task description with intent and scope
 * @throws Error if description is invalid
 */
export async function parseTaskDescription(description: string): Promise<TaskDescription> {
  // Validate input
  if (!description || typeof description !== 'string') {
    throw new Error('Task description cannot be empty');
  }

  // Sanitize and trim
  const sanitized = description.trim();

  if (sanitized.length === 0) {
    throw new Error('Task description cannot be empty');
  }

  if (sanitized.length > 10000) {
    throw new Error('Task description too long (max 10000 characters)');
  }

  // Check if description has meaningful content (not just special characters)
  const hasLettersOrNumbers = /[a-zA-Z0-9]/.test(sanitized);
  if (!hasLettersOrNumbers) {
    throw new Error('Task description must contain letters or numbers');
  }

  // Extract intent and scope
  const intent = extractIntent(sanitized);
  const scope = identifyScope(sanitized);

  return {
    title: sanitized,
    description: sanitized,
    intent,
    scope,
  };
}
