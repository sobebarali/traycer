/**
 * Task parser for understanding user intent and extracting task information
 */

import type { TaskDescription, TaskIntent } from '../types';

/**
 * TaskParser class for parsing task descriptions into structured data
 */
export class TaskParser {
  // Intent keywords for classification
  private readonly intentKeywords: Record<TaskIntent, string[]> = {
    feature: ['add', 'create', 'implement', 'build', 'new', 'feature', 'features'],
    bugfix: ['fix', 'bug', 'bugs', 'broken', 'error', 'errors', 'issue', 'issues', 'crash'],
    refactor: ['refactor', 'improve', 'optimize', 'clean', 'restructure', 'reorganize'],
    documentation: ['document', 'docs', 'readme', 'guide', 'comment', 'comments'],
    test: ['test', 'tests', 'spec', 'specs', 'testing', 'coverage', 'unit', 'integration'],
  };

  // Common stop words to filter out from scope
  private readonly stopWords = new Set([
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

  /**
   * Parses a task description into structured task data
   * @param description - Natural language task description
   * @returns Structured task description with intent and scope
   * @throws Error if description is invalid
   */
  async parseTaskDescription(description: string): Promise<TaskDescription> {
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
    const intent = this.extractIntent(sanitized);
    const scope = this.identifyScope(sanitized);

    return {
      title: sanitized,
      description: sanitized,
      intent,
      scope,
    };
  }

  /**
   * Extracts the intent (feature, bugfix, refactor, etc.) from the description
   * Uses smart detection: prioritizes domain-specific intents when they're the main subject
   * @param description - Task description
   * @returns Task intent
   */
  extractIntent(description: string): TaskIntent {
    const lowerDescription = description.toLowerCase();

    // Find all keyword matches with their positions
    const matches: Array<{ intent: TaskIntent; position: number; keyword: string }> = [];

    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      for (const keyword of keywords) {
        // Use word boundary to match whole words only
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        const match = regex.exec(lowerDescription);
        if (match) {
          matches.push({
            intent: intent as TaskIntent,
            position: match.index,
            keyword,
          });
        }
      }
    }

    // If no matches, default to feature
    if (matches.length === 0) {
      return 'feature';
    }

    // Get unique intents found
    const uniqueIntents = [...new Set(matches.map((m) => m.intent))];

    // If only one intent found, use it
    if (uniqueIntents.length === 1) {
      return uniqueIntents[0];
    }

    // Multiple intents found - use smart detection
    // Check if there's a specific domain intent (test, bugfix, refactor, doc)
    const specificIntents = matches.filter((m) => m.intent !== 'feature');
    const uniqueSpecificIntents = [...new Set(specificIntents.map((m) => m.intent))];

    // If only one type of specific intent, check if it's clearly the main subject
    if (uniqueSpecificIntents.length === 1) {
      // Check if "feature" or "features" appears as a noun (explicit mention)
      // vs just action verbs (add, create, build)
      const hasFeatureNoun = matches.some(
        (m) => m.intent === 'feature' && (m.keyword === 'feature' || m.keyword === 'features')
      );

      if (!hasFeatureNoun) {
        // Only action verbs like "add", "create" - specific intent is likely the subject
        // E.g., "Add unit tests" - subject is "tests", not "add"
        return uniqueSpecificIntents[0];
      }
    }

    // Multiple types of specific intents, or feature is explicitly mentioned
    // Use position-based (first keyword wins)
    matches.sort((a, b) => a.position - b.position);
    return matches[0].intent;
  }

  /**
   * Identifies the scope (keywords/topics) from the description
   * @param description - Task description
   * @returns Array of scope keywords
   */
  identifyScope(description: string): string[] {
    if (!description || description.trim().length === 0) {
      return [];
    }

    // Extract words and filter
    const words = this.extractWords(description);
    const filteredWords = this.filterWords(words);
    const uniqueWords = [...new Set(filteredWords)]; // Remove duplicates

    return uniqueWords;
  }

  /**
   * Extracts words from description, handling various formats
   * @param description - Task description
   * @returns Array of words
   */
  private extractWords(description: string): string[] {
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
      if (this.isCamelCase(word)) {
        allWords.push(word); // Keep the original camelCase
      }
    }

    return allWords;
  }

  /**
   * Filters words based on stop words and minimum length
   * @param words - Array of words to filter
   * @returns Filtered array of words
   */
  private filterWords(words: string[]): string[] {
    // Action verbs to filter out (not domain nouns)
    const actionVerbs = new Set([
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

    return words.filter((word) => {
      const lowerWord = word.toLowerCase();

      // Filter out stop words
      if (this.stopWords.has(lowerWord)) {
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

  /**
   * Checks if a word is in camelCase format
   * @param word - Word to check
   * @returns True if word is camelCase
   */
  private isCamelCase(word: string): boolean {
    // camelCase has at least one lowercase letter followed by an uppercase letter
    return /[a-z][A-Z]/.test(word);
  }
}
