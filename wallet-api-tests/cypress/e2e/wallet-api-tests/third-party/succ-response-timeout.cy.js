/// <reference types="Cypress" />

describe("Third party service", () => {
  const walletId = "test-wallet-123";

  it("Pending transaction auto-denial after timeou", () => {
    cy.request({
      method: "POST",
      url: `/wallet/${walletId}/pending-transaction`,
      body: { currency: "USD", amount: 100, type: "debit" },
      failOnStatusCode: false,
    }).then((res1) => {
      expect(res1.status).to.eq(201);
      expect(res1.body.status).to.eq("pending");

      // Wait 16 seconds (longer than your 15 seconds threshold)
      cy.wait(16000);

      // Second request - should return denied now
      cy.request({
        method: "POST",
        url: `/wallet/${walletId}/pending-transaction`,
        body: { currency: "USD", amount: 100, type: "debit" },
        failOnStatusCode: false,
      }).then((res2) => {
        expect(res2.status).to.eq(403);
        expect(res2.body.status).to.eq("finished");
        expect(res2.body.outcome).to.eq("denied");
      });
    });
  });
});
