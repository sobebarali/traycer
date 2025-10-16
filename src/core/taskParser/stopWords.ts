/**
 * Stop words for filtering scope keywords
 */

/**
 * Gets the set of stop words to filter out from scope
 * @returns Set of stop words
 */
export function getStopWords(): Set<string> {
  return new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'can',
    'may',
    'might',
    'this',
    'that',
    'these',
    'those',
    'it',
    'its',
  ]);
}
