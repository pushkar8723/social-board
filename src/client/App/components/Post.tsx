import React, { useState } from 'react';
import styled from 'styled-components';
import { Mutation, MutationUpdaterFn } from 'react-apollo';
import Markdown from 'markdown-to-jsx';
import { Article, Link, Image } from '../../../generated/types.d';
import Card from './Card';
import { DELETE_POSTS, GET_POSTS, GET_ALL_POSTS } from '../shared/queries';

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

const UserContainer = styled.div`
    display: flex;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    width: 100%;
    align-items: center;

    & > div {
        flex: 1;
        font-size: 12px;
    }

    & > div > h3 {
        margin: 0;
        font-size: 18px;
    }
`;

const UserImg = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    vertical-align: middle;
`;

type Post = Article & Link & Image;

interface IPostProp {
    post: Post;
    idToken?: string;
}

export default function (props: IPostProp) {
    const [loading, setLoading] = useState(false);
    const { post, idToken } = props;

    const deletePostHandler = (deleteFn: () => void) => () => {
        setLoading(true);
        deleteFn();
    };

    const updateFn: MutationUpdaterFn<{ deletePost: Post }> = (cache, { data: { deletePost } }) => {
        try {
            const { getPosts } = cache.readQuery({ query: GET_POSTS });
            const newPosts = getPosts.filter((item: Post) => item.id !== deletePost.id);
            cache.writeQuery({
                query: GET_POSTS,
                data: { getPosts: newPosts },
            });
        } catch (e) {
            // Ignore
        }
        try {
            const { getAllPosts } = cache.readQuery({ query: GET_ALL_POSTS });
            const newAllPosts = getAllPosts.filter((item: Post) => item.id !== deletePost.id);
            cache.writeQuery({
                query: GET_ALL_POSTS,
                data: { getAllPosts: newAllPosts },
            });
        } catch (e) {
            // Ignore
        }
    };

    return (
        <Mutation<{ deletePost: Post }>
            context={{ headers: { id_token: idToken } }}
            mutation={DELETE_POSTS}
            variables={{ id: post.id, type: post.__typename }}
            update={updateFn}
        >
            {(deleteArticle) => (
                <Card>
                    <UserContainer>
                        <UserImg src={post.user.imageUrl} />
                        <div>
                            {`${post.user.name} posted:`}
                            <Title>{post.title}</Title>
                        </div>
                        {
                            post.user.email && (
                                <Btn
                                    onClick={deletePostHandler(deleteArticle)}
                                    disabled={loading}
                                >
                                    <span role="img" aria-label="Delete Post">🗑️</span>
                                </Btn>
                            )
                        }
                    </UserContainer>
                    { post.description && <Markdown>{post.description}</Markdown> }
                    { post.url && <a href={post.url} target="_blank" rel="noreferrer noopener">{post.url}</a> }
                    { post.imageUrl && <div><img src={post.imageUrl} alt={post.title} /></div> }
                </Card>
            )}
        </Mutation>
    );
}
