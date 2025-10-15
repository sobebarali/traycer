/**
 * Tests for logger utility
 */

import * as vscode from 'vscode';
import { log, warn, error, initLogger } from '../../src/utils/logger';

jest.mock('vscode');

// Helper to get the mock output channel
const getMockOutputChannel = () => {
  const createOutputChannel = vscode.window.createOutputChannel as jest.Mock;
  return createOutputChannel.mock.results[createOutputChannel.mock.results.length - 1]?.value;
};

describe('logger utility', () => {
  beforeAll(() => {
    initLogger();
  });

  beforeEach(() => {
    const outputChannel = getMockOutputChannel();
    if (outputChannel) {
      outputChannel.appendLine.mockClear();
    }
  });

  describe('initLogger', () => {
    it('should initialize logger with output channel', () => {
      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('Traycer');
    });
  });

  describe('log', () => {
    it('should log basic message', () => {
      log('Test message');

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Test message')
      );
    });

    it('should log message with context', () => {
      log('Test message', { key: 'value' });

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Test message')
      );
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('"key": "value"')
      );
    });

    it('should include timestamp', () => {
      log('Test message');

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}/)
      );
    });

    it('should filter sensitive file paths in context', () => {
      log('Test message', { filePath: '/Users/sensitive/path/file.ts' });

      const outputChannel = getMockOutputChannel();
      const call = outputChannel.appendLine.mock.calls[1][0];
      expect(call).toContain('[REDACTED]');
      expect(call).not.toContain('/Users/sensitive');
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      warn('Warning message');

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message')
      );
    });

    it('should log warning with context', () => {
      warn('Warning message', { detail: 'Additional info' });

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message')
      );
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('"detail": "Additional info"')
      );
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      error('Error message');

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Error message')
      );
    });

    it('should log error with Error object', () => {
      const testError = new Error('Test error');
      error('Error message', testError);

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Error message')
      );
      expect(outputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('Test error'));
    });

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const testError = new Error('Test error');
      testError.stack = 'Error: Test error\n    at test.ts:1:1';

      error('Error message', testError);

      const outputChannel = getMockOutputChannel();
      expect(outputChannel.appendLine).toHaveBeenCalledWith(
        expect.stringContaining('at test.ts:1:1')
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const testError = new Error('Test error');
      testError.stack = 'Error: Test error\n    at test.ts:1:1';

      error('Error message', testError);

      const outputChannel = getMockOutputChannel();
      const calls = outputChannel.appendLine.mock.calls.map((call: string[]) => call[0]).join('\n');
      expect(calls).not.toContain('at test.ts:1:1');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('sensitive data filtering', () => {
    it('should filter API keys', () => {
      log('Test message', { apiKey: 'secret-key-12345' });

      const outputChannel = getMockOutputChannel();
      const call = outputChannel.appendLine.mock.calls[1][0];
      expect(call).toContain('[REDACTED]');
      expect(call).not.toContain('secret-key-12345');
    });

    it('should filter passwords', () => {
      log('Test message', { password: 'super-secret' });

      const outputChannel = getMockOutputChannel();
      const call = outputChannel.appendLine.mock.calls[1][0];
      expect(call).toContain('[REDACTED]');
      expect(call).not.toContain('super-secret');
    });

    it('should filter tokens', () => {
      log('Test message', { token: 'bearer-token-xyz' });

      const outputChannel = getMockOutputChannel();
      const call = outputChannel.appendLine.mock.calls[1][0];
      expect(call).toContain('[REDACTED]');
      expect(call).not.toContain('bearer-token-xyz');
    });

    it('should filter nested sensitive data', () => {
      log('Test message', {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
          },
        },
      });

      const outputChannel = getMockOutputChannel();
      const call = outputChannel.appendLine.mock.calls[1][0];
      expect(call).toContain('[REDACTED]');
      expect(call).not.toContain('secret');
    });
  });
});
