/**
 * Edge case tests for TaskParser
 */

import { TaskParser } from '../../../src/core/taskParser';

describe('TaskParser - Edge Cases', () => {
  let parser: TaskParser;

  beforeEach(() => {
    parser = new TaskParser();
  });

  describe('Input Validation', () => {
    it('should handle description with only special characters', async () => {
      const description = '!@#$%^&*()_+';
      await expect(parser.parseTaskDescription(description)).rejects.toThrow();
    });

    it('should handle description with unicode characters', async () => {
      const description = 'Add 用户认证 feature with emoji 🚀';
      const result = await parser.parseTaskDescription(description);
      expect(result).toBeDefined();
      expect(result.intent).toBe('feature');
    });

    it('should handle description with multiple spaces', async () => {
      const description = 'Add    user    authentication';
      const result = await parser.parseTaskDescription(description);
      expect(result.scope).toContain('user');
      expect(result.scope).toContain('authentication');
    });

    it('should handle description with line breaks', async () => {
      const description = 'Add user\nauthentication\nfeature';
      const result = await parser.parseTaskDescription(description);
      expect(result).toBeDefined();
    });

    it('should handle description with tabs', async () => {
      const description = 'Add\tuser\tauthentication';
      const result = await parser.parseTaskDescription(description);
      expect(result.scope).toContain('user');
      expect(result.scope).toContain('authentication');
    });
  });

  describe('Intent Ambiguity', () => {
    it('should prioritize first keyword when multiple intents present', () => {
      // "Fix" appears first, should be bugfix
      const intent1 = parser.extractIntent('Fix bug and add new feature');
      expect(intent1).toBe('bugfix');

      // "Add" appears first, should be feature
      const intent2 = parser.extractIntent('Add feature and fix bug');
      expect(intent2).toBe('feature');
    });

    it('should handle description with contradicting keywords', () => {
      const intent = parser.extractIntent('Fix by adding new implementation');
      // "Fix" should take precedence
      expect(intent).toBe('bugfix');
    });
  });

  describe('Scope Extraction Edge Cases', () => {
    it('should handle very short words', () => {
      const scope = parser.identifyScope('Add a to b or c');
      // Single letters (a, b, c) should be filtered, "Add" is intent keyword, "to" and "or" are stopwords
      expect(scope.length).toBe(0);

      // But meaningful short words like API should be kept
      const scope2 = parser.identifyScope('Add API endpoint');
      expect(scope2).toContain('API');
      expect(scope2).toContain('endpoint');
    });

    it('should handle description with only stopwords', () => {
      const scope = parser.identifyScope('the and or but');
      expect(scope).toEqual([]);
    });

    it('should handle description with numbers', () => {
      const scope = parser.identifyScope('Add OAuth2 authentication');
      expect(scope).toContain('OAuth2');
      expect(scope).toContain('authentication');
    });

    it('should handle file paths in description', () => {
      const scope = parser.identifyScope('Fix bug in src/auth/login.ts');
      expect(scope).toContain('auth');
      expect(scope).toContain('login');
    });

    it('should handle URLs in description', () => {
      const scope = parser.identifyScope('Add API endpoint for https://api.example.com/users');
      expect(scope).toContain('API');
      expect(scope).toContain('endpoint');
      expect(scope).toContain('users');
    });
  });

  describe('Performance', () => {
    it('should handle maximum length description efficiently', async () => {
      const maxDescription = 'Add feature ' + 'word '.repeat(1990);
      const start = Date.now();
      await parser.parseTaskDescription(maxDescription);
      const duration = Date.now() - start;

      // Should complete within reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should handle description with many keywords efficiently', async () => {
      const manyKeywords = Array.from({ length: 100 }, (_, i) => `keyword${i}`).join(' ');
      const description = `Add ${manyKeywords}`;

      const start = Date.now();
      const result = await parser.parseTaskDescription(description);
      const duration = Date.now() - start;

      expect(result.scope.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Type Safety', () => {
    it('should return valid TaskIntent type', () => {
      const validIntents: Array<ReturnType<typeof parser.extractIntent>> = [
        'feature',
        'bugfix',
        'refactor',
        'documentation',
        'test',
      ];

      const intent = parser.extractIntent('Add new feature');
      expect(validIntents).toContain(intent);
    });

    it('should always return array for scope', () => {
      const scope = parser.identifyScope('any input');
      expect(Array.isArray(scope)).toBe(true);
    });
  });
});
