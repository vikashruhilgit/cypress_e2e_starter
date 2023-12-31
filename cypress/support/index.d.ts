declare namespace Cypress {
    interface Chainable<Subject> {
        testnode1Login(url: string, username: string, password: string): Chainable<any>;

        agentsLogin(url: string, location: string, username: string, password: string): Chainable<any>;

        sqlServer(dbName: string, query: string): Chainable<any>;
    }
}