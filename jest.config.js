/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testRegex: '.*\\.spec\\.ts$'
  // collectCoverage: true,
  // collectCoverageFrom: ['**/*.ts', '!**/node_modules/**'],
  // coverageReporters: ['html']
}
