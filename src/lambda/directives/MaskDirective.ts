import { SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { GraphQLField } from 'graphql';
import { Path } from 'graphql/jsutils/Path';
import GoogleOauth from '../datasource/googleOauth';
import FaunaDB from '../datasource/faunaDb';
import { IContext } from '../types.d';
import { User } from '../../generated/types.d';
import { getUser } from '../queries/userQueries';


const getBaseKey = (path: Path): string | number => {
    if (path.prev) {
        return getBaseKey(path.prev);
    }
    return path.key;
};

export default class MaskDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: GraphQLField<User, IContext>) {
        const { resolve } = field;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async function resolver(...args) {
            if (getBaseKey(args[3].path) !== 'loginUser') {
                if (args[2].idToken && !args[2].user) {
                    const body = await GoogleOauth.getUser(args[2].idToken);
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
                        }
                    }
                }
                if (args[0].id !== args[2].user?.id) {
                    return null;
                }
            }
            return resolve.apply(this, args);
        };
    }
}
