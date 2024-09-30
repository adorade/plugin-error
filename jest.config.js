/*!
 * Plugin Error (v2.0.1): jest.config.js
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

/** @type {import('jest').Config} */
const config =  {
  displayName: {
    name: 'PLUGIN ERROR',
    color: 'cyan',
  },
  clearMocks: true,
  collectCoverageFrom: [
    'index.js'
  ],
  coverageDirectory: './.coverage/',
  coverageReporters: [
    'html',
    'text',
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    }
  },
  fakeTimers: {
    enableGlobally: true,
  },
  // transform: {
  //   'index.js': 'babel-jest'
  // },
  transform: {},
  roots: ['test'],
  testRegex: '.*\\.test\\.js$',
};

export default config;
