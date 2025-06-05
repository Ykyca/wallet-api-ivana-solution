/// <reference types="Cypress" />

import { negativeAmountDebitTransaction } from "../../../support/constants";

describe("Invalid Credit Transactions", () => {
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

  it("Add negative funds: debit, JPY", function () {
    cy.request({
      method: "POST",
      url: `/wallet/${this.walletId}/transaction`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: negativeAmountDebitTransaction,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include({
        message: "Amount must be a positive number.",
      });
    });
  });
});
