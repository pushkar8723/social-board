import gql from 'graphql-tag';

export const GET_POSTS = gql`
    query GetPosts {
        getPosts {
            ... on Article {
                id
                title
                description
                __typename
            }
            ... on Link {
                id
                title
                url
                __typename
            }
            ... on Image {
                id
                title
                imageUrl
                __typename
            }
        }
    }
`;

export const DELETE_POSTS = gql`
    mutation DeletePost($id: ID!, $type: String!) {
        deletePost(id: $id, type: $type) {
            ... on Article {
                id
                title
                description
                __typename
            }
            ... on Link {
                id
                title
                url
                __typename
            }
            ... on Image {
                id
                title
                imageUrl
                __typename
            }
        }
    }
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
            ... on Article {
                id
                title
                description
                __typename
            }
            ... on Link {
                id
                title
                url
                __typename
            }
            ... on Image {
                id
                title
                imageUrl
                __typename
            }
        }
    }
`;
