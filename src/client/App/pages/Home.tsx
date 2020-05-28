import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, QueryResult } from 'react-apollo';
import styled from 'styled-components';
import { AppStateConsumer, IAppState } from '../index';
import Header from '../components/Header';
import PostsList from '../components/PostsList';
import CreatePost from '../components/CreatePost';
import { GET_POSTS } from '../shared/queries';

const Container = styled.div`
    max-width: 100%;
    width: 1000px;
    margin: 0 auto;
`;

export default function () {
    const logout = (state: IAppState) => () => {
        localStorage.removeItem('user');
        state.setUser(null);
    };

    return (
        <AppStateConsumer>
            {(state: IAppState) => (state.user ? (
                <>
                    <Header logout={logout(state)} />
                    <Container>
                        <Query
                            query={GET_POSTS}
                            context={{
                                headers: {
                                    user_id: state.user.id,
                                },
                            }}
                        >
                            {
                                ({ loading, error, data }: QueryResult) => {
                                    if (loading) {
                                        return <div>...loading</div>;
                                    }
                                    if (error) {
                                        return <div>error!</div>;
                                    }
                                    if (data) {
                                        return (
                                            <>
                                                <CreatePost userId={state.user.id} />
                                                <PostsList
                                                    posts={data.getPosts}
                                                    userId={state.user.id}
                                                />
                                            </>
                                        );
                                    }
                                    return null;
                                }
                            }
                        </Query>
                    </Container>
                </>
            ) : <Redirect to={{ pathname: '/' }} />)}
        </AppStateConsumer>
    );
}
