/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testRegex: '.*\\.spec\\.ts$',
  globalSetup: '<rootDir>/src/shared/config/tests/setupEnv.ts'
  // collectCoverage: true,
  // collectCoverageFrom: ['**/*.ts', '!**/node_modules/**'],
  // coverageReporters: ['html']
}
