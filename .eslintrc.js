module.exports = {
  env: {
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'sort-exports', 'jest'],
  ignorePatterns: ['/node_modules/', '*.js', '*.yml', '*.json'],
  root: true,
  rules: {
    'prefer-template': 'error',
    'no-empty-interface': 'off',
    'newline-before-return': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
        alphabetize: {
          order: 'asc'
        }
      }
    ],
    'unused-imports/no-unused-imports': 'error',
    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/require-top-level-describe': ['error']
  },
  overrides: [
    {
      files: ['**/models/index.{ts,js}'],
      rules: {
        'sort-exports/sort-exports': ['error', { sortDir: 'asc' }]
      }
    }
  ]
}
