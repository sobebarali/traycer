/**
 * Tests for TaskParser
 */

import { TaskParser } from '../../src/core/taskParser';
import type { TaskDescription } from '../../src/types';

describe('TaskParser', () => {
  let parser: TaskParser;

  beforeEach(() => {
    parser = new TaskParser();
  });

  describe('parseTaskDescription', () => {
    it('should parse feature task description', async () => {
      const description = 'Add user authentication with JWT tokens';
      const result: TaskDescription = await parser.parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.title).toBe('Add user authentication with JWT tokens');
      expect(result.description).toBe(description);
      expect(result.intent).toBe('feature');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('JWT');
    });

    it('should parse bugfix task description', async () => {
      const description = 'Fix login button not working on mobile';
      const result = await parser.parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('bugfix');
      expect(result.scope).toContain('login');
      expect(result.scope).toContain('mobile');
    });

    it('should parse refactor task description', async () => {
      const description = 'Refactor authentication module to improve performance';
      const result = await parser.parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('refactor');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('performance');
    });

    it('should parse documentation task description', async () => {
      const description = 'Document the API endpoints for user management';
      const result = await parser.parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('documentation');
      expect(result.scope).toContain('API');
      expect(result.scope).toContain('user');
    });

    it('should parse test task description', async () => {
      const description = 'Add unit tests for authentication service';
      const result = await parser.parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('test');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('service');
    });

    it('should throw error for empty description', async () => {
      await expect(parser.parseTaskDescription('')).rejects.toThrow(
        'Task description cannot be empty'
      );
    });

    it('should throw error for whitespace-only description', async () => {
      await expect(parser.parseTaskDescription('   ')).rejects.toThrow(
        'Task description cannot be empty'
      );
    });

    it('should throw error for very long description', async () => {
      const longDescription = 'A'.repeat(10001);
      await expect(parser.parseTaskDescription(longDescription)).rejects.toThrow(
        'Task description too long (max 10000 characters)'
      );
    });

    it('should handle description with exactly 10000 characters', async () => {
      const maxDescription = 'Add feature ' + 'A'.repeat(9988);
      const result = await parser.parseTaskDescription(maxDescription);
      expect(result).toBeDefined();
    });
  });

  describe('extractIntent', () => {
    it('should detect feature intent with "add" keyword', () => {
      const intent = parser.extractIntent('Add new payment gateway');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "create" keyword', () => {
      const intent = parser.extractIntent('Create user dashboard');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "implement" keyword', () => {
      const intent = parser.extractIntent('Implement real-time notifications');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "build" keyword', () => {
      const intent = parser.extractIntent('Build search functionality');
      expect(intent).toBe('feature');
    });

    it('should detect bugfix intent with "fix" keyword', () => {
      const intent = parser.extractIntent('Fix broken navigation menu');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "bug" keyword', () => {
      const intent = parser.extractIntent('Bug in user profile loading');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "broken" keyword', () => {
      const intent = parser.extractIntent('Broken authentication flow');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "error" keyword', () => {
      const intent = parser.extractIntent('Error when submitting form');
      expect(intent).toBe('bugfix');
    });

    it('should detect refactor intent with "refactor" keyword', () => {
      const intent = parser.extractIntent('Refactor database queries');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "improve" keyword', () => {
      const intent = parser.extractIntent('Improve code structure');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "optimize" keyword', () => {
      const intent = parser.extractIntent('Optimize rendering performance');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "clean" keyword', () => {
      const intent = parser.extractIntent('Clean up legacy code');
      expect(intent).toBe('refactor');
    });

    it('should detect documentation intent with "document" keyword', () => {
      const intent = parser.extractIntent('Document API endpoints');
      expect(intent).toBe('documentation');
    });

    it('should detect documentation intent with "docs" keyword', () => {
      const intent = parser.extractIntent('Update docs for new features');
      expect(intent).toBe('documentation');
    });

    it('should detect documentation intent with "readme" keyword', () => {
      const intent = parser.extractIntent('Update README with installation steps');
      expect(intent).toBe('documentation');
    });

    it('should detect test intent with "test" keyword', () => {
      const intent = parser.extractIntent('Add tests for user service');
      expect(intent).toBe('test');
    });

    it('should detect test intent with "spec" keyword', () => {
      const intent = parser.extractIntent('Write spec for authentication');
      expect(intent).toBe('test');
    });

    it('should detect test intent with "testing" keyword', () => {
      const intent = parser.extractIntent('Testing coverage for API');
      expect(intent).toBe('test');
    });

    it('should default to feature intent when no keyword matches', () => {
      const intent = parser.extractIntent('Update user profile page');
      expect(intent).toBe('feature');
    });

    it('should be case-insensitive', () => {
      expect(parser.extractIntent('FIX broken button')).toBe('bugfix');
      expect(parser.extractIntent('ADD new feature')).toBe('feature');
      expect(parser.extractIntent('REFACTOR code')).toBe('refactor');
    });
  });

  describe('identifyScope', () => {
    it('should extract multiple keywords from description', () => {
      const scope = parser.identifyScope('Add user authentication with JWT tokens');
      expect(scope).toContain('user');
      expect(scope).toContain('authentication');
      expect(scope).toContain('JWT');
      expect(scope).toContain('tokens');
    });

    it('should filter out common words', () => {
      const scope = parser.identifyScope('Add the new user authentication feature');
      expect(scope).not.toContain('the');
      expect(scope).not.toContain('add');
      expect(scope).toContain('user');
      expect(scope).toContain('authentication');
      expect(scope).toContain('feature');
    });

    it('should handle empty description', () => {
      const scope = parser.identifyScope('');
      expect(scope).toEqual([]);
    });

    it('should extract meaningful technical terms', () => {
      const scope = parser.identifyScope('Implement GraphQL API with Apollo Server');
      expect(scope).toContain('GraphQL');
      expect(scope).toContain('API');
      expect(scope).toContain('Apollo');
      expect(scope).toContain('Server');
    });

    it('should handle camelCase identifiers', () => {
      const scope = parser.identifyScope('Fix userAuthentication bug in loginService');
      expect(scope).toContain('userAuthentication');
      expect(scope).toContain('loginService');
    });

    it('should remove duplicates', () => {
      const scope = parser.identifyScope('Fix user user authentication');
      const userCount = scope.filter((word) => word === 'user').length;
      expect(userCount).toBe(1);
    });

    it('should handle special characters', () => {
      const scope = parser.identifyScope('Add @decorators and #hashtags support');
      expect(scope).toContain('decorators');
      expect(scope).toContain('hashtags');
      expect(scope).toContain('support');
    });
  });
});
