/**
 * Tests for analysis type definitions and type guards
 */

import {
  TaskDescription,
  TaskIntent,
  WorkspaceAnalysis,
  FileInfo,
  FileType,
  CodePattern,
  PatternType,
  isTaskDescription,
  isWorkspaceAnalysis,
  isFileInfo,
  isCodePattern,
} from '../../src/types';

describe('Analysis Types', () => {
  describe('TaskIntent', () => {
    it('should accept valid intent values', () => {
      const validIntents: TaskIntent[] = ['feature', 'bugfix', 'refactor', 'documentation', 'test'];
      expect(validIntents.length).toBe(5);
    });
  });

  describe('FileType', () => {
    it('should accept valid file type values', () => {
      const validTypes: FileType[] = ['typescript', 'javascript', 'json', 'markdown', 'other'];
      expect(validTypes.length).toBe(5);
    });
  });

  describe('PatternType', () => {
    it('should accept valid pattern type values', () => {
      const validTypes: PatternType[] = ['component', 'function', 'class', 'module'];
      expect(validTypes.length).toBe(4);
    });
  });

  describe('TaskDescription interface', () => {
    it('should create a valid TaskDescription object', () => {
      const task: TaskDescription = {
        title: 'Add authentication',
        description: 'Implement user login and registration',
        intent: 'feature',
        scope: ['src/auth'],
      };

      expect(task.title).toBe('Add authentication');
      expect(task.intent).toBe('feature');
      expect(task.scope).toHaveLength(1);
    });

    it('should allow all valid intent values', () => {
      const intents: TaskIntent[] = ['feature', 'bugfix', 'refactor', 'documentation', 'test'];

      intents.forEach((intent) => {
        const task: TaskDescription = {
          title: `Task with ${intent}`,
          description: 'Description',
          intent,
          scope: [],
        };

        expect(task.intent).toBe(intent);
      });
    });

    it('should allow multiple scope items', () => {
      const task: TaskDescription = {
        title: 'Refactor authentication',
        description: 'Clean up auth code',
        intent: 'refactor',
        scope: ['src/auth', 'src/utils/validation', 'test/auth'],
      };

      expect(task.scope).toHaveLength(3);
    });
  });

  describe('WorkspaceAnalysis interface', () => {
    it('should create a valid WorkspaceAnalysis object', () => {
      const analysis: WorkspaceAnalysis = {
        rootPath: '/workspace',
        files: [],
        dependencies: {},
        patterns: [],
      };

      expect(analysis.rootPath).toBe('/workspace');
      expect(analysis.files).toEqual([]);
      expect(analysis.dependencies).toEqual({});
    });

    it('should allow files array with FileInfo objects', () => {
      const analysis: WorkspaceAnalysis = {
        rootPath: '/workspace',
        files: [
          {
            path: 'src/index.ts',
            type: 'typescript',
            size: 1024,
            exports: ['main'],
            imports: ['fs', 'path'],
          },
        ],
        dependencies: {},
        patterns: [],
      };

      expect(analysis.files).toHaveLength(1);
      expect(analysis.files[0].path).toBe('src/index.ts');
    });

    it('should allow dependencies record', () => {
      const analysis: WorkspaceAnalysis = {
        rootPath: '/workspace',
        files: [],
        dependencies: {
          'src/index.ts': ['src/utils.ts', 'src/types.ts'],
          'src/utils.ts': [],
        },
        patterns: [],
      };

      expect(Object.keys(analysis.dependencies)).toHaveLength(2);
      expect(analysis.dependencies['src/index.ts']).toHaveLength(2);
    });

    it('should allow patterns array with CodePattern objects', () => {
      const analysis: WorkspaceAnalysis = {
        rootPath: '/workspace',
        files: [],
        dependencies: {},
        patterns: [
          {
            type: 'function',
            name: 'getUserById',
            location: 'src/users.ts:42',
          },
        ],
      };

      expect(analysis.patterns).toHaveLength(1);
      expect(analysis.patterns[0].name).toBe('getUserById');
    });
  });

  describe('FileInfo interface', () => {
    it('should create a valid FileInfo object', () => {
      const fileInfo: FileInfo = {
        path: 'src/app.ts',
        type: 'typescript',
        size: 2048,
        exports: ['App', 'initialize'],
        imports: ['react', './utils'],
      };

      expect(fileInfo.path).toBe('src/app.ts');
      expect(fileInfo.type).toBe('typescript');
      expect(fileInfo.size).toBe(2048);
    });

    it('should allow all valid file types', () => {
      const types: FileType[] = ['typescript', 'javascript', 'json', 'markdown', 'other'];

      types.forEach((type) => {
        const fileInfo: FileInfo = {
          path: `file.${type}`,
          type,
          size: 100,
          exports: [],
          imports: [],
        };

        expect(fileInfo.type).toBe(type);
      });
    });

    it('should allow empty exports and imports', () => {
      const fileInfo: FileInfo = {
        path: 'config.json',
        type: 'json',
        size: 256,
        exports: [],
        imports: [],
      };

      expect(fileInfo.exports).toHaveLength(0);
      expect(fileInfo.imports).toHaveLength(0);
    });
  });

  describe('CodePattern interface', () => {
    it('should create a valid CodePattern object', () => {
      const pattern: CodePattern = {
        type: 'class',
        name: 'UserService',
        location: 'src/services/user.ts:10',
      };

      expect(pattern.type).toBe('class');
      expect(pattern.name).toBe('UserService');
      expect(pattern.location).toBe('src/services/user.ts:10');
    });

    it('should allow all valid pattern types', () => {
      const types: PatternType[] = ['component', 'function', 'class', 'module'];

      types.forEach((type) => {
        const pattern: CodePattern = {
          type,
          name: `Test${type}`,
          location: 'test.ts:1',
        };

        expect(pattern.type).toBe(type);
      });
    });
  });
});

describe('Analysis Type Guards', () => {
  describe('isTaskDescription', () => {
    it('should return true for valid TaskDescription object', () => {
      const valid = {
        title: 'Task',
        description: 'Description',
        intent: 'feature',
        scope: [],
      };

      expect(isTaskDescription(valid)).toBe(true);
    });

    it('should return false for object missing title', () => {
      const invalid = {
        description: 'Description',
        intent: 'feature',
        scope: [],
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should return false for object missing description', () => {
      const invalid = {
        title: 'Task',
        intent: 'feature',
        scope: [],
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should return false for object missing intent', () => {
      const invalid = {
        title: 'Task',
        description: 'Description',
        scope: [],
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should return false for object missing scope', () => {
      const invalid = {
        title: 'Task',
        description: 'Description',
        intent: 'feature',
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should validate intent is a valid TaskIntent', () => {
      const validIntents = ['feature', 'bugfix', 'refactor', 'documentation', 'test'];

      validIntents.forEach((intent) => {
        const task = {
          title: 'Task',
          description: 'Description',
          intent,
          scope: [],
        };

        expect(isTaskDescription(task)).toBe(true);
      });

      const invalid = {
        title: 'Task',
        description: 'Description',
        intent: 'invalid',
        scope: [],
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should validate scope is an array', () => {
      const invalid = {
        title: 'Task',
        description: 'Description',
        intent: 'feature',
        scope: 'not-an-array',
      };

      expect(isTaskDescription(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isTaskDescription(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isTaskDescription(undefined)).toBe(false);
    });
  });

  describe('isWorkspaceAnalysis', () => {
    it('should return true for valid WorkspaceAnalysis object', () => {
      const valid = {
        rootPath: '/workspace',
        files: [],
        dependencies: {},
        patterns: [],
      };

      expect(isWorkspaceAnalysis(valid)).toBe(true);
    });

    it('should return false for object missing rootPath', () => {
      const invalid = {
        files: [],
        dependencies: {},
        patterns: [],
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should return false for object missing files', () => {
      const invalid = {
        rootPath: '/workspace',
        dependencies: {},
        patterns: [],
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should return false for object missing dependencies', () => {
      const invalid = {
        rootPath: '/workspace',
        files: [],
        patterns: [],
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should return false for object missing patterns', () => {
      const invalid = {
        rootPath: '/workspace',
        files: [],
        dependencies: {},
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should validate files is an array', () => {
      const invalid = {
        rootPath: '/workspace',
        files: 'not-an-array',
        dependencies: {},
        patterns: [],
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should validate dependencies is an object', () => {
      const invalid = {
        rootPath: '/workspace',
        files: [],
        dependencies: 'not-an-object',
        patterns: [],
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should validate patterns is an array', () => {
      const invalid = {
        rootPath: '/workspace',
        files: [],
        dependencies: {},
        patterns: 'not-an-array',
      };

      expect(isWorkspaceAnalysis(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isWorkspaceAnalysis(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isWorkspaceAnalysis(undefined)).toBe(false);
    });
  });

  describe('isFileInfo', () => {
    it('should return true for valid FileInfo object', () => {
      const valid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: 1024,
        exports: [],
        imports: [],
      };

      expect(isFileInfo(valid)).toBe(true);
    });

    it('should return false for object missing path', () => {
      const invalid = {
        type: 'typescript',
        size: 1024,
        exports: [],
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should return false for object missing type', () => {
      const invalid = {
        path: 'src/file.ts',
        size: 1024,
        exports: [],
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should return false for object missing size', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        exports: [],
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should return false for object missing exports', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: 1024,
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should return false for object missing imports', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: 1024,
        exports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should validate type is a valid FileType', () => {
      const validTypes = ['typescript', 'javascript', 'json', 'markdown', 'other'];

      validTypes.forEach((type) => {
        const fileInfo = {
          path: 'file',
          type,
          size: 100,
          exports: [],
          imports: [],
        };

        expect(isFileInfo(fileInfo)).toBe(true);
      });

      const invalid = {
        path: 'file',
        type: 'invalid',
        size: 100,
        exports: [],
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should validate size is a number', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: '1024',
        exports: [],
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should validate exports is an array', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: 1024,
        exports: 'not-an-array',
        imports: [],
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should validate imports is an array', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'typescript',
        size: 1024,
        exports: [],
        imports: 'not-an-array',
      };

      expect(isFileInfo(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isFileInfo(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isFileInfo(undefined)).toBe(false);
    });
  });

  describe('isCodePattern', () => {
    it('should return true for valid CodePattern object', () => {
      const valid = {
        type: 'function',
        name: 'myFunction',
        location: 'src/file.ts:10',
      };

      expect(isCodePattern(valid)).toBe(true);
    });

    it('should return false for object missing type', () => {
      const invalid = {
        name: 'myFunction',
        location: 'src/file.ts:10',
      };

      expect(isCodePattern(invalid)).toBe(false);
    });

    it('should return false for object missing name', () => {
      const invalid = {
        type: 'function',
        location: 'src/file.ts:10',
      };

      expect(isCodePattern(invalid)).toBe(false);
    });

    it('should return false for object missing location', () => {
      const invalid = {
        type: 'function',
        name: 'myFunction',
      };

      expect(isCodePattern(invalid)).toBe(false);
    });

    it('should validate type is a valid PatternType', () => {
      const validTypes = ['component', 'function', 'class', 'module'];

      validTypes.forEach((type) => {
        const pattern = {
          type,
          name: 'test',
          location: 'file.ts:1',
        };

        expect(isCodePattern(pattern)).toBe(true);
      });

      const invalid = {
        type: 'invalid',
        name: 'test',
        location: 'file.ts:1',
      };

      expect(isCodePattern(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isCodePattern(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isCodePattern(undefined)).toBe(false);
    });
  });
});
