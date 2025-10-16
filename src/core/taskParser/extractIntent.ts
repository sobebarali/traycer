/**
 * Extracts the intent (feature, bugfix, refactor, etc.) from a task description
 */

import type { TaskIntent } from '../../types';
import { getIntentKeywords } from './intentKeywords';

/**
 * Extracts the intent (feature, bugfix, refactor, etc.) from the description
 * Uses smart detection: prioritizes domain-specific intents when they're the main subject
 * @param description - Task description
 * @returns Task intent
 */
export function extractIntent(description: string): TaskIntent {
  const lowerDescription = description.toLowerCase();
  const intentKeywords = getIntentKeywords();

  // Find all keyword matches with their positions
  const matches: Array<{ intent: TaskIntent; position: number; keyword: string }> = [];

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
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
