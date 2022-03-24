import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './app/app';

const client = new ApolloClient({
  uri: `${process.env['NX_API_PROTOCOL']}://${process.env['NX_API_HOST']}:${process.env['NX_API_PORT']}/graphql?`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root'),
);
