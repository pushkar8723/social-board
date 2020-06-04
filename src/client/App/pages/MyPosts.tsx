import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, QueryResult } from 'react-apollo';
import styled from 'styled-components';
import { WithPageProps } from '../components/Page';
import PostsList from '../components/PostsList';
import CreatePost from '../components/CreatePost';
import { GET_POSTS } from '../shared/queries';

const Container = styled.div`
    max-width: 100%;
    width: 1000px;
    margin: 0 auto;
`;

export default function (props: WithPageProps<{}>) {
    const { state, logout } = props;
    return state.idToken
        ? (
            <Container>
                <Query
                    query={GET_POSTS}
                    context={{
                        headers: {
                            id_token: state.idToken,
                        },
                    }}
                    fetchPolicy="cache-first"
                >
                    {
                        ({ loading, error, data }: QueryResult) => {
                            if (loading) {
                                return <h4>Loading...</h4>;
                            }
                            if (error) {
                                error.graphQLErrors.forEach((err) => {
                                    if (err.extensions.code === 'UNAUTHENTICATED') {
                                        logout();
                                    }
                                });
                                return <div>{error.message}</div>;
                            }
                            if (data) {
                                return (
                                    <>
                                        <CreatePost idToken={state.idToken} />
                                        <PostsList
                                            posts={data.getPosts}
                                            idToken={state.idToken}
                                        />
                                    </>
                                );
                            }
                            return null;
                        }
                    }
                </Query>
            </Container>
        )
        : <Redirect to={{ pathname: '/' }} />;
}
