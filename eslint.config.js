import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: [
      'dist/**',
      'backend/dist/**', 
      'backend/src/**', // Ignore backend TypeScript files
      'node_modules/**',
      'sample-code/**',
      '*.config.js',
      '**/*.ts',        // Ignore all TypeScript files
      '**/*.tsx',       // Ignore all TypeScript React files
      '**/*.d.ts',      // Ignore TypeScript declaration files
      '.env*'
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_' 
      }],
    },
  },
]
