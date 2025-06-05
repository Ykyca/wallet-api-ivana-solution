/// <reference types="Cypress" />

import { validDebitTransaction } from "../../../support/constants";

describe("Third party service", () => {
  const depositAmount = validDebitTransaction.amount * 2;

  let token;

  let walletId;

  beforeEach(() => {
    cy.log("Setting up test: loading fixtures, adding money to wallet...");
    cy.fixture("users").then((users) => {
      const user = users.john;

      cy.getToken(user.username, user.password).then((response) => {
        token = response.body.token;
        walletId = response.body.userId;
        cy.wrap(token).as("token");
        cy.wrap(walletId).as("walletId");

        cy.prepareWalletWithFunds(
          user,
          depositAmount,
          validDebitTransaction.currency,
          walletId,
          token
        );
      });
    });
  });

  afterEach(function () {
    cy.cleanupWalletBalance(
      depositAmount,
      validDebitTransaction.currency,
      this.walletId,
      this.token
    );
  });

  it("Exceed daily limit", function () {
    cy.request({
      method: "POST",
      url: `/wallet/${walletId}/withdraw-failure`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
      body: {
        currency: validDebitTransaction.currency,
        amount: validDebitTransaction.amount - 1,
      },
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body.reason).to.eq(
        "Transaction denied: Daily limit exceeded"
      );
    });
  });
});
