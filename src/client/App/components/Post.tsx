import React, { useState } from 'react';
import styled from 'styled-components';
import { Mutation, MutationUpdaterFn } from 'react-apollo';
import { Article, Link, Image } from '../../../generated/types.d';
import Card from './Card';
import { DELETE_POSTS, GET_POSTS } from '../shared/queries';

const TitleContainer = styled.div`
    display: flex;
`;

const Title = styled.h3`
    margin: 10px 0;
    flex: 1;
`;

const Btn = styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    min-width: 30px;
    text-align: center;
    padding-left: 12px;
    cursor: pointer;
    background-color: #fff;

    &:focus {
        border: 1px solid #2283d2;
        box-shadow: 0 0 0 3px #64baff;
    }
`;

type Post = Article | Link | Image;

interface IPostProp {
    post: Post;
    idToken: string;
}

export default function (props: IPostProp) {
    const [loading, setLoading] = useState(false);
    const { post, idToken } = props;

    const deletePostHandler = (deleteFn: () => void) => () => {
        setLoading(true);
        deleteFn();
    };

    const updateFn: MutationUpdaterFn<{ deletePost: Post }> = (cache, { data: { deletePost } }) => {
        const { getPosts } = cache.readQuery({ query: GET_POSTS });
        const newPosts = getPosts.filter((item: Post) => item.id !== deletePost.id);
        cache.writeQuery({
            query: GET_POSTS,
            data: { getPosts: newPosts },
        });
    };

    switch (post.__typename) {
    case 'Article':
        return (
            <Mutation<{ deletePost: Article }>
                context={{ headers: { id_token: idToken } }}
                mutation={DELETE_POSTS}
                variables={{ id: post.id, type: 'Article' }}
                update={updateFn}
            >
                {(deleteArticle) => (
                    <Card>
                        <TitleContainer>
                            <Title>{post.title}</Title>
                            <Btn onClick={deletePostHandler(deleteArticle)} disabled={loading}>
                                <span role="img" aria-label="Delete Post">🗑️</span>
                            </Btn>
                        </TitleContainer>
                        <div>{post.description}</div>
                    </Card>
                )}
            </Mutation>
        );

    case 'Link':
        return (
            <Mutation<{ deletePost: Link }>
                context={{ headers: { id_token: idToken } }}
                mutation={DELETE_POSTS}
                variables={{ id: post.id, type: 'Link' }}
                update={updateFn}
            >
                {(deleteLink) => (
                    <Card>
                        <TitleContainer>
                            <Title>{post.title}</Title>
                            <Btn onClick={deletePostHandler(deleteLink)} disabled={loading}>
                                <span role="img" aria-label="Delete Post">🗑️</span>
                            </Btn>
                        </TitleContainer>
                        <div>
                            <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a>
                        </div>
                    </Card>
                )}
            </Mutation>
        );

    case 'Image':
        return (
            <Mutation<{ deletePost: Image }>
                context={{ headers: { id_token: idToken } }}
                mutation={DELETE_POSTS}
                variables={{ id: post.id, type: 'Image' }}
                update={updateFn}
            >
                {(deleteImage) => (
                    <Card>
                        <TitleContainer>
                            <Title>{post.title}</Title>
                            <Btn onClick={deletePostHandler(deleteImage)} disabled={loading}>
                                <span role="img" aria-label="Delete Post">🗑️</span>
                            </Btn>
                        </TitleContainer>
                        <div>
                            <img src={post.imageUrl} alt={post.title} />
                        </div>
                    </Card>
                )}
            </Mutation>
        );

    default:
        return null;
    }
}
