import {
  AppShell,
  Center,
  Group,
  Header,
  Loader,
  Navbar,
  Paper,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';
import { useParams } from 'react-router-dom';
import { Prism } from '@mantine/prism';

const FIND_COMPARISON_BY_ID = gql`
  query (
    $id: String!
  ) {
    findComparisonById (
      id: $id
    ) {
      createdAt
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
    }
  }
`;

export const HistoryElem = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const { id } = useParams();
  const { loading, error, data } = useQuery(FIND_COMPARISON_BY_ID, {
    variables: { id },
    pollInterval: 250,
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

    {loading ? <Loader /> : error ? <OopsPage /> : <Paper
      shadow='xs'
      p='md'
    >
      <Center><Title order={3}>{data.findComparisonById.id}</Title></Center>
      <Prism
        language='json'
        withLineNumbers
        noCopy
      >
        {JSON.stringify(
          data.findComparisonById,
          (k, v) => k === '__typename' || k === 'id' ? undefined : v,
          2,
        )}
      </Prism>
    </Paper>
    }

  </AppShell>;
};
