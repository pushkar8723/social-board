import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { GraphQLField } from 'graphql';
import fetch from 'cross-fetch';
import { ITokenBody, IError, IContext } from '../types.d';
import { getUser } from '../resolvers/queries/userQueries';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});

class LoggedInDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: GraphQLField<undefined, IContext>) {
        const { resolve } = field;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async function resolver(...args) {
            const { idToken } = args[2];
            if (idToken) {
                const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${args[2].idToken}`);
                if (resp.ok) {
                    const body: ITokenBody & IError = await resp.json();
                    const res = await makePromise(
                        execute(
                            client,
                            { query: getUser, variables: { email: body.email } },
                        ),
                    );
                    if (res.data.findUserByEmail) {
                        // eslint-disable-next-line no-param-reassign
                        args[2].user = {
                            id: res.data.findUserByEmail._id,
                            name: res.data.findUserByEmail.name,
                            email: res.data.findUserByEmail.email,
                            imageUrl: res.data.findUserByEmail.imageUrl,
                        };
                        return resolve.apply(this, args);
                    }
                }
            }
            throw new AuthenticationError('You must be logged in to make this request');
        };
    }
}

export default LoggedInDirective;
