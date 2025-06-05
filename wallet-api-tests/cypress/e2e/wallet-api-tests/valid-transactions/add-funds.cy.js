// / <reference types="Cypress" />

import { validCreditTransaction } from "../../../support/constants";

describe("Valid Credit Transactions", () => {
  let token;

  let walletId;

  beforeEach(() => {
    cy.log("Setting up test: loading fixtures, getting token and wallet ID...");
    cy.fixture("users").then((users) => {
      const user = users.ivana;

      cy.getToken(user.username, user.password).then((response) => {
        token = response.body.token;
        walletId = response.body.userId;
        cy.wrap(token).as("token");
        cy.wrap(walletId).as("walletId");
      });
    });
  });

  afterEach(function () {
    cy.log("Cleaning up by withdrawing credited funds...");
    cy.request({
      method: "POST",
      url: `/wallet/${this.walletId}/withdraw`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: {
        currency: validCreditTransaction.currency,
        amount: validCreditTransaction.amount,
      },
      // failOnStatusCode: false,
    }).then((response) => {
      cy.log("Cleanup withdraw response body:", JSON.stringify(response.body));
    });
  });

  it("Add funds: credit, EUR", function () {
    cy.getWalletBalance(
      this.walletId,
      this.token,
      validCreditTransaction.currency
    ).then((initialBalance) => {
      cy.log("Initial balance:", initialBalance);
      cy.request({
        method: "POST",
        url: `/wallet/${this.walletId}/transaction`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: validCreditTransaction,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include({
          currency: validCreditTransaction.currency,
          amount: validCreditTransaction.amount,
          type: validCreditTransaction.type,
          status: "finished",
          outcome: "approved",
        });
        cy.assertWalletBalanceChange(
          this.walletId,
          this.token,
          validCreditTransaction.currency,
          initialBalance,
          validCreditTransaction.amount,
          validCreditTransaction.type
        );
      });
    });
  });
});
