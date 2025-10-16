/**
 * Checks if a word is in camelCase format
 */

/**
 * Checks if a word is in camelCase format
 * @param word - Word to check
 * @returns True if word is camelCase
 */
export function isCamelCase(word: string): boolean {
  // camelCase has at least one lowercase letter followed by an uppercase letter
  return /[a-z][A-Z]/.test(word);
}
