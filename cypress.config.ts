import { defineConfig } from "cypress";

import { sqlQueryPlugin } from "./cypress/multiple-db-sql-server";
import { DbNames, EnvironmentConfiguration } from "support/configuration";
import { Dictionary } from "cypress/types/lodash";

const dbNames: Dictionary<DbNames> = {
  localhost: {
    testnode1: "db-dev-cus-testnode1",
  },
  "stage": {
    testnode1: "db-dev-cus-testnode1",
  },
  "production": {
    testnode1: "db-qa-cus-testnode1",
  },
};

const server = process.env.CONNECTION_SERVER
? process.env.CONNECTION_SERVER
: "localhost";

const envConfig: EnvironmentConfiguration = {
  db: {
    userName: process.env.CONNECTION_USERNAME
      ? process.env.CONNECTION_USERNAME
      : "USERNAME",
    password: process.env.CONNECTION_PASSWORD
      ? process.env.CONNECTION_PASSWORD
      : "PASSWORD",
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
      : "https://Your app URL/",
  },
  testNode1: {
    host: process.env.PAYMENT_CENTER_HOST
      ? process.env.PAYMENT_CENTER_HOST
      : "https://HOSTNAME/",
    testUserPassword: process.env.PAYMENT_CENTER_TEST_USER_PASSWORD
      ? process.env.PAYMENT_CENTER_TEST_USER_PASSWORD
      : "PASSWORD",
    testUserUsername: process.env.PAYMENT_CENTER_TEST_USER_USERNAME
      ? process.env.PAYMENT_CENTER_TEST_USER_USERNAME
      : "USERNAME",
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
