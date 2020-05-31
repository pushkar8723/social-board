import gql from 'graphql-tag';

export const getUser = gql`
    query GetUser($email: String!) {
        findUserByEmail(email: $email) {
            _id
            name
            email
            imageUrl
        }
    }
`;

export const createUser = gql`
    mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
            _id
            name
            email
            imageUrl
        }
    }
`;
