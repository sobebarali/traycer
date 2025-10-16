/**
 * Extracts words from a task description
 */

import { isCamelCase } from './isCamelCase';

/**
 * Extracts words from description, handling various formats
 * @param description - Task description
 * @returns Array of words
 */
export function extractWords(description: string): string[] {
  // Replace special characters with spaces, but keep alphanumeric
  const normalized = description
    .replace(/[^\w\s]/g, ' ') // Replace non-word chars with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  // Split on whitespace
  const words = normalized.split(/\s+/);

  // Also try to extract camelCase words
  const allWords: string[] = [];
  for (const word of words) {
    allWords.push(word);

    // Check if word is camelCase and preserve it
    if (isCamelCase(word)) {
      allWords.push(word); // Keep the original camelCase
    }
  }

  return allWords;
}
