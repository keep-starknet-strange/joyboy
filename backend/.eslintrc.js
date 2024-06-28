require('@uniswap/eslint-config/load');

module.exports = {
  extends: ['@uniswap/eslint-config/node'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
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
