import { ApolloServer, mergeSchemas, makeExecutableSchema } from 'apollo-server-lambda';
import userResolver from './resolvers/user';
import postResolver from './resolvers/post';
import userSchema from './schema/user.schema';
import postSchema from './schema/post.schema';
import linkSchema from './schema/link.schema';
import LoggedInDirective from './directives/LoggedInDirective';
import MaskDirective from './directives/MaskDirective';
import FaunaDB from './datasource/FaunaDB';
import GoogleOauth from './datasource/GoogleOauth';

const server = new ApolloServer({
    schema: mergeSchemas({
        schemas: [
            makeExecutableSchema({ typeDefs: userSchema }),
            makeExecutableSchema({ typeDefs: postSchema }),
            linkSchema,
        ],
        resolvers: [
            userResolver,
            postResolver,
        ],
        schemaDirectives: {
            loggedIn: LoggedInDirective,
            mask: MaskDirective,
        },
        mergeDirectives: true,
    }),
    dataSources: () => ({
        faunaDB: new FaunaDB(),
        googleOauth: new GoogleOauth(),
    }),
    introspection: true,
    playground: true,
    context: ({ event }) => ({
        idToken: event.headers.id_token,
    }),
});

exports.handler = server.createHandler();
