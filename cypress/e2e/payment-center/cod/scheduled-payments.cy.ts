import { PaymentCenterConfiguration } from "support/configuration";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe("scheduling a pyament", () => {
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

    it("should successfuly create a scheduled payment for an \"other\" amount", () => {
        //Make a payment other amount
        cy.get('ft-button[label="Make a Payment"]').click({ force: true });
        cy.get('ft-radio[name="amount-type"][value="other"]').click({ force: true });

        const randomNumber = getRandomNumber(5, 8000);
        cy.get('ft-textfield[label="Amount"]')
            .shadow() // Access the shadow DOM of the custom element
            .find('input') // Find the input element inside the shadow DOM
            .type(randomNumber.toString(), { force: true });
            
        cy.get('ft-radio[name="date-to-be-paid-type"][value="scheduled"]').click({ force: true });
        cy.get('ft-button[label="Review Payment"]').click({ force: true });

        let totalPaymentAmount;

        cy.get('.ReviewPayment_ContainerItem__512OK p')
            .eq(5) // Assuming Total Payment is the third <p> element, change the index if needed
            .invoke('text')
            .then((text) => {
                // Convert to the desired format with spaces for thousands and commas for decimal places
                totalPaymentAmount = text.replace(/\s/g, '').replace(',', '.').replace(/[^\d.,]+/g, '').trim();
                const [dollars, cents] = totalPaymentAmount.split('.');
                totalPaymentAmount = `${dollars.replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}${cents ? ',' + cents : ''}`;
            })
            .then(() => {

                // Continue with the rest of the code

                cy.get('ft-button[label="Submit & Pay"]').click({ force: true });

 

                cy.get('[class="SliderPageWrapper_Icon__lJVEC"]').click({ force: true });

 

                cy.get('ft-button[label="View All Activity"]')

                    .shadow() // Access the shadow DOM of the custom element

                    .find('button') // Find the input element inside the shadow DOM

                    .click({ force: true });

 

                // Now let's search for the formatted totalPaymentAmount in the table

                cy.reload();

                cy.wait(5000);

 

                // Check for the formatted amount in the table

                cy.contains('.rs-table-cell-content', totalPaymentAmount + ' USD').should('exist');

            });
    });
});