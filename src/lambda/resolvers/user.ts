import { AuthenticationError } from 'apollo-server-lambda';
import { MutationLoginUserArgs, User } from '../../generated/types.d';
import { User as UpstreamUser } from '../../generated/upsteam.types.d';
import { getUser, createUser } from '../queries/userQueries';
import { IContext } from '../types.d';

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
        loginUser: async (parent: undefined, args: MutationLoginUserArgs, context: IContext):
        Promise<User> => {
            const { faunaDB, googleOauth } = context.dataSources;
            const body = await googleOauth.getUser(args.idToken);
            if (body) {
                if (body.email) {
                    const res = await faunaDB.execute(getUser, { email: body.email });
                    if (res.data.findUserByEmail) {
                        return mapUser(res.data.findUserByEmail);
                    }
                    const createResp = await faunaDB.execute(
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
