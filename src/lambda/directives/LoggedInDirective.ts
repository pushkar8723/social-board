import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { GraphQLField } from 'graphql';
import GoogleOauth from '../datasource/googleOauth';
import FaunaDB from '../datasource/faunaDb';
import { IContext } from '../types.d';
import { getUser } from '../queries/userQueries';

class LoggedInDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: GraphQLField<undefined, IContext>) {
        const { resolve } = field;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async function resolver(...args) {
            const { idToken } = args[2];
            if (idToken) {
                const body = await GoogleOauth.getUser(idToken);
                if (body) {
                    const res = await FaunaDB.execute(getUser, { email: body.email });
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
