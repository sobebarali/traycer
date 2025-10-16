/**
 * Identifies the scope (keywords/topics) from a task description
 */

import { extractWords } from './extractWords';
import { filterWords } from './filterWords';

/**
 * Identifies the scope (keywords/topics) from the description
 * @param description - Task description
 * @returns Array of scope keywords
 */
export function identifyScope(description: string): string[] {
  if (!description || description.trim().length === 0) {
    return [];
  }

  // Extract words and filter
  const words = extractWords(description);
  const filteredWords = filterWords(words);
  const uniqueWords = [...new Set(filteredWords)]; // Remove duplicates

  return uniqueWords;
}
