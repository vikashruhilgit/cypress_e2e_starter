# Innovations Automated UI Tests - Cypress Test Suite

This repository contains a comprehensive Cypress test suite to automate end-to-end tests for Payments Anywhere (Payment Center) and the Walk-in/Agents applications.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Reporting](#test-reporting)
- [Troubleshooting](#troubleshooting)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)
- [Contact Information](#contact-information)

## Setup Instructions

1. Clone this repository.
2. Install Node.js and npm if not already installed.
3. Run `npm install` to install project dependencies.
4. Install Cypress globally: `npm install -g cypress`.

## Configuration

1. Update `cypress.config.ts` with required configuration options per needs 
2. You can also create your own script based on already added , for example testCODdev in the package.json file 

## Test Suite Structure

The `cypress` folder contains the test suite. The

Tests are organized into the following directories:
- `e2e`: Contains test files for different modules.

The `fixtures` folder provides `.json` files for containing data used during the test runs. The `support` folder contains scripts that are used for enhancing the cypress environment during execution.

## Running Tests

There are several methods for running the tests.

For testing from Cypress UI view enter execute `npx cypress open` in this directory. This will open the Cypress application for managing tests. Individual test specs can be selected and run in various browsers. Use this for local automated testing.

Tests can be run from the command line in a "headless" browser. These tests are split into sections based on Payment Center and Walk-in/Agents:

* Run `npm run test:pa` to execute tests against all Payment Center clients.
* Run `npm run test:agents` to execute tests agains the Walk-in/Agents app.

*Note, the Walk-in/Agents app is currently tailored to USCC. The log-in process is reliant on their IdP such that it makes writing reliable test cases impossible.*
