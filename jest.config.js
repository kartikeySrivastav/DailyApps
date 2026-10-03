module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/packages/**/__tests__/**/*.test.ts',
    '**/packages/**/__tests__/**/*.test.tsx',
    '**/apps/**/__tests__/**/*.test.ts',
    '**/apps/**/__tests__/**/*.test.tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};
