import { PaymentCenterConfiguration } from "support/configuration";

context("Make a payment end-to-end", () => {
  let paymentCenterConfiguration: PaymentCenterConfiguration;

  before(() => {
    paymentCenterConfiguration = Cypress.env(
      "paymentCenter"
    ) as PaymentCenterConfiguration;
  });

  beforeEach(() => {
    cy.paymentCenterLogin(
      `${paymentCenterConfiguration.host}city-of-decatur/dashboard`,
      paymentCenterConfiguration.testUserUsername,
      paymentCenterConfiguration.testUserPassword
    );
    cy.visit(`${paymentCenterConfiguration.host}city-of-decatur/dashboard`);
  });

  it.only("Make a payment", () => {
    //Make a payment

    cy.get('ft-button[label="Make a Payment"]').click({ force: true });
    cy.get('ft-radio[name="amount-type"][value="other"]').click({
      force: true,
    });

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNumber = getRandomNumber(5, 8000);

    cy.get('ft-textfield[label="Amount"]')
      .shadow() // Access the shadow DOM of the custom element
      .find("input") // Find the input element inside the shadow DOM
      .type(randomNumber, { force: true });

    cy.get('ft-button[label="Review Payment"]').click({ force: true });

    // Check if the payment confirmation popup is displayed
    cy.get("ft-dialog").then((dialogs) => {
      if (dialogs.length > 0) {
        // Popup is shown, click the "Continue" button
        cy.get("ft-button[dialogaction='discard']").click();
      } else {
        // Popup is not shown, skip the actions
        cy.log(
          "Payment confirmation popup is not displayed. Skipping actions."
        );
      }
    });

    cy.get('ft-button[label="Submit & Pay"]').click({ force: true });

    cy.get("ft-drawer")
      .find(
        "p[data-cy='sliderPage-makePayment-confirmation-confirmationNumber']"
      )
      .invoke("text")
      .then((text) => {
        const receiptNumber = text.trim();
        cy.wrap(receiptNumber).as("receiptNumber");
        // do something with the receiptNumber, like saving it for later use

        cy.get("ft-drawer").find("ft-icon").contains("close").click();

        cy.get("ft-button[label='View All Activity']")
          .click({ force: true });

        cy.reload();
        cy.wait(3000);

        cy.get(".rs-table-body-row-wrapper")
          .contains('div[role="gridcell"]', receiptNumber)
          .should("exist");
      });
  });

  it("Make a scheduled payment ,other amount", () => {
    //Make a payment other amount

    cy.get('ft-button[label="Make a Payment"]').click({ force: true });
    cy.get('ft-radio[name="amount-type"][value="other"]').click({
      force: true,
    });

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNumber = getRandomNumber(5, 8000);

    cy.get('ft-textfield[label="Amount"]')
      .shadow() // Access the shadow DOM of the custom element
      .find("input") // Find the input element inside the shadow DOM
      .type(randomNumber, { force: true });

    cy.get('ft-radio[name="date-to-be-paid-type"][value="scheduled"]').click({
      force: true,
    });

    cy.get('ft-button[label="Review Payment"]').click({ force: true });

    // To skip popup

    // Check if the payment confirmation popup is displayed
    cy.get("ft-dialog").should("be.visible");

    // Click the "Continue" button in the popup
    cy.get("ft-button[dialogaction='discard']").click();

    let totalPaymentAmount;

    cy.get(".ReviewPayment_ContainerItem__512OK p")
      .eq(5) // Assuming Total Payment is the third <p> element, change the index if needed
      .invoke("text")
      .then((text) => {
        // Convert to the desired format with spaces for thousands and commas for decimal places
        totalPaymentAmount = text
          .replace(/\s/g, "")
          .replace(",", ".")
          .replace(/[^\d.,]+/g, "")
          .trim();
        const [dollars, cents] = totalPaymentAmount.split(".");
        totalPaymentAmount = `${dollars.replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}${
          cents ? "," + cents : ""
        }`;
      })
      .then(() => {
        // Continue with the rest of the code
        cy.get('ft-button[label="Submit & Pay"]').click({ force: true });

        cy.get('[class="SliderPageWrapper_Icon__lJVEC"]').click({
          force: true,
        });

        cy.get('ft-button[label="View All Activity"]')
          .shadow() // Access the shadow DOM of the custom element
          .find("button") // Find the input element inside the shadow DOM
          .click({ force: true });

        // Now let's search for the formatted totalPaymentAmount in the table
        cy.reload();
        cy.wait(3000);

        // Check for the formatted amount in the table
        cy.contains(
          ".rs-table-cell-content",
          totalPaymentAmount + " USD"
        ).should("exist");
      });
  });
});
