/*!
 * Plugin Error (v1.0.0): eslint.config.js
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  {
    name: 'recommended',
    ...js.configs.recommended
  },
  {
    name: 'plugin-languages',
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      }
    }
  },
  {
    name: 'stylistic',
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/arrow-parens': ['error', 'as-needed'],
      '@stylistic/js/block-spacing': 'error',
      '@stylistic/js/brace-style': ['error', '1tbs'],
      '@stylistic/js/comma-dangle': 'error',
      '@stylistic/js/comma-style': ['error', 'last'],
      '@stylistic/js/indent': ['error', 2, {
        VariableDeclarator: { var: 2, let: 2, const: 3 },
        SwitchCase: 1
      }],
      '@stylistic/js/no-floating-decimal': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', {
        max: 2, maxEOF: 1, maxBOF: 1
      }],
      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/object-curly-spacing': ['error', 'always', {
        arraysInObjects: false
      }],
      '@stylistic/js/operator-linebreak': ['error', 'after', {
        overrides: { '?': 'before', ':': 'before' }
      }],
      '@stylistic/js/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }]
    }
  },
  {
    name: 'plugin-configs',
    files: [
      'babel.config.cjs',
      'eslint.config.js',
      'jest.config.js',
    ],
    rules: {
      '@stylistic/js/comma-dangle': 'off',
    }
  },
  {
    name: 'jest',
    files: ['test/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      '@stylistic/js/arrow-parens': ['error', 'always'],
    },
  },
  {
    name: 'ignore files',
    ignores: ['**/*.min.js', '**/.coverage', '**/.example'],
  }
];
