import { host } from "@fixtures/payment-center/env.json";

describe("Busey Loan Pay guest payment flow", () => {
  it("should have the guest payment button on the landing page.", () => {
    cy.visit(`${host}busey`);
    cy.get("ft-button[label='Quick Pay Now']").should("exist");
  });

  it("should reject an incorrect loan account number.", () => {
    cy.visit(`${host}busey`);
    cy.get("ft-button[label='Quick Pay Now']").click();

    cy.get("ft-textfield[label='Loan Account No.']")
      .shadow()
      .find("input")
      .type("abc123");
    cy.get("ft-textfield[label='Zip Code']")
      .shadow()
      .find("input")
      .type("32606");

    cy.get("ft-button[label='Make Payment']").click();

    const alertDiv = cy.get("ft-nav").shadow().get("div[role=alert]");
    
    alertDiv.should("exist")
    alertDiv.should("contain.text", "No Data Found, Please enter correct information or try again after some time.");
  });
});
