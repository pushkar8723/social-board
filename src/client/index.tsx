import React from 'react';
import ReactDOM from 'react-dom';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import introspectionQueryResultData from '../generated/fragmentTypes.json';
import App from './App';


const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
});
const cache = new InMemoryCache({ fragmentMatcher });
const link = new HttpLink({
    uri: '/.netlify/functions/graphql',
});
const client = new ApolloClient({ cache, link });

ReactDOM.render(
    <ApolloProvider
        client={client}
    >
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);
