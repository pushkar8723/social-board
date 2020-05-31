
import gql from 'graphql-tag';

export default gql`
    extend type Article {
        user: User!
    }
    extend type Link {
        user: User!
    }
    extend type Image {
        user: User!
    }
`;
