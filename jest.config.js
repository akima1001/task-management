/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**'],
  coverageReporters: ['html']
}
