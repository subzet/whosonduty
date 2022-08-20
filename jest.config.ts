import type { Config } from '@jest/types';

import swcConfig from './.swcrc.json';

const config: Config.InitialOptions = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...swcConfig, minify: false }],
  },
  bail: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/global-setup.ts',
  globalTeardown: '<rootDir>/test/global-teardown.ts',
  setupFiles: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts'],
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testTimeout: 10_000,
  silent: false,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  passWithNoTests: true,
};

export default config;
