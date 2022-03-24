import { useQuery, gql } from '@apollo/client';
import { useCallback } from 'react';
import { Buffer } from 'buffer';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <p>Main...</p>
      <code>
        {JSON.stringify(
          parseJwt(getCookies()[process.env['NX_AUTH_COOKIE_NAME'] as string]),
          null, 2,
        )}
      </code>
      <br />
      <br />
      <code>{JSON.stringify(data.findAllUsers, null, 2)}</code>
    </>
  );
};
