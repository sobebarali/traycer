/**
 * Filters words based on stop words and minimum length
 */

import { getStopWords } from './stopWords';
import { getActionVerbs } from './actionVerbs';

/**
 * Filters words based on stop words and minimum length
 * @param words - Array of words to filter
 * @returns Filtered array of words
 */
export function filterWords(words: string[]): string[] {
  const stopWords = getStopWords();
  const actionVerbs = getActionVerbs();

  return words.filter((word) => {
    const lowerWord = word.toLowerCase();

    // Filter out stop words
    if (stopWords.has(lowerWord)) {
      return false;
    }

    // Filter out action verbs (but keep domain nouns like "feature", "bug", "test")
    if (actionVerbs.has(lowerWord)) {
      return false;
    }

    // Keep words that are:
    // - At least 2 characters long
    // - Contain at least one letter
    return word.length >= 2 && /[a-zA-Z]/.test(word);
  });
}
