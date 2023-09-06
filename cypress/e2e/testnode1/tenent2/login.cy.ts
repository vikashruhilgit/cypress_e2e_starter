import { testnode1Configuration } from "support/configuration";

describe("Log-in functionality", () => {
  let testnode1Configuration: testnode1Configuration;

  before(() => {
    testnode1Configuration = Cypress.env(
      "testnode1"
    ) as testnode1Configuration;
  });

  it("should successfully login", () => {
    cy.visit(`${testnode1Configuration.host}/path`);

    cy.testnode1Login(
      `${testnode1Configuration.host}/path/login`,
      testnode1Configuration.testUserUsername,
      testnode1Configuration.testUserPassword
    );

    cy.visit(`${testnode1Configuration.host}/path/dashboard`);

    cy.get("img", { timeout: 10000 }).should("have.length.at.least", 1);
  });
});
