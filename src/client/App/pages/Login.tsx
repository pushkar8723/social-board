import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { withApollo, WithApolloClient } from 'react-apollo';
import styled from 'styled-components';
import Card from '../components/Card';
import { LOGIN_USER, GET_APP_STATE } from '../shared/queries';
import { IAppState } from '..';
import { WithPageProps } from '../components/Page';

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

interface ILoginProps {
    state: IAppState,
}

const Login = withApollo((props: WithApolloClient<ILoginProps>) => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const { client } = props;

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
            client.writeQuery({
                query: GET_APP_STATE,
                data: {
                    AppState: {
                        user: resp.data.loginUser,
                        idToken: user.tokenId,
                        __typename: 'AppState',
                    },
                },
            });
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

export default function (props: WithPageProps<{}>) {
    const { state } = props;
    return state.idToken ? <Redirect to={{ pathname: '/home' }} /> : <Login state={state} />;
}
