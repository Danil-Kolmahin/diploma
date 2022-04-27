import {
  ActionIcon,
  AppShell,
  Grid,
  Group,
  Header,
  Loader,
  Navbar,
  Paper,
  Text,
  useMantineTheme,
  JsonInput, Button, Switch,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';
import { Trash } from 'tabler-icons-react';
import { BASE_CHROMOSOME } from '@diploma-v2/common/constants-common';

const FIND_ALL_ROBOTS = gql`
  query {
    findAllRobots {
      body
      createdAt
      growable
      id
      name
      updatedAt
    }
  }
`;

const UPDATE_ROBOT = gql`
  mutation (
    $body: JSON
    $growable: Boolean
    $id: String!
    $name: String
  ) {
    updateRobot (
      body: $body
      growable: $growable
      id: $id
      name: $name
    ) {
      id
    }
  }
`;

const DELETE_ROBOT = gql`
  mutation (
    $id: String!
  ) {
    deleteRobot (
      id: $id
    )
  }
`;

const CREATE_ROBOT = gql`
  mutation (
    $body: JSON!
    $growable: Boolean!
    $name: String!
  ) {
    createRobot (
      body: $body
      growable:$growable
      name: $name
    ) {
      id
    }
  }
`;

const GET_RANDOM_MALE_NAME = gql`
  mutation {
    getRandomMaleName
  }
`;

export const Robots = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [robotContents, setRobotContents] = useState<string[]>([]);
  const [robotIsGrows, setRobotIsGrows] = useState<boolean[]>([]);
  const { loading, error, data, refetch } = useQuery(FIND_ALL_ROBOTS);
  const [updateRobot] = useMutation(UPDATE_ROBOT);
  const [deleteRobot] = useMutation(DELETE_ROBOT);
  const [createRobot] = useMutation(CREATE_ROBOT);
  const [getRandomMaleName] = useMutation(GET_RANDOM_MALE_NAME);

  useEffect(() => {
    data && setRobotContents(data.findAllRobots.map((robot: any) => robot.body));
    data && setRobotIsGrows(data.findAllRobots.map((robot: any) => robot.growable));
  }, [data]);

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
      {(data.findAllRobots as any[])
        .map((robot, index) => <Paper
          shadow='xs'
          p='md'
          key={index}
          mb={'xs'}
        >
          <Grid grow>
            <Grid.Col span={12}>
              <Text size={'lg'} weight={500}>
                {`${robot.name} - ${robot.id.slice(0, 8)}...`}
              </Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <JsonInput
                variant='filled'
                value={robotContents[index]}
                onChange={(value) => setRobotContents((prev) => {
                  prev[index] = value;
                  return prev;
                })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <ActionIcon
                color='red'
                variant='hover'
                disabled={data.findAllRobots.length <= 1}
                onClick={async () => {
                  await deleteRobot({
                    variables: { id: robot.id },
                  });
                  await refetch();
                }}
              >
                <Trash size={20} />
              </ActionIcon>
              <Switch
                label='Is growable'
                checked={robotIsGrows[index] || false}
                onChange={(event) => setRobotIsGrows((prev) => {
                  prev[index] = prev[index] ? !(event.target.value === 'on') : !(event.target.value === 'off');
                  return prev;
                })}
              />
              <Button onClick={async () => {
                await updateRobot({
                  variables: {
                    body: robotContents[index],
                    id: robot.id,
                  },
                });
                await refetch();
              }}>Submit</Button>
            </Grid.Col>
          </Grid>
        </Paper>)}
      <Button
        onClick={async () => {
          await createRobot({
            variables: {
              name: (await getRandomMaleName()).data.getRandomMaleName,
              body: JSON.stringify(BASE_CHROMOSOME),
              growable: true,
            },
          });
          await refetch();
        }}
      >
        Add one more
      </Button>
    </>
    }

  </AppShell>;
};
