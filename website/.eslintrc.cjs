require('@uniswap/eslint-config/load');

module.exports = {
  extends: ['next/core-web-vitals', '@uniswap/eslint-config/node'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'import/no-unused-modules': 'off',

        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
      },
    },
  ],
};
