import { host } from "@fixtures/testNode1/env.json";

xdescribe("Log-in functionality", () => {

  it("should successfully login", () => {
    cy.testnode1Login(`${host}city-of-decatur/login`, "tim@apple.net", "Titan#12");

    cy.get("img", { timeout: 10000 }).should("have.length.at.least", 1);
  });
});
