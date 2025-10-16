/**
 * Gets the current timestamp in ISO format
 */

/**
 * Gets the current timestamp in ISO format
 * @returns Formatted timestamp string
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
