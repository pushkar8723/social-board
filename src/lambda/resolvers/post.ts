import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import {
    Article as UpstreamArticle,
    Link as UpstreamLink,
    Image as UpstreamImage,
} from '../../generated/upsteam.types.d';
import {
    Article, Image, Link,
    MutationCreatePostArgs, MutationDeletePostArgs,
} from '../../generated/types.d';
import {
    createArticle, createImage, createLink, getUserPosts,
    getArticle, getImage, getLink, deleteArticle, deleteLink, deleteImage, getAllPosts,
} from './queries/postQueries';
import { IContext } from '../types.d';

const client = new HttpLink({
    uri: 'https://graphql.fauna.com/graphql',
    fetch,
    headers: {
        authorization: `bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
});


const resolvers = {
    Post: {
        __resolveType(post: Article & Link & Image) {
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
        getPosts: async (parent: undefined, args: undefined, context: IContext) => {
            const resp = await makePromise(
                execute(
                    client,
                    { query: getUserPosts, variables: { id: context.user.id } },
                ),
            );
            if (resp.data.findUserByID) {
                return [
                    ...resp.data.findUserByID.articles.data.map(
                        (article: UpstreamArticle) : Article => ({
                            id: article._id,
                            title: article.title,
                            description: article.description,
                            user: context.user,
                        }),
                    ),
                    ...resp.data.findUserByID.links.data.map((link: UpstreamLink) : Link => ({
                        id: link._id,
                        title: link.title,
                        url: link.url,
                        user: context.user,
                    })),
                    ...resp.data.findUserByID.images.data.map((image: UpstreamImage) : Image => ({
                        id: image._id,
                        title: image.title,
                        imageUrl: image.imageUrl,
                        user: context.user,
                    })),
                ];
            }
            return null;
        },
        getAllPosts: async () => {
            const resp = await makePromise(execute(client, { query: getAllPosts }));
            if (resp.data) {
                return [
                    ...resp.data.getAllArticles.data.map(
                        (article: UpstreamArticle) : Article => ({
                            id: article._id,
                            title: article.title,
                            description: article.description,
                            user: {
                                id: article.user._id,
                                name: article.user.name,
                                email: article.user.email,
                                imageUrl: article.user.imageUrl,
                            },
                        }),
                    ),
                    ...resp.data.getAllLinks.data.map(
                        (link: UpstreamLink) : Link => ({
                            id: link._id,
                            title: link.title,
                            url: link.url,
                            user: {
                                id: link.user._id,
                                name: link.user.name,
                                email: link.user.email,
                                imageUrl: link.user.imageUrl,
                            },
                        }),
                    ),
                    ...resp.data.getAllImages.data.map(
                        (image: UpstreamImage) : Image => ({
                            id: image._id,
                            title: image.title,
                            imageUrl: image.imageUrl,
                            user: {
                                id: image.user._id,
                                name: image.user.name,
                                email: image.user.email,
                                imageUrl: image.user.imageUrl,
                            },
                        }),
                    ),
                ];
            }
            return null;
        },
    },
    Mutation: {
        createPost: async (parent: undefined, arg: MutationCreatePostArgs, context: IContext):
            Promise<Article | Link | Image> => {
            const {
                type, title, description, url, imageUrl,
            } = arg;
            const { user } = context;
            if (type === 'Article') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createArticle,
                            variables: { title, description, userId: user.id },
                        },
                    ),
                );
                if (resp.data.createArticle) {
                    return {
                        id: resp.data.createArticle._id,
                        title: resp.data.createArticle.title,
                        description: resp.data.createArticle.description,
                        user: context.user,
                    };
                }
            } else if (type === 'Link') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createLink,
                            variables: { title, url, userId: user.id },
                        },
                    ),
                );
                if (resp.data.createLink) {
                    return {
                        id: resp.data.createLink._id,
                        title: resp.data.createLink.title,
                        url: resp.data.createLink.url,
                        user: context.user,
                    };
                }
            } else if (type === 'Image') {
                const resp = await makePromise(
                    execute(
                        client,
                        {
                            query: createImage,
                            variables: { title, imageUrl, userId: user.id },
                        },
                    ),
                );
                if (resp.data.createImage) {
                    return {
                        id: resp.data.createImage._id,
                        title: resp.data.createImage.title,
                        imageUrl: resp.data.createImage.imageUrl,
                        user: context.user,
                    };
                }
            }
            return null;
        },
        deletePost: async (parent: undefined, arg: MutationDeletePostArgs, context: any):
            Promise<Article | Link | Image> => {
            const { type, id } = arg;
            const { user } = context;
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
                if (resp.data.findArticleByID.user._id === user.id) {
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
                        user: context.user,
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
                if (resp.data.findLinkByID.user._id === user.id) {
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
                        user: context.user,
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
                if (resp.data.findImageByID.user._id === user.id) {
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
                        user: context.user,
                    };
                }
            }
            return null;
        },
    },
};

export default resolvers;
