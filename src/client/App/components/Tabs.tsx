import React, { useState, Children, PropsWithChildren } from 'react';
import styled from 'styled-components';

const Button = styled.button<{ active: boolean }>`
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 3px 3px 0 0;
    border-bottom: ${(props) => (props.active ? '3px solid #2283d2' : 'none')};
    color: ${(props) => (props.active ? '#2283d2' : '#000')};
    cursor: pointer;

    &:hover, &:focus {
        background-color: rgba(100, 186, 255, 0.2);
        border-bottom: ${(props) => (props.active ? '3px solid #2283d2' : '3px solid rgba(100, 186, 255, 0.2)')};
    }
`;

const ButtonContainer = styled.div`
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
`;

const TabBody = styled.div`
    min-height: 150px;
`;

export const Tab = (props: PropsWithChildren<{name: string}>) => {
    const { children } = props;
    return <>{children}</>;
};

export function Tabs(props: PropsWithChildren<any>) {
    const [active, setActive] = useState(0);
    const switchTab = (index: number) => () => setActive(index);
    const { children } = props;

    return (
        <>
            <ButtonContainer>
                {
                    Children.map(children, (child, index) => (
                        <Button
                            type="button"
                            active={active === index}
                            onClick={switchTab(index)}
                        >
                            {child.props.name}
                        </Button>
                    ))
                }
            </ButtonContainer>
            <TabBody>
                {children[active]}
            </TabBody>
        </>
    );
}
