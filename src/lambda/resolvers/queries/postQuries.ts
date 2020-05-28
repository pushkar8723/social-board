import gql from 'graphql-tag';

export const getUserPosts = gql`
    query GetUserPosts($id: ID!) {
        findUserByID(id: $id) {
            articles {
                data {
                    _id
                    title
                    description
                }
            }
            links {
                data {
                    _id
                    title
                    url
                }
            }
            images {
                data {
                    _id
                    title
                    imageUrl
                }
            }
        }
    }
`;

export const createArticle = gql`
    mutation CreateArticle(
        $title: String!
        $description: String!
        $userId: ID
    ) {
        createArticle(data: {
            title: $title
            description: $description
            user: {
                connect: $userId
            }
        }) {
            _id
            title
            description
        }
    }
`;

export const createLink = gql`
    mutation CreateLink(
        $title: String!
        $url: String!
        $userId: ID
    ) {
        createLink(data: {
            title: $title
            url: $url
            user: {
                connect: $userId
            }
        }) {
            _id
            title
            url
        }
    }
`;

export const createImage = gql`
    mutation CreateImage(
        $title: String!
        $imageUrl: String!
        $userId: ID
    ) {
        createImage(data: {
            title: $title
            imageUrl: $imageUrl
            user: {
                connect: $userId
            }
        }) {
            _id
            title
            imageUrl
        }
    }
`;

export const getArticle = gql`
    query GetArticle($id: ID!) {
        findArticleByID(id: $id) {
            user {
                _id
            }
        }
    }
`;

export const getLink = gql`
    query GetLink($id: ID!) {
        findLinkByID(id: $id) {
            user {
                _id
            }
        }
    }
`;

export const getImage = gql`
    query GetImage($id: ID!) {
        findImageByID(id: $id) {
            user {
                _id
            }
        }
    }
`;

export const deleteArticle = gql`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            _id
            title
            description
        }
    }
`;

export const deleteLink = gql`
    mutation DeleteLink($id: ID!) {
        deleteLink(id: $id) {
            _id
            title
            url
        }
    }
`;

export const deleteImage = gql`
    mutation DeleteImage($id: ID!) {
        deleteImage(id: $id) {
            _id
            title
            imageUrl
        }
    }
`;
