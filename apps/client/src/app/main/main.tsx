import { useQuery, gql } from '@apollo/client';
import { useCallback } from 'react';
import { Buffer } from 'buffer';
import { AppShell, Code, Group, Header, Text, useMantineTheme } from '@mantine/core';
import { Logo } from '../_logo';

const DATA = gql`
  query findAllUsers {
    findAllUsers {
      id
      createdAt
      updatedAt
      email
      password
    }
  }
`;

export const Main = () => {
  const theme = useMantineTheme();

  const getCookies = useCallback(() => {
    const keysValues = document.cookie.split('; ');
    const result: { [key: string]: string } = {};
    for (const keyValue of keysValues) {
      const [key, value] = keyValue.split('=');
      result[key] = value;
    }
    return result;
  }, []);

  const parseJwt = useCallback((token: string) => {
    const [, base64Payload] = token.split('.');
    const payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }, []);

  const { loading, error, data } = useQuery(DATA);

  return (
    <AppShell
      fixed
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position='apart'>
            <Logo colorScheme={theme.colorScheme} />
          </Group>
        </Header>
      }
    >

      {loading ? <p>Loading...</p> : error ? <p>Error :(</p> : <>
        <Text>Main...</Text>
        <Code>
          {JSON.stringify(
            parseJwt(getCookies()[process.env['NX_AUTH_COOKIE_NAME'] as string]),
            null, 2,
          )}
        </Code>;
        <br />;
        <br />;
        <Code>{JSON.stringify(data.findAllUsers, null, 2)}</Code>
      </>
      }

    </AppShell>
  );
};
