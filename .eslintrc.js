module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended'],
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'ignorePatterns': [
    'public'
  ],
  'env': {
    'browser': true,
    'node': true,
    'es2020': true
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'indent': 'off',
    'quotes': 'off',
    'semi': 'off',
    'no-unused-vars': 'off',
    'block-spacing': ['error', 'always'],
    'object-curly-spacing': ['error','always'],
    'no-trailing-spaces': 'error',
  }
}
