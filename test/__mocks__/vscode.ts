/**
 * Mock VS Code API for testing
 */

// Create persistent mock functions that won't be reset by clearAllMocks
const createMockFs = () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readDirectory: jest.fn(),
});

const createMockOutputChannel = () => ({
  appendLine: jest.fn(),
  show: jest.fn(),
  hide: jest.fn(),
  dispose: jest.fn(),
});

// Store the mock instances
let mockFsInstance = createMockFs();
let mockOutputChannelInstance = createMockOutputChannel();

// Reset function for tests
export const resetVscodeMocks = () => {
  mockFsInstance = createMockFs();
  mockOutputChannelInstance = createMockOutputChannel();
};

export const workspace = {
  workspaceFolders: [
    {
      uri: { fsPath: '/test/workspace' },
      name: 'test-workspace',
      index: 0,
    },
  ],
  get fs() {
    return mockFsInstance;
  },
  findFiles: jest.fn(),
  getConfiguration: jest.fn(() => ({
    get: jest.fn(),
    has: jest.fn(),
    update: jest.fn(),
  })),
};

export const Uri = {
  file: jest.fn((p: string) => ({ fsPath: p, toString: () => p })),
  parse: jest.fn((p: string) => ({ fsPath: p, toString: () => p })),
};

export const FileType = {
  Unknown: 0,
  File: 1,
  Directory: 2,
  SymbolicLink: 64,
};

export const window = {
  createOutputChannel: jest.fn(() => mockOutputChannelInstance),
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showInputBox: jest.fn(),
  showQuickPick: jest.fn(),
};

// Helper to get current mock instances
export const getMockInstances = () => ({
  fs: mockFsInstance,
  outputChannel: mockOutputChannelInstance,
});
