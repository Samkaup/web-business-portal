var tsConfigs = ['./tsconfig.json'];

var ruleOverrides = {};

module.exports = {
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'prettier'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs,
        sourceType: 'module',
        ecmaVersion: 2020
      },
      env: {
        es6: true
      },
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      },
      files: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'emails/**/*.ts',
        'emails/**/*.tsx'
      ]
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs
      },
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'prettier/prettier': 'error'
      },
      files: ['e2e/**/*.spec.ts']
    },
    {
      extends: ['eslint:recommended', 'prettier', 'esnext'],
      files: '*.mjs',
      rules: ruleOverrides
    },
    {
      extends: ['prettier'],
      files: '*.js',
      rules: ruleOverrides
    }
  ],
  root: true
};
