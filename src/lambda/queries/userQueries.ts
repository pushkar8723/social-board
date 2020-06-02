import gql from 'graphql-tag';

export const userFramgents = {
    user: gql`
        fragment UserDetails on User {
            _id
            name
            email
            imageUrl
        }
    `,
};

export const getUser = gql`
    query GetUser($email: String!) {
        findUserByEmail(email: $email) {
            ...UserDetails
        }
    }
    ${userFramgents.user}
`;

export const createUser = gql`
    mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
           ...UserDetails
        }
    }
    ${userFramgents.user}
`;
