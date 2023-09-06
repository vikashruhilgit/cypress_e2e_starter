import {
  DatabaseConfiguration,
  PaymentCenterConfiguration,
} from "support/configuration";

describe("the sign-up process", () => {
  let paymentCenterConfiguration: PaymentCenterConfiguration;
  let dbConfiguration: DatabaseConfiguration;

  let clickOptions = { force: true };
  let randomEmail;

  before(() => {
    paymentCenterConfiguration = Cypress.env(
      "paymentCenter"
    ) as PaymentCenterConfiguration;
    dbConfiguration = Cypress.env("db") as DatabaseConfiguration;

    // Generate random email before all the test cases
    randomEmail = `user${Cypress._.random(10000)}@${
      ["gmail.com", "yahoo.com", "hotmail.com"][Cypress._.random(2)]
    }`;
  });

  beforeEach(() => {
    cy.visit(`${paymentCenterConfiguration.host}city-of-decatur/`);
  });

  it("should allow for sign-up", () => {
    cy.get('div [class="outline-button"]').click();
    cy.findByLabelText("Email address").type(randomEmail);
    cy.findByLabelText("Password").type("Gogster123@");
    cy.findByText("Continue").click();
    cy.url().should("include", "/verification");
    //cy.contains('Welcome')

    // Check if the email has been received in Mailtrap

    cy.request({
      method: "GET",
      url: "https://mailtrap.io/api/v1/inboxes/1613324/messages",
      headers: {
        "Api-Token": "f97ec79e7aaeaede6cfdd832dae4c746",
      },
    })
      .then((response) => {
        // Find the email that matches the email address used to sign up
        const matchingEmail = response.body.find(
          (email) => email.to_email === randomEmail
        );

        // Request the email body using Mailtrap API
        return cy.request({
          method: "GET",
          url: `https://mailtrap.io/api/v1/inboxes/1613324/messages/${matchingEmail.id}/body.html`,
          headers: {
            "Api-Token": "f97ec79e7aaeaede6cfdd832dae4c746",
          },
        });
      })
      .then((response) => {
        // Extract the confirmation link from the email body
        const emailBody = response.body;
        const confirmationLink = /href="([^"]+)"/.exec(emailBody)[1];

        // Visit the confirmation link
        cy.visit(confirmationLink);

        // Check if user is redirected to the next page
        //cy.url().should('include', '/next-page');

        cy.get(".outline-button").click();

        // cy.findByLabelText('First Name').type('sdffdfff');
        cy.get('ft-textfield[label="First Name"]')
          .shadow()
          .find("input")
          .type("sdffdfff");

        cy.get('ft-textfield[label="Last Name"]')
          .shadow()
          .find("input")
          .type("sdffdfff");

        cy.get('ft-textfield[label="Address Line 1"]')
          .shadow()
          .find("input")
          .type("sdffdfff");

        cy.get('ft-textfield[label="Address Line 2"]')
          .shadow()
          .find("input")
          .type("sdffdfff");

        // cy.findByLabelText('Address Line 1').type('sdffdfff')
        // cy.findByLabelText('Address Line 2').type('sdffdfff')

        //Country dropdown

        cy.get('ft-select[label="Country"]')
          .shadow()
          .find("input")
          .click({ force: true });

        cy.get('ft-list-item[value="United States"]')
          .shadow()
          .parent()
          .click({ force: true });

        //cy.findByLabelText('Country').click()
        //cy.findByText('United States').click()

        cy.get('ft-textfield[label="City"]')
          .shadow()
          .find("input")
          .type("sdffdfff");

        //cy.findByLabelText('City').type('sdffdfff')

        //State/Provenances dropdown

        cy.get('ft-select[label="State/Provenances"]')
          .shadow()
          .find("input")
          .click({ force: true });

        cy.get('ft-list-item[value="AS"]')
          .shadow()
          .parent()
          .click({ force: true });

        cy.get('ft-textfield[label="Zip Code"]')
          .shadow()
          .find("input")
          .type("45698");

        // cy.findByLabelText('Customer Number').type('134873')
        // cy.findByLabelText('Next').click()

        cy.sqlServer(
          dbConfiguration.dbNames.testnode1,
          "SELECT TOP 1 AI.AccountNumber, AICP.[Value] AS CID FROM AccountInformation AI JOIN AccountInformationCustomProperties AICP ON AI.Id = AICP.AccountInformationId AND AICP.PropertyKey = 'CID' WHERE AI.ClientId = 5 AND AI.Active = 1 AND AI.UserId IS NULL ORDER BY NEWID()"
        ).then(function (result) {
          const accountNumber = result[0];
          const cid = result[1];
          console.log("Account Number:", accountNumber);
          console.log("CID:", cid);

          // Enter account number and CID into text fields
          cy.get('ft-textfield[label="Account Number"]')
            .shadow()
            .find("input")
            .type(accountNumber);

          cy.get('ft-textfield[label="Customer Number"]')
            .shadow()
            .find("input")
            .type(cid);

          cy.get('ft-button[label="Next"]').click();

          cy.wait(4000);

          cy.get("article").contains(accountNumber).should("exist");
        });
      });
  });
});
