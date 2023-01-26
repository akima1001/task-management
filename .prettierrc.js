module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'none',
  semi: false,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.json',
      options: { parser: 'json' }
    }
  ]
}
