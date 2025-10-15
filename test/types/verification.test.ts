/**
 * Tests for verification type definitions and type guards
 */

import {
  VerificationReport,
  Diff,
  FileChangeType,
  isVerificationReport,
  isDiff,
} from '../../src/types';

describe('Verification Types', () => {
  describe('VerificationReport interface', () => {
    it('should create a valid VerificationReport object for passed verification', () => {
      const report: VerificationReport = {
        passed: true,
        filesCreated: ['src/new-file.ts'],
        filesModified: ['src/existing-file.ts'],
        filesDeleted: ['src/old-file.ts'],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'All changes match the plan',
      };

      expect(report.passed).toBe(true);
      expect(report.filesCreated).toHaveLength(1);
      expect(report.missingFiles).toHaveLength(0);
    });

    it('should create a valid VerificationReport object for failed verification', () => {
      const report: VerificationReport = {
        passed: false,
        filesCreated: ['src/new-file.ts'],
        filesModified: [],
        filesDeleted: [],
        missingFiles: ['src/required-file.ts'],
        unexpectedChanges: ['src/unexpected-file.ts'],
        summary: 'Plan not fully implemented',
      };

      expect(report.passed).toBe(false);
      expect(report.missingFiles).toHaveLength(1);
      expect(report.unexpectedChanges).toHaveLength(1);
    });

    it('should allow empty arrays for all file lists', () => {
      const report: VerificationReport = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'No changes needed',
      };

      expect(report.filesCreated).toHaveLength(0);
      expect(report.filesModified).toHaveLength(0);
      expect(report.filesDeleted).toHaveLength(0);
    });

    it('should allow multiple files in each category', () => {
      const report: VerificationReport = {
        passed: true,
        filesCreated: ['file1.ts', 'file2.ts', 'file3.ts'],
        filesModified: ['file4.ts', 'file5.ts'],
        filesDeleted: ['file6.ts'],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Multiple file changes',
      };

      expect(report.filesCreated).toHaveLength(3);
      expect(report.filesModified).toHaveLength(2);
      expect(report.filesDeleted).toHaveLength(1);
    });
  });

  describe('Diff interface', () => {
    it('should create a valid Diff object with matching changes', () => {
      const diff: Diff = {
        file: 'src/file.ts',
        expected: 'create',
        actual: 'create',
        matches: true,
      };

      expect(diff.file).toBe('src/file.ts');
      expect(diff.expected).toBe('create');
      expect(diff.actual).toBe('create');
      expect(diff.matches).toBe(true);
    });

    it('should create a valid Diff object with non-matching changes', () => {
      const diff: Diff = {
        file: 'src/file.ts',
        expected: 'modify',
        actual: 'delete',
        matches: false,
      };

      expect(diff.expected).toBe('modify');
      expect(diff.actual).toBe('delete');
      expect(diff.matches).toBe(false);
    });

    it('should allow null for actual when file was not changed', () => {
      const diff: Diff = {
        file: 'src/file.ts',
        expected: 'create',
        actual: null,
        matches: false,
      };

      expect(diff.actual).toBeNull();
      expect(diff.matches).toBe(false);
    });

    it('should support all FileChangeType values', () => {
      const types: FileChangeType[] = ['create', 'modify', 'delete'];

      types.forEach((type) => {
        const diff: Diff = {
          file: `file-${type}.ts`,
          expected: type,
          actual: type,
          matches: true,
        };

        expect(diff.expected).toBe(type);
        expect(diff.actual).toBe(type);
      });
    });
  });
});

describe('Verification Type Guards', () => {
  describe('isVerificationReport', () => {
    it('should return true for valid VerificationReport object', () => {
      const valid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(valid)).toBe(true);
    });

    it('should return false for object missing passed', () => {
      const invalid = {
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing filesCreated', () => {
      const invalid = {
        passed: true,
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing filesModified', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing filesDeleted', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing missingFiles', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing unexpectedChanges', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for object missing summary', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should validate passed is a boolean', () => {
      const invalid = {
        passed: 'yes',
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should validate all file arrays are arrays', () => {
      const invalidCreated = {
        passed: true,
        filesCreated: 'not-an-array',
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalidCreated)).toBe(false);

      const invalidModified = {
        passed: true,
        filesCreated: [],
        filesModified: 'not-an-array',
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 'Summary',
      };

      expect(isVerificationReport(invalidModified)).toBe(false);
    });

    it('should validate summary is a string', () => {
      const invalid = {
        passed: true,
        filesCreated: [],
        filesModified: [],
        filesDeleted: [],
        missingFiles: [],
        unexpectedChanges: [],
        summary: 123,
      };

      expect(isVerificationReport(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isVerificationReport(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isVerificationReport(undefined)).toBe(false);
    });
  });

  describe('isDiff', () => {
    it('should return true for valid Diff object', () => {
      const valid = {
        file: 'src/file.ts',
        expected: 'create',
        actual: 'create',
        matches: true,
      };

      expect(isDiff(valid)).toBe(true);
    });

    it('should return false for object missing file', () => {
      const invalid = {
        expected: 'create',
        actual: 'create',
        matches: true,
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should return false for object missing expected', () => {
      const invalid = {
        file: 'src/file.ts',
        actual: 'create',
        matches: true,
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should return false for object missing actual', () => {
      const invalid = {
        file: 'src/file.ts',
        expected: 'create',
        matches: true,
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should return false for object missing matches', () => {
      const invalid = {
        file: 'src/file.ts',
        expected: 'create',
        actual: 'create',
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should validate expected is a valid FileChangeType', () => {
      const validTypes = ['create', 'modify', 'delete'];

      validTypes.forEach((type) => {
        const diff = {
          file: 'file.ts',
          expected: type,
          actual: type,
          matches: true,
        };

        expect(isDiff(diff)).toBe(true);
      });

      const invalid = {
        file: 'file.ts',
        expected: 'invalid',
        actual: 'create',
        matches: false,
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should validate actual is a valid FileChangeType or null', () => {
      const validWithNull = {
        file: 'file.ts',
        expected: 'create',
        actual: null,
        matches: false,
      };

      expect(isDiff(validWithNull)).toBe(true);

      const validWithType = {
        file: 'file.ts',
        expected: 'create',
        actual: 'create',
        matches: true,
      };

      expect(isDiff(validWithType)).toBe(true);

      const invalid = {
        file: 'file.ts',
        expected: 'create',
        actual: 'invalid',
        matches: false,
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should validate matches is a boolean', () => {
      const invalid = {
        file: 'file.ts',
        expected: 'create',
        actual: 'create',
        matches: 'yes',
      };

      expect(isDiff(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isDiff(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isDiff(undefined)).toBe(false);
    });
  });
});
