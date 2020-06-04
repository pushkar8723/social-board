import { DataSource } from 'apollo-datasource';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import { makePromise, execute } from 'apollo-link';
import { DocumentNode } from 'graphql';

class FaunaDB extends DataSource {
    private baseURL: string;

    private client: HttpLink;

    constructor() {
        super();
        this.baseURL = 'https://graphql.fauna.com/graphql';
        this.client = new HttpLink({
            uri: this.baseURL,
            fetch,
            headers: {
                authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
            },
        });
    }

    async execute(query: DocumentNode, variables?: { [k:string]: any }) {
        return makePromise(execute(this.client, { query, variables }));
    }
}

export default FaunaDB;
