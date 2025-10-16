/**
 * Tests for TaskParser
 */

import { parseTaskDescription, extractIntent, identifyScope } from '../../src/core/taskParser';
import type { TaskDescription } from '../../src/types';

describe('TaskParser', () => {
  describe('parseTaskDescription', () => {
    it('should parse feature task description', async () => {
      const description = 'Add user authentication with JWT tokens';
      const result: TaskDescription = await parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.title).toBe('Add user authentication with JWT tokens');
      expect(result.description).toBe(description);
      expect(result.intent).toBe('feature');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('JWT');
    });

    it('should parse bugfix task description', async () => {
      const description = 'Fix login button not working on mobile';
      const result = await parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('bugfix');
      expect(result.scope).toContain('login');
      expect(result.scope).toContain('mobile');
    });

    it('should parse refactor task description', async () => {
      const description = 'Refactor authentication module to improve performance';
      const result = await parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('refactor');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('performance');
    });

    it('should parse documentation task description', async () => {
      const description = 'Document the API endpoints for user management';
      const result = await parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('documentation');
      expect(result.scope).toContain('API');
      expect(result.scope).toContain('user');
    });

    it('should parse test task description', async () => {
      const description = 'Add unit tests for authentication service';
      const result = await parseTaskDescription(description);

      expect(result).toBeDefined();
      expect(result.intent).toBe('test');
      expect(result.scope).toContain('authentication');
      expect(result.scope).toContain('service');
    });

    it('should throw error for empty description', async () => {
      await expect(parseTaskDescription('')).rejects.toThrow('Task description cannot be empty');
    });

    it('should throw error for whitespace-only description', async () => {
      await expect(parseTaskDescription('   ')).rejects.toThrow('Task description cannot be empty');
    });

    it('should throw error for very long description', async () => {
      const longDescription = 'A'.repeat(10001);
      await expect(parseTaskDescription(longDescription)).rejects.toThrow(
        'Task description too long (max 10000 characters)'
      );
    });

    it('should handle description with exactly 10000 characters', async () => {
      const maxDescription = 'Add feature ' + 'A'.repeat(9988);
      const result = await parseTaskDescription(maxDescription);
      expect(result).toBeDefined();
    });
  });

  describe('extractIntent', () => {
    it('should detect feature intent with "add" keyword', () => {
      const intent = extractIntent('Add new payment gateway');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "create" keyword', () => {
      const intent = extractIntent('Create user dashboard');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "implement" keyword', () => {
      const intent = extractIntent('Implement real-time notifications');
      expect(intent).toBe('feature');
    });

    it('should detect feature intent with "build" keyword', () => {
      const intent = extractIntent('Build search functionality');
      expect(intent).toBe('feature');
    });

    it('should detect bugfix intent with "fix" keyword', () => {
      const intent = extractIntent('Fix broken navigation menu');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "bug" keyword', () => {
      const intent = extractIntent('Bug in user profile loading');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "broken" keyword', () => {
      const intent = extractIntent('Broken authentication flow');
      expect(intent).toBe('bugfix');
    });

    it('should detect bugfix intent with "error" keyword', () => {
      const intent = extractIntent('Error when submitting form');
      expect(intent).toBe('bugfix');
    });

    it('should detect refactor intent with "refactor" keyword', () => {
      const intent = extractIntent('Refactor database queries');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "improve" keyword', () => {
      const intent = extractIntent('Improve code structure');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "optimize" keyword', () => {
      const intent = extractIntent('Optimize rendering performance');
      expect(intent).toBe('refactor');
    });

    it('should detect refactor intent with "clean" keyword', () => {
      const intent = extractIntent('Clean up legacy code');
      expect(intent).toBe('refactor');
    });

    it('should detect documentation intent with "document" keyword', () => {
      const intent = extractIntent('Document API endpoints');
      expect(intent).toBe('documentation');
    });

    it('should detect documentation intent with "docs" keyword', () => {
      const intent = extractIntent('Update docs for new features');
      expect(intent).toBe('documentation');
    });

    it('should detect documentation intent with "readme" keyword', () => {
      const intent = extractIntent('Update README with installation steps');
      expect(intent).toBe('documentation');
    });

    it('should detect test intent with "test" keyword', () => {
      const intent = extractIntent('Add tests for user service');
      expect(intent).toBe('test');
    });

    it('should detect test intent with "spec" keyword', () => {
      const intent = extractIntent('Write spec for authentication');
      expect(intent).toBe('test');
    });

    it('should detect test intent with "testing" keyword', () => {
      const intent = extractIntent('Testing coverage for API');
      expect(intent).toBe('test');
    });

    it('should default to feature intent when no keyword matches', () => {
      const intent = extractIntent('Update user profile page');
      expect(intent).toBe('feature');
    });

    it('should be case-insensitive', () => {
      expect(extractIntent('FIX broken button')).toBe('bugfix');
      expect(extractIntent('ADD new feature')).toBe('feature');
      expect(extractIntent('REFACTOR code')).toBe('refactor');
    });
  });

  describe('identifyScope', () => {
    it('should extract multiple keywords from description', () => {
      const scope = identifyScope('Add user authentication with JWT tokens');
      expect(scope).toContain('user');
      expect(scope).toContain('authentication');
      expect(scope).toContain('JWT');
      expect(scope).toContain('tokens');
    });

    it('should filter out common words', () => {
      const scope = identifyScope('Add the new user authentication feature');
      expect(scope).not.toContain('the');
      expect(scope).not.toContain('add');
      expect(scope).toContain('user');
      expect(scope).toContain('authentication');
      expect(scope).toContain('feature');
    });

    it('should handle empty description', () => {
      const scope = identifyScope('');
      expect(scope).toEqual([]);
    });

    it('should extract meaningful technical terms', () => {
      const scope = identifyScope('Implement GraphQL API with Apollo Server');
      expect(scope).toContain('GraphQL');
      expect(scope).toContain('API');
      expect(scope).toContain('Apollo');
      expect(scope).toContain('Server');
    });

    it('should handle camelCase identifiers', () => {
      const scope = identifyScope('Fix userAuthentication bug in loginService');
      expect(scope).toContain('userAuthentication');
      expect(scope).toContain('loginService');
    });

    it('should remove duplicates', () => {
      const scope = identifyScope('Fix user user authentication');
      const userCount = scope.filter((word) => word === 'user').length;
      expect(userCount).toBe(1);
    });

    it('should handle special characters', () => {
      const scope = identifyScope('Add @decorators and #hashtags support');
      expect(scope).toContain('decorators');
      expect(scope).toContain('hashtags');
      expect(scope).toContain('support');
    });
  });
});
