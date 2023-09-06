/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { sqlQueryCommand } from "../multiple-db-sql-server";
import { Auth0Configuration } from "./configuration";
sqlQueryCommand();

function testNode1Auth0Login(
  auth0Config: Auth0Configuration,
  url: string,
  username: string,
  password: string
) {
  const theUrl = new URL(url);

  cy.visit(url);

  const doLogin = (username: string, password: string) => {
    cy.get("form").within(() => {
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get("button[data-action-button-primary=true]").click();
    });
  };

  if (!theUrl.hostname.endsWith("1tech.net")) {
    cy.origin(
      auth0Config.host,
      { args: { username, password } },
      ({ username, password }) => {
        doLogin(username, password);
      }
    );
  } else {
    doLogin(username, password);
  }
}

Cypress.Commands.add(
  "testnode1Login",
  (url: string, username: string, password: string) => {
    const auth0Config = Cypress.env("auth0") as Auth0Configuration;

    const log = Cypress.log({
      displayName: "AUTH0 LOGIN",
      message: [
        `🔐 Authenticating | ${username}`,
        `Auth0 host: ${auth0Config.host}`,
        `Navigating to ${url}`,
      ],
      autoEnd: true,
    });

    log.snapshot("before");

    cy.session(
      [username, password],
      () => {
        testNode1Auth0Login(auth0Config, url, username, password);
        // URl after login like : /dashboard
        cy.url().should("contain", "/dashboard");
      },
      {
        validate: () => {

          /* test your condition for validation
          *   Validating the login condition what ever your app supoprt
          */

          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("@@auth0spajs@@") && !key.endsWith("@@user@@")) {
              const localStorageAuth0UserValue = localStorage.getItem(key);
              const auth0UserValue = JSON.parse(localStorageAuth0UserValue);
              const expires = new Date(0);
              expires.setUTCSeconds(auth0UserValue.expiresAt);
              console.log("expires", expires);
              if (expires <= new Date()) {
                return Promise.reject();
              }
            }
          }
          return Promise.resolve();
        },
      }
    );

    log.snapshot("after");
    log.end();
  }
);

Cypress.Commands.add(
  "agentsLogin",
  (url: string, location: string, username: string, password: string) => {
    cy.session([location, username, password], () => {
      cy.visit(url);
      cy.get("ft-button[label='Login']").click();

      cy.get("input").type(location);
      cy.get("#postButton").find("a").click();

      cy.get("#username").type(username);
      cy.get("#password").type(password);
      cy.get("#signOnButton").click();
    });
  }
);

// declare namespace Cypress {
//     interface Chainable<Subject> {
//         login(): Chainable<any>
//     }
// }

// import '@testing-library/cypress/add-commands';
// import './commands'
// import sqlServer from 'cypress-sql-server';
// sqlServer.loadDBCommands();

// Cypress.Commands.add('generateRandomEmail', () => {
//     const randomEmail = `user${Cypress._.random(10000)}@${['gmail.com', 'yahoo.com', 'hotmail.com'][Cypress._.random(2)]}`;
//     cy.wrap(randomEmail).as('randomEmail');
// });
