/**
 * Tests for utility types
 */

import { Result, Optional, DeepReadonly, Plan } from '../../src/types';

describe('Utility Types', () => {
  describe('Result<T, E>', () => {
    it('should create a success result', () => {
      const result: Result<string> = {
        success: true,
        data: 'Hello, World!',
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello, World!');
      }
    });

    it('should create a failure result with Error', () => {
      const result: Result<string> = {
        success: false,
        error: new Error('Something went wrong'),
      };

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Something went wrong');
      }
    });

    it('should create a failure result with custom error type', () => {
      interface CustomError {
        code: number;
        message: string;
      }

      const result: Result<string, CustomError> = {
        success: false,
        error: {
          code: 404,
          message: 'Not found',
        },
      };

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(404);
        expect(result.error.message).toBe('Not found');
      }
    });

    it('should work with complex data types', () => {
      interface UserData {
        id: number;
        name: string;
        email: string;
      }

      const result: Result<UserData> = {
        success: true,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('John Doe');
      }
    });

    it('should be narrowed by type guard in if statement', () => {
      function getResult(): Result<number> {
        return { success: true, data: 42 };
      }

      const result = getResult();

      if (result.success) {
        // TypeScript knows result.data is available here
        const value: number = result.data;
        expect(value).toBe(42);
      } else {
        // TypeScript knows result.error is available here
        const error: Error = result.error;
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Optional<T>', () => {
    it('should make all properties optional', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const partialUser: Optional<User> = {
        id: 1,
      };

      expect(partialUser.id).toBe(1);
      expect(partialUser.name).toBeUndefined();
      expect(partialUser.email).toBeUndefined();
    });

    it('should allow empty object', () => {
      interface Config {
        host: string;
        port: number;
      }

      const emptyConfig: Optional<Config> = {};

      expect(emptyConfig.host).toBeUndefined();
      expect(emptyConfig.port).toBeUndefined();
    });

    it('should allow all properties to be set', () => {
      interface Settings {
        theme: string;
        fontSize: number;
      }

      const fullSettings: Optional<Settings> = {
        theme: 'dark',
        fontSize: 14,
      };

      expect(fullSettings.theme).toBe('dark');
      expect(fullSettings.fontSize).toBe(14);
    });

    it('should work with complex types', () => {
      interface PlanUpdate {
        title: string;
        description: string;
        status: 'draft' | 'in-progress' | 'completed';
      }

      const update: Optional<PlanUpdate> = {
        status: 'completed',
      };

      expect(update.status).toBe('completed');
      expect(update.title).toBeUndefined();
    });
  });

  describe('DeepReadonly<T>', () => {
    it('should make all properties readonly', () => {
      interface User {
        id: number;
        name: string;
      }

      const user: DeepReadonly<User> = {
        id: 1,
        name: 'John',
      };

      expect(user.id).toBe(1);
      expect(user.name).toBe('John');

      // This would fail TypeScript compilation:
      // user.id = 2;
      // user.name = 'Jane';
    });

    it('should make nested properties readonly', () => {
      interface Config {
        server: {
          host: string;
          port: number;
        };
        database: {
          url: string;
        };
      }

      const config: DeepReadonly<Config> = {
        server: {
          host: 'localhost',
          port: 3000,
        },
        database: {
          url: 'mongodb://localhost',
        },
      };

      expect(config.server.host).toBe('localhost');
      expect(config.database.url).toBe('mongodb://localhost');

      // This would fail TypeScript compilation:
      // config.server.host = 'example.com';
      // config.database.url = 'postgresql://localhost';
    });

    it('should work with arrays', () => {
      interface Data {
        items: string[];
      }

      const data: DeepReadonly<Data> = {
        items: ['a', 'b', 'c'],
      };

      expect(data.items[0]).toBe('a');
      expect(data.items.length).toBe(3);

      // This would fail TypeScript compilation:
      // data.items = [];
      // data.items.push('d');
    });

    it('should work with complex nested structures', () => {
      interface Project {
        name: string;
        config: {
          build: {
            output: string;
            sourcemap: boolean;
          };
        };
        dependencies: string[];
      }

      const project: DeepReadonly<Project> = {
        name: 'My Project',
        config: {
          build: {
            output: 'dist',
            sourcemap: true,
          },
        },
        dependencies: ['react', 'typescript'],
      };

      expect(project.name).toBe('My Project');
      expect(project.config.build.output).toBe('dist');
      expect(project.dependencies[0]).toBe('react');

      // This would fail TypeScript compilation:
      // project.name = 'New Name';
      // project.config.build.output = 'build';
      // project.dependencies = [];
    });

    it('should work with Plan type', () => {
      const readonlyPlan: DeepReadonly<Plan> = {
        id: 'plan-1',
        title: 'Test Plan',
        description: 'Description',
        steps: [],
        files: [],
        createdAt: new Date(),
        status: 'draft',
      };

      expect(readonlyPlan.title).toBe('Test Plan');

      // This would fail TypeScript compilation:
      // readonlyPlan.title = 'New Title';
      // readonlyPlan.status = 'completed';
    });
  });

  describe('Type composition', () => {
    it('should combine Result with Optional', () => {
      interface UpdateData {
        name: string;
        email: string;
      }

      const result: Result<Optional<UpdateData>> = {
        success: true,
        data: {
          name: 'John',
        },
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John');
        expect(result.data.email).toBeUndefined();
      }
    });

    it('should combine Result with DeepReadonly', () => {
      interface Config {
        api: {
          url: string;
        };
      }

      const result: Result<DeepReadonly<Config>> = {
        success: true,
        data: {
          api: {
            url: 'https://api.example.com',
          },
        },
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.api.url).toBe('https://api.example.com');
        // This would fail TypeScript compilation:
        // result.data.api.url = 'new-url';
      }
    });

    it('should combine Optional with DeepReadonly', () => {
      interface Settings {
        theme: {
          colors: {
            primary: string;
          };
        };
      }

      const settings: Optional<DeepReadonly<Settings>> = {
        theme: {
          colors: {
            primary: '#007bff',
          },
        },
      };

      expect(settings.theme?.colors.primary).toBe('#007bff');

      // This would fail TypeScript compilation:
      // settings.theme.colors.primary = 'red';
    });
  });
});
