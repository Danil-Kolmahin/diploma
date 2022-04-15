import {
  AppShell, Group, Header, Navbar, useMantineTheme, Text,
  Button,
  MultiSelect,
  ActionIcon,
  Box, TextInput,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useRef, useState } from 'react';
import { Check, Files, Trash } from 'tabler-icons-react';
import { formList, useForm } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';

const renameFile = (originalFile: File, newName: string) => new File(
  [originalFile], newName, originalFile,
);

export const DeepAnalyze = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [isFileSearch, setIsFileSearch] = useState(true);

  const { showNotification, updateNotification } = useNotifications();

  const form = useForm({
    initialValues: {
      projects: formList<{ name: string, creatorName: string, files: File[] }>([
        { name: 'Project #1', creatorName: 'unknown', files: [] },
        { name: 'Project #2', creatorName: 'unknown', files: [] },
      ]),
    },
  });
  const refs = useRef([]);

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
    {/*<Grid justify='space-around'>*/}

    {/*  <Grid.Col span={6}><Center>*/}
    {/*    <Button>Compare</Button>*/}
    {/*  </Center></Grid.Col>*/}

    {/*  <Grid.Col span={6}><Center>*/}
    {/*    <Button>Add one more project to compare</Button>*/}
    {/*  </Center></Grid.Col>*/}

    {/*</Grid>*/}

    <Box mx='auto'>
      <Button
        onClick={() => console.log(form.values.projects)}
      >
        Compare
      </Button>

      <Button
        onClick={() => setIsFileSearch(!isFileSearch)}
      >
        {isFileSearch ? 'Search for folders' : 'Search for files'}
      </Button>

      {form.values.projects.length > 0 ? (
        <Group mb='xs'>
          <Text weight={500} size='sm' sx={{ flex: 1 }}>
            Name
          </Text>
          <Text weight={500} size='sm' pr={90}>
            Status
          </Text>
        </Group>
      ) : (
        <Text color='dimmed' align='center'>
          No one here...
        </Text>
      )}

      {form.values.projects.map((_, index) => (
        <Group key={index} mt='xs'>
          <TextInput
            placeholder='Project name'
            sx={{ flex: 1 }}
            {...form.getListInputProps('projects', index, 'name')}
          />
          <TextInput
            placeholder='Project creator'
            sx={{ flex: 1 }}
            {...form.getListInputProps('projects', index, 'creatorName')}
          />
          <input
            type='file'
            ref={(element) => {
              if (element !== null) {
                if (isFileSearch) {
                  (element as any).removeAttribute('directory');
                  (element as any).removeAttribute('webkitdirectory');
                } else {
                  (element as any).setAttribute('directory', '');
                  (element as any).setAttribute('webkitdirectory', '');
                }
              }
              return refs.current[index] = element as never;
            }}
            style={{ display: 'none' }}
            multiple
            onChange={async ({ target: { files } }) => {
              // showNotification({
              //   id: `inputFile${index}`,
              //   message: 'Loading...',
              // });
              form.setValues((prevState) => {
                if (!files || !files.length) return prevState;
                for (let i = 0; i < files.length; i++) {
                  let file = files[i];
                  if (prevState.projects[index].files.find(
                    ({ name }) => name === file.name,
                  )) {
                    let num = 1;
                    const findMore = (num: number) => prevState.projects[index].files.find(
                      ({ name }) => name === `${file.name} (${num})`,
                    );
                    while (findMore(num)) num++;
                    file = renameFile(file, `${file.name} (${num})`);
                  }
                  prevState.projects[index].files.push(file);
                }
                return prevState;
              });
              form.clearErrors();
              // updateNotification(`inputFile${index}`, {
              //   color: 'teal',
              //   message: 'Loading succeed!',
              //   icon: <Check />,
              //   autoClose: 1000,
              // });
            }}
          />
          <MultiSelect
            placeholder='Pick project files'
            clearable
            {...form.getListInputProps('projects', index, 'files')}
            data={form
              .getListInputProps('projects', index, 'files')
              .value.map(
                (file: File, i: number) => ({ value: file.name, label: file.name }),
              )
            }
            value={form
              .getListInputProps('projects', index, 'files')
              .value.map((file: File) => file.name)}
            icon={<Files />}
            onDropdownOpen={() => (refs as any).current[index].click()}
            style={{ maxWidth: '60%', minWidth: '30%' }}
          />
          <ActionIcon
            color='red'
            variant='hover'
            onClick={() => form.removeListItem('projects', index)}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      ))}

      <Group position='center' mt='md'>
        <Button onClick={() => form.addListItem('projects', {
          name: `Project #${form.values.projects.length + 1}`,
          creatorName: 'unknown',
          files: [],
        })}>
          Add project to compare
        </Button>
      </Group>
    </Box>

  </AppShell>;
};
