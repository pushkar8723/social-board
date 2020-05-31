import gql from 'graphql-tag';

export default gql`
    directive @loggedIn on FIELD_DEFINITION

    interface Post {
        id: ID!
        title: String!
    }

    type Article implements Post {
        id: ID!
        title: String!
        description: String!
    }

    type Link implements Post {
        id: ID!
        title: String!
        url: String!
    }

    type Image implements Post {
        id: ID!
        title: String!
        imageUrl: String!
    }

    type Query {
        getPosts: [Post] @loggedIn
    }

    type Mutation {
        createPost(
            type: String!
            title: String!
            description: String
            url: String
            imageUrl: String
        ): Post @loggedIn
        deletePost(type: String!, id: ID!): Post @loggedIn
    }
`;
