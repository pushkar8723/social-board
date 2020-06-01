import { SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { GraphQLField } from 'graphql';
import fetch from 'cross-fetch';
import { IContext, ITokenBody, IError } from '../types.d';
import { User } from '../../generated/types.d';
import { getUser } from '../resolvers/queries/userQueries';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});

export default class MaskDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: GraphQLField<User, IContext>) {
        const { resolve } = field;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async function resolver(...args) {
            if (args[2].idToken && !args[2].user) {
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
                    }
                }
            }
            if (args[0].id !== args[2].user?.id) {
                return 'XXXXX';
            }
            return resolve.apply(this, args);
        };
    }
}
