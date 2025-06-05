import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["cypress/e2e/**/*.cy.js", "**/*.{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: {
      sourceType: "module", // treat these files as ES modules by default
      globals: globals.browser, // browser globals enabled
    },
  },
  {
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "no-constant-binary-expression": "error",
      semi: "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": "error",
      quotes: ["error", "double"],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "if", "for", "while", "try"],
        },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      ],
    },
  },
]);
