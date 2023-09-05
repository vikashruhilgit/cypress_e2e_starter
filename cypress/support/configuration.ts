import { ConnectionOptions } from "tedious";

export interface Auth0Configuration {
  host: string;
}

export interface DbNames {
  paymentCenter: string;
}

export interface DatabaseConfiguration {
  userName: string;
  password: string;
  server: string;
  options: ConnectionOptions;
  dbNames: DbNames
}

export interface PaymentCenterConfiguration {
  host: string;
  testUserUsername: string;
  testUserPassword: string;
}

export interface EnvironmentConfiguration {
  auth0: Auth0Configuration;
  db: DatabaseConfiguration;
  paymentCenter: PaymentCenterConfiguration;
}
