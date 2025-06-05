/// <reference types="Cypress" />

import { validDebitTransaction } from "../../../support/constants";

describe("Invalid Debit Transactions", () => {
  const depositAmount = validDebitTransaction.amount / 2;

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

  it("Withdraw insufficient fuds: debit, USD", function () {
    cy.request({
      method: "POST",
      url: `/wallet/${this.walletId}/withdraw`,
      headers: { Authorization: `Bearer ${this.token}` },
      body: {
        currency: validDebitTransaction.currency,
        amount: validDebitTransaction.amount,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include({
        message: "Insufficient funds.",
      });
    });
  });
});
