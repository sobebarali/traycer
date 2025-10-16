/**
 * Formats API response
 * @param data - Data to format
 * @returns Formatted response
 */
export function formatResponse<T>(data: T): { success: boolean; data: T } {
  return {
    success: true,
    data,
  };
}

/**
 * Generates a random ID
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
