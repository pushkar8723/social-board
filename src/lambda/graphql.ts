import { ApolloServer } from 'apollo-server-lambda';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import userResolver from './resolvers/user';
import postResolver from './resolvers/post';
import userSchema from './schema/user.schema';
import postSchema from './schema/post.schema';

const server = new ApolloServer({
    schema: mergeSchemas({
        schemas: [
            makeExecutableSchema({ typeDefs: userSchema }),
            makeExecutableSchema({ typeDefs: postSchema }),
        ],
        resolvers: [
            userResolver,
            postResolver,
        ],
    }),
    introspection: true,
    playground: true,
    context: ({ event }) => ({
        userId: event.headers.user_id,
    }),
});

exports.handler = server.createHandler();
