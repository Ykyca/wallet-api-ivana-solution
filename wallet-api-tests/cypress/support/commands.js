// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getToken", (username, password) => {
  return cy.request({
    method: "POST",
    url: "http://localhost:3000/user/login",
    headers: {
      "X-Service-Id": "test-service-header",
    },
    body: {
      username,
      password,
    },
  });
});

Cypress.Commands.add("getWalletBalance", (walletId, token, currency) => {
  return cy
    .request({
      method: "GET",
      url: `/wallet/${walletId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const clip = res.body.currencyClips.find((c) => c.currency === currency);

      return clip?.balance || 0;
    });
});

Cypress.Commands.add(
  "assertWalletBalanceChange",
  (walletId, token, currency, initialBalance, amount, type) => {
    const expectedBalance =
      type === "credit" ? initialBalance + amount : initialBalance - amount;

    cy.request({
      method: "GET",
      url: `/wallet/${walletId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const clip = res.body.currencyClips.find((c) => c.currency === currency);

      expect(clip, `Currency clip for ${currency} exists`).to.exist;
      expect(clip.balance, `Balance updated for ${currency}`).to.eq(
        expectedBalance
      );
    });
  }
);

Cypress.Commands.add(
  "prepareWalletWithFunds",
  (user, amount, currency, walletId, token) => {
    return cy
      .request({
        method: "POST",
        url: `/wallet/${walletId}/transaction`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          currency,
          amount,
          type: "credit",
        },
      })
      .then((res) => {
        expect(res.status).to.eq(201);
        cy.log(`Wallet funded with ${amount} ${currency}`);

        // Now fetch and return the new balance
        return cy.getWalletBalance(walletId, token, currency);
      });
  }
);
// });

Cypress.Commands.add(
  "cleanupWalletBalance",
  (amount, currency, walletId, token) => {
    cy.getWalletBalance(walletId, token, currency).then((balance) => {
      if (balance > 0) {
        return cy
          .request({
            method: "POST",
            url: `/wallet/${walletId}/withdraw`,
            headers: { Authorization: `Bearer ${token}` },
            body: {
              currency,
              amount: balance,
            },
            failOnStatusCode: false,
          })
          .then((res) => {
            if (res.status !== 201) {
              cy.log("Cleanup withdraw failed:", JSON.stringify(res.body));
            } else {
              cy.log("Cleanup withdraw successful:", JSON.stringify(res.body));
            }
          });
      } else {
        cy.log("Wallet already empty.");
      }
    });
  }
);
//   });
// });
