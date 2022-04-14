import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './app/app';
import { createUploadLink } from 'apollo-upload-client';

const client = new ApolloClient({
  link: createUploadLink({
    uri: `${process.env['NX_API_PROTOCOL']}://${process.env['NX_API_HOST']}:${process.env['NX_API_PORT']}/graphql`,
    fetchOptions: { credentials: 'include' },
  }),
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
