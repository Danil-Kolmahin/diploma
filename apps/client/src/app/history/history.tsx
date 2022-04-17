import {
  AppShell,
  Center,
  Grid,
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
import { Prism } from '@mantine/prism';

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
      results
    }
    getComparisonsCount
  }
`;

const ITEMS_ON_PAGE = 5;
const MAX_PRESENTATION_CODE_LEN = 70;

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
    pollInterval: 500,
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
          mb={'xs'}
        >
          <Grid grow>
            <Grid.Col span={8}>
              <Text size={'lg'} weight={500} onClick={() => navigate(data.id)}>
                {`Comparison # ${data.id.slice(0, 8)}...`}
              </Text>
              <Progress value={data.doneOn * 100} />
              {data.doneOn === 1 ?
                <Prism
                  language='json'
                  withLineNumbers
                  noCopy
                >
                  {(() => {
                    const code = JSON.stringify(
                      data.results,
                      (k, v) => {
                        const sumLen = k.toString().length + v.toString().length;
                        if (sumLen < MAX_PRESENTATION_CODE_LEN) return v;
                        if (k.toString().length > MAX_PRESENTATION_CODE_LEN - '...'.length) return '...';
                        return v.toString().slice(0, MAX_PRESENTATION_CODE_LEN - k.toString().length - '...'.length) + '...';
                      },
                      2,
                    );
                    return code.split('\n').slice(0, 4).join('\n') + ((code.split('\n').length > 4) ? '\n...' : '');
                  })()}
                </Prism> :
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
                      color: theme.colors.blue[9],
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
