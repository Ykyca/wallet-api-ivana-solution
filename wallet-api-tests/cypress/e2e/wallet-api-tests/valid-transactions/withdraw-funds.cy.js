// / <reference types="Cypress" />

import { validDebitTransaction } from "../../../support/constants";

describe("Valid Debit Transactions", () => {
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
      validDebitTransaction.amount,
      validDebitTransaction.currency,
      this.walletId,
      this.token
    );
  });

  it("Withdraw fuds: debit, USD", function () {
    cy.request({
      method: "POST",
      url: `/wallet/${this.walletId}/withdraw`,
      headers: { Authorization: `Bearer ${this.token}` },
      body: {
        currency: validDebitTransaction.currency,
        amount: validDebitTransaction.amount,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.transaction).to.include({
        currency: validDebitTransaction.currency,
        amount: validDebitTransaction.amount,
        type: "debit",
        status: "finished",
        outcome: "approved",
      });
      const expectedBalance = depositAmount - validDebitTransaction.amount;

      expect(response.body.newBalance, "New balance mismatch").to.eq(
        expectedBalance
      );
    });
  });
});
