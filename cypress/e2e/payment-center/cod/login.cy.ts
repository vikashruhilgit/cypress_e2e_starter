import { PaymentCenterConfiguration } from "support/configuration";

describe("Log-in functionality", () => {
  let paymentCenterConfiguration: PaymentCenterConfiguration;

  before(() => {
    paymentCenterConfiguration = Cypress.env(
      "paymentCenter"
    ) as PaymentCenterConfiguration;
  });

  it("should successfully login", () => {
    cy.visit(`${paymentCenterConfiguration.host}city-of-decatur`);

    cy.paymentCenterLogin(
      `${paymentCenterConfiguration.host}city-of-decatur/login`,
      paymentCenterConfiguration.testUserUsername,
      paymentCenterConfiguration.testUserPassword
    );

    cy.visit(`${paymentCenterConfiguration.host}city-of-decatur/dashboard`);

    cy.get("img", { timeout: 10000 }).should("have.length.at.least", 1);
  });
});
