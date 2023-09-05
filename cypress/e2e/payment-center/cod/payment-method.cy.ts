import { PaymentCenterConfiguration } from "support/configuration";

function getRandomName() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomName = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomName += letters.charAt(randomIndex);
  }
  return randomName;
}

describe("payment methods", () => {
  let paymentCenterConfiguration: PaymentCenterConfiguration;
  let randomName: string | null = null;

  before(() => {
    paymentCenterConfiguration = Cypress.env(
      "paymentCenter"
    ) as PaymentCenterConfiguration;

    randomName = getRandomName();
  });

  beforeEach(() => {
    cy.paymentCenterLogin(
      `${paymentCenterConfiguration.host}city-of-decatur/dashboard`,
      paymentCenterConfiguration.testUserUsername,
      paymentCenterConfiguration.testUserPassword
    );
    cy.visit(`${paymentCenterConfiguration.host}city-of-decatur/dashboard`);
  });

  //Adding invalid Payment method
  it("should fail when adding an invalid payment method", () => {
    cy.get("ft-left-drawer").shadow().find(".header-icon").click();

    // Click on the 3rd button in the dropdown
    cy.get("ft-left-drawer")
      .shadow()
      .find(".content")
      .find("li")
      .eq(2)
      .find("button")
      .click();

    cy.get('ft-button[data-cy="payment-method-add-payment-btn"]').click({
      force: true,
    });

    cy.get('ft-textfield[label="Name of Bank"]')
      .shadow()
      .find("input")
      .type("sdffdfff");

    cy.get('ft-textfield[label="Routing Number"]')
      .shadow()
      .find("input")
      .type("234324344");

    cy.get('ft-textfield[label="Account Number"]')
      .shadow()
      .find("input")
      .type("345453444455");

    cy.get('ft-textfield[label="Confirm Account Number"]')
      .shadow()
      .find("input")
      .type("345453444455");

    cy.get(
      "ft-formfield[label='I have reviewed the above and confirm it is correct.']"
    ).click();

    cy.get('ft-button[label="Save"]').click({ force: true });
    cy.wait(3000);
    cy.contains(
      'div[role="alert"]',
      "The routing number you provided is invalid, please verify and try again."
    ).should("be.visible");
  });

  //Adding Valid Payment method
  it("should allow for a valid payment method to be created", () => {
    cy.get("ft-left-drawer").shadow().find(".header-icon").click();

    // Click on the 3rd button in the dropdown
    cy.get("ft-left-drawer")
      .shadow()
      .find(".content")
      .find("li")
      .eq(2)
      .find("button")
      .click();

    cy.get('ft-button[data-cy="payment-method-add-payment-btn"]').click({
      force: true,
    });

    // cy.once('uncaught:exception', () => false);
    cy.get('ft-textfield[label="Name of Bank"]')
      .shadow()
      .find("input")
      .type(randomName);

    cy.once("uncaught:exception", () => false);

    cy.get('ft-textfield[label="Routing Number"]')
      .shadow()
      .find("input")
      .type("281073445");

    function generateRandomNumber() {
      const min = 10000000000; // Minimum 11-digit number
      const max = 99999999999; // Maximum 11-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNumber = generateRandomNumber();
    const randomNumberString = randomNumber.toString();

    cy.get('ft-textfield[label="Account Number"]')
      .shadow()
      .find("input")
      .type(randomNumberString, { delay: 100 });

    cy.get('ft-textfield[label="Confirm Account Number"]')
      .shadow()
      .find("input")
      .type(randomNumberString, { delay: 100 });

    cy.get('ft-button[label="Save"]').click({ force: true });
    cy.contains("close").click();

    cy.get("ft-left-drawer").shadow().find(".header-icon").click();

    // Click on the 3rd button in the dropdown
    cy.get("ft-left-drawer")
      .shadow()
      .find(".content")
      .find("li")
      .eq(2)
      .find("button")
      .click();

    cy.get("p[data-cy='payment-method-payment-heading']").contains(randomName, {
      matchCase: false,
    });
  });

  // Validate removal of previously created payment method
  it("should remove the recently created payment method", () => {
    // Click on the 3rd button in the dropdown
    cy.get("ft-left-drawer")
      .shadow()
      .find(".content")
      .find("li")
      .eq(2)
      .find("button")
      .click();

    cy.get("p[data-cy='payment-method-payment-heading']")
      .contains(randomName, { matchCase: false })
      .parent()
      .parent()
      .find("ft-icon-button")
      .click();

    cy.get("p[data-cy='payment-method-payment-heading']")
      .contains(randomName, { matchCase: false })
      .parent()
      .parent()
      .find("ft-menu")
      .find("ft-list-item")
      .click();

    cy.get("ft-drawer").find("ft-button[label=Delete]").click();

    cy.get("ft-drawer ft-dialog").should("exist");
  });
});
