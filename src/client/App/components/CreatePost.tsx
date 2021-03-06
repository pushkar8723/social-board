import React, { useState, FormEvent } from 'react';
import { Mutation, MutationUpdaterFn, MutationFn } from 'react-apollo';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import Card from './Card';
import { GET_POSTS, GET_ALL_POSTS, CREATE_POST } from '../shared/queries';
import {
    Post, User, Article,
    Image, Link,
} from '../../../generated/types.d';
import { Tabs, Tab } from './Tabs';

const Title = styled.h3`
    margin: 10px 0;
    display: flex;
`;

const TextContainer = styled.div`
    flex: 1;
`;

const Select = styled.select`
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    height: 30px;
    min-width: 100px;
    font-size: 14px;

    &:focus {
        box-shadow: 0 0 0 3px #64baff;
        border: 1px solid #2283d2;
    }
`;

const Input = styled.input`
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    padding: 3px 10px;

    &:focus {
        box-shadow: 0 0 0 3px #64baff;
        border: 1px solid #2283d2;
    }

    &:focus:invalid {
        box-shadow: 0 0 0 3px #e62e2e;
        border: 1px solid #e62e2e;
    }
`;

const TextArea = styled.textarea`
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    padding: 10px;
    min-height: 100px;

    &:focus {
        box-shadow: 0 0 0 3px #64baff;
        border: 1px solid #2283d2;
    }

    &:focus:invalid {
        box-shadow: 0 0 0 3px #e62e2e;
        border: 1px solid #e62e2e;
    }
`;

const Label = styled.label`
    font-size: 12px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    & span {
        margin: 0 auto -10px 7px;
        background: #fff;
        padding: 3px;
        z-index: 1;
    }

    &>input:required ~ &>span::after {
        content: "*";
    }

    &:focus-within {
        color: #2283d2;
    }
`;

const SubmitButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const SubmitBtn = styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    cursor: pointer;
    background-color: #fff;

    &:focus {
        border: 1px solid #2283d2;
        box-shadow: 0 0 0 3px #64baff;
    }
`;

interface ICreatePost {
    idToken: String,
    user: User,
}

export default function (props: ICreatePost) {
    const [type, setType] = useState('Article');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const { idToken } = props;

    const reset = () => {
        setTitle('');
        setDescription('');
        setUrl('');
        setImageUrl('');
    };

    const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        reset();
    };

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const onImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
    };

    const onSumbit = (submitFn: MutationFn<{ createPost: Post}>) => (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setLoading(true);
        const response: Article | Image | Link = {
            id: '12345678',
            title,
            description,
            url,
            imageUrl,
            user: {
                ...props.user,
                id: 'dummyId',
                email: null,
            },
        };
        switch (type) {
        case 'Article':
            response.__typename = 'Article';
            break;

        case 'Image':
            response.__typename = 'Image';
            break;

        default:
            response.__typename = 'Image';
        }
        submitFn({
            variables: {
                type, title, description, url, imageUrl,
            },
            optimisticResponse: {
                createPost: response,
            },
        });
    };

    const cacheUpdateFn:
    MutationUpdaterFn<{ createPost: Post }> = (cache, { data: { createPost } }) => {
        try {
            const { getPosts } = cache.readQuery({ query: GET_POSTS });
            const updatedPosts = [
                createPost,
                ...getPosts,
            ];
            cache.writeQuery({
                query: GET_POSTS,
                data: { getPosts: updatedPosts },
            });
        } catch (e) {
            // Ignore
        }

        try {
            const { getAllPosts } = cache.readQuery({ query: GET_ALL_POSTS });
            const updatedALLPosts = [
                createPost,
                ...getAllPosts,
            ];
            cache.writeQuery({
                query: GET_ALL_POSTS,
                data: { getAllPosts: updatedALLPosts },
            });
        } catch (e) {
            // Ignore
        }
        reset();
        setLoading(false);
    };

    return (
        <Mutation<{ createPost: Post}>
            context={{
                headers: {
                    id_token: idToken,
                },
            }}
            update={cacheUpdateFn}
            mutation={CREATE_POST}
        >
            {(addPost) => (
                <Card>
                    <form onSubmit={onSumbit(addPost)}>
                        <Title>
                            <TextContainer>
                                Create Post
                            </TextContainer>
                            <Select value={type} onChange={onTypeChange}>
                                <option>Article</option>
                                <option>Link</option>
                                <option>Image</option>
                            </Select>
                        </Title>
                        <div>
                            <Label>
                                <span>Title</span>
                                <Input required value={title} onChange={onTitleChange} />
                            </Label>
                            {
                                type === 'Article' && (
                                    <>
                                        <Tabs>
                                            <Tab name="Write">
                                                <Label>
                                                    <span>Description</span>
                                                    <TextArea
                                                        required
                                                        value={description}
                                                        onChange={onDescriptionChange}
                                                    />
                                                </Label>
                                            </Tab>
                                            <Tab name="Preview">
                                                <Markdown>{description}</Markdown>
                                            </Tab>
                                        </Tabs>
                                    </>
                                )
                            }
                            {
                                type === 'Link' && (
                                    <Label>
                                        <span>URL</span>
                                        <Input required type="url" value={url} onChange={onUrlChange} />
                                    </Label>
                                )
                            }
                            {
                                type === 'Image' && (
                                    <Label>
                                        <span>Image URL</span>
                                        <Input required type="url" value={imageUrl} onChange={onImageUrlChange} />
                                    </Label>
                                )
                            }
                        </div>
                        <SubmitButtonContainer>
                            <SubmitBtn disabled={loading}>SUBMIT</SubmitBtn>
                        </SubmitButtonContainer>
                    </form>
                </Card>
            )}
        </Mutation>
    );
}
