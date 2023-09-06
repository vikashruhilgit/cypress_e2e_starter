import { ConnectionOptions } from "tedious";

export interface Auth0Configuration {
  host: string;
}

export interface DbNames {
  testnode1: string;
}

export interface DatabaseConfiguration {
  userName: string;
  password: string;
  server: string;
  options: ConnectionOptions;
  dbNames: DbNames
}

export interface testnode1Configuration {
  host: string;
  testUserUsername: string;
  testUserPassword: string;
}

export interface EnvironmentConfiguration {
  auth0: Auth0Configuration;
  db: DatabaseConfiguration;
  testNode1: testnode1Configuration;
}
