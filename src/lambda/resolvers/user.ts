import { AuthenticationError } from 'apollo-server-lambda';
import GoogleOauth from '../datasource/googleOauth';
import FaunaDB from '../datasource/faunaDb';
import { MutationLoginUserArgs, User } from '../../generated/types.d';
import { User as UpstreamUser } from '../../generated/upsteam.types.d';
import { getUser, createUser } from '../queries/userQueries';

const mapUser = (user: UpstreamUser): User => {
    const {
        _id, name, email, imageUrl,
    } = user;
    return {
        id: _id,
        name,
        email,
        imageUrl,
    };
};

const resolvers = {
    Mutation: {
        loginUser: async (parent: undefined, args: MutationLoginUserArgs): Promise<User> => {
            const body = await GoogleOauth.getUser(args.idToken);
            if (body) {
                if (body.email) {
                    const res = await FaunaDB.execute(getUser, { email: body.email });
                    if (res.data.findUserByEmail) {
                        return mapUser(res.data.findUserByEmail);
                    }
                    const createResp = await FaunaDB.execute(
                        createUser,
                        {
                            data: {
                                name: body.name,
                                email: body.email,
                                imageUrl: body.picture,
                            },
                        },
                    );
                    if (createResp.data.createUser) {
                        return mapUser(createResp.data.createUser);
                    }
                }
                throw new AuthenticationError(body.error_description);
            }
            return null;
        },
    },
};

export default resolvers;
