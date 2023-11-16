module.exports = {
  extends: [
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'plugin:prettier/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
    extraFileExtensions: ['.svelte'] // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true
    }
  },
  plugins: ['check-file', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*/!(index).svelte': 'PASCAL_CASE',
        '**/*/!(index|vite-env).{js,ts}': 'CAMEL_CASE'
      },
      { ignoreMiddleExtensions: true }
    ],
    'import/order': [
      'error',
      {
        groups: [
          'external',
          'builtin',
          'parent',
          'internal',
          'index',
          'sibling',
          'object',
          'type'
        ],
        'newlines-between': 'always'
      }
    ],
    'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: false }],
    'svelte/block-lang': [ //see https://sveltejs.github.io/eslint-plugin-svelte/rules/block-lang/
      "error",
      {
        "enforceScriptPresent": true,
        "enforceStylePresent": false,
        "script": "ts", // a list of languages or null to signify no language specified
        "style": "scss" // same as for script, a single value can be used instead of an array.
      }
    ],
    // TODO: remove after fix prettier warnings
    "prettier/prettier": "warn",
    "no-trailing-spaces": "warn"
  }
}
