/**
 * Tests for core type definitions and type guards
 */

import {
  Plan,
  PlanStatus,
  Step,
  FileChange,
  FileChangeType,
  isPlan,
  isStep,
  isFileChange,
} from '../../src/types';

describe('Core Types', () => {
  describe('PlanStatus', () => {
    it('should accept valid status values', () => {
      const validStatuses: PlanStatus[] = ['draft', 'in-progress', 'completed'];
      expect(validStatuses.length).toBe(3);
    });
  });

  describe('FileChangeType', () => {
    it('should accept valid file change types', () => {
      const validTypes: FileChangeType[] = ['create', 'modify', 'delete'];
      expect(validTypes.length).toBe(3);
    });
  });

  describe('Plan interface', () => {
    it('should create a valid Plan object', () => {
      const plan: Plan = {
        id: 'test-plan-1',
        title: 'Test Plan',
        description: 'A test plan',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(plan.id).toBe('test-plan-1');
      expect(plan.title).toBe('Test Plan');
      expect(plan.status).toBe('draft');
    });

    it('should allow all valid status values', () => {
      const draft: Plan = {
        id: '1',
        title: 'Draft',
        description: '',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      const inProgress: Plan = {
        id: '2',
        title: 'In Progress',
        description: '',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'in-progress',
      };

      const completed: Plan = {
        id: '3',
        title: 'Completed',
        description: '',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'completed',
      };

      expect(draft.status).toBe('draft');
      expect(inProgress.status).toBe('in-progress');
      expect(completed.status).toBe('completed');
    });
  });

  describe('Step interface', () => {
    it('should create a valid Step object', () => {
      const step: Step = {
        id: 'step-1',
        description: 'Create a file',
        reasoning: 'Need new file for feature',
        dependencies: [],
        completed: false,
      };

      expect(step.id).toBe('step-1');
      expect(step.description).toBe('Create a file');
      expect(step.completed).toBe(false);
    });

    it('should allow steps with dependencies', () => {
      const step: Step = {
        id: 'step-2',
        description: 'Update tests',
        reasoning: 'Tests need updating after code changes',
        dependencies: ['step-1'],
        completed: false,
      };

      expect(step.dependencies).toHaveLength(1);
      expect(step.dependencies[0]).toBe('step-1');
    });
  });

  describe('FileChange interface', () => {
    it('should create a valid FileChange object for creation', () => {
      const fileChange: FileChange = {
        path: 'src/new-file.ts',
        type: 'create',
        description: 'New TypeScript file',
        reasoning: 'Need new module for feature',
      };

      expect(fileChange.path).toBe('src/new-file.ts');
      expect(fileChange.type).toBe('create');
    });

    it('should create a valid FileChange object for modification', () => {
      const fileChange: FileChange = {
        path: 'src/existing-file.ts',
        type: 'modify',
        description: 'Update existing file',
        reasoning: 'Add new function',
      };

      expect(fileChange.type).toBe('modify');
    });

    it('should create a valid FileChange object for deletion', () => {
      const fileChange: FileChange = {
        path: 'src/old-file.ts',
        type: 'delete',
        description: 'Remove deprecated file',
        reasoning: 'No longer needed',
      };

      expect(fileChange.type).toBe('delete');
    });
  });
});

describe('Type Guards', () => {
  describe('isPlan', () => {
    it('should return true for valid Plan object', () => {
      const validPlan = {
        id: 'test-1',
        title: 'Test',
        description: 'Test plan',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(validPlan)).toBe(true);
    });

    it('should return false for object missing id', () => {
      const invalid = {
        title: 'Test',
        description: 'Test',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should return false for object missing title', () => {
      const invalid = {
        id: 'test-1',
        description: 'Test',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should return false for object missing steps', () => {
      const invalid = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should return false for object missing files', () => {
      const invalid = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        steps: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should return false for object missing status', () => {
      const invalid = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        steps: [],
        files: [],
        createdAt: new Date(),
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isPlan(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isPlan(undefined)).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isPlan('string')).toBe(false);
      expect(isPlan(123)).toBe(false);
      expect(isPlan(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isPlan([])).toBe(false);
      expect(isPlan([1, 2, 3])).toBe(false);
    });

    it('should validate steps is an array', () => {
      const invalid = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        steps: 'not-an-array',
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });

    it('should validate files is an array', () => {
      const invalid = {
        id: 'test-1',
        title: 'Test',
        description: 'Test',
        steps: [],
        files: 'not-an-array',
        createdAt: new Date(),
        status: 'draft',
      };

      expect(isPlan(invalid)).toBe(false);
    });
  });

  describe('isStep', () => {
    it('should return true for valid Step object', () => {
      const validStep = {
        id: 'step-1',
        description: 'Do something',
        reasoning: 'Because we need to',
        dependencies: [],
        completed: false,
      };

      expect(isStep(validStep)).toBe(true);
    });

    it('should return false for object missing id', () => {
      const invalid = {
        description: 'Do something',
        reasoning: 'Because',
        dependencies: [],
        completed: false,
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should return false for object missing description', () => {
      const invalid = {
        id: 'step-1',
        reasoning: 'Because',
        dependencies: [],
        completed: false,
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should return false for object missing reasoning', () => {
      const invalid = {
        id: 'step-1',
        description: 'Do something',
        dependencies: [],
        completed: false,
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should return false for object missing dependencies', () => {
      const invalid = {
        id: 'step-1',
        description: 'Do something',
        reasoning: 'Because',
        completed: false,
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should return false for object missing completed', () => {
      const invalid = {
        id: 'step-1',
        description: 'Do something',
        reasoning: 'Because',
        dependencies: [],
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should validate dependencies is an array', () => {
      const invalid = {
        id: 'step-1',
        description: 'Do something',
        reasoning: 'Because',
        dependencies: 'not-an-array',
        completed: false,
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should validate completed is a boolean', () => {
      const invalid = {
        id: 'step-1',
        description: 'Do something',
        reasoning: 'Because',
        dependencies: [],
        completed: 'yes',
      };

      expect(isStep(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isStep(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isStep(undefined)).toBe(false);
    });
  });

  describe('isFileChange', () => {
    it('should return true for valid FileChange object', () => {
      const validFileChange = {
        path: 'src/file.ts',
        type: 'create',
        description: 'New file',
        reasoning: 'Need it',
      };

      expect(isFileChange(validFileChange)).toBe(true);
    });

    it('should return false for object missing path', () => {
      const invalid = {
        type: 'create',
        description: 'New file',
        reasoning: 'Need it',
      };

      expect(isFileChange(invalid)).toBe(false);
    });

    it('should return false for object missing type', () => {
      const invalid = {
        path: 'src/file.ts',
        description: 'New file',
        reasoning: 'Need it',
      };

      expect(isFileChange(invalid)).toBe(false);
    });

    it('should return false for object missing description', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'create',
        reasoning: 'Need it',
      };

      expect(isFileChange(invalid)).toBe(false);
    });

    it('should return false for object missing reasoning', () => {
      const invalid = {
        path: 'src/file.ts',
        type: 'create',
        description: 'New file',
      };

      expect(isFileChange(invalid)).toBe(false);
    });

    it('should validate type is a valid FileChangeType', () => {
      const validTypes = ['create', 'modify', 'delete'];

      validTypes.forEach((type) => {
        const fileChange = {
          path: 'src/file.ts',
          type,
          description: 'File change',
          reasoning: 'Because',
        };

        expect(isFileChange(fileChange)).toBe(true);
      });

      const invalid = {
        path: 'src/file.ts',
        type: 'invalid-type',
        description: 'File change',
        reasoning: 'Because',
      };

      expect(isFileChange(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isFileChange(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isFileChange(undefined)).toBe(false);
    });
  });
});
