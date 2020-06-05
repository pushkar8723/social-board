import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withApollo, WithApolloClient } from 'react-apollo';
import { createGlobalStyle } from 'styled-components';
import Login from './pages/Login';
import MyPosts from './pages/MyPosts';
import Home from './pages/Home';
import Header from './components/Header';
import Page from './components/Page';

const GlobalStyle = createGlobalStyle`
    * {
        outline: none;
    }

    body {
        margin: 0;
        display: flex;
        background: linear-gradient(160deg, transparent 80vh, #F3F4F5 80vh, white 100vh),
            linear-gradient(to bottom, #F3F4F5 160px, white 50vh), white;
        color: rgba(0,0,0,0.7);
        min-height: 100vh;
    }

    a {
        color: #2283d2;
    }

    a:focus, a:hover {
        color: #ff9764;
    }

    #root {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 100%;
    }

    input:focus {
        box-shadow: 0 0 0 2px #64baff;
    }
`;

export interface IUserState {
    id: string;
    name: string;
    imageUrl: string;
    email: string;
}

export interface IAppState {
    user: IUserState;
    idToken: string;
}

function App(props: WithApolloClient<{}>) {
    const user = JSON.parse(localStorage.getItem('user'));
    const idToken = localStorage.getItem('idToken');
    const { client } = props;

    client.writeData({
        data: {
            AppState: {
                user,
                idToken,
                __typename: 'AppState',
            },
        },
    });

    return (
        <>
            <GlobalStyle />
            <Router>
                <Page component={Header} />
                <Switch>
                    <Route path="/my-posts">
                        <Page component={MyPosts} />
                    </Route>
                    <Route path="/login">
                        <Page component={Login} />
                    </Route>
                    <Route path="/">
                        <Page component={Home} />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default withApollo(App);
