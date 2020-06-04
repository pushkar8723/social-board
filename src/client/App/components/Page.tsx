import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { IAppState } from '..';
import { GET_APP_STATE } from '../shared/queries';

interface IPageProps<T> {
    component: any,
    props?: T
}

export type WithPageProps<T> = T & {
    state: IAppState,
    logout: () => void,
}

function Page<T>({ component, props }: IPageProps<T>) {
    return (
        <Query query={GET_APP_STATE}>
            {
                ({ data, client }: QueryResult<{ AppState: IAppState }>) => {
                    const logout = () => {
                        localStorage.removeItem('idToken');
                        localStorage.removeItem('user');
                        client.writeQuery({
                            query: GET_APP_STATE,
                            data: {
                                AppState: {
                                    user: null,
                                    idToken: null,
                                    __typename: 'AppState',
                                },
                            },
                        });
                    };

                    const Component = component;

                    return (<Component state={data.AppState} logout={logout} {...props} />);
                }
            }
        </Query>
    );
}

export default Page;
