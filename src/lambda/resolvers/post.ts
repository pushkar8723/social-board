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
} from '../queries/postQueries';
import { IContext } from '../types.d';

const mapArticle = (article: UpstreamArticle): Article => ({
    id: article._id,
    title: article.title,
    description: article.description,
    user: {
        id: article.user._id,
        name: article.user.name,
        email: article.user.email,
        imageUrl: article.user.imageUrl,
    },
});

const mapLink = (link: UpstreamLink) : Link => ({
    id: link._id,
    title: link.title,
    url: link.url,
    user: {
        id: link.user._id,
        name: link.user.name,
        email: link.user.email,
        imageUrl: link.user.imageUrl,
    },
});

const mapImage = (image: UpstreamImage) : Image => ({
    id: image._id,
    title: image.title,
    imageUrl: image.imageUrl,
    user: {
        id: image.user._id,
        name: image.user.name,
        email: image.user.email,
        imageUrl: image.user.imageUrl,
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
            const resp = await context.dataSources.faunaDB.execute(
                getUserPosts,
                { id: context.user.id },
            );
            if (resp.data.findUserByID) {
                return [
                    ...resp.data.findUserByID.articles.data.map(mapArticle),
                    ...resp.data.findUserByID.links.data.map(mapLink),
                    ...resp.data.findUserByID.images.data.map(mapImage),
                ];
            }
            return null;
        },
        getAllPosts: async (parent: undefined, args: undefined, context: IContext) => {
            const resp = await context.dataSources.faunaDB.execute(getAllPosts);
            if (resp.data) {
                return [
                    ...resp.data.getAllArticles.data.map(mapArticle),
                    ...resp.data.getAllLinks.data.map(mapLink),
                    ...resp.data.getAllImages.data.map(mapImage),
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
                const resp = await context.dataSources.faunaDB.execute(
                    createArticle,
                    { title, description, userId: user.id },
                );
                if (resp.data.createArticle) {
                    return mapArticle(resp.data.createArticle);
                }
            } else if (type === 'Link') {
                const resp = await context.dataSources.faunaDB.execute(
                    createLink,
                    { title, url, userId: user.id },
                );
                if (resp.data.createLink) {
                    return mapLink(resp.data.createLink);
                }
            } else if (type === 'Image') {
                const resp = await context.dataSources.faunaDB.execute(
                    createImage,
                    { title, imageUrl, userId: user.id },
                );
                if (resp.data.createImage) {
                    return mapImage(resp.data.createImage);
                }
            }
            return null;
        },
        deletePost: async (parent: undefined, arg: MutationDeletePostArgs, context: IContext):
            Promise<Article | Link | Image> => {
            const { type, id } = arg;
            const { user } = context;
            if (type === 'Article') {
                const resp = await context.dataSources.faunaDB.execute(getArticle, { id });
                if (resp.data.findArticleByID.user._id === user.id) {
                    const deleteResp = await context.dataSources.faunaDB.execute(
                        deleteArticle, { id },
                    );
                    return mapArticle(deleteResp.data.deleteArticle);
                }
            }
            if (type === 'Link') {
                const resp = await context.dataSources.faunaDB.execute(getLink, { id });
                if (resp.data.findLinkByID.user._id === user.id) {
                    const deleteResp = await context.dataSources.faunaDB.execute(
                        deleteLink, { id },
                    );
                    return mapLink(deleteResp.data.deleteLink);
                }
            }
            if (type === 'Image') {
                const resp = await context.dataSources.faunaDB.execute(getImage, { id });
                if (resp.data.findImageByID.user._id === user.id) {
                    const deleteResp = await context.dataSources.faunaDB.execute(
                        deleteImage, { id },
                    );
                    return mapImage(deleteResp.data.deleteImage);
                }
            }
            return null;
        },
    },
};

export default resolvers;
