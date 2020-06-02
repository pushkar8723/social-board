import gql from 'graphql-tag';

export default gql`
    directive @mask on FIELD_DEFINITION

    """
    Type for User Entity. A user will have a unique \`ID\` and \`email\`.
    Both of these are masked and cannot be accessed by another user.
    However, \`name\` and \`imageUrl\` are public.
    """
    type User {
        id: ID @mask
        name: String!
        email: String @mask
        imageUrl: String!
    }

    type Mutation {
        """
        Logs in an User. Expects an \`idToken\` as input. This token is used to fetch the user details.
        If the User is not present in the system then a new User is created and logged in.
        """
        loginUser(idToken: String!): User
    }
`;
