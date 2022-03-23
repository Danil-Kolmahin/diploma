import { useQuery, gql } from '@apollo/client';

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
  const { loading, error, data } = useQuery(DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <p>Main...</p>
      {data.findAllUsers.map(
        (data: unknown, i: number) =>  <div key={i}><br/><code>
          {JSON.stringify(data, null, 2)}
        </code></div>,
      )}
    </>
  );
};
