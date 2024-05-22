require('@uniswap/eslint-config/load');

module.exports = {
  extends: ['@uniswap/eslint-config/react'],

  env: {
    'react-native/react-native': true,
  },

  plugins: ['react', 'react-native', 'react-hooks'],

  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-empty': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/function-component-definition': [
      'error',
      {
        unnamedComponents: ['function-expression', 'arrow-function'],
        namedComponents: ['function-declaration', 'arrow-function'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx', '.ts', '.tsx']}],
    'react/prop-types': 'off',
    'react/button-has-type': 'off',
    'react-native/no-raw-text': 'off',
    'react-native/no-single-element-style-arrays': 'error',
    'react/jsx-one-expression-per-line': 'off',

    // These configs should be enabled after the hackathon and we have time to fix all the issues
    'react-native/no-unused-styles': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
  },

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'import/no-unused-modules': 'off',
      },
    },
  ],
};
