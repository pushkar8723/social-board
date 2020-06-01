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

    const LOGIN_USER = gql`
        mutation LoginUser($idToken: String!) {
            loginUser(idToken: $idToken) {
                id
                name
                email
                imageUrl
            }
        }
    `;

    const loginUser = async (user: GoogleLoginResponse) => {
        setLoading(true);
        const resp = await props.client.mutate({
            mutation: LOGIN_USER,
            variables: {
                idToken: user.tokenId,
            },
        });
        setLoading(false);
        if (resp.data.loginUser) {
            localStorage.setItem('user', JSON.stringify(resp.data.loginUser));
            localStorage.setItem('idToken', user.tokenId);
            props.state.setIdToken(user.tokenId);
            props.state.setUser(resp.data.loginUser);
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
            </LoginBox>
            <div>{error}</div>
        </Container>
    );
});

export default function () {
    return (
        <AppStateConsumer>
            {(state) => (state.idToken ? <Redirect to={{ pathname: '/home' }} /> : <Login state={state} />)}
        </AppStateConsumer>
    );
}
