/**
 * Action verbs to filter out from scope keywords
 */

/**
 * Gets action verbs to filter out (not domain nouns)
 * @returns Set of action verbs
 */
export function getActionVerbs(): Set<string> {
  return new Set([
    'add',
    'create',
    'implement',
    'build',
    'fix',
    'improve',
    'optimize',
    'clean',
    'restructure',
    'reorganize',
    'document',
  ]);
}
