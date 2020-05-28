import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import {
    Article as UpstreamArticle,
    Link as UpstreamLink,
    Image as UpstreamImage,
} from '../../generated/upsteam.types.d';
import { Article, Image, Link } from '../../generated/types.d';
import {
    createArticle, createImage, createLink, getUserPosts,
    getArticle, getImage, getLink, deleteArticle, deleteLink, deleteImage,
} from './queries/postQuries';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});


const resolvers = {
    Post: {
        __resolveType(post: Article | Link | Image) {
            if (post.description) {
                return 'Article';
            }
            if (post.url) {
                return 'Link';
            }
            if (post.imageUrl) {
                return 'Image';
            }
            return null;
        },
    },
    Query: {
        getPosts: async (parent, args, context) => {
            const resp = await makePromise(
                execute(
                    client,
                    { query: getUserPosts, variables: { id: context.userId } },
                ),
            );
            if (resp.data.findUserByID) {
                return [
                    ...resp.data.findUserByID.articles.data.map(
                        (article: UpstreamArticle) : Article => ({
                            id: article._id,
                            title: article.title,
                            description: article.description,
                        }),
                    ),
                    ...resp.data.findUserByID.links.data.map((link: UpstreamLink) : Link => ({
                        id: link._id,
                        title: link.title,
                        url: link.url,
                    })),
                    ...resp.data.findUserByID.images.data.map((image: UpstreamImage) : Image => ({
                        id: image._id,
                        title: image.title,
                        imageUrl: image.imageUrl,
                    })),
                ];
            }
            return null;
        },
    },
    Mutation: {
        createPost: async (parent: any, arg: any, context: any):
            Promise<Article | Link | Image> => {
            const {
                type, title, description, url, imageUrl,
            } = arg;
            const { userId } = context;
            if (type === 'Article') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createArticle,
                            variables: { title, description, userId },
                        },
                    ),
                );
                if (resp.data.createArticle) {
                    return {
                        id: resp.data.createArticle._id,
                        title: resp.data.createArticle.title,
                        description: resp.data.createArticle.description,
                    };
                }
            } else if (type === 'Link') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createLink,
                            variables: { title, url, userId },
                        },
                    ),
                );
                if (resp.data.createLink) {
                    return {
                        id: resp.data.createLink._id,
                        title: resp.data.createLink.title,
                        url: resp.data.createLink.url,
                    };
                }
            } else if (type === 'Image') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createImage,
                            variables: { title, imageUrl, userId },
                        },
                    ),
                );
                if (resp.data.createImage) {
                    return {
                        id: resp.data.createImage._id,
                        title: resp.data.createImage.title,
                        imageUrl: resp.data.createImage.imageUrl,
                    };
                }
            }
            return null;
        },
        deletePost: async (parent: any, arg: any, context: any):
            Promise<Article | Link | Image> => {
            const { type, id } = arg;
            const { userId } = context;
            if (type === 'Article') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: getArticle,
                            variables: { id },
                        },
                    ),
                );
                if (resp.data.findArticleByID.user._id === userId) {
                    const deleteResp = await makePromise(
                        execute(
                            client,
                            {
                                query: deleteArticle,
                                variables: { id },
                            },
                        ),
                    );
                    const { _id, title, description } = deleteResp.data.deleteArticle;
                    return {
                        id: _id,
                        title,
                        description,
                    };
                }
            }
            if (type === 'Link') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: getLink,
                            variables: { id },
                        },
                    ),
                );
                if (resp.data.findLinkByID.user._id === userId) {
                    const deleteResp = await makePromise(
                        execute(
                            client,
                            {
                                query: deleteLink,
                                variables: { id },
                            },
                        ),
                    );
                    const { _id, title, url } = deleteResp.data.deleteLink;
                    return {
                        id: _id,
                        title,
                        url,
                    };
                }
            }
            if (type === 'Image') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: getImage,
                            variables: { id },
                        },
                    ),
                );
                if (resp.data.findImageByID.user._id === userId) {
                    const deleteResp = await makePromise(
                        execute(
                            client,
                            {
                                query: deleteImage,
                                variables: { id },
                            },
                        ),
                    );
                    const { _id, title, imageUrl } = deleteResp.data.deleteImage;
                    return {
                        id: _id,
                        title,
                        imageUrl,
                    };
                }
            }
            return null;
        },
    },
};

export default resolvers;
