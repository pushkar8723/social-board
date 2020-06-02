import gql from 'graphql-tag';

export default gql`
    directive @loggedIn on FIELD_DEFINITION

    "Interface to extended by different types of Posts"
    interface Post {
        id: ID!
        title: String!
    }

    "Post of type Article. It has an extra \`description\` field."
    type Article implements Post {
        id: ID!
        title: String!
        description: String!
    }

    "Post of type Link. It has an extra \`url\` field."
    type Link implements Post {
        id: ID!
        title: String!
        url: String!
    }

    "Post of type Image. It has an extra \`imageUrl\` field."
    type Image implements Post {
        id: ID!
        title: String!
        imageUrl: String!
    }

    type Query {
        "Returns all the Posts created by the logged in user."
        getPosts: [Post] @loggedIn
        "Returns all Posts"
        getAllPosts: [Post]
    }

    type Mutation {
        "Creates a new post"
        createPost(
            type: String!
            title: String!
            description: String
            url: String
            imageUrl: String
        ): Post @loggedIn

        "Deletes a Post of given type and ID"
        deletePost(type: String!, id: ID!): Post @loggedIn
    }
`;
