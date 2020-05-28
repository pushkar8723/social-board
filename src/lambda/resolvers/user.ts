import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { gql } from 'apollo-server-lambda';
import fetch from 'node-fetch';
import { QueryGetUserArgs, MutationCreateUserArgs } from '../../generated/types.d';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});


const resolvers = {
    Query: {
        getUser: async (parent, args: QueryGetUserArgs) => {
            const query = gql`
                query($email: String!) {
                    findUserByEmail(email: $email) {
                        _id
                        name
                        imageUrl
                    }
                }
            `;
            const resp = await makePromise(execute(client, { query, variables: args }));
            if (resp.data.findUserByEmail) {
                const { _id, name, imageUrl } = resp.data.findUserByEmail;
                return {
                    id: _id,
                    name,
                    imageUrl,
                    email: args.email,
                };
            }
            return null;
        },
    },
    Mutation: {
        createUser: async (parent, args: MutationCreateUserArgs) => {
            const query = gql`
                mutation($data: UserInput!) {
                    createUser(data: $data) {
                        _id
                        name
                        email
                        imageUrl
                    }
                }
            `;
            const resp = await makePromise(execute(client, { query, variables: args }));
            if (resp.data.createUser) {
                const { _id, name, imageUrl } = resp.data.createUser;
                return {
                    id: _id,
                    name,
                    imageUrl,
                    email: args.data.email,
                };
            }
            return null;
        },
    },
};

export default resolvers;
