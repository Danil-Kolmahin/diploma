import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './app/app';
import { Global, MantineProvider } from '@mantine/core';

const client = new ApolloClient({
  uri: `${process.env['NX_API_PROTOCOL']}://${process.env['NX_API_HOST']}:${process.env['NX_API_PORT']}/graphql?`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MantineProvider theme={{ colorScheme: 'dark' }}>
          <Global
            styles={(theme) => ({
              body: {
                height: '100%',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
              },
              height: '100%',
            })}
          />
          <App />
        </MantineProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root'),
);
