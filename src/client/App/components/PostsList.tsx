import React from 'react';
import { Article, Link, Image } from '../../../generated/types.d';
import Post from './Post';

interface IPostsProps {
    posts: Array<Article | Link | Image>;
    userId: string;
}

export default function (props: IPostsProps) {
    const { posts, userId } = props;
    return <>{posts.map((post) => (<Post key={post.id} post={post} userId={userId} />))}</>;
}
