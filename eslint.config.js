import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import dicodingConfig from 'eslint-config-dicodingacademy';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'storybook-static',
      'cypress/videos',
      'cypress/screenshots',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...dicodingConfig.rules,
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Berkas pengujian (unit, thunk, dan komponen) memakai Vitest globals.
    files: ['**/*.{test,spec}.{js,jsx}', 'src/tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.vitest,
        ...globals.node,
      },
    },
  },
  {
    // Berkas End-to-End testing memakai Cypress + Mocha globals.
    files: ['cypress/**/*.{js,jsx}', 'cypress.config.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.node,
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
  {
    // Konfigurasi Storybook dijalankan di lingkungan Node.
    files: ['.storybook/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
