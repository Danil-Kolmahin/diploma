import {
  AppShell,
  Code,
  Group,
  Header,
  Loader,
  Navbar,
  Pagination,
  Paper,
  useMantineTheme,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
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
      createdBy {
        email
      }
      doneAt
      doneOn
      fileTypes
      id
      projects {
        name
        creatorName
        files {
          filename
          byteLength
        }
      }
      updatedAt
    }
    getComparisonsCount
  }
`;

const ITEMS_ON_PAGE = 5;

export const History = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();
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
      />

      {(data
        .findAllComparisons as any[]).map((data, index) => <Paper
        shadow='xs'
        p='md'
        key={index}
      >
        <Code>{JSON.stringify(data, null, 2)}</Code>
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
