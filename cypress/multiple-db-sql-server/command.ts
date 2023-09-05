import { ConnectionConfig } from "tedious";
// @ts-nocheck

function getDbConfig(db: string): ConnectionConfig {
  const config = Cypress.env("db") as ConnectionConfig;
  config.options.database = db;
  return config;
}

export default function () {
  Cypress.Commands.add("sqlServer", (dbName: string, query: string) => {
    if (!dbName) {
      fail("[sqlServer] Database name needs to be provided");
    }
    if (!query) {
      fail("[sqlServer] SQL Query needs to be provided");
    }

    const dbConfig = getDbConfig(dbName);

    cy.task("sqlServer:execute", { query, config: dbConfig }).then(
      (response) => {
        let result = [];

        const flatten = (r) =>
          Array.isArray(r) && r.length === 1 ? flatten(r[0]) : r;

        if (response) {
          for (let i in response) {
            result[i] = [];
            for (let c in response[i]) {
              result[i][c] = response[i][c].value;
            }
          }
          result = flatten(result);
        } else {
          result = response;
        }

        return result;
      }
    );
  });
}
