import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import { AuthenticationError } from 'apollo-server-lambda';
import { MutationLoginUserArgs, User } from '../../generated/types.d';
import { getUser, createUser } from './queries/userQueries';
import { ITokenBody, IError } from '../types.d';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});

const resolvers = {
    Mutation: {
        loginUser: async (parent: undefined, args: MutationLoginUserArgs): Promise<User> => {
            const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${args.idToken}`);
            if (resp.ok) {
                const body: ITokenBody & IError = await resp.json();
                if (body.email) {
                    const res = await makePromise(
                        execute(
                            client,
                            { query: getUser, variables: { email: body.email } },
                        ),
                    );
                    if (res.data.findUserByEmail) {
                        const {
                            _id, name, email, imageUrl,
                        } = res.data.findUserByEmail;
                        return {
                            id: _id,
                            name,
                            email,
                            imageUrl,
                        };
                    }
                    const createResp = await makePromise(
                        execute(
                            client,
                            {
                                query: createUser,
                                variables: {
                                    data: {
                                        name: body.name,
                                        email: body.email,
                                        imageUrl: body.picture,
                                    },
                                },
                            },
                        ),
                    );
                    if (createResp.data.createUser) {
                        const {
                            _id, name, email, imageUrl,
                        } = createResp.data.createUser;
                        return {
                            id: _id,
                            name,
                            email,
                            imageUrl,
                        };
                    }
                }
                throw new AuthenticationError(body.error_description);
            }
            return null;
        },
    },
};

export default resolvers;
