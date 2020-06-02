import gql from 'graphql-tag';
import { userFramgents } from './userQueries';

const postFragments = {
    article: gql`
        fragment ArticleDetails on Article {
            _id
            title
            description
            user {
                ...UserDetails
            }
        }
        ${userFramgents.user}
    `,
    link: gql`
        fragment LinkDetails on Link {
            _id
            title
            url
            user {
                ...UserDetails
            }
        }
        ${userFramgents.user}
    `,
    image: gql`
        fragment ImageDetails on Image {
            _id
            title
            imageUrl
            user {
                ...UserDetails
            }
        }
        ${userFramgents.user}
    `,
};

export const getUserPosts = gql`
    query GetUserPosts($id: ID!) {
        findUserByID(id: $id) {
            articles {
                data {
                    ...ArticleDetails
                }
            }
            links {
                data {
                    ...LinkDetails
                }
            }
            images {
                data {
                    ...ImageDetails
                }
            }
        }
    }
    ${postFragments.article}
    ${postFragments.link}
    ${postFragments.image}
`;

export const getAllPosts = gql`
    query GetAllPosts {
        getAllArticles {
            data {
                ...ArticleDetails
            }
        }
        getAllImages {
            data {
                ...ImageDetails
            }
        }
        getAllLinks {
            data {
                ...LinkDetails
            }
        }
    }
    ${postFragments.article}
    ${postFragments.link}
    ${postFragments.image}
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
            ...ArticleDetails
        }
    }
    ${postFragments.article}
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
            ...LinkDetails
        }
    }
    ${postFragments.link}
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
            ...ImageDetails
        }
    }
    ${postFragments.image}
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
            ...ArticleDetails
        }
    }
    ${postFragments.article}
`;

export const deleteLink = gql`
    mutation DeleteLink($id: ID!) {
        deleteLink(id: $id) {
            ...LinkDetails
        }
    }
    ${postFragments.link}
`;

export const deleteImage = gql`
    mutation DeleteImage($id: ID!) {
        deleteImage(id: $id) {
            ...ImageDetails
        }
    }
    ${postFragments.image}
`;
