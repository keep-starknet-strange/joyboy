/* eslint-env node */

const { node: restrictedImports } = require('@uniswap/eslint-config/restrictedImports')
require('@uniswap/eslint-config/load')

module.exports = {
  extends: ['@uniswap/eslint-config/react'],
  plugins: [],

  overrides: [
    {
      files: ['**/*'],
      rules: {
        'multiline-comment-style': ['error', 'separate-lines'],
      },
    },
    {
      // Configuration/typings typically export objects/definitions that are used outside of the transpiled package
      // (eg not captured by the tsconfig). Because it's typical and not exceptional, this is turned off entirely.
      files: ['**/*.config.*', '**/*.d.ts'],
      rules: {
        'import/no-unused-modules': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-restricted-imports': [
          'error',
          restrictedImports,
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: ':matches(ExportAllDeclaration)',
            message: 'Barrel exports bloat the bundle size by preventing tree-shaking.',
          },
        ],
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-restricted-imports': ['error'],
      },
    },
  ],
}
