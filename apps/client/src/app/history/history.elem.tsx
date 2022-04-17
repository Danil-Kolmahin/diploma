import {
  AppShell,
  Code,
  Group,
  Header,
  Loader,
  Navbar,
  Paper,
  useMantineTheme,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';
import { useParams } from 'react-router-dom';

const FIND_COMPARISON_BY_ID = gql`
  query (
    $id: String!
  ) {
    findComparisonById (
      id: $id
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
  }
`;

export const HistoryElem = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const { id } = useParams();
  const { loading, error, data } = useQuery(FIND_COMPARISON_BY_ID, {
    variables: { id },
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
      <Paper
        shadow='xs'
        p='md'
      >
        <Code>{JSON.stringify(data, null, 2)}</Code>
      </Paper>
    </>
    }

  </AppShell>;
};
