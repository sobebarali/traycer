/**
 * Filters sensitive data from context objects
 */

/**
 * Filters sensitive data from context object
 * @param context - Context object that may contain sensitive data
 * @returns Sanitized context object
 */
export function filterSensitiveData(context: object): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'apiKey',
    'api_key',
    'token',
    'secret',
    'credentials',
    'authorization',
    'auth',
  ];

  const pathKeys = ['filePath', 'path', 'file', 'directory', 'dir'];

  function recursiveFilter(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(recursiveFilter);
    }

    const filtered: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();

      // Filter sensitive keys
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive.toLowerCase()))) {
        filtered[key] = '[REDACTED]';
        continue;
      }

      // Filter file paths
      if (pathKeys.some((pathKey) => lowerKey.includes(pathKey.toLowerCase()))) {
        filtered[key] = '[REDACTED]';
        continue;
      }

      // Recursively filter nested objects
      if (typeof value === 'object' && value !== null) {
        filtered[key] = recursiveFilter(value);
      } else {
        filtered[key] = value;
      }
    }

    return filtered;
  }

  return recursiveFilter(context) as Record<string, unknown>;
}
