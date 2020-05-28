import React, { useState } from 'react';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import styled from 'styled-components';
import { AppStateConsumer, IAppState } from '../index';
import Card from '../components/Card';

interface IHomeProps {
    state: IAppState
}

const Container = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const LoginBox = styled(Card)`
    text-align: center;
    height: 280px;
    width: 280px;
    margin: 0 auto;
    display: flex;
`;

const Header = styled.h1`
    margin-top: -60px;
    margin-bottom: 0;

    & span {
        font-size: 72px;
    }
`;

const InfoDiv = styled.div`
    flex: 1;
    border-bottom: 1px solid #EEE;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Login = withApollo((props: WithApolloClient<IHomeProps>) => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const QUERY_USER_DATA = gql`
        query($email: String) {
            getUser(email: $email) {
                id
                name
                imageUrl
            }
        }
    `;

    const CREATE_USER = gql`
        mutation($data: createUserInput) {
            createUser(data: $data) {
                id
                name
                imageUrl
            }
        }
    `;

    const loginUser = async (user: GoogleLoginResponse) => {
        setLoading(true);
        const resp = await props.client.query({
            query: QUERY_USER_DATA,
            variables: {
                email: user.profileObj.email,
            },
        });
        if (resp.data.getUser === null) {
            const createResp = await props.client.mutate({
                mutation: CREATE_USER,
                variables: {
                    data: {
                        name: user.profileObj.name,
                        email: user.profileObj.email,
                        imageUrl: user.profileObj.imageUrl,
                    },
                },
            });
            setLoading(false);
            localStorage.setItem('user', JSON.stringify(createResp.data.createUser));
            props.state.setUser(createResp.data.createUser);
        } else {
            setLoading(false);
            localStorage.setItem('user', JSON.stringify(resp.data.getUser));
            props.state.setUser(resp.data.getUser);
        }
    };

    return (
        <Container>
            <LoginBox>
                <Header>
                    <span role="img" aria-label="Icon">📝</span>
                    <br />
                    Welcome
                </Header>
                <InfoDiv>
                    <div>
                        Login using your Google Account
                    </div>
                </InfoDiv>
                <GoogleLogin
                    clientId="957313973766-ujkie3ontc49iuu7cbvva4jr56t3h3qe.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={loginUser}
                    onFailure={setError}
                    disabled={loading}
                />
                <div>{error}</div>
            </LoginBox>
        </Container>
    );
});

export default function () {
    return (
        <AppStateConsumer>
            {(state) => (state.user ? <Redirect to={{ pathname: '/home' }} /> : <Login state={state} />)}
        </AppStateConsumer>
    );
}
