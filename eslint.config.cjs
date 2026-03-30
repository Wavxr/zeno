const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**", "release/**", "build/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["main/**/*.js", "preload/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["renderer/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    }
  }
];
