# Wallet API Tests (Cypress Project)

In this folder, you will find the Cypress automated tests for the Wallet API.  
These tests were created to validate the different functional flows of the Wallet API implementation.

---

## Test Cases Documentation

At the root of this folder, there is an Excel file containing detailed test cases as per the assignment requirements.  
This file describes the 7 main flows that have been automated. Each `.cy.js` test file corresponds to one specific test case.

---

## Project Setup

This is a Node.js project using Cypress for end-to-end testing.

### Dependencies

When you run `npm install`, the following dependencies will be installed:

- **cypress**: `^14.4.0` — Main test framework for end-to-end testing
- **cypress-terminal-report**: `^7.2.0` — Plugin to display terminal logs for Cypress tests
- **eslint**: `^9.28.0` — Linter to enforce code quality and style
- **@eslint/js**: `^9.28.0` — ESLint JavaScript parser and config
- **globals**: `^16.2.0` — Provides global variables definitions for ESLint

---

## Installing Dependencies

After cloning this repository and navigating into the `wallet-api-tests` folder, run:

```bash
npm install
```

This will install all dependencies listed above.

---

## Running Tests

All tests are designed to run in headless mode via npm scripts defined in `package.json`.
You can run:

- **All tests:**

  ```bash
  npm run test:all:headless
  ```

- **Individual test files:**
  For example, to run the "Insufficient Funds" test only:

  ```bash
  npm run test:insufficient-funds:headless
  ```

  Similarly, other scripts like `test:daily-limit:headless` or `test:withdraw-funds:headless` run specific test files in headless mode.

---

## Important

**Before running any tests**, make sure to start the Wallet API server from the `wallet-api-app` folder:

```bash
cd ../wallet-api-app
npm run start:server
```

The server must be running and accessible for the tests to interact with it successfully. Use two separate terminals to make sure you will not terminate the server by accident.

---

## Summary

- Total 7 test flows automated
- Each `.cy.js` file contains a single test case
- Tests run headless by default via npm scripts
- Detailed test case documentation available in the Excel file

---
