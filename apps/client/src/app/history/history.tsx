import {
  AppShell,
  Center,
  Code, Grid,
  Group,
  Header,
  Loader,
  Navbar,
  Pagination,
  Paper, Progress,
  Table,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';

const FIND_ALL_COMPARISON = gql`
  query (
    $limit: Int
    $skip: Int
  ) {
    findAllComparisons (
      limit: $limit
      skip: $skip
    ) {
      createdAt
      doneAt
      doneOn
      id
      projects {
        name
        creatorName
        files {
          id
        }
      }
    }
    getComparisonsCount
  }
`;

const ITEMS_ON_PAGE = 5;

export const History = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(FIND_ALL_COMPARISON, {
    variables: {
      skip: (parseInt(searchParams.get('page') || '1', 10) - 1) * parseInt(
        searchParams.get('limit') || ITEMS_ON_PAGE.toString(), 10,
      ),
      limit: parseInt(
        searchParams.get('limit') || ITEMS_ON_PAGE.toString(), 10,
      ),
    },
  });

  return <AppShell
    fixed
    navbar={
      <Navbar width={{ base: 250 }} p='xs'>
        <MainLinks />
      </Navbar>
    }
    header={
      <Header height={60}>
        <Group sx={{ height: '100%' }} px={20} position='apart'>
          <Logo colorScheme={theme.colorScheme} />
          <User parsedCookie={parsedCookie} />
        </Group>
      </Header>
    }
  >

    {loading ? <Loader /> : error ? <OopsPage /> : <>
      <Pagination
        page={parseInt(searchParams.get('page') || '1', 10)}
        total={Math.ceil(data.getComparisonsCount / parseInt(
          searchParams.get('limit') || ITEMS_ON_PAGE.toString(), 10,
        ))}
        onChange={(page) => {
          const params: { [key: string]: string } = {};
          searchParams.forEach((value, key) => params[key] = value);
          setSearchParams({ ...params, page: page.toString() });
        }}
        withControls={false}
        mb={'xs'}
      />

      {(data.findAllComparisons as any[])
        .map((data, index) => <Paper
          shadow='xs'
          p='md'
          key={index}
          onClick={() => navigate(data.id)}
          mb={'xs'}
        >
          <Grid grow>
            <Grid.Col span={8}>
              <Text size={'lg'} weight={500}>{`Comparison # ${data.id.slice(0, 8)}...`}</Text>
              <Progress value={data.doneOn * 100} />
              {data.doneOn === 1 ?
                <Code>{data.results}</Code> :
                <Text align={'center'} size={'lg'}>{'Processing...'}</Text>
              }
            </Grid.Col>
            <Grid.Col span={4}>
              <Center>
                <Text size={'sm'}>{data.createdAt}</Text> {/* todo .toISOString() SHOULD be Date */}
              </Center>
              {data.doneOn === 1 && <Center>
                <Text size={'sm'}>{data.doneAt}</Text>
              </Center>}
              <Table>
                <tbody>
                {data.projects.slice(0, 3).map((project: any) => (
                  <tr key={project.name}>
                    <td>{project.name}</td>
                    <td>{project.creatorName}</td>
                    <td style={{
                      textDecoration: 'underline',
                      color: theme.colors.blue[9]
                    }}
                    >{`${project.files.length} files`}</td>
                  </tr>
                ))}
                </tbody>
              </Table>
              <Center>{data.projects.length > 3 && '...'}</Center>
            </Grid.Col>
          </Grid>
        </Paper>)}

      <Pagination
        page={parseInt(searchParams.get('page') || '1', 10)}
        total={Math.ceil(data.getComparisonsCount / parseInt(
          searchParams.get('limit') || ITEMS_ON_PAGE.toString(), 10,
        ))}
        onChange={(page) => {
          const params: { [key: string]: string } = {};
          searchParams.forEach((value, key) => params[key] = value);
          setSearchParams({ ...params, page: page.toString() });
        }}
        withControls={false}
      />
    </>
    }

  </AppShell>;
};
