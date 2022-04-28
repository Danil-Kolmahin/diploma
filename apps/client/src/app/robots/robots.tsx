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
import React, { useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';
import { Trash } from 'tabler-icons-react';
import { BASE_CHROMOSOME } from '@diploma-v2/common/constants-common';
import { formList, useForm } from '@mantine/form';

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

type Robot = {
  name: string,
  growable: boolean,
  body: string,
  id: string,
}

export const Robots = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { robots: formList<Robot>([]) },
  });
  const { loading, error, data, refetch } = useQuery(FIND_ALL_ROBOTS);
  const [updateRobot] = useMutation(UPDATE_ROBOT);
  const [deleteRobot] = useMutation(DELETE_ROBOT);
  const [createRobot] = useMutation(CREATE_ROBOT);
  const [getRandomMaleName] = useMutation(GET_RANDOM_MALE_NAME);

  useEffect(() => {
    data && form.setValues((prev) => {
      prev.robots = data.findAllRobots.map((robot: Robot) => ({
        ...robot,
        body: JSON.stringify(robot.body, null, 2),
      }));
      return prev;
    });
    form.validate();
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
      {(data.findAllRobots as Robot[])
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
                {...form.getListInputProps('robots', index, 'body')}
                value={form.values.robots[index]?.body}
                onChange={(value) => {
                  form.setValues((prev) => {
                    prev.robots.forEach((robot: Robot, i: number) => {
                      if (index === i) prev.robots[i] = {
                        ...robot,
                        body: value,
                      };
                    });
                    return prev;
                  });
                  form.validate();
                }}
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
                {...form.getListInputProps('robots', index, 'growable')}
                checked={form.values.robots[index]?.growable || false}
                onChange={(event) => {
                  const nextValue = form.values.robots[index].growable
                    ? !(event.target.value === 'on')
                    : !(event.target.value === 'off');
                  form.setValues((prev) => {
                    prev.robots.forEach((robot: Robot, i: number) => {
                      if (index === i) prev.robots[i] = {
                        ...robot,
                        growable: nextValue,
                      };
                    });
                    return prev;
                  });
                  form.validate();
                }}
              />
              <Button onClick={async () => {
                await updateRobot({
                  variables: { ...form.values.robots[index] },
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
        Update
      </Button>
    </>
    }

  </AppShell>;
};
