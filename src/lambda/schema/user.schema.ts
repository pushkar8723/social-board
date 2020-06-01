import gql from 'graphql-tag';

export default gql`
    directive @mask on FIELD_DEFINITION

    type User {
        id: ID! @mask
        name: String!
        email: String! @mask
        imageUrl: String!
    }

    type Mutation {
        loginUser(idToken: String!): User
    }
`;
