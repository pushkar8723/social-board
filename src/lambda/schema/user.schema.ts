import gql from 'graphql-tag';

export default gql`
    type User {
        id: ID!
        name: String!
        email: String!
        imageUrl: String!
    }

    type Mutation {
        loginUser(idToken: String!): User
    }
`;
