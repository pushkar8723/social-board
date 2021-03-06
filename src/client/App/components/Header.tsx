import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { WithPageProps } from './Page';

const Toolbar = styled.div`
    padding: 10px;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;

    & > span {
        font-size: 32px;
    }

    & a {
        padding-right: 10px;
        text-decoration: none;
    }
`;

const TextContainer = styled.div`
    flex: 1;
    font-size: 16px;
    padding-left: 10px;
`;

const Button = styled.button`
    color: #2283d2;
    background-color: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;

    &:focus, &:hover {
        color: #ff9764;
    }
`;

export default function (props: WithPageProps<{}>) {
    const { state, logout } = props;
    return (
        <Toolbar>
            <span role="img" aria-label="Icon">📝</span>
            <TextContainer>
                <Link to="/">All Posts</Link>
                { state.idToken && <Link to="/my-posts">My Posts</Link> }
            </TextContainer>
            {
                state.idToken
                    ? <Button onClick={logout}>Logout</Button>
                    : <Link to="/login">Login</Link>
            }
        </Toolbar>
    );
}
