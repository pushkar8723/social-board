import React from 'react';
import styled from 'styled-components';

const Toolbar = styled.div`
    padding: 10px;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    font-size: 32px;
    display: flex;
    align-items: center;
    background: #fff;
`;

const TextContainer = styled.div`
    flex: 1;
`;

const Button = styled.div`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

interface IToolbarProps {
    logout: () => void
}

export default function (props: IToolbarProps) {
    const { logout } = props;

    return (
        <Toolbar>
            <TextContainer>
                <span role="img" aria-label="Icon">📝</span>
                Social Board
            </TextContainer>
            <Button onClick={logout}>
                Logout
            </Button>
        </Toolbar>
    );
}
