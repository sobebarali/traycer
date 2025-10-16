/**
 * Tests for file system utilities
 */

import * as vscode from 'vscode';
import {
  readFile,
  writeFile,
  listFiles,
  findFiles,
  validateFilePath,
  isWithinWorkspace,
} from '../../src/utils/fileSystem';

jest.mock('vscode');

describe('fileSystem utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readFile', () => {
    it('should read file successfully', async () => {
      const mockContent = Buffer.from('file content', 'utf8');
      (vscode.workspace.fs.readFile as jest.Mock).mockResolvedValue(mockContent);

      const result = await readFile('/test/workspace/file.ts');

      expect(result).toBe('file content');
      expect(vscode.workspace.fs.readFile).toHaveBeenCalledWith(
        expect.objectContaining({ fsPath: '/test/workspace/file.ts' })
      );
    });

    it('should throw error when file not found', async () => {
      (vscode.workspace.fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(readFile('/test/workspace/missing.ts')).rejects.toThrow('Failed to read file');
    });

    it('should reject file path outside workspace', async () => {
      await expect(readFile('/outside/workspace/file.ts')).rejects.toThrow(
        'File path must be within workspace'
      );
    });

    it('should reject directory traversal attempts', async () => {
      await expect(readFile('/test/workspace/../../../etc/passwd')).rejects.toThrow(
        'Invalid file path'
      );
    });
  });

  describe('writeFile', () => {
    it('should write file successfully', async () => {
      (vscode.workspace.fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await writeFile({ filePath: '/test/workspace/file.ts', content: 'content' });

      expect(vscode.workspace.fs.writeFile).toHaveBeenCalledWith(
        expect.objectContaining({ fsPath: '/test/workspace/file.ts' }),
        expect.any(Buffer)
      );
    });

    it('should throw error on permission error', async () => {
      (vscode.workspace.fs.writeFile as jest.Mock).mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(
        writeFile({ filePath: '/test/workspace/file.ts', content: 'content' })
      ).rejects.toThrow('Failed to write file');
    });

    it('should reject file path outside workspace', async () => {
      await expect(
        writeFile({ filePath: '/outside/workspace/file.ts', content: 'content' })
      ).rejects.toThrow('File path must be within workspace');
    });
  });

  describe('listFiles', () => {
    it('should list files in directory', async () => {
      const mockEntries: [string, vscode.FileType][] = [
        ['file1.ts', vscode.FileType.File],
        ['file2.ts', vscode.FileType.File],
        ['subdir', vscode.FileType.Directory],
      ];
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue(mockEntries);

      const result = await listFiles('/test/workspace/src');

      expect(result).toEqual([
        '/test/workspace/src/file1.ts',
        '/test/workspace/src/file2.ts',
        '/test/workspace/src/subdir',
      ]);
    });

    it('should return empty array for empty directory', async () => {
      (vscode.workspace.fs.readDirectory as jest.Mock).mockResolvedValue([]);

      const result = await listFiles('/test/workspace/empty');

      expect(result).toEqual([]);
    });

    it('should reject directory outside workspace', async () => {
      await expect(listFiles('/outside/workspace')).rejects.toThrow(
        'File path must be within workspace'
      );
    });
  });

  describe('findFiles', () => {
    it('should find files matching glob pattern', async () => {
      const mockUris = [
        { fsPath: '/test/workspace/src/file1.ts' },
        { fsPath: '/test/workspace/src/file2.ts' },
      ];
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue(mockUris);

      const result = await findFiles({ pattern: '**/*.ts' });

      expect(result).toEqual(['/test/workspace/src/file1.ts', '/test/workspace/src/file2.ts']);
      expect(vscode.workspace.findFiles).toHaveBeenCalledWith('**/*.ts', null);
    });

    it('should return empty array when no files match', async () => {
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue([]);

      const result = await findFiles({ pattern: '**/*.xyz' });

      expect(result).toEqual([]);
    });

    it('should handle glob patterns with exclude', async () => {
      const mockUris = [{ fsPath: '/test/workspace/src/file1.ts' }];
      (vscode.workspace.findFiles as jest.Mock).mockResolvedValue(mockUris);

      const result = await findFiles({ pattern: '**/*.ts', exclude: '**/node_modules/**' });

      expect(vscode.workspace.findFiles).toHaveBeenCalledWith('**/*.ts', '**/node_modules/**');
      expect(result).toEqual(['/test/workspace/src/file1.ts']);
    });
  });

  describe('validateFilePath', () => {
    it('should validate correct file path', () => {
      expect(validateFilePath('/test/workspace/src/file.ts')).toBe(true);
    });

    it('should reject directory traversal with ../', () => {
      expect(validateFilePath('/test/workspace/../file.ts')).toBe(false);
    });

    it('should reject home directory reference', () => {
      expect(validateFilePath('~/file.ts')).toBe(false);
    });

    it('should reject null bytes', () => {
      expect(validateFilePath('/test/workspace/file\x00.ts')).toBe(false);
    });

    it('should accept relative paths within workspace', () => {
      expect(validateFilePath('/test/workspace/src/utils/file.ts')).toBe(true);
    });
  });

  describe('isWithinWorkspace', () => {
    it('should return true for path within workspace', () => {
      expect(isWithinWorkspace('/test/workspace/src/file.ts')).toBe(true);
    });

    it('should return false for path outside workspace', () => {
      expect(isWithinWorkspace('/outside/file.ts')).toBe(false);
    });

    it('should return false when no workspace is open', () => {
      // Temporarily mock no workspace
      const originalWorkspace = vscode.workspace.workspaceFolders;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vscode.workspace as any).workspaceFolders = undefined;

      expect(isWithinWorkspace('/test/workspace/file.ts')).toBe(false);

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vscode.workspace as any).workspaceFolders = originalWorkspace;
    });

    it('should handle normalized paths correctly', () => {
      expect(isWithinWorkspace('/test/workspace/./src/file.ts')).toBe(true);
    });

    it('should reject path trying to escape workspace', () => {
      expect(isWithinWorkspace('/test/workspace/../outside/file.ts')).toBe(false);
    });
  });
});
