import gql from 'graphql-tag';

export default gql`
    type User {
        id: ID!
        name: String!
        email: String!
        imageUrl: String!
    }

    input createUserInput {
        name: String!
        email: String!
        imageUrl: String!
    }

    type Query {
        getUser(email: String): User
    }

    type Mutation {
        createUser(data: createUserInput): User
    }
`;
