import gql from 'graphql-tag';

const userfragment = {
    entry: gql`
        fragment UserDetails on User {
            id
            email
            name
            imageUrl
        }
    `,
};

const postfragments = {
    entry: gql`
        fragment PostDetails on Post {
            id
            title
            __typename
        }
    `,
};

const postsfragments = {
    entry: gql`
        fragment PostsDetails on Post {
            ... on Article {
                description
                ...PostDetails
                user {
                    ...UserDetails
                }
            }
            ... on Link {
                url
                ...PostDetails
                user {
                    ...UserDetails
                }
            }
            ... on Image {
                imageUrl
                ...PostDetails
                user {
                    ...UserDetails
                }
            }
        }
        ${postfragments.entry}
        ${userfragment.entry}
    `,
};

export const GET_ALL_POSTS = gql`
    query GetAllPosts {
        getAllPosts {
            ...PostsDetails
        }
    }
    ${postsfragments.entry}
`;

export const GET_POSTS = gql`
    query GetPosts {
        getPosts {
            ...PostsDetails
        }
    }
    ${postsfragments.entry}
`;

export const DELETE_POSTS = gql`
    mutation DeletePost($id: ID!, $type: String!) {
        deletePost(id: $id, type: $type) {
            ...PostsDetails
        }
    }
    ${postsfragments.entry}
`;

export const CREATE_POST = gql`
    mutation CreatePost(
        $type: String!
        $title: String!
        $description: String
        $url: String
        $imageUrl: String
    ) {
        createPost(
            type: $type
            title: $title
            description: $description
            url: $url
            imageUrl: $imageUrl
        ) {
            ...PostsDetails
        }
    }
    ${postsfragments.entry}
`;
