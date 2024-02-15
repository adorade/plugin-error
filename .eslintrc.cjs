/*!
 * Plugin Error (v1.0.0): .eslintrc.cjs
 *
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "block-spacing": "error",
    "comma-dangle": "error",
    "comma-style": ["error", "last"],
    indent: ["error", 2, {
      VariableDeclarator: { var: 2, let: 2, const: 3 },
      SwitchCase: 1
    }],
    "no-floating-decimal": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 1 }],
    "no-trailing-spaces": "error",
    quotes: ["error", "single", { avoidEscape: true }],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }]
  },
  overrides: [
    {
      files: [
        ".eslintrc.cjs",
        ".babelrc.cjs"
      ],
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"]
      }
    }
  ]
};
