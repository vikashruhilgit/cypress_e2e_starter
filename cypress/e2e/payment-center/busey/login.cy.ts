import { host } from "@fixtures/payment-center/env.json";

xdescribe("Log-in functionality", () => {

  it("should successfully login", () => {
    cy.paymentCenterLogin(`${host}city-of-decatur/login`, "tim@apple.net", "Titan#12");

    cy.get("img", { timeout: 10000 }).should("have.length.at.least", 1);
  });
});
