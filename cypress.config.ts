import { defineConfig } from "cypress";

import { sqlQueryPlugin } from "./cypress/multiple-db-sql-server";
import { DbNames, EnvironmentConfiguration } from "support/configuration";
import { Dictionary } from "cypress/types/lodash";

const dbNames: Dictionary<DbNames> = {
  localhost: {
    paymentCenter: "db-dev-cus-paymentcenter",
  },
  "rg-dev-cus-billersvc.database.windows.net": {
    paymentCenter: "db-dev-cus-paymentcenter",
  },
  "azsql-qa-cus-innovation.database.windows.net": {
    paymentCenter: "db-qa-cus-paymentcenter",
  },
};

const server = process.env.CONNECTION_SERVER
? process.env.CONNECTION_SERVER
: "localhost";

const envConfig: EnvironmentConfiguration = {
  db: {
    userName: process.env.CONNECTION_USERNAME
      ? process.env.CONNECTION_USERNAME
      : "sa",
    password: process.env.CONNECTION_PASSWORD
      ? process.env.CONNECTION_PASSWORD
      : "titan#12",
    server: server,
    options: {
      database: "",
      encrypt: true,
      rowCollectionOnRequestCompletion: true,
      trustServerCertificate: true,
      port: 1433, // Default Port
    },
    dbNames: dbNames[server]
  },
  auth0: {
    host: process.env.AUTH0_HOST
      ? process.env.AUTH0_HOST
      : "https://dev-login.1tech.net/",
  },
  paymentCenter: {
    host: process.env.PAYMENT_CENTER_HOST
      ? process.env.PAYMENT_CENTER_HOST
      : "https://payments-dev.1tech.net/",
    testUserPassword: process.env.PAYMENT_CENTER_TEST_USER_PASSWORD
      ? process.env.PAYMENT_CENTER_TEST_USER_PASSWORD
      : "Titan#12",
    testUserUsername: process.env.PAYMENT_CENTER_TEST_USER_USERNAME
      ? process.env.PAYMENT_CENTER_TEST_USER_USERNAME
      : "tim@apple.com",
  },
};

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        ...sqlQueryPlugin,
      });
    },
  },
  env: envConfig,
});
