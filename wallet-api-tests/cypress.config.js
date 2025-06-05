const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: [
      "cypress/e2e/**/*.{js,jsx,ts,tsx}",
      "cypress/e2e/wallet-api-tests/**/*.{js,jsx,ts,tsx}",
    ],
    screenshotOnRunFailure: false,
    setupNodeEvents(on) {
      require("cypress-terminal-report/src/installLogsPrinter")(on, {
        printLogsToConsole: "always",
        outputCompactLogs: false,
        includeSuccessfulHookLogs: true,
      });
    },
  },
});
